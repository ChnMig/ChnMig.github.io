# 跳出循环的几种方式

比如这样的需求, 遍历一个 切片, 切片内容是切片1, 需求是判断切片1中某个是否有相应数据, 有就返回

我们需要考虑的是在写两层遍历时如何在获取结果后结束这两层遍历

## 变量法

设置一个变量, 在外层监听该变量, 获取到结果后修改该变量

```go
func main() {
	t := [][]int{{1, 2, 3, 4, 5}, {5, 6, 7, 8, 9}}
	s := false
	for _, v := range t {
		for _, v1 := range v {
			if v1 == 5 {
				s = true // 判断成立修改标量退出二层循环
				break
			}
		}
		if s { // 检测标量结果，为true代表命中
			break
		}
	}
}
```

缺点很明显, 如果套更多层需要在每个层都写一个判断标量的逻辑一层层退出

## goto

```go
func main() {
	t := [][]int{{1, 2, 3, 4, 5}, {5, 6, 7, 8, 9}}
	for _, v := range t {
		for _, v1 := range v {
			if v1 == 5 {
				goto Loop // 跳转到注册名为Loop的标记处，中间的代码直接跳过
			}
		}
	}
	fmt.Println("nil")
	return // 此处return防止继续执行loop的代码
Loop: // Loop标记处， Loop只是一个标记，正常顺序执行也会执行Loop的代码,,一般叫Loop,可以自定义,与上面一致即可
	fmt.Println("success")
}
```

此方法不止适用于循环,实际上他可以贴在任意地方,比如

```go
func main() {
	fmt.Println(1)
	goto Loop
	fmt.Println(2)
Loop:
	fmt.Println(3)
}
```

上面的 2 永远不会打印

这种方法的问题是会破坏正常的代码结构, 一个项目的代码必定是很多的, 有很多逻辑, 使用goto会破坏原有的代码结构, 大大降低了可读性和可维护性, 因此请尽可能的避免使用 goto

## break Label

给某一层循环设置一个Label,指定跳过某一个Label

```go
func main() {
	t := [][]int{{1, 2, 3, 4, 5}, {5, 6, 7, 8, 9}}
	s := false
Loop: // 标记该循环为Loop,一般叫Loop,可以自定义,与下面一致即可
	for _, v := range t {
		for _, v1 := range v {
			if v1 == 5 {
				s = true
				break Loop // 跳出Loop标记的循环
			}
		}
	}
	if s {
		fmt.Println("success")
	}
}
```

相比于 goto, break Label 只能在循环中使用, Loop只能注册到循环中, goto是跳转到某行执行, break是跳出Loop标记的循环,相对来说限制大一些, 没有那么随意, 而相比于 方法一,则无需写多层判断, 需要注意的是, break Label 的 Label 不一定是顶层, 可以在任意一层

```go
func main() {
	t := [][][]int{{{1, 2, 3, 4, 5}}, {{5, 6, 7, 8, 9}}}
	s := false
	for _, v := range t {
	Loop: // 标记该循环为Loop
		for _, v1 := range v {
			for _, v2 := range v1 {
				if v2 == 5 {
					s = true
					break Loop // 跳出Loop标记的循环
				}
			}
		}
	}
	if s {
		fmt.Println("success")
	}
}
```

## 单独写一个函数

这个不多说, 因为 return 直接退出函数了

```go
func t1(t [][][]int) bool {
	for _, v := range t {
		for _, v1 := range v {
			for _, v2 := range v1 {
				if v2 == 5 {
					return true
				}
			}
		}
	}
	return false
}

func main() {
	t := [][][]int{{{1, 2, 3, 4, 5}}, {{5, 6, 7, 8, 9}}}
	fmt.Println(t1(t))
}
```

## 总结

条条大路通罗马, 其实哪种都可以, 但是我还是推荐使用函数的形式, 因为goto和lable或多或少都会降低可读性. 何况, 如果真的出现多个循环在一个函数, 应该思考是不是设计的有问题或者实现的有问题.