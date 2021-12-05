---
title: Rust程序设计语言(2)              
date: 2021-09-04            
updated: 2021-09-04         
comments: true              
toc: true                   
excerpt: Rust的变量与基础数据类型
tags:                       
- Rust
categories:                 
- 编程
---

## 变量与可变性

rust默认你创建的变量是**不可变变量**, 这是为了提高代码的安全性, rust鼓励你多使用**不可变变量**, 当然当你有需要的时候, 你可以将其变成可变变量

我们来创建一个新的项目来开始本章 `cargo new variables`

修改`main.rs`为

``` rust
fn main() {
    let x = 5;
    println!("{}", x);
    x = 6;
    println!("{}", x);
}
```

运行他, 会报错

``` bash
➜  variables git:(master) ✗ cargo run
   Compiling variables v0.1.0 (/Users/Work/Code/Rust/student/variables)
error[E0384]: cannot assign twice to immutable variable `x`
 --> src/main.rs:4:5
  |
2 |     let x = 5;
  |         -
  |         |
  |         first assignment to `x`
  |         help: make this binding mutable: `mut x`
3 |     println!("{}", x);
4 |     x = 6;
  |     ^^^^^ cannot assign twice to immutable variable

error: aborting due to previous error

For more information about this error, try `rustc --explain E0384`.
error: could not compile `variables`.

To learn more, run the command again with --verbose.
```

这里的错误是 `cannot assign twice to immutable variable`, 告诉你不能对不可变变量二次赋值

rust加入这个限制是为了代码的安全性, 因为对于开发者来说, 建立**不可变变量**的目的是不希望他能够修改, 如果你可以修改, 就可能会导致代码朝着无法预料的方向发展

在rust中, 编译器会确保你创建的**不可变变量**永远不被修改, 这能让你更加专注的考虑正常的逻辑

同时我们可以设置**可变变量**来解决问题, 使用 `mut` 来标识这个变量是可变的, 比如

``` rust
fn main() {
    let mut x = 5;
    println!("{}", x);
    x = 6;
    println!("{}", x);
}
```

此时就可以正常的运行

``` bash
➜  variables git:(master) ✗ cargo run
   Compiling variables v0.1.0 (/Users/Work/Code/Rust/student/variables)
    Finished dev [unoptimized + debuginfo] target(s) in 0.60s
     Running `target/debug/variables`
5
6
```

对于大型的项目来说, 将变量设置成可变然后更改其值要比将变量设置为不可变然后读取其值复制给新的变量效率更高

### 变量与常量的区别

当你创建一个`不可变变量` 时, 你仍然可以在后续中修改他为`可变变量`, 但是对于常量来讲, 创建过后及 无法通过任何方式修改, 他不是预设无法修改, 而是`永远无法修改`

当你使用 `const` 关键字来创建常量时, 必须要指定他的类型

常量只能被常量表达式来设置, 不能通过某个函数的返回值或者运行时产生的数值来设置

rust的常量通常使用**全大写的字母, 多个单词间使用_连接**的方式来命名, 例如

``` rust
const MAX_POINTS: u32 = 100_000;  // 创建常量 MAX_POINTS , 类型是u32, 值是100000
```

其中, `100000`与`100_000`是一样的数值, 加`_`可以提升可读性

### 遮蔽(shadowing)

对于变量来讲, 我们可以在给某个变量赋值后, 通过`遮蔽`的方式来重新赋值, 或者说是覆盖

使用 `let` 来对一个已经存在的变量重新声明, 这样新的变量就会遮蔽原来的变量

``` rust
fn main() {
    let a = 1;
    println!("{}", a);
    let a = 5;
    println!("{}", a);
    let a = a+1;
    println!("{}", a);
}
```

输出

``` bash
1
5
6
```

需要注意的是, 我们在遮蔽时, 必须要带上`let`关键字, 否则会出现编译错误

我们知道, 使用 `mut` 可以设置可变变量, 他与遮蔽的不同是遮蔽对某个变量操作时可以设置不同的类型, 而mut不可以, 比如

``` rust
    let spaces = "   ";
    let spaces = spaces.len();
```

这里 `spaces` 从字符串类型遮蔽成了数字类型

``` rust
    let mut spaces = "   ";
    spaces = spaces.len();
```

这段代码是无法编译的, 因为mut无法改变值的类型

``` rust
fn main() {
    let mut a = 1;
    println!("{}", a);
    a = "dadad"
}
```

``` bash
➜  variables git:(master) ✗ cargo run
   Compiling variables v0.1.0 (/Users/Work/Code/Rust/student/variables)
error[E0308]: mismatched types
 --> src/main.rs:4:9
  |
4 |     a = "dadad"
  |         ^^^^^^^ expected integer, found `&str`

error: aborting due to previous error

For more information about this error, try `rustc --explain E0308`.
error: could not compile `variables`.
```

## 数据类型

数据类型分为两种: **纯量(scalar)**和**复合(compound)**

Rust是一个静态类型语言, 因此, 所有变量在编译时编译器就必须知道他的类型, 如果无法得知就会导致编译错误

当然, 一般情况下, 编译器会自动识别出我们想要设置的类型, 比如

``` rust
let a = 1;
```

但是对于函数来讲, 有时候可能有多个可能的结果返回, 比如

``` rust
let guess: u32 = "42".parse().expect("error！");
```

在编译时就会出现错误

``` rust
   Compiling variables v0.1.0 (/Users/Work/Code/Rust/student/variables)
warning: unused variable: `guess`
 --> src/main.rs:2:9
  |
2 |     let guess: u32 = "42".parse().expect("這不是數字！");
  |         ^^^^^ help: consider prefixing with an underscore: `_guess`
  |
  = note: `#[warn(unused_variables)]` on by default

    Finished dev [unoptimized + debuginfo] target(s) in 0.40s
     Running `target/debug/variables`
```

### 纯量

纯量的类型代表单一的值, rust有四种纯量, 分别为 **整数/浮点数/字符/布尔**

**整数**

整数指的是没有小数点的数字, 之前我们使用过 `u32`, 还有其他的几种

|   长度   | 带正负号 | 不带正负号(正整数) |
| :------: | :------: | :----------------: |
|   8位    |    i8    |         u8         |
|   16位   |   i16    |        u16         |
|   32位   |   i32    |        u32         |
|   64位   |   i64    |        u64         |
|  128位   |   i128   |        u128        |
| 系统架构  |  isize   |       usize        |

首先, 带正负号与不带正负号的区别就是字面意思, 带正负号可以表示负数, 不带则只能表示正整数

然后, 长度代表了这个变量在记忆体内存储的大小, 也影响了数字的范围, 而`isize`和`usize`则与系统有关, 如果你的系统是32位, 则是32位的长度, 64就是64

对于某个数字, 你可以将类型拼在值后面来标识这个值是什么类型, 比如`54u16`代表是`u16`位的值是54

默认的整数是`i32`, 这在rust中是运行速度最快的类型

**整数溢出**

举个例子, 如果你创建了一个`u8`的变量, 那么他的长度只有8位, 只能容纳 1-255 之间的数值, 如果你给他赋值成 256, 或者大于255的数字, 就会发生**整数溢出**, 如果你是在默认情况下编译的话, 则会在运行时造成**panic**错误, 如果你是编译成稳定版(release), 程序在检测到溢出时会处理这个错误, 并不会让他直接panic但是会使原有的值发生变化, 造成逻辑错误.

**浮点数**

浮点数有 `f32(单精度)` 和 `f64(双精度)`, 默认是`f64`

``` rust
fn main() {
    let x = 2.0; // f64

    let y: f32 = 3.0; // f32
}
```

**数值运算**

数值之间当然可以进行运算

``` rust
fn main() {
    // 加
    let sum = 5 + 10;

    // 減
    let difference = 95.5 - 4.3;

    // 乘
    let product = 4 * 30;

    // 除
    let quotient = 56.7 / 32.2;

    // 求余
    let remainder = 43 % 5;
}
```

**布尔值**

`true(真)`和`false(假)`

``` rust
fn main() {
    let t = true;

    let f: bool = false; 
}
```

**字符**

单个字符使用单引号来表示, 例如一个字母/中文/表情, 当我们需要表达不止一个字符时, 就需要使用双引号

``` rust
fn main() {
    let c = 'z';
    let z = 'ℤ';
    let heart_eyed_cat = '😻';
    let a = "1111111";
    let b = '我';
    let d: char = '他';
}
```

rust的`char`与`unicode`类似, 确又不是完全一样, 我们之后会详细解释

### 复合类型

复合类型有两个最基本的, **元组(tuples)**和**阵列(arrays)**

**元组**

元组是将不同或相同的数据类型放置到一起的常见用法, 需要注意的是元组的长度在确定后**无法更改**

元组的设立是用括号括起来, 因为一个元组内的每个数据都有可能有独立的数据类型, 所以在必要时也可以指定每个的类型, 如果不指定rust会自己判断

``` rust
fn main() {
    let tup: (i32, f64, u8) = (500, 6.4, 1);
}
```

这里的变量tup就是元组, 元组内有多个元素, 我们可以使用**模式配对(pattern matching)**, 来获取每一个元素的值

``` rust
fn main() {
    let tup = (500, 6.4, 1);

    let (x, y, z) = tup;

    println!("y 的數值為：{}", y);
}
```

这种将元组打散然后分别赋值给 x/y/z, 需要保证接受者和元组的长度是一致的, 这种也被成为**解构(destructuring)**

还有一种通过索引来取其中某个值的方法, 在rust中通过`.`来获取, 比如

``` rust
fn main() {
    let x: (i32, f64, u8) = (500, 6.4, 1);

    let five_hundred = x.0;

    let six_point_four = x.1;

    let one = x.2;
}
```

索引和其他语言一样, 都是从0开始的, 并且不能超出索引大小

**阵列**

与元组不同的是, 一个阵列的元素必须是同一个数据类型, 而且和元组一样, 阵列长度在确定后**无法更改**

阵列的设立是使用中括号, 例如

``` rust
fn main() {
    let a = [1, 2, 3, 4, 5];
}
```

当你希望将数据放置在堆栈上而不是堆上时(我们之后会详细解读), 或者当你想要确保始终拥有固定数量的元素时, 你可以使用阵列来做

当你不知道有多少个数据时(很多时候是这样), 阵列和元组都将不适合使用, 此时, rust标准库提供了**矢量(vector)**类型, 他是可以改变长度的, 如果你不确定应该使用矢量还是阵列时, 你应该使用矢量来创建, 矢量的具体细节之后再讲述

当你明确的知道数据的数量时, 你就可以放心的使用阵列, 例如, 每年有12个月

``` rust
let months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月",
              "八月", "九月", "十月", "十一月", "十二月"];
```

这里rust会自己判别阵列的类型和长度, 当然你也可以指定

``` rust
let a: [i32; 5] = [1, 2, 3, 4, 5];
```

这里, i32 是每个元素的类型, 5是这个阵列的长度

如果你想给每个元素都设置一个默认值, 可以这样写

``` rust
let a = [3; 5];
```

会生成阵列`[3, 3, 3, 3, 3]`, 即a的长度为5, 每个默认值都是3

**获取阵列元素**

我们可以使用索引来获取对应的值

``` rust
fn main() {
    let a = [1, 2, 3, 4, 5];

    let first = a[0];
    let second = a[1];
}
```

**无效的阵列元素获取**

对于/阵列来讲, 当你获取不存在的索引是, 有可能会出现编译通过而运行时出现错误的情况, 比如

``` rust
fn main() {
    let a = [1, 2, 3, 4, 5];

    let element = a[10];

    println!("元素的數值為：{}", element);
}
```

我们使用check功能发现并没有检查出错误

``` bash
➜  variables git:(master) ✗ cargo check
    Checking variables v0.1.0 (/Users/Work/Code/Rust/student/variables)
    Finished dev [unoptimized + debuginfo] target(s) in 0.12s
```

但是当我们运行时, 当执行到这里时, rust会抛出错误, 而对于其他的底层语言(例如C), 则不会报错但是会得到不可预料的值, rust这样做减少了不可预料的BUG的产生, 这是Rust的安全原则之一

``` bash
➜  variables git:(master) ✗ cargo run
   Compiling variables v0.1.0 (/Users/Work/Code/Rust/student/variables)
error: index out of bounds: the len is 5 but the index is 10
 --> src/main.rs:4:19
  |
4 |     let element = a[10];
  |                   ^^^^^
  |
  = note: `#[deny(const_err)]` on by default

error: aborting due to previous error

error: could not compile `variables`.

To learn more, run the command again with --verbose.
```