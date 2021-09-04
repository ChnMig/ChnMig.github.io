---
title: 使用Cron定时任务模块     
date: 2021-09-04            
updated: 2021-09-04         
comments: true              
toc: true                   
excerpt: 介绍Go项目中很出名的定时任务模块Cron
tags:                       
- Golang
categories:                 
- 编程
---

# 使用Cron定时任务模块

新项目是Golang作为开发语言, 遇到了些新的坑, 也学到了新的知识, 收获颇丰

本章介绍在Go中使用Cron定时任务模块来实现逻辑

在项目中, 我们往往需要定时执行一些逻辑, 举个例子, 财务系统每月需要自动的总结报表发生到指定邮箱, 生成饼图存储等逻辑, 作为服务方, 我们必须维护一个定时任务系统来做到定时触发任务执行

下面介绍Go项目中很出名的定时任务模块, [Cron](https://github.com/robfig/cron) 他的star目前有7.2k(截止到本章发出)

下面我们来了解如何使用, 以Demo为例

``` go
package task

import (
	"fmt"
	"remoteAdmin/tools"

	"github.com/robfig/cron/v3"
)

var myCron *cron.Cron

// InitAndStart init cron task
func InitAndStart() {
	myCron = cron.New()
	defer myCron.Stop().Done()
	// c.AddFunc
	// https://en.wikipedia.org/wiki/Cron
	userOfflineDetectionTaskID, err := myCron.AddFunc(fmt.Sprintf("*/%v * * * *", tools.EnvConfig.Cron.UserOffineRestartMinutes), userOfflineDetection)
	if err != nil {
		tools.Log.Panic("Cron AddFuncPanic", zap.Error(err))
	}
	tools.Log.Info(fmt.Sprintf("Successfully Add userOfflineDetection To Cron, ID: %v", userOfflineDetectionTaskID))
	// start
	myCron.Start()
}


// userOfflineDetection User offline detection
func userOfflineDetection() {
  fmt.Println("DEMO")
}


```

这里我是讲其作为一个模块来使用, 因为在实际使用中需要执行的定时任务不止一个, 而且代码逻辑可能比较长, 所以我将 cron 对象单独 var 出来供其他函数使用

代码的入口在 InitAndStart 函数, 在一切的开始, 我们需要先 New 出 *cron.Cron 寄存器才可以, 使用 cron.New() 生成一个任务的寄存器对象

我们希望在主程序运行结束时能主动的将寄存器停止, 所以在 New 完后立刻使用 defer 注册关闭逻辑 .Stop().Done() 是通知下游要关闭寄存器了, 等待下游手上的任务全部处理完毕即结束

随后就是注册任务了, 使用 AddFunc函数来注册任务, 他接受两个参数, 参数一指定了该函数什么时候去触发执行, 参数二就是其要执行的函数了

> 关于参数一, 采用的是和unix的任务定时任务一样的格式, 比如我写的代表每tools.EnvConfig.Cron.UserOffineRestartMinutes分钟执行一次, 具体的规则可查看 [wiki](https://en.wikipedia.org/wiki/Cron) (需FQ)

此处我注册的30秒执行一次  userOfflineDetection 函数

同时 cron 可同时注册很多个定时任务, 只需使用 AddFunc 注册即可

myCron.Start() 则启动寄存器, 如果这个Goroutine中已经启动了 Cron, 则不进行任何操作

需要注意的是, 在寄存器启动后你仍然可以使用 AddFunc 来注册新的定时任务, 也是可以正常的注册的, 例如

``` go
myCron.Start()
myCron.AddFunc("* 1 * * *", userOfflineDetection)
```

如果你想要对每一个注册过的定时任务进行控制, 还记得AddFunc返回的结果吗, 其参数1是这个任务的ID, 参数二为可能的err错误

以上为 Cron 的基本用法, 希望对你有所帮助