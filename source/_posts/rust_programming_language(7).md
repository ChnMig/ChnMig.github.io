---
title: Rust程序设计语言(7)              
date: 2021-11-26            
updated: 2021-11-27         
comments: true              
toc: true                   
excerpt: Rust开发中常见的集合和基本的使用方法
tags:                       
- Rust
categories:                 
- 编程
---

## 前言

> 最近真的有点焦虑啊, 难受了

Rust 的标准库中有一些我们常用的数据结构, 帮助我们更快更好的开发代码, 这种数据结构被称为`集合`, 大部分其他的数据结构, 比如`int`大多数只能代表一个值, 而集合可以有多个值

当然我们之前提到的 数组, 元组, 也是可以存储多个值, 但是他们是将数据存储在 栈 上的, 之前我们说过, 栈上的数据是需要在分配时就指定其大小, 所以对于动态的可变的数据集合, 最好还是存在堆上, 集合就是这样, 所以一般而言, 使用本篇介绍的集合结构的时候通常比较多, 本篇介绍3个在 Rust程序中被广泛使用的集合

- vector可以一个接一个的存储一系列数量可变的值
- 字符串(string)是字符的集合
- 哈希 map(hash map)可以将值和特定的键绑定, 和 `python` 的 `dict` 以及 `golang`的 `map` 类似

## vector

vector 类型是`Vec<T>`, vector 的特点是他的多个值都在内存中彼此相邻的排列在一起, 这样会提高查找和操作的速度, 一个 vec 下的所有值的类型必须相同

[Vec in std::vec - Rust (rust-lang.org)](https://doc.rust-lang.org/std/vec/struct.Vec.html)

### 新建

可以使用`Vec::new`来新建一个空的`Vec`

``` rust
let v: Vec<i32> = Vec::new();  // 新建一个 Vec, Vec 内部的值类型是 i32, 现在还没有具体的值
```

这一句的作用是新建一个空的 Vec 类型, 此时因为没有给 Vec 设置指定的值, 所以 Rust 是不知道这个 Vec 需要存储的值的类型, 这里我们在新建时就使用`Vec<i32>`来设置里面存储的值的类型

还有一种方法

``` rust
let v = vec![1, 2, 3];  // 新建一个 Vec. 在创建时就插入3个值 1, 2, 3
```

注意到, `vec!`这是一个宏, 这个宏会根据我们提供的值来创建 Vector, 同时自己判断值的类型并给这个 vec 进行设置, 这里就是自己推断出是 i32 类型

### 更新

使用`push`里可以项 vec 里增加值

``` rust
    let mut v: Vec<i32> = Vec::new();  // 新建一个 Vec, Vec 内部的值类型是 i32, 现在还没有具体的值
    let mut v1 = Vec::new();  // 空的 vec, 类型还没有指定
    let mut v2 = vec![1, 2];  // vec
    v.push(3);  // 新增
    v1.push(3);  // 这里是先获取到值的类型, 设置 vec 的类型, 再新增到 v1
    v2.push(3);  // 新增
```

`push`可以更新 vec 的值, 准确说是追加

这里的 v1 , 在新建时没有指定类型, 而是在 push 时靠 rust 自己判断, 也是可以的

### 释放

`vector`在其离开作用域时会被释放掉

``` rust
{
    let v = vec![1, 2, 3, 4];

    // 处理变量 v

} // <- 这里 v 离开作用域并被丢弃
```

当 vector 被丢弃, 里面的值也会被丢弃

### 读取

读取 vector 的值可以使用索引和`get`

``` rust
let v = vec![1, 2, 3, 4, 5];

let third: &i32 = &v[2];  // 获取索引2的值
println!("The third element is {}", third);

match v.get(2) {  // 使用 get 获取索引2的值, 没有就是 None, 这里使用 match 判断
    Some(third) => println!("The third element is {}", third),
    None => println!("There is no third element."),
}
```

对于直接获取索引的方式, 如果索引超出了范围, 比如只有3个值, 结果你获取索引3, 就会导致程序发生 panic, 直接崩溃

使用`get`, 如果超出索引, 只会返回`None`, 所以一般使用 get 来防止程序崩溃

下面再看一个代码

``` rust
let mut v = vec![1, 2, 3, 4, 5];  // 可变的 vec

let first = &v[0];  // 借用 v 的第0个值

v.push(6);  // 给 v 追加值6

println!("The first element is: {}", first);  // 触发了 panic
```

这个代码实际上会报错

``` bash
➜  t_vec git:(master) ✗ cargo run 
   Compiling t_vec v0.1.0 (/Users/Work/Code/Rust/student/t_vec)
warning: unused variable: `first`
 --> src/main.rs:4:9
  |
4 |     let first = &v[0];
  |         ^^^^^ help: consider prefixing with an underscore: `_first`
  |
  = note: `#[warn(unused_variables)]` on by default

    Finished dev [unoptimized + debuginfo] target(s) in 0.32s
     Running `target/debug/t_vec`
```

之前在所有权那里, 你已经知道了, 可变引用和不可变是无法同时存在的, 这里的 first 是不可变引用, 随后 v 自己进行了追加操作, 而后再打印 first (不可变引用)就触发了冲突, 为什么对 v 进行 push 会对所有权进行转移? 这是因为 vector 之前说过, 里面的每个值在内存中是相邻的, 但是系统的内存分配并不受 rust 控制, 会出现这种情况, 本来这个 vec 长度为3, 于是 rust 在内存中存储了长度为3的数据, 此时别的软件也向系统申请了内存, 在你的数据之后, 与你的数据相邻, 此时你获取了索引为0的地址, 而后进行 push 操作, 新增一个值, 此时因为内存中你的相邻处已经被其他值占领, 于是rust 只能再请求一个新的长度为4的地址,把4个值重新放入新的地址保证相邻, 你再去访问之前的索引为0的地址, 此时这个地址的所有权就不在你的手上了, 所以 rust 不允许你进行操作了.

### 遍历

如果想要依次访问 vector 中的每一个元素, 我们可以对这个 vec 进行遍历

``` rust
let v = vec![100, 32, 57];
for i in &v {
    println!("{}", i);
}
```

也可以遍历时对齐进行修改

``` rust
let mut v = vec![100, 32, 57];
for i in &mut v {
    *i += 50;  // 值增加50
}
```

### 搭配枚举使用

vector 还有一个方便的特点是, 他也可以存储相同枚举的值, 因为他认为枚举也是同一个类型, 如果我们想要在一个 vec 中存储不同类型的值, 可以将这些类型设置为同一个枚举的成员

``` rust
enum SpreadsheetCell {
    Int(i32),
    Float(f64),
    Text(String),
}

let row = vec![
    SpreadsheetCell::Int(3),
    SpreadsheetCell::Text(String::from("blue")),
    SpreadsheetCell::Float(10.12),
];  // 可行, 此时他的类型是枚举 SpreadsheetCell
```

### 其他

vector 还有很多其他的方法, 比如`pop`可以删除最后一位值, 具体的可以查看 api 文档

## 字符串

我们之前使用过字符串, 而本章我们会深入的了解字符串

### 什么是字符串

> 你真的了解字符串吗?

rust 中只有一种字符串类型, 那就是`str`, 对于字符串slice, 他通常是 str 的借用, 也就是`&str`

`string`类型是标准库提供的, 并没有写进核心语言部分, 他是可以增长的, 可以变动的, 有所有权的, 编码是 UTF-8的字符串类型

### 新建

``` rust
let mut s = String::new();
```

上面的代码是新建了一个空的字符串 s, 然后我们可以给 s 填充数据, 但是通常我们会直接初始化失败时指定数据, 例如

``` rust
let data = "initial contents";  // 字符串字面值

let s = data.to_string();  // 使用 to_string 方法

// 该方法也可直接用于字符串字面值：
let s = "initial contents".to_string();  // 更加简单的写法
let s = String::from("initial contents");  // 更加简单的写法2
```

只要某个类型实现了`Display`类型, 他就可以使用 `to_string` 方法来转换成字符串

 对于这两种简单写法, 并没有什么优劣, 所以按需使用

rust 中的字符串编码为`utf-8`, 所以他能放入任何可以正确编码的数据

### 更新

string的大小可以增加, 内容也可以修改

**使用`push_str`和`push`来追加字符串**

使用`push_str`来追加字符串 slice

``` rust
let mut s = String::from("foo");
s.push_str("bar");  // s 为 foobar
```

这里对 s 使用`push_str`, 对 s 进行字符串的追加, 同时, 为了保证所有权不转移, `push_str`使用的是字符串 slice

使用`push`来追加字符(不是字符串)

``` rust
let mut s = String::from("lo");
s.push('l');  // s = lol
```

**使用 + 运算符或者 fromat! 宏拼接字符串**

你还可以使用`+`方便的组合字符串

``` rust
let s1 = String::from("Hello, ");
let s2 = String::from("world!");
let s3 = s1 + &s2; // 注意 s1 被移动了，不能继续使用
```

这里的 s3 会成为 `Hello, world!` , 注意代码 `s1 + &s2`, 这是因为`+`使用的函数定义为

``` rust
fn add(self, s: &str) -> String {
```

其中, self 是 s1, s 为 `&s2`, 这里要求参数是引用, 避免参数 s 的所有权发生转移. 其次, 我们注意这个参数类型是 str 的引用, 而 s2是 String 类型, 为什么能编译运行呢?

这是因为`&String`可以被强转成`&str`, 在调用+时, Rust 使用了强制转换, 将其变成&str

这里说的 s1的所有权被移动了, 是因为参数`self`获取了所有权, 此时所有权到了`add`中, 所以下面使用 s1会造成错误

还可以使用宏`format!`

``` rust
let s1 = String::from("tic");
let s2 = String::from("tac");
let s3 = String::from("toe");

let s = format!("{}-{}-{}", s1, s2, s3);
```

类似于 golang 的 fmt.Printf, 就是格式化字符串

### 索引字符串

很多类型都可以使用索引来访问其中某个元素, 但是对于字符串, 则是不行的, 字符串并不支持使用索引语法

**内部实现**

`String`是一个`Vec<u8>`的封装, 比如字符串`Hola`在Rust 中的长度是四个字节, 这是正确的, 因为每个字母的 utf8 编码都占用1格子姐, 那么字符串`дравствуйте`则不同, 字符串`дравствуйте`的长度为22, 这是因为`дравствуйте`的每一个字符需要两个字节存储, 他是unicode 编码, 但是按照索引来获取, 是按照字节去寻址, 那么问题就出现了, 你获取`дравствуйте`的索引0, 不是`д`, 而是`д`的一部分, 这就不是你想要获取到的结果了

所以 rust 为了避免出现问题, 将这个功能屏蔽了

其实 rust 也可以分辨出哪些存储多少字节, 而在你获取索引时对不同情况做特殊的处理, 但是这样的话势必会造成性能的损耗, rust 还需要多次的判断和遍历才能获取到你想要的结果, 而 Rust 期望获取值的时间为`(O(1))`

**使用字符串 slice**

如果我们就是想要使用索引, 这里有一个危险的方法

``` rust
let hello = "дравствуйте";

let s = &hello[0..4];  // др
```

获取`дравствуйте`的前4个字节, 之前说过俄语是两个字节为一个字符, 所以这里是前两个字符

如果你获取的是 `[0..1]`, 因为顾头不顾尾原则, 实际上获取的是`д`的一部分, 那么此时会导致`Panic`

``` bash
thread 'main' panicked at 'byte index 1 is not a char boundary; it is inside 'З' (bytes 0..2) of `дравствуйте`', src/libcore/str/mod.rs:2188:4
```

所以非常不推荐使用这个方法

**遍历字符串**

Rust 提供了一种方法可以让你遍历字符串, 这是安全的, 而且是按照字符遍历而不是字节

``` rust
fn main() {
    let s = String::from("дравствуйте");
    for c in s.chars(){
        println!("{}", c)
    }
}
```

运行

``` bash
д
р
а
в
с
т
в
у
й
т
е
```

而当你想遍历每一个原始字节, 使用`.bytes()`

``` rust
fn main() {
    let s = String::from("дравствуйте");
    for c in s.bytes(){
        println!("{}", c)
    }
}
```

``` bash
208
180
209
128
208
176
208
178
209
129
209
130
208
178
209
131
208
185
209
130
208
181
```

这里的每个数字都是每个字节的 ascii 对照

## 哈希 map

哈希 map 其他语言也有, 比如 golang 的 map, python 的 dict, 在 Rust 中他是`HashMap<k, v>`, 他的结构是一个键类型`k`对应一个值类型`v`, 他通过哈希函数来实现两者的映射管理, 你可以很方便的通过某个 k 找到对应的 v

### 新建

使用`new`创建一个空的`HashMap`, 使用`insert`来增加元素

``` rust
use std::collections::HashMap;

let mut scores = HashMap::new();  // hashmap

scores.insert(String::from("Blue"), 10);  // Blue: 10
scores.insert(String::from("Yellow"), 50);  // Yellow: 50
```

因为 hashmap 相对于 vector 和 string 来说并不是那么常用, 所以并没有默认就导入, 所以需要通过 `use std::collections::HashMap;` 来导入到当前的代码中

我们之前说过集合都是将数据存放在堆上的 所以可以方便的进行扩容, 而与 vector 相同的是, 哈希 map 是同质的, 所有的键都必须是相同的类型, 值也是

另一种构建哈希 map 的方式调用一个 vector 的`collect`方法, 这个 vector 必须是元组类型, 例如

``` rust
use std::collections::HashMap;

let teams  = vec![String::from("Blue"), String::from("Yellow")];
let initial_scores = vec![10, 50];

let scores: HashMap<_, _> = teams.iter().zip(initial_scores.iter()).collect();
```

这里是使用 `zip` 将两个 vector 组合, 再使用`collect`将其转换成一个 hashmap

`HashMap<_, _>` 是必须要标记的, 他代表 `collect` 输出的结构. 必须要显式的指定才可以, 其中的`_`代表占位

### 所有权

hashmap 也有所有权, 对于像`i32`这种实现了`Copy`的 trait 的类型, 其值可以拷贝进哈希 map. 对于像`string`的拥有所有权的值, 其值将被移动到哈希 map 中, 成为这个值的所有者

``` rust
use std::collections::HashMap;

let field_name = String::from("Favorite color");
let field_value = String::from("Blue");

let mut map = HashMap::new();
map.insert(field_name, field_value);  // 插入
// 这里 field_name 和 field_value 不再有效，
// 尝试使用它们看看会出现什么编译错误！
```

而将值的引用插入到哈希 map 中时, 这些值本身不会被移动到 map 中

### 访问哈希 map 值

**get**

使用 `get`

``` rust
use std::collections::HashMap;

let mut scores = HashMap::new();

scores.insert(String::from("Blue"), 10);  // 插入
scores.insert(String::from("Yellow"), 50);

let team_name = String::from("Blue");
let score = scores.get(&team_name);  // 获取key Blue 的值
```

如果 key blue 不存在, 则会返回`None`

**循环**

使用 for 循环来遍历键值对

``` rust
use std::collections::HashMap;

let mut scores = HashMap::new();

scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Yellow"), 50);

for (key, value) in &scores {
    println!("{}: {}", key, value);
}
```

特别注意, 因为是 hash 的方式, 所以 hashmap key是无序的

### 更新哈希 map

**覆盖**

对于已经存在的 key, 我们可以直接覆盖这个 key 下的值, 直接使用`insert`即可

``` rust
use std::collections::HashMap;

let mut scores = HashMap::new();

scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Blue"), 25);

println!("{:?}", scores);  // 25
```

**只新建不覆盖**

你可以能注意, 使用`insert`会直接覆盖值, 那么如果我们想只在这个 key 不存在时才插入的话, 配合使用`entry`即可

``` rust
use std::collections::HashMap;

let mut scores = HashMap::new();
scores.insert(String::from("Blue"), 10);

scores.entry(String::from("Yellow")).or_insert(50);  // 不存在再插入
scores.entry(String::from("Blue")).or_insert(50);

println!("{:?}", scores);
```

entry 返回了一个枚举`Entry`, 其有一个方法`or_insert`在建对应的值存在时就返回这个值的可变引用, 如果不存在就将参数作为新值插入并返回可变引用

**根据旧值更新**

比如对值进行+1而不关注这个值本来的值

``` rust
use std::collections::HashMap;

let text = "hello world wonderful world";

let mut map = HashMap::new();

for word in text.split_whitespace() {  // 遍历每个字符
    let count = map.entry(word).or_insert(0);  // 这个字符作为 key 不存在就 set 成0
    *count += 1;  // +1
}

println!("{:?}", map);
```

之前说过, `entry`不管怎样都会返回值的可变引用, 所以我们直接修改这个引用的值即可

**获取可被修改的值**

有时候hashmap 重点值存储的可能是 vector 这种集合, 而我们想要获取值并进行 push 或者其他的追加操作, 可以使用`get_mut`

``` rust
    let mut company = HashMap::new();
    company.insert("c1", vec![1, 2]);
    let c1 = company.get_mut("c1");  // 获取值的可变引用
    c1.unwrap().push(3)  // unwrap 是将类型剥离出来, 
```

使用`get_mut`可以获得值的可变引用, 以便我们直接对其进行修改

同时, `unwrap`也必不可少, 不使用`unwrap`时, 运行报错 

``` bash
no method named `push` found for enum `std::option::Option<&std::vec::Vec<{integer}>>` in the current scope
```

此时可以看出来, c1的类型变成了 `std::option::Option<&std::vec::Vec<{integer}>>`, 被包裹在了Option 中, 我们必须要调用`unwrap`将其剥离出来, 类型变回`&std::vec::Vec<{integer}>` 即可

## 练习题

### 求平均数

给定一系列数字，使用 vector 并返回这个列表的平均数（mean, average）、中位数（排列数组后位于中间的值）和众数（mode，出现次数最多的值；这里哈希 map 会很有帮助）

``` rust
fn average(v: &Vec<f64>) -> f64 {
    let mut sum = 0.0;
    for i in v{
        sum += i
    }
    sum / v.len() as f64  // len 返回长度, 类型是 usize, 通过 as 转换成 f64
    // / 是除
}

fn main() {
    let v0 = vec![1.0, 2.0, 3.0, 5.0];
    let v1 = vec![-1.0, -2.0, -3.0];
    let v0average = average(&v0);
    let v1average = average(&v1);
    println!("v0 res = {}", v0average);
    println!("v1 res = {}", v1average)
}
```

这里有之前没有写到博客里的 vector 的 len 方法, 返回长度

### 字符串转换

将字符串转换为 Pig Latin，也就是每一个单词的第一个辅音字母被移动到单词的结尾并增加 “ay”，所以 “first” 会变成 “irst-fay”。元音字母开头的单词则在结尾增加 “hay”（“apple” 会变成 “apple-hay”）。牢记 UTF-8 编码

``` rust
fn pig_lation(g: &str) -> String {  // 因为 str 必须要在初始化时就要知道其大小, 所以返回 string
    // 转换成 string
    let general = g.to_string();
    let mut is_vowel = false;
    let vowel = vec!['a', 'i', 'y', 'o', 'u'];
    // 获取首字母, 查看是元音还是辅音
    // 不能粗暴的直接获取索引0, 需兼容其他语言
    for i in general.chars(){
        for k in &vowel{
            if i.to_string() == k.to_string() {
                is_vowel = true
            }
        }
        break        
    }
    if is_vowel{
        // 首字母是元音
        return format!("{}-hey", general) 
    }else{
        let mut p = String::new();
        let mut is_first = true;
        let mut first_word = String::new();
        for i in general.chars(){
            if is_first{
                // 第一次
                first_word = i.to_string();
                is_first = false;
                continue
            }else{
                p = p+&i.to_string()
            }
        }
        return format!("{}-{}ay", p, first_word)
    }
}

fn main() {
    let t0 = "apple";
    let t1 = "first";
    let t2 = "苹果";
    let r0 = pig_lation(t0);
    let r1 = pig_lation(t1);
    let r2 = pig_lation(t2);
    println!("r0 = {}", r0);
    println!("r1 = {}", r1);
    println!("r2 = {}", r2)
}
```

### 部门控制

使用哈希 map 和 vector，创建一个文本接口来允许用户向公司的部门中增加员工的名字。例如，“Add Sally to Engineering” 或 “Add Amir to Sales”。接着让用户获取一个部门的所有员工的列表，或者公司每个部门的所有员工按照字典序排列的列表。

``` rust
use std::{io, collections::HashMap}; // 引入标准库

fn main(){
    println!("CRM");
    let mut company = HashMap::new();
    loop{
        println!("输入所在部门->");
        let mut class = String::new(); // 创建一个字符串变量 class
        io::stdin() // 调用函数stdin
            .read_line(&mut class) // 调用stdin的方法read_line获取输入值
            .expect("读取失败"); // 如果获取错误打印警告
        println!("输入用户名->");
        let mut name = String::new(); // 创建一个字符串变量 name
        io::stdin() // 调用函数stdin
            .read_line(&mut name) // 调用stdin的方法read_line获取输入值
            .expect("读取失败"); // 如果获取错误打印警告
        let ns = company.get_mut(&class);  // 获取可变引用
        if ns == None{
            company.insert(format!("{}", class), vec![format!("{}", name)]);  // 防止所有权转移, 使用 format 重新制造一个 str
        }else{
            ns.unwrap().push(name)  // 直接 push
        }
        for i in company.get_mut(&class).unwrap(){
            println!("{}", i)
        }
    }
}
```

