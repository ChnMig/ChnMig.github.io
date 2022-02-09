---
title: Golang 常问知识点(简略)
date: 2022-01-20            
updated: 2022-01-20         
comments: true              
toc: true                   
excerpt: 记录一下面试常问的知识点吧
tags:                       
- Golang
categories:                 
- 编程
---

## 前言

现在行业太卷, 不学习就会被优化.

现在企业太坑, 不涨薪只会画大饼.

英雄布尔什维克, 什么时候会实现呢?

## Go 语言的变量分配在栈还是堆

[Frequently Asked Questions (FAQ) - The Go Programming Language](https://go.dev/doc/faq#stack_or_heap)

引用类型, 比如 切片,map 是堆

对于函数内部的变量, 其分配规则由编译器自己决定, 规则如下:

编译器会进行变量的逃逸分析. 当某个变量在函数外也使用时, 作用域不仅仅在函数内时, 比如 return 出变量的值的地址, 这种情况就会把数据分配到堆中.

此外, 如果某个变量的值很大的时候, 也会分配到堆中.

其他正常情况, 函数内的变量都在栈中

## select是随机还是顺序

[Why is the select statement non-deterministic? : golang (reddit.com)](https://www.reddit.com/r/golang/comments/4ibs68/why_is_the_select_statement_nondeterministic/)

是随机的

据说是为了保持均衡, 不出现比如总是命中第一个 case, 导致其他下面的 case 完全不执行的情况, 尤其是 select 还通常用来监听多个 channel

## Go 语言的垃圾回收

[三色标记法与读写屏障 - 简书 (jianshu.com)](https://www.jianshu.com/p/12544c0ad5c1)

[Golang 垃圾回收剖析 | Legendtkl](http://legendtkl.com/2017/04/28/golang-gc/)

### 什么时候进行垃圾回收

- 调用 runtime.GC() 进行主动垃圾回收(主动)
- 当堆上的活跃对象大于 4M(默认) 的时候进行 GC
- 上次 GC 的2分钟后
- 当前没有开启 GC 的时候

### 标记 GC

go 语言使用的是三色标记法

他有三种颜色(标记):

- 白色代表还未访问过
- 灰色代表对象已经访问过, 但是本对象引用到的其他对象没有访问完
- 黑色代表对象和引用到的其他对象都已经访问完

1.初始时，所有对象都在 【白色集合】中；

2.将GC Roots 直接引用到的对象 挪到 【灰色集合】中；

3.从灰色集合中获取对象：
 3.1.  将本对象 引用到的 其他对象 全部挪到 【灰色集合】中；
 3.2.  将本对象 挪到 【黑色集合】里面。

4.重复步骤3，直至【灰色集合】为空时结束。

5.结束后，仍在【白色集合】的对象即为GC Roots 不可达，可以进行回收。

当 CG 过程中, 新增了变量, 或者手动把变量的值设置成 nil,  默认把他设置成黑色, 留给下一次 GC 再处理

## Go 协程

[Go 语言调度器与 Goroutine 实现原理 | Go 语言设计与实现 (draveness.me)](https://draveness.me/golang/docs/part3-runtime/ch06-concurrency/golang-goroutine/)

Go 在启动的时候会根据硬件的状态占用对应的进程和线程(默认1核1个), 然后通过内部的调度器来进行协程的切换, 减少操作系统和硬件的负载.

从 1.14 版本开始, 使用的是抢占式调度. 

调度器由 3 个部分组成, GMP 模型说的就是这个

- G - goroutine, 就是需要执行的任务, 包含了任务的执行函数, goroutine 状态和一些信息
- M - 操作系统的线程, 这个是由操作系统进行调度和管理, 这里是真正执行计算的部分
- P - 调度器的逻辑. 存放线程 M 执行的上下文

**G**

G 里包含了需要执行的任务, 是 Go 给用户态提供的类似线程的东西, 只是因为是自己维护的, 可以做到更小的占用内存空间, 同时降低了上下文切换的开销

**M**

M 是真正的操作系统线程, 比如说 4 核, 就会有 4 个线程, 但是我们可以启动很多 goroutine, 而调度器帮助我们把这些 goroutine 落到线程中, 开发者感觉到 goroutine 是并行, 实际上是调度器将其进行排队后放到线程里运行

**P**

P 是联通 G 和 M 的中间层他会去将若干个 goroutine 进行排队和调度, 比如说在某一个 goroutine 进行 I/O 操作时让出资源给另一个 G

## Go 两个结构体生成的对象能不能相互比较

同一个结构体生成的对象可以相互比较

不同的如果结构和顺序完全一致也可以

## Go 的 context

[go语言的context - ChnMig的个人网站](https://www.chnmig.com/2021/10/16/go_context)

context 主要是为了控制 goroutine 的生命周期, ctx 传进去之后 select 监听 Done 信号就行

另外 redis 包等一些包在调用时需要传入ctx 参数, 一般使用 TODO

context有四种, 用过 WithDeadline 进行超时控制

## interface

interface 虽然说可以放进任意的数据, 比如说一个切片的 value 是 interface 类型, 但是放进去之后就变成了 interface 类型, 即使拿出来还要通过断言来转, 所以基本不用

用接口的稍微多一些, 比如统一的推送接口, 让钉钉包和邮件包都实现这个接口, 然后需要发送时 for 这几个对象, 调用接口即可

## goroutine 控制

wg 来进行夯住整个程序操作, `Add`之后`Done`进行夯住程序结束

使用 context 生成 ctx, 监听 Done 队列可以在外层进行通知关闭, goroutine 内进行关闭操作, 主动退出

## 堆和栈

[Golang内存分配逃逸分析 (driverzhang.github.io)](https://driverzhang.github.io/post/golang内存分配逃逸分析/)

**分配规则**

- 栈存放占用小的数据, 栈先进先出, 而且栈在分配时必须要指定长度

- 当在函数内部申请栈的内存时, 当函数结束, 栈内存会直接释放而不通过 GC, 不会影响性能

- 当函数内部的变量, 作为返回值返回了, 也就是说其作用域不仅仅在函数内部, 那么即使占用小还是会分配到堆上, 引起 GC
- 如果申请的内存比较大, 比如长度为20000的切片, 即使作用域只在内部, 也会申请到堆上
- 对于在编译时不能确定长度的数据, 也会分配到堆上

**逃逸分析**

决定分配到堆还是栈的不是开发者而是 go 的编译器, 当编译器检测到某个变量会发生逃逸, 就一定会存放到堆上

- 指针逃逸: 函数返回局部变量的指针时
- 栈空间不足: 局部变量的数据长度过大时
- 动态类型逃逸: 函数的参数为 interface 这种, 编译器无法确认大小时
- 闭包引用对象逃逸: 变量被闭包引用时

## 优雅的结束程序

设置一个管道监听强制结束的 os 信号, 同时设置 defer 的 ctx

``` go
ctx, cancel := context.WithCancel(context.Background())
defer cancel() // 关闭管道
c := make(chan os.Signal, 1)
signal.Notify(c, os.Interrupt)
<-c
```

## CSP 并发模型

> 不要以共享内存的方式来通信, 相反, 要通过通信来共享内存

例如`Python`, `Java`这种语言, 他们一般使用线程进行并发, 因为都是属于一个进程, 所以通过共享的内存来进行通信, 比如说如何控制关闭`python`下的某一个线程, 更安全的做法可能是维护一个字典保存对应状态, 让每个线程去获取字典来判断是否需要停止, 这种通过共享内存的方式进行通信, 要考虑一些问题

 例如数据读写抢占问题, 比如`Python`在必要的时候会加一个锁来防止资源竞争, 这样其实就提高了编写时的逻辑复杂度, 因为你要考虑到死锁的可能性

而对于`Golang`来讲, 他使用 GMP 模型给开发者包装成了`goroutine`, 让开发者能很容易的启用并发, 而对于每个 `goroutine`之间的通信, `Golang`推荐使用`channel`管道来处理, 而不是共享内存

一般的, 逻辑可以抽象成流水式, 可能中间的某一步, 需要通过并发的方式来提高效率, 然后到某一步的时候, 又需要进行流控, 比如说数据的入库等, 使用共享内存的方式, 可能是向同一个变量存储数据, 而在`Golang`中, 我们就可以让并发的那一步数据向`channel`里发送, 而下一步从`channel`中读取, 从而进行流控

## 锁

当代码中确实可能存在多个`goroutine`试图修改同一个数据时, 就需要加锁

``` go
// 互斥锁, 占用后不可读也不可写
var lock sync.Mutex
lock.Lock()  // 加锁
lock.Unlock()  // 解锁

// 读写互斥锁
var rwlock sync.RWMutex
rwlock.RLock()  // 读锁, 此时其他协程无法写, 可以读
rwlock.RUnlock()

rwlock.Lock()  // 写锁, 此时其他协程无法写, 可以读
rwlock.Unlock() 
```

## 单例

在很多时候, 我们需要保证某个操作只执行一次, 例如生成配置文件, 你可能把他包装成一个模块让别人使用, 而你无法控制使用者只调用一次你的读取函数, 有一种方法是在内部生成对象, 在调用读取函数时先查看是否为`nil`, 你也可以使用 `sync.Once`

``` go
package config

import (
    "sync"
)

type Config struct {}

var config *Config
var once sync.Once  // 生成只执行一次的"锁"

func InitConfig() *Config {
    once.Do(func() {  // Do 接收一个函数
        config = &Config{}  // 在函数内进行初始化
    })
    return config  // 返回
}
```

`sync.Once`内部包含了一个互斥锁和一个布尔值, 互斥锁保证了在第一次执行时不会有抢占, 布尔值保证了只会执行一次

## map 并发

在多个`goroutine` 操控同一个 map 时, 可能会出现并发数据争抢问题, 官方为我们提供了`sync.Map`, 是并发安全的, 使用时不需要 make, 他是并发安全的

## 原子操作

go 当然也有很多的原子操作, 保证不会出现抢占问题, 在包 `sync/atomic` 中

比如 `AddInt64` 就是向一个 `int64` 值中增加某数

直接使用原子操作要比自己加锁来实现的效率高

## map 的底层实现

go 语言的 map 是 hashmap, 使用**数组+链表**的形式实现

将`key`经过哈希并切分生成`高位`和`低位`数, 通过`低位数`寻找存储在哪个数组, 通过`高位数`寻找存储在这个数组的哪一个地方

map 内的`key`和`value`存储排列是

``` go
key0, key1, key2, value0, value1, value2
```

这是因为`key`和`value`分别为不同的数据结构, 将至分别放在一起可以达到**内存对齐**的目的

















































































