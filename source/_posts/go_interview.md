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

## Go 语言的基础数据类型占用大小

| 类型    | 大小(字节) |
| ------- | ---------- |
| Int8    | 1          |
| Int16   | 2          |
| Int32   | 4          |
| Int64   | 8          |
| int     | 4/8        |
| Float32 | 4          |
| Float64 | 8          |
| string  | 1/2~4      |
| bool    | 1          |

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

在 select 的执行函数`selectgo`中, 会先将 case 的顺序打乱

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

## GMP 优势(相比多线程开发)

- goroutine 更加轻量(2kb), 线程1~2M
- 切换更加的快速, 减少内核切换的资源消耗

## GMP 中 G 的状态

- 空闲(Gidle): 刚新建, 未初始化
- 等待运行(Grunnable): 在队列中等待运行
- 运行中(Grunning): 表示操作系统线程 M 正在运行这个 G
- 系统调用中(Gsyscall): M 正在运行这个 G 发起的系统调用, 此时 M 并不拥有 G
- 等待中(Gwaiting): G 正在等待某些东西完成, 这时候 G 没有运行也不在运行队列中
- 已终止(Gdead): G 没有被使用, 可能已经执行完毕
- 栈复制中(Gcopystack): G正在获取新的栈空间并且把原有数据复制进去(防止 GC 清理)

## GMP 中 M 的状态

- 自旋中: M 正在从运行队列中获取 G
- 执行 Go 代码中: 正在运行 G
- 执行原生代码中: 正在运行 G 的 syscall
- 休眠中: 没有 G 时进行休眠

## GMP 中 P 的状态

- 空闲中: M 没有 G 需要运行时, P 空闲
- 运行中: M 正在运行 G
- 系统调用中: G 正在 syscall
- GC 停止中: GC 导致整个世界停止
- 终止: 多余的 P 会终止

## GMP 抢占式调度

有一个额外的线程M进行死循环, 去检查 G 的运行时间, 如果超过10ms, 则去抢占这个 G 使用的 P, 交给其他的 G 使用

通知 G 停止使用的是信号协作

## Go 两个结构体生成的对象能不能相互比较

同一个结构体生成的对象可以相互比较

不同的如果结构和顺序完全一致也可以

## Go 的 context

[go语言的context - ChnMig的个人网站](https://www.chnmig.com/2021/10/16/go_context)

context 主要是为了控制 goroutine 的生命周期, ctx 传进去之后 select 监听 Done 信号就行

另外 redis 包等一些包在调用时需要传入ctx 参数, 一般使用 TODO

context有四种, 分别是:

- `WithCancel` 需要手动的出发`Done`才会取消
- `WithDeadline` 指定一个终止时间(明确的时间), 当时间到就自动取消
- `WithTimeout` 指定一个终止时间间隔, 当时间间隔到时自动取消
- `WithValue` 这个目的不是取消, 而是上下文之间的数据传输

context 内有一个 channel, 当需要关闭时, 向这个 channel 发送数据通知关闭

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

当代码中确实可能存在多个`goroutine`试图修改同一个数据时, 就需要加锁, 锁分为两种

### 互斥锁

互斥锁在被占用后, 其他协程完全无法访问, 不可读更不可写

``` go
// 互斥锁, 占用后不可读也不可写
var lock sync.Mutex
lock.Lock()  // 加锁
lock.Unlock()  // 解锁
```

互斥锁内部使用信号量+自旋的方式来进行锁的处理

### 读写锁

读写互斥锁可以添加两种锁, 读锁和写锁, 在读锁上锁时其他协程可读不可写, 写锁上锁时其他协程不可写不可读

``` go
// 读写互斥锁
var rwlock sync.RWMutex
rwlock.RLock()  // 读锁, 此时其他协程不可写, 不可读
rwlock.RUnlock()

rwlock.Lock()  // 写锁, 此时其他协程无法写, 可以读
rwlock.Unlock() 
```

读写锁中写锁为互斥锁, 而读锁就是一个数字, 因为其并不互斥, 只是在加写锁时有用

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

`sync.map`生成的 map 有以下几种方法

- store: 更新/插入
- load: 获取
- delete: 删除
- loadOrStore: 有则返回, 没有则插入
- range: 遍历输出

`sync.map`主要通过两个数据集的方式, 来读写分离, 提高效率

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

## sort 排序算法

自带的`sort`包使用简单, 实现对应接口即可

``` go
type Interface interface {
    Len() int           // Len方法返回集合中的元素个数
    Less(i, j int) bool // i>j，该方法返回索引i的元素是否比索引j的元素小、
    Swap(i, j int)      // 交换i, j的值
}
```

`sort`内部根据不同情况选择不同的排序算法

当长度小于12时进行**希尔排序**

长度大于12时, 使用**快速排序**

### 希尔排序

希尔排序的时间复杂度是`O(n^(1.3-2))`, 在应对数据不长的时候速度较快, 其步骤如下

1. 计算增量, 初始是`gap=length/2`, 如果列表长度是12就是6
2. 将原本的列表按照步长跳跃, 分为6个子列表, 每个列表有2个数据, 例如`[1, 3, 2, 4]`就将其拆分为`[1, 2]`和`[3, 4]`
3. 将这几个子列表进行排序比较(当然并不是真的独立出来, 只是在原列表中根据索引比对)
4. 缩小增量, `gap=gap/2`
5. 重复步骤`2, 3, 4`
6. 增量缩小为1, 结束

在长度不多的时候, 增量不会很大, 缩小起来很快, 速度较快

### 快速排序

在数据较大的时候, 快排的速度更快, 时间复杂度为`o(nlogn)`

快速排序是有`L(索引)`和`R(索引)`和`temp(固定值)`, 由此来进行分区, 步骤如下

1. `L`开始是第0位(索引), `R`开始是最后一位(索引), `temp`为第0位
2. 将`L`向后移动, 如果扫描到`L`的值小于`temp`的值,  则将`temp`的位置与`L`当前的位置进行调换
2. `L`不动, 将`R`向前移动, 如果扫描到`R`的值小于`temp`的值, 则将`temp`的位置与`R`当前的位置进行调换
2. 循环步骤`2, 3`一直到`L`和`R`相等, 此时以`temp`为界, 左边比`temp`小, 右边比`temp`大
2. 按照`temp`为界, 将左边和右边分别重复步骤`1到4`, 一直到分不出来, 结束

快排主要是通过分界, 将列表切分, 然后对切分的子列表再切分, 达到排序的目的

## Defer

defer 主要用于延迟调用, defer 会在函数返回之前执行 defer 注册的函数

defer 的注册顺序和执行顺序是相反的, 也就是**先进后出**

另外, defer 可以与`recover`一起使用, 类似于 python 的`try`, 来捕捉程序的`panic`, 从而防止程序直接退出

``` go
defer func() {
  if r := recover(); r != nil {  // 捕捉
    fmt.Println("Recovered in f", r)
  }
}()
```

## goroutine如何阻塞

- `WaitGroup`进行等待
- 监听`ctx.Done()`管道
- `for`循环
- 向一个没有接受者并且缓冲区已满的 chan 发送数据
- 从一个没有发送者并且缓冲区为空的 chan 读取数据

## goroutine 什么时候发生阻塞

- 等待 channel
- 发生一次系统调用等待回调结果
- ...

## goroutine 阻塞时调度器怎么做

调度器将阻塞的 goroutine 放到一边, 切换到其他 goroutine 继续执行, 直到这个 goroutine 结束阻塞

## channel 自动关闭

在这个 channel 没有goroutine 持有时, 会自动关闭

## goroutine 的最大数量

在1.4版本之后, 一个 goroutine 占用**2kb**的内存大小

## 限制协程数量

使用 channel 来限制协程数量, channel 缓冲区的长度就是协程最大数量

``` go
var ch chan int
func test(i int) {
	fmt.Println(i)
	time.Sleep(1 * 1e9)
	<-ch  // goroutine 运行结束后将指标返回
}
func main() {
	ch = make(chan int, 10)  // 最多允许10个 goroutine
	for i:=0; i<1000; i++ {
		ch<-i  // 有指标再进行 goroutine 启动, 没有就一直夯住
		go test(i)
	}
}
```

## new 和 make 区别

**new**

分配内存

new 为新的类型分配内存, 返回对应的指针, 比如创建 对象, struct 等

new 返回的是指针, 不使用指针的时候一般不使用 new

**make**

初始化

返回类型的初始值, 只适用于切片/map/channel

## go 的内存分配

分为3块

- spans: 512MB
- bitmap: 16GB
- arena: 512GB

**arena**

堆区, 动态分配的内存在这里, go 把内存分割成每个 8kb 的若干页(page)

**bitmap**

标记 arena 对象的地址, 并有4bit 标志位标识了对象是否包含指针和 GC 标记信息

bitmap 中一个 bytes(8bit) 大小的内存对应 arena 里4个指针大小(32bit)的内存, 

**spans**

span 是 go 内存管理的基本单位, span 有多种规格, 每个规格占用若干个 page, 最大的 span 是32kb, 超过32kb 则是特殊的 class

## 结构体作为参数传入时, 传值还是指针

go 都是值传递, 只是参数可以选值类型还是引用类型

看具体的逻辑, 如果需要修改结构体的值时, 需要传入指针来修改数据

其他时候传值, 因为结构体一般存储在栈上(前提是结构体不是特别大), 栈的代价很小, 而传指针有可能会引发内存逃逸

## go 中使用过线程吗

GMP 模型中 M 为操作系统线程, 由 go 调度, 实际的应用开发中没有直接使用过

## linux 有几种线程模型

- 一对一(M:1)
- 多对一(1:1)
- 多对多(M:N)

## go 线程中某一个发生了 OOM(内存泄露) 会怎样

kill 掉这个线程, 不影响其他线程

## goroutine 发生 OOM 什么情况

没遇到过, 本地写代码发生过内存逃逸, 发现是 slice 的坑

## OOM 排查

个人经验是 OOM 基本都是 giroutine 泄露, 使用 pprof 定位问题然后排查

## 错误处理怎么做

不是特别简单的逻辑, 牵扯到调用其他服务的函数, 一定有 error 返回值

外面通过判断 `err!=nil` 进行错误捕捉, 通过`fmt.Errorf("test")`进行 error 创建

## goroutine 发生 panic 会怎样

如果没有设置`recover`捕捉, 会导致整个程序崩溃

goroutine 是互相独立的, `recover`必须在本层, 否则无法捕捉 panic

## 怎么管理的 proto 文件

单独的仓库存放, 通过 git 管理

## gin 框架使用参数校验

gin 内置了 [go-playground/validator: :100:Go Struct and Field validation, including Cross Field, Cross Struct, Map, Slice and Array diving (github.com)](https://github.com/go-playground/validator) 插件, 先定义校验的结构体, 通过`tag`的方式指定字段名字, 是否必填等信息, 通过 `c.ShouldBind`来进行参数的校验

## gin 的中间件

经常使用自己写的同意跨域中间件

`gin.Default()`默认带两个中间件, 一个是打印日志, 一个是捕捉 panic 处理成500错误

使用`router.Use()`添加自定义中间件

## gin 跨域中间件

跨域主要是浏览器从服务端返回的 Header 中获取指定的 key, 来判断是否是跨域的

浏览器将请求分为两种:

**简单请求**

1. 使用 `GET、POST、HEAD` 其中一种请求方法。
2. HTTP的头信息不超出以下几种字段：
   - Accept
   - Accept-Language
   - Content-Language
   - Last-Event-ID
   - Content-Type：只限于三个值 `application/x-www-form-urlencoded、multipart/form-data、text/plain`

简单请求的同意跨域, 直接在返回值的 header 中插入`Access-Control-Allow-Origin: *`即可

**非简单请求**

请求方法是 `put` 或 `delete`, 或者 `content-type` 的类型是 `application/json`

其实简单请求之外的都是非简单请求了

浏览器在处理非简单请求时, 会先发送`OPTIONS`方法, 查看返回值的 header 字段, 符合要求则同意跨域



gin 使用中间件时, 使用`c.Header`添加`Header`数据, 使用`c.Next()`将请求处理移交到下一部分

## go 怎么解析 tag

使用反射进行 tag 的解析

## 反射原理

go 的`reflect`包提供了反射的支持

获取对象的 type 和 value 的元数据和一些方法, 进行调用

**反射一般不使用**

- 可读性差
- 可能会 panic
- 影响效率

## channel的坑

- 向一个已经 close 的 chan 写入数据会 panic
- 从一个已经 close 的 chan 读取数据会获取到 chan 数据类型的默认值
- 推荐使用`for i := range chan`或者`select`来读取 chan 数据, 这样在关闭后自动退出
- 有可能造成 goroutine 阻塞

## 负载均衡算法

**哈希**

根据 hash 取模进行分配, 保证同一个 key 会分配到同一个节点

可能会导致不均衡

**轮询**

所有节点进行轮询, 排序选择分配的节点

请求均衡, 但是负载不一定

**随机**

随机选一个节点

类似轮询

**加权轮询**

根据权重优先分配给权重高的节点

## select 执行原理

具体的代码在`selectgo`中

先将 case 打乱顺序, 然后尝试从 chan 获取值, 没有则运行 default, 没有定义 default 时将所在的 G 加入到对应的 N 个 chan 监听队列中等待唤醒

## channel 关闭后对 channel 操作会出现什么

使用`clse(ch1)`来关闭管道

在 close 时, go 会将 chan 中等待插入数据的 goroutine 全部唤醒, 并且设置插入的值为 nil

- 如果从 chan 中尝试发送数据, 会导致程序**panic**
- 如果从 chan 中尝试读取数据, 会读取出存储类型的默认值, 不会 panic

## 大对象/小对象/微对象

**大对象**

占用内存>32kb 时, 认为他是大对象

大对象分配不走 mcache 和 mcentral, 直接通过 mheap 分配

**小对象**

16b<占用内存<32kb 时, 认为他是小对象

小对象先获取到合适大小的的 mspan, 并存储到 mheap 中

**微对象**

占用内存<16b 时, 认为他是微对象

微对象直接存储在 mcache 上, 每个微对象的大小是16b





































































