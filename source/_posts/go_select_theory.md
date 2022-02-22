---
title: go select 原理解析
date: 2022-02-22            
updated: 2022-02-22        
comments: true              
toc: true                   
excerpt: go 的 select 是怎么运作的? 本篇大致总结
tags:                       
- Golang
- 源码
categories:                 
- 编程
---

## 概述

go 的 `select` 语句是专门为了 channel 发送和接收消息而诞生的专用语句(不要和 `switch` 搞混了), 在语句的运行期间, 该  goroutine 是阻塞的.

select 在 golang 的语言层提供了`I/O 多路复用`, 可以同时检测多个 channel

## I/O 多路复用

有必要了解一下 I/O 多路复用概念

在不使用 select 时, 如果要监听 N 个 channel. 对于普通的多线程处理, 可能需要启动 N 个 goroutine, 每个 goroutine 监听一个 channel, 这样的缺点显而易见: 系统需要额外的创建和维护goroutine, 因为大多数时候, channel 都会阻塞, 只有少部分会接受到数据

而使用 select 时, 可以做到在一个 goroutine 里监听多个 channel, 系统只需要维护一个 goroutine, N 个 channel 都依靠这一个 goroutine 进行数据的"运输", 当其中某一个 channel 有数据时, 根据对应的 channel 走不同的流程,  无需对额外的 goroutine 进行管理, 无疑提高了效率

当然, select 也不要无节制的使用, 最好是在逻辑上有一定的关联性, 否则会破坏代码的可读性.

## demo

举个例子

``` go
func main() {
	ch1 := make(chan int, 1)
	ch2 := make(chan int, 1)
	select {
	case v := <-ch1:
		// 如果ch1通道成功读取数据，则执行该case处理语句
		fmt.Printf("ch1 = %v", v)
	case v := <-ch2:
		// 如果ch2通道成功读取数据，则执行该case处理语句
		fmt.Printf("ch2 = %v", v)
	default:
		// 如果上面case都没有成功，则进入default处理流程
		// 如果没有 default, 会一直阻塞等待某个 case 成功
		fmt.Println("default!")
	}
}
```

注意两个问题:

1. select 并不是一个循环, 如果你需要反复的监听多个 channel, 搭配 `for{}`使用
2. default 作用是当 case 都不成功时, 立刻进入 default 流程, 结束 select, 如果你需要阻塞住, 就不要使用 default
3. 当搭配`for{}`反复的执行 slelct 时, 如非业务要求, 否则不要使用 default, 会造成select 立即退出后重新循环

所以, 常用的方式如下

``` go
for {
  select {
    case v := <-ch1:
    // 如果ch1通道成功读取数据，则执行该case处理语句
    fmt.Printf("ch1 = %v", v)
    case v := <-ch2:
    // 如果ch2通道成功读取数据，则执行该case处理语句
    fmt.Printf("ch2 = %v", v)
  }
  // 一次读取之后立刻再次监听
}
```

## 数据结构

select 底层由两部分组成, **case 语句**和**执行函数**

每一个 case 语句结构如下

``` go
type scase struct {
    c           *hchan         // chan
    elem        unsafe.Pointer // 读或者写的缓冲区地址
}
```

这里的 hchan, 存放了监听的 channel, 在一个 select 中, 包含了多个 case. 这些 case 组成了一个数组

## selectgo

而执行的 select 语句, 实际上调用了函数`func selectgo(cas0 *scase, order0 *uint16, ncases int) (int, bool)`

参数意义如下:

- cas0: case 数组中第一个case的地址
- order0: case数组两倍长的缓冲区
- ncases: case 数组的长度

selectgo 返回的说所选的 scase 的索引, 而如果 scase 是接收操作, 则返回是否收到值

## 流程

我们在运行一个 select 时, 函数的调用顺序如下

1. `func Select(cases []SelectCase) (chosen int, recv Value, recvOK bool)`
2. `func rselect([]runtimeSelect) (chosen int, recvOK bool) func`
3. `selectgo(cas0 *scase, order0 *uint16, ncases int) (int, bool)`

前两个都是简单的初始化参数, 重点其实就在`selectgo`里

selectgo 的处理流程如下:

1. 根据 cas0 获取 case 数组
2. 将 case 数组顺序打乱
3. 将 case 数组内的每个 chan 全部上锁
4. 遍历所有的 case 数组元素, 查看其是否可读和可写
5. 如果有可读或可写 case, 解锁所有的 chan, 返回对应的 chan 数据
6. 如果没有可读或可写, 有 defalut, 解锁所有的 chan, 返回 default 对应的 case
7. 如果两者都没有, 则将当前的 goroutine 阻塞, 将当前 goroutine的 G加入到case 数组内的所有 chan 的等待队列中, 然后所有 chan 解锁
8. 如果其中有一个 chan 可读或者可写时, 并且轮到这个 G 进行操作时, 将 goroutine 唤醒
9. 执行步骤3-7





















































