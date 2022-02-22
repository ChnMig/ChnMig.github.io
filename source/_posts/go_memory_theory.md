---
title: Golang 内存分配
date: 2022-02-20            
updated: 2022-02-20         
comments: true              
toc: true                   
excerpt: golang 如何分配内存?
tags:                       
- Golang
- 源码
categories:                 
- 编程
---

## 一般的内存分配

一般而言, 内存都会被程序分为以下几个逻辑块

- 全局区: 存放全局变量
- 栈区: 存放函数中的基础类类型变量
- 堆区: 动态分配的内存, 比如 go 的切片
- 常量区: 存放常量数据
- 程序代码区: 存放程序本身的代码

## go 内存分配思想

go 内置了运行时的编程语言(runtime), 所谓运行时, 就是在程序开始时就申请了一大块的虚拟内存, 由 go 自己进行分配和管理. 用来避免在运行的时候再向操作系统申请内存, 带来性能问题.

go 的内存分配核心思想是:

- 每次从操作系统申请一大块内存, 由 go 来对内存进行分配和管理, 减少系统调用
- 内存分配算法采用 google 的 `TCMalloc` 算法, 把内存切分的很细, 再通过多级进行管理, 降低锁粒度
- 回收对象内存时, 并不是真正的将内存返回给操作系统, 而是放回自己的大块内存中等待复用, 只有闲置过多时才会尝试返回部分内存给操作系统.

## go 的内存结构

go 的内存结构分为三大块:

- spans(512MB): 存放 span 指针, 每个指针指向 arena 的一个 page
- bitmap(16GB): 保存 arena 对应的某个地址是否存在对象, 和对象是否 GC 信息
- arena(512GB): 真正存放值的地方, area 按照8KB 分配若干个 page

### arena

arena 存放了真正的值, 很多人也把他称之为`heap`, heap 从两个角度来看, 有两种说法

- 从内存分配角度: 按照 8KB 分配若干个 page, page合在一起组成了 heap
- 从使用角度: heap 存放若干个对象

### spans

spans 可以理解为 heap 的户口信息, 用来管理 heap 区域的数据, spans 存放的是`mspan`指针, 每个 page都属于某个`mspan`

### bitmap

bitmap存放了 arena 中的对象标记, 比如标记对应的地址中是否存在对象, 是否被 GC 标记

因此, bitmap 主要还是为了服务 GC

## go 内存管理组件

go 内存管理组件有以下几个:

- mspan: 内存管理基本单元, 管理
- mcache: 缓存, 每个运行时的 goroutine 都会绑定一个 mcache, mcache 会分配这个 goroutine 运行时需要的内存空间(mspan)
- mcentral: 为所有 mcache 切分好后备的 mspan, 收集给定大小和登记的所有 span
- mheap代表Go程序持有的所有堆空间。还会管理闲置的span，需要时向操作系统申请新内存

### mspan

上面提到了名词`mspan`, mspan 可以说是 go 内存管理的基本单元, 而 page 是内存存储的基本单元

mspan 可以解决内存碎片问题, 我们知道, 内存的地址都是连到一起的, 连续的,  举个例子, 同一时间申请了两个内存, a 和 b, a 和 b 是连续的, 两者在内存中是挨着的, 此时 b 被清理了, b 的地址内数据变成空, 此时申请存放新的数据, 并不会检测到 b 是空了就直接放到 b, 而是会在 b 后面申请 c, 这就造成了在内存中很可能有很多空位, 这就是**内存碎片**

go 为了解决内存碎片问题. 将内存分为67种, 每种有不同数量的 page, 这每一种就是 mspan.每次分配时, 根据数据的不同, 分配给不同的 mspan. 当某个 mspan 被清理后, 在语言内部将这个标记为已清理, 等待下一次重新使用

### mchahe

为了避免多线程申请内存时不断的加锁, goroutine为每个线程分配了 span 内存块的缓存, 这个缓存即是 mcache, 每个goroutine都会绑定的一个 mcache, 避免了各个goroutine申请内存时存在锁竞争的情况

在 GMP 并发调度模型中, 每个 G 都绑定一个 mcache, 因此不会出现大家一起占用一个内存, 导致需要加锁竞争的情况, 提高速度

### mcentral

mcentral保存一种特定类型的全局 mspan 列表，包括已分配出去的和未分配出去的, 目的是为所有 mcache 提供切分好的 mspan

有67种 mspan, 也就有67种 mcentral

每个 mcentral 都会包含两个 mspan的列表：

- 没有空闲对象或 mspan已经被 mcache缓存的 mspan列表
- 有空闲对象的 mspan列表

由于 mspan是全局的，会被所有的 mcache访问，所以会出现并发性问题，因而 mcentral会存在一个锁。

### mheap

mheap可以认为是Go程序持有的整个堆空间， mheap全局唯一，可以认为是个全局变量

mheap 包含了整个 go 内部的 heap 数据信息, 除了 mcache, mcache被包含在GMP 中的 G 里

因为有些对象通过 mheap 分配(大于32kb), 而 mheap 全局唯一, 而 mcache有时候需要进行申请内存分配, 因为 GMP 中 G 不止一个, 所以为了防止资源竞争, 在 mheap 中有一个互斥锁, 保证同一时刻只有一个 G 可以申请内存





























