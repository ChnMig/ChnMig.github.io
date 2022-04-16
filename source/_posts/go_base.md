---
title: go 基础笔记存档
date: 2021-09-04            
updated: 2021-09-04         
comments: true              
toc: true                   
excerpt: 这是初学的时候写的笔记, 之前保存到印象笔记, 后来保存到博客园, 到现在, 转到自己的博客做个备份吧
tags:                       
- Golang
categories:                 
- 编程
---

## 前言

考虑到印象笔记以后不续费了,这里转存到博客园一份
因内容是自己写的笔记, 未作任何润色, 所以看着很精简, 请见谅

## 查看官方文档
在新的go安装包中,为了减小体积默认去除了go doc

安装go语言后在DOS中输入

``` go
 godoc -http=:9000
```

然后在浏览器中打开 127.0.0.1:9000 即可(不能关闭DOS)

## 该系列参照了大佬的学习路线,加上本人的代码实践,大佬链接

[https://www.liwenzhou.com/posts/Go/go_menu](https://www.liwenzhou.com/posts/Go/go_menu)



## 目录结构

GOPATH > src 代码(pkg包/bin编译后文件) > 域名 > 用户名 > 项目 > 模块



## 双引号单引号

单引号代表字符 > 'a'

双引号代表字符串 > "abcd"

> 中文最少3位所以只能用双引号



## 编译代码

进入目录(项目)

go build -o 文件名



## main.go

main.go是项目主入口



## 调试代码

```go
go run 文件
```



## 设置生成文件的格式(跨平台)

#### 命令行

```go
// 生成linux可执行文件
SET CGO_ENABLED=0  //禁用CGO
SET GOOS=linux  //设置目标平台为linux
SET GOARCH=amd64  //目标架构为amd64
// 生成win
SET GOOS=windows
// 生成mac
SET GOOS=darwin
```



## git控制

只需控制 src 下即可



## 变量

> 变量声明后必须使用不然编译失败
>
> 变量可以重复赋值但是无法赋值其他变量类型
>
> 变量声明在函数外代表该文件的全局变量
>
> 在同一个作用域内不能重复声明同名变量
>
> 变量声明后的操作只能在函数中写

#### 引用类型和值类型
引用类型空值为 niu
值类型空就为空

#### 声明单个变量

```go
var 变量名 变量类型
```

> 变量声明后必须要使用不然编译失败



#### 声明多个变量

声明多个变量

```
var (
	变量名 变量类型
	变量名 变量类型
	...
)
```



#### 变量默认值

命令变量后有默认值

> string - ""
>
> int - 0
>
> bool - false



#### 变量声明时指定值

创建变量时指定值

```go
var 变量名 变量类型 = 值
```



#### 声明变量时直接指定变量类型

自动识别值的类型并指定变量类型

```
var 变量名 = 值
```



## fmt模块

打印输出



#### 导入

```go
import "fmt"
```



#### 带换行输出

可换行

```go
fmt.Println()
```



#### 格式化(带换行)输出

可加 %s 等占位

```go
fmt.Printf()
```



## 短变量声明

在[函数内部]声明只能在该函数内使用的变量

#### 声明短变量

```go
变量名 := 值
```

等同于

```go
var 变量名 变量类型 = 值
```

 

## 函数返回值

return返回

```go
func foo()(返回值1类型, 返回值2类型, ...){
	return 返回值1, 返回值2, ...
}
```



## 匿名变量

接收不需要的值

> 例如函数a返回两个值,我们只需要值1,但是我们调用该函数必须要接受2个值
>
> 如果我们接收值2而不使用则会 编译失败(定义变量而不使用)
>
> 此时可以将值2设为匿名变量
>
> 匿名变量可以重复声明
>
> 常量中也可以声明匿名变量

```go
func foo()(string, int){
	return "aa", 500
}
name, _ := foo()
```

此时我们使用匿名变量占位



## 常量

> 一旦赋值不可更改
>
> 常量在定义时必须赋值
>
> 如没有赋值就和上一行一样(必须结构与上一行一样不然报错)

```go
const 常量名 = 值
```

```go
const (
	常量名1 = 值1
	常量名2 = 值2
	常量名3  // 如不赋值默认拿上一行的值
	常量名4
)
```

```go
const(
	a, b = 1, 2
	c, d  // 1, 2
)
```



## 枚举

> iota
>
> 常量计数器,只能在常量表达式中使用
>
> 在一个 const 中,初始值是0, 声明一个常量则const+1
>
> 每一个 const 中, 都会重新初始化为0
>
> 就算某一行定义多个常量 iota也只+1

``` go
const (
	a = iota  // 0
	b = iota  // 1
	c = iota  // 2
)
```

#### 经典题目

```go
const (
	a = iota  // 初始化0
	_ = iota  // 声明匿名常量,所以+1
	b = iota  // 2
)
```

```go
const (
	a = iota  // 初始化0
	b = 100  // 赋值100
	c = iota  // 定义两个常量所以为2
	d  // 不定义默认跟上一行也是iota所以为3
)
const e = iota  // 初始化0
```

```go
const (
	_ = iota  // 0
    KB = 1 << (10 * iota)  // 1<<10(位运算,2进制向左移10位) == 2的10次方 == 1024
	MB = 1 << (10 * iota)  // 2的20次方
	GB = 1 << (10 * iota)  // 2的30次方
	TB = 1 << (10 * iota)
	PB = 1 << (10 * iota)
)
```

```go
const (
	a, b = iota + 1, iota + 2  // iota=0, a=1, b=2
	c, d  // iota=1, c=2, d=3 iota声明常量一行变一次,不判断一行定义几个
	e, f  // iota=2, e=3, f=4
)
```



## 数据类型1



#### 整型

> int8, int16, int32, int64
>
> int8: 最大8位的二进制数, 最大2的9次方-1
>
> 其余类似
>
> 在32位系统, int == int32
>
> 64位, int == int64

> unit8, uint16, uint32, uint64
>
> 在32位系统, uint == uint32
>
> 64位, uint == uint64

#### len

> 返回对象的长度

#### 进制

> Go中,新建变量时,二进制/八进制等等 都可以写成 int
>
> Go会根据特征判断进制
>
> 比如 八进制都是以 0 开头
>
> 十六进制以 0x 开头
>
> 我们想打印出来可以使用 Printf

```go
package main

import "fmt"

func main()  {
	var a int = 10  // 二进制
	var b int = 077  // 八进制
	var c = 0xff  // 十六进制int可省略,可自己判断
	fmt.Println(a, b)  // 转换成十进制
	fmt.Printf("%b \n", a)  // b代表二进制 \n换行
	fmt.Printf("%o \n", b)  // n代表八进制
	fmt.Printf("%x \n", c)  // x代表十六进制
	fmt.Printf("%p", &a)  // 打印数据a的内存地址(十六进制)
}
```

#### 浮点

> 浮点数是不准确的(Python: 0.1+0.2 = 0.30000000000000004)
>
> 如果涉及到金钱等对小数敏感的业务
>
> 不要用浮点数
>
> 业内使用较多的两种方法

###### 方法1

将数字转换成字符串进行逻辑编写

###### 方法2

将小数变成整数计算后再变成小数



## 数据类型1(补充)

#### 布尔

> go语言不允许将整形强制转换为布尔型
>
> 布尔默认 False
>
> 布尔无法参与数值运算,也不能与其他类型转换

#### 字符串

> utf-8编码

#### 字符串转义

\r    回车(光标移动至下一行行首)

\n    换行(移动至下一行同样位置)

\t    制表符

\\'    单引号

\\''    双引号

\\     反斜杠

#### 多行字符串

> 多行字符串里不存在转义

`aa

bb

cc

`

#### 字符串常用方法

``` go
package main

import (
	"fmt"
	"strings"
)

// 字符串操作
func main()  {
	// 字符串位数
	s1 := "我是字符串1"
	fmt.Println(len(s1))  // 字符串位数(s1包含中文返回16)
	// 字符串拼接
	s2 := "我是字符串2"
	fmt.Println(s1+"affag"+s2)  // 推荐使用+号
	s3 := fmt.Sprintf("%safaf%s", s1, s2)  // Sprintf返回拼接后的字符串
	fmt.Println(s3)
	// 字符串分割
	ret := strings.Split(s1, "是")  //中文不能单引号
	fmt.Println(ret)
	// 判断是否包含
	ret2 := strings.Contains(s1, "是")
	fmt.Println(ret2)
	// 判断前缀(第一个字符)
	ret3 := strings.HasPrefix(s1, "我")
	fmt.Println(ret3)
	// 判断后缀(最后一个字符)
	ret4 := strings.HasSuffix(s1, "1")
	fmt.Println(ret4)
	// 求子串位置
	s4 := "123321"
	fmt.Println(strings.Index(s4, "1"))  // 1在s4中的第一个位置
	fmt.Println(strings.LastIndex(s4, "1"))  // 1的最后一个位置
	// join(合并切片为str)
	a1 := []string{"a", "b"}
	fmt.Println(strings.Join(a1, "-"))
}
```


#### byte和rune类型

> 当我们使用 Println 输出中文时,发现打出来的是一串数字,例如 "中文" 打印出来是 20013 ,实际上是字符串对应的 ASCII 码
>
> 当我们使用 len 函数求字符串的长度时,要格外注意,在 UTF8 中中文最少占用3个字节
>
> 一个字节等于8位(bit)

byte类型, (unit8类型), 代表 ASCII码, 英文这种占一个字节的字符

rune类型, (int32), 代表UTF8, 中文/日文等复合字符

``` go
package main

// 字符
import "fmt"

func main()  {
	s1 := "ChnMig"
	c1 := 'A'
	fmt.Println(s1, c1)
	s2 := "中文"
	c2 := '中'
	fmt.Println(s2, c2)
	fmt.Println(c2)

	s3 := "Hello,中国"

	// 遍历字符串
	for i:=0;i<len(s3);i++{
		fmt.Printf("%c\n", s3[i])  // 中文乱码
	}

	// for range 不乱码
	for k, v := range s3{
		fmt.Printf("%d%c\n", k, v)
	}
}
```


#### 类型强制转换

```go
package main

import "fmt"

// 强制类型转换
func main()  {
	s1 := "big"  // 建立s1
	ByteArray := []byte(s1) // 建立一个存放类型为byte的列表将s1赋值进去(赋值时会强制转换为byte)
	ByteArray[0] = 'p'  // 按索引修改
	s1 = string(ByteArray)  // 转换为str重新赋值给s1
	fmt.Println(s1)
}
```


## 流程控制


#### if

> 在if中也可以写赋值语句 
>
> if age := 18{
>
> ​    ...
>
> }
>
> 注意此处 age 变量作用域只在该if语句中

``` go
package main

import "fmt"

// if/ else if
func main()  {
	age := 19
	if age > 18{
		fmt.Println("18+")
	}else if age < 18{  // else, else if 不能再换行写
		fmt.Println("FBI WARING")
	}else {
		fmt.Println(18)
	}
}
 
```



#### for

> for 初始语句;条件表达式;结束语句{
>
> ​    循环体语句
>
> }
>
> 初始语句和结束语句可以省略

``` go
package main

import "fmt"

// 初始语句结束语句省略
func main()  {
	age := 18
	for age > 0{
		fmt.Println(age)
		age--
	}
}
```

``` go
package main

import "fmt"

// 完整版
func main()  {
	for age:=18;age > 0;age--{
		fmt.Println(age)
	}
}
```

``` go
package main


// 死循环
func main()  {
	for {
		//死循环(慎用)
	}
}
```


#### switch

> 简略判断

```go
package main

import "fmt"

// switch
func main()  {
	age := 18
	switch age {  // switch 要判断的值
	case 1:  // 判断
		fmt.Println("1")
	case 18:  // 判断
		fmt.Println("18")
	default:  // 以上判断都不符合
		fmt.Println("以上判断全都不符合")
	}
}
```

> switch 也可以一次判断多个

```go
package main

import "fmt"

// switch
func main()  {
	age := 18
	switch age {
	case 1, 2, 3, 4, 5:  // 判断
		fmt.Println("1")
	case 18, 19, 20:  // 判断
		fmt.Println("18")
	default:  // 以上判断都不符合
		fmt.Println("以上判断全都不符合")
	}
}
```

> 也可以在case里比较

```go
package main

import "fmt"

// switch
func main()  {
	age := 18
	switch {
	case age < 25:
		fmt.Println(">25")
	case age > 25:
		fmt.Println("<25")
	}
}
```


#### break 和 continue

> break 终止循环/遍历
>
> continue 跳出一次循环/遍历

 
## fmt模块

> [https://www.liwenzhou.com/posts/Go/go_fmt/](https://www.liwenzhou.com/posts/Go/go_fmt/)

#### println

>  行内输出

#### printf

> 带格式化参数输出
>
> %d  整数
>
> %.2f  小数(精确小数点两位)
>
> %v  万能
>
> %T  变量类型
>
> %%  一个%



## 数组

> 数据类型元素的集合, 在定义时指定数据类型,不可插入其他的数据类型
>
> 数组可修改,但是数组长度无法改变
>
> 数组的数据库类型是长度+类型,所以两个数组长度不一致则数据类型不一致
>
> 数组是 值类型 的,如果将数组a赋值给数组b, 再更改数组a中的值数组b不会更改, 等同于Python的深Copy

``` go
package main

import (
	"fmt"
)

func main() {
	a := [5]int{1, 2, 3, 4, 5}
	b := [10]int{1, 2} //定义10位但是只填了两位那之后的默认0

	fmt.Println(a)
	fmt.Println(b)

	var c [3]int                   //用var定义
	var d [3]int = [3]int{1, 2, 3} //用var定义并赋值

	fmt.Println(c)
	fmt.Println(d)
}
```


#### 自动判断几位

``` go
package main

import (
	"fmt"
)

func main() {
	a := [...]int{1, 2, 3, 4, 5} // [...]会自己查询赋值几位然后填充位数
	fmt.Println(a)
}

```


#### 根据索引赋值

> 如果我们定义长度100的数组第50位为3
>
> a := [100]int{50: 3}


#### 数组的遍历

``` go
package main

import (
	"fmt"
)

func main() {
	a := [100]int{50: 3}

	//通过索引遍历
	for i := 0; i < len(a); i++ {
		fmt.Println(a[i])
	}

	//通过range遍历
	for index, value := range a {
		fmt.Println(index, value)
	}
}

```


## 多维数组

> 数组套数组...
>
> 一个数组是一维
>
> 多维数组只有第一层能使用 ... 确定长度
>
> 多维数组也是 值类型



``` go
package main

import (
	"fmt"
)

func main() {
	//声明后赋值
	var a [3][2]int //[[0, 0] [0, 0] [0, 0]]
	a = [3][2]int{
		[2]int{1, 2}, //这里给a的第一位[0, 0]赋值
		[2]int{4, 5}, //第二位
	}
	fmt.Println(a) //[[1 2] [4 5] [0 0]]

	//声明时赋值
	var b = [3][2]int{
		[2]int{1, 2},
		[2]int{4, 5},
	}
	fmt.Println(b)

	//多维数组索引
	fmt.Println(a[0][0]) //1

	//多维数组遍历
	for i := 0; i < (len(a)); i++ {
		for k := 0; k < (len(a[i])); k++ {
			fmt.Println(a[i][k])
		}
	}

	//range
	for _, v1 := range a {
		for _, v2 := range v1 {
			fmt.Println(v2)
		}
	}
}

```

 
## 切片

> 数组建立时就需要指定长度,长度不可更改
>
> 切片和数组一样都只能存储相同数据类型,但是他的长度是可变的
>
> 切片是引用类型
>
> 引用类型指公用一个内存地址
>
> 更改一个值会造成所有共用该地址的值变更
>
> 切片有容量的概念,容量代表切片的最大长度,但是是可扩充的
>
> 切片初始容量为他生成时的长度
>
> 切片如果是由数组产生,那么他的容量为 切片开始处 到 数组结束处 长度

切片大小: 当前切片长度

切片地址: 切片中第一个元素地址  len()

切片容量: 底层数组最大能存放的元素个数  cap()


#### 切片扩容

> 切片扩容策略是发现不够的情况下每次扩容到前容量的两倍(x2)(不一定,小于1024时是这样,大于1024是1/4)
>
> 发现长度超出容量 > 丢弃老内存 > 生成新数组(容量x2) > 切片
>
> append 向切片中追加元素

``` go
package main

import "fmt"

func main() {
	//主动声明
	var a = []int{1, 2, 3} //不规定长度即为切片(内部其实是先生成一个数组然后切片)
	fmt.Printf("a:%T", a)

	//从数组得到切片
	var b = [3]int{1, 2, 3}
	var c []int
	c = b[0:2] //从索引0切到1,c=b[:]从开始切到结束,c=b[:2]从开始切到索引1,c=b[1:]从索引1切到最后
	fmt.Println(c)

	//切片大小(当前)
	fmt.Println(len(c))

	//容量(底层数组最大放多少)
	//切片初始容量为他生成时的长度
	fmt.Println(cap(c)) //cap查看当前切片的容量

	//切片追加
	var d = []int{} //没有填充数据时没有内存地址
	fmt.Println(d, len(d), cap(d)) //[] 0 0
	d = append(d, 1)               //append(d, 1, 2)代表添加两个
	fmt.Println(d, len(d), cap(d)) //[1] 1 1
}

```


#### 切片COPY

> 切片是指向型数据,所以将a切片赋值给b后b变动会影响到a
>
> 如果规避此问题可以使用 COPY 函数

``` go
package main

import "fmt"

func main() {
	a := []int{1, 2, 3}
	b := a
	b[0] = 100
	fmt.Println(a) //[100 2 3]
	fmt.Println(b) //[100 2 3]

	var c []int           //为空没有申请内存
	c = make([]int, 3, 3) //使用make函数申请长度为3容量为3的内存
	copy(c, a)            //copy a的值到c,如果c的容量小于a则会数据丢失
	a[0] = 10
	fmt.Println(a) //[10 2 3]
	fmt.Println(c) //[100 2 3]
}
```


#### 切片内容的删除

> 很遗憾,切片暂时没有某个方法可以删除某个元素
>
> 我们只能通过手动赋值的方式来达到目的

``` go
package main

import "fmt"

func main() {
	a := []int{1, 2, 3, 4}
	a = append(a[:2], a[3:]...) //先切索引1之前的元素再切1之后的元素然后重新赋值给a, ...是将切片的多个内容切分, ...写在追加的参数后,多个参数多个...
	fmt.Println(a)              //[1 3 4]
}
```


#### 难题

``` go
package main

import "fmt"

func main() {
	//切片地址永远指切片起始的地址内存,不包含结尾
	a := [4]int{1, 2, 3, 4} //数组
	b := a[:]               //切片
	b[0] = 100
	fmt.Println(a[0]) //100,因切片是指向性数据,b与a共用内存

	c := a[2:3]
	fmt.Println(c)
	fmt.Println(cap(c)) //切片如果是由数组产生,那么他的容量为 切片开始处 到 数组结束处 长度

	d := b[:]
	fmt.Println(d) //[100 2 3 4],因指向性数据,dcb都是指向数组a

	e := d[2:]
	fmt.Println(e) //切片不是从头开始所以地址发生了变化
}

```

 
#### 数组排序

> 方便快捷的将数组排序

``` go
package main

import (
	"fmt"
	"sort"
)

func main() {
	a := [5]int{5, 6, 1, 3, 2}
	sort.Ints(a[:]) //sort.Ints方法将切片排序
	fmt.Println(a)  //因切片数据指向数组所以实际上排序了数组
}

```


## map

> 引用类型
>
> maps是无序的 有k有v 的数据类型
>
> map必须经过初始化才可以正常使用

``` go
package main

import (
	"fmt"
)

func main() {
	var a map[string]int //声明map,k为string类型,v为int,不赋值为nil
	fmt.Println(a)       //map[]
	//初始化(初始化后部位nil但是还是空)
	a = make(map[string]int, 8) //map可不指定容量但是推荐指定
	fmt.Println(a)              //map[]
	//添加键值对
	a["one"] = 1
	a["two"] = 2
	fmt.Println(a) //map[one:1 two:2]

	//声明+初始化
	b := map[string]int{
		"one": 1,
		"two": 2,
	}
	fmt.Println(b) //map[one:1 two:2]
}

```


#### map常用方法

``` go
package main

import (
	"fmt"
	"sort"
)

func main() {
	// 判断某个键存不存在
	a := map[int]int{
		1: 1,
		3: 3,
		2: 2,
	}
	v, ok := a[1]      //返回两个值, 值1为这个键的值, 2为这个键存不存在
	fmt.Println(v, ok) //1 true
	v1, ok1 := a[5]
	fmt.Println(v1, ok1) //0 false 不存在值1为值类型的默认值,2为false

	//遍历map
	for k, v := range a {
		fmt.Println(k, v)
	}

	//只遍历map的key
	for k := range a {
		fmt.Println(k)
	}

	//遍历map的v
	for _, v := range a {
		fmt.Println(v)
	}

	//按照某个顺序遍历
	// 取key存放至切片
	// 切片排序
	// 按key对map排序
	keys := make([]int, 3)
	for k := range a {
		keys = append(keys, k)
	}
	sort.Ints(keys)
	for _, key := range keys {
		fmt.Println(key, a[key])
	}

	// 删除键值对
	delete(a, 1) //(map, 键)
}
```


#### 切片与map混合

``` go
package main

import (
	"fmt"
)

func main() {
	//元素类型为map的切片
	var a = make([]map[string]int, 8) //只完成了切片的初始化
	a[0] = make(map[string]int, 2)    //初始化切片[0]的map
	a[0]["one"] = 1
	fmt.Println(a) //[map[one:1] map[] map[] map[] map[] map[] map[] map[]]

	//值为切片的map
	var b = make(map[int][]int, 8) // map初始化
	b[0] = make([]int, 5)          //切片初始化
	b[0][0] = 1
	b[0][1] = 2
	fmt.Println(b) //map[0:[1 2 0 0 0]]
}
```


## 函数

> 函数是GO语言的重要组成部分
>
> 函数有 函数/匿名函数/闭包
>
> 函数名由 字母/数字/下划线 组成,函数名的第一个字母不能是数字, 在同一个包内函数名不能重复
>
> 参数由参数变量和类型组成,多个参数逗号分隔
>
> 返回值也由返回变量和类型组成, 也可以只写返回值类型,多个返回值由 () 包裹,逗号分隔
>
> 调用函数时,可以不接收函数的返回值
>
> 返回值如果指定了返回的变量名, 函数体内不用再 var 该变量, return也不用指定变量名
>
> 函数没有默认参数
>
> 函数可以赋值给另一个变量,此时该变量就是一个函数



#### 函数组成

``` go
func 函数名(参数)(返回值){
    函数体
}
```

例如

``` go
package main

import "fmt"

func sum(x int, y int) int {
	// 求和
	return x + y
}

func main() {
	s := sum(1, 2)
	fmt.Println(s)
}

```

 
#### 函数接收n个参数

``` go
package main

import "fmt"

func sum(a ...int) int { //参数名后加...代表接收多个,但是参数类型是定死的,这样接受的参数为一个切片,此时a可不传
	ret := 0
	for _, v := range a {
		ret = ret + v
	}
	return ret
}

func main() {
	s := sum(1, 2, 3)
	fmt.Println(s)
}

```

``` go
package main

import "fmt"

func sum(a int, b ...int) int { //传a为int,b为多个,a必传
	ret := a
	for _, v := range b {
		ret = ret + v
	}
	return ret
}

func main() {
	s := sum(1, 2, 3)
	fmt.Println(s)
}

```

``` go
package main

import "fmt"

func sum(a, b int) int { //如果a,b都为int那么可以简写 a, b int
	return a + b
}

func main() {
	s := sum(1, 2)
	fmt.Println(s)
}
```


#### 函数返回多个值

``` go
package main

import "fmt"

func calc(a, b int) (sum, sub int) { //多返回值
	sum = a + b //sum与sub已经定义
	sub = a - b
	return //直接return会自己寻找返回值
}

func main() {
	a, b := calc(1, 2)
	fmt.Println(a, b)
}

```


#### defer

> 通常用于时间的记录/资源释放等等

``` go
package main

import "fmt"

func main() {
	// defer延迟执行,代码将要结束时再执行,执行顺序为先读到的后执行
	fmt.Println("go")
	defer fmt.Println(1)
	defer fmt.Println(2)
	fmt.Println("on")
	// go on 2 1
}
```


#### 变量作用域

> 可以在函数中访问全局变量
>
> 优先在函数中找变量,找不到再找全局变量
>
> 在函数外无法访问函数内定义的变量

``` go
package main

import "fmt"

//全局变量num
var num = 10

//定义函数
func a() {
	num := 100 //如定义了num则先用函数内的num
	fmt.Println(num)
}

func main() {
	a()
}

```


#### 将函数作为参数

``` go
package main

import "fmt"

var num = 10

func a(x, y int) int {
	return x + y
}

func b(x, y int) int {
	return x - y
}

func c(x, y int, op func(int, int) int) int { //第三个参数为函数func类型,接收两个参数int
	return op(x, y)
}

func main() {
	a1 := c(50, 60, a)
	b1 := c(50, 60, b)
	fmt.Println(a1)
	fmt.Println(b1)
}
```


#### 匿名函数

> 匿名函数就是没有函数名的函数,多用于回调

``` go
package main

import "fmt"

func main() {
	//定义然后执行
	a := func() {
		fmt.Println("匿名函数")
	}
	a()

	//定义直接执行(函数后加())
	func() {
		fmt.Println("定义并执行")
	}()
}
```


#### 闭包

> 闭包是一个函数与其相关的引用环境组合而成的实体

```go
package main

import "fmt"

func a(name string) func(string) string { //返回值为函数
	return func(end string) string {
		return name + end
	}
}

func main() {
	r := a("name")  //r为函数(闭包)函数内部引用外部变量
	ret := r("end") //执行匿名函数
	fmt.Println(ret)
}

```


#### 内置函数

1. close  关闭channel
2. len  求长度
3. new  分配内存(值类型)
4. make  分配内存(引用类型)
5. append  追加
6. panic和recover  错误处理


#### panic/recover

> 错误抛出
>
> recover需要搭配defer
>
> panic直接终止,所以要在panic前定义recover和defer

``` go
package main

import "fmt"

func a() {
	fmt.Println("a")
}

func b() {
	defer func() { //defer放到b函数最后执行
		err := recover() //recover捕捉错误信息
		if err != nil {  //如果err不为空
			fmt.Println("error")
		}
	}()
	panic("b") //panic报异常,准备结束,执行defer
}

func c() {
	fmt.Println("c")
}

func main() {
	a()
	b()
	c()
}

```


## 指针

> & 代表取地址
>
> \* 根据地址取值
>
> 不能操作指针

``` go
package main

import "fmt"

func main() {
	a := 1
	fmt.Println(a)
	b := &a
	fmt.Println(b)        //0xc000010090
	fmt.Printf("%T\n", b) //*int int类型的内存地址(不同类型不能相互转换)
	fmt.Println(*b)       //1 知道内存地址来取存储的值
}
```


#### 指针与地址

> 地址: 内存地址
>
> 指针: 带类型的

通常的使用方法

``` go
package main

import "fmt"

func funA(a *[3]int) { //*代表接收数组的指针
	a[0] = 100 //按指针修改数据 (*a)[0] = 100
}

func main() {
	l1 := [3]int{1, 2, 3}
	funA(&l1)
	fmt.Println(l1) // [100 2 3]成功在内部修改了外部变量
}

```


#### 建立指针

``` go
package main

import "fmt"

func main() {
	var a = new(int) //new一个int类型指针
	fmt.Println(a)   //0xc000064058
	*a = 10
	fmt.Println(a)  //0xc000064058
	fmt.Println(*a) // 10

	var c = new([3]int) //new一个切片
	fmt.Println(c)      //&[0 0 0]
	(*c)[0] = 1         //等同于 c[0] = 1
	fmt.Println(*c)     //[1 0 0]
}
```


## 结构体(struct)和方法

#### 创建自定义类型和给类型起别名

> 有可能增加代码可读性

``` go
package main

import "fmt"

//NewInt 创建一个新的类型 NewInt 实际上是int类型
type NewInt int // 定义变量时首字母大写代表该变量是公共的,别人导入这个包时也可使用变量,注释要按照格式 变量名 注释

type int1 = int //创建类型别名

func main() {
	var a NewInt
	fmt.Println(a)        //0 基于int所以默认值0
	fmt.Printf("%T\n", a) //main.NewInt 自定义类型
	var b int1
	fmt.Println(b)        //0
	fmt.Printf("%T\n", b) //int 起别名所以还是int
	var c int
	fmt.Printf("%T\n", c) //起别名的情况下原名字也是可用的
}

```


#### 结构体

> Go语言没有面向对象的说法
>
> 尽管可以通过某种方式达到类似对象的效果
>
> 但是官方不推荐面向对象编程, Go推荐面向接口编程
> 
> 结构体是值类型,将实例化1赋值实例化2,两者内存地址是不一样的

#### 基本实例化

``` go
package main

import "fmt"

// 定义结构体
// 使用type建立一个学生类型
type student struct {
	name  string
	age   int
	sex   string
	hobby []string
}

func main() {
	//实例化方法1
	var s1 = student{}                  //如果只实例化不赋值则默认为该数据类型初始值
	fmt.Printf("s1_name:%v\n", s1.name) //string默认为空

	//实例化方法2
	var s2 = new(student)
	fmt.Println(s2)      // &{ 0  []} ,new出来的是指针
	s2.name = "s2"       // 等同于 (*s2).name 取地址
	fmt.Println(s2.name) //s3

	//实例化方法3
	var s3 = &student{} // 等同于2
	fmt.Println(s3)
}

```


#### 基本初始化

``` go
package main

import "fmt"

// 定义结构体
// 使用type建立一个学生类型
type student struct {
	name  string
	age   int
	sex   string
	hobby []string
}

func main() {
	// 初始化方法1
	var s1 = student{ //少传则默认值替代
		name:  "s1",
		age:   18,
		sex:   "男",
		hobby: []string{"A", "b", "c"},
	}
	fmt.Println(s1)
	fmt.Println(s1.name) //结构体可以通过 . 的形式拿出来属性

	//初始化方法2
	var s2 = student{ //顺序与定义结构体时相同,必须全部传齐
		"s2",
		18,
		"男",
		[]string{"A"},
	}
	fmt.Println(s2.name)

	//初始化方法3
	var s3 = &student{ //顺序与定义结构体时相同,必须全部传齐
		"s3",
		18,
		"男",
		[]string{"A"},
	}
	fmt.Println(s3.name)
}

``` 

#### 结构体内存

> 结构体的每个值是排在一起的

``` go
package main

import "fmt"

// 结构体内存布局

func main() {
	type test struct {
		a int8
		b int8
		c int8
	}

	var t = test{
		a: 1,
		b: 2,
		c: 3,
	}
	fmt.Println(&(t.a)) //0xc000064058
	fmt.Println(&(t.b)) //0xc000064059
	fmt.Println(&(t.c)) //0xc00006405a
}

```

#### 结构体嵌套
> 结构体可以相互嵌套

``` go

package main
import "fmt"
// 结构体的嵌套
type address struct {
    province string
    city string
}
type student struct {
    name string
    age int
    addr address // 嵌套结构体 address
}
func main() {
    s1 := student{
        name: "s1",
        age: 22,
        addr: address{
            province: "p",
            city: "c",
        },
    }
    fmt.Println(s1) // {s1 22 {p c}}
    fmt.Println(s1.addr.city) // c
}


```

#### 赋值给指针
> 将实例化1的指针赋值给实例化2,此时实例化2是指向类型

``` go

package main
import "fmt"
// 结构体内存布局
func main() {
    type test struct {
        a int8
        b int8
        c int8
    }
    var t = test{
        a: 1,
        b: 2,
        c: 3,
    }
    fmt.Println(&(t.a)) //0xc000064058
    fmt.Println(&(t.b)) //0xc000064059
    fmt.Println(&(t.c)) //0xc00006405a
    t2 := &t //将t的地址给t2
    fmt.Printf("%T\n", t2) //*main.test
    t2.a = 5 //(*stu3).a,找到内存地址
    fmt.Println(t.a, t2.a) //5 5 两个都修改了
}


```

#### 构造函数

> go语言的结构体没有构造函数,必须我们自己实现


``` go

package main
import "fmt"
// 构造函数
type student struct {
    name string
    age int
    gender string
    hobby []string
}
// 构造函数(名字带new方便理解)
// 1版本,初始化后返回接收,如初始化内容较多返回再接受较占内存
func newStudent(name string, age int, gender string, hobby []string) student {
    return student{
        name: name,
        age: age,
        gender: gender,
        hobby: hobby,
    }
}
// 2版本,初始化后返回初始化的指针,外面调用直接操作指针,避免1的问题
func newStudent2(name string, age int, gender string, hobby []string) *student {
    return &student{
        name: name,
        age: age,
        gender: gender,
        hobby: hobby,
    }
}
func main() {
    s1Hobby := []string{"a", "b"}
    s1 := newStudent("s1", 18, "男", s1Hobby)
    fmt.Println(s1)
}


```

## 方法和接收者
> 方法是作用于特定类型变量的函数, 其中特定类型的变量叫 接受者, 接受者类似对象的 self
> 
> 函数谁都可以调用,方法指定必须特定类型变量调用

```go
func (接受者变量 接受者类型) 方法名(参数列表) (返回参数) {
    函数体
}
```
``` go

package main
import "fmt"
// 方法
type people struct {
    name string
    gender int
}
// 函数
// func deram() {
//  fmt.Println("梦想")
// }
// 指定接受类型是people
// 通常这个型参命名为类型的首字母小写, 比如 people叫 p
func (p people) deram() {
    p.gender = 11 // 这里改并不会变,因为p是值类型,在函数内赋值无用
    fmt.Println("梦想")
}
func (p *people) deram2() {
    p.gender = 11 // 传入指针时就有用
    fmt.Println("梦想")
}
func main() {
    var p1 = people{
        name: "p1",
        gender: 20,
    }
    p1.deram() // .deram会自己找方法执行
    p1.deram2() // 原版为(&p1.deram2), Go语言可以简写
}

```

#### 什么时候使用指针接受者
> 通常使用指针接受者

#### 方法的追加
> 可以给任意类型追加方法
> 不能给别的包定义的类型添加方法

``` go

package main
import "fmt"
// MyInt 无法给外包加方法但是我们可以先自定义一个类型再给自定义类型加方法
type MyInt int
func (m *MyInt) sayHi() {
    fmt.Println("Hello")
}
func main() {
    var a MyInt
    fmt.Println(a)
    a.sayHi()
}
```

#### 结构体镶嵌达到继承的效果

``` go

package main
import "fmt"
type animal struct { // 建立一个结构体
    name string
}
type dog struct {
    feet int
    *animal //镶嵌结构体的指针
}
func (a *animal) move() { //建立一个方法传入 animal 的指针
    fmt.Println(a.name)
}
func (d *dog) wang() { // 建立一个方法传入 dog 指针
    fmt.Println(d.name)
}
func main() {
    var a = dog{
        feet: 4,
        animal: &animal{ // 指针
            name: "dog1",
        },
    }
    a.wang()
    a.move()
}


```


## 获取用户输入信息

> 类似Python的input

``` go

package main
import "fmt"
// DOS交互
func main() {
    // 从DOS获取值
    // var变量
    var (
        name string
        age int
    )
    fmt.Scan(&name, &age) //传入变量指针,用户输入直接赋值, 空格或换行分割
    fmt.Scanf("name:%S age:%d \n", &name, &age) //不常用,规定必须按照Scanf内容格式输入
    fmt.Scanln(&name, &age) // 与1差不多但是换行就结束(只能空格分隔)
    fmt.Println(name, age)
}


```

## 程序的退出
os.Exit(0)

## 匿名字段
> 不推荐使用
> 在定义结构体时可以使用匿名字段
> 匿名字段实际上就是简写, 比如字段叫 string 实际上是一个叫 string 类型为 string 的字段
> 因此同一类型的匿名字段只能有一个

``` go

package main
import "fmt"
// 匿名字段
type student struct { // 结构体
    name string
    string // 匿名字段
    int
}
func main() {
    s1 := student{
        name: "s1",
    }
    fmt.Println(s1.string) // 为空(string的默认值)
}


```

## JSON序列化
> Go语言自带Json包,但是上面说过Go语言跨包使用变量必须首字母大写

``` go

package main
import (
    "encoding/json"
    "fmt"
)
// 序列化
// Student 学生
type Student struct {
    ID int `json:"id"` // 如想改变json的k,语法同本行,不带空格
    Gender string `json:"gender"`
    Name string `json:"name"`
}
func main() {
    s1 := Student{
        ID: 1,
        Gender: "男",
        Name: "s1",
    }
    // 序列化
    v, err := json.Marshal(s1) // json.Marshal方法,json序列化,返回值和报错信息
    if err != nil { // 不为nil代表报错
        fmt.Println(err)
    }
    fmt.Println(v) // [123 34 73 68 34 58 49 44 34 71 101 110 ...] 每个字节
    fmt.Println(string(v)) // []byte转string, json
    // 反序列化
    j1 := string(v)
    s2 := &Student{} //指针赋给s2
    json.Unmarshal([]byte(j1), s2) // 接收两个参数,一是切片,二是要转换的类型指针
    fmt.Println(s2) // &{1 男 s1}, 指针
    fmt.Println(*s2) // {1 男 s1}, 内容
}
```

## defore深入理解

``` go

package main
import "fmt"
// defore 难题
// return在汇编上本质分为 获取返回值 > RET指令, 加上defore是 获取返回值 > defore > RET指令
func f1() int {
    x := 5
    defer func() {
        x++
    }()
    return x // 返回值为int, 走到return时先看到返回值不是x而是int所以先拿到返回值5, 执行defore x++, 对返回值无影响, 返回5
}
func f2() (x int) {
    defer func() {
        x++
    }()
    return 5 // 返回值为 x, func时x=0, return时5赋值给x,然后执行defore, x++=6, 返回6
}
func f3() (y int) {
    x := 5
    defer func() {
        x++
    }()
    return x // 返回值为y, func时y=0, y为值类型所以return时将x的值5copy给y, defore x++对y无影响, 返回5
}
func f4() (x int) {
    defer func(x int) {
        x++
    }(x)
    return 5 // 返回值为x, func时x=0, return时5赋值给x, 执行defore 将x传入, 但是Go函数是形参,所以defore函数内部新建一个x, x++对外部x无影响, 返回5
}
func main() {
    fmt.Println(f1())
    fmt.Println(f2())
    fmt.Println(f3())
    fmt.Println(f4())
}


```

## Go语言的包
> 通常情况下, 代码不可能放到一个文件里,这时我们就需要封包
> 
> 一个包(文件夹)中永远只有一个main文件,这是这个包中的总入口


#### 定义包
> 文件的第一行
> 
> 如果包中有一个叫 mian 的package,那这个包是可执行的文件
> 
> 如果没有 main 代表这个包是导入的包, 不能自己执行
> 
> 一个文件夹下只有一个包, 一个包不能拆分成两个文件夹
> 
> 包名可以不与文件夹名字重叠, 包名不能有 - 符号
> 
>包名为 main  是这个程序的入口包, 编译时去除main包就得不到可执行文件
>

``` go
package 包名
```

#### 可见性
> 一个包如果想让外部调用他的标识符(变量/常量/类型/函数...),该标识符必须是对外可见的(首字母大写)

#### 导入包
> 自己写的本地包导入路径是 GOPATH/src/路径
> 
> 使用时是按照包名而不是文件夹名
> 
> 导入包可以给这个包起别名,然后使用别名即可 

``` go
import 别名 包
```

#### 匿名导入包
> 只导入包而不适用包内数据
> 
> 匿名导入的包编译时也会加入

``` go
import _ 包
```

## 初始化函数
> 包在被导入时会触发包内部的 init() 函数,该函数没有参数也没有返回值
> 
> init() 不能在代码中主动调用, 只能在程序运行时自动调用
> 
> 多用来做初始化操作
> 
> 顺序: 全局声明 > init > main
> 

## time包
> Go语言中预设的处理时间的包

#### 时间戳
```go

package main
import (
    "fmt"
    "time"
)
func myTimeStamp(timestamp int64) {
    timeObj := time.Unix(timestamp, 0) // 时间戳转时间格式, 0是纳秒的偏移量,通常为0(不偏移)
    fmt.Println(timeObj)
}
func main() {
    now := time.Now() // 当前时间,实例化一个time.Now结构体
    fmt.Printf("%#v", now) // time.Time{wall:0xbf3f74ec230757d8, ext:5984001, loc:(*time.Location)(0x57bfc0)}
    fmt.Println(now.Year()) // 年 2019
    fmt.Println(now.Month()) // 月 July
    fmt.Println(now.Day()) // 日 4
    fmt.Println(now.Hour()) // 时 9
    fmt.Println(now.Minute()) // 分 56
    fmt.Println(now.Second()) // 秒 39
    fmt.Println(now.Nanosecond()) // 纳秒 531441700
    // 时间戳
    fmt.Println(now.Unix()) // 时间戳 1562205575
    fmt.Println(now.UnixNano()) // 纳秒级别时间戳 1562205575360303400
}


```

#### 定时器
> 按照时间重复执行
> 
> 不在乎上一个有没有执行完毕

``` go

package main
import (
    "fmt"
    "time"
)
// 定时器
func tickDemo() {
    ticker := time.Tick(time.Second) // 定义一个间隔1s的定时器
    for i := range ticker {
        fmt.Println(i)
    }
}
func main() {
    tickDemo()
}


```

#### 时间格式化
> 其他语言通常使用 YYYY-MM-DD... 来格式化
> 
> Go语言使用Go的出生时间 2006年1月2日15点04分 来格式化

``` go

package main
import (
    "fmt"
    "time"
)
func format() {
    now := time.Now()
    // 格式化时间模板为Go的出生日期 2006年1月2日15点04分
    fmt.Println(now.Format("2006-01-02 15:04:05")) // 2019-07-04 15:54:22
    fmt.Println(now.Format("2006/01/02 15:04:05")) // 2019/07/04 15:54:22
    fmt.Println(now.Format("2006-01-02")) // 2019-07-04
    fmt.Println(now.Format("15:04")) // 15:54
}
func main() {
    format()
}

```

## 接口
> 此接口不是web接口
> 
> 此接口指一种类型(interface)
> 
> 是抽象的类型
> 
> 接口是一组 method 的组合, 是一个协议, 一种规范
> 
> Go语言提倡面向接口编程
> 
> 接口名一般是单词+er
> 
> 方法名首字母大写且接口名大写的情况下该接口可以被外部导入
> 如果接口接受的是指针, 那么传入值类型会出错
> 
> 如果接口接受值类型, 那么如果传入指针类型Go语言会自己找到对应的值传入

``` go
type 接口类型名 interface{
    方法名1(参数列表1) 返回值列表1
    方法名2(参数列表2) 返回值列表2
}
```

#### 为什么使用接口
> 将所有拥有共同点的类型统一处理,避免代码雍余
> 
> 比如微信支付/支付宝支付/银联支付... 都是支付, 我们可以统称为 支付方式

#### 接口实现
``` go

package main
import "fmt"
// 接口实现
// 就这里来说, 只要一个类型实现了wash 和 dry 方法,我们就叫这个类型实现了 xiyiji 这个接口
type xiyiji interface {
    wash() // 洗衣
    dry() // 甩干
}
type haier struct {
    name string
    price float64
}
func (h haier) wash() {
    fmt.Println("haier wash")
}
func (h haier) dry() {
    fmt.Println("haier price")
}
type people struct {
    name string
}
func (p people) wash() {
    fmt.Println("people wash")
}
func (p people) dry() {
    fmt.Println("people price")
}
func (p people) dry1() {
    fmt.Println("people price1")
}
// haier 和 people 都有dry和wash方法, 接口赋值后可以像调用方法一样使用, 所以接口是抽象的,不关心赋值的结构体类型, 只要你有我规定的方法即可(可以比我规定的方法多)
func main() {
    var a xiyiji
    h1 := haier{
        name: "小神童",
        price: 188.8,
    }
    a = h1 // 接口是抽象类型,所以可以被赋值结构体, 前提是结构体必须有接口规定的方法
    fmt.Println(a)
    a.dry() // haier price 调用haier的dry
    p1 := people{
        name: "p1",
    }
    a = p1
    p1.dry() // people price 调用people的dry
}


```

``` go

package main
import "fmt"
// 为什么使用接口,狗和猫都能叫, 我们为什么不能将其合在一起
// Cat 猫结构体
type Cat struct{}
// Dog 狗结构体
type Dog struct{}
// Sayer 结构体
type Sayer interface {
    Say() string
}
// Say 猫叫
func (c Cat) Say() string {
    return "喵喵喵"
}
// Say 狗叫
func (d Dog) Say() string {
    return "汪汪汪"
}
func main() {
    // c := Cat{}
    // d := Dog{}
    // fmt.Println(c.Say())
    // fmt.Println(d.Say())
    // 接口形式
    var animalList []Sayer
    c := Cat{}
    d := Dog{}
    animalList = append(animalList, c, d)
    for _, i := range animalList {
        fmt.Println(i.Say())
    }
}


```

#### 类型与接口的关系
> 一个类型可以实现多个接口
> 
> 一个接口可对接多种类型

#### 接口的嵌套
> 接口可以嵌套

``` go

package main
import "fmt"
// 接口1
type speaker interface {
    speak()
}
// 接口2
type mover interface {
    move()
}
// 接口嵌套
type animal interface {
    speaker // 嵌套接口1
    mover // 接口2
}
// 结构体
type cat struct {
    name string
}
func (c cat) speak() {
    fmt.Println("speak")
}
func (c cat) move() {
    fmt.Println("move")
}
func main() {
    var x animal
    x = cat{name: "cat1"}
    x.move() // 直接.方法 即可
    x.speak()
}


```

#### 空接口
> 没有定义任何方法的接口
> 
> 任何类型都满足规则,可以存储任何类型的变量
> 
> 如果我们想定义一个函数, 参数为任意值则需要定义传参为空接口
> 
> 定义一个map值为空接口则map值为任意类型
> 

``` go

package main
import "fmt"
// 空接口
func showType(a interface{}) {
    fmt.Printf("%T\n", a)
}
func main() {
    showType(1)
    showType("wwwaw")
    showType(1.256)
    // 值为空接口的map
    var stuInfo = make(map[string]interface{}, 100)
    stuInfo["A"] = 100
    stuInfo["B"] = true
    stuInfo["C"] = "ahdha"
    fmt.Println(stuInfo)
}

```

## 类型断言
> 判断某个变量是否是某个类型

``` go
值, 判断是否类型对应 := 变量.(类型)
```

``` go
package main
import "fmt"
// 类型断言
func main() {
    var x interface{}
    x = 100
    v, ok := x.(int)
    fmt.Println(v, ok) // 100 true
}
```

> 类型断言简单版(常用)
> 
> v不需要可以使用占位符
``` go

package main
import "fmt"
// 类型断言
func main() {
    var x interface{}
    x = 100
    switch v := x.(type) {
    case string:
        fmt.Println("string", v)
    case int:
        fmt.Println("int", v)
    }
}


```

## 接口值
> 一个接口的值由一个 具体类型 和 具体值 组成
``` go

func main() {
    var x interface{}
    var a int64 = 100
    var b int32 = 10
    var c int8 = 1
    x = a // 此时x为 <int64, 100>
    x = b // <int32, 10>
    x = c // <int8, 10>
    x = false // <bool, false>
    fmt.Println(x)
}


```



## Go对文件进行操作
> 文本分为文本文件和二进制文件

#### 打开文件
> os.Open(文件路径)
> 
> 返回两个参数, 参数1(file)为获取的文件, 参数2为错误信息

#### 关闭文件
> 先打开文件获得参数1(file), 然后参数1.Close()即可
> 
> 通常将关闭文件写在 defore 里

#### 读取文件
> file.Read()

#### 初始版
> 循环读取128字节
> 
> 会出现问题, 例如中文128字节可能截断分隔汉字, 导致乱码

``` go

package main
import (
    "fmt"
    "io"
    "os"
)
// 文件操作
// 打开关闭文件
func open() {
    file, err := os.Open("./a.txt") // 打开文件, 参数1为文件, 2为报错信息
    if err != nil { // 不为nil代表出现错误
        fmt.Printf("文件打开失败,错误:%v", err)
        return
    }
    // 文件可以打开
    defer file.Close() // defer延迟关闭文件
    // 读文件
    var tmp [128]byte // 定义一个128长度的字节数组
    for { // 每次读取128字节
        n, err := file.Read(tmp[:]) // 将文件内容赋值给tmp, 返回两个返回值, n为本次读取长度, err代表读取错误
        if err == io.EOF {
            // 文件读取完毕会报出一个 EOF 错误, 并且n为0
            fmt.Println("文件读取完毕")
            return
        }
        if err != nil {
            // 文件读取失败
            fmt.Println("err:", err)
            return
        }
        fmt.Println(n) // 本次长度
        fmt.Print(string(tmp[:])) // 文本内容就在切片里
    }
}
func main() {
    open()
}


```

#### bufio读取文件
> 上方的代码是直接从硬盘中读取数据
> 
> bufio封装一层, 等同于在代码和系统之间加一个缓冲区

``` go

package main
import (
    "bufio"
    "fmt"
    "io"
    "os"
)
// bufio
func main() {
    file, err := os.Open("./a.txt")
    if err != nil {
        return
    }
    defer file.Close()
    // 读取文件
    reader := bufio.NewReader(file)
    for { // 会自己循环
        str, err := reader.ReadString('\n') // 读取到指定字符结束
        if err == io.EOF {
            fmt.Print(str)
            return
        }
        if err != nil {
            return
        }
        fmt.Print(str)
    }
}


```

#### ioutil读取文件
> 更高级, 会自己捕捉EOF及err异常
> 
> 也会自己控制打开和关闭文件

``` go

package main
import (
    "fmt"
    "io/ioutil"
)
func readFile(f string) { // 传入filename
    content, err := ioutil.ReadFile(f)
    if err != nil {
        return
    }
    fmt.Println(string(content))
}
// ioutil
func main() {
    readFile("./a.txt")
}


```

#### OpenFile操作文件
> Open函数功能较浅显, 当我们需要实现文件的写入时, 就需要使用 OpenFile 函数
> 
> OpenFile函数能以指定模式打开文件, 模式有多种

OpenFile源代码如下
``` go
func OpenFile(name string, flag int, perm FileMode) (*File, error){
    ...
}
```
其中, name是打开的文件, flag为打开文件的模式
![](https://img2020.cnblogs.com/blog/1268810/202003/1268810-20200303172216369-649555803.png)

prm为文件权限, 八进制数, r(读)04, w(写)02, x(执行)01

``` go

package main
import "os"
// 文件写
func main() {
    file, err := os.OpenFile("x.txt", os.O_CREATE|os.O_WRONLY, 0755) // 打开文件,没有则新建
    if err != nil {
        return
    }
    defer file.Close()
    str := "架飞机啊" // 写入
    file.WriteString(str)
}


```

#### bufio.NewWriter写入文件

``` go

func main() {
        file, err := os.OpenFile("xx.txt", os.O_CREATE|os.O_TRUNC|os.O_WRONLY, 0666)
        if err != nil {
                fmt.Println("open file failed, err:", err)
                return
        }
        defer file.Close()
        writer := bufio.NewWriter(file)
        for i := 0; i < 10; i++ {
                writer.WriteString("hello沙河\n") //将数据先写入缓存
        }
        writer.Flush() //将缓存中的内容写入文件}
```

#### ioutil.WriteFile写入文件

``` go

package main
import (
    "fmt"
    "io/ioutil"
)
// 文件写
func main() {
    str := "hello 沙河"
    err := ioutil.WriteFile("./xx.txt", []byte(str), 0666) // 只支持切片
    if err != nil {
        fmt.Println("write file failed, err:", err)
        return
    }
}


```

## 反射
> 通用工具类型太多, 类型断言猜不全, 使用反射拿到接口值的动态类型和动态值
> 
> 反射平常不常用
> 
> 各种框架源码比较常用
> 
> 反射使代码更灵活,但是执行效率较低
> 
> 反射代码难懂, 容易panic, 性能很低

## reflect包
#### TypeOf
> reflect.TypeOf() 函数可以获得任意值的类型对象

``` go

package main
import (
    "fmt"
    "reflect"
)
// reflect
type cat struct {
    name string
}
func myTypeOf(i interface{}) {
    v := reflect.TypeOf(i) // 获取变量i的类型
    fmt.Println(v, v.Name(), v.Kind()) // v.Name()输出这个i的类型名, v.Kind()输出这个i的大的种类,比如所有结构体都是结构体,引用类型的Name为空
}
func main() {
    myTypeOf("jagjgag") // string string string
    a := false
    myTypeOf(a) // bool bool bool
    var c1 = cat{
        name: "花花",
    }
    myTypeOf(c1) // main.cat cat struct (可以查找出出自定义的结构体等)
}


```

#### ValueOf
> 获取动态值

``` go

package main
import (
    "fmt"
    "reflect"
)
// 值进入该函数变成空接口,ValueOf获取这个参数原有的值
func reflectValue(x interface{}) {
    v := reflect.ValueOf(x) // 获取接口值信息
    k := v.Kind() // kind获取值对应类型
    switch k { // 对比判断
    case reflect.Int64:
        fmt.Printf("Int64 %d\n", int64(v.Int()))
    case reflect.Float32:
        fmt.Printf("float32 %f\n", float32(v.Float()))
    }
}
func main() {
    var a float32 = 3.14
    var b int64 = 200
    reflectValue(a)
    reflectValue(b)
}


```

#### 通过反射修改外部变量值
``` go

package main
import (
    "fmt"
    "reflect"
)
// 通过反射修改值
func editValue(x interface{}) {
    // 想要在函数内修改函数外的值必须通过修改指针对应值的形式
    v := reflect.ValueOf(x) // 获取传入的值
    kind := v.Kind() // 获取值的类型
    switch kind {
    case reflect.Ptr: // 判断为指针,修改
        v.Elem().SetInt(500) // v.Elem()才是传入值的指针, SetInt()为修改值为Int
    }
}
func main() {
    var a int64 = 100
    editValue(&a)
    fmt.Println(a)
}


```

#### Tag
> Tag是结构体中某个字段别名, 可以定义多个, 空格分隔, 其中名为json的tag是序列化反序列化的名字
``` go

type student struct {
    Name string `json:"name" a:"b"`
}


```

#### 结构体反射查看字段
> 用的较多
> 
>任意值通过 reflect.TypeOf() 获得反射对象的信息后,如果它的类型为结构体, 可以通过反射值对象 的 NumField() 和 Field() 方法获得结构体成员的详细信息

![](https://img2020.cnblogs.com/blog/1268810/202003/1268810-20200303172314114-1899805474.png)

``` go

package main
import (
    "fmt"
    "reflect"
)
// 结构体反射
type student struct {
    Name string `json:"name"`
}
func main() {
    s1 := student{
        Name: "s1",
    }
    t := reflect.TypeOf(s1)
    fmt.Println(t.Name(), t.Kind()) // student struct
    // 循环遍历结构体s1, NumField() 为结构体长度
    for i := 0; i < t.NumField(); i++ {
        field := t.Field(i) // 拿出某个字段i
        fmt.Println(field.Name, field.Index, field.Type, field.Tag.Get("json")) // 字段名, 索引, 类型, jsonTag
    }
    // 通过字段名
    scoreField, ok := t.FieldByName("Name") // 查找名为Name的字段, ok为True代表有字段, 此时scoreField为该字段
    if ok {
        fmt.Println(scoreField.Name, scoreField.Index, scoreField.Type, scoreField.Tag.Get("json")) // Name [0] string name
    }
}


```

#### 结构体反射查看方法
``` go

package main
import (
    "fmt"
    "reflect"
)
// 查看结构体的方法
func printMethod(x interface{}) {
    t := reflect.TypeOf(x)
    v := reflect.ValueOf(x)
    for i := 0; i < v.NumMethod(); i++ { // 遍历方法
        methodType := v.Method(i).Type() // 拿到方法
        fmt.Println(t.Method(i).Name) // 方法名
        fmt.Println(methodType) // 方法
        // 通过反射调用方法, 需要传值必须是 []reflect.Value{} 类型
        var args = []reflect.Value{}
        v.Method(i).Call(args)
    }
}


```

## 并发
> 并发是Go语言的优势

#### 并发与并行
并发: 同一时段做多个事情
并行: 同一时刻做多个事情

#### 进程,线程,协程
> go只需要 goroutine

进程: 一个程序启动后创建一个进程
线程: 操作系统调度的最小单位
协程: 用户态的线程

#### goroutine
> Go语言的 runtime 自动决定程序在哪里运行
> 
> 使用 go 关键字创建 goroutine 一个函数可以创建多个 goroutine, 一个goroutine必对应一个函数
> 
> Go的 goroutine 启动一个占用2KB内存(线程占用2MB), 而且 goroutine可动态扩充大小(最大1GB), goroutine启1w个也没问题
> 
> goroutine直接通讯只能用 channel

``` go

package main
import (
    "fmt"
    "sync"
)
// 启动 goroutine
// goroutine 通常和 sync 的 WaitGroup 结合使用
// WaitGroup是一个计时器
var wg sync.WaitGroup
func hello() {
    fmt.Println("hello")
    defer wg.Done() // 执行结束后告诉wg执行完毕,推荐用defer
}
func main() {
    // 函数前加 go 就是调用 goroutine 执行
    // 1. 创建goroutine
    // 2. 在goroutine执行hello
    wg.Add(1) // 计时器加1, 启动一个 goroutine
    go hello()
    fmt.Println("func hello on")
    wg.Wait() // 等待wg全部执行结束(Done)才结束
}


```

#### goroutine和线程的区别
[https://www.liwenzhou.com/posts/Go/14_concurrence/](https://www.liwenzhou.com/posts/Go/14_concurrence/)

> Go的 goroutine 启动一个占用2KB内存(线程占用2MB), 而且 goroutine可动态扩充大小(最大1GB), goroutine启10w个也没问题
> 
> 开启线程调度是代码请求系统创建然后提供给代码操作, goroutine是由Go的运行时(runtime)自己调度, 这个调度器使用一个 m:n 调度技术(复用/调度m个goroutine到n个os线程),所以不需要切换内核语境,成本低,速度快
> 
> GOMAXPROCS(m:n的n) 决定Go运行时使用几个线程来执行Go程序, 默认值是机器上的CPU核心数
> 
> Go语言1.5版本后默认跑满核心, 可以通过 runtime.GOMAXPROCS(核心数) 来设置核心 

1. 一个操作系统可开启多个 goroutine
2. Go程序可以同时使用多个系统线程
3. goroutine和os线程是多对多的关系, m:n(goroutine : CPU核心)

## channel
> 管道
> 
> 一般来说其他语言常使用多个线程使用同一个共享内存,但是要考虑到数据的安全一致性必须要加锁, 这就导致了速度和效率会下降
> 
> Go语言不提倡使用共享内存的方式
> 
> channel则是在多个 goroutine 中搭建管道互传消息
> 
> channel是引用类型
> 
> channel可以不关闭,Go的垃圾回收会自己关闭

``` go

package main
import "fmt"
// channel
func main() {
    // c1为chan类型的管道, 传输1个int
    c1 := make(chan int, 1) // chan是引用类型所以需要make
    // channel 发送和接收 <-
    c1 <- 10 // 把10发送到c1
    ret := <-c1 // 接收c1(不写ret则是丢弃值)
    fmt.Println(ret)
    close(c1) // 关闭管道, 关闭的通道再接受值不报错,如果管道有值,则依次取出,无值 取到对应值的零值, 不可发送值, 不可重复关闭一个通道
}


```

#### 无缓冲通道和缓冲通道
> 在创建 channel 时, make需要带上长度, 这个长度实际上是一个缓冲区, 可以理解为管道长度, 如果为10代表当数据没有接收时, 数据存储在管道里可以存储10个
> 
> 不写长度代表无缓冲, 此时通过管道传输数据时必须同时有人在接收否则会报 死锁 错误

``` go

package main
import "fmt"
// channel
func recv(ch chan bool) {
    <-ch
}
func main() {
    c1 := make(chan bool) // 创建无缓冲通道(不规定长度)
    go recv(c1)
    c1 <- false // 不会报错因为recv函数中已经在等待接收c1的值
    fmt.Println(len(c1), cap(c1)) // len()获取当前管道的值长度, cap()获取管道容量
}

```

#### 判断通道是否关闭
> 由于通道关闭后也能取出0值,所以我们要先判断通道是否已关闭

``` go

package main
import "fmt"
// 判断通道是否关闭
func send(ch chan int) {
    for i := 0; i < 10; i++ {
        ch <- i
    }
    defer close(ch)
}
func main() {
    var ch1 = make(chan int, 100)
    go send(ch1)
    // 方法1
    for {
        ret, ok := <-ch1 // 如通道关闭ok为false
        if !ok {
            break
        }
        fmt.Println(ret)
    }
    // 方法2
    for ret := range ch1 { // range自己判断
        fmt.Println(ret)
    }
}


```

#### select多路复用

> 某些情况下我们需要指定多个通道,其中一个通道有值就继续走下去
> Go内置了 select 方法来帮助我们实现

``` go

package main
import (
    "fmt"
    "time"
)
// select多路复用
var ch1 = make(chan string, 100)
var ch2 = make(chan string, 100)
func f1(ch chan string) {
    for i := 0; i < 10; i++ {
        ch1 <- fmt.Sprintf("f1:%d", i)
    }
}
func f2(ch chan string) {
    for i := 0; i < 10; i++ {
        ch2 <- fmt.Sprintf("f2:%d", i)
    }
}
func main() {
    go f1(ch1)
    go f2(ch2)
    for {
        select { // select多个ret通道
        case ret := <-ch1:
            fmt.Println(ret)
        case ret := <-ch2:
            fmt.Println(ret)
        default:
            fmt.Println("取不到值")
            time.Sleep(time.Millisecond * 500)
        }
    }
}

```

#### 单向通道
> 设置通道的 可读/可写

``` go

package main
// 传入的chan只能写
func p(ch chan<- int) {
}
// 传入的chan只能读
func p1(ch <-chan int) {
}
// 传入的chan可读写
func p2(ch chan int) {
}


```

## 并发控制与锁
> 并发时,有可能遇到多个 goroutine 同时操作一个内存数据的情况, 这时候就会发生无法预料的数据紊乱, 此时我们需要给这个数据加锁, 在某个 goroutine 操作数据时其他 goroutine 等待, 这样就保证了数据的安全

[https://www.liwenzhou.com/posts/Go/14_concurrence/](https://www.liwenzhou.com/posts/Go/14_concurrence/)

#### 互斥锁
> 同时只能一个 goroutine 操作一个数据

``` go

package main
import (
    "fmt"
    "sync"
)
var num int
var wg sync.WaitGroup
// 互斥锁
var lock sync.Mutex
func add() {
    defer wg.Done()
    for i := 0; i < 5000; i++ {
        lock.Lock() // 加互斥锁
        num = num + 1
        lock.Unlock() // 解锁
    }
}
func main() {
    wg.Add(5)
    go add()
    go add()
    go add()
    go add()
    go add()
    wg.Wait()
    fmt.Println(num)
}


```

#### 读写互斥锁
> 同一时间只能一个 goroutine 写, 但是不限制读的 goroutine
> 
> 此锁适用于 读次数多, 写次数少 的情况下
> 
> 如读写频率一致或写多于读则推荐使用互斥锁

``` go

package main
import (
    "fmt"
    "sync"
)
var num int
var wg sync.WaitGroup
// 读写锁
var rwLock sync.RWMutex
func add() {
    defer wg.Done()
    for i := 0; i < 5000; i++ {
        if i%2 == 0 {
            rwLock.RLock() // 加读锁
            fmt.Println(num)
            rwLock.RUnlock() // 释放读锁
        } else {
            rwLock.Lock() // 加写锁
            num = num + 1
            rwLock.Unlock() // 释放写锁
        }
    }
}
func main() {
    wg.Add(5)
    go add()
    go add()
    go add()
    go add()
    go add()
    wg.Wait()
    fmt.Println(num)
}


```
#### map的并发
> 并发时map会自主报错,这是一个自己的保护机制, 防止多个 foroutine 导致kv不一致
> 
> Go内置了 sync.map ,并发安全/开箱即用

[https://www.liwenzhou.com/posts/Go/14_concurrence/#autoid-4-3-0](https://www.liwenzhou.com/posts/Go/14_concurrence/#autoid-4-3-0)
``` go

package main
import (
    "fmt"
    "strconv"
    "sync"
)
// sync.map
var m = sync.Map{} // 自己加了互斥锁
func main() {
    wg := sync.WaitGroup{}
    for i := 0; i < 10; i++ {
        wg.Add(1)
        go func(n int) {
            key := strconv.Itoa(n)
            m.Store(key, n)
            v, _ := m.Load(key)
            fmt.Println(key, v)
            wg.Done()
        }(i)
    }
    wg.Wait()
}


```

## 单元测试
> 开发人员自测
> 
> 大的程序分为多个功能单元, 开发完一个单元后自己进行测试

[https://www.liwenzhou.com/posts/Go/16_test/](https://www.liwenzhou.com/posts/Go/16_test/)

#### Go语言单元测试

> Go 内置单元测试包 testing
> 
> 一般我们会编写相关的函数作为测试使用
> 
> 测试函数的命名需遵守相关约定
> 
> 测试函数统一写在一个以 _test.go 为后缀名的文件中, 在编译时会自动忽略此类文件
> 
> 使用 go test 命令会自己寻找当前包内的 *_test.go 文件, 然后生成一个临时的main包用于调用相应的测试函数，然后构建并运行、报告测试结果，最后清理测试中生成的临时文件。

![](https://img2020.cnblogs.com/blog/1268810/202003/1268810-20200303172407173-2015921684.png)


#### 基准测试
> 测试运行时间/占用资源等等数据

[https://www.liwenzhou.com/posts/Go/16_test/#autoid-2-5-0](https://www.liwenzhou.com/posts/Go/16_test/#autoid-2-5-0)
#### Setup和TearDown
> 测试开始前和结束后执行的逻辑

[https://www.liwenzhou.com/posts/Go/16_test/#autoid-3-5-0](https://www.liwenzhou.com/posts/Go/16_test/#autoid-3-5-0)


## 网络编程
[https://www.liwenzhou.com/posts/Go/15_socket/](https://www.liwenzhou.com/posts/Go/15_socket/)

``` go

package main
import (
    "fmt"
    "net/http"
)
// HTTP server
func res(w http.ResponseWriter, r *http.Request) { // 接受参数
    fmt.Println(r.Method) // 请求方式
    r.ParseForm() // 解析数据
    r.Form.Get("name") // 获取form表单中key为name的数据
}
func main() {
    http.HandleFunc("/", res) // 访问根路径走res函数
    err := http.ListenAndServe(":9090", nil) // 监听本地端口
    if err != nil { // 错误捕捉
        return
    }
}


```

## MySql
[https://www.liwenzhou.com/posts/Go/go_mysql/](https://www.liwenzhou.com/posts/Go/go_mysql/)

#### 驱动下载
` go get -u github.com/go-sql-driver/mysql`

#### 普通连接
``` go

package main
import (
    "database/sql"
    "fmt"
    // 导入下载的驱动包, 前面加_ 代表只用了init()
    _ "github.com/go-sql-driver/mysql"
)
// 连接mysql
func main() {
    // dsn := "user:password@tcp(ip:port)/databasename"
    dsn := "root:pwd@tcp(cdb-ecfs2q68.bj.tencentcdb.com:10075)/go_test" // 连接信息
    // 注册mysql信息
    db, err := sql.Open("mysql", dsn)
    if err != nil {
        // 这里的错误只是参数格式错误
        fmt.Println("db err")
        return
    }
    // 尝试连接数据库
    err = db.Ping()
    if err != nil {
        fmt.Println("db filed")
        return
    }
}


```

#### 连接池连接
> 创建数据库句柄一般比较耗时, 所以我们使用连接池

``` go

package main
import (
    "database/sql"
    "fmt"
    // 导入下载的驱动包, 前面加_ 代表只用了init()
    _ "github.com/go-sql-driver/mysql"
)
// 连接mysql(连接池版)
// DB 数据库连接句柄
var DB *sql.DB
func initDB(dsn string) (err error) {
    DB, err = sql.Open("mysql", dsn)  // 注意此处是将全局变量DB赋值mysql连接,所以是 = 而不是 :=
    if err != nil {
        return err
    }
    err = DB.Ping()
    if err != nil {
        return err
    }
    // 设置最大连接数(有默认)
    DB.SetMaxOpenConns(100)
    // 最大空闲连接数(有默认)
    DB.SetMaxIdleConns(20)
    return nil
}
func main() {
    // dsn := "user:password@tcp(ip:port)/databasename"
    dsn := "root:pwd@tcp(cdb-ecfs2q68.bj.tencentcdb.com:10075)/go_test" // 连接信息
    err := initDB(dsn)
    if err != nil {
        fmt.Println(err)
    }
}


```

#### 占位符
> 为防止SQL注入, 我们通常将用户信息等前端传来的可变数据通过占位符拼接, 需要注意的是, 不同数据库驱动的占位符不一样

![](https://img2020.cnblogs.com/blog/1268810/202003/1268810-20200303172446179-127845015.png)



#### 查询数据
``` go

package main
import (
    "database/sql"
    "fmt"
    // 导入下载的驱动包, 前面加_ 代表只用了init()
    _ "github.com/go-sql-driver/mysql"
)
// 连接mysql(连接池版) 增删改查
// DB 数据库连接句柄
var DB *sql.DB
// User 结构体
type User struct {
    id int
    name string
    age int
}
func initDB(dsn string) (err error) {
    DB, err = sql.Open("mysql", dsn)  // 注意此处是将全局变量DB赋值mysql连接,所以是 = 而不是 :=
    if err != nil {
        return err
    }
    err = DB.Ping()
    if err != nil {
        return err
    }
    // 设置最大连接数(有默认)
    DB.SetMaxOpenConns(100)
    // 最大空闲连接数(有默认)
    DB.SetMaxIdleConns(20)
    return nil
}
func main() {
    // dsn := "user:password@tcp(ip:port)/databasename"
    dsn := "root:pwd@tcp(cdb-ecfs2q68.bj.tencentcdb.com:10075)/go_test" // 连接信息
    err := initDB(dsn)
    if err != nil {
        fmt.Println(err)
    }
    var user User
    // 查询单条数据
    sqlStr := "SELECT id,name,age FROM `user` WHERE id=1"
    err = DB.QueryRow(sqlStr).Scan(&user.id, &user.name, &user.age)
    if err != nil {
        fmt.Println(err)
    }
    fmt.Println(user.id, user.name, user.age)
    var user2 User
    // 查询多条
    sqlStr2 := "SELECT id,name,age FROM `user` where id > ?" // ?指占位符
    rows, err := DB.Query(sqlStr2, 0) // 将0替换到?
    if err != nil {
        fmt.Println(err)
    }
    // rows最后要close,不close会夯住
    defer rows.Close()
    // 循环读取数据
    for rows.Next() {
        err = rows.Scan(&user2.id, &user2.name, &user2.age)
        if err != nil {
            return
        }
        fmt.Println(user2)
    }
}


```

#### 插入数据

``` go

package main
import (
    "database/sql"
    "fmt"
    // 导入下载的驱动包, 前面加_ 代表只用了init()
    _ "github.com/go-sql-driver/mysql"
)
// 连接mysql(连接池版) 增删改查
// DB 数据库连接句柄
var DB *sql.DB
// User 结构体
type User struct {
    id int
    name string
    age int
}
func initDB(dsn string) (err error) {
    DB, err = sql.Open("mysql", dsn)  // 注意此处是将全局变量DB赋值mysql连接,所以是 = 而不是 :=
    if err != nil {
        return err
    }
    err = DB.Ping()
    if err != nil {
        return err
    }
    // 设置最大连接数(有默认)
    DB.SetMaxOpenConns(100)
    // 最大空闲连接数(有默认)
    DB.SetMaxIdleConns(20)
    return nil
}
func main() {
    // dsn := "user:password@tcp(ip:port)/databasename"
    dsn := "root:pwd@tcp(cdb-ecfs2q68.bj.tencentcdb.com:10075)/go_test" // 连接信息
    err := initDB(dsn)
    if err != nil {
        fmt.Println(err)
    }
    // 插入数据
    sqlStr := "INSERT INTO `user`(`name`, age) VALUES(?, ?)"
    name := "u3"
    age := "33"
    // 执行
    ret, err := DB.Exec(sqlStr, name, age)
    if err != nil {
        return
    }
    // 获取到插入数据的id(不同数据库有不同实现)
    ID, err := ret.LastInsertId()
    if err != nil {
        return
    }
    fmt.Println(ID)
}


```

#### 更新数据

``` go

package main
import (
    "database/sql"
    "fmt"
    // 导入下载的驱动包, 前面加_ 代表只用了init()
    _ "github.com/go-sql-driver/mysql"
)
// 连接mysql(连接池版) 增删改查
// DB 数据库连接句柄
var DB *sql.DB
// User 结构体
type User struct {
    id int
    name string
    age int
}
func initDB(dsn string) (err error) {
    DB, err = sql.Open("mysql", dsn)  // 注意此处是将全局变量DB赋值mysql连接,所以是 = 而不是 :=
    if err != nil {
        return err
    }
    err = DB.Ping()
    if err != nil {
        return err
    }
    // 设置最大连接数(有默认)
    DB.SetMaxOpenConns(100)
    // 最大空闲连接数(有默认)
    DB.SetMaxIdleConns(20)
    return nil
}
func main() {
    // dsn := "user:password@tcp(ip:port)/databasename"
    dsn := "root:pwd@tcp(cdb-ecfs2q68.bj.tencentcdb.com:10075)/go_test" // 连接信息
    err := initDB(dsn)
    if err != nil {
        fmt.Println(err)
    }
    // 更新数据
    sqlStr := "UPDATE `user` SET age=? WHERE id=?"
    age := 222
    ID := 2
    ret, err := DB.Exec(sqlStr, age, ID)
    if err != nil {
        return
    }
    // 返回受影响的行数
    rowLen, err := ret.RowsAffected()
    if err != nil {
        return
    }
    fmt.Println(rowLen)
}


```

#### 删除数据

``` go

package main
import (
    "database/sql"
    "fmt"
    // 导入下载的驱动包, 前面加_ 代表只用了init()
    _ "github.com/go-sql-driver/mysql"
)
// 连接mysql(连接池版) 增删改查
// DB 数据库连接句柄
var DB *sql.DB
// User 结构体
type User struct {
    id int
    name string
    age int
}
func initDB(dsn string) (err error) {
    DB, err = sql.Open("mysql", dsn)  // 注意此处是将全局变量DB赋值mysql连接,所以是 = 而不是 :=
    if err != nil {
        return err
    }
    err = DB.Ping()
    if err != nil {
        return err
    }
    // 设置最大连接数(有默认)
    DB.SetMaxOpenConns(100)
    // 最大空闲连接数(有默认)
    DB.SetMaxIdleConns(20)
    return nil
}
func main() {
    // dsn := "user:password@tcp(ip:port)/databasename"
    dsn := "root:pwd@tcp(cdb-ecfs2q68.bj.tencentcdb.com:10075)/go_test" // 连接信息
    err := initDB(dsn)
    if err != nil {
        fmt.Println(err)
    }
    // 删除数据
    sqlStr := "DELETE FROM `user`WHERE id=?"
    ID := 3
    ret, err := DB.Exec(sqlStr, ID)
    if err != nil {
        return
    }
    // 返回受影响的行数
    rowLen, err := ret.RowsAffected()
    if err != nil {
        return
    }
    fmt.Println(rowLen)
}


```

#### 预处理
> sqly预处理是只不在本地进行SQL语句的拼接, 而是将sql语句和替换的字符串分开发送至sql server ,由sql server 对sql语句和字符串拼接/替换/执行.
> 
> 预处理在应对大量重复sql语句的情况下会提高执行效率(例如执行某个表的100次相同操作), 而且可以避免SQL注入(不代表不预处理就不做防sql注入)

###### 预处理增删改
``` go

package main
import (
    "database/sql"
    "fmt"
    // 导入下载的驱动包, 前面加_ 代表只用了init()
    _ "github.com/go-sql-driver/mysql"
)
// 连接mysql(连接池版) 增删改查
// DB 数据库连接句柄
var DB *sql.DB
// User 结构体
type User struct {
    id int
    name string
    age int
}
func initDB(dsn string) (err error) {
    DB, err = sql.Open("mysql", dsn)  // 注意此处是将全局变量DB赋值mysql连接,所以是 = 而不是 :=
    if err != nil {
        return err
    }
    err = DB.Ping()
    if err != nil {
        return err
    }
    // 设置最大连接数(有默认)
    DB.SetMaxOpenConns(100)
    // 最大空闲连接数(有默认)
    DB.SetMaxIdleConns(20)
    return nil
}
func main() {
    // dsn := "user:password@tcp(ip:port)/databasename"
    dsn := "root:pwd@tcp(cdb-ecfs2q68.bj.tencentcdb.com:10075)/go_test" // 连接信息
    err := initDB(dsn)
    if err != nil {
        fmt.Println(err)
    }
    // 预处理
    sqlStr := "INSERT INTO `user`(`name`, age) VALUES(?, ?)"
    // 不拼接
    stmt, err := DB.Prepare(sqlStr)
    if err != nil {
        return
    }
    // 注册关闭
    defer stmt.Close()
    // 执行重复的插入命令
    for i := 4; i < 20; i++ {
        name := fmt.Sprintf("u%d", i)
        stmt.Exec(name, i)
    }
}


```

###### 预处理查询

``` go

package main
import (
    "database/sql"
    "fmt"
    // 导入下载的驱动包, 前面加_ 代表只用了init()
    _ "github.com/go-sql-driver/mysql"
)
// 连接mysql(连接池版) 增删改查
// DB 数据库连接句柄
var DB *sql.DB
// User 结构体
type User struct {
    id int
    name string
    age int
}
func initDB(dsn string) (err error) {
    DB, err = sql.Open("mysql", dsn)  // 注意此处是将全局变量DB赋值mysql连接,所以是 = 而不是 :=
    if err != nil {
        return err
    }
    err = DB.Ping()
    if err != nil {
        return err
    }
    // 设置最大连接数(有默认)
    DB.SetMaxOpenConns(100)
    // 最大空闲连接数(有默认)
    DB.SetMaxIdleConns(20)
    return nil
}
func main() {
    // dsn := "user:password@tcp(ip:port)/databasename"
    dsn := "root:pwd@tcp(cdb-ecfs2q68.bj.tencentcdb.com:10075)/go_test" // 连接信息
    err := initDB(dsn)
    if err != nil {
        fmt.Println(err)
    }
    // 预处理
    sqlStr := "SELECT id, name, age FROM user WHERE id=?"
    // 不拼接
    stmt, err := DB.Prepare(sqlStr)
    if err != nil {
        return
    }
    // 注册关闭
    defer stmt.Close()
    // 执行重复的插入命令
    for i := 1; i < 20; i++ {
        rows, err := stmt.Query(i)
        if err != nil {
            continue
        }
        defer rows.Close()
        var name string
        var id int
        var age int
        for rows.Next() {
            rows.Scan(&id, &name, &age)
            fmt.Println(id, name, age)
        }
    }
}


```

#### 事务
> 事务开始后(Begin), 必须以 回滚(Rollback) 或 提交(Commit) 结束

``` go

package main
import (
    "database/sql"
    "fmt"
    // 导入下载的驱动包, 前面加_ 代表只用了init()
    _ "github.com/go-sql-driver/mysql"
)
// 连接mysql(连接池版) 事务
// DB 数据库连接句柄
var DB *sql.DB
// User 结构体
type User struct {
    id int
    name string
    age int
}
func initDB(dsn string) (err error) {
    DB, err = sql.Open("mysql", dsn)  // 注意此处是将全局变量DB赋值mysql连接,所以是 = 而不是 :=
    if err != nil {
        return err
    }
    err = DB.Ping()
    if err != nil {
        return err
    }
    // 设置最大连接数(有默认)
    DB.SetMaxOpenConns(100)
    // 最大空闲连接数(有默认)
    DB.SetMaxIdleConns(20)
    return nil
}
func main() {
    // dsn := "user:password@tcp(ip:port)/databasename"
    dsn := "root:pwd@tcp(cdb-ecfs2q68.bj.tencentcdb.com:10075)/go_test" // 连接信息
    err := initDB(dsn)
    if err != nil {
        fmt.Println(err)
    }
    // 开始事务
    tx, err := DB.Begin()
    if err != nil {
        return
    }
    // 执行事务内操作
    sqlStr := "UPDATE user SET age=? WHERE id=?"
    age := "30"
    ID := "3"
    // 执行
    _, err = tx.Exec(sqlStr, age, ID)
    if err != nil {
        // 出现错误回滚
        tx.Rollback()
        return
    }
    age = "40"
    ID = "4"
    // 执行
    _, err = tx.Exec(sqlStr, age, ID)
    if err != nil {
        // 出现错误回滚
        tx.Rollback()
        return
    }
    // 走到这里证明两条语句都执行成功
    // commit提交事务
    err = tx.Commit()
    if err != nil {
        // commit也可能失败
        tx.Rollback()
        return
    }
}


```

## 第三方库 SQLX
> 第三方库 sqlx 能简化操作, 特别是查询, 能够提高开发效率

#### 安装
``` go
go get -u github.com/jmoiron/sqlx
```
#### 基本使用

###### 查
``` go

package main
import (
    "fmt"
    "github.com/jmoiron/sqlx"
    // 导入下载的驱动包, 前面加_ 代表只用了init()
    _ "github.com/go-sql-driver/mysql"
)
// 连接mysql(连接池版)
// DB 数据库连接句柄
var DB *sqlx.DB
// User 结构体
type User struct {
    ID int `db:"id"` // db的tag为sqlx所用,标记对应的字段名
    Name string `db:"name"`
    Age int `db:"age"`
}
func initDB(dsn string) (err error) {
    DB, err = sqlx.Connect("mysql", dsn) // 注意此处是将全局变量DB赋值mysql连接,所以是 = 而不是 :=
    if err != nil {
        return err
    }
    // 设置最大连接数(有默认)
    DB.SetMaxOpenConns(100)
    // 最大空闲连接数(有默认)
    DB.SetMaxIdleConns(20)
    return nil
}
// 查询单行
func queryDemo() {
    sqlStr := "SELECT id, name, age FROM user WHERE id=?"
    var user User
    err := DB.Get(&user, sqlStr, 1)
    if err != nil {
        return
    }
    fmt.Println(user)
}
// 查询多行
func querysDemo() {
    sqlStr := "SELECT id, name, age FROM user WHERE id>?"
    var users []User // 切片每个都是User
    err := DB.Select(&users, sqlStr, 1)
    if err != nil {
        return
    }
    for _, user := range users {
        fmt.Println(user)
    }
}
func main() {
    // dsn := "user:password@tcp(ip:port)/databasename"
    dsn := "root:pwd@tcp(cdb-ecfs2q68.bj.tencentcdb.com:10075)/go_test" // 连接信息
    err := initDB(dsn)
    if err != nil {
        fmt.Println(err)
    }
    // queryDemo()
    querysDemo()
}


```
###### 增/删/改
> 与使用自带 sql 无区别

###### 事务
``` go

package main
import (
    "fmt"
    "github.com/jmoiron/sqlx"
    // 导入下载的驱动包, 前面加_ 代表只用了init()
    _ "github.com/go-sql-driver/mysql"
)
// 连接mysql(连接池版)
// DB 数据库连接句柄
var DB *sqlx.DB
// User 结构体
type User struct {
    ID int `db:"id"` // db的tag为sqlx所用,标记对应的字段名
    Name string `db:"name"`
    Age int `db:"age"`
}
func initDB(dsn string) (err error) {
    DB, err = sqlx.Connect("mysql", dsn) // 注意此处是将全局变量DB赋值mysql连接,所以是 = 而不是 :=
    if err != nil {
        return err
    }
    // 设置最大连接数(有默认)
    DB.SetMaxOpenConns(100)
    // 最大空闲连接数(有默认)
    DB.SetMaxIdleConns(20)
    return nil
}
// 事务
func transDemo() {
    // 如果MustExec引发panic, Beginx会自己Rollback
    tx, err := DB.Beginx()
    if err != nil {
        return
    }
    sqlStr := "UPDATE user SET age=? WHERE id=?"
    age := "30"
    ID := "3"
    tx.MustExec(sqlStr, age, ID) // 带Must方法一般指一出错直接panic
    age = "40"
    ID = "4"
    tx.MustExec(sqlStr, age, ID) // 带Must方法一般指一出错直接panic
    err = tx.Commit() // 提交
    if err != nil {
        tx.Rollback()
        return
    }
}
func main() {
    // dsn := "user:password@tcp(ip:port)/databasename"
    dsn := "root:pwd@tcp(cdb-ecfs2q68.bj.tencentcdb.com:10075)/go_test" // 连接信息
    err := initDB(dsn)
    if err != nil {
        fmt.Println(err)
    }
}


```

## Go使用Redis

[https://www.liwenzhou.com/posts/Go/go_redis/](https://www.liwenzhou.com/posts/Go/go_redis/)

``` go

package main
import (
    "fmt"
    "github.com/go-redis/redis"
)
// 连接池
var redisDB *redis.Client
func initClient() (err error) {
    redisDB = redis.NewClient(&redis.Options{ // 替换全局变量 redisDB
        Addr: "127.0.0.1:6379", // HOST
        Password: "", // 密码
        DB: 0, // 数据库
    })
    _, err = redisDB.Ping().Result() // 连接
    if err != nil {
        return err
    }
    return nil
}
func main() {
    err := initClient()
    if err != nil {
        return
    }
    // 获取a1的值
    ret := redisDB.Get("a1").Val()
    fmt.Println(ret)
}


```

## NSQ消息队列

[https://www.liwenzhou.com/posts/Go/go_nsq/](https://www.liwenzhou.com/posts/Go/go_nsq/)


## 依赖管理(old)

[https://www.liwenzhou.com/posts/Go/go_dependency/](https://www.liwenzhou.com/posts/Go/go_dependency/)

#### 安装
``` go
go get -u github.com/tools/godep
```

#### 保存依赖信息

``` go
godep save
```
会在当前目录下生成两个文件夹 `Godeps` `vendor`
`Godeps` 存放项目依赖的包信息
`vendor`  存放项目依赖包的副本

#### 使用
> go语言编译时会优先找当前目录下的 `vendor` 文件夹,优先使用他的模块


## 依赖管理(new)
> go model 1.1后官方使用的依赖管理

[https://www.liwenzhou.com/posts/Go/go_dependency/#autoid-2-5-0](https://www.liwenzhou.com/posts/Go/go_dependency/#autoid-2-5-0)

#### go mod命令
![](https://img2020.cnblogs.com/blog/1268810/202003/1268810-20200303172529101-72359284.png)


#### 打开mod支持
> 默认情况下 go mod 是关闭的, 我们需要先打开支持

``` go
set GO111MODULE=on
```

#### 生成mod
``` go
go mod init 项目名  // 初始化
```
在当前目录下生成 go.mod 文件

#### 下载依赖
``` go
go mod download
```
根据 go.mod 文件下载依赖


## Gin框架
[https://gin-gonic.com/zh-cn/](https://gin-gonic.com/zh-cn/)
[https://www.liwenzhou.com/posts/Go/Gin_framework/](https://www.liwenzhou.com/posts/Go/Gin_framework/)

#### 安装/更新
``` go

go get -u github.com/gin-gonic/gin

```

#### 基础版
``` go

package main
import (
    "net/http"
    "github.com/gin-gonic/gin"
)
func indexHandler(c *gin.Context) {
    // 返回 json, 状态码使用http包中的StatusOK(200)
    c.JSON(http.StatusOK, gin.H{
        "msg": "hello",
    })
}
func main() {
    // 路由模式为 Default
    router := gin.Default()
    // /hello GET 返回JSON 状态码200
    router.GET("/hello", func(c *gin.Context) {
        c.JSON(200, gin.H{
            "msg": "hello",
        })
    })
    // /index GET
    router.GET("/index", indexHandler)
    // 启动
    router.Run("127.0.0.1:9000")
}


```

#### Gin请求方式
Gin支持接受所有请求方法, 包括GET/POST/PUT等等
当我们不想在路由时候限制某个请求的请求方式时, 选择 Any 即可
在函数内获取该请求的方式为 c.Request.Method

``` go

package main
import (
    "fmt"
    "github.com/gin-gonic/gin"
)
func indexHandler(c *gin.Context) {
    // 字符串形式 POST/GET/PUT ...
    fmt.Println(c.Request.Method)
}
// 路由组
func main() {
    // Default默认使用Use 加了两个全局中间件, Logger(), Recovery(), Logger是打印日志, Recovery是panic返回500
    r := gin.Default()
    // Any代表匹配所有请求方式
    r.Any("/index", indexHandler)
    r.Run("127.0.0.1:9000")
}


```

#### Gin的渲染

``` go

package main
import (
    "github.com/gin-gonic/gin"
)
func indexHandler(c *gin.Context) {
    // 返回 json, 状态码使用http包中的StatusOK(200)
    // c.JSON(http.StatusOK, gin.H{
    //  "msg": "hello",
    // })
    // 返回 HTMl(配合模板语法) 状态码, 模板文件, 模板文件传值
    // c.HTML(http.StatusOK, "web/login.html", gin.H{
    //  "msg": "login",
    // })
    // 返回结构体对象(结构体字段首字母一定大写)
    // type info struct {
    //  Info string `json:"info"`
    // }
    // i1 := info{
    //  Info: "aaa",
    // }
    // c.JSON(http.StatusOK, i1)
    // 返回 XML
    // c.XML(http.StatusOK, gin.H{
    //  "msg": "hello",
    // })
    // 结构体的XML
    // type info struct {
    //  Info string
    // }
    // i1 := info{
    //  Info: "aaa",
    // }
    // c.XML(http.StatusOK, i1)
    // yaml
    // c.YAML(http.StatusOK, gin.H{
    //  "msg": "hello",
    // })
}
func main() {
    // 路由模式为 Default
    router := gin.Default()
    // 加载模板文件夹(当前目录下的tpmplates文件夹下所有文件夹下所有模板文件)
    router.LoadHTMLGlob("templates/**/*")
    // 设置静态文件目录(代码使用路径(url访问), 实际路径)
    router.Static("static", "./statics")
    // /index GET
    router.GET("/index", indexHandler)
    // 启动
    router.Run("127.0.0.1:9000")
}


```

#### Gin获取参数

``` go

package main
import (
    "net/http"
    "github.com/gin-gonic/gin"
)
func indexHandler(c *gin.Context) {
    // 获取url参数
    // a := c.Query("a") // 没有参数为nil
    a := c.DefaultQuery("a", "av") // 没有参数默认av
    // 获取form参数
    // f := c.PostForm("f") // 没有参数为nil
    f := c.DefaultPostForm("f", "fdef") // 没有参数默认 fdef
    c.JSON(http.StatusOK, gin.H{
        "a": a,
        "f": f,
    })
}
func urlHandler(c *gin.Context){
    // 提取url参数
    u := c.Param("id")
    c.JSON(http.StatusOK, gin.H{
        "u": u,
    })
}
func main() {
    // 路由模式为 Default
    router := gin.Default()
    // /index GET
    router.GET("/index", indexHandler)
    // 获取URL上的可变参数 id为可变参数
    router.GET("/urlget/:id", urlHandler)
    // 启动
    router.Run("127.0.0.1:9000")
}


```

#### Gin跳转
###### HTTP跳转
``` go
c.Redirect(状态码, "地址")
```
#### 路由跳转
``` go
c.Request.URL.Path = "跳转路由"
r.HandleContext(c)
```

#### Gin路由组
> 当路由较多时, 我们通常将路由分组管理(美观易维护)
> 
> 此时我们将路由进行分组
> 
> 可多层嵌套(层越多效率越慢)
> 
> 在HttpRouter包封装(使用前缀树匹配比其他的使用反射速度快很多)
> 
> 原理是创造了路由地址的前缀树(所以层越多路由匹配越慢)

![](https://img2020.cnblogs.com/blog/1268810/202003/1268810-20200303172726781-1327299399.png)


``` go

// 路由组
func main() {
    r := gin.Default()
    // 普通路由(多了不易维护)
    r.GET("/book", bookListHandler)
    r.POST("/book", bookInsertHandler)
    r.DELETE("/book/:ID", bookDeleteHandler)
    // 分组路由(易维护,可多层嵌套)
    apiV1Group := r.Group("/api/v1")
    {
        apiV1Group.GET("/index", v1IndexHandler) // URL: /api/v1/index
        apiV1Group.GET("/home", v1HomeHandler) // URL: /api/v1/home
    }
    r.Run("127.0.0.1:9000")
}

```

#### Gin上传文件

###### 单文件

``` go

package main
import (
    "fmt"
    "net/http"
    "github.com/gin-gonic/gin"
)
func fileHandler(c *gin.Context) {
    fileObj, err := c.FormFile("file") // file为字段名
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{
            "err": err,
        })
        return
    }
    // filePath 要保存在本地的路径(相对)
    filePath := fmt.Sprintf("./%s", fileObj.Filename) // fileObj.Filename: 上传文件的文件名
    // 保存文件到本地
    c.SaveUploadedFile(fileObj, filePath)
    c.JSON(http.StatusOK, gin.H{
        "data": filePath,
    })
}
// 路由组
func main() {
    r := gin.Default()
    // 提交文件默认是32MB大小
    r.MaxMultipartMemory = 8<<20 // 8MB
    // 接受文件
    r.POST("/file", fileHandler)
    r.Run("127.0.0.1:9000")
}


```

###### 多文件

``` go

package main
import (
    "fmt"
    "github.com/gin-gonic/gin"
)
func fileHandler(c *gin.Context) {
    form, err := c.MultipartForm()
    if err != nil {
        return
    }
    files := form.File["file"]
    for index, file := range files {
        // index 顺序
        fmt.Println(index)
        dst := fmt.Sprintf("./%s", file.Filename)
        c.SaveUploadedFile(file, dst)
    }
}
// 路由组
func main() {
    r := gin.Default()
    // 提交文件默认是32MB大小
    r.MaxMultipartMemory = 8 << 20 // 8MB
    // 接受文件
    r.POST("/file", fileHandler)
    r.Run("127.0.0.1:9000")
}


```

#### Gin中间件

> 比如某些接口我们需要用户登陆后才可以进行操作, 这时候我们可以在每个函数内引用一次判断, 但是中间件可以统一并轻松的做到这一点.
> 
> 中间件的信息传递使用 c.Set("key", "v"), 上文设置k,v, 下文使用 c.MustGet("key") 即可获得反射的值, 使用类型断言 比如 c.MustGet("key").(string)转字符串类型

``` go

package main
import (
    "fmt"
    "time"
    "github.com/gin-gonic/gin"
)
func indexHandler(c *gin.Context) {
}
// 统计耗时的中间件
func castTime(c *gin.Context) {
    // 获取当前时间
    startTime := time.Now()
    // 运行下一个注册的Handler函数
    c.Next()
    // 统计耗时
    cast := time.Since(startTime)
    fmt.Println(cast)
}
// 路由组
func main() {
    // Default默认使用Use 加了两个全局中间件, Logger(), Recovery(), Logger是打印日志, Recovery是panic返回500
    r := gin.Default()
    // (全局中间件) r.Use代表全局中间件
    r.Use(castTime)
    // (单url中间件) 路由注册时可以写多个函数, 请求进入先进第一个再往后走, 可以做中间件
    r.GET("/index", castTime, indexHandler)
    // (组中间件)
    apiV1Group := r.Group("/api/v1", castTime)
    {
        apiV1Group.GET("/index", v1IndexHandler) // URL: /api/v1/index
        apiV1Group.GET("/home", v1HomeHandler) // URL: /api/v1/home
    }
    r.Run("127.0.0.1:9000")
}


```

#### 参数绑定
> 我们处理用户请求的时候, 使用结构体绑定的方法来与用户发送的数据结合,往往能使代码更加简洁, 这就也是参数绑定

``` go

package main
import (
    "fmt"
    "net/http"
    "github.com/gin-gonic/gin"
)
// 数据绑定
// User struct
type User struct {
    // form tag 代表该字段对应的请求字段名, binding tag 代表没接收到传错(不写默认不报错)
    Username string `form:"username" json:"username" binding:"required"`
    Password string `form:"password" json:"password" binding:"required"`
}
func indexHandler(c *gin.Context) {
    if c.Request.Method == "POST" {
        // 实例化
        var u User
        // 将结构体u与用户传来的字段进行绑定(根据Content-Type来按格式解析)
        err := c.ShouldBind(&u)
        if err != nil {
            c.JSON(http.StatusOK, gin.H{
                "err": err.Error(),
            })
            return
        }
        // 绑定成功,拿到数据
        fmt.Println(u)
    }
}
// 路由组
func main() {
    // Default默认使用Use 加了两个全局中间件, Logger(), Recovery(), Logger是打印日志, Recovery是panic返回500
    r := gin.Default()
    // Any代表匹配所有请求方式
    r.Any("/index", indexHandler)
    r.Run("127.0.0.1:9000")
}

```

#### Gin连表查询
> 多表联合查询, 业务中常见的查询

跨表查询我们可以使用多种途径应对

###### sqlx结构体嵌套
因为sqlx传入的是一个结构体, 而与数据库的同步需要对照 db 的 tag, 所以我们可以使用结构体嵌套
要注意的是结构体嵌套过程中务必避免结构体的字段相同否则只会返回最外面的结构体(实际上只是 c.JSON 时出现的错误)
![](https://img2020.cnblogs.com/blog/1268810/202003/1268810-20200303172850342-877493789.png)


###### sqlx结构体不镶嵌
我们也可以直接将所有返回值写一个结构体里
![](https://img2020.cnblogs.com/blog/1268810/202003/1268810-20200303172923017-638428184.png)


###### sql
我们不使用sqlx模块, 而是直接赋值给变量, 再组合拿到想要的结果也是可以的

## logrus模块(日志)
[https://www.liwenzhou.com/posts/Go/go_logrus/](https://www.liwenzhou.com/posts/Go/go_logrus/)
![](https://img2020.cnblogs.com/blog/1268810/202003/1268810-20200303172948498-163058279.png)


#### 使用
```go

package main
// logrous
import (
    log "github.com/sirupsen/logrus"
)
func main() {
    // 设置此项输出的日志为JSON格式
    log.SetFormatter(&log.JSONFormatter{})
    // 设置此项有字段表示打印日志的文件位置(对性能有影响,不推荐线上使用)
    log.SetReportCaller(true)
    // 终端打印日志
    Userinf := log.WithFields(log.Fields{
        "name": "t1",
        "age": 3000,
    })
    // .Info指级别
    Userinf.Info("user info")
    // time="2019-08-22T16:36:00+08:00" level=info msg="user info" age=3000 name=t1
    log.Info("info") // 可不加自定义key/v
    // time="2019-08-22T17:08:16+08:00" level=info msg=info
}


```

#### 搭配Gin使用
[https://www.liwenzhou.com/posts/Go/go_logrus/#autoid-0-12-0](https://www.liwenzhou.com/posts/Go/go_logrus/#autoid-0-12-0)


#### 安装
``` go
go get -u github.com/sirupsen/logrus
```

## Cookie/Session
> HTTP 协议是无状态的, 所以需要Cookie和Session来保存一些状态/标识

[https://www.liwenzhou.com/posts/Go/Cookie_Session/](https://www.liwenzhou.com/posts/Go/Cookie_Session/)

#### Cookie
> Cookie 本质上是存储在浏览器上的多个键值对, 是保存于某个文件中 

``` go

package main
import (
    "fmt"
    "net/http"
    "github.com/gin-gonic/gin"
)
// Cookie示例
// User struct
type User struct {
    // form tag 代表该字段对应的请求字段名, binding tag 代表没接收到传错(不写默认不报错)
    Username string `form:"username" json:"username" binding:"required"`
    Password string `form:"password" json:"password" binding:"required"`
}
func getCookie(c *gin.Context) {
    username, err := c.Cookie("username")
    if err != nil {
        c.JSON(http.StatusOK, gin.H{
            "code": 1005,
        })
        return
    }
    // 设置username并执行下一个函数
    c.Set("username", username)
    c.Next()
}
func cookieHandler(c *gin.Context) {
    // GET验证Cookie
    if c.Request.Method == "GET" {
        username, ok := c.Get("username")
        if ok {
            // 取到
            fmt.Println(username.(string))
        } else {
            // 没取到
            c.JSON(http.StatusOK, gin.H{
                "code": 1008,
            })
            return
        }
    }
    // POST生成Cookie
    if c.Request.Method == "post" {
        // 参数绑定
        var u User
        err := c.ShouldBind(&u)
        if err != nil {
            c.JSON(http.StatusOK, gin.H{
                "code": 1001,
            })
            return
        }
        // 身份验证
        if u.Username == "t1" && u.Password == "t1p" {
            // 生成Cookie
            c.SetCookie("username", u.Username, 20, "/", "127.0.0.1", false, true)
        } else {
            c.JSON(http.StatusOK, gin.H{
                "code": 1003,
            })
            return
        }
    }
}
func main() {
    r := gin.Default()
    r.Any("/cookie", getCookie, cookieHandler)
    r.Run("127.0.0.1:9000")
}


```

#### Session
> Cookie是保存在浏览器端的, 所以Cookie有被人篡改或仿造的危险, 而且Cookie最大支持4KB的数据, 所以Session出现了
> 
> Session实际上是在服务器端保存用户的信息, 然后随机生成一个标识返回给浏览器Cookie, Cookie相当于这个钥匙, 拿到钥匙才能证明你的身份, 而且所有数据都在服务端, 客户端只有钥匙, 加大了安全性
> 
> Session是保存在服务器的键值对
> 
> Session必须依赖Cookie