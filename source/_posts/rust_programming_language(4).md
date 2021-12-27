---
title: Rust程序设计语言(4)              
date: 2021-09-04            
updated: 2021-09-04         
comments: true              
toc: true                   
excerpt: Rust的所有权与作用域
tags:                       
- Rust
categories:                 
- 编程
---
## 前言

所有权系统是Rust最为独特的性质, 他让Rust无需垃圾回收即可保障内存的安全. 所以, 理解所有权怎么工作是非常重要的, 本章, 我们将讲到所有权和相关的功能, 借用, slice以及Rust如何在内存中放置数据

## 什么是所有权

rust的核心之一就是所有权

对于运行中的程序来说, 他必须对使用的内存进行管理, 同时对于运行中产生的垃圾, 程序也需要进行销毁, 以免出现内存泄露等问题

某些语言自带了垃圾回收机制, 在程序运行时不断的扫描寻找不再使用的内存将其释放

另一些语言要求程序员通过代码来自己分配和释放内存

而rust使用的是第三种, 通过所有权系统来管理内存, 编译器在编译时会根据规则来进行检查. 在运行时可以保证不会减慢程序的运行速度

## 栈(stack)与堆(heap)

栈和堆都是在程序运行中可供使用的内存, 他们的结构并不相同, 栈是有序的, 他就像一个水桶, 最上面的是栈顶, 向这个栈里存放数据叫做**进栈**, 他像一个水桶, 所以存储数据只能存放在水桶的最上面, 当移除数据**出栈**的时候, 也只能从栈顶移除, 所以, 栈遵循**先进后出**的逻辑.

栈中的所有数据都必须占用已知且固定的大小, 而且栈中的数据是有大小限制的, 所以在程序运行中出现的大小未知或者可能变化的数据, 必须存储在堆上, 堆不是有序的, 当你向堆中存储一个数据, 操作系统首先在堆的某处找到一块足够大的空间, 把它标记为已使用, 然后回传该空间的**指针**, 这个过程叫做**在堆上分配内存**, 指针的大小是已知且固定的

所以可以把真正的数据存储在堆中, 将指针存放在栈中, 当需要访问真实数据时, 先获取指针, 再访问指针

入栈比在堆上分配内存快, 这是因为栈在建立时每一块数据的大小是固定的, 而且是有序的, 操作系统无需为新数据去搜索合适的内存空间. 当在堆上分配内存时, 系统需要先找到一块足够大的内存, 然后做记录

访问堆上的数据也比访问栈的数据慢, 堆上面的数据通过指针访问, 现代处理器在内存中跳转越少速度就越快(缓存), 而堆是无序的, 意味着指针指向的地方可能需要很多次内存跳转

同样的, 因为这个原因, 处理器在处理数据彼此相近的时候(比如栈)比远的时候(堆)效率更高. 在堆上分配大量空间也会消耗时间.

当代码调用一个函数时, 会将函数的值和函数内部的局部变量压入栈中, 当这个函数结束时, 这些数据就属于垃圾, 理应被回收, 此时则出栈, 因为栈是后进先出, 导致这种回收是快速的, 符合逻辑的, rust的所有权就是这样做的

跟踪哪部分代码正在使用哪些数据, 最大限度的减少堆上重复数据的数量, 同时清理堆上不再使用的数据, 这些就是所有权系统需要去关心的

```rust
// 假设一个抽象的栈 []

{
  A;  // A入栈, [A]
  B;  // B入栈, [B, A]
  {
    a;  // a入栈, [a, B, A]
    b;  // b入栈, [b, a, B, A]
  };
  // 函数结束了, a和b是垃圾了, 将a和b出栈, 直接取栈顶的的一段即可,保证效率的同时也符合逻辑(代码从上往下执行的顺序), [b, a, B, A] -> [B, A]
  C;  // C入栈, [C, B, A]
  D;  // D入栈, [D, C, B, A]
}
```

## 所有权的基本规则

> Rust中的每一个值都有且只有一个被称为其 所有者 的变量
>
> 值在任一时刻有且只有一个所有者
>
> 所有者离开作用域时, 这个值将会被丢弃

### 变量作用域

每个变量都有其 **作用域(scope)**, 作用域是一个 **项(item)** 在程序中有效的范围

```rust
let s="hello";
```

这里的变量`s`绑定到了字符串`hello`中, 这个字符串编码进了程序代码中, 那么s从声明开始到当前作用域结束时都是有效的

``` rust
fn main() {
    // s未声明
    let s = "hello";  // s在这里生效
    // 可以使用s
}// 函数结束, 作用域也结束, s无法使用了
```

这里有两个关键点

> s进入作用域时, s是有效的
>
> s离开作用域, s无效

## String类型

上面的例子来说, s因为是不可变的, 加上其数据很小, 所以本体存储在栈中

本次测试将把数据的本体放置在堆中, 而将指针放置在栈中

我们这里使用`String`作为例子, 专注于`String`与所有权相关部分. 

对于在编译时无法知道具体的值的变量, 也就是说并不知道大小, 他就会被分配到堆上, 比如`String`

``` rust
let s = String::from("hello");
```

这里的`::`是运算符, 具体的详情我们在之后的章节说明. 

``` rust
fn main() {
    let mut s = String::from("hello");
    s.push_str(", world");  // 在s后拼接字符串
    println!("{}", s);  // hello, world
}
```

这里得到的s是可变的, 他可以通过调用 `push_str` 函数来修改自己

### 内存与分配

对于字符串字面值来说, 我们在编译时就能准确的知道其内容, 所以直接硬编码进最终的可执行文件中, 这使得字符串字面值快速且高效. 这里的前提是字符串字面值的不可变性, 但是, 对于未知的文本, 我们无法在开始时确定大小, 因为他是可以改变的.

对于`string`类型, 为了让他可以支持一个可变的, 可增长的文本片段, 需要在堆上分配一块在编译时未知大小的内存存放数据, 这就有两个问题

- 必须在运行时向操作系统请求内存
- 当`string`处理完成后将内存返回给操作系统

如何在运行时请求内存呢? 当我们调用`String::from` 时, 他会请求所需要的内存

如何在处理完成后将内存返给操作系统呢? 在有垃圾回收 **GC** 的语言中, GC会记录和清理不再使用的内存, 作为开发者我们不需要关心他, 没有GC则需要开发者手动的释放, 就跟请求一样需要我们写在代码中, 正确的处理内存回收通常比较困难, 如果忘记回收会浪费内存, 导致内存泄露等. 如果回收过早, 可能会在后续的使用中出现无效变量, 如果重复回收也可能会导致问题, 所以要准确的在合适的地方对一个 **分配(allocate)** 配对一个 **释放(free)** 

在Rust中, 内存在拥有他的变量离开作用域时就被自动释放, 例如下面的例子

```rust
{
    let mut s = String::from("hello");  // 创建s, s此时是有效的, 在此作用域中
    s.push_str(", world");  // 使用修改s, 在s后拼接字符串
    println!("{}", s);  // hello, world
}  // 该作用域已结束, 作用域内的使用的内存需要释放
// s失效了
```

这里, 当s离开当前有效的作用域时, Rust为我们自动调用函数`drop`  (前提是该数据类型有drop), 该函数可以将变量释放, Rust会在结尾`}`自动调用 需要释放的变量的`drop`

**变量与数据交互: 移动**

如果我们将一个变量赋值给另一个变量, 其数据会怎么处理呢? 

``` rust
    let x = 5;  // x为5
    let y = x;  // copy x的值5, 赋值给y
    // x和y都等于5
```

因为5是在编译时就可以确定的, 所以这两个5被放入了栈中

那么对于无法确定大小的变量来说, 例如

``` rust
    let s1 = String::from("s1");
    let s2 = s1;
```

之前说过, 对于不可预测的变量, 我们会在栈上存储指针而在堆上存储真正的数据, 那么对于s1来说, 在栈上的数据为

|      name      |   value    |
| :------------: | :--------: |
|   ptr(指针)    | 堆上的地址 |
|   len(长度)    |     2      |
| capacity(容量) |     2      |

指针指向的堆的数据为

| index | value |
| :---: | :---: |
|   0   |   s   |
|   1   |   1   |

这就是将`s1`绑定给变量`s1`在内存中的表现形式

我们注意到, 栈上的数据有 长度 和 容量, 长度指的是当前使用了多少字节的内存, 容量指的是从操作系统申请了多少字节的内存, 这两个是不一样的, 不要混淆



而我们将s1赋值给s2时,  实际上只是从拷贝了s1在栈上的数据, 也就是说此时 s1与s2共同指向了一个堆地址, 这跟其他语言的 **浅COPY(shallow copy)** 非常像, 这样做的好处是使操作变得快速, 如果是 **深COPY(deep copy)** , 意味着需要将堆上的数据找到,再插入到堆的另一个地方, 如果堆上的值很大, 则会造成效率的低下



但是这样会导致问题出现, 例如当s1与s2离开了作用域时, Rust 会对s1和s2进行清理, 但是他们实际上指向了同一个地址, 两次清理一个内存, 这就会出现前文提到的 **二次释放(double free)** 问题, 因此, Rust使用了不同的方法, 即 **移动(move)** , 就是在运行 `s2=s1` 时, 将s1无效化

``` rust
fn main() {
    let s1 = String::from("s1");  // 创建s1
    let s2 = s1;  // 将s1栈上的数据转移到s2上, s1失效了
    println!("{}", s1);  // s1不可用, 所以会出错
    println!("{}", s2);  // s2可用
}  // drop时, 先处理s2的Drop再s2的栈, s1无了, 只清理s1的栈
```

运行该代码时, 会出错

``` bash
error[E0382]: borrow of moved value: `s1`
 --> src/main.rs:4:20
  |
2 |     let s1 = String::from("s1");
  |         -- move occurs because `s1` has type `std::string::String`, which does not implement the `Copy` trait
3 |     let s2 = s1;
  |              -- value moved here
4 |     println!("{}", s1);
  |                    ^^ value borrowed here after move

error: aborting due to previous error

For more information about this error, try `rustc --explain E0382`.
error: could not compile `ownership`.
```

Rust禁止你使用无效的引用

所以, Rust在处理这个`s2 = s1`时, 先将s1的栈数据复制一份给s2, 然后将s1置空, 这样就解决了二次释放的问题

需要知道的是, Rust的设计原则是: **永远不会自动创建数据的深拷贝**, 这是出于对性能影响的考虑

**变量与数据交互: 克隆**

如果你确实需要进行**深copy**, 你可以使用内置函数`clone`

``` rust
fn main() {
    let s1 = String::from("s1");  // 创建s1, s1进入作用域
    let s2 = s1.clone();  // s1的堆数据复制为另一份, 然后重新生成栈数据, 指向新的堆数据, s2进入作用域
    println!("{}", s1);  // 未发生转移, s1还是可用的
    println!("{}", s2);  // s2可用
}  // drop时, s1和s2的堆数据并不是一个, 所以没有二次释放的问题, 先进后出所以先清理s2
```

必须要注意的是, 这样会对资源和性能造成一定的损耗, 在确保你必须这样做时才需要进行克隆操作

**只在栈上的数据: 拷贝**

而对于只在栈上保存的数据, 也就是在编译时就知道值的数据来说, 不存在转移和克隆, 因为他是只保存在栈上, 所以进行拷贝速度很快,Rust在处理这种数据的赋值时直接copy栈的数据到另一个变量, 所以两个变量都可用

``` rust
fn main() {
    let s1 = 1;  // 创建s1, 进入作用域
    let s2 = s1;  // 拷贝s1的栈数据生成s2, s2进入作用域
    println!("{},{}", s1, s2)  // s1与s2都可以使用
}  // i32没有drop, 根据先进先出, 清理s2再s1
```

怎么分辨什么是会出现移动的呢, Rust有一个叫做`Copy`的trait的特殊注解, 如果某个类型拥有这个注解, 那么旧的变量在赋值给新的变量后依旧可用. 如果一个类型有`Drop`注解, 那么他就无法使用`Copy`注解. 他们是无法共存的. 

什么类型是`Copy`的呢? 可以查看对应的文档. 一般的, 任何简单标量值的组合可以是`Copy`的, 不需要分配内存或者某种形式的资源类型是`Copy`的, 比如

- 所有整数类型
- 布尔类型
- 所有浮点类型
- 字符类型, `char`
- 元组, 当其包含的类型都是`Copy`时

**drop与内存释放的关系**

> 这里是本人记录的

需要注意的是, Rust释放内存有两种

如果是有`drop`注解的数据类型(例如String), 先执行`drop`方法,再将栈数据删除

而没有`drop`注解的数据类型(例如i32), 直接将栈数据删除

**为什么drop与copy注解不能兼容**

> 这里是本人记录的

我们知道, `copy`注解代表着该数据类型并不会发生转移, 也就是说发生 `s1 = s2` 时,`s2` 依旧存在, 在内部逻辑中是Copy一份栈数据, 有`copy` 的数据类型一般只将数据放置在栈上, 在退出作用域时, 只需要清理栈数据即可, 而拥有`drop`的数据类型, rust会优先调用`drop`方法, 一般来讲, `drop` 一般是清理堆的有关数据, `copy`的不需要清理, 所以为了保持统一, 就规定了两者不兼容

如果某个类型同时拥有`Copy`和`Drop`注解的话, 首先拥有`Drop`一般都需要将数据本体放置进堆, 那样在重复赋值时又有`Copy`会Copy一份栈数据, 就造成了两个变量实际上指向了同一个资源, 在清理时就会发生**二次释放**的问题

## 所有权与函数

``` rust
fn main() {
    let s = String::from("s");  // 创建s, 进入作用域
    takes_ownership(s);  // s转移进了函数takes_ownership的some_string中
    println!("{}", s);  // 这里会报错, 因为s已经转移, s不可用了

    let i = 5;  // i进入作用域
    makes_copy(i);
    println!("{}", i);  // i可用, 因为i是存储在栈上, 有`Copy`直接复制一份进makes_copy的some_integer
}  // s和i退出作用域, 栈是先进后出, 所以先清理i, i没有`Drop`所以直接删除栈, s已经被转移所以不做特殊操作

fn takes_ownership(some_string: String) { // some_string 进入作用域
    println!("{}", some_string);
}  // some_string 移出作用域并调用`drop`方法。占用的内存被释放

fn makes_copy(some_integer: i32) { // some_integer 进入作用域
    println!("{}", some_integer);
} // 将 some_integer 释放, 因为i32没有`drop`注解所以只清理栈数据

```

### 返回值与作用域

如果函数是拥有返回值, 如果返回值是`drop`, 则会将返回值移动给返回值的接收者, 如果是`copy`, 则是copy给返回值

变量的所有权总是遵循相同的模式: 将值付给另一个变量时移动他. 当持有堆中数据值的变量离开作用域时, 堆中值会通过`drop`被清理, 除非数据被移动到另一个变量

看下面代码

``` rust
fn main() {
    let s1 = gives_ownership();  // s1接受返回值, 进入作用域

    let s2 = String::from("s2");  // 创建s2, 进入作用域

    let s3 = takes_and_gives_back(s2);  // s2传入takes_and_gives_back函数, s2转移给该函数的a_string, 随后s3接受返回值, 进入作用域

    println!("{}", s2);  // 这里s2已经发生转移, 指针为空, 所以使用会报错
    println!("{}, {}", s1, s3);  // s1和s3可用
} // 退出作用域, 清理s3>s2>s1
// s2为空


fn gives_ownership() -> String { 
    let some_string = String::from("gives_ownership");

    some_string  // 如果这里返回了, 而返回值是String类型, 有Drop注解, 会发生所有权的移动, 移动给接受者, some_string失效了
}  // some_string 移除作用域, 因为 some_string 已经转移所以只删除栈

fn takes_and_gives_back(a_string: String) -> String {

    a_string  // 如果这里返回了, 而返回值是String类型, 有Drop注解, 会发生移动, 移动给接受者, a_string失效了
}  // a_string 移除作用域, 因为 a_string 已经转移所以只删除栈
```

这样就会出现一个问题, 如果某个变量是拥有`Drop`的, 那么这个变量需要作为某个函数的参数使用, 我们传入到这个函数中总会使原有的变量失效, 那么如果我还需要再使用这个变量呢? 

有一个折中的办法, 在函数中再将参数值传出, 例如

``` rust
fn main() {
    let s1 = String::from("s1"); 
    let (s2, len) = calculate_length(s1);  // s1转移了, 用s2接受原来的s1

    println!("The length of '{}' is {}.", s2, len);
}

fn calculate_length(s: String) -> (String, usize) {
    let length = s.len(); // len() 返回字符串的长度

    (s, length)  // 将s也返回
}
```

但是这样太LOW了, 为了解决这样的问题, Rust提供了**引用(references)**

## 引用和借用

引用可以在不转移所有权的情况下使用变量

``` rust
fn main() {
    let s1 = String::from("hello");  // s1进入作用域
    let len = calculate_length(&s1);  // 将 &s1 传入, &意思是引用, 即将s1的引用传入函数calculate_length

    println!("The length of '{}' is {}.", s1, len);  // 仍可以使用s1, 因为未发生所有权转移
}

fn calculate_length(s: &String) -> usize {  // 因为类型变成了String的引用, 所以接收参数类型发生变化
    s.len()
}
```

&代表对某个引用, 引用允许你使用值但不获取其所有权, 比如上面的 s1, 当 s1传入到 calculate_length 的参数 s 时, 实际上s是 s1 的引用, 类似于指针, 指向了s1

> 与&(引用)相反的操作是**解引用(dereferences)**, 他的运算符是 *, 之后会讲到

`&s1` 让我们创建一个指向`s1`的引用, 但是并不拥有他, 因为不拥有他, 所以当引用离开作用域时其指向的值也不会被清理

在 calculate_length 结束时, s离开作用域, 理应清理, 但是因为s只是个引用类型, 所以只把s清理并不会清理s对应的真正的变量

对于函数 calculate_length 来说, 其接受了String的引用, 这种行为被称为 **借用**

需要注意的是, 如果你借用了某个变量, 那你 **默认情况下** 是无法修改这个变量的值的

``` rust
fn main() {
    let mut s = String::from("hello");

    change(&s);
}

fn change(some_string: &String) {
    some_string.push_str(", world");  // 尝试追加字符串
}
```

会报错

``` bash
error[E0596]: cannot borrow `*some_string` as mutable, as it is behind a `&` reference
 --> src/main.rs:8:5
  |
7 | fn change(some_string: &String) {
  |                        ------- help: consider changing this to be a mutable reference: `&mut std::string::String`
8 |     some_string.push_str(", world");  // 尝试追加字符串
  |     ^^^^^^^^^^^ `some_string` is a `&` reference, so the data it refers to cannot be borrowed as mutable

error: aborting due to previous error

For more information about this error, try `rustc --explain E0596`.
error: could not compile `ownership`.
```

提示你无法修改他, 当然这是**默认情况下**

### 可变引用

某些情况下可以修改引用的值, 我们修改代码成

``` rust
fn main() {
    let mut s = String::from("hello");

    change(&mut s);  // &mut 表示是可变的引用
    println!("{}", s)  // hello, world
}

fn change(some_string: &mut String) {  // 同样的参数类型也要 mut
    some_string.push_str(", world");  // 尝试追加字符串
}
```

这样即可运行, 但是注意, 可变引用有几个限制

**在特定作用域的特定数据只能有一个可变引用**

例如以下代码

``` rust
fn main() {
    let mut s = String::from("hello");
    let r1 = &mut s;
    let r2 = &mut s;  // 错误, 因为s的 &mut 同时只能出现一个
    println!("{},{}", r1, r2);
}
```

会报错

``` bash
error[E0499]: cannot borrow `s` as mutable more than once at a time
 --> src/main.rs:4:14
  |
3 |     let r1 = &mut s;
  |              ------ first mutable borrow occurs here
4 |     let r2 = &mut s;
  |              ^^^^^^ second mutable borrow occurs here
5 |     println!("{},{}", r1, r2)
  |                       -- first borrow later used here

error: aborting due to previous error

For more information about this error, try `rustc --explain E0499`.
error: could not compile `ownership`.
```

这是为了避免出现**数据竞争**的问题, 数据竞争通常由这三种行为造成:

- 两个或多个指针同时访问一个数据
- 至少一个指针写入数据
- 没有同步数据的机制

数据竞争可能导致出现BUG, 并且让开发者难以定位和解决问题, 所以Rust在编译时会检查这个问题

当然, 这个限制只是存在于同一个作用域, 例如下面的代码是可以的

``` rust
fn main() {
    let mut s = String::from("hello");
    {
        let r1 = &mut s;
    } // 可变引用r1退出作用域
    let r2 = &mut s;  // 可以重新创建
}
```

**在特定作用域的特定数据不能同时拥有可变和不可变引用**

``` rust
fn main() {
    let mut s = String::from("hello");

    let r1 = &s; // 不可变1
    let r2 = &s; // 不可变2
    let r3 = &mut s; // 可变1
    
    println!("{}, {}, and {}", r1, r2, r3);  // 会报错, 因为不可变与可变引用无法共存
    
}
```

报错

``` bash
error[E0502]: cannot borrow `s` as mutable because it is also borrowed as immutable
 --> src/main.rs:6:14
  |
4 |     let r1 = &s; // 不可变1
  |              -- immutable borrow occurs here
5 |     let r2 = &s; // 不可变2
6 |     let r3 = &mut s;
  |              ^^^^^^ mutable borrow occurs here
7 |     
8 |     println!("{}, {}, and {}", r1, r2, r3);
  |                                -- immutable borrow later used here

error: aborting due to previous error

For more information about this error, try `rustc --explain E0502`.
error: could not compile `ownership`.
```

两者不能共存, Rust认为如果你使用了不可变引用. 你一定不希望他在某些时候变化, 所以禁止共存, 但是对于多个不可变引用, 是可以的.

因为都是读取, 就是安全的, 没有办法影响到别人, 所以可以一个作用域可以有多个不可变引用存在

标题所言的是**特定作用域**, 对于引用来说, 他的作用域从声明的地方开始到最后一次使用为止. 如果声明未使用, 那么只存在于声明的那一行, 当然最好不要声明却不使用, 这是不好的习惯

``` rust
fn main() {
    let mut s = String::from("hello");

    let r1 = &s; // 不可变1, 未使用
    let r2 = &s; // 不可变2, 未使用
    let r3 = &mut s;  // 可变1, 使用
    
    println!("{}", r3);  // 这里已经超出了r1和r2的作用域, 因为r1/r2未使用, 作用域只有生成的一行
}
```

``` rust
fn main() {
    let mut s = String::from("hello");

    let r1 = &s; // 不可变1, 未使用
    let r2 = &s; // 不可变2, 未使用
    println!("{},{}", r1, r2);  // 这里是r1/r2最后一次使用, r1/r2作用域到此结束

    let r3 = &mut s;  // 可变1, 使用
    println!("{}", r3);  // 可使用, 当前作用域无不可变引用
}
```

###  垂悬引用

垂悬指针指的是指针指向的内容已经被分配给了其他的持有者. 

在Rust中, 编译器确保了永远不会出现这个问题, 因为当你拥有引用时, 编译器会确保数据不会在其引用之前离开作用域

``` rust
fn main() {
    let res = dangle();  // 接收返回的引用
    println!("{}", res);
}

fn dangle() -> &String {
    let s = String::from("hello");  // s进入作用域

    &s  // 将s的引用返回
}  // 函数结束, s的数据会被清理, 但是s的引用返回出去了
```

这里的 res 是函数 dangle 内部生成的变量的引用, 但是该函数内部的变量会结束后销毁, 此时你获取到的引用就是错误的, 就会发生悬垂引用的问题, Rust会在编译时予以拦截

``` bash
error[E0106]: missing lifetime specifier
 --> src/main.rs:6:16
  |
6 | fn dangle() -> &String {
  |                ^ help: consider giving it a 'static lifetime: `&'static`
  |
  = help: this function's return type contains a borrowed value, but there is no value for it to be borrowed from

error: aborting due to previous error

For more information about this error, try `rustc --explain E0106`.
error: could not compile `ownership`.
```

如果有这样的需求, 你应该直接返回变量, 而不是他的引用, 这样会发生所有权的移动

``` rust
fn main() {
    let res = dangle();  // 接收返回
    println!("{}", res);
}

fn dangle() -> String {
    let s = String::from("hello");  // s进入作用域

    s  // 将s返回
}  // 函数结束, s触发了所有权的移动
```

## slices

slice是没有所有权的. slice允许你引用集合中某一短连续的元素序列, 而不引用整个集合

假设有这样的需求, 写一个函数, 接受一个字符串, 返回字符串中的第一个单词. 如果函数在该字符串中没有找到空格, 那么这整个就是一个单词, 如果有空格, 则第一个空格前的是一个单词

初版代码如下

``` rust
fn first_word(s: &String) -> usize {  // 接收引用, 返回索引
    let bytes = s.as_bytes();  // 转换成bytes元组
    for (i, &item) in bytes.iter().enumerate() {  // 生成迭代器并循环他
        // i是当前遍历到的索引, &item是当前内容的引用
        if item == b' ' {  // 如果遇到了空格
            return i;  // 将索引return
        }
    }

    // 如果没有找到, 证明全部都是一个单词, 所以返回整体的索引
    s.len()
}
```

s是原本的字符串的引用, 因为我们并不需要该字符串的所有权

我们返回的是该字符串中第一个单词的索引

 `.as_bytes()`是将字符串转换成bytes元组, `.iter()`是返回里面的每一个值, 而`.enumerate()` 则是接收`.iter()`返回的值进一步包装. 返回一个元组, 分为索引和值的引用, 当当前字节为空格的时候, 证明需要返回了, 单词结束, 于是将索引直接返回, 当遍历完也没有的时候证明整个字符串都是一个单词, 此时将整个长度返回

这样看起来没什么问题, 但是这里返回的索引长度其实与我们传入的s不是绑定的, 我们在开发中可能遇到这样的问题, 在某一个地方求出结果, 在后面调用时发现不匹配, 原来是源数据被改动了, 例如

``` rust
fn main(){
    let mut s = String::from("word");
    let k = first_word(&s);
    s.clear();  // 这里调用clear方法, 会获取s的可变引用, 字符串变成初始值, 也就是空串
    println!("{}", k)  // k依旧是原来的"word"时的结果
    // 后续中使用 k 就会出现问题, 因为s已经变更
}
```

因为 first_word 虽然需要了s的不可变引用, 但是返回值是普通的数字, 与s无关, 所以执行 first_word 之后不可变引用退出作用域了, 所以可以在 clear 里顺利的申请可变引用, 从而修改值

### 字符串slice

字符串slice是`String`中一部分值的引用

``` rust
fn main(){
    let s = String::from("hello world");
    let h = &s[0..5];
    let w = &s[6..11];
    println!("h={},w={}", h, w)
}
```

如上面的代码. `&s[0..5]`代表引用了s的索引`0-5`之间的内容, 语法是`[start_index..end_index]`, start_index是slice中的开始索引, end_index是slice中最后一个位置的后一个值索引. 例如`[0..5]`实际上是s的索引0到索引4, 也就是字符串`hello`的引用, 我们运行查看结果

``` bash
h=hello,w=world
```

这种方法不是引用整个字符串, 而是字符串中的某一段

Rust的`..`range语法, 还有多种简略写法

如果从索引0开始, 可以忽略0, 可以达到一样的效果

``` rust
    let s = String::from("hello");

    let slice = &s[0..2];  // he
    let slice = &s[..2];  // he
```

如果一直到索引最后, 也可以舍弃尾部的数字

``` rust
let s = String::from("hello");

let len = s.len();

let slice = &s[3..len];  // llo
let slice = &s[3..];  // llo
```

如果是同时舍弃开头和结尾, 则是将整个字符串获取

``` rust
let s = String::from("hello");

let len = s.len();

let slice = &s[0..len];  // hello
let slice = &s[..];  // hello
```

我们将之前的代码修改为新的字符串slice引用的方式, 之后会解释为什么这样做

``` rust
fn first_word(s: &String) -> &str {
    let bytes = s.as_bytes();
    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {
            return &s[..i];  // 返回s的引用, 从0到当前空格的索引
        }
    }
    
    &s[..]  // 全部都是一个单词, 就把整个返回
}
```

那么这样写的好处是什么呢? 回忆一下借用的规则, 当某个值已经有不可变引用时, 无法生成可变引用了, 对于s来讲,   函数 fiest_word 返回的是s的不可变引用, 而后我们在尝试改变s的值的时候`.clear()`尝试申请s的可变引用, 这样就会导致编译时出现问题, 避免出现BUG, 我们按照之前的调用, 尝试 `.clear()`

``` rust
error[E0502]: cannot borrow `s` as mutable because it is also borrowed as immutable
  --> src/main.rs:17:5
   |
15 |     let word = first_word(&s);
   |                           -- immutable borrow occurs here
16 | 
17 |     s.clear();
   |     ^^^^^^^^^ mutable borrow occurs here
18 | 
19 |     println!("the first word is: {}", word);
   |                                       ---- immutable borrow later used here

error: aborting due to previous error

For more information about this error, try `rustc --explain E0502`.
error: could not compile `ownership`.
```

会在编译器就报错, 防止出现BUG

**字符串字面值其实就是slice**

原来在Rust中, 直接给变量赋值字符串

``` rust
let s = "s";
```

这里, s类型就是 `&str`, 他是一个指向程序特定内部位置的slice, 所以他是不可变的, 因为就是不可变引用

**字符串slice作为参数**

修改后的获取单词函数定义是

``` rust
fn first_word(s: &String) -> &str {}
```

而更好的方式是定义为

``` rust
fn first_word(s: &str) -> &str {}
```

这样的目的是提高兼容性, 上面说了, 使用`let s = "s";` 类型是 `&str`, 所以新写法可以兼容这种字符串, 当然对于`String`类型, 我们可以通过转化成`slice`来使用

``` rust
fn main() {
    let my_string = String::from("hello world");

    // first_word 中传入 `String` 的 slice
    let word = first_word(&my_string[..]);

    let my_string_literal = "hello world";

    // 因为字符串字面值就是字符串 slice，
    // 这样写也可以，即不使用 slice 语法！
    let word = first_word(my_string_literal);
  
  
    // &str 也可以继续的生成 slice
    let word = first_word(&my_string_literal[..]);
}
```

**其他类型的slice**

字符串slice里面存放的是字符串, 其实其他类型也是可以的

``` rust
let a = [1, 2, 3, 4, 5];
let b = &a[..2];
```

那么这个slice的类型就是 `&[i31]`, 使用方法与字符串slice并无区别, 你可以对索引集合使用slice, 具体的信息会在之后详解

## 总结

所有权到这里就结束了, 所有权, 借用和slice可以让Rust程序变得更加的安全, 当你耐心的看到这里, 可能你对Rust的独特的编程思想有了大致的理解

Rust设置了诸多限制, 并且希望你写出故意设卡(qia)的代码, 目的是让程序更加安全, 在编译期就把可能出现的问题暴露出来, 让你去主动解决, 而不是在运行时, 或者是生产环境中才出现问题. 这需要开发者时刻留意遵循Rust的规范, 但是这一切都是值得的.

而Rust的所有权系统, 让你无需关注垃圾的回收, 当然搭配作用域/引用/借用一起使用需要开发者关注变量的使用和作用域