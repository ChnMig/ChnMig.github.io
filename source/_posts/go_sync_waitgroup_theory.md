---
title: sync.waitGroup 原理分析
date: 2022-02-15            
updated: 2022-02-15         
comments: true              
toc: true                   
excerpt:  sync.waitGroup 主要解决了并发-等待问题, 本篇来分析 waitGroup 的原理
tags:                       
- Golang
categories:                 
- 编程
---

## 前言

`sync`的常用包好像都快讲完了, 最近几天进度很快啊, 希望能多多保持.

`sync.WaitGroup`是为了解决任务编排而出现的, 主要就是解决并发-等待问题, 因此在真正编写过程中也很常用, 本篇大致讲解其内部实现的方式

## Demo

简单介绍一下用法

``` go
func main() {
	wg := sync.WaitGroup{}
	wg.Add(1) // wg计数+1
	go func() {
		defer wg.Done() // wg计数-1
		time.Sleep(3 * time.Second)
	}()
	wg.Wait() // 等待 wg 结束(wg计数为0)
}
```

对应`sync.WaitGroup`来讲, 只有三种方法: 

- `Add(delta int)`: 为计数器添加一定的数字
- `Done()`: 为计数器数字减去1
- `Wait()`: 夯住等待计数器数字变成0

## 结构

和往常一样, 先从结构开始看起

``` go
type WaitGroup struct {
    // 避免复制使用的一个技巧，可以告诉vet工具违反了复制使用的规则
    noCopy noCopy
    // 64bit(8bytes)的值分成两段，高32bit是计数值，低32bit是waiter的计数
    // 另外32bit是用作信号量的
    // 因为64bit值的原子操作需要64bit对齐，但是32bit编译器不支持，所以数组中的元素在不同的架构中不一样，具体处理看下面的方法
    // 总之，会找到对齐的那64bit作为state，其余的32bit做信号量
    state1 [3]uint32
}
```

- `noCopy`: 这个是一个使用技巧, 如果一个结构体中有此字段, vet 工具会在编译时检查避免被 copy 使用
- `state1`: 从定义可以看出, 其长度为3, 每个32bit, 里面包含了`waitGroup`的计数值和信号量和 waiter 计数

**state1 结构**

``` go
state[0]  // 调用 wait 等待的 goroutine 数量
state[1]  // 计数
state[2]  // 信号量
```

## Add

`Add`主要是对`state1`字段中的计数值部分进行操作, 步骤如下:

1. 将参数`delta`左移32位
2. 将值加到计数值上(`state1[1]`), 这个值是可负可正

## Done

`Done`实际上就是调用`Add(-1)`

而检测到`-1`之后的计数值为0时, 通过信号量唤醒正在`wait`的阻塞协程

## Wait

调用`wait`时, 会将`waiter`+1, 然后将自身加入到等待队列中并阻塞, 等待`Done`时的唤醒















