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

## TS的类型注解

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

## 接口

接口可以看作是若干类型注解的集合, 类似于 golang 的结构体

``` typescript
// 接口也是一种约束
(()=>{
    // 定义一个接口 Person
    interface Person{
        firstName: string, // 姓
        lastName: string,  // 名
    }
    // 输出姓名的函数
    // 接收参数 p, 类型为接口 Person
    // 返回 string
    function showFullName(p: Person) {
        return p.firstName+"_"+p.lastName
    }
    // 定义对象, 其类型为 Person
    const userA: Person = {
        firstName: "AF",
        lastName: "AL",
    }
    // 传入参数
    console.log(showFullName(userA))
})()
```

接口的存在, 可以更加方便的进行开发和约束

需要注意的是, 不遵守接口规范, 比如传递一个其他的接口类型, 或者接口中的某一个属性不设置, 在直接运行 TS 时会出现问题, 但是在转到 JS 时可以正常转, 这是因为 JS 本身很随便

当然, 我更推荐按照标准去写, 这样能提高代码的健壮性, 如果你使用 TS, 你就应该遵守其规则

## 类

类这个概念, 如果是后端开发, 想必会非常熟悉, 我直接上代码

``` typescript
// 接口也是一种约束
(()=>{
    // 定义一个接口 Person
    interface Person{
        firstName: string, // 姓
        lastName: string,  // 名
    }
    // 定义一个类 User
    class User{
        firstName: string // 姓
        lastName: string  // 名
        fullName: string  // 全称
        // 类的构造函数, 在类创建时执行
        constructor(firstName: string, lastName: string){
            this.firstName = firstName
            this.lastName = lastName
            this.fullName = this.firstName+"_"+this.lastName
        }
    }
    // 创建类的对象
    function greeter (person: Person) {
        return 'Hello, ' + person.firstName + ' ' + person.lastName
    }
    
    // 创建 user 对象
    let user = new User('Yee', 'Huang')

    // 因为 类 User 属性包括了接口 Person, 所以也可以使用
    console.log(greeter(user))
})()
```

这里的接口和对象的使用, 有些人可能会感觉到疑惑, 其实接口是抽象的概念, 任何结构, 只要有接口的对应字段, 就可以调用接口, 比如

``` typescript
// 接口也是一种约束
(()=>{
    // 定义一个接口 Person
    interface Person{
        firstName: string, // 姓
        lastName: string,  // 名
    }
    interface P1{
        firstName: string, // 姓
        lastName: string,  // 名
    }
    // 输出姓名的函数
    // 接收参数 p, 类型为接口 Person
    // 返回 string
    function showFullName(p: Person) {
        return p.firstName+"_"+p.lastName
    }
    // 定义对象, 其类型为 P1
    const userA: P1 = {
        firstName: "AF",
        lastName: "AL",
    }
    // 传入参数
    // 也可以正常的使用
    // 因为接口是抽象的
    console.log(showFullName(userA))
})()
```

## webpack 打包 TS 项目

一个项目, 肯定不止一个文件, 都是由特定的规则和目录组成

### 初始化

在写一个新项目之前, 找一个新的文件夹, 执行 `npm init -y`

会在最上层目录生成 `package.json`, 这里是 npm 的配置文件

再执行 `tsc --init` 命令, 生成 `tsconfig.json` 文件, 这个是 TS 的配置

随后我们新建几个文件, 目录如下

``` bash
.
├── build
│   └── webpack.config.js
├── package.json
├── public
│   └── index.html
├── src
│   └── main.ts
└── tsconfig.json

3 directories, 5 files
```

### 目录结构和代码

其中, `src`目录中存放具体的代码, 我们这里就单独放一个`main.ts`, 内容如下

这里需要说明的是, 在视频中, 讲解人这里代码是`document.write('Hello Webpack TS!')`,  可以在 html 中动态的添加数据, 但是新的浏览器, 默认是禁止异步加载的 js 修改 document 结构的, 需要额外设置, 这里为了专心学习打包, 选择了 console.log

``` typescript
console.log("webpack")
```

`public`目录存放 html和其他静态资源等, 这里的`index.html`内容为

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
    
</body>
</html>
```

`build`目录存放打包构建时的文件, 这里存放一个 webpack 打包时需要的配置文件`webpack.config.js`, 内容为

``` js
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const isProd = process.env.NODE_ENV === 'production' // 是否生产环境

function resolve (dir) {
  return path.resolve(__dirname, '..', dir)
}

module.exports = {
  mode: isProd ? 'production' : 'development',
  entry: {
    app: './src/main.ts'  // TS 的起始文件位置
  },

  output: {
    path: resolve('dist'),  // 打包后的文件保存目录
    filename: '[name].[contenthash:8].js'  // 文件名格式
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        include: [resolve('src')]
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin({
    }),

    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ],

  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },

  devtool: 'eval-cheap-module-source-map',  // 这里兼容 webpack 新版本, 修改了参数

  devServer: {
    host: 'localhost', // 主机名
    port: 8081,  // 端口
    open: true  // 自动打开端口
  },
}
```

### 安装必要依赖

而后, 我们需要为项目安装几个依赖

``` bash
yarn add -D typescript  # TS 依赖
yarn add -D webpack webpack-cli #  webpack 打包
yarn add -D webpack-dev-server  # dev 环境测试
yarn add -D html-webpack-plugin clean-webpack-plugin  # 删除之前打包的文件
yarn add -D ts-loader  # ts
yarn add -D cross-env  # 跨平台打包
```

安装完成后, 会新增加一个目录`node_models`, 存放着若干个依赖文件, 这里的东西不需要自己修改

修改`package.json`, 主要是修改启动时的参数(json 的 scripts 部分), 同时也可以发现, 刚才 add 的几个依赖, 也已经自动加入到了 json 文件中

``` json
{
  "name": "01",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "cross-env NODE_ENV=development webpack-dev-server --config build/webpack.config.js",
    "build": "cross-env NODE_ENV=production webpack --config build/webpack.config.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "clean-webpack-plugin": "^4.0.0",
    "cross-env": "^7.0.3",
    "html-webpack-plugin": "^5.5.0",
    "ts-loader": "^9.2.8",
    "typescript": "^4.6.3",
    "webpack": "^5.71.0",
    "webpack-cli": "^4.9.2",
    "webpack-dev-server": "^4.7.4"
  }
}
```

### 运行 dev 环境

``` bash
yarn dev
```

会自动唤醒浏览器, 打开页面, 打开调试, 发现打印出了`webpack`

### 运行 build

``` bash
yarn build
```

完成后, 会生成文件夹`dist`, 其中存放了打包好的代码

``` bash
.
├── app.7e4f7be0.js
└── index.html

0 directories, 2 files
```

这里的代码都已经被压缩过了, 目的是减少网络传输时间, 有兴趣的可以自行格式化查看

## TODO

[尚硅谷Vue.JS教程快速入门到项目实战（Vue3/VueJS技术详解）_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1ra4y1H7ih?p=10&spm_id_from=pageDriver)

明天再看

 

























