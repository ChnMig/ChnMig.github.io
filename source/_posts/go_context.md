---
title: go语言的context
date: 2021-10-16            
updated: 2021-10-16        
comments: true              
toc: true                   
excerpt: go语言的context听说是必考题...
tags:                       
- Golang
categories:                 
- 编程
---

## 前言

听说是面试必问, 之前只有浅显的认知, 用的时候我一般传一个空的进去 :sweat:, 今天难得有休息时间, 来学习一下

本文总结自[七米老师的日志搜集项目视频](https://www.bilibili.com/video/BV1Df4y1C7o5)

## 为什么需要context

go的代码通常使用 `goroutine` 来提高代码速度, 这样的话怎么控制 `goroutine` 生成的协程就成了问题, 如果不小心出现了代码问题导致 `goroutine` 陷入死循环, 或者夯死, 就会导致意想不到的问题发生. 所以, `context`就出生了, 他类似一个信号, 通过传入的方式来让多个逻辑块进行联系, 以便做出操作

最基本的例子如下

``` go
package main

import (
	"context"
	"fmt"
	"sync"

	"time"
)

var wg sync.WaitGroup // wg等待

func worker(ctx context.Context) { // context.Context一般都叫ctx
LOOP:
	for {
		fmt.Println("worker")
		time.Sleep(time.Second) // 等待1s
		select {
		case <-ctx.Done(): // 如果接收到了ctx的Done信号, 就退出循环
			break LOOP
		default:
		}
	}
	wg.Done() // wg完成
}

func main() {
	ctx, cancel := context.WithCancel(context.Background()) // 生成ctx和cancel
	wg.Add(1)
	go worker(ctx)
	time.Sleep(time.Second * 3)
	cancel() // 调用cancel即可通知ctx需要Done掉
	wg.Wait()
	fmt.Println("over")
}

```

当`goroutine`嵌套时, 如果需要一起监听同一个`ctx`, 则可以使用

``` go
package main

import (
	"context"
	"fmt"
	"sync"

	"time"
)

var wg sync.WaitGroup // wg等待

func worker(ctx context.Context) { // context.Context一般都叫ctx
	go worker1(ctx)
LOOP:
	for {
		fmt.Println("worker")
		time.Sleep(time.Second) // 等待1s
		select {
		case <-ctx.Done(): // 如果接收到了ctx的Done信号, 就退出循环
			break LOOP
		default:
		}
	}
}

func worker1(ctx context.Context) { // context.Context一般都叫ctx
LOOP:
	for {
		fmt.Println("worker1")
		time.Sleep(time.Second) // 等待1s
		select {
		case <-ctx.Done(): // 如果接收到了ctx的Done信号, 就退出循环
			break LOOP
		default:
		}
	}
	wg.Done() // wg完成
}

func main() {
	ctx, cancel := context.WithCancel(context.Background()) // 生成ctx和cancel
	wg.Add(1)
	go worker(ctx)
	time.Sleep(time.Second * 3)
	cancel() // 调用cancel即可通知ctx需要Done掉
	wg.Wait()
	fmt.Println("over")
}

```

## context派生

我们看之前的代码

``` go
context.WithCancel(context.Background())
```

仔细看, 这里分成了两步, 一个是通过 `context.Background()` 生成了一个 `emptyCtx` 最上层的`ctx`

然后通过`context.WithCancel`来从这个最上层的`ctx`派生一个新的子`ctx`, `ctx`就像树一样, 从一个根一直发散

## 四种context

`context`分为四种上下文可以派生, 分别为 `WithCancel`, `WithDeadline`, `WithTimeout`, `WithValue`, 这四种有不同的作用. 需要注意的是, 派生这件事, `ctx` 可以不停的派生子的`context`, 当一个被取消时, 他派生的上下文也会被取消

- `WithCancel`  需要手动的出发`Done`才会取消
- `WithDeadline` 指定一个终止时间(明确的时间), 当时间到就自动取消
- `WithTimeout` 指定一个终止时间间隔, 当时间间隔到时自动取消
- `WithValue` 这个目的不是取消, 而是上下文之间的数据传输

## context结构

`context`其实是接口, 我们查看其结构

``` go

type Context interface {

	Deadline() (deadline time.Time, ok bool)

	Done() <-chan struct{}

	Err() error

	Value(key interface{}) interface{}
}
```

其中:

- `Deadline` 方法返回当前的这个 `ctx` 被取消的时间
- `Done` 返回的是一个 `channel`
- `Err` 返回`ctx`结束的原因, 只有确实结束了才会返回非空的值
  - `ctx` 被取消就返回 `canceled` 错误
  - `ctx` 超时结束则会返回 `DeadlineExceeded` 错误
- `value` 方法则根据 `key` 返回 `value` , 这个是用来传递数据使用的

## background()和TODO()

之前提到过, `ctx`实际上是可以派生的, 那么, 作为最顶层的`ctx`, 我们只能选择两种, `background` 和 `TODO`, 由这两个生成的`ctx`来派生更多的`ctx`

- `background`用于 初始化/main/测试 中, 也就是第一个, 最顶层的`ctx`
- `TODO`目前还没有具体的使用场景, 我们知道, go语言的传参是必须的, 如果你并不想使用`ctx`, 但是第三方的又需要你传, 或者你还没想好它的作用, 你可以使用`TODO`

这两个生成的`ctx`都是不可取消, 没有截止时间, 没有携带任何值的`emptyCtx`

## 四种with函数派生

之前简单的介绍了  `WithCancel`, `WithDeadline`, `WithTimeout`, `WithValue`, 这里分别举出例子

### WithCancel

`WithCancel` 的函数定义

``` go
func WithCancel(parent Context) (ctx Context, cancel CancelFunc)
```

该函数返回一个派生的新`ctx`和一个`done`的函数, 当调用这个函数, 就会关闭上下文的`Done`通道

``` go
package main

import (
	"context"
	"fmt"
)

func gen(ctx context.Context) <-chan int {
	dst := make(chan int)
	n := 1
	go func() {
		for {
			select {
			case <-ctx.Done():
				return // 监听到结束后, 退出函数, 进行垃圾回收
			case dst <- n:
				n++
			}
		}
	}()
	return dst
}
func main() {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel() // 关闭管道

	for n := range gen(ctx) {
		fmt.Println(n)
		if n == 5 {
			break
		}
	}
}

```

### WithDeadline

`WithDeadline`的函数定义

``` go
func WithDeadline(parent Context, deadline time.Time) (Context, CancelFunc)
```

传参不止一个`ctx`, 还有一个`time.Time`, 标识这个`ctx`的超时时间, 依旧返回了`done`函数, 派生的`ctx`在任务到期后会自动关闭, 而在到期之前可以通过手动调用`cancel`函数来关闭

``` go
package main

import (
	"context"
	"fmt"
	"time"
)

func main() {
	d := time.Now().Add(50 * time.Millisecond)  // 获取当前时间50ms后的时间
	ctx, cancel := context.WithDeadline(context.Background(), d)  // 把过期时间传入

	// 尽管ctx会过期，但在任何情况下调用它的cancel函数都是很好的实践。
	// 如果不这样做，可能会使上下文及其父类存活的时间超过必要的时间。
	defer cancel()

	select {
	case <-time.After(1 * time.Second):
		fmt.Println("overslept")
	case <-ctx.Done():
		fmt.Println(ctx.Err())
	}
}

```

需要注意的是, 推荐依旧注册一个`cancel`的执行, 这是为了保险起见

### WithTimeout

`WithTimeout`的函数定义

``` go
func WithTimeout(parent Context, timeout time.Duration) (Context, CancelFunc)
```

与`Deadline`不同的是, 这里传的是一个时间间隔, 等待时间间隔完成后发起关闭

这种方式同常用于超时控制

``` go
package main

import (
	"context"
	"fmt"
	"sync"

	"time"
)

var wg sync.WaitGroup

func worker(ctx context.Context) {
LOOP:
	for {
		fmt.Println("db connecting ...")
		time.Sleep(time.Millisecond * 10) // 假设正常连接数据库耗时10毫秒
		select {
		case <-ctx.Done(): // 50毫秒后自动调用
			break LOOP
		default:
		}
	}
	fmt.Println("worker done!")
	wg.Done()
}

func main() {
	// 设置一个50毫秒的超时
	ctx, cancel := context.WithTimeout(context.Background(), time.Millisecond*50)
	wg.Add(1)
	go worker(ctx)
	time.Sleep(time.Second * 5)
	cancel() // 通知子goroutine结束
	wg.Wait()
	fmt.Println("over")
}

```

### WithValue

`WithValue`可以在`ctx`中写入数据库, 也可以读取数据

``` go
func WithValue(parent Context, key, val interface{}) Context
```

`WithValue`返回派生的`ctx`, 使用方法如下

``` go
package main

import (
	"context"
	"fmt"
	"sync"

	"time"
)

type TraceCode string

var wg sync.WaitGroup

func worker(ctx context.Context) {
	key := TraceCode("TRACE_CODE")
	traceCode, ok := ctx.Value(key).(string) // 获取ctx中存储的"TRACE_CODE"的值
	if !ok {
		fmt.Println("invalid trace code")
	}
LOOP:
	for {
		fmt.Printf("worker, trace code:%s\n", traceCode)
		time.Sleep(time.Millisecond * 10) // 假设正常连接数据库耗时10毫秒
		select {
		case <-ctx.Done(): // 50毫秒后自动调用
			break LOOP
		default:
		}
	}
	fmt.Println("worker done!")
	wg.Done()
}

func main() {
	// 设置一个50毫秒的超时
	ctx, cancel := context.WithTimeout(context.Background(), time.Millisecond*50)
	// 向ctx添加值 "TRACE_CODE": "12512312234"
	ctx = context.WithValue(ctx, TraceCode("TRACE_CODE"), "12512312234")
	wg.Add(1)
	go worker(ctx) // 传入
	time.Sleep(time.Second * 5)
	cancel() // 通知子goroutine结束
	wg.Wait()
	fmt.Println("over")
}

```

### 注意事项

- `context` 以参数的方式传递
- 如果需要`context`, 应该吧`context`当做第一个参数, 且别名为 `ctx`
- 如果一个函数需要`context`, 而你又没有, 又不想使用, 可以传入`context.TODO()`
- `context`的`WithValue`应当传递必要的数据, 不要什么数据都放里面. 切记不要用他来替代传参的方式
- `context`是线程安全的, 可以放心的在多个`goroutine`中传递
- 派生函数返回值第二个都是`done`, 执行可以关闭这个`context`



















