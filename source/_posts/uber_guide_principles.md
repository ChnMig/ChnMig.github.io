---
title: uber go code 规范(指导原则)
date: 2021-04-18            
updated: 2021-06-13         
comments: true              
toc: true                   
excerpt: 这里是 uber 团队出的 go 代码规范指南的中文版, 注意只是指南
tags:                       
- Golang
categories:                 
- 编程
---

## 前言
从接触 Golang 到现在, 感觉到的很深的一点是, go 的代码无论是大佬还是菜鸟写出的代码, 都有着大体统一的 格式/流程, 这也是 Go 被开发者喜爱的一个原因, 但是还有一些, 比如变量的命名方式等, 可以称之为 风格 的东西, 却不尽相同, 我在开发中, 其实也希望有一个相对权威的指导意见, 后来就找到了 uber 团队出品的开发规范.
uber 是众多公司中, 比较早使用 go 语言的了, 其本身也开源了一些优质的模块, 有机会的话希望也能向大家展示一下, 而在 uber 内部开发中, 经过持续的迭代, 开源了自己的代码规范, 这里给大家解读一下
需要特别指出的是, 下面的内容并不是一定需要遵守, 这里你可以选择自己认为正确的可行的规范. 
团队内使用统一的风格, 可以提高代码的可读性
本篇记录原则部分
## 原则
> 原则部分, 在 uber 内部是必须遵守的, 其目的是提高代码的健壮性, 让一些可能的错误能在编写时就暴露出来

## 结构体中包含接口指针
接口可以包含任何类型的值, 但是, 将结构体的某个值的类型设置为接口的指针则会出现问题, 例如:
``` Go
package main

type Brace interface{} // 空接口

type Round struct { // 结构体
	prev  Brace  // 值 prev 的类型为接口值
	prev_ *Brace // 值 prev_ 的类型为接口指针
}

type Square struct{} // 空结构体

func main() {
	var r Round
	var s Square
	r.prev = s   // OK: 这里 ok
	r.prev_ = &s // ERR: 想要将 s 的指针赋值给 prev_, 会报错
}
```
开发者很少需要在结构体中设置某个值的类型为接口的指针, 而应该将接口作为值进行传递, 类似于上面的 `prev`, 如果你真的需要将接口指针设置为结构体的某个值, 也不需要将其类型设置为指针, 例如:
``` Go
package main

type Brace interface{} // 空接口

type Round struct { // 结构体
	prev  Brace // 值 prev 的类型为接口值
	prev_ Brace // 值 prev_ 的类型为接口值
}

type Square struct{} // 空结构体

func main() {
	var r Round
	var s Square
	r.prev = s   // OK: 这里 ok
	r.prev_ = &s // OK: 想要将 s 的指针赋值给 prev_, 可以赋值
}
```
而一般情况下, 我们对结构体的方法的结构体部分传参, 大多数都是结构体的指针()指针方法, 此时可以使用结构体指针赋值给接口的方式, 例如:
``` Go
package main

type Brace interface {
	Length()
}

type Round struct { // 结构体
}

func (r *Round) Length() {}

func main() {
	b := []Brace{&Round{}}  // OK: *Round 实现了 Brace 接口, 而不是 Round
}
```
## interface 合理性验证
对于接口的实现, 在我们编写代码时, 可能会因为种种原因没有实现好对应接口, 而这个错误只有在真正调用时才会被发现, 例如:
``` Go
package main

type Brace interface {
	Length()
}

type Round struct { // 结构体
}

func (r *Round) Long() {}

func main() {
	_ = []Brace{&Round{}} // ERR: 这里会报错, 因为 &Round 没有实现 Brace
}
```
所以, 我们可以在编写时使用一个无用的空值, 来让编译器帮助我们判断是否实现了接口, 例如:
``` Go
package main

type Brace interface {
	Length()
}

type Round struct { // 结构体
}

var _ Brace = &Round{} // OK: 利用 var 一个无用的值, 让编译器检测 &Round 是否实现了 Brace 接口

func (r *Round) Long() {}

func (r *Round) Length() {}

func main() {
}
```
## 接收器与接口
对于结构体的值来讲, 结构体的指针方法与值方法不能一起调用, 例如:
``` Go
package main

type S struct {
	data string
}

func (s S) Read() string { // 值方法
	return s.data
}

func (s *S) Write(str string) { // 指针方法
	s.data = str
}

func main() {
	sVals := map[int]S{1: {data: "A"}}

	// OK: 你只能通过值调用 Read
	sVals[1].Read()

	// ERR: 这里会出现问题, 因为方法为指针方法
	sVals[1].Write("test")
}
```
而对于结构体的指针来讲, 可以调用值方法和指针方法, 例如:
``` Go
package main

type S struct {
	data string
}

func (s S) Read() string { // 值方法
	return s.data
}

func (s *S) Write(str string) { // 指针方法
	s.data = str
}

func main() {
	sPtrs := map[int]*S{1: {data: "A"}} // 存储结构体的指针

	// OK: 通过指针既可以调用 Read(值方法)，也可以调用 Write 方法(指针方法)
	sPtrs[1].Read()
	sPtrs[1].Write("test")
}
```
同样的道理, 对于接口来讲, 也可以使用指针接收器来实现接口
``` Go
package main

type F interface {
	f()
}

type S1 struct{}

func (s S1) f() {} // 值方法

type S2 struct{}

func (s *S2) f() {} // 指针方法

func main() {
	s1Val := S1{}  // 结构体值
	s1Ptr := &S1{} // 结构体指针
	s2Val := S2{}  // 结构体值
	s2Ptr := &S2{} // 结构体指针

	var i F   // 接口
	i = s1Val // OK: S1的值实现了值方法
	i = s1Ptr // OK: S1的指针实现了值方法
	i = s2Ptr // OK: S2的指针实现了指针方法

	// ERR: 不行, 因为S2是指针方法
	i = s2Val
}
```
## 零值 Mutex
对于sync 的锁包, `sync.Mutex`和`sync.RWMuntex`, 他的零值也是有效的, 不需要通过`new`关键字来生成指针
``` Go
package main

import "sync"

func main() {
	mu := new(sync.Mutex) // ERR: 生成 Mutex 的指针, 多此一举
	mu.Lock()

	var mu1 sync.Mutex // OK: Mutex 的零值也可以正常使用, 正确的用法
	mu1.Lock()
}

```
如果将 Mutex 作为结构体中的一部分, 那么其应该作为值类型, 而不是指针类型. 
并且, 结构体的 Mutex 应该由包内部控制, 不要被外部修改, 所以不要把 mutex 直接嵌入到结构体中(匿名字段的方式[Go 编程语言规范 - Go 编程语言](https://go.dev/ref/spec#Struct_types)).
错误示例:
``` GO
package main

import "sync"

type SMap struct {
	sync.Mutex // 没有 key, 在 struct 中视为匿名字段和提升字段, 提升字段会导致暴露方法给外部调用者
	data       map[string]string
}

func NewSMap() *SMap {
	return &SMap{
		// 因为 Mutex 零值直接可以使用, 所以初始化时不需要初始化 Mutex
		data: make(map[string]string),
	}
}

func (m *SMap) Get(k string) string {
	m.Lock()
	defer m.Unlock()

	return m.data[k]
}
```
正确示例:
``` GO
package main

import "sync"

type SMap struct {
	mu sync.Mutex // 设置为普通字段, 设置为私有的, 防止外部调用, 只能让模块内部调用
	data map[string]string
}

func NewSMap() *SMap {
	return &SMap{
		// 因为 Mutex 零值直接可以使用, 所以初始化时不需要初始化 Mutex
		data: make(map[string]string),
	}
}

func (m *SMap) Get(k string) string {
	m.mu.Lock()
	defer m.mu.Unlock()

	return m.data[k]
}
```
## 拷贝 Slices 和 Maps
Slices 和 Maps 内部保存的事指向底层数据的指针, 因此涉及到他们的复制时, 需要特别的注意
### 将 Slices 作为函数参数和返回值
当 map 和 slice 作为函数参数使用时, 如果存储了他们的引用, 则外部对他的修改, 也会造成内部的数据错乱
``` Go
package main

import "fmt"

type Driver struct {
	trips []int
}

func (d *Driver) SetTrips(trips []int) {
	// 直接将slice存储进自身
	d.trips = trips // ERR: 存在外部修改可能
}

func (d *Driver) GetTrips() []int {
	// 直接返回 slice
	return d.trips // ERR: 存在外部修改可能
}

func main() {
	d := Driver{}
	gt := []int{0, 1, 2, 3}
	d.SetTrips(gt)
	fmt.Println(d.GetTrips()) // [0 1 2 3]
	gt[0] = 5                 // ERR: 在外部修改了 Driver 的数据, 这是你想要的吗?
	fmt.Println(d.GetTrips()) // [5 1 2 3]
	rgt := d.GetTrips()       // 获取内部的 slice
	rgt[0] = 6                // ERR: 在外部修改了 Driver 的数据, 这是你想要的吗?
	fmt.Println(d.GetTrips()) // [6 1 2 3]
}

```
我们可以借用`copy`函数, 进行 copy, 防止引用出现
``` Go
package main

import "fmt"

type Driver struct {
	trips []int
}

func (d *Driver) SetTrips(trips []int) {
	d.trips = make([]int, len(trips)) // 创建长度为参数长度的新切片
	copy(d.trips, trips)              // OK: 使用 copy, 复制值而不是直接引用
}

func (d *Driver) GetTrips() []int {
	res := make([]int, len(d.trips)) // 创建长度为参数长度的新切片
	copy(res, d.trips)               // 使用 copy, 复制内部值而不是直接返回内部引用
	return res                       // OK: 外部修改不会影响内部
}

func main() {
	d := Driver{}
	gt := []int{0, 1, 2, 3}
	d.SetTrips(gt)
	fmt.Println(d.GetTrips()) // [0 1 2 3]
	gt[0] = 5                 // OK: 在外部修改了 Driver 的数据, 不影响内部
	fmt.Println(d.GetTrips()) // [0 1 2 3]
	rgt := d.GetTrips()       // 获取内部的 slice
	rgt[0] = 6                // OK: 在外部修改了 Driver 的数据, 不影响内部
	fmt.Println(d.GetTrips()) // [0 1 2 3]
}

```
### 将 map 作为函数参数和返回值
同样的, map 也有这个问题
``` Go
package main

import "fmt"

type Driver struct {
	trips map[string]int
}

func (d *Driver) SetTrips(trips map[string]int) {
	// 直接将 map 存储进自身
	d.trips = trips // ERR: 存在外部修改可能
}

func (d *Driver) GetTrips() map[string]int {
	// 直接返回 map
	return d.trips // ERR: 存在外部修改可能
}

func main() {
	d := Driver{}
	gt := make(map[string]int)
	gt["0"] = 0
	gt["1"] = 1
	d.SetTrips(gt)
	fmt.Println(d.GetTrips()) // map[0:0 1:1]
	gt["0"] = 5               // ERR: 在外部修改了 Driver 的数据, 这是你想要的吗?
	fmt.Println(d.GetTrips()) // map[0:5 1:1]
	rgt := d.GetTrips()       // 获取内部的 map
	rgt["0"] = 6              // ERR: 在外部修改了 Driver 的数据, 这是你想要的吗?
	fmt.Println(d.GetTrips()) // map[0:6 1:1]
}

```
对于 map, 没有内置的 copy 函数, 我们可以手动赋值达到效果
``` Go
package main

import "fmt"

type Driver struct {
	trips map[string]int
}

func (d *Driver) SetTrips(trips map[string]int) {
	d.trips = make(map[string]int, len(trips)) // make
	for k, v := range trips {                  // 使用循环来赋值
		d.trips[k] = v
	}
}

func (d *Driver) GetTrips() map[string]int {
	res := make(map[string]int, len(d.trips))
	for k, v := range d.trips {
		res[k] = v
	}
	return res
}

func main() {
	d := Driver{}
	gt := make(map[string]int)
	gt["0"] = 0
	gt["1"] = 1
	d.SetTrips(gt)
	fmt.Println(d.GetTrips()) // map[0:0 1:1]
	gt["0"] = 5               // OK: 在外部修改了 Driver 的数据, 这是你想要的吗?
	fmt.Println(d.GetTrips()) // map[0:0 1:1]
	rgt := d.GetTrips()       // 获取内部的 map
	rgt["0"] = 6              // OK: 在外部修改了 Driver 的数据, 这是你想要的吗?
	fmt.Println(d.GetTrips()) // map[0:0 1:1]
}
```
## 使用 defer 释放资源
defer 在函数返回之前执行, 所以我们可以利用 defer 进行资源的释放
**错误示例**
``` Go
package main

import "sync"

func test(count int) int {
	mu := sync.Mutex{}
	mu.Lock()
	count++
	mu.Unlock() // ERR: 手动关闭, 很容易遗忘, 且针对多个分支处理, 容易遗忘
	// 当有多个 return 分支时，很容易遗忘 unlock
	return 1
}
```
**正确示例**
``` Go
package main

import "sync"

func test(count int) int {
	mu := sync.Mutex{}
	mu.Lock()
	defer mu.Unlock()  // OK: 注册 defer, 后续无需操心解锁时机
	count++
	return 1
}
```
defer 对于程序的开销非常小, 只有确定真的对函数的执行时间控制为纳秒单位时, 才不使用 defer. 普通情况下, 使用 defer 来保持代码整洁性是十分推荐的.
## channel 的 size 设置为无缓冲或者1
channel 的 size 通常是1或者是无缓冲的, 默认情况下, channel 应该是无缓冲的, 因为 channel 的大小是无法改变的, 所以一般我们尽可能的希望其中不要存储数据, 只作为传输. 可以设置为 1 做一个最小的冗余, 而设置为其他大小时, 必须要考虑是什么让你必须选择有其他缓冲长度的通道? 是否可以通过别的方式解决?
**错误示例**
``` Go
package main

func test(count int) {
	c := make(chan int, 1024)  // ERR: 为什么要这样做?
}
```
**正确示例**
``` Go
package main

func test(count int) {
	c := make(chan int, 1) // OK: 只设置1个冗余
	c1 := make(chan int)   // OK: 无缓冲
}
```
## 枚举从 1 开始
go 中使用枚举的方式是声明一个自定义的类型和一个`iota`的`const`组, 因为变量默认值为0, 因此枚举的一组通常以0值开始, 但是有时候, 0 有着特殊的意义, 比如 int 的默认值就为0, 因此将枚举设置为1开始可以防止可能出现的错误值进行枚举
**错误示例**
``` Go
package main

import "fmt"

type Operation int // int 类型枚举

const (
	Add Operation = iota
	Subtract
	Multiply
)

// Add=0, Subtract=1, Multiply=2

func (o Operation) ToString() string {
	res := ""
	switch o {
	case Add:
		res = "Add"
	case Subtract:
		res = "Subtract"
	case Multiply:
		res = "Multiply"
	}
	return res
}

func main() {
	var o Operation // 默认为0
	// 这里因为遗漏, 没有正确的对 o 进行赋值
	fmt.Println(o.ToString()) // ERR: 解出来却是 Add, 只是因为int 默认为0
}

```
**正确示例**
从1开始
``` Go
package main

import "fmt"

type Operation int // int 类型枚举

const (
	Add Operation = iota + 1
	Subtract
	Multiply
)

// Add=1, Subtract=2, Multiply=3

func (o Operation) ToString() string {
	res := ""
	switch o {
	case Add:
		res = "Add"
	case Subtract:
		res = "Subtract"
	case Multiply:
		res = "Multiply"
	}
	return res
}

func main() {
	var o Operation // 默认为0
	// 这里因为遗漏, 没有正确的对 o 进行赋值
	fmt.Println(o.ToString()) // OK: 解出来是空, 代表错误了, 避免了 o 是默认值而错误的找到了枚举
}

```
## 使用 time 类型处理时间
[time package - time - pkg.go.dev](https://pkg.go.dev/time?utm_source=gopls)
时间的处理与计算总是复杂的, 在开发者的认知中, 可能存在以下错误:
- 一天总有24小时 [地球上的一天有多长？ (timeanddate.com)](https://www.timeanddate.com/time/earth-rotation.html)
- 一年总有365天 [年份 - 维基百科，自由的百科全书 (wikipedia.org)](https://en.wikipedia.org/wiki/Year)
- [更多->程序员相信时间的谬误](https://infiniteundo.com/post/25326999628/falsehoods-programmers-believe-about-time)
不要试图自己实现时间的计算逻辑, 时间的计算实际上是很复杂的, 而 golang 内置的 time 包已经提供了很丰富的方法, 而且可以保证准确性.
### 使用`time.Time`表示某个瞬间时间
使用`time.Time`类型表示某一刻的时间, 在 时间比较/计算 时使用内置的方法
**错误示例**
``` go
// 判断时间是否在某个时间段内
func isActive(now, start, stop int) bool {
	return start <= now && now < stop
}
```
**正确示例**
``` go
// 判断时间是否在某个时间段内
func isActive(now, start, stop time.Time) bool { // time.Time 类型
	// start.Before(now) 判断 start 是否在 now 之前
	// start.Equal(now) 判断 now 是否与 start 相同
	// now.Before(stop) 判断 now 是否在 stop 之前
	return (start.Before(now) || start.Equal(now)) && now.Before(stop)
}
```
### 使用`time.Duration`表达时间段
使用`time.Duration`来表达某个时间段, 而不是其他数据类型
**错误示例**
``` go
package main

import "time"

func poll(delay int) {
	for {
		// sleep delay 毫秒
		time.Sleep(time.Duration(delay) * time.Millisecond)
	}
}

func main() {
	poll(10) // 调用者只能通过注释和查看源代码来确认参数 delay 代表毫秒还是秒
}

```
**正确示例**
``` go
package main

import "time"

func poll(delay time.Duration) {
	for {
		// ...
		time.Sleep(delay)
	}
}

func main() {
	poll(10 * time.Second) // 调用者自己决定 sleep 多久
}

```
### 时间加减
时间的加减一定不要自己实现, 需要考虑的情况太多了
对于日期的加减, 我们可以使用 `time.Time`的`AddDate`方法, 而对于时间的加减, 使用`Time.Add`
**正确示例**
``` go
package main

import (
	"fmt"
	"time"
)

func main() {
	t := time.Now() // 获取当前时间
	fmt.Println(t)
	newDay := t.AddDate(0 /* years */, 1 /* months */, 1 /* days */) // +1月+1天
	fmt.Println(newDay)
	newDay1 := t.AddDate(0 /* years */, -1 /* months */, 1 /* days */) // +1月-1天
	fmt.Println(newDay1)
	maybeNewDay := t.Add(24 * time.Hour) // +24h
	fmt.Println(maybeNewDay)
	maybeNewDay1 := t.Add(-24 * time.Second) // -24s
	fmt.Println(maybeNewDay1)
}

```
输出结果:
``` bash
2022-05-17 16:27:33.394981 +0800 CST m=+0.000059114
2022-06-18 16:27:33.394981 +0800 CST
2022-04-18 16:27:33.394981 +0800 CST
2022-05-18 16:27:33.394981 +0800 CST m=+86400.000059114
2022-05-17 16:27:09.394981 +0800 CST m=-23.999940886
```
### 在对外部的系统中使用`time.Time`和`time.Duration`
尽可能的在与外部系统的交互中使用`time.Time`和`time.Duration`, 例如:
-   Command-line 标志: [`flag`](https://golang.org/pkg/flag/) 通过 [`time.ParseDuration`](https://golang.org/pkg/time/#ParseDuration) 支持 `time.Duration`
-   JSON: [`encoding/json`](https://golang.org/pkg/encoding/json/) 通过其 [`UnmarshalJSON` method](https://golang.org/pkg/time/#Time.UnmarshalJSON) 方法支持将 `time.Time` 编码为 [RFC 3339](https://tools.ietf.org/html/rfc3339) 字符串
-   SQL: [`database/sql`](https://golang.org/pkg/database/sql/) 支持将 `DATETIME` 或 `TIMESTAMP` 列转换为 `time.Time`，如果底层驱动程序支持则返回
-   YAML: [`gopkg.in/yaml.v2`](https://godoc.org/gopkg.in/yaml.v2) 支持将 `time.Time` 作为 [RFC 3339](https://tools.ietf.org/html/rfc3339) 字符串，并通过 [`time.ParseDuration`](https://golang.org/pkg/time/#ParseDuration) 支持 `time.Duration`
对于`time.Time`, 其他语言一般也都会支持解析, 因为他是统一的标准, 而对于`time.Duration`, 如果不支持, 请使用`int`或者`float64`, 并且在字段名称中包含单位.
例如, `json`不支持`time.Duration`, 因此使用`int`替代, 并且将单位包含在名称中, 提高可读性
**错误示例**
``` go
package main

import (
	"encoding/json"
	"log"
	"time"
)

type Task struct {
	StartTime time.Time `json:"start_time"`
	Timeout   int       `json:"timeout"` // 这里是秒还是毫秒?
}

func main() {
	t := Task{
		StartTime: time.Now(),
		Timeout:   int((time.Second * 30).Seconds()),
	}
	s, err := json.Marshal(t)
	if err != nil {
		log.Fatalln(err)
	}
	log.Println(string(s))
}

```

``` bash
2022/05/17 17:05:42 {"start_time":"2022-05-17T17:05:42.356961+08:00","timeout":30}
```

**正确示例**
``` go
package main

import (
	"encoding/json"
	"log"
	"time"
)

type Task struct {
	StartTime     time.Time `json:"start_time"`
	TimeoutSecond int       `json:"timeout_second"` // 字段名就可以明白是秒
}

func main() {
	t := Task{
		StartTime:     time.Now(),
		TimeoutSecond: int((time.Second * 30).Seconds()),
	}
	s, err := json.Marshal(t)
	if err != nil {
		log.Fatalln(err)
	}
	log.Println(string(s))
}

```

``` bash
2022/05/17 17:07:26 {"start_time":"2022-05-17T17:07:26.147585+08:00","timeout_second":30}
```

当在这些交互中不能使用 `time.Time` 时, 除非达成一致, 否则使用 `string` 和 [RFC 3339](https://tools.ietf.org/html/rfc3339) 中定义的格式时间戳. 默认情况下, [`Time.UnmarshalText`](https://golang.org/pkg/time/#Time.UnmarshalText) 使用此格式, 并可通过 [`time.RFC3339`](https://golang.org/pkg/time/#RFC3339) 在 `Time.Format` 和 `time.Parse` 中使用

需要注意的是, `"time"` 包不支持解析闰秒时间戳[8728](https://github.com/golang/go/issues/8728), 也不在计算中考虑闰秒[15190](https://github.com/golang/go/issues/15190), 如果比较两个时间瞬间，则差异将不包括这两个瞬间之间可能发生的闰秒。
## Errors
对于 error 的使用, 有几种方式, 有各自的优缺点, 在选择之前, 先考虑具体的情况:
- 对于调用者, 是否需要匹配错误信息以便处理? 如果需要, 则必须通过声明顶级的错误变量或者自定义类型来支持`errors.Is`或`errors.As`函数
- 错误消息是静态的字符串, 还是存储有上下文信息的动态字符串? 如果是静态字符串, 可以使用`errors.New`, 如果是动态, 必须使用`fmt.Errorf`或者自定义的错误类型
- 错误是否是我们的下游返回的错误? 如果是, 参阅之后的**错误包装**部分

| 是否需要错误匹配 | 错误类型 | 使用 |
| ---------------- | -------- | ---- |
| NO               | 静态     |   [`errors.New`](https://golang.org/pkg/errors/#New)   |
| NO               | 动态     |   [`fmt.Errorf`](https://golang.org/pkg/fmt/#Errorf)   |
|           YES       |     静态     |   [`errors.New`](https://golang.org/pkg/errors/#New) 或者自定义顶级错误   |
|              YES    |        动态  |   自定义错误类型   |
**不需要错误匹配的静态错误**
``` go
package main

import "errors"

// 假设这是你写的一个包

func Open() error {
	return errors.New("could not open") // new 一个静态的错误返回
}

func main() {
	// 假设这是调用者
	if err := Open(); err != nil {
		panic("unknown error")
	}
}

```
**不需要错误匹配的动态错误**
``` go
package main

import (
	"fmt"
)

// 假设这是你写的一个包

func Open(file string) error {
	return fmt.Errorf("file %q not found", file) // 返回 format 后的错误
}

func main() {
	// 假设这是调用者
	if err := Open("demo.txt"); err != nil {
		// Can't handle the error.
		panic("unknown error")
	}
}

```
**需要错误匹配的静态错误**
``` go
package main

import "errors"

// 假设这是你写的一个包

var ErrCouldNotOpen = errors.New("could not open") // 定义一个静态错误类型, 需要是可以导出的

func Open() error {
	return ErrCouldNotOpen // 返回指定的错误类型
}

func main() {
	// 假设这是调用者
	if err := Open(); err != nil {
		if errors.Is(err, ErrCouldNotOpen) { // errors.Is 判断错误是否是指定的错误类型
			// handle the error
		} else {
			panic("unknown error")
		}
	}
}

```
**需要错误匹配的动态错误**
``` go
package main

import (
	"errors"
	"fmt"
)

// 假设这是你写的一个包

type NotFoundError struct { // 定义一个结构体, 为错误使用, 需要设置为外部可使用
	File string // 动态部分
}

func (e *NotFoundError) Error() string { // error 方法, 传出 format 后的错误信息
	return fmt.Sprintf("file %q not found", e.File) // 动态信息 format
}

func Open(file string) error {
	return &NotFoundError{File: file} // return时发现是 error类型, 会自动调 Error 方法
}

func main() {
	// 假设这是调用者
	if err := Open("demo.txt"); err != nil {
		var notFound *NotFoundError
		if errors.As(err, &notFound) { // errors.As 判断错误是否是这个结构体的方法
			// handle the error
		} else {
			panic("unknown error")
		}
	}
}

```
### 错误包装
当这个错误是我们的下游返回的错误, 我们需要将错误返回给更上级时, 我们有三种选择:
- 按照原样返回错误
- 使用 fmt.Errorf 搭配 %w 将错误添加进上下文后返回
- 使用 fmt.Errorf 搭配 %v 将错误添加进上下文后返回
如果你没有需要添加的其他上下文, 则直接原样返回错误即可, 这样保留了原始错误类型和消息, 适合上游进行错误追踪, 非常适合底层的错误
否则, 则需要尽可能的在错误消息里添加上下文, 这样可以防止模糊的错误信息, 比如`connection refused`之类的, 他应该是更详细的, 例如`call service foo: connection refused`
此时你需要使用`fmt.Errorf`来生成一个包含上下文的错误, 那么如何选择`%w`和`%v`?
- 如果调用者可以访问底层的错误, 使用`%w`, `%w`可以在传递之后, 外部的调用者依旧可以使用`errors.Is`来进行错误的匹配, 更多情况下, `%w`更推荐使用
- `%v`会将下游错误进行混淆,导致上游无法进行错误匹配, 如果可以修改, 将他切换到`%w`
在生成错误信息时, 记得避免加上`failed to` 之类的描述来保证错误信息的简洁, 因为他在返回时, 就已经默认是错误信息, 不需要特别的指出, 另外当错误通过堆栈一层层向上返回时, 加入过多的描述会导致错误信息错乱不堪, 无法辨认
### `%v`导致的错误示例:
``` go
package main

import (
	"errors"
	"fmt"
)

// 假设这是最下游的一个包

var ErrCouldNotOpen = errors.New("could not open") // 定义一个静态错误类型, 需要是可以导出的

func Open() error {
	return ErrCouldNotOpen // 返回指定的错误类型
}

// 这是中层的包

func Demo() error {
	if err := Open(); err != nil {
		return fmt.Errorf("open: %v", err) // 返回给上层, %v 将错误信息覆盖
	}
	return nil
}

func main() {
	// 假设这是调用者
	if err := Demo(); err != nil {
		if errors.Is(err, ErrCouldNotOpen) { // errors.Is 判断错误是否是指定的错误类型, %v 覆盖了错误类型, 导致判断失败, Panic
			// handle the error
		} else {
			panic("unknown error")
		}
	}
}

```
**正确示例**
``` go
package main

import (
	"errors"
	"fmt"
)

// 假设这是最下游的一个包

var ErrCouldNotOpen = errors.New("could not open") // 定义一个静态错误类型, 需要是可以导出的

func Open() error {
	return ErrCouldNotOpen // 返回指定的错误类型
}

// 这是中层的包

func Demo() error {
	if err := Open(); err != nil {
		// 加入的上下文只有 open: 让调用者知道是 open 时的错误即可
		return fmt.Errorf("open: %w", err) // 返回给上层, %v 将错误信息带入返回
	}
	return nil
}

func main() {
	// 假设这是调用者
	if err := Demo(); err != nil {
		if errors.Is(err, ErrCouldNotOpen) { // errors.Is 判断错误是否是指定的错误类型, 判断成功
			// handle the error
		} else {
			panic("unknown error")
		}
	}
}

```
需要注意的是, 如果错误信息需要传送到另一个系统, 例如日志收集, 就需要明确告诉这是个错误信息
另外, 遇到错误, 不要选择忽略他[不要只是检查错误，而是优雅地处理它们|戴夫·切尼 (cheney.net)](https://dave.cheney.net/2016/04/27/dont-just-check-errors-handle-them-gracefully)  // TODO, 这里有空翻译一下
### 错误命名
对于存储为全局变量的错误类型, 根据是否需要导出, 统一加入前缀`Err`或者`err`
``` go
var (
	// 导出以下两个错误，以便此包的用户可以将它们与 errors.Is 进行匹配。
	// 统一使用 Err 作为前缀

	ErrBrokenLink   = errors.New("link is broken")
	ErrCouldNotOpen = errors.New("could not open")

	// 这个错误没有被导出，因为我们不想让它成为我们公共 API 的一部分。 我们可能仍然在带有错误的包内使用它。
	// 统一使用 err 作为前缀

	errNotFound = errors.New("not found")
)
```
对于自定义的错误类型, 统一加入后缀`Error`
``` go
// 同样，这个错误被导出，以便这个包的用户可以将它与 errors.As 匹配。

type NotFoundError struct {
	File string
}

func (e *NotFoundError) Error() string {
	return fmt.Sprintf("file %q not found", e.File)
}

// 并且这个错误没有被导出，因为我们不想让它成为公共 API 的一部分。 我们仍然可以在带有 errors.As 的包中使用它。
type resolveError struct {
	Path string
}

func (e *resolveError) Error() string {
	return fmt.Sprintf("resolve %q", e.Path)
}

```
## 断言处理失败
go 的类型断言会在失败时, 以单一返回值形式返回 panic, 因此, 使用 `, ok` 方式防止 panic
**错误示例**
``` go
package main

import "fmt"

func main() {
	var s interface{}
	s = 1
	t := s.(string)  // panic
	fmt.Println(t)
}

```
**正确示例**
``` go
package main

import (
	"fmt"
	"log"
)

func main() {
	var s interface{}
	s = 1
	t, ok := s.(string) // !ok, 不会 panic
	if !ok {
		log.Fatalln("error")
	}
	fmt.Println(t)
}

```
## 不要使用 panic
在生产环境运行的代码必须避免出现 panic, panic 会导致整个程序崩溃, 如果发生错误, 函数必须捕捉并返回错误, 让调用方来进行处理
**错误示例**
``` go
func run(args []string) {
  if len(args) == 0 {
    panic("an argument is required")  // panic, 程序崩溃
  }
  // ...
}

func main() {
  run(os.Args[1:])
}
```
**正确示例**
``` go
func run(args []string) error {
  if len(args) == 0 {
    return errors.New("an argument is required")  // 不符合预期的逻辑, 捕捉以 error 方式返回, 而不是 panic
  }
  // ...
  return nil
}

func main() {
  if err := run(os.Args[1:]); err != nil {  // 调用方处理错误
    fmt.Fprintln(os.Stderr, err)
    os.Exit(1)
  }
}
```
`panic/recover`不是经常使用的错误处理策略, 仅仅在发生不可恢复的事情(比如空指针)时才 panic, 有一个例外: 程序的初始化时发生某些致命错误可能会 panic(比如数据库连接解析错误)
即使在测试代码中, 也不要使用 panic, 应该使用`t.Fatal`或者`t.FailNow`来确保失败被标记
**错误示例**
``` go
// func TestFoo(t *testing.T)

f, err := ioutil.TempFile("", "test")
if err != nil {
  panic("failed to set up test")
}
```
**正确示例**
``` go
// func TestFoo(t *testing.T)

f, err := ioutil.TempFile("", "test")
if err != nil {
  t.Fatal("failed to set up test")
}
```
## 使用 go.uber.org/atomic
go 语言内置了一部分原始数据类型的原子操作功能, 实现在包  [sync/atomic](https://golang.org/pkg/sync/atomic/) 中, 原子操作可以防止资源竞争导致可能出现的错误, 但是开发者很容易忘记使用这些原子操作.
[go.uber.org/atomic](https://godoc.org/go.uber.org/atomic) 通过隐藏基础类型为这些操作增加了类型安全性。此外，它包括一个方便的`atomic.Bool`类型
## 避免可变的全局变量
//  TODO
[guide/style.md at master · uber-go/guide (github.com)](https://github.com/uber-go/guide/blob/master/style.md#avoid-mutable-globals)
## 避免在公共结构中嵌入类型
直接在公共结构体中嵌入类型会导致这个类型的实现细节暴露出去, 导致分层失败, 同时还会对以后可能的迭代产生阻碍, 同时不利于文档的编写
假设有一个结构体 `AbstractList`, 实现了`Add`和`Remove`方法
``` go
type AbstractList struct{}

func (l *AbstractList) Add(s string) {
	// ...
}

func (l *AbstractList) Remove(s string) {
	// ...
}


func (l *AbstractList) Clean() {
	// ...
}

```
当开发者需要在上游的结构体中使用该类型时, 注意不要直接嵌入这个类型, 例如
**错误示例**
``` go
package main

type AbstractList struct{}

func (l *AbstractList) Add(s string) {
	// ...
}

func (l *AbstractList) Remove(s string) {
	// ...
}


func (l *AbstractList) Clean() {
	// ...
}


// ConcreteList 是一个实体列表。
// ConcreteList 是公开的结构体
type ConcreteList struct {
	*AbstractList  // 直接嵌入类型
}

func main(){
	c := ConcreteList{}
	c.Add("1")  // 外部可以直接调用 *AbstractList 的方法, 导致分层失败
	c.Remove("1")
	c.Clean()
}

```
**正确示例**
正确的做法应该是作为结构体的某一个字段使用
``` go
package main

type AbstractList struct{}

func (l *AbstractList) Add(s string) {
	// ...
}

func (l *AbstractList) Remove(s string) {
	// ...
}


func (l *AbstractList) Clean() {
	// ...
}


// ConcreteList 是一个实体列表。
// ConcreteList 是公开的结构体
type ConcreteList struct {
	list *AbstractList // 直接嵌入类型
}

// 分层
func (l *ConcreteList) Add(s string) {
	// 做一些其他事情, 例如校验
	l.list.Add(s)
}

// 分层
func (l *ConcreteList) Remove(s string) {
	// 做一些其他事情, 例如校验
	l.list.Remove(s)
}

func main() {
	c := ConcreteList{}
	c.Add("1") // 调用的是 *ConcreteList 本身的方法
	c.Remove("1")
	c.Clean()  // 调用失败, 因为我不希望你使用
}
```
分层可以为之后可能出现的其他逻辑留下空间, 避免之后新的需求到来之时对现有的代码进行结构上的破坏性改动, 同时也可以避免将某些其他的方法暴露出来
即使`AbstractList`是接口, 也应该保持同样的做法, 道理是一样的
## 避免使用内置的名称
Go [语言规范](https://golang.org/ref/spec) 概述了几个内置的， 不应在 Go 项目中使用的 [预先声明的标识符](https://golang.org/ref/spec#Predeclared_identifiers)。
根据上下文的不同，将这些标识符作为名称重复使用， 将在当前作用域（或任何嵌套作用域）中隐藏原始标识符，或者混淆代码。 在最好的情况下，编译器会报错；在最坏的情况下，这样的代码可能会引入潜在的、难以恢复的错误。
**错误示例**
``` go
var error string  // 覆盖了 error
// `error` 本身的作用域隐式覆盖

// 在函数里 error 也被覆盖
func handleErrorMessage(error string) {
    // `error` 作用域隐式覆盖
}

type Foo struct {
    // 虽然这些字段在技术上不构成隐式覆盖，但`error`或`string`字符串在使用中可能会出现覆盖
    error  error
    string string
}

func (f Foo) Error() error {
    // `error` 和 `f.error` 在视觉上是相似的
    return f.error
}

func (f Foo) String() string {
    // `string` and `f.string` 在视觉上是相似的
    return f.string
}
```
**正确示例**
``` go
var errorMessage string
// `error` 不会被覆盖


func handleErrorMessage(msg string) {
    // `error` 不会被覆盖
}

type Foo struct {
    // `error` and `string` 现在是明确的。
    err error
    str string
}

func (f Foo) Error() error {
    return f.err
}

func (f Foo) String() string {
    return f.str
}
```
注意, 编译器在使用预先分隔的标识符时不会生成错误, 但是诸如`go vet`之类的工具会正确地指出这些和其他情况下的隐式问题
## 避免使用 `init()`
开发者的代码中应该避免使用`init()`, 当你认为`init()`是必须需要的, 你应该先确认:
- 函数内的处理结果无论程序环境或调用如何, 都是完全确定的
- 避免依赖于其他init()函数的顺序或结果. 虽然此刻多个init()顺序是明确的, 但代码可能被更改, 因此init()函数之间的关系可能会使代码变得脆弱和容易出错.
   - 避免访问或操作全局或环境状态，如机器信息、环境变量、工作目录、程序参数/输入等
- 避免I/O，包括文件系统、网络和系统调用
**错误示例**
``` go
// package a
type Foo struct {
    // ...
}
var _defaultFoo Foo
func init() {
	// init 中初始化变量
    _defaultFoo = Foo{
        // ...
    }
}

// package b
type Config struct {
    // ...
}
var _config Config
func init() {
    // 获取当前目录
    cwd, _ := os.Getwd()
    // 读取目录下文件
    raw, _ := ioutil.ReadFile(
        path.Join(cwd, "config", "config.yaml"),
    )
    yaml.Unmarshal(raw, &_config)
}
```
**正确示例**
``` go
var _defaultFoo = Foo{
    // ...
}
// 使用函数来进行初始化
var _defaultFoo = defaultFoo()
func defaultFoo() Foo {
    return Foo{
        // ...
    }
}

type Config struct {
    // ...
}
// 开发者手动调用相关函数而不是让其自动执行
func loadConfig() Config {
    cwd, err := os.Getwd()
    // handle err
    raw, err := ioutil.ReadFile(
        path.Join(cwd, "config", "config.yaml"),
    )
    // handle err
    var config Config
    yaml.Unmarshal(raw, &config)
    return config
}
```
考虑到上述情况，在某些情况下，init()可能更可取或是必要的，可能包括：
- 不能表示为单个赋值的复杂表达式。
- 可插入的钩子，如database/sql、编码类型注册表等。
- 对 Google Cloud Functions 和其他形式的确定性预计算的优化, 例如`regexp.MustCompile`(编译正则表达式)
## 切片追加时优先指定容量
在切片需要追加时, 尽可能的预先估算出最大容量, 并在 make 时就指定其容量
目的是减少切片动态扩容带来的时间损耗
**错误示例**
``` go
package main

import (
	"fmt"
	"time"
)

func main() {
	s := time.Now()
	size := 100000000
	data := make([]int, 0)
	fmt.Println(cap(data))
	for k := 0; k < size; k++ {
		data = append(data, k)
	}
	fmt.Println(cap(data))
	fmt.Println(time.Since(s)) // 所需时长
}

```

``` bash
0
114748416
1.532827648s
```

**正确示例**
``` go
package main

import (
	"fmt"
	"time"
)

func main() {
	s := time.Now()
	size := 100000000
	data := make([]int, 0, size) // 指定容量为 size
	fmt.Println(cap(data))
	for k := 0; k < size; k++ {
		data = append(data, k)
	}
	fmt.Println(cap(data))
	fmt.Println(time.Since(s)) // 所需时长
}

```

``` bash
100000000
100000000
333.793275ms
```

## 主函数的退出方式
go 程序使用`os.Exit`或者`log.Fatal`来进行立即退出, 永远记住, 不要使用`panic`来进行退出
并且, 只在`main()`中调用`os.Exit`和`log.Fatal`, 对于其他函数的退出, 要将错误信息返回出来
**错误示例**
``` go
package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
)

func main() {
	body := readFile("a.txt")
	fmt.Println(body)
}

func readFile(path string) string {
	defer func() {
		fmt.Println("假如这里进行一些其他清理操作")
	}()
	f, err := os.Open(path)
	if err != nil {
		log.Fatal(err)
	}
	b, err := ioutil.ReadAll(f)
	if err != nil {
		// 发送错误, 使用 log.Fatal 退出
		log.Fatal(err)
	}
	return string(b)
}

```
运行后, 发现, defer 中注册的操作无法执行
``` bash
2022/06/13 19:21:11 open a.txt: no such file or directory
exit status 1
```
在其他函数中通过以上两种方式直接退出程序有几个隐患:
- 不明显的控制流: 任何函数都可以导致程序退出, 因此很难对处理逻辑进行控制和分析
- 难以测试: 如果你的test 测试代码调用了函数, 而在函数内导致程序退出, 同样导致整个测试流程退出, 无法继续进行
- 跳过清理: 一般的, 我们使用 defer 来进行一些资源清理操作, 例如连接的关闭, 文件句柄关闭等, 但是当函数直接退出时, defer 中的代码不会被执行
**正确示例**
``` go
package main

import (
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"os"
)

func main() {
	if err := run(); err != nil {
		// 主函数进行退出
		log.Fatal(err)
	}
}
func run() error {
	defer func() {
		fmt.Println("资源回收")
	}()
	args := os.Args[1:]
	if len(args) != 1 {
		return errors.New("missing file")
	}
	name := args[0]
	f, err := os.Open(name)
	if err != nil {
		return err
	}
	defer f.Close()
	b, err := ioutil.ReadAll(f)
	if err != nil {
		return err
	}
	// ...
	fmt.Println(b)
	return nil
}

```

``` bash
资源回收
2022/06/13 19:30:29 missing file
exit status 1
```
### 一次性退出
如果可以的话, 在每个`main()`中最多调用一次`os.Exit`或者`log.Fatal`, 如果有多个错误场景, 应该将程序结束, 此时应该将逻辑单独放置在单独的错误函数中, 通过返回错误来让 main 来进行退出, 这样会缩短 main 函数, 同时将关键业务逻辑放置在了单独的, 可以进行测试的函数中
**错误示例**
``` go
package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
)

func main() {
	args := os.Args[1:]
	if len(args) != 1 {
		log.Fatal("missing file")
	}
	name := args[0]
	f, err := os.Open(name)
	if err != nil {
		// fatal
		log.Fatal(err)
	}
	defer f.Close()
	defer func() {
		fmt.Println("清理")
	}()
	b, err := ioutil.ReadAll(f)
	if err != nil {
		// defer 同样并不会被执行
		log.Fatal(err)
	}
	// ...
	fmt.Println(b)
}

```
**正确示例**
``` go
package main

import (
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"os"
)

func main() {
	if err := run(); err != nil {  // 统一进行判断
		log.Fatal(err)
	}
}
func run() error {
	args := os.Args[1:]
	if len(args) != 1 {
		// err 0
		return errors.New("missing file")
	}
	name := args[0]
	f, err := os.Open(name)
	if err != nil {
		// err 1
		return err
	}
	defer f.Close()
	b, err := ioutil.ReadAll(f)
	if err != nil {
		// err 2
		return err
	}
	// ...
	fmt.Println(b)
	return nil
}

```
### 在序列化的结构体中使用 tag
任何序列化到 json/YAML 或者其他支持基于 tag 来进行字段命名的格式, 都应该使用 tag 来进行注释
因为, 结构的序列化方式, 是不同系统之间交流的约定, 而对字段的修改会导致破坏约定. 使用加入 tag 的方式, 可以使约定更加明确和易读. 并且在重构和重命名字段时, 只要不动 tag, 就无需重新约定结构
**错误示例**
``` go
package main

import (
	"encoding/json"
	"fmt"
)

func main() {
	type Stock struct {
		// json 在没有 tag 时默认按照字段名
		// 当后续字段名有调整导致 json 结构发生变化
		Price int
		Name  string
	}
	bytes, err := json.Marshal(Stock{
		Price: 137,
		Name:  "UBER",
	})
	fmt.Println(err)
	fmt.Println(string(bytes))
}

```
**正确示例**
``` go
package main

import (
	"encoding/json"
	"fmt"
)

func main() {
	type Stock struct {
		// json 根据 json tag 来进行命名
		// 当后续字段名调整, 只要 tag 不动, 则无需重新约定 json 结构
		Price int    `json:"price"`
		Name  string `json:"name"`
	}
	bytes, err := json.Marshal(Stock{
		Price: 137,
		Name:  "UBER",
	})
	fmt.Println(err)
	fmt.Println(string(bytes))
}

```