---
title: 身份证号码缩小方案
date: 2022-03-08            
updated: 2022-03-08         
comments: true              
toc: true                   
excerpt: 前几天看见水群里某个大佬提出的问题, 怎么把身份证号减少位数, 大佬们给出的结果是6位, 我这里也自己思考和实现了一下...
tags:                       
- Golang
categories:                 
- 编程

---

## 前言

最近拿到了比较心怡的 offer, 苏州某旅游集团的, 感觉对自己的成长较大, 还是相对满意的

当然了, 成长大, 其实也是挑战大, 所以以后要更加的努力了, 加油

本篇文章是水群里有人问怎么把身份证号(18位)压缩成更少的位数, 群里大佬真的牛批, 说能压到6位, 并大致简述了一下思路, 我觉得还是可行的. 于是自己抄袭思路实现了一下功能, 测试了一下, 可以压缩到6-7位, 应该有更好的压缩方法, 这里只是记录一下我自己的版本

## 局限

这里我想提前说的是, 在真正的开发中, 极少数需要对身份证号码进行压缩的, 因为节省了空间, 带来的是很差的可读性, 而且对于一些数据筛选更是困难, 这里也仅仅是做参考和示例使用

## 思路

### 号码结构

对于身份证号码, 百度上有很多组成部分的解析, 这里摘抄一下百度百科[公民身份证号码_百度百科 (baidu.com)](https://baike.baidu.com/item/公民身份证号码/19623128?fr=aladdin)

1．号码的结构

公民身份号码是特征组合码，由十七位数字本体码和一位校验码组成。排列顺序从左至右依次为：六位数字地址码，八位数字出生日期码，三位数字顺序码和一位数字校验码。

2．地址码

表示编码对象常住户口所在县（市、旗、区）的行政区划代码，按GB/T2260的规定执行。

3．出生日期码

表示编码对象出生的年、月、日，按GB/T7408的规定执行，年、月、日代码之间不用分隔符。

4．顺序码

表示在同一地址码所标识的区域范围内，对同年、同月、同日出生的人编定的顺序号，顺序码的奇数分配给男性，偶数分配给女性。

5．校验码

根据前面十七位数字码，按照ISO 7064:1983.MOD 11-2校验码计算出来的检验码。



以身份证号码`130424200208110128` 来讲, 其分为几部分:

- `130424`: 地址码
- `20020811`: 出生年月日
- `012`: 出生顺序和性别
- `8`: 校验码

### 地址码

我们一步步来尝试压缩, 首先是地址码, 地址码在身份证号码中占据了6位, 地址码既然是标记了出生地, 那么就不可能是随机的, 其实中国很大, 我相信地址码也不会有`999999`个, 于是我查询了相关资料, 找到了民政部的公开资料[www.mca.gov.cn/article/sj/xzqh/2020/20201201.html](http://www.mca.gov.cn/article/sj/xzqh/2020/20201201.html), 稍微查看了一下有不超过4000个, 因此, 如果我们自己设置一个映射关系, 比如将地址码`654202`在数据库中设置一个唯一 id, 因为总共不超过4000个, 因此 id 最长也4位, 这样就可以**减少2位**

###出生日期码

出生日期, 在身份证中占据了6位, 分别是`YYYYMMDD`, 这个怎么去优化呢? 有大佬认为可以将年的前两位分为2种`19/20`, 然后月的第一位只有两种`0/1`, 日的第一位只有`0/1/2/3`, 这几个可以按位存储

我认为, 这样比较复杂, 而且`19/20`范围太小了,  我的思路是, 将其按照天数存储, 例如, `19000102`可以存储为`0000001`, 即存储从`1900年0101`开始到该用户出生日期的天数, 设计为最长7位, 我测试了一下, 支持到8888年也没有问题, 这样极大的提高了兼容性, 这里**减少1位**

### 顺序码

顺序码, 记录了顺序和性别, 思考了一下, 感觉这里无从下手, 于是顺序码没有进行简化

### 校验码

校验码本身占用一位, 但是校验码我查看了一下, 是通过前17位数字计算得来的, 计算规则为[身份证校验码计算公式及实例计算-百度经验 (baidu.com)](https://jingyan.baidu.com/article/ff4116259e0a7112e48237b9.html):

第一步：将身份证号码的第1位数字与7相乘；将身份证号码的第2位数字与9相乘；将身份证号码的第3位数字与10相乘；将身份证号码的第4位数字与5相乘；将身份证号码的第5位数字与8相乘；将身份证号码的第6位数字与4相乘；将身份证号码的第7位数字与2相乘；将身份证号码的第8位数字与1相乘；将身份证号码的第9位数字与6相乘；将身份证号码的第10位数字与3相乘；将身份证号码的第11位数字与7相乘；将身份证号码的第12位数字与9相乘；将身份证号码的第13位数字与10相乘；将身份证号码的第14位数字与5相乘；将身份证号码的第15位数字与8相乘；将身份证号码的第16位数字与4相乘；将身份证号码的第17位数字与2相乘。

第二步：将第一步身份证号码1~17位相乘的结果求和，全部加起来。

第三步：用第二步计算出来的结果除以11，这样就会出现余数为0，余数为1，余数为2，余数为3，余数为4，余数为5，余数为6，余数为7，余数为8，余数为9，余数为10共11种可能性。

第四步：如果余数为0，那对应的最后一位身份证的号码为1；如果余数为1，那对应的最后一位身份证的号码为0；如果余数为2，那对应的最后一位身份证的号码为X；如果余数为3，那对应的最后一位身份证的号码为9；如果余数为4，那对应的最后一位身份证的号码为8；如果余数为5，那对应的最后一位身份证的号码为7；如果余数为6，那对应的最后一位身份证的号码为6；如果余数为7，那对应的最后一位身份证的号码为5；如果余数为8，那对应的最后一位身份证的号码为4；如果余数为9，那对应的最后一位身份证的号码为3；如果余数为10，那对应的最后一位身份证的号码为2。

既然是计算的, 那么这里的校验位存储时可以舍去, 等还原时再进行计算和填充, 这里**减少1位**

### 进制转换

走到这里, 我们发现, 只减少了4位, 剩下14位, 还要怎么压缩呢? 这里使用大杀器, 进制转换

众所周知, 从低进制向高进制进行转换, 可以减少位数, 因为高进制每一位可以表示更多种数据可能, 这里不考虑数据库等等的兼容性, 直接使用 ascii 的所有可见字符, 94个, 也就是说将身份证号码转换为94进制, 达到压缩的目的

## 代码

当然是写完代码才有的这一个博客输出的喽,

### 地址码

地址码这里, 虽然翻看了 github 上有别人抓好的数据, 但是看更新日志有些年头了, 于是我自己写了一个 py 脚本, 进行数据抓取并保存在本地的 sqlite 文件中, py 文件如下(脚本依赖 `python3`)

依赖如下:

``` python
beautifulsoup4==4.10.0
requests==2.27.0
```

脚本代码如下:

``` python
import code
import logging
import sqlite3

import requests
from bs4 import BeautifulSoup

# 中华人民共和国民政部官网->民政数据->行政区划代码
mca_url = "http://www.mca.gov.cn/article/sj/xzqh/2020/20201201.html"

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

def get_response():
    # 获取行政区划网页数据
    response = requests.get(url=mca_url)
    if response.status_code != 200:
        logger.warning("获取数据时出现问题, 网页返回状态码: %s" % response.status_code)
        return
    return response.content

def parse_response(content: str):
    # 解析response
    soup = BeautifulSoup(content, "html.parser")
    tab = soup.find(name="table")
    if not tab:
        logger.warning("解析失败, 没有找到 table 元素")
        return
    trs = tab.find_all(name="tr")
    if len(trs) == 0:
        logger.warning("解析失败, 没有找到 tr 元素")
        return
    codes = []
    for i in range(len(trs)):
        if i <= 2:
            # 前3行是标题
            continue
        tds = trs[i].find_all(name="td")
        if len(tds) < 2:
            continue
        code = tds[1].get_text().strip()  # 真实的区域码 
        if not code:
            continue
        code = int(code)
        name = tds[2].get_text().strip()  # 区域名
        id = i-2  # id
        codes.append((id, code, name))
    return codes


def insert_db(codes: list):
    con = sqlite3.connect("area.sqlite")
    cur = con.cursor()
    sql = """
        CREATE TABLE "area" (
        "id" INTEGER NOT NULL,
        "code" integer,
        "name" TEXT,
        PRIMARY KEY ("id")
        );
    """
    cur.execute(sql)
    sql = """
        CREATE UNIQUE INDEX "code"
        ON "area" (
        "code"
        );
    """
    cur.execute(sql)
    cur.executemany('INSERT INTO area VALUES (?,?,?)', codes)
    con.commit()
    # 关闭游标
    cur.close()
    # 断开数据库连接
    con.close()


def main():
    content = get_response()
    codes = parse_response(content)
    insert_db(codes)


if __name__ == "__main__":
    main()
```

简单的爬虫脚本, 但是网页不规范(ZF 网站通病), 导致做了很多的兼容处理

执行完成后, 会在本地生成`area.sqlite`文件

而我们使用 go 进行 sqlite 文件的读取, 纯纯的读取而不是修改和插入, 对于读取, 需要有两个方法, 当压缩时, 我们需要通过地址码来获取对应的 id, 在解压时, 需要通过 id 获取对应的地址码, 下面是`area.go`:

``` go
package main

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

// sqlite
type SqliteConn struct {
	file string
	conn *sql.DB
}

// 初始化
func InitSqlite(file string) (*SqliteConn, error) {
	return &SqliteConn{
		file: file,
	}, nil
}

// 连接
func (c *SqliteConn) Conn() error {
	db, err := sql.Open("sqlite3", c.file)
	if err != nil {
		return err
	}
	c.conn = db
	return nil
}

// 关闭连接
func (c *SqliteConn) Close() {
	c.conn.Close()
}

// 获取 code
func (c *SqliteConn) GetCode(id int) (int, error) {
	code := 0
	sql := "SELECT code FROM area WHERE id=?"
	row := c.conn.QueryRow(sql, id)
	if row.Err() != nil {
		return code, fmt.Errorf("未查询到数据")
	}
	if err := row.Scan(&code); err != nil {
		return code, fmt.Errorf("数据解析错误")
	}
	return code, nil
}

// 获取 ID
func (c *SqliteConn) GetID(code int) (int, error) {
	id := 0
	sql := "SELECT id FROM area WHERE code=?"
	row := c.conn.QueryRow(sql, code)
	if row.Err() != nil {
		return id, fmt.Errorf("未查询到数据")
	}
	if err := row.Scan(&id); err != nil {
		return id, fmt.Errorf("数据解析错误")
	}
	return id, nil
}
```

### 出生日期码

出生日期码, 也是两个方法, 一个是将日期转成从`19700101`到指定日期的天数, 一个是根据天数算出日期

这里需要注意的是, 使用`Sub`方法, 不能进行很长的时间间隔计算, 其文档所述`Sub returns the duration t-u. If the result exceeds the maximum (or minimum) value that can be stored in a Duration, the maximum (or minimum) duration will be returned. To compute t-d for a duration d, use t.Add(-d).`, 所以这里按照250年进行切分, 解决日期差距过长导致的计算错误

`time2.go`文件如下:

``` go
package main

import (
	"fmt"
	"strconv"
	"time"
)

func time2Day(startTime, endTime time.Time) int {
	// 因为官方的 time.Add/Sub 最多只能29X 年, 所以自己实现一个, 250年一个循环
	maxYear := 250
	day := 0
	for {
		middleTime := startTime.AddDate(maxYear, 0, 0)
		if endTime.Sub(middleTime).Hours() > 0 {
			// 还没有到
			day += int(middleTime.Sub(startTime).Hours()) / 24
			startTime = middleTime
		} else {
			// 到了
			day += int(endTime.Sub(startTime).Hours()) / 24
			break
		}
	}
	return day
}

func Time2Day(Y, M, D string) (int, error) {
	// 转换时间
	// 将时间转换成从1900年1月1日之后的天数
	eTm, err := time.Parse("2006-01-02", fmt.Sprintf("%v-%v-%v", Y, M, D))
	if err != nil {
		return 0, err
	}
	sTm, err := time.Parse("2006-01-02", "1900-01-01")
	if err != nil {
		return 0, err
	}
	subD := time2Day(sTm, eTm)
	if subD > 9999999 { // 防止特别大做的天数限制
		return 0, fmt.Errorf("year exceeding the limit")
	}
	return subD, nil
}

func Day2Time(d string) (string, error) {
	// 转换时间
	// 从1900年1月1日之后的天数转换成时间
	sTm, err := time.Parse("2006-01-02", "1900-01-01")
	if err != nil {
		return "", err
	}
	subD, _ := strconv.Atoi(d)
	nTm := sTm.AddDate(0, 0, subD)
	snTm := fmt.Sprintf("%v%v%v", nTm.Year(), func(ntm time.Time) string {
		if int(nTm.Month()) < 10 {  // 对1位月份兼容
			return fmt.Sprintf("0%v", int(ntm.Month()))
		}
		return fmt.Sprintf("%v", int(ntm.Month()))
	}(nTm), func(ntm time.Time) string {
		if nTm.Day() < 10 {  // 对1位日期做兼容
			return fmt.Sprintf("0%v", ntm.Day())
		}
		return fmt.Sprintf("%v", ntm.Day())
	}(nTm))
	return snTm, nil
}
```

### 校验码计算

校验码计算按照上面的百度说的方式, 先进行相乘, 然后进行整除, 求余数进行对应

`validate.go`代码如下

``` go
package main

import "fmt"

var validate = [11]string{"1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"}

var base = [17]int{7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2}

func CalculteValidateCode(IDCard string) (string, error) {
	validateCode := ""
	count := 0
	if len(IDCard) != len(base) {
		return validateCode, fmt.Errorf("not find on base")
	}
	for i, v := range IDCard {
		bv := base[i]
		count += bv * int(v-48)
	}
	return validate[count%11], nil
}
```

这里有趣的是, 利用遍历字符串, 每个元素是其`ASCII`的编号的特征, 使其`-48`来计算得出真实的数字

### 进制转换

go 虽然本身自带了进制转换, 但是最高支持32位, 并不支持94位, 其实进制转换超过32位也不常见, 据我所知只有短网址生成需要`64进制`, 这里只能自己实现一个

``` go
package main

import (
	"fmt"
	"math"
	"strings"
)

// 拼接 ascii 字符串
func initAsciiString(start, end int) (string, error) {
	compare := ""
	if start > end {
		return compare, fmt.Errorf("error")
	}
	for i := start; i <= end; i++ {
		compare = compare + fmt.Sprintf("%v", string(rune(i)))
	}
	return compare, nil
}

type Conver struct {
	asciiString string
	len         int
}

func InitConver(asciiString string) (*Conver, error) {
	return &Conver{
		asciiString: asciiString,
		len:         len(asciiString),
	}, nil
}

// 十进制转任意进制
func (c *Conver) Num2BHex(num int) string {
	num_str := ""
	for num != 0 {
		yu := num % c.len
		num_str = string(c.asciiString[yu]) + num_str
		num = num / c.len
	}
	return num_str
}

// 任意进制转十进制
func (c *Conver) BHex2Num(str string) int {
	v := 0.0
	length := len(str)
	for i := 0; i < length; i++ {
		s := string(str[i])
		index := strings.Index(c.asciiString, s)
		v += float64(index) * math.Pow(float64(c.len), float64(length-1-i)) // 倒序
	}
	return int(v)
}
```

 ### 压缩

为了一定程度的规范代码, 我会将身份证先进行分割, 保存到结构体中, 压缩的主要流程, 在`complex2simple.go`中

在编写代码中, 遇到过两个问题:

**地区对应编号可能不足4位**

比如说编号`110101`, 对应的是北京市东城区, 他的 id 是2, 但是 id 最长有可能是4位, 不足的话在前面填充0又感觉麻烦(比如`2`变成`0002`), 于是查看了一下目前的数据为3209条, 将 id 存储时变为`5000-id`, 这样保证永远占用4位, 解码时记得处理即可

**压缩日期这里, 有可能不足7位**

对于比较小的日期, 算出来天数, 有可能不足7位, 如果在前加入0填充, 又稍微麻烦点, 设置最高值也可以, 但是有一种办法更省力, 那就是把日期挪到最后, 地区确定4位, 顺序码3位, 剩下的全部都是天数

``` go
package main

import (
	"fmt"
	"strconv"
)

type IDCardSplit struct {
	AreaCode string
	Year     string
	Month    string
	Day      string
	Order    string
	Validate string
}

// 切分身份证
func splitID(ID string) (IDCardSplit, error) {
	// 切分原始身份证, 剥离出地区码和校验码
	IDS := IDCardSplit{}
	for i, v := range ID {
		switch {
		case i <= 5:
			IDS.AreaCode += string(v)
		case i > 5 && i <= 9:
			IDS.Year += string(v)
		case i > 9 && i <= 11:
			IDS.Month += string(v)
		case i > 11 && i <= 13:
			IDS.Day += string(v)
		case i > 13 && i <= 16:
			IDS.Order += string(v)
		case i == 17:
			IDS.Validate = string(v)
		}
	}
	return IDS, nil
}

func Complex2Simple(IDC string) (string, error) {
	sID, _ := splitID(IDC)
	simpleSID := ""

	// 初始化 sqlite 数据库
	con, err := InitSqlite("area.sqlite")
	if err != nil {
		fmt.Println(err)
		return simpleSID, err
	}
	// 连接数据库
	if err := con.Conn(); err != nil {
		fmt.Println(err)
		return simpleSID, err
	}
	defer con.Close()
	// 转换地区码为 int
	areaCode, err := strconv.Atoi(sID.AreaCode)
	if err != nil {
		fmt.Println(err)
		return simpleSID, err
	}
	// 获取 areaID
	areaID, err := con.GetID(areaCode)
	if err != nil {
		fmt.Println(err)
		return simpleSID, err
	}
	d, err := Time2Day(sID.Year, sID.Month, sID.Day)
	if err != nil {
		return simpleSID, err
	}
	simpleSID = fmt.Sprintf("%v%v%v", maxAreaID-areaID, sID.Order, d)
	simpleID, _ := strconv.Atoi(simpleSID)
	asciiString, err := initAsciiString(33, 126) // 所有可见 ascii, 94个
	if err != nil {
		fmt.Println(err)
		return simpleSID, err
	}
	conver, _ := InitConver(asciiString)
	s := conver.Num2BHex(simpleID)
	return s, nil
}
```

### 解压缩

与压缩基本相反, 需要注意的是顺序发生了调整, 另外, 在通过 id 获取地区码时, 注意要先使用`5000-id`得出真正的 id

`simple2complex.go`

``` go
package main

import (
	"fmt"
	"strconv"
)

type IDCardSimpleSplit struct {
	AreaID string
	SubDay string
	Order  string
}

// 切分simple 字符串
func splitSimple(simple string) (IDCardSimpleSplit, error) {
	// 切分 simple
	IDS := IDCardSimpleSplit{}
	for i, v := range simple {
		switch {
		case i <= 3:
			IDS.AreaID += string(v)
		case i > 3 && i <= 6:
			IDS.Order += string(v)
		case i > 6:
			IDS.SubDay += string(v)
		}
	}
	return IDS, nil
}

func Simple2Complex(simpleID string) (string, error) {
	complexID := ""
	asciiString, err := initAsciiString(33, 126) // 所有可见 ascii, 94个
	if err != nil {
		fmt.Println(err)
		return complexID, err
	}
	conver, _ := InitConver(asciiString)
	s := conver.BHex2Num(simpleID)
	sID, err := splitSimple(fmt.Sprintf("%v", s))
	if err != nil {
		fmt.Println(err)
		return complexID, err
	}
	// 初始化 sqlite 数据库
	con, err := InitSqlite("area.sqlite")
	if err != nil {
		fmt.Println(err)
		return complexID, err
	}
	// 连接数据库
	if err := con.Conn(); err != nil {
		fmt.Println(err)
		return complexID, err
	}
	defer con.Close()
	// 转换地区码为 int
	areaSID, err := strconv.Atoi(sID.AreaID)
	if err != nil {
		fmt.Println(err)
		return complexID, err
	}
	// 获取 areaID
	areaID, err := con.GetCode(maxAreaID - areaSID)
	if err != nil {
		fmt.Println(err)
		return complexID, err
	}
	snTm, err := Day2Time(sID.SubDay)
	if err != nil {
		return complexID, err
	}
	complexID = fmt.Sprintf("%v%v%v", areaID, snTm, sID.Order)
	validate, _ := CalculteValidateCode(complexID)
	complexID = complexID + validate
	return complexID, nil
}
```

### 测试

`main.go`如下

``` go
package main

import (
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

var maxAreaID = 5000

func main() {
	IDC := "411503211208110123" // 原始的身份证号码
	simple, err := Complex2Simple(IDC)
	fmt.Println(err)
	fmt.Println(simple)
	c, err := Simple2Complex(simple)
	fmt.Println(err)
	fmt.Println(c)
}
```

运行

``` bash
➜  task_test go run .
<nil>
NtnBRM
<nil>
411503211208110123
```

## 写在最后

虽然想法比较简单, 但是实现起来还是有些复杂的, 包括日期的转换, 进制计算这些, 也算是受益良多

下次实现一个64进制的短网址 DEMO 吧















