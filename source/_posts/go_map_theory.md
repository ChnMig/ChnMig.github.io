---
title: Golang map 的底层原理
date: 2022-02-10            
updated: 2022-02-10         
comments: true              
toc: true                   
excerpt: 大致讲解一下 golang 中 map 的实现...
tags:                       
- Golang
categories:                 
- 编程

---

## 前言

本文介绍 golang 中 map 的实现方式, 希望对读者和我有所帮助

## 结构

`map`是 go 语言中的基础的数据结构, 在寻找指定`key`时, 复杂度是`O(1)`, 在某些场景能发挥很大的作用

golang 的 map 是 hashmap, 实现方式是**数组+链表**, 并且使用**拉链法**来取消 hash 的冲突

map 主要有两个核心的数据结构, `hmap`和`bmap(bucket)`, 为什么说他核心呢? 因为 map 的实现就是依靠这两个结构体



`hmap`的结构有以下几个字段

- 元素个数: int
- flags: uint8
- 扩容字段: uint8
- 溢出的 bucket 数量: uint16
- 用于扩容的指针: *mapextra
- buckets **数组**指针: unsafa.Pointer
- 搬迁进度: uintptr
- 扩容时用于复制的 buckets 数组: unsafe.Pointer
- hash seed: uint32

这里你需要重点了解的是`buckets 数组指针`,  也就是`bmap`, 那么`bmap`的结构如下

- 高位哈希: [8]uint8
- 字节数组(存储 key 和 value 的数组): []bytes
- 指向扩容 bucket 的指针: pointer

在`bmap`的**字节数组**中, 存储了我们真正的`key`和`value`

而**高位哈希**中存储了`key`的索引

**指向扩容 bucket 的指针**则存储了下一个`bmap`的位置, 所以说 bucket 是链表形式

对于`bmap`中的字节数组部分存储这个`bmap`里面的所有`key`和`value`, 他是一个数组, 里面存储的结构是这样的

``` bash
key0, key1, key2, value0, value1, value2
```

是将所有的 `key`和`key`排在一起,`value`和`value`排在一起

这是为了**内存对齐**, 目的是减少空间浪费

也就是说, `hmap`的结构应该是

``` bash
																	hmap
																	
bmap0															bmap1																bmap2
|																	|																		|
bmap3															bmap4																bmap5
|																	|																		|
```

这种关系(我真是灵魂画手:kissing_heart:)

大致理解一下, 就是一个`hmap`里面包含了一个切片, 切片的每一个元素是`bmap`, 而每一个`bmap`里含有这个`bmap`的`key`和`value`(多个), 还有下一个`bmap`的指针地址

## 新增 key 时

当新增一个`key`和`value`时, 会先对这个`key`进行哈希函数计算, 得到一个唯一的值, 是一个数字, 将这个数字切分为两个部分`高位`和`低位`, 使用`低位`寻找这个`key`应该存储到哪个`bmap`中, `高位`则记录了这个`key`在`bmap`的位置

## map 扩容

当 map 空间不够时, 会将`bmap`的数组数量扩充一倍, 产生一个新的`bmap`数组

然后把老的数据迁移到新的数组中

这个转移并不是立刻完成的, 而是当访问到具体的某个`bmap`的时候, 才会把这个`bmap`中的数据转移到新的数组

而且, 将老的`bmap`转移到新的列表之后, 并不会将老的`bmap`删除, 而是留给 GC 去清理

## 查找 key 时

获取需要查找的`key`, 转成数字并切分为`高位`和`低位`, 通过`低位`定位`bmap`位置. 通过`高位`在`bmap`中寻找具体的值





















































