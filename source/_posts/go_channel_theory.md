---
title: Golang Channel 实现原理
date: 2022-02-13            
updated: 2022-02-13         
comments: true              
toc: true                   
excerpt: 面试的准备之一
tags:                       
- Golang
categories:                 
- 编程
---

## 前言 

最近真高产啊, 果然有压力就有动力了, 不知道能保持多久, 真是痛并快乐着

## 什么是 Channel

`channel`常用来作为多个协程直接通信, 在真正编写代码中使用频率非常高, 他就是一个管道, 先进先出, 那么, 作为程序员, 有必要了解`channel`的实现原理

## 数据结构

那么, 和往常一样, 还是从数据结构开始看起

``` go
type hchan struct {
	qcount   uint           // 当前队列中剩余元素个数
	dataqsiz uint           // 环形队列长度，即可以存放的元素个数
	buf      unsafe.Pointer // 环形队列指针
	elemsize uint16         // 每个元素的大小
	closed   uint32	        // 标识关闭状态
	elemtype *_type         // 元素类型
	sendx    uint           // 队列下标，指示元素写入时存放到队列中的位置
	recvx    uint           // 队列下标，指示元素从队列的该位置读出
	recvq    waitq          // 等待读消息的goroutine队列
	sendq    waitq          // 等待写消息的goroutine队列
	lock mutex              // 互斥锁，chan不允许并发读写
}
```

## 环形队列

chan 内部实现了一个环形队列作为缓冲区, 你指定的缓冲区的长度就是这个环形队列的长度

比如`make(chan int, 6)`, 在多次进行操作之后, 他的数据可能是

``` go
{
  qcount: 2,  // 代表队列中还有2个元素
  dataqsiz: 6,  // 代表队列长度(缓冲区)为6
  buf: [0, 1, 1, 0, 0, 0],  // 真正的数据, 假设两个数据都是1
  sendx: 3,  // 后续需要增加数据时, 从 buf 索引3开始
  recvx: 1,  // 需要读取数据是, 从 buf 索引1开始
}
```

## 等待队列

我们知道, 如果缓冲区已满或者没有消费者获取数据时, 向 channel 写入数据会阻塞

我们也知道, 如果缓冲区已空或者没有生产者生产数据时, 从 channel 获取数据也会阻塞

对于一个 channel 来讲, 其生产者和消费者的 goroutine 存储在 hchan 的`recvq`和`sendq`中

- `recvq`: 等待从 channel 读取数据的 goroutine
- `sendq`: 等待向 channel 写入数据的 goroutine

他们是互相唤醒的, 比如

- 当 goroutine 向 channel 写入数据时, 会唤醒`recvq`里的 goroutine
- 当 goroutine 从 channel 读取数据是, 会唤醒`sendq`里的 goroutine

一般情况下 `recvq`和`sendq`至少有一个为空, 也就是说一般情况下不可能存在既有向 channel 写入数据的 goroutine 等待, 又有从 channel 获取数据的 goroutine 等待. 除非在同一个 goroutine 中使用 `select`向 channel 一边写一边读

## 类型信息

在 channel 中, make 的时候就必须设定这个 channel 中存储的值的类型, 对应的字段如下

- `elemtype` 每个元素的类型
- `elemsize` 类型的大小, 主要用来在 buf 里定位元素

## 锁

channel 内部实际上有一个互斥锁来保证同时仅允许被一个 goroutine 进行操作, 关于互斥锁原理可以查看我的博客, 这里不多赘述

锁在`hchan`的字段是 `lock`

## 创建 channel

创建 channel 使用 make, 例如`make(chan int, 6)`, 在 make 时, 就确定了 hchan 的`buf/elemsize/elemtype/dadaqsize`字段

## 写数据

向 channel 中写入数据的简单过程如下:

1. 判断`recvq`是否为空, 不为空则代表有 goroutine 在等待读数据, 也就是说缓冲区中没有数据了或者没有缓冲区, 此时会直接从`recvq`中取出 goroutine, 直接把 goroutine 唤醒并且将数据写入, 结束写入过程
2. 如果`recvq`为空,  代表此时没有 goroutine 在读数据, 此时, 如果 channel 中有缓冲区且缓冲区中有空余位置, 则直接将数据写入缓冲区, 结束过程
3. 如果 channel 缓冲区已满或者没有缓冲区时, 将等待发送的数据写入当前 goroutine 中, 同时将当前 goroutine 加入到`sendq`, 等待被读取的`goroutine`唤醒

## 读数据

读数据与写数据类似, 过程如下:

1. 判断`sendq`是否为空, 不为空则代表有 goroutine 在等待写数据, 此时判断缓冲区是否有值, 如果缓冲区有数据, 则从缓冲区首部(`recvx`)读取一个数据, 同时唤醒`sendq`中的等待写入 goroutine, 通知其写入数据, 结束流程
2. 如果没有缓冲区, 则从`senq`中获取等待发送数据的 goroutine, 获取数据并唤醒这个 goroutine, 结束流程
3. 如果当前`sendq`为空且缓冲区为空, 代表此时没有数据, 这时将 goroutine 加入到`recvq`中, 等待被写 goroutine 唤醒

## 关闭

关闭 channel 会把`recvq`中的 goroutine 全部唤醒, 然后将里面存储的数据设置为 nil. 然后将`senq`中的 goroutine 全部唤醒, 但是这些 goroutine 会导致 panic, 所以必须要确保这个 channel 在写入时都是开启的状态


