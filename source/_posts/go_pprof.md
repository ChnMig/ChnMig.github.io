---
title: go pprof 分析内存和 CPU 占用
date: 2022-08-01            
updated: 2022-08-01         
comments: true              
toc: true                   
excerpt: go pprof 进行分析
tags:                       
- Golang
categories:                 
- 编程
---
## 前言
pprof 是 golang 自带的非常好用的性能分析工具, 可以分析 CPU/内存占用等, 本篇来简单记录一下基本使用
pprof 的基本信息可见: [pprof/README.md at main · google/pprof (github.com)](https://github.com/google/pprof/blob/main/doc/README.md)
## web 版
针对长时间运行而不中断的项目, 我们想实时获取最新的分析数据, 可以使用 pprof 新增一个 http 服务, [pprof package - net/http/pprof - Go Packages](https://pkg.go.dev/net/http/pprof),  让我们可以持续的监听性能数据, 例如:
``` go
package main

import (
	"net/http"
	_ "net/http/pprof"
)

func main() {
	go func() {
		// 启动一个 goroutine, 不阻止正常代码运行
		http.ListenAndServe("localhost:6060", nil) // 使用 pprof 监听端口
	}()
	for {
		// 死循环模拟不停止的项目
	}
}
```
### CPU分析
保持分析程序未结束时, 在新的命令行运行命令
``` bash
go tool pprof -http 127.0.0.1:8848 http://localhost:6060/debug/pprof/profile\?seconds\=30
```
这命令的意思是使用 pprof 分析 http://localhost:6060/debug/pprof/profile\?seconds\=30 的数据, 当我们访问这个接口时, 会下载对应文件再分析, 比如这个网址代表最近30s 内的 cpu 运行数据, 此时会等待30s, 抓取数据, 而后会使用默认浏览器打开网址 127.0.0.1:8848 里面就展示了 cpu 运行信息, 我们可以点击上方菜单栏选择使用火焰图等方式进行展示, 具体的图表这里不放了, 看再多不如自己真实试一试.
### 内存占用分析
大体逻辑一样, 只是数据源换成了内存分析, 例如
``` bash
go tool pprof -http 127.0.0.1:8849 http://localhost:8080/debug/pprof/heap
```
### 更多
还有更多的数据类型, 比如锁分析, 堆数据, 线程追踪等, 可查看 http://localhost:6060/debug/pprof/ 查看可分析的数据类型, 使用只需替换 pprof 最后的网址即可
## runtime 版
针对执行一段时间就关闭的程序, 可以使用 [pprof package - runtime/pprof - Go Packages](https://pkg.go.dev/runtime/pprof) 来进行分析, 具体用法为在执行结束后生成 pprof 源文件, 再通过 pprof 工具来打开, 例如有代码:
``` go
package main

import (
	"flag"
	"fmt"
	"log"

	"os"
	"runtime"
	"runtime/pprof"
)

var cpuprofile = flag.String("cpuprofile", "", "write cpu profile to `file`")    // 指定 cpu 分析文件名
var memprofile = flag.String("memprofile", "", "write memory profile to `file`") // 指定 meme 分析文件名

func main() {
	flag.Parse()
	if *cpuprofile != "" {
		f, err := os.Create(*cpuprofile)
		if err != nil {
			log.Fatal("could not create CPU profile: ", err)
		}
		defer f.Close() // error handling omitted for example
		if err := pprof.StartCPUProfile(f); err != nil {
			log.Fatal("could not start CPU profile: ", err)
		}
		defer pprof.StopCPUProfile()
	}

	// ... rest of the program ...

	if *memprofile != "" {
		f, err := os.Create(*memprofile)
		if err != nil {
			log.Fatal("could not create memory profile: ", err)
		}
		defer f.Close() // error handling omitted for example
		runtime.GC()    // get up-to-date statistics
		if err := pprof.WriteHeapProfile(f); err != nil {
			log.Fatal("could not write memory profile: ", err)
		}
	}
}

```
运行代码, 同时携带参数指定保存文件
``` bash
go run main.go -cpuprofile cpu.pprof -memprofile=mem.pprof
```
随后会发现, 在项目根目录创建了同名的文件
### CPU分析
与 web 版类似, 只是源文件由http 接口下载变成了文件, 其实 http 接口也是 get 时下载对应的文件再分析
``` bash
go tool pprof -http 127.0.0.1:8848 ./cpu.pprof  
```
### 内存分析
``` bash
go tool pprof -http 127.0.0.1:8848 ./mem.pprof 
```