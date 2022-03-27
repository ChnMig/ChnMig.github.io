---
title: Vue3 从入门到入土(TypeScript入门)
date: 2022-03-27            
updated: 2022-03-27         
comments: true              
toc: true                   
excerpt: Vue3入门第一章, 主要是 TS 的内容
tags:                       
- Vue
categories:                 
- 编程
---

## 前言

公司需要写一些简单的前端代码, 说起前端, 那可就大了去了, 我不是专业的, 也没打算干这个, 只能说挑一个简单能用的框架来学了.

在很早之前, 写过一些前端, 那时候还是 *Bootstrap* 一把梭, 印象比较深的就是自适应栅格, 现在的话, 用的比较多的应该是 Vue 了, 希望一切顺利.

本次 Vue 的学习过程, 主要是参考了视频 [尚硅谷Vue.JS教程快速入门到项目实战（Vue3/VueJS技术详解）_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1ra4y1H7ih?spm_id_from=333.337.search-card.all.click), 视频自带的文档在 [Vue3+TS 快速上手 (24kcs.github.io)](https://24kcs.github.io/vue3_study/) , 在此对作者和视频网站提出感谢!, 这个文档一眼看去就是 Vueprocess 搭建的, 作为某一个专门的知识分享, 确实很不错, 之前博客使用过这种方式, 缺点是作为博客使用的话, 太过简洁了.

## 什么是 TypeScript

简称为 TS, 我们之前知道 JS, 而 TS 是 JS 的一个超集, TS 最终会被编译成  JS 代码

可以简单的理解为, TS 包括 JS, 但是又不止 JS, TS 本身有自己的新特性, 比如泛型/ 接口/ 强制类型, 正是因为如此, TS 比 JS 更加的强大

TS 的代码. 需要通过 TS 自己的编译器, 编译成  JS 代码, 因为浏览器支持的最好的还是 JS 代码, 当然, 不排除以后浏览器会完善对 TS 的支持

TS 由微软发布(2013年), 本身是跨平台的语言  

## TypeScript 的优点

TS 的优点(特点)主要有3种

- 完美的兼容 JS: TS 可以编译成 JS 代码, 可以在任何支持 JS 的浏览器上运行
- 强大的类型系统: 允许开发者在开发时, 指定变量的类型, 提高开发效率, 减少 BUG
- 先进的 JS: TS 完美兼容 JS, 包括 JS 最新的特征和以后的新特征

## 安装 TS

需要先安装 NodeJS, 安装 NodeJS 查看 中文网 [Node.js 中文网 (nodejs.cn)](http://nodejs.cn/)

安装完成 NodeJS 后, 使用 npm 安装 TS(-g 为全局安装)

``` bash
npm install -g typescript
```

当然, 如果你是 mac. 直接使用 brew 更方便

``` bash
brew install typescript
```

安装完成后, 执行命令打印出 TS 版本. 成功即可

``` bash
➜  ~ tsc -V
Version 4.6.3
```

## 第一个 TS 程序

博主日常开发的话都使用 VSCode, 幸好 UP 主也是

VsCode 需要安装插件 [JavaScript and TypeScript Nightly - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next), 以提供对 TS 文件的支持

### hello_world.ts

新建一个目录, 目录下新建一个以 ts 结尾的文件, 例如`hello_world.ts`, 编写代码如下

``` typescript
(()=>{
    // 创建函数 helloWorld
    // 传入参数 name, 类型为 string
    function helloWorld(name: string){
        // 将参数 name 和 hello 拼接返回
        return "hello "+name
    }
    // 创建变量 w 值为 world
    let w = 'world'
    // 调用函数, 将 w 传入, 同时打印结果
    console.log(helloWorld(w))
})() // 自制性函数(类似于匿名函数立即执行)
```

当然我们知道, JS 要想在浏览器运行, 也需要在 html 中引入才行, 于是我们在同级目录下新增文件 `index.html`, 编写如下

> 在 VSCode 中, 使用 html5 可生成 html5的基本代码

``` html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <!-- 引入本地的 ts 文件 -->
    <script src="./hello_world.ts"></script>  
</body>
</html>
```

此时我们右键, 选择在浏览器中打开(没有的, 下载插件 [open in browser - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=techer.open-in-browser))

打开的应该是一个空白页面, 因为 html 中没有任何内容, 只是引入了 TS 文件, 此时我们打开浏览器的 f12调试的控制台, 发现有个报错

``` bash
Uncaught SyntaxError: Unexpected token ':'
```

这是因为, 我们上面说过. 目前浏览器还不直接支持 TS 代码, 而在 JS 中, 不可以指定变量的类型, 因此, 代码`function helloWorld(name: string){`中的`:string`无法识别, 我们尝试把TS 代码修改为

``` typescript
(()=>{
    // 创建函数 helloWorld
    // 传入参数 name, 类型为 string
    function helloWorld(name){
        // 将参数 name 和 hello 拼接返回
        return "hello "+name
    }
    // 创建变量 w 值为 world
    let w = 'world'
    // 调用函数, 将 w 传入, 同时打印结果
    console.log(helloWorld(w))
})() // 自制性函数(类似于匿名函数立即执行)
```

重新刷新页面, 发现就可以正常的输出

``` bash
hello world
```

当然, 我们之前也说过, TS 可以编译为 JS 代码, 我们的目的也不是让大家写 JS 代码

### 手动编译 ts 文件到 js 代码

我们可以手动的编译代码为 JS, 在命令行中, 进入我们 ts 代码的所在目录, 执行

``` bash
tsc hello_world.ts 
```

可以发现, 运行完成后, 在当前文件夹下, 生成了 `hello_world.js`, 里面代码如下

``` javascript
(function () {
    // 创建函数 helloWorld
    // 传入参数 name, 类型为 string
    function helloWorld(name) {
        // 将参数 name 和 hello 拼接返回
        return "hello " + name;
    }
    // 创建变量 w 值为 world
    var w = 'world';
    // 调用函数, 将 w 传入, 同时打印结果
    console.log(helloWorld(w));
})(); // 自制性函数(类似于匿名函数立即执行)
```

已经生成了 JS 格式的代码, 然后 HTML 中引入修改为生成的 JS 代码, 也可以正常运行了

### TS的类型注解

> python 的3.8之后也有这个

类型注解是一个轻量级的为函数和变量增加的约束, 实际上就是增加一个类型声明. 声明这个变量是什么类型, 供开发者和 IDE 进行辨认和处理

例如, 我们将`hello_world.ts`代码修改为

``` typescript
(()=>{
    // 创建函数 helloWorld
    // 传入参数 name, 类型为 string
    function helloWorld(name: string){
        // 将参数 name 和 hello 拼接返回
        return "hello "+name
    }
    // 创建变量 w 值为 world
    // let w = 'world'
    // 这里修改 w 的值为数字
    let w = 123
    // 调用函数, 将 w 传入, 同时打印结果
    console.log(helloWorld(w))
})() // 自制性函数(类似于匿名函数立即执行)
```

可以看到, 我们在函数`helloWorld`中, 指定了变量`name`的类型为`string`, 而此时把`value`为`number`的值传入, 会发生什么呢? 首先是 VSCode 自己会飘红, 在 调用函数的位置, 提示你

``` bash
类型“number”的参数不能赋给类型“string”的参数。ts(2345)
```

我们在尝试将 TS 转成 JS 时也会报错

``` bash
hello_world.ts:12:28 - error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.

12     console.log(helloWorld(w))
                              ~


Found 1 error in hello_world.ts:12

```

这就是类型注解的好处, 如果你没有真正编写项目的开发经验, 你可能认为反而麻烦了, 而如果你真正的写过业务, 你就会明白为什么这样更好, 一个很重要的一点是, 他会在编译或者开发阶段就将错误排查出来, 以免在运行时发生出乎意料的结果(BUG), 找 BUG 是最痛苦的. 并且, 还可以提高代码的可读性.

## TODO

[尚硅谷Vue.JS教程快速入门到项目实战（Vue3/VueJS技术详解）_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1ra4y1H7ih?p=6&spm_id_from=pageDriver)

下周再看

 

























