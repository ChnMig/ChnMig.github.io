---
title: vscode 设置引用分层
date: 2022-04-18            
updated: 2022-04-18         
comments: true              
toc: true                   
excerpt:  vscode 可以通过设置来将 import 分为三层
tags:                       
- Golang
categories:                 
- 编程
---

## 前言
对于一个团队来讲, 维持一样的代码风格非常重要. 而现代的开发工具, 都提供了很好的支持, 这里简单记录一下 VsCode 的一些设置
## VsCode 安装 Go 插件
在 VsCode 中安装插件: [Go - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=golang.Go)
该插件使用[tools/gopls at master · golang/tools (github.com)](https://github.com/golang/tools/tree/master/gopls)进行代码的格式化, gopls 是 google 官方出品, 品质有保障
在安装完插件之后, 还需要下载一些依赖才可以正常运行
在 VsCode 内使用快捷键(mac) `command`+`shift`+`p`, 会弹出一个窗口, 在窗口内输入`Go: Install/Update Tools`, 然后回车等待安装完毕即可, 或者可以参照官方文档的安装方式: [Go - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=golang.Go#tools)
## VsCode 设置 import 风格
在安装了 go 插件之后, 默认在每次保存代码时(手动和自动), 都会格式化代码, 包括 import 区域, 可以看到默认情况下将 import 分为两大块, 一块是引用的开源包, 一块是内部的引用包和 go 内置的包, 例如
``` Go
import (
	"fmt"                 // go 内置的模块
	"os"
	"scmdb/common/mongo"  // 本项目的其他模块
	"scmdb/config"        // 本项目的其他模块
	"time"

	"github.com/globalsign/mgo"  // 开源包, 存在 vendor 中
	"github.com/globalsign/mgo/bson"

)
```
其中, 将内置的模块与本项目的模块混合在了一起, 导致可读性出现些许问题, 其实这些可以在 gopls 中指定本地包名: [tools/settings.md at master · golang/tools (github.com)](https://github.com/golang/tools/blob/master/gopls/doc/settings.md#local-string)
我们需要在本地的项目根目录下新增`.vscode`文件夹, 下新增`settings.json`文件(已经有则直接新增内容), 新增内容如下
``` json
{
    "gopls": {
        "formatting.local": "scmdb"  // 设置为本地包名
    }
}
```
随后重新打开 VsCode, 执行一次保存后(有时候需要删除 import 块让他重新添加), 发现已经变成了
``` Go
import (
	"fmt"
	"os"
	"time"

	"github.com/globalsign/mgo"
	"github.com/globalsign/mgo/bson"

	"scmdb/common/mongo"
	"scmdb/config"
)
```
gopls 的更多设置项查看[tools/settings.md at master · golang/tools (github.com)](https://github.com/golang/tools/blob/master/gopls/doc/settings.md#settings)
