# Rust程序设计语言(1)

## 安装

**brew**

`brew install rust`

**其他**

[官网](https://www.rust-lang.org/zh-CN/tools/install)

**校验是否安装成功**

安装后在命令行输入 `rustc --version` 如果看到rust的版本号即可, 例如 `rustc 1.42.0 (b8cedc004 2020-03-09)`

**打开内置的文档**

命令行输入 `rustup doc`, 会调用默认浏览器打开本地的内置文档

## VsCode配置插件

插件商城输入 rust, 排第一的就是, 安装后打开rust项目会提示下载依赖, 同意即可

## Hello,world

> 编写一个输出 hello, world 的程序

### 编写与执行

在某个地方新建文件夹 `hello_world` , 在文件夹下新建文件 `main.rs` , 编写代码如下

``` rust
fn main() {
    println!("hello, world");
}
```

保存后在当前目录下执行命令 `rustc main.rs ` 会生成可执行文件 `main`, 执行这个文件, 打印 `hello, world`, 例如

``` shell
➜  hello_world rustc main.rs 
➜  hello_world ./main 
hello, world
➜  hello_world 
```

### 解析

- rust的代码写在 `.rs` 后缀的文件中
- rust推荐使用下划线方法来命名, 比如 `hello_world` 而不是 `helloWorld` 或者 `helloworld`
- rust的缩进是4个空格而不是一个tab

我们来解析代码

``` rust
fn main() {
}
```

fn代表定义一个函数, 这里定义了一个 `main` 函数, main函数是特殊的函数, 每个可执行的rust程序都从main函数开始, `main()` 代表这个函数不需要任何参数, 如果有的话应该定义在 `()` 中. 

`()` 后直接跟的 `{}` 代表函数本体, rust要求函数内部的代码都被这个大括号包裹, 而 `main(){}` 也代表了这个函数没有任何的返回值, 一般来说 `{` 与函数名在同一行, 并使用空格分开

rust的新版本自带了代码的格式化工具 `rust fmt`, 使用他可以将你的代码格式化的更加规范

在当前命令行中使用 `rustfmt main.rs` 

查看格式化后的代码, 如果你的代码原来是

``` rust
fn main() {println!("hello, world");}
```

格式化之后变成了

``` rust
fn main() {
    println!("hello, world");
}
```

而其中的 

``` rust
    println!("hello, world");
```

则是函数的逻辑, 上面说到了缩进是四个空格

`println!` 是rust内置的宏(macro), 类似于内置的语法, 而引入内置的函数则是 `println`, 这个之后再说明

`"hello, world"`是传入这个宏的参数, 是一个字符串, 然后该字符串就会被输出到命令行中

rust中使用 `;` 作为一行的结束, 代表这个表达式结束, 下一个表达式开始

### 编译

rust是一门静态语言, 他也是需要编译的, 还记得我们写完后在命令行输入 `rustc main.rs` 吗, 这就是在编译代码, 编译完成后会生成编译平台可执行的文件

## hello, cargo

> 认识cargo

`cargo` 是rust的构建系统和依赖管理工具, 类似于golang的 go mod 

在实际的编写项目中, 常常需要引入第三方的函数, 此时我们就需要 cargo 来帮助我们管理

cargo在安装 rust 时就已经安装到了你的电脑中

你可以在命令行中输入

``` shell
cargo --version
```

来查看cargo的版本, 例如 `cargo 1.42.0 (86334295e 2020-01-31)`

### 使用cargo建立项目

正常情况下我们一般使用 cargo 来建立新项目, 而不是手动建立文件夹

``` shell
➜  student ls
➜  student cargo new hello_cargo
     Created binary (application) `hello_cargo` package
➜  student ls
hello_cargo
```

可以看到, 在执行 `cargo new hello_cargo` 之后, 原本空的文件夹下出现了 `hello_cargo` 文件夹, 这与我们执行 new 时的输入是相同的

我们的项目就在这里

里面已经多了几个文件, 目录树如下

``` bash
.
├── .git
│   ├── HEAD
│   ├── config
│   ├── description
│   ├── hooks
│   │   └── README.sample
│   ├── info
│   │   └── exclude
│   ├── objects
│   │   ├── info
│   │   └── pack
│   └── refs
│       ├── heads
│       └── tags
├── .gitignore
├── Cargo.toml
└── src
    └── main.rs
```

可以看到, cargo会在 hello-cargo 下初始化 git, 并且为我们生成了 .gitignore 忽略文件, 其中默认忽略了 `/target` 目录, 我们之后再介绍这个文件夹

同时生成了 cargo.toml 文件, [toml](https://toml.io/en/)格式是一种配置文件的格式, 他的内容大致如下

``` toml
[package]
name = "hello_cargo"
version = "0.1.0"
authors = ["example <example@example.com>"]
edition = "2018"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
```

其中, package下为项目的信息, name为项目名, version为版本, authors为创建人(读取git的信息), edition这个项目创建时的大版本号, 目前是2018

里面的Value内容是可以修改的, 如果信息不准确你可以手动进行修改

我们真正的代码在 `src/main.rs` 中, 里面已经默认添加了 main 函数

``` rust
fn main() {
    println!("Hello, world!");
}
```

- rust希望你将所有的源代码放置在这个src目录下, 在根目录只放置 README.md/ 配置文件 等不涉及到代码的东西
- 如果当前目录已经在 git 的控制下, 那么使用 `cargo new` 默认不会创建git相关的文件, 但是你可以使用参数 `--vcs=git` 来强制创建, 更多用法可查看 `cargo new --help`



### 执行cargo

**cargo build**

在命令行执行

``` bash
➜  hello_cargo git:(master) ✗ cargo build
   Compiling hello_cargo v0.1.0 (/Users/Work/Code/Rust/student/hello_cargo)
    Finished dev [unoptimized + debuginfo] target(s) in 0.76s
```

我们会发现在目录下生成文件夹 `/target` 在里面的 `/debug` 中则有可执行文件 `hello_cargo`

我们执行他

``` rust
➜  hello_cargo git:(master) ✗ ./target/debug/hello_cargo
Hello, world!
```

所以, 我们 `build` 后会把生成的文件放置在 `/target/debug` 下, 当然 target 下还有很多文件, 我们之后再说

当某个项目第一次build, 还会在根目录生成 `Cargo.lock` 文件, 里面会存放一些具体的依赖, 一般不需要我们修改



**cargo run**

我们也可以使用 `cargo run` 来直接运行 `build` 出的程序, 与上面的方式没有区别

``` bash
➜  hello_cargo git:(master) ✗ cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.00s
     Running `target/debug/hello_cargo`
Hello, world!
```

更强大的是, 如果你修改了源代码, 此时你无需执行 `build`, 直接执行 `run` 可自行 `build`然后执行

比如我们将 `main.rs` 修改为

``` rust
fn main() {
    println!("Hello, world!");
    println!("Hello, world!");
}
```

保存后直接执行 `cargo run`

``` rust
➜  hello_cargo git:(master) ✗ cargo run
   Compiling hello_cargo v0.1.0 (/Users/Work/Code/Rust/student/hello_cargo)
    Finished dev [unoptimized + debuginfo] target(s) in 0.27s
     Running `target/debug/hello_cargo`
Hello, world!
Hello, world!
```

如果你事先没有 build, 也就是没有 target 文件夹, 执行 `cargo run`也会自己build



**cargo check**

如果你只想确认你编写的代码是否可以运行而不想build出文件, 可以执行 `cargo check`, 可以在不生成可执行文件的前提下检查你的代码是否可以编译

``` rust
➜  hello_cargo git:(master) ✗ cargo check
    Checking hello_cargo v0.1.0 (/Users/chenming/Work/Code/Rust/student/hello_cargo)
    Finished dev [unoptimized + debuginfo] target(s) in 0.13s
```



**cargo release**

当你的项目需要发布或者迁出稳定版的时候, 使用 `cargo build --release` , 与普通的build不同的是, 该操作会优化生成的可执行文件, 提高执行速度等等, 当然, 因为优化原因, release 的耗时会比普通的 build 慢一些, 编译完成后会放置在 `/target/release` 文件夹下, 建议每次发布时都采用此方式编译



**代码格式化**

之前提到对某一个 rs 文件格式化代码使用 `rustfmt xx.rs`

如果对整个项目都格式化, 使用 `cargo fmt` 即可

如果你只想查看哪些是需要格式化的而不是直接修改好文件, 使用 `cargo fmt -- --check` 即可

**最好对每个项目都是用targo来管理, 这样对项目来讲是最好的**

## 设计猜谜游戏程序

> 这个程序的流程是, 用户输入一个数字, 然后程序自己随机出一个数字, 将这两个数字进行对比

### 建立新项目

使用 cargo 建立新项目并进入目录

``` bash
➜  student cargo new guessing_game
     Created binary (application) `guessing_game` package
➜  student ls
guessing_game
➜  student cd guessing_game 
```

此时在 `/src/main.rs` 中已经有一个 main 函数了, 我们修改 main 函数

### 处理用户输入的数字

我们将代码修改成下面的

``` rust
use std::io;  // 引入标准库

fn main() {
    println!("输入你的猜测数字: ");  // 打印
    let mut guess = String::new();  // 创建一个字符串变量guess
    io::stdin()  // 调用stdin
        .read_line(&mut guess)  // 调用stdin的方法read_line获取输入值
        .expect("读取失败");  // 如果获取错误打印警告
    println!("你猜测的数字是: {}", guess)  // 输出获取到的输入
}
```

值得注意的是, rust的注释是 `//`, 他不会编译`//`后的内容直到本行的结尾

这段代码的目的是读取用户输入的数字并输出

在第一行, 我们使用 `use` 语法来引入标准库 `std::io`, 类似于Python/Go的`import`

我们首先在输入框中输出提示 `输入你的猜测数字: `



**let**

在第5行, 我们使用 `let` 来创建一个 `变量`, 但是与其他语言不同的是, 如果你只是使用 `let`, 那么你创建的变量的值是**不可变的**, 例如以下代码

``` rust
    let a = "1212";
    a = "1111" ;
```

我们使用 `cargo check` 来检查会爆出错误

``` bash
error[E0384]: cannot assign twice to immutable variable `a`
 --> src/main.rs:5:5
  |
4 |     let a = "1212";
  |         -
  |         |
  |         first assignment to `a`
  |         help: make this binding mutable: `mut a`
5 |     a = "1111" ;
  |     ^^^^^^^^^^ cannot assign twice to immutable variable

error: aborting due to previous error
```

告诉我们不能对不可变的变量进行二次赋值

所以, 如果这个变量在以后需要重新赋值, 我们需要使用 `let mut`

``` rust
    let mut a = "1212";
    a = "1111" ;
```

对于新建变量来说, 还是要根据用途来进行设计

``` rust
    let mut a = "1212";  // 可变变量
    let b = "dddd"  // 不可变变量
```



回到代码中, 我们看到, 我们新建了一个可变变量 guess, 他的值是 `String::new()` , 代表着使用了 `String` 的`new` 方法, 生成了一个 `String` 实例, `String` 代表着 rust 的字符串类型, 那么, `String::new()`代表生成了一个字符串类型的初始值, 也就是空字符串

`::new` 代表调用 `new` 方法, `new`对于`String` 来说是**关联函数(**associated function**)** , 通常我们认为`new`是`String` 的**静态方法**, 一些面向对象的语言通常都有这个概念, 指的是类自有的方法, 而不需要对象去调用

在 rust 中, 新建一个新的类型的初始值通常使用 `::new`

``` rust
    io::stdin()  // 调用stdin
        .read_line(&mut guess)  // 调用stdin的方法read_line获取输入值
        .expect("读取失败");  // 如果获取错误打印警告
```

这三行代码其实是一条语句, 我们之前提到, `;` 代表一段代码的结束, 所以rust会将这三行合并成一条语句来解析, 所以我们也可以将这三行缩短为, 这样会减少代码的可读性

``` rust
    io::stdin().read_line(&mut guess).expect("读取失败");
```

这段代码的意思是调用 io 模块的静态方法 stdin, 此方法回传一个实例 stdin, 匹配标准输入控制

然后继续调用实例的 `read_line` 方法, 此方法对标准输入代码执行 `read_line` 命令, 来获取使用者的输入信息, 我们还将生成的可变变量 guess 传递进去, 代表将用户输入的结果传递给 guess 

`&` 代表这个参数是**引用(reference)** , 这让代码中的多个部分共享一个值, 不需要每次都复制值到一个新的地址, 引用是个复杂的概念, rust 可以让你安全又轻松的使用引用, 这个之后再讲, 你现在需要知道的是, 引用默认也是**不可变**的, 因此在后面加上 `mut` 代表这个是**可变引用**, 因此你必须写 `&mut guess` 而不是 `&guess`



**使用Result类型处理可能出现的错误**

`.expect("读取失败");` 这个代码处理了 `read_line` 方法可能出现的错误, 因为 `read_line` 返回了 `io::Result` 对象, 在 rust 中有很多库都有 `Result`类, Result实际上是种**枚举(enumerations/enums)**, 枚举是拥有固定的值的类型, 这些值被称为枚举的**变体(variants)**, 对于`Result` 来说, 变体有 `ok` 和 `Error`, ok代表成功, error 代表失败, 返回 Result 的目的是让使用者在错误发生时去处理这个问题, `io::Result` 自带了方法 `expect`, 当Result返回 时便会触发 `expect`, 如果是 ok 则代表没有出现问题, expect 不会对数据进行任何操作

当我们不对 `expect` 进行捕捉, 我们在编译时就会出现如下警告

```rust
use std::io; // 引入标准库

fn main() {
    println!("输入你的猜测数字: "); // 打印
    let mut guess = String::new(); // 创建一个字符串变量guess
    io::stdin() // 调用函数stdin
        .read_line(&mut guess); // 调用stdin的方法read_line获取输入值
        // .expect("读取失败"); // 如果获取错误打印警告
    println!("你猜测的数字是: {}", guess) // 输出获取到的输入
}

```

 ``` bash
➜  guessing_game git:(master) ✗ cargo build
   Compiling guessing_game v0.1.0 (/Users/Work/Code/Rust/student/guessing_game)
warning: unused `std::result::Result` that must be used
 --> src/main.rs:6:5
  |
6 | /     io::stdin() // 调用函数stdin
7 | |         .read_line(&mut guess); // 调用stdin的方法read_line获取输入值
  | |_______________________________^
  |
  = note: `#[warn(unused_must_use)]` on by default
  = note: this `Result` may be an `Err` variant, which should be handled

    Finished dev [unoptimized + debuginfo] target(s) in 0.62s
 ```

提示你没有处理可能出现的错误, 这里我们先添加 expect 保证其编译时不警告, 至于怎么去使用 expect 我们之后再说



**println!打印输入的数字**

``` rust
println!("你猜测的数字是: {}", guess) // 输出获取到的输入
```

这里是将用户输入的数字打印出来, `{}`代表占位符, 将 `guess` 的值填充到 `{}` 中, `{}` 可以多个, 例如

``` rust
let x = 5;
let y = 10;

println!("x = {} 而且 y = {}", x, y);
```

输出

``` bash
x = 5 而且 y = 10
```

**运行第一个部分**

显然的, 程序还没有编写完成, 目前只能获取到用户的输入并打印出来

``` bash
➜  guessing_game git:(master) ✗ cargo run
   Compiling guessing_game v0.1.0 (/Users/Work/Code/Rust/student/guessing_game)
    Finished dev [unoptimized + debuginfo] target(s) in 0.60s
     Running `target/debug/guessing_game`
输入你的猜测数字: 
3
你猜测的数字是: 3
```

### 生成随机的秘密数字

既然是猜谜游戏, 那么系统需要生成一个随机的数字来进行比对决定对错

**使用Crate来获取更多功能**

[crate.io](https://crates.io/) 是rust官方的仓库, 里面是rust各种各样的包(类似Python的pypi), 我们需要使用其中的一个包 `rand` 来帮助我们生成随机数字

如何将`rand`添加进我们的项目呢? 我们找到项目根目录下的`Cargo.toml` 文件, 并编辑

``` toml
[package]
name = "guessing_game"
version = "0.1.0"
authors = ["xx <xx@Outlook.com>"]
edition = "2018"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
rand = "0.5"
```

我们在 `[dependencies]` 下新增包 `rand` 设置其版本为 `0.5 ,这代表限制`rand`的版本在`0.5`中, 避免出现兼容问题

然后我们使用 `cargo build` 能看到cargo自动下载了我们指定的包, 如果我们指定的包需要依赖其他的包, cargo也会自动帮我们下载(比如下面的 rand_core)

``` bash
➜  guessing_game git:(master) ✗ cargo build
    Updating crates.io index
  Downloaded rand v0.5.6
  Downloaded rand_core v0.3.1
  ......
    Finished dev [unoptimized + debuginfo] target(s) in 11.13s
```

**crate.io受网络影响, 在国内可能会出现通信问题, 可以使用第三方源比如[USTC](http://mirrors.ustc.edu.cn/help/crates.io-index.html)**

**如果你出现Blocking waiting for file lock on package cache错误, 尝试删除 ~/.cargo/.package-cache 文件**



**通过Cargo.lock确保项目依赖的正确性**

当我们通过 cargo 安装新的依赖后, 我们会发现 `Cargo.lock` 文件也发生了变化, 增加了我们添加的依赖的具体的信息, 比如

``` toml
[[package]]
name = "rand"
version = "0.5.6"
source = "registry+https://github.com/rust-lang/crates.io-index"
checksum = "c618c47cd3ebd209790115ab837de41425723956ad3ce2e6a7f09890947cacb9"
dependencies = [
 "cloudabi",
 "fuchsia-cprng",
 "libc",
 "rand_core 0.3.1",
 "winapi",
]
```

cargo通过该文件来保证依赖的完整性和准确性, 当我们联合开发时, 只要将 `Cargo.lock` `Cargo.toml` 上传至项目中, 通过 `cargo build` 即可下载同样的依赖



**升级Crate依赖**

如果依赖有小版本的升级, 这通常是修复BUG和提高性能, 使用 `cargo update` 可以更新依赖, cargo会根据 `cargo.toml` 的语义化版本升级兼容该版本的小版本更新, 然后更新 `cargo.toml` 和 `cargo.lock` 中的内容

例如 你指定了rand 版本为 `rand=0.8` 则如果当前的版本是 `0.8.3` 新版本是 `0.8.5`会自动更新

如果新版本为 `0.9.1` 则与你指定的版本不同, 则不更新

如果你想更新到 `0.9` 版本, 需手动的编辑 toml 文件然后执行 update, 但是因为大版本的更新可能伴随着功能的修改, 必须要在手动升级前确认新版本的兼容性



**生成随机数字**

修改代码为

``` rust
use std::io; // 引入标准库
use rand::Rng;

fn main() {
    println!("输入你的猜测数字: "); // 打印
    let secret_number = rand::thread_rng().gen_range(1, 101);  // 随机生成一个1-100的数字
    println!("生成的数字是: {}", secret_number);  // 打印生成的数字
    let mut guess = String::new(); // 创建一个字符串变量guess
    io::stdin() // 调用函数stdin
        .read_line(&mut guess) // 调用stdin的方法read_line获取输入值
        .expect("读取失败"); // 如果获取错误打印警告
    println!("你猜测的数字是: {}", guess) // 输出获取到的输入
}
```

注意到我们新增了两行代码

``` rust
    use rand::Rng;
    ....
		let secret_number = rand::thread_rng().gen_range(1, 101);  // 随机生成一个1-100的数字
    println!("生成的数字是: {}", secret_number);  // 打印生成的数字
```

在最开始, 我们引入了新的模块, `rand::Rng`,  需要注意的是, 我们在下面使用 rand 的时候并没有使用 Rng, 实际上这个 `Rng` 被称作 **特征(trait)**

它定义了数字生成器的工作方法, 必须将其引入才可以正常生成数字, 关于特征的更多情况, 我们之后再做讲解

重要的是生成随机数字这一段, 我们使用 rand包的thread_rng方法, 这会返回一个随机数字的生成器, 以当前的工作进程做为种子, 然后我们调用这个生成器的 gen_range 方法, 这个方法是由我们引入的 `Rng` 定义的, 他接受两个参数, 最大值和最小值, 我们传入 `1, 101` 代表生成 `1-100`的数字, 他是**顾头不顾尾**的, 所以我们要填到101

我们将其打印出来运行, 目的是测试功能是否正常, 事实上程序并未完成

``` bash
➜  guessing_game git:(master) ✗ cargo run       
   Compiling guessing_game v0.1.0 (/Users/Work/Code/Rust/student/guessing_game)
    Finished dev [unoptimized + debuginfo] target(s) in 0.51s
     Running `target/debug/guessing_game`
输入你的猜测数字: 
生成的数字是: 6
1
你猜测的数字是: 1
```



### 将猜测的数字与生成的数字进行比较

在上面, 我们生成了数字并获取到了用户输入的数字, 这一步我们将这两个数字进行比较

``` rust
use std::io; // 引入标准库
use rand::Rng;
use std::cmp::Ordering;

fn main() {
    println!("输入你的猜测数字: "); // 打印
    let secret_number = rand::thread_rng().gen_range(1, 101);  // 随机生成一个1-100的数字
    println!("生成的数字是: {}", secret_number);  // 打印生成的数字
    let mut guess = String::new(); // 创建一个字符串变量guess
    io::stdin() // 调用函数stdin
        .read_line(&mut guess) // 调用stdin的方法read_line获取输入值
        .expect("读取失败"); // 如果获取错误打印警告
    println!("你猜测的数字是: {}", guess); // 输出获取到的输入
    match guess.cmp(&secret_number){
        Ordering::Less => println!("太小了"),
        Ordering::Greater => println!("太大了"),
        Ordering::Equal => println!("正确"),
    }
}
```

我们先引入了 `std::cmp::Ordering` , Ordering是一个枚举, 其变体为 `Less`, `Greater`, `Equal`. 当你对两个数字进行比较时会有这三种结果

`cmp`方法会对数字进行比较, 我们传入引用 `secret_number` , 目的是将 guess 与 secret_number 进行比较, 他会回传我们引入的 Ordering 变体



**match**

有时候, 我们需要对某个枚举的变体进行分别处理, 比如这里, 我们根据数字比较结果来提示用户数字的范围

所以我们使用 `match` 语法

match 由**分支(arms)**组成, 每个分支包含一个**模式(pattern)**和他的处理逻辑, 当匹配到这个模式, 就会执行对应的逻辑. 在执行完毕后则退出 math 不再进行下面的匹配,  match的具体细节会在之后讲解

但是我们运行时会发现他会报错

``` rust
➜  guessing_game git:(master) ✗ cargo run
   Compiling guessing_game v0.1.0 (/Users/Work/Code/Rust/student/guessing_game)
error[E0308]: mismatched types
  --> src/main.rs:15:21
   |
15 |     match guess.cmp(&secret_number){
   |                     ^^^^^^^^^^^^^^ expected struct `std::string::String`, found integer
   |
   = note: expected reference `&std::string::String`
              found reference `&{integer}`

error: aborting due to previous error

For more information about this error, try `rustc --explain E0308`.
error: could not compile `guessing_game`.

To learn more, run the command again with --verbose.
```

这是因为, guess的类型是字符串, 而secret_number是数值,这就会导致 **型別無法配對（mismatched types）**, rust是静态类型的语言, 这两个是无法进行直接比较的

关于数值, rust有多个数值类型, 分别为 `i32`32位元数字, `u32`无符号32位元数字, `i64`64位元数字, `u64`64位无符号元数字等等, 默认的类型为 `i32`, 因此 secret_number 为 `i32`

同时我们也面临一个问题, 就是用户输入的不是数字怎么办



此时我们需要将guess转换为数字, 让他们可以比较, 将代码修改为

``` rust
use std::io; // 引入标准库
use rand::Rng;
use std::cmp::Ordering;

fn main() {
    println!("输入你的猜测数字: "); // 打印
    let secret_number = rand::thread_rng().gen_range(1, 101);  // 随机生成一个1-100的数字
    println!("生成的数字是: {}", secret_number);  // 打印生成的数字
    let mut guess = String::new(); // 创建一个字符串变量guess
    io::stdin() // 调用函数stdin
        .read_line(&mut guess) // 调用stdin的方法read_line获取输入值
        .expect("读取失败"); // 如果获取错误打印警告
    let guess: u32 = guess.trim().parse().expect("请输入正确的数字");
    println!("你猜测的数字是: {}", guess); // 输出获取到的输入
    match guess.cmp(&secret_number){
        Ordering::Less => println!("太小了"),
        Ordering::Greater => println!("太大了"),
        Ordering::Equal => println!("正确"),
    }
}
```

我们添加了一行

``` rust
    let guess: u32 = guess.trim().parse().expect("请输入正确的数字");
```

注意到, 之前有定义过 guess 为 string 类型, 这里是将他重新定义为一个`u32`类型的数值, 这在rust中被称为**遮蔽(shadow)**, 我们遮蔽了原来的guess, 遮蔽让我们可以重复的使用一个变量名, `guess.trim()`可以去除这个字符串前后的空白和换行, 而`.parse()`则可以将字符串转换为数值类型, 同时我们捕捉`expect`, 如果转换失败, 则告诉用户出现错误了, 我们来执行代码

``` bash
➜  guessing_game git:(master) ✗ cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.00s
     Running `target/debug/guessing_game`
输入你的猜测数字: 
生成的数字是: 54
  1
你猜测的数字是: 1
太小了
```

``` bash
➜  guessing_game git:(master) ✗ cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.00s
     Running `target/debug/guessing_game`
输入你的猜测数字: 
生成的数字是: 9
ffff111
thread 'main' panicked at '请输入正确的数字: ParseIntError { kind: InvalidDigit }', src/main.rs:13:22
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```

### 使用户循环输入

目前的程序, 用户输入一次失败后就结束了程序, 为了提升体验, 我们需要让用户可以循环输入



**loop**

loop语法可以生成一个死循环, 我们将代码修改为

``` rust
use std::io; // 引入标准库
use rand::Rng;
use std::cmp::Ordering;

fn main() {
    let secret_number = rand::thread_rng().gen_range(1, 101);  // 随机生成一个1-100的数字
    println!("生成的数字是: {}", secret_number);  // 打印生成的数字
    loop{
        println!("输入你的猜测数字: "); // 打印
        let mut guess = String::new(); // 创建一个字符串变量guess
        io::stdin() // 调用函数stdin
            .read_line(&mut guess) // 调用stdin的方法read_line获取输入值
            .expect("读取失败"); // 如果获取错误打印警告
        let guess: u32 = guess.trim().parse().expect("请输入正确的数字");
        println!("你猜测的数字是: {}", guess); // 输出获取到的输入
        match guess.cmp(&secret_number){
            Ordering::Less => println!("太小了"),
            Ordering::Greater => println!("太大了"),
            Ordering::Equal => println!("正确"),
        }
    }
}
```

loop是一个死循环, 因此我们不停的输入数字去比较, 退出的方法只有强制关闭程序比如 `ctrl+c`, 或者输入一个无法解析为数值的字符串让他报错

```bash
➜  guessing_game git:(master) ✗ cargo run
   Compiling guessing_game v0.1.0 (/Users/Work/Code/Rust/student/guessing_game)
    Finished dev [unoptimized + debuginfo] target(s) in 0.40s
     Running `target/debug/guessing_game`
生成的数字是: 79
输入你的猜测数字: 
11
你猜测的数字是: 11
太小了
输入你的猜测数字: 
ff
thread 'main' panicked at '请输入正确的数字: ParseIntError { kind: InvalidDigit }', src/main.rs:14:26
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```



**break**

我们需要在用户猜中之后让他结束这个游戏, 使用 `break` 语法可以退出循环

``` rust
use std::io; // 引入标准库
use rand::Rng;
use std::cmp::Ordering;

fn main() {
    let secret_number = rand::thread_rng().gen_range(1, 101);  // 随机生成一个1-100的数字
    println!("生成的数字是: {}", secret_number);  // 打印生成的数字
    loop{
        println!("输入你的猜测数字: "); // 打印
        let mut guess = String::new(); // 创建一个字符串变量guess
        io::stdin() // 调用函数stdin
            .read_line(&mut guess) // 调用stdin的方法read_line获取输入值
            .expect("读取失败"); // 如果获取错误打印警告
        let guess: u32 = guess.trim().parse().expect("请输入正确的数字");
        println!("你猜测的数字是: {}", guess); // 输出获取到的输入
        match guess.cmp(&secret_number){
            Ordering::Less => println!("太小了"),
            Ordering::Greater => println!("太大了"),
            Ordering::Equal => {
              println!("你猜中了, 游戏结束");
              break;  
            },
        }
    }
}
```

当猜中时, 使用break退出循环, 因为下面没有代码了,就直接退出

``` bash
➜  guessing_game git:(master) ✗ cargo run
    Finished dev [unoptimized + debuginfo] target(s) in 0.00s
     Running `target/debug/guessing_game`
生成的数字是: 25
输入你的猜测数字: 
11
你猜测的数字是: 11
太小了
输入你的猜测数字: 
25
你猜测的数字是: 25
你猜中了, 游戏结束
```



**对错误进行处理**

现在, 用户输入一个无法转成数值的字符串会导致程序结束, 我们现在需要处理这个错误, 让他在错误时重新输入, 不让代码结束, 我们应该对每个错误都捕捉处理, 避免程序关闭, 这对每个程序都是一样的

我们将`expect`的处理变成一个`match`, 当分支检测到`Error`时进行特殊的处理

``` rust
use std::io; // 引入标准库
use rand::Rng;
use std::cmp::Ordering;

fn main() {
    let secret_number = rand::thread_rng().gen_range(1, 101);  // 随机生成一个1-100的数字
    println!("生成的数字是: {}", secret_number);  // 打印生成的数字
    loop{
        println!("输入你的猜测数字: "); // 打印
        let mut guess = String::new(); // 创建一个字符串变量guess
        io::stdin() // 调用函数stdin
            .read_line(&mut guess) // 调用stdin的方法read_line获取输入值
            .expect("读取失败"); // 如果获取错误打印警告
        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("输入了一个无法解析的字符串");
                continue;
            },
        };
        println!("你猜测的数字是: {}", guess); // 输出获取到的输入
        match guess.cmp(&secret_number){
            Ordering::Less => println!("太小了"),
            Ordering::Greater => println!("太大了"),
            Ordering::Equal => {
              println!("你猜中了, 游戏结束");
              break;  
            },
        }
    }
}
```

我们在上面说过, `parse`返回一个枚举, 那我们就使用`match`判断这个枚举的分支, 他会有两种情况, `OK` 和`Err`, 如果是`OK`则代表正确, 我们将回传的`num`原样返回给`guess`, 如果`Err` 代表失败, 在失败时我们就不关心`num`是什么了, 所以我们使用`_` 接受, 然后打印告诉用户出现了错误, 使用**break**关键字跳出当前的循环

``` bash
➜  guessing_game git:(master) ✗ cargo run
   Compiling guessing_game v0.1.0 (/Users/Work/Code/Rust/student/guessing_game)
    Finished dev [unoptimized + debuginfo] target(s) in 0.44s
     Running `target/debug/guessing_game`
生成的数字是: 82
输入你的猜测数字: 
11
你猜测的数字是: 11
太小了
输入你的猜测数字: 
ff
输入了一个无法解析的字符串
输入你的猜测数字: 
82
你猜测的数字是: 82
你猜中了, 游戏结束
```

如果是真实的程序, 应该将程序生成的数值打印去除, 这里保留只是为了方便调试