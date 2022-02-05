---
title: limiter 源码分析
date: 2021-07-07            
updated: 2021-07-10        
comments: true              
toc: true                   
excerpt: limiter 是比较出名的限流器包, 我们团队内部也有使用, 今天就来瞅瞅他的源码吧...
tags:                       
- Golang
- 源码分析
categories:                 
- 编程

---

## 前言

对于很多业务或者说是代码来讲, 运行速度的瓶颈都不在代码运行时本身, 所以我个人对于新业务的语言选型, 更多的是考虑其他方面, 而不是运行速度, 甚至有些业务, 还需要专门进行限流才可以达到目的, 比如说我要去测试 IP 和端口是否通畅, 需要通过测试是否能进行 TCP 连接来判断, 但是我们需要对这些进行一定的流速控制, 以免被机房自动告警或者占满带宽, 比如说我们需要对执行爆破任务的 work 限定最多同时运行 50000 个任务, 就需要进行限流处理了.

## 令牌桶

说起怎么样去限流, 一个很经典的模式 令牌桶 就出现在脑海中.

令牌桶这东西我更愿意用一种数学题来解释, 还在上学的时候, 相信大家都做过类似这样的题目: 一个游泳池, 有一个水管匀速向其中注水, 还有一个管子匀速从池中放水, 这其实就是达到了限流的目的

如果漏水的管子粗细代表 work 的多少, 而注水管和池子才是管控速率的关键, 当水已经漏完, 则是代表当前流速已经达到了峰值, 只能等注水管再流水, 而当注水管粗于漏水管, 也有一个游泳池可以作为缓冲

本人之前也写过一个简单的令牌桶模式的限流器, 简单来讲就是有一个`goroutine`持续的进行`注水`, 就是向一个`chan`进行写入, 而有一个`goroutine`持续从`chan`读取数据, 读取到就认为拿到了令牌, 使用`goroutine`生成一个新的任务, 代码类似于

``` go
func GetBucket(capacityPs, maxCapacity int) chan struct{} {
	var bucketToken = make(chan struct{}, maxCapacity)
	timeD := time.Second / time.Duration(capacityPs)
	ticker := time.NewTicker(timeD)
	go func() {
		for _ = range ticker.C{
			bucketToken <- struct{}{}
		}
	}()
	return bucketToken
}

func GetToken(block bool, bucket *chan struct{}) {
	for _ = range *bucket {
		// TODO
	}
}
```

这样基本满足了业务, 但是学无止境, 还是要看一下大佬们的实现. 方便以后可能的需求迭代, 于是找到了一个开源项目

[ulule/limiter: Dead simple rate limit middleware for Go. (github.com)](https://github.com/ulule/limiter)

并尝试理解其源代码

