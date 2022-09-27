---
title: uber go code 规范(性能)
date: 2022-04-18            
updated: 2022-06-14         
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
本篇记录性能部分, 旨在特定情况下提高程序的性能
## 优先使用 `strconv`  而不是 `fmt`
将 int 转换成 string 时, 使用 `strconv` 的方法比 `fmt`  的速度更快
**错误的**
``` go
package main

import (
	"fmt"
	"strconv"
	"time"
)

func main() {
	start := time.Now()
	for i := 0; i < 10000; i++ {
		fmt.Sprintln(i)
	}
	fmt.Println(time.Now().Sub(start))
}

```
查看耗时
``` bash
➜  test go run main.go
872.779µs
```
**正确的**
``` go
package main

import (
	"fmt"
	"strconv"
	"time"
)

func main() {
	start := time.Now()
	for i := 0; i < 10000; i++ {
		strconv.Itoa(i)
	}
	fmt.Println(time.Now().Sub(start))
}
```
查看耗时
``` bash
➜  test go run main.go
233.211µs
```
## 避免字符串转换成字节
不要频繁的从固定字符串转换成字节, 而是只创建一次并将结果保存, 反复使用
**错误的**
``` go
package main

import (
	"fmt"
	"time"
)

func main() {
	start := time.Now()
	for i := 0; i < b.N; i++ {
		 w.Write([]byte("Hello world"))
	}
	fmt.Println(time.Now().Sub(start))
}

```

**正确的**

``` go
package main

import (
	"fmt"
	"time"
)

func main() {
	start := time.Now()
	data := []byte("Hello world")
	for i := 0; i < b.N; i++ {
	  w.Write(data)
	}
	fmt.Println(time.Now().Sub(start))
}

```
## 初始化 Map 和切片时预估长度
在初始化 map 和切片时, 就指定其长度, 防止 go 进行动态扩容
### map
使用 make 进行初始化时提供容量信息
``` go
make(map[T]T, len)
```
这可能会减少动态扩容的次数, 因为 go 的 map 容量不是一定准确判断, 所以只是可能减少
**错误的**
``` go
m := make(map[string]os.FileInfo)

files, _ := ioutil.ReadDir("./files")
for _, f := range files {
    m[f.Name()] = f
}
```
**正确的**
``` go

files, _ := ioutil.ReadDir("./files")

m := make(map[string]os.FileInfo, len(files))  // 直接指定长度
for _, f := range files {
    m[f.Name()] = f
}
```
### 指定切片容量
在创建切片时, 尽可能的提供容量信息
``` go
make([]T, length, capacity)
```
go 对切片的处理, 当切片长度够用时, 一定不会出现分配操作, 节省时间
**错误的**
``` go
for n := 0; n < b.N; n++ {
  data := make([]int, 0)  // 长度为0
  for k := 0; k < size; k++{
    data = append(data, k)  // 长度不够时进行扩容
  }
}
```
**正确的**
``` go
for n := 0; n < b.N; n++ {
  data := make([]int, 0, size)  // 指定 size
  for k := 0; k < size; k++{
    data = append(data, k)  // 永远不会扩容
  }
}
```