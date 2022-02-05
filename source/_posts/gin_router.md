---
title: gin 框架的路由源代码解析
date: 2021-06-16            
updated: 2021-06-16        
comments: true              
toc: true                   
excerpt: gin 框架的源看起来很有意思...
tags:                       
- Golang
- 源码分析
categories:                 
- 编程
---

## 前言

看源代码对我来讲还是有些困难, 因此本篇是在 https://www.liwenzhou.com/posts/Go/read_gin_sourcecode/ 的启发下编写

我这里只是略微的修改

## gin的路由实现

使用 Radix Tree , 简洁版的前缀树

## 前缀树

别名: 字典树 / 单词查找树 / 键树

## 为什么使用前缀树

- url是有限的,不可能无限长

- url是有规律的

- url是一级一级的, restful 更是如此

> 比如博客有的是按年和月分割    /2020/3/aaaa.html     /2020/3/bbbb.html    此时使用前缀树更合适

## gin的路由树

> 基数树/PAT位树, 是一种更节省空间的前缀树, 对于基数树的每个节点，如果该节点是唯一的子树的话，就和父节点合并。

- 越常匹配的前缀, 权重越大
- 因为前缀树的构建模式导致越长的路径定位的时间越长, gin在注册路由时越长的路由排的越前, 如果最长的节点能优先匹配, 那么路由匹配所花的时间不一定比短路由更长

> gin首先按照请求类型(POST/GET/...), 分为多个PAT树, 每个PAT树存储这个请求类型下面注册的路由, 路由又根据权重进行排序

## 路由树节点

路由树由一个个节点组成, gin的路由树节点由结构体 node 表示, 其构造结构如下

```go
// tree.go

type node struct {
   // 节点路径，比如上面的s，earch，和upport
	path      string
	// 和children字段对应, 保存的是分裂的分支的第一个字符
	// 例如search和support, 那么s节点的indices对应的"eu"
	// 代表有两个分支, 分支的首字母分别是e和u
	indices   string
	// 儿子节点
	children  []*node
	// 处理函数链条（切片）
	handlers  HandlersChain
	// 优先级，子节点、子子节点等注册的handler数量
	priority  uint32
	// 节点类型，包括static, root, param, catchAll
	// static: 静态节点（默认），比如上面的s，earch等节点
	// root: 树的根节点
	// catchAll: 有*匹配的节点
	// param: 参数节点
	nType     nodeType
	// 路径上最大参数个数
	maxParams uint8
	// 节点是否是参数节点，比如上面的:post
	wildChild bool
	// 完整路径
	fullPath  string
}
```

## 请求的方法树

在gin的路由中, 每一个 `HTTP Method` (GET/POST/PUT/....) 都对应了一棵PAT树, 在注册路由时会调用 `addRoute` 函数

```go
// gin.go
func (engine *Engine) addRoute(method, path string, handlers HandlersChain) {
   
   // 获取请求方法对应的树
	root := engine.trees.get(method)
	if root == nil {
	
	   // 如果没有就创建一个
		root = new(node)
		root.fullPath = "/"
		engine.trees = append(engine.trees, methodTree{method: method, root: root})
	}
	root.addRoute(path, handlers)
}
```

而在gin中, 每一个 Method 对应的树关系时是存放在一个切片中, `engine.trees`

的类型是 `methodTrees` , 其定义如下

```go
type methodTree struct {
	method string
	root   *node
}

type methodTrees []methodTree  // slice
```

而 `engine.trees.get` 方法如下,(就是for循环)

```go
func (trees methodTrees) get(method string) *node {
	for _, tree := range trees {
		if tree.method == method {
			return tree.root
		}
	}
	return nil
}
```

使用切片而不是使用`map`来存储, 可能是考虑到节省内存, 而且HTTP请求一共就9种, 使用切片也比较合适, 效率也高, 初始化在gin的 `engine` 中

```go
func New() *Engine {
	debugPrintWARNINGNew()
	engine := &Engine{
		RouterGroup: RouterGroup{
			Handlers: nil,
			basePath: "/",
			root:     true,
		},
		// liwenzhou.com ...
		// 初始化容量为9的切片（HTTP1.1请求方法共9种）
		trees:                  make(methodTrees, 0, 9),
		// liwenzhou.com...
	}
	engine.RouterGroup.engine = engine
	engine.pool.New = func() interface{} {
		return engine.allocateContext()
	}
	return engine
}
```

## 路由匹配

当新的请求进入gin时, 会先经过函数 `ServeHTTP`

```go
// gin.go
func (engine *Engine) ServeHTTP(w http.ResponseWriter, req *http.Request) {
  // 这里使用了对象池
	c := engine.pool.Get().(*Context)
  // 这里有一个细节就是Get对象后做初始化
	c.writermem.reset(w)
	c.Request = req
	c.reset()

	engine.handleHTTPRequest(c)  // 我们要找的处理HTTP请求的函数

	engine.pool.Put(c)  // 处理完请求后将对象放回池子
}
```

`ServeHTTP` 调用 `handleHTTPRequest` 函数(节选)

```go
// gin.go
func (engine *Engine) handleHTTPRequest(c *Context) {

	// 根据请求方法找到对应的路由树
	t := engine.trees
	for i, tl := 0, len(t); i < tl; i++ {
		if t[i].method != httpMethod {
			continue
		}
		root := t[i].root
		// 在路由树中根据path查找
		value := root.getValue(rPath, c.Params, unescape)
		if value.handlers != nil {
			c.handlers = value.handlers
			c.Params = value.params
			c.fullPath = value.fullPath
			c.Next()  // 执行函数链条
			c.writermem.WriteHeaderNow()
			return
		}
	
	c.handlers = engine.allNoRoute
	serveError(c, http.StatusNotFound, default404Body)
}
```

> 大致为先COPY一份路由的切片, 先找到与该请求对应的请求类型, 然后在这个请求类型的路由树种使用 getValue 方法查找对应的路由, 没有则返回404

