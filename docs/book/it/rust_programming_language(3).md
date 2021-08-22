# Rust程序设计语言(3)

## 函数

函数在rust中无处不在, 对于rust程序来讲, `main`函数是许多程序的入口, 之前我们知道, 建立一个函数的关键字是 `fn`

rust使用下划线命名法来命名, 这个之前也有提到过

我们来看下面的程序

``` rust
fn main() {
    println!("Hello, world!");

    another_function();
}

fn another_function() {
    println!("hello another_function!");
}
```

rust中, 函数的范围由 `{}` 指定, 也就是说, 这段代码中有两个函数, main 和 another_function, 程序的入口是 main, 在 main 中调用了 another_function, 当我们从上往下看的时候, 会发现在 another_function 未定义之前就调用了 another_function, 这样也是可以的, rust 并不会报错, 只要你存在, 不管在哪里都可以. 

在函数中逻辑是从上到下执行的, 因此会先打印 Hello, world!, 在执行 another_function, another_function 中会打印 hello another_function!

``` bash
➜  fun git:(master) ✗ cargo run
   Compiling fun v0.1.0 (/Users/Work/Code/Rust/student/fun)
    Finished dev [unoptimized + debuginfo] target(s) in 1.00s
     Running `target/debug/fun`
Hello, world!
hello another_function!
```

### 函数的参数

很多时候, 函数需要根据参数来进行操作, rust需要在建立函数时定义参数的名称与类型, 写在函数名后的 `()` 中

``` rust
fn main() {
    another_function(5);
}

fn another_function(x: i32) {
    println!("x = {}", x);
}
```

``` bash
➜  fun git:(master) ✗ cargo run
   Compiling fun v0.1.0 (/Users/Work/Code/Rust/student/fun)
    Finished dev [unoptimized + debuginfo] target(s) in 0.40s
     Running `target/debug/fun`
x = 5
```

对于函数 `another_function` 来讲, 我们设置了一个参数 `x`, 他是 `i32` 类型, 需要注意的是, 我们必须对每个参数都说明类型, 不然会导致编译错误

当某个函数的需要多个参数时, 我们这样写

``` rust
fn main() {
    another_function(1, 2);
}

fn another_function(x: i32, y: i32) {
    println!("x = {}", x);
    println!("y is {}", y);
}
```

### 函数的内容包含了陈述式和表达式

函数的内容是由一系列的**陈述式(statements)**和在后面的可选的**表达式(expression)**组成的, rust是基于表达式的语言, 下面我们来介绍这两个的区别

陈述式是一系列动作的指令, **陈述式不回传任何数据**

表达式则是通过逻辑处理来产生结果, 也就是说**表达式返回数据**

比如代码

``` rust
fn main() {
    let a = 1;
}
```

这里的mian函数本身是一个陈述式, 因为他不返回任何数据

这里的 `let a = 1;` 也是一个陈述式, 因为他不返回任何数据, 因为他不返回任何数据, 所以你不能接受他的返回数据, 例如

``` rust
fn main() {
    let b = (let a = 1);
}
```

这就会导致编译出错, 因为`let a = 1`是一个陈述式, 他不返回任何数据, 但是你试图使用返回值来作为 b 的值

而表达式则会给出结果, 比如 `1+1` 会返回`2`, 表达式可以是陈述式的一部分, 比如 `let a = 1`中的`1`就是一个表达式, 他返回了一个1, 同时我们使用`{}`产生的作用域也是一个表达式, 例如

``` rust
fn main() {
    let x = 5;

    let y = {
        let x = 3;
        x + 1
    };

    println!("y = {}", y);
}
```

其中, 表达式

``` rust
    let y = {
        let x = 3;
        x + 1
    };
```

会返回`4`, 此时使用 y 接收就能获得 4, 这是因为 `x + 1`后面并没有带上 `;`, 如果你加上了 `;` 则不会返回结果, 这是必须要记住的

### 函数返回值

函数的返回值定义是`->`, 写在接收参数的`()`后, 同样的要定义他的类型. 但是无需命名

``` rust
fn five() -> i32 {
    5
}

fn main() {
    let x = five();

    println!("x = {}", x);
}
```

需要注意, five 函数里直接写了5, 但是没有跟`;`, 所以他会返回5, 同时 five 定义了返回值是一个, 类型是 `i32`

同时 main 中定义了 x 来接受 five 的返回值, 所以 x 为 5, 同时函数 five 为表达式

``` bash
➜  fun git:(master) ✗ cargo run
   Compiling fun v0.1.0 (/Users/Work/Code/Rust/student/fun)
    Finished dev [unoptimized + debuginfo] target(s) in 0.57s
     Running `target/debug/fun`
x = 5
```

当我们为 5 加上 `;`, five 就变成了 陈述式, 此时在编译时就会报错

``` bash
➜  fun git:(master) ✗ cargo run
   Compiling fun v0.1.0 (/Users/Work/Code/Rust/student/fun)
error[E0308]: mismatched types
 --> src/main.rs:1:14
  |
1 | fn five() -> i32 {
  |    ----      ^^^ expected `i32`, found `()`
  |    |
  |    implicitly returns `()` as its body has no tail or `return` expression
2 |     5;
  |      - help: consider removing this semicolon

error: aborting due to previous error

For more information about this error, try `rustc --explain E0308`.
error: could not compile `fun`.

To learn more, run the command again with --verbose.
```

当这个函数有多个返回值, 则使用`()`包裹

``` rust
fn five() -> (i32, i32) {
    (5, 6)
}

fn main() {
    let x = five();

    println!("x0 = {}, x1 = {}", x.0, x.1);
}
```

``` bash
➜  fun git:(master) ✗ cargo run
   Compiling fun v0.1.0 (/Users/Work/Code/Rust/student/fun)
    Finished dev [unoptimized + debuginfo] target(s) in 0.25s
     Running `target/debug/fun`
x0 = 5, x1 = 6
```

## 注释

一个好的程序, 注释并不可少. 多写**注释(comments)**对自己和他人都有好处

编译器在编译时会将注释部分去除, 所以不用担心会增加编译文件的大小

rust的注释使用 `// `, 一般会在 `//` 后加上一个空格

``` rust
// 这里是注释
```

需要注意的是, `//`标识改行为注释, 因此 `//` 后一直到本行结束之间的所有东西都被编译器认为是注释

当需要多行注释时, 为每一行都加上 `//` 即可

``` rust
// 注释1
// 注释2
```

注释也可以加在某一行代码的结束

``` rust
fn main() {
    let x = 3; // 注释
}
```

## 控制流程

在程序中, 一个流程通常有多个分支, 我们需要在某个时候根据某个条件来决定怎么做

### if表达式

if表达式根据条件的不同执行不同的代码. 当满足条件时就执行这段代码, 不满足时就不执行

``` rust
fn main(){
    let a = 5;
    if a < 5{
        println!("<5")
    }else{
        println!(">=5")
    }
}
```

这里我们判断a是否小于5, 根据不同的情况来打印不同的结果

需要注意的是, 其中某个分支的逻辑必须使用 `{}` 包裹

并且, a<5 返回的是一个`bool`, rust中if表达式只能使用`bool`来进行判断, 加入我们将代码修改成

``` rust
fn main(){
    let a = 5;
    if a{
        println!("<5")
    }else{
        println!(">=5")
    }
}
```

则会导致编译失败, 这是因为a是`int` 而不是`bool`

``` bash
➜  fun git:(master) ✗ cargo run
   Compiling fun v0.1.0 (/Users/Work/Code/Rust/student/fun)
error[E0308]: mismatched types
 --> src/main.rs:3:8
  |
3 |     if a{
  |        ^ expected `bool`, found integer

error: aborting due to previous error

For more information about this error, try `rustc --explain E0308`.
error: could not compile `fun`.

To learn more, run the command again with --verbose.
```

rust并不会将其他非bool值自动转化成bool

### 使用 else if 处理多个情况

使用多个`else if`和`if`和`else`一起使用来处理多个分支

``` rust
fn main(){
    let a = 5;
    if a == 4{
        println!("4")
    }else if a == 5{
        println!("5")
    }else if a == 5{
        println!("51")
    }else{
        println!("not")
    }
}
```

需要注意的是, 在这个代码块中, 判断只会成功一次, 也就是说, 在这个多重判断中, 即使a可以为`true`两次, 也只会执行一次, 也就是只会打印`5` 而不是`51`

当你有多个分支时, 不推荐使用大量的 `else if`, 这样会导致代码看起来不友好, 后面会推荐使用`match`

### 在let中使用if

``` rust
fn main(){
    let t = true;
    let s = if t{
        5
    }else{
        6
    };
    println!("{}", s)
}
```

这里就是, 我们在赋值的时候, 根据t的不同来返回不同的值给s, 这里注意, 写一个数字本身就是一个表达式, 也就是说如果t为`true`, s就为5, 其他为6

``` bash
➜  fun git:(master) ✗ cargo run
   Compiling fun v0.1.0 (/Users/Work/Code/Rust/student/fun)
    Finished dev [unoptimized + debuginfo] target(s) in 0.36s
     Running `target/debug/fun`
5
```

这种写法有一个限制, 就是if的返回值必须是同一类型, s不可能有可能是`int`有可能是`str`, 例如

``` rust
fn main(){
    let t = true;
    let s = if t{
        5
    }else{
        "6"
    };
    println!("{}", s)
}
```

这种就会报错

``` bash
➜  fun git:(master) ✗ cargo run
   Compiling fun v0.1.0 (/Users/Work/Code/Rust/student/fun)
error[E0308]: `if` and `else` have incompatible types
 --> src/main.rs:6:9
  |
3 |       let s = if t{
  |  _____________-
4 | |         5
  | |         - expected because of this
5 | |     }else{
6 | |         "6"
  | |         ^^^ expected integer, found `&str`
7 | |     };
  | |_____- `if` and `else` have incompatible types

error: aborting due to previous error

For more information about this error, try `rustc --explain E0308`.
error: could not compile `fun`.

To learn more, run the command again with --verbose.
```

因为rust在编译时就必须准确的知道s的类型, 但是s可能会有两种类型, 这样会导致代码有可能出现问题

## 循环

循环可以重复的执行某段代码

rust有三种循环: `loop`/`while`/`for`

### loop

loop关键字会让rust一直重复执行代码一直到明确的要求结束

看以下代码

``` rust
fn main(){
    loop{
        println!("a")
    }
}
```

此程序是死循环, 不停的打印字符串a, 因为没有使用关键字`break`, 所以不会终止循环

### 从循环返回

``` rust
fn main(){
    let mut c = 0;
    let r = loop{
        c += 1;
        if c == 10{
            break c*2;
        }
    };
    println!("{}", r)
}
```

我们可以定义一个变量来接受某个循环的返回值

### while循环

我们使用循环时, 多会使用一个大的嵌套, 比如`loop{}`, 其实rust中的`while`可以在特定的场景下减少代码, 比如

``` rust
fn main(){
    let mut c = 4;
    while c != 0{
        c -= 1;
        println!("{}", c)
    }
    println!("OK")
}
```

while可以与一个判断条件一起使用, 比如这里就是判断`c!=0`, 如果`c!=0`为`false`时则退出循环. 而在循环内则对c进行-1, 代码逻辑等同于

``` rust
fn main(){
    let mut c = 4;
    loop {
        c -= 1;
        println!("{}", c);
        if c == 0{
            break;
        };
    }
    println!("OK")
}
```

### for循环

使用`遍历`来描述for可能更为准确, for并不是死循环, 而是遍历完成就结束

``` rust
fn main(){
    let c = [1, 2, 3, 4];
    for i in c.iter(){
        println!("{}", i)
    }
}
```

这里我们遍历c这个数组, 注意`c.iter()`可以生成一个`range`, 每次抛出c的一个元素, 使用for可以防止索引超出范围

``` bash
➜  fun git:(master) ✗ cargo run
   Compiling fun v0.1.0 (/Users/Work/Code/Rust/student/fun)
    Finished dev [unoptimized + debuginfo] target(s) in 0.42s
     Running `target/debug/fun`
1
2
3
4
```

再比如

``` rust
fn main(){
    let c = [1, 2, 3, 4];
    for i in c.iter().rev(){
        println!("{}", i)
    }
}
```

`rev`方法可以翻转一个`range`, 因此会输出4-1

``` bash
➜  fun git:(master) ✗ cargo run
   Compiling fun v0.1.0 (/Users/Work/Code/Rust/student/fun)
    Finished dev [unoptimized + debuginfo] target(s) in 0.32s
     Running `target/debug/fun`
4
3
2
1
```

## 练习

### 编写程序实现摄氏度与华氏度之间的转换

``` rust
use std::io; // 引入标准库

fn main(){
    loop {
        println!("选择转换模式: 
        1: 摄氏度转华氏度
        2: 华氏度转摄氏度
        其他任意键: 退出
        >>>");
        let mut model = String::new();
        io::stdin().read_line(&mut model).expect("读取失败"); // 如果获取错误打印警告 
        if model.trim() == "1"{
            println!("输入你要转换的摄氏度>>>");
            let mut c = String::new();
            io::stdin().read_line(&mut c).expect("读取失败"); // 如果获取错误打印警告 
            let c: f32 = match c.trim().parse() {
                Ok(num) => num,
                Err(_) => {
                    println!("输入了一个无法解析的字符串");
                    continue;
                },
            };
            let f = transformation_centigrade(c);
            println!("摄氏度:{}对应的华氏度是:{}", c, f);
        }
        else if model.trim() == "2"{
            println!("输入你要转换的华氏度>>>");
            let mut f = String::new();
            io::stdin().read_line(&mut f).expect("读取失败"); // 如果获取错误打印警告 
            let f: f32 = match f.trim().parse() {
                Ok(num) => num,
                Err(_) => {
                    println!("输入了一个无法解析的字符串");
                    continue;
                },
            };
            let c = transformation_fahrenheit_degree(f);
            println!("华氏度:{}对应的摄氏度是:{}", f, c);
        }
        else{
            println!("exit.");
            break;
        }
    }
}

// 华氏度2摄氏度
fn transformation_fahrenheit_degree(f: f32) -> f32{
    return (f-32.0)/1.8;
}

// 摄氏度2华氏度
fn transformation_centigrade(c: f32) -> f32{
    return 32.0+c*1.8;
}
```

运行

``` bash
➜  fun git:(master) ✗ cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.00s
     Running `target/debug/fun`
选择转换模式: 
        1: 摄氏度转华氏度
        2: 华氏度转摄氏度
        其他任意键: 退出
        >>>
1
输入你要转换的摄氏度>>>
222
摄氏度:222对应的华氏度是:431.59998
选择转换模式: 
        1: 摄氏度转华氏度
        2: 华氏度转摄氏度
        其他任意键: 退出
        >>>
2
输入你要转换的华氏度>>>
4444
华氏度:4444对应的摄氏度是:2451.111
选择转换模式: 
        1: 摄氏度转华氏度
        2: 华氏度转摄氏度
        其他任意键: 退出
        >>>
q
exit.
```

### 生成 n 阶斐波那契数列

``` rust
use std::io; // 引入标准库

fn main(){
    loop {
        println!("输入期望的n>>>");
        let mut n = String::new();
        io::stdin().read_line(&mut n).expect("读取失败");
        let n: usize = match n.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("输入了一个无法解析的字符串");
                continue;
            },
        };
        let mut c: usize = 0;
        let mut s0 = 0;
        let mut s1 = 1;
        println!("结果: ");
        loop{
            if c == n{
                break;
            };
            let mut f = 0;
            if c == 0{
                f = 0;
            }else{
                f = s0+s1;
            }
            s0 = s1;
            s1 = f;
            c+=1;
            print!("{} ", f)
        }
        println!("")
    }
}
```

运行

``` bash
➜  fun git:(master) ✗ cargo run
   Compiling fun v0.1.0 (/Users/Work/Code/Rust/student/fun)
warning: value assigned to `f` is never read
  --> src/main.rs:23:21
   |
23 |             let mut f = 0;
   |                     ^
   |
   = note: `#[warn(unused_assignments)]` on by default
   = help: maybe it is overwritten before being read?

    Finished dev [unoptimized + debuginfo] target(s) in 0.48s
     Running `target/debug/fun`
输入期望的n>>>
3
结果: 
0 1 1 
输入期望的n>>>
1
结果: 
0 
```

### 打印歌曲 “The Twelve Days of Christmas” 的歌词, 使用循环

``` rust
fn main(){
    let days = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"];
    let gift = ["a partridge in a pear tree", "two turtle doves", "three French hens", "four calling birds", "five golden rings", "six geese a-laying", "seven swans a-swimming", "eight maids a-milking", "nine ladies dancing", "ten lords a-leaping", "eleven pipers piping", "twelve drummers drumming"];
    let mut n = 0;
    println!("The Twelve days of Christmas");
    for d in days.iter(){
        print!("On the {} day of Christmas, my true love sent to me: ", d);
        let mut gi = n;
        loop{
            if gi != 0{
                print!("{}, ", gift[gi]);
                gi -= 1;
            }else if n == 0{
                print!("{} \n", gift[gi]);
                break;
            }else{
                print!("and {} \n", gift[gi]);
                break;
            }
        };
        n += 1
    };
}
```

运行

``` bash
The Twelve days of Christmas
On the first day of Christmas, my true love sent to me: a partridge in a pear tree 
On the second day of Christmas, my true love sent to me: two turtle doves, and a partridge in a pear tree 
On the third day of Christmas, my true love sent to me: three French hens, two turtle doves, and a partridge in a pear tree 
On the fourth day of Christmas, my true love sent to me: four calling birds, three French hens, two turtle doves, and a partridge in a pear tree 
On the fifth day of Christmas, my true love sent to me: five golden rings, four calling birds, three French hens, two turtle doves, and a partridge in a pear tree 
On the sixth day of Christmas, my true love sent to me: six geese a-laying, five golden rings, four calling birds, three French hens, two turtle doves, and a partridge in a pear tree 
On the seventh day of Christmas, my true love sent to me: seven swans a-swimming, six geese a-laying, five golden rings, four calling birds, three French hens, two turtle doves, and a partridge in a pear tree 
On the eighth day of Christmas, my true love sent to me: eight maids a-milking, seven swans a-swimming, six geese a-laying, five golden rings, four calling birds, three French hens, two turtle doves, and a partridge in a pear tree 
On the ninth day of Christmas, my true love sent to me: nine ladies dancing, eight maids a-milking, seven swans a-swimming, six geese a-laying, five golden rings, four calling birds, three French hens, two turtle doves, and a partridge in a pear tree 
On the tenth day of Christmas, my true love sent to me: ten lords a-leaping, nine ladies dancing, eight maids a-milking, seven swans a-swimming, six geese a-laying, five golden rings, four calling birds, three French hens, two turtle doves, and a partridge in a pear tree 
On the eleventh day of Christmas, my true love sent to me: eleven pipers piping, ten lords a-leaping, nine ladies dancing, eight maids a-milking, seven swans a-swimming, six geese a-laying, five golden rings, four calling birds, three French hens, two turtle doves, and a partridge in a pear tree 
On the twelfth day of Christmas, my true love sent to me: twelve drummers drumming, eleven pipers piping, ten lords a-leaping, nine ladies dancing, eight maids a-milking, seven swans a-swimming, six geese a-laying, five golden rings, four calling birds, three French hens, two turtle doves, and a partridge in a pear tree 
```