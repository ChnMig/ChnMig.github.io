---
title: sync.map 原理分析
date: 2022-02-20            
updated: 2022-02-20         
comments: true              
toc: true                   
excerpt:  sync.map 是为了并发安全的而存在的, 那么是怎么做到的呢?
tags:                       
- Golang
categories:                 
- 编程
---

## 普通的 map

普通的`map`并不是并发安全的, 但是在 go 的1.6之前不会报错, 但是会出现问题, 1.6之后会直接报错.例如以下代码:

``` go
package main

import (
	"fmt"
	"time"
)

func main() {
	m := map[string]int{"age": 10} // 普通的 map

	// 启动协程对 map 修改数据
	go func() {
		i := 0
		for i < 1000 {
			m["age"] = i
			i++
		}
	}()

	// 启动协程对map 修改数据
	go func() {
		i := 0
		for i < 1000 {
			m["age"] = 100001
			i++
		}
	}()

	time.Sleep(time.Second * 3)
	fmt.Println(m)
}
```

运行时出现错误`fatal error: concurrent map writes`:

``` bash
➜  task_test go run main.go
fatal error: concurrent map writes

goroutine 19 [running]:
runtime.throw({0x10a49a0, 0x0})
        /usr/local/Cellar/go/1.17.6/libexec/src/runtime/panic.go:1198 +0x71 fp=0xc000052f38 sp=0xc000052f08 pc=0x102f691
runtime.mapassign_faststr(0x0, 0x0, {0x10a1edc, 0x3})
        /usr/local/Cellar/go/1.17.6/libexec/src/runtime/map_faststr.go:211 +0x39c fp=0xc000052fa0 sp=0xc000052f38 pc=0x100ff3c
main.main.func2()
        /Users/chenming/Work/Code/Go/task_test/main.go:24 +0x3f fp=0xc000052fe0 sp=0xc000052fa0 pc=0x108a4ff
runtime.goexit()
        /usr/local/Cellar/go/1.17.6/libexec/src/runtime/asm_amd64.s:1581 +0x1 fp=0xc000052fe8 sp=0xc000052fe0 pc=0x105b421
created by main.main
        /Users/Work/Code/Go/task_test/main.go:21 +0xc8

goroutine 1 [sleep]:
time.Sleep(0xb2d05e00)
        /usr/local/Cellar/go/1.17.6/libexec/src/runtime/time.go:193 +0x12e
main.main()
        /Users/Work/Code/Go/task_test/main.go:29 +0xd2
exit status 2
```

这就代表出现了冲突, 对于普通的 map 来讲, 如果有多个协程对同一个 map 进行修改, 就会出现错误. 于是 go 提供了`sync.map`, 我们在面对有多个协程对一个 map 进行处理的时候, 必须要使用`sync.map`, 当然, 不过如果不涉及到多协程处理, 还是使用普通的 map, 因为普通的 map 比`sync.map`效率更高

## `sync.map`

### 优点

`sync.map`的主要思路是读写分离, 使用空间换时间, 相比自己使用锁来实现, 有一定的优化

### Demo

``` go
package main

import (
	"fmt"
	"sync"
	"time"
)

func main() {
	smap := sync.Map{} // sync.Map

	smap.Store("age", 10) // 添加 key/value

	// 协程
	go func() {
		i := 0
		for i < 1000 {
			smap.Store("one", i) // smap 修改数据, key 不存在是新增
			i++
		}
	}()

	// 协程
	go func() {
		i := 0
		for i < 1000 {
			smap.Store("one", 1001) // smap 修改数据, key 不存在是新增
			i++
		}
	}()

	time.Sleep(time.Second * 2)
	fmt.Println(smap.Load("one")) // 查看 key one 数据
}
```

这时候就不会报错

### 数据结构

``` go
type Map struct {
	mu Mutex  // 如果有脏数据操作时, 使用这个互斥锁
	read atomic.Value // 只读的数据, 保存了一部分键值对, 只读并不需要加锁
	dirty map[interface{}]*entry  // 保存了一部分键值对, 对这部分操作需要获取互斥锁
	misses int  // 计数器, 记录获取 read 数据时不存在的次数
}
```

这里的`mu`是互斥锁, 目的是保护`read`和`dirty`

`read`是保存了只读的数据, 其中的数据操作是 go 内部的进行操作, 具有原子性

`read`的数据结构如下

``` go
type readOnly struct {
    m       map[interface{}]*entry  // 包含所有的只读键值对
    amended bool // 标志位, 为 true 则代表 read 的数据并不完整
}
```

readOnly 作为只读 map 存在, 这个 map 的元素增加是由 dirty 中迁移过来的, 由 go 来进行数据控制, 不需要加锁

`dirty`是非线程安全的原始 map, 其中存储了新写入的数据, 和`read`中所有未被删除的数据

`dirty`的数据结构如下(`dirty`与`read.map`都是)

``` go
type entry struct {
    p unsafe.Pointer // p 保存了数据的指针
}
```

这里的 p 有三种可能

- nil: `entry`已经被删除, 并且 m.dirty 为 nil
- expunged: `entry`已经被删除了, 并且 m.dirty 不为 nil
- 其他: `entry`是正常值

### 流程

**Store**

store 是更新数据, key 已经存在则更新 value, 不存在则插入

``` go
smap.Store("one", i)  // 给 smap 更新 key 为 one 的值为 i
```

store 流程如下:

- 如果在 read 里能够找到待存储的 key，并且对应的 entry 的 p 值不为 expunged，也就是没被删除时，直接更新对应的 entry 即可。
- 第一步没有成功：要么 read 中没有这个 key，要么 key 被标记为删除。则先加锁，再进行后续的操作。
- 再次在 read 中查找是否存在这个 key，也就是 double check 一下，这也是 lock-free 编程里的常见套路。如果 read 中存在该 key，但 p == expunged，说明 m.dirty != nil 并且 m.dirty 中不存在该 key 值 此时: a. 将 p 的状态由 expunged 更改为 nil；b. dirty map 插入 key。然后，直接更新对应的 value。
- 如果 read 中没有此 key，那就查看 dirty 中是否有此 key，如果有，则直接更新对应的 value，这时 read 中还是没有此 key。
- 最后一步，如果 read 和 dirty 中都不存在该 key，则：a. 如果 dirty 为空，则需要创建 dirty，并从 read 中拷贝未被删除的元素；b. 更新 amended 字段，标识 dirty map 中存在 read map 中没有的 key；c. 将 k-v 写入 dirty map 中，read.m 不变。最后，更新此 key 对应的 value。

简单来讲, 就是在插入的时候, 去`read`中查看key 是否存在, 如果已经存在则直接更新`read`中的 value, 如果不存在则先上锁, 然后新增到`dirty`中, 不写入到`read`中

**Load**

load 是获取 map 中的值

``` go
v, ok := smap.Load("one") // 获取 key 为 one 的值
if !ok {
	fmt.Println("key 不存在") // key 并不存在
}
fmt.Println(v) // value
```

处理路径分为 fast path 和 slow path，整体流程如下：

- 首先是 fast path，直接在 read 中找，如果找到了直接调用 entry 的 load 方法，取出其中的值。
- 如果 read 中没有这个 key，且 amended 为 fase，说明 dirty 为空，那直接返回 空和 false。
- 如果 read 中没有这个 key，且 amended 为 true，说明 dirty 中可能存在我们要找的 key。当然要先上锁，再尝试去 dirty 中查找。在这之前，仍然有一个 double check 的操作。若还是没有在 read 中找到，那么就从 dirty 中找。不管 dirty 中有没有找到，都要"记一笔(misses+1)"，因为在 dirty 被提升为 read 之前，都会进入这条路径

简单来讲, 就是在获取值时, 先在`read`中查找, 有就直接返回, 没有则加锁后去`dirty`中查找, 同时将 misses+1, 如果 `misses` 大于或等于`dirty`的长度, 就将`dirty`变成`read`, 然后建立新的空的`dirty`,同时`misses`设置为0

**Delete**

Delete 可以删除这个 map 中的 key

```go
smap.Delete("one")  // 从 smap 中删除 key one
```

都是先从 read 里查是否有这个 key，如果有则执行 entry.delete 方法，将 p 置为 nil，这样 read 和 dirty 都能看到这个变化。

如果没在 read 中找到这个 key，并且 dirty 不为空，那么就要操作 dirty 了，操作之前，还是要先上锁。然后进行 double check，如果仍然没有在 read 里找到此 key，则从 dirty 中删掉这个 key。但不是真正地从 dirty 中删除，而是更新 entry 的状态。

简单来讲, 就是先查找`read`中是否存在, 不存在则加锁后去`dirty`删除

**LoadOrStore**

LoadOrStore 结合了 Load 和 Store 功能, 如果存在这个 key 就返回, 不存在则新增

具体过程简单来讲, 就是先`read`中查询, 有就返回, 无就去`dirty`查询, 有就返回, 无就插入

**Range**

Range 作用是输出所有的 key 和 value, 用起来比较特殊, 需要自己传入一个处理函数

``` go
smap.Range(func(key, value interface{}) bool {
  name := key.(string)
  age := value.(int)
  fmt.Println(name, age)
  return true
})
```

只要 `return true`, 就会停止遍历

具体过程简单的说, 就是先加锁, 然后将`dirty`的数据提升到`read`, 然后遍历`read`中的数据

### 优点

- `sync.map`是线程安全的
- 通过读写分离(`read`和`dirty`), 降低锁的使用次数, 提高速度, 适用于**读多写少**的场景

























































