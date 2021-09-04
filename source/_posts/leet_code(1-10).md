---
title: LeetCode解题(1-10)
date: 2021-09-04            
updated: 2021-09-04         
comments: true              
toc: true                   
excerpt: LeetCode题目个人答案(Golang版)
tags:                       
- Golang
- LeetCode
categories:                 
- 编程
---

## 1.两数之和(简单)

https://leetcode-cn.com/problems/two-sum/

### 题目

给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。

### 示例

```
给定 nums = [2, 7, 11, 15], target = 9

因为 nums[0] + nums[1] = 2 + 7 = 9
所以返回 [0, 1]
```

### 解答

```go
package main

/*
URL: https://leetcode-cn.com/problems/two-sum/
解题思路: 维护一个map,key为nums的值,value为该值的索引,
	遍历一遍nums, 假设每个值为b, 算出a+b中a的值,
	判断map存不存在, 如存在则获取到map中a的value(索引),
	不存在则将b的值与索引加入map中,
	有可能都不匹配,注意在遍历结束后返回一个空切片	
*/

func twoSum(nums []int, target int) []int {
    sumMap := map[int]int{}
    for index, value := range nums{
        mapValue, ok := sumMap[target-value]
        if !ok{
            sumMap[value] = index
            continue
        }
        return []int{mapValue, index}
    }
    return []int{}
}
```

## 2.两数相加(中等)

https://leetcode-cn.com/problems/add-two-numbers/

### 题目

给出两个 非空 的链表用来表示两个非负的整数。其中，它们各自的位数是按照 逆序 的方式存储的，并且它们的每个节点只能存储 一位 数字。

如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。

您可以假设除了数字 0 之外，这两个数都不会以 0 开头。

### 示例

```
输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
输出：7 -> 0 -> 8
原因：342 + 465 = 807
```

### 解答

```go
package main

/*
URL: https://leetcode-cn.com/problems/add-two-numbers/
解题思路: 新建函数 addNode
addNode 多接收一个参数为偏移值
读取两个结构体的 val，相加，大于10则pre为1
使用递归来层层读取调用 addNode
*/


type ListNode struct {
	Val  int
	Next *ListNode
}

func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {
	return addNode(l1, l2, 0)
}

func addNode(l1 *ListNode, l2 *ListNode, pre int) *ListNode {
	// 处理链表
	if l1 == nil && l2 == nil{
		if pre == 0{
			return nil
		}else {
			return &ListNode{
				Val:  pre,
				Next: nil,
			}
		}
	}
	if l1 == nil{
		l1 = &ListNode{
			Val:  0,
			Next: nil,
		}
	}
	if l2 == nil{
		l2= &ListNode{
			Val:  0,
			Next: nil,
		}
	}

	count := l1.Val + l2.Val + pre  // 计算本次数据结果,pre为上一次计算满10进1
	p := 0
	if count >= 10{
		p = 1
		count = count - 10
	}
	node := &ListNode{
		Val: count,
		Next: addNode(l1.Next, l2.Next, p),
	}
	return node
}

```

## 3.无重复字符的最长子串(中等)

https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/

### 题目

给定一个字符串，请你找出其中不含有重复字符的 **最长子串** 的长度。

### 示例

```
输入: "abcabcbb"
输出: 3 
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```

```
输入: "bbbbb"
输出: 1
解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。
```

```
输入: "pwwkew"
输出: 3
解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
     请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。
```

### 解答

```go
package main

/*
URL: https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/
滑块模式，维护一个map，存放当前滑块内的内容，
滑块向前滑动，新的字符直接加入滑块
老的字符先判断是否在滑块内，在则滑块起始为老的字符出现位置+1
每次获取一下长度，如果大于已保存的最大长度则最大长度+1
*/

func lengthOfLongestSubstring(s string) int {
	var ins = make(map[int32]int, len(s))  // 建立存放已出现字符的map，key为该字符，value为下标
	max := 0  // 最大值
	startIndex := 0  // 起点下标
	for index, value := range s {
		// 遍历字符串
		oldIndex, ok := ins[value]  // 判断字符是否已经出现过
		ins[value] = index  // 如出现过将map字符下标替换成新的，未出现过新增
		if ok && startIndex <= oldIndex {  // 如果之前出现过且老的下标在起点下标之内，代表之前虽然有出现过且在·滑动窗口内
			startIndex = oldIndex + 1  // 将起点下标向前偏移一位，去除重复字符
		}
		if (index - startIndex + 1) > max {  // 判断现在的长度是否超过记录的最大长度
			max = index - startIndex + 1  // 更新最大长度
		}
	}
	return max
}

```

## 4. 寻找两个正序数组的中位数(困难)

https://leetcode-cn.com/problems/median-of-two-sorted-arrays/

### 题目

给定两个大小为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。

请你找出这两个正序数组的中位数，并且要求算法的时间复杂度为 O(log(m + n))。

你可以假设 nums1 和 nums2 不会同时为空。

### 示例

```
nums1 = [1, 3]
nums2 = [2]

则中位数是 2.0
```

```
nums1 = [1, 2]
nums2 = [3, 4]

则中位数是 (2 + 3)/2 = 2.5
```

### 解答

> pass

## 5.最长回文子串(中等)

https://leetcode-cn.com/problems/longest-palindromic-substring/

### 题目

给定一个字符串 `s`，找到 `s` 中最长的回文子串。你可以假设 `s` 的最大长度为 1000

### 示例

```
输入: "babad"
输出: "bab"
注意: "aba" 也是一个有效答案。
```

```
输入: "cbbd"
输出: "bb"
```

### 解答

```go
package main

/*
URL: https://leetcode-cn.com/problems/longest-palindromic-substring/
中心扩散法: 遍历目标字符串, 以当前字符为中心, 向两边扩散, 如一致则继续扩散, 比较找出最长的, 此为奇数扩散
针对类似于 baa 这种情况, 连续两个相同的字符串, 在遍历时考虑将当前字符与下一个字符当作扩散的中心, 此为偶数扩散
*/

func longestPalindrome(s string) string {
	maxStr := ""
	// 长度为0或1直接返回
	if len(s) <= 1 {
		return s
	}
	// 循环
	for i := range s {
		t := verify(s, i, i)
		if len(t) > len(maxStr) {
			maxStr = t
		}
		t = verify(s, i, i+1)
		if len(t) > len(maxStr) {
			maxStr = t
		}
	}
	return maxStr
}

func verify(s string, l int, r int) string {
	for {
		if l >= 0 && r < len(s) && s[l] == s[r] {
			l--
			r++
		} else {
			// 如果匹配不上了, 返回上一个匹配成功的回文
			// list包头不包尾, 所以 l+1 而 r 不包
			return s[l+1 : r]
		}
	}
}

```

## 6.Z字形变换(中等)

https://leetcode-cn.com/problems/zigzag-conversion/

### 题目

将一个给定字符串根据给定的行数，以从上往下、从左到右进行 Z 字形排列。

比如输入字符串为 "LEETCODEISHIRING" 行数为 3 时，排列如下：

```
L   C   I   R
E T O E S I I G
E   D   H   N
```

之后，你的输出需要从左往右逐行读取，产生出一个新的字符串，比如："LCIRETOESIIGEDHN"。

请你实现这个将字符串进行指定行数变换的函数：

string convert(string s, int numRows);

### 示例

```
输入: s = "LEETCODEISHIRING", numRows = 3
输出: "LCIRETOESIIGEDHN"
```

```
输入: s = "LEETCODEISHIRING", numRows = 4
输出: "LDREOEIIECIHNTSG"
解释:

L     D     R
E   O E   I I
E C   I H   N
T     S     G

```

### 解答

```go
package main

/*
URL: https://leetcode-cn.com/problems/zigzag-conversion/
解题思路: 我们把 Z 结构的中间的空格全部去掉, 会发现实际上是一个二维数组,
每独取一个新的字符, 将其存储进当前数组, 再读取下一个字符存储进下一行数组,
当触碰到行底时, 下一个字符存储进上一行直到行初再正序存储
*/

func convert(s string, numRows int) string {
	if numRows == 1 {
		return s
	}
	var resList = make([][]string, numRows)
	res := ""
	rowIndex := 0
	flag := 1
	for _, v := range s {
		resList[rowIndex] = append(resList[rowIndex], string(v))
		switch rowIndex {
		case numRows - 1:
			flag = -1
		case 0:
			flag = 1
		}
		rowIndex = rowIndex + flag
	}

	for _, v := range resList {
		for _, k := range v {
			res = res + k
		}
	}
	return res
}

```

## 7.整数反转(简单)

https://leetcode-cn.com/problems/reverse-integer/

### 题目

给出一个 32 位的有符号整数，你需要将这个整数中每位上的数字进行反转。

假设我们的环境只能存储得下 32 位的有符号整数，则其数值范围为 [−231, 231 − 1]。请根据这个假设，如果反转后整数溢出那么就返回 0。

### 示例

```
输入: 123
输出: 321
```

```
输入: -123
输出: -321
```

```
输入: -123
输出: -321
```

### 解答

```go
package main

import "math"

/*
URL: https://leetcode-cn.com/problems/reverse-integer/
首先我们可以使用 math 包下的变量来判断是否超限
反转方面使用求余+取模计算即可
*/

func reverse(x int) int {
	if x < math.MinInt32 || x > math.MaxInt32 {
		return 0
	}
	res := 0
	for x != 0 {
		temp := x % 10
		x = x / 10
		res = res*10 + temp
		if res < math.MinInt32 || res > math.MaxInt32 {
			return 0
		}
	}
	return res
}

```

## 8.字符串转换整数 (atoi)(中等)

https://leetcode-cn.com/problems/string-to-integer-atoi/

### 题目

请你来实现一个 atoi 函数，使其能将字符串转换成整数。

首先，该函数会根据需要丢弃无用的开头空格字符，直到寻找到第一个非空格的字符为止。接下来的转化规则如下：

如果第一个非空字符为正或者负号时，则将该符号与之后面尽可能多的连续数字字符组合起来，形成一个有符号整数。
假如第一个非空字符是数字，则直接将其与之后连续的数字字符组合起来，形成一个整数。
该字符串在有效的整数部分之后也可能会存在多余的字符，那么这些字符可以被忽略，它们对函数不应该造成影响。
注意：假如该字符串中的第一个非空格字符不是一个有效整数字符、字符串为空或字符串仅包含空白字符时，则你的函数不需要进行转换，即无法进行有效转换。

在任何情况下，若函数不能进行有效的转换时，请返回 0 。

本题中的空白字符只包括空格字符 ' ' 。
假设我们的环境只能存储 32 位大小的有符号整数，那么其数值范围为 [−231,  231 − 1]。如果数值超过这个范围，请返回  INT_MAX (231 − 1) 或 INT_MIN (−231) 。

### 示例

```
输入: "42"
输出: 42
```

```
输入: "   -42"
输出: -42
解释: 第一个非空白字符为 '-', 它是一个负号。
     我们尽可能将负号与后面所有连续出现的数字组合起来，最后得到 -42 。
```

```
输入: "4193 with words"
输出: 4193
解释: 转换截止于数字 '3' ，因为它的下一个字符不为数字。
```

```
输入: "words and 987"
输出: 0
解释: 第一个非空字符是 'w', 但它不是数字或正、负号。
     因此无法执行有效的转换。
```

```
输入: "-91283472332"
输出: -2147483648
解释: 数字 "-91283472332" 超过 32 位有符号整数范围。 
     因此返回 INT_MIN 。
```

### 解答

```go
package main

import (
	"fmt"
	"math"
	"strconv"
)

/*
URL: https://leetcode-cn.com/problems/string-to-integer-atoi/
解题思路: 普通的逻辑处理
*/

func myAtoi(str string) int {
	si := ""
	sum := 1
	stop := false
	for _, v := range str{
		vs := fmt.Sprintf("%c", v)
		if vs == " " && stop == false && si == "" {
			// 捕捉最开始是空格的情况
			continue
		}
		if vs == "-" && stop == false{
			// 捕捉以-开头
			sum = -1
			stop = true
			continue
		}
		if vs == "+" && stop == false{
			// 捕捉以+开头
			sum = 1
			stop = true
			continue
		}
		if _, err := strconv.Atoi(vs); err == nil{
			// 捕捉数字
			stop = true
			si+=vs
			continue
		}
		break
	}
	res, _ := strconv.Atoi(si)
	if res < math.MinInt32 || res > math.MaxInt32 {
		if sum == 1{
			return math.MaxInt32
		}
		return math.MinInt32
	}
	return res * sum
}

```

## 9. 回文数(简单)

https://leetcode-cn.com/problems/palindrome-number/

### 题目

判断一个整数是否是回文数。回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。

### 示例

```
输入: 121
输出: true
```

```
输入: -121
输出: false
解释: 从左向右读, 为 -121 。 从右向左读, 为 121- 。因此它不是一个回文数。
```

```
输入: 10
输出: false
解释: 从右向左读, 为 01 。因此它不是一个回文数。
```

### 进阶

你能不将整数转为字符串来解决这个问题吗？

### 解答

```go
package main

import (
	"strconv"
)

/*
URL: https://leetcode-cn.com/problems/palindrome-number/
解题思路: 转换成字符串，遍历一半即可，对于基数长度，最中间的数字不必要比较
*/

func isPalindrome(x int) bool {
	s := strconv.Itoa(x)
	l := len(s)
	for i := 0; i<= l/2-1; i++{
		if s[i] != s[l-i-1]{
			return false
		}
	}
	return true
}

```