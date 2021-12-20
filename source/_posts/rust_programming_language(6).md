---
title: Rust程序设计语言(6)              
date: 2021-11-11            
updated: 2021-11-25         
comments: true              
toc: true                   
excerpt: Rust的包, Crate和模块使用
tags:                       
- Rust
categories:                 
- 编程
---

## 前言

真正写过项目的人都知道, 代码肯定不是一个文件可以搞定的, 里面的逻辑都是很复杂的, 所以项目都是有目录结构这种东西. 我们按照逻辑的分类将其分割开, 目的是提高代码的可读性.

随着项目的增大, 我们就会增加多个`包`的概念, 一个包可以包含多个二进制的`crate`项和一个可选的`crate`库, 随着包越来越大, 我们可以将包的部分代码提取出来, 做成独立的`crate`, 做成外部的依赖项, 通过引用的方式让代码可用, 本篇会讲诉这些怎么使用, 而`rust`有一个`命名空间`的概念, 这些将在之后解答.

一般我们还会把可以重复使用的逻辑和代码单独拎出来, 封装成单独的包, 暴露接口给其他人使用.

这里还会有一个`作用域(scope)`的概念, 代码所在的上下文有一组定义为`in scope`的名称, 当阅读, 编写, 编译代码时, 程序员和编译器需要知道特定的位置的特定的名称是否引用了变量, 函数, 结构体, 枚举, 模块, 常量或者其他有意义的项. 你可以创建作用域, 以及改变哪些名称在作用域内还是外面. 同一个作用域不能同时拥有两个相同名称的项

`rust`有许多功能可让你管理代码的组织, 包括哪些内容可以公开, 哪些作为私有的部分, 和程序的每个作用域的名字. 这些功能, 也被称作`模块系统(the module system)`, 包括几个部分

- 包(packages): cargo的一个功能, 让你可以构建. 测试和分析crate
- crates: 一个模块的树形结构, 它形成了库或者二进制项目
- 模块(modules)和use: 让你控制作用域和路径的私有性
- 路径(path): 命名结构体, 函数或者模块的方式

## 包和 crate

crate 是一个二进制或者库, crate root 是一切的开始, 编译器认为他是起始点, 并构成你的 crate 根模块

包 是提供一系列功能的一个或者多个 crate, 一个包会包含一个 `cargo.toml` 文件, 里面描述了怎样构建这些 crate

一个包中最多只能包含一个 库crate, 可以包含任意个 二进制crate, 包中至少有一个 crate, 不论他是 库crate 还是 二进制crate

我们使用 `cargo new package_name` 来创建包, 发现会生成几个默认的文件

```bash
➜  student cargo new package_modules
     Created binary (application) `package_modules` package
➜  student cd package_modules 
➜  package_modules git:(master) ✗ tree
.
├── Cargo.toml
└── src
    └── main.rs

1 directory, 2 files
```

我们看到会在 src 文件夹下生成 main.rs 文件, 事实上 rust 认为 main.rs 就是二进制 crate 的根, 也就是 crate root, 但是当 src 下有一个 lib.rs 时, rust认为此时这个包带有与其同名的的 库crate, 此时 lib.rs 为 crate 的根

回到我们这里来, 这时 包 package_name 下只有一个 二进制 crate, 当我们在 src 下新增 lib.rs, 则有一个 二进制 crate 和一个 库 crate

将多个文件放进 src/bin 下, 则会有多个 二进制 crate, 每个文件会单独编译成 二进制 crate

一个 crate 通常代表一个功能块的集合, 可以方便的分享给别人或者其他的包使用, 我们之前使用了 `rand` 来生成随机数, `rand` 就是一个 crate, 我们将其他人写的 crate 引入给我们自己使用, 我们使用 `rand` 时需要通过其名字 `rand`进行访问

对于作用域来讲, 一个 crate 内部的特征(比如`rand`的`Rng`), 会在内部生效, 当其他项目引用了 crate, 加入这个 crate 中有特征 a, 而本身的项目也有特征 a, 特们也不会混淆, 因为引用 crate 必须加上这个 crate 的名字(比如`rand::Rng`)

## 定义模块来控制作用域

如果我们需要写一个 crate 给其他项目使用, 那么我们就需要考虑一个问题, 就是提供什么函数或者特征给对方, 而我们自己内部的变量和函数, 肯定是不希望外面可以直接访问的, 我们希望能区分私有的和公开的东西

模块就可以让我们对 crate 的代码进行分组, 首先会提高可读性和复用性, 另外可以控制项的私有性, 将项分为不可以被外部使用的私有的(private), 和可以被外部使用的公有的(public)

我们使用 cargo 新的指令来新建一个名为`restaurant`的库 crate, `cargo new --lib restaurant`

``` bash
➜  student cargo new --lib restaurant
     Created library `restaurant` package
➜  student cd restaurant 
➜  restaurant git:(master) ✗ tree
.
├── Cargo.toml
└── src
    └── lib.rs

1 directory, 2 files
```

使用新建库 crate 的方式, 发现不再生成 main.rs 而是 lib.rs 标志这是一个库 crate

我们修改 lib.rs 的代码为

``` rust

mod front_of_house {  // mod定义一个模块 后面跟的是这个模块的名字front_of_house
    // 模块的内容

    mod hosting {  // 定义模块front_of_house下面的模块 hosting
        fn add_to_waitlist() {}  // 模块 hosting 下的函数

        fn seat_at_table() {}
    }

    mod serving {  // 定义模块front_of_house下面的模块 serving
        fn take_order() {}

        fn server_order() {}

        fn take_payment() {}
    }
}
```

`mod`关键字为定义模块使用的, 后面跟的就是模块的名字, `{}` 中就定义了模块的具体的内容, 上边就定义了两个子模块. 子模块中定义了3个函数, 模块内可以定义模块, 函数, 结构体, 枚举, 常量和特征.

模块可以将相关的定义和代码放置在一起, 提高代码的可读性, 搭配注释使用效果更好

上面说过, crate的根可能是`src/main.rs`或者`src/lib.rs`, 其实这两个文件都分别在 crate 模块结构中自动生成一个名为 `crate` 的根模块,这种结构被称作 模块树(module tree)

例如上面的代码, 模块树的结构为

``` bash
crate
 └── front_of_house
     ├── hosting
     │   ├── add_to_waitlist
     │   └── seat_at_table
     └── serving
         ├── take_order
         ├── serve_order
         └── take_payment
```

 既然是树形结构, 那么一定有父和子的关系, 还有平级的兄弟关系, 需要注意的是, 最上面的 crate 是隐式生成的, 所以被称为根

## 模块中项的路径

我们想引用模块中的某一个项, 就需要知道他的路径, 路径分为两种, 相对路径和绝对路径

- 相对路径 (absolute path): 从 crate 根开始, 一层一层找到该项
- 绝对路径(relative path): 从当前的模块开始, 都以`self`, `super` 或者当前模块的标识符作为开头

不管是什么路径, 都会跟一个或者多个由双冒号(`::`)分割的标识符

我们修改之前的模块, 为方便演示, 去除了多余的模块, 新增引用方式

``` rust
mod front_of_house {  // mod定义一个模块 后面跟的是这个模块的名字front_of_house
    // 模块的内容

    mod hosting {  // 定义模块front_of_house下面的模块 hosting
        fn add_to_waitlist() {}  // 模块 hosting 下的函数
    }

}

fn eat_at_restaurant() {  // pub 是关键字, 代表这个函数是公有的
    // Absolute path
    crate::front_of_house::hosting::add_to_waitlist();  // 绝对地址引用模块front_of_house的hosting模块的add_to_waitlist函数

    // Relative path
    front_of_house::hosting::add_to_waitlist();  // 相对地址引用
}
```

关键字`pub`标识这个项是公有的, 可以被外部调用的

对于绝对地址引用, 以`crate`开头, 因为要从最根的模块开始, 而最根的就是`crate`,  然后根据模块的定义树结构一步步的寻址, 每一层级中间使用`::`连接

相对地址来说, 因为 front_of_house 与 eat_at_restaurant 在一个层级, 所以无需加 `crate`, 因为他们都属于最大的 `crate` 模块

关于绝对路径和相对路径那种比较合适, 其实没有特别的要求, 从你的角度去考虑吧 (文档中说考虑到如果模块结构有变动, 如果是相对路径还需要修改路径, 所以推荐使用绝对路径)

因为是个库 crate, 所以我们应该使用`cargo build`而不是`cargo run`

``` bash
➜  restaurant git:(master) ✗ cargo build
   Compiling restaurant v0.1.0 (/Users/Work/Code/Rust/student/restaurant)
error[E0603]: module `hosting` is private
```

我们可以发现, 在编译中会出现错误, 提示 hosting 模块是私有的

我们之前说过, 模块化的作用, 1是可以整理和分类项, 2是可以设置私有和公开

对于私有化的各种项, 不允许外部的代码去调用, 这样就避免了引用时将 crate 内部的项暴露给外面, 对于没有指定私有还是公开的项, 默认都是私有的

- 父模块只可以引入子模块的公开项
- 子模块可以访问父模块的所有项
- 兄弟模块直接可以互相访问所有项

### 使用 pub 来公开项

之前说过, 关键字`pub`可以将某个项设置为公开

我们修改之前的代码

``` rust
mod front_of_house {  // mod定义一个模块 后面跟的是这个模块的名字front_of_house
    // 模块的内容

    pub mod hosting {  // 定义模块front_of_house下面的模块 hosting, pub 设置其为公开
        pub fn add_to_waitlist() {}  // 模块 hosting 下的函数, pub 设置其为公开
    }

}

fn eat_at_restaurant() {  // pub 是关键字, 代表这个函数是公有的
    // Absolute path
    crate::front_of_house::hosting::add_to_waitlist();  // 绝对地址引用模块front_of_house的hosting模块的add_to_waitlist函数

    // Relative path
    front_of_house::hosting::add_to_waitlist();  // 相对地址引用
}
```

这里需要特别注意, 如果你不将 add_to_waitlist 设置为公开, 只设置 hosting 也是不行的, 因为只设置模块为公开不代表里面的所有项为公开, 你需要访问 add_to_waitlist 函数, 所以函数项也需要设置 pub, 当你不设置 hosting 只设置 add_to_waitlist 也是不行

``` bash
➜  restaurant git:(master) ✗ cargo build          
   Compiling restaurant v0.1.0 (/Users/Work/Code/Rust/student/restaurant)
    Finished dev [unoptimized + debuginfo] target(s) in 0.23s
```

### super 来设置相对路径

还有一种使用`super`来开头的找寻相对路径的方式, 看下面的例子

``` rust
fn serve_order() {}  // 函数 serve_order

mod back_of_house {  // 模块 back_of_house
    fn fix_incorrect_order() {  // 函数 fix_incorrect_order
        cook_order();  // 引用函数 cook_order
        super::serve_order();  // 相对引用 serve_order (super 方式)
    }

    fn cook_order() {}  // 函数 cook_order
}
```

super 相当于 linux 路径中的 `..` 的意思, 就是指的当前层级的上一级, 这里的上一级其实就是`crate`

### 结构体和枚举的公有化

对于结构体了来讲, 如果结构体设置了`pub`, 只代表这个结构体本身变为了公有, 下面的字段默认还是私有, 需要单独的指定`pub`才行

``` rust
mod back_of_house {
    pub struct Breakfast {  // 设置公开的结构体
        pub toast: String,  // 设置结构体的字段 toast 公开
        seasonal_fruit: String,  // 不设置默认不公开
    }

    impl Breakfast {
        pub fn summer(toast: &str) -> Breakfast {  // 设置结构体的方法 summer 公开
            Breakfast {
                toast: String::from(toast),
                seasonal_fruit: String::from("peaches"),
            }
        }
    }
}

pub fn eat_at_restaurant() {
    // Order a breakfast in the summer with Rye toast
    let mut meal = back_of_house::Breakfast::summer("Rye");
    println!("{}", meal.toast);
    // Change our mind about what bread we'd like
    meal.toast = String::from("Wheat");
    println!("I'd like {} toast please", meal.toast);

    println!("{}", meal.seasonal_fruit);  // 不行, 因为不是公开的  

}
```

而对于枚举来讲, 如果你`pub`了一个枚举项, 则该项下的成员全部是公有的

``` rust
mod back_of_house {
    pub enum Appetizer {  // 公开的枚举项
        Soup,  // 公开
        Salad,  // 公开
    }
}

pub fn eat_at_restaurant() {
    let order1 = back_of_house::Appetizer::Soup;
    let order2 = back_of_house::Appetizer::Salad;
}
```

这是从使用场景来考虑的, 枚举通常作为多个可能的结果来使用, 所以你可能更需要全部公有, 而每一个都写上`pub`相对繁琐

而对于结构体来讲, 有可能并不是所有的字段都是需要公开的, 全部公开而有些不使用反而会降低代码质量

## 使用`use`关键字将名称引入作用域

在上面我们引用项时, 都必须在使用时写一个长长的路径, 而使用`use`, 可以只引入一次, 然后就可以像使用自己的项时使用引入的项啦

``` rust
mod front_of_house {  // 模块
    pub mod hosting {  // 公开模块
        pub fn add_to_waitlist() {}  // 公开函数
    }
}

use crate::front_of_house::hosting;  // 引入 hosting

pub fn eat_at_restaurant() {
    // 各种调用 hosting 下的项
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
}
```

使用`use`引用需要的项之后, 就可以直接使用项了, 当然私有公有规则和之前的引用方式保持一致

相对路径也是可以的

``` rust
mod front_of_house {  // 模块
    pub mod hosting {  // 公开模块
        pub fn add_to_waitlist() {}  // 公开函数
    }
}

use front_of_house::hosting;  // 引入 hosting

pub fn eat_at_restaurant() {
    // 各种调用 hosting 下的项
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
}
```

### `use`的惯用方式

**引用函数项时不要直接引用到函数**

上面的代码中, 我们使用`use`引入, 是引入`use front_of_house::hosting` 然后调用时使用`hosting::add_to_waitlist()`

可能有人会问, 为什么不引用时使用`use front_of_house::hosting::add_to_waitlist` 在使用时直接`add_to_waitlist()` 呢? 这样其实也是可以运行的, 只是不符合使用习惯, 我们希望, 在使用外部的函数项时, 尽量的保留上一级, 方便与本地的项做区分.

**引用其他项时直接引用到该项**

对于非函数的项, 通常直接引用到该项. 大家都这样写

但是也可能有例外, 比如, 两个不同的 crate 有相同的项, 例如

``` rust
use std::fmt;
use std::io;

fn function1() -> fmt::Result {  // Result
    // --snip--
}

fn function2() -> io::Result<()> {  // Result
    // --snip--
}
```

此时就还是要引用到上一级, 因为 rust 无法自己分辨某个项是哪个, 因为他们的名字都一样

### 使用`as`重命名

上面说的引用多个 crate 但是里面的项一致的问题, 还可以使用`as`关键字来为某个项重命名

``` rust
use std::fmt::Result;
use std::io::Result as IoResult;  // 在本 crate 中重命名为 IoResult(本 crate 生肖)

fn function1() -> Result {
    // --snip--
}

fn function2() -> IoResult<()> {
    // --snip--
}
```

### 使用`pub use`重新导出项

对于我们自己的 crate 来讲, 我们导入的别人的公有项会变成我们自己的私有项, 如果我们想要将我们引入的项变成在我们的 crate 中同样也是公开的, 可以使用`pub use`

``` rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

pub use crate::front_of_house::hosting;  // 重导出, 此时引用我们这个 crate 的代码也可以引用 hosting

pub fn eat_at_restaurant() {  // 自己的 crate 是可以使用front_of_house::hosting的
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
}
```

当其他代码引入我们的 crate 时, 可以使用`hosting::add_to_waitlist`来引入函数`add_to_waitlist`, 而这个函数对于我们的 crate 来讲也是我们引用的

### 使用外部包

就像 `python`的包仓库`pypi`一样, `rust`也有自己的软件仓库[crates.io: Rust Package Registry](https://crates.io/), 我们之前用过上面的包`rand`, 方法是在`Cargo.toml`添加行

``` toml
[dependencies]
rand = "0.5.5"
```

在`Cargo.toml`添加`rand`依赖告诉`cargo`从`crates.io`中下载, 并在项目代码中使用

然后使用`use`来引用这些项, 比如

``` rust
use rand::Rng;

fn main() {
    let secret_number = rand::thread_rng().gen_range(1, 101);
}
```

注意标准库（`std`）对于你的包来说也是外部的 crate, 也需要你引入, 但是因为他太常使用了, 所以他被集成在了 Rust 中, 你无需修改 *Cargo.toml* 来引入 `std`，不过需要通过 `use` 将标准库中定义的项引入项目包的作用域中来引用它们，比如我们使用的 `HashMap`：

``` rust
use std::collections::HashMap;
```

### 通过嵌套路径来减少大量的`use`行

`use`关键字每一行只能写一个, 也就是说现在你只能在一行引入一个项, 当我们有很多项的时候, 就会出现很多行的问题, 比如

``` rust
use std::cmp::Ordering;
use std::io;
```

他们都属于`std`, 此时我们可以将两条合并

``` rust
use std::{cmp::Ordering, io};
```

使用`{}`来引入多个路径, 前提是他们都是同一个前缀, 每个路径以`,`分割

对于需要引入父路径又需要引入子路径的时候, 可以使用 `self` 来代表前缀本身

``` rust
use std::io;
use std::io::Write;
```

修改为

``` rust
use std::io::{self, Write};
```

### 通过`golobal`将所有公有项引入

我们也可以通过关键字`golobal`将某一个路径的所有公有项全部引入

``` rust
use std::collections::*;
```

这非常不推荐使用, 因为你很容易将其下的公有项与自己的项混淆, 而且通常引入的路径公有项你也不是全都会使用到

## 将模块分割进不同文件

到现在为止, 上面的例子中模块都在一个文件`lib.rs`中, 但是实际的开发中, 模块其实是很大的, 我们需要将其分割开来提高代码的可读性

我们新建`src/front_of_house.rs`文件, 并编写代码

``` rust
pub mod hosting {  // 定义模块 hosting
    pub fn add_to_waitlist() {}  // 公开函数
}
```

再修改`src/lib.rs`代码

``` rust
mod front_of_house;  // 引入同级目录下 front_of_house.rs 中的项加载模块

pub use crate::front_of_house::hosting;  // 引入子模块 hosting

pub fn eat_at_restaurant() {  // 公开函数
    hosting::add_to_waitlist();  // 调用 hosting 的 add_to_waitlist 函数
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
}
```

此时 src 下的文件有

``` bash
➜  src git:(master) ✗ tree
.
├── front_of_house.rs
└── lib.rs

0 directories, 2 files
```

在 `mod front_of_house` 后使用分号，而不是代码块，这将告诉 Rust 在另一个与模块同名的文件中加载模块的内容, 这里是将 `front_of_house.rs` 的 `hosting` 导入了



有时候我们需要再加些目录来表达更复杂的关系, 举个例子

新建`src/front_of_house` 目录, 编写 `src/front_of_house/hosting.rs`文件

``` rust
pub fn add_to_waitlist() {}
```

修改文件 `src/front_of_house.rs`

``` rust
pub mod hosting;  // 引入 同级的名为 front_of_house 文件夹下的 hosting.rs 文件的项
```

此时`src`下的文件结构是

``` bash
➜  src git:(master) ✗ tree
.
├── front_of_house
│   └── hosting.rs
├── front_of_house.rs
└── lib.rs

1 directory, 3 files
```

如上面的注释所说, 当你在 crate 的 rs 文件下找到了`mod xxx;` 的时候, 就代表他会引入同级与他文件名相同的文件夹下的`xxx.rs` 文件中的项

> 我一开始也不明白为什么这样写, 官方文档中也没有相对详细的介绍, 只找到了一小节说就要这样写, 参见: [Modules - The Rust Reference (rust-lang.org)](https://doc.rust-lang.org/reference/items/modules.html#module-source-filenames) 总之找同级和同名的文件夹下内容就行了

多层结构也是这样

修改`src/lib.rs`

``` rust
mod front_of_house;  // 引入 front_of_house.rs 文件的项

pub use crate::front_of_house::hosting;
pub use crate::front_of_house::hosting::test;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
    test::t();
}
```

修改`src/front_of_house/hosting.rs`

``` rust
pub mod test;
pub fn add_to_waitlist() {}
```

新建文件夹`src/front_of_house/hosting`, 修改文件`src/front_of_house/hosting/test.rs`

``` rust
pub fn t(){}
```

此时他的目录为

``` bash
➜  src git:(master) ✗ tree
.
├── front_of_house
│   ├── hosting
│   │   └── test.rs
│   └── hosting.rs
├── front_of_house.rs
└── lib.rs

2 directories, 4 files
```

可以看到, 在 hosting.rs 里新增了 `pub mod test;` 代表着去与他同级的目录也就是`hosting`中寻找`test.rs`文件, 找里面的项, 寻找到了函数`t`

在 lib.rs 中使用 `hosting::test::t();` 即可调用这个函数项

我们也可以使用上面的对于嵌套的时候减少 use 的方式修改 lib.rs 的引用

``` rust
mod front_of_house;  // 引入 front_of_house.rs 文件的项

pub use crate::front_of_house::hosting::{self, test};  // 引入 hosting 和 hosting::test

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
    hosting::add_to_waitlist();
    test::t();
}
```
