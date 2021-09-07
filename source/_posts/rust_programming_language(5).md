---
title: Rust程序设计语言(5)              
date: 2021-09-07            
updated: 2021-09-07         
comments: true              
toc: true                   
excerpt: Rust的结构体和枚举使用
tags:                       
- Rust
categories:                 
- 编程
---

## 结构体使用结构体来组织关联数据

> golang里有同样的类型, 学到这里感觉有点舒服了
>
> struct, 是一个自定义的数据类型, 其中可包含若干个值, 从而形成适合你业务的组合, 比如go的struct(结构体)

### 定义和实例化

结构体的每一个部分可以是不同的类型, 跟元组不同的是, 结构体需要对每一个数据进行命名, 这是为了定义这个值, 也是为了给这个值声明意义. 因为有了这些名字, 使得结构体比元组更加灵活, 不需要依赖顺序来方式实例中的某一个值, 而是通过其名字. 

定义结构体的关键字是 `struct`, 后面是这个结构体的名字, 一般情况下结构体的名字都应该能体现出这个结构体的作用, 在 `{}` 中每一个部分, 都被称为一个`字段(field)`

``` rust
    struct User {
        name: String,  // 用户名
        email: String, // 邮箱
        age: u64,      // 年龄
        active: bool,  // 活跃状态
    }  // 结构体 User, 代表用户信息
```

要使用结构体, 我们就需要实例化, 创建实例时需要指定要实例化的结构体是哪个, 并在 `{}` 内使用 `key: value` 的形式对某个字段赋值, 注意这里的字段顺序可以与定义结构体时的字段顺序不同

``` rust
    let user1 = User {
        name: String::from("user1"),
        age: 23,
        active: false,
        email: String::from("user1@outlook.com")
    };
```

我们也可以在实例化后修改字段的值, 此时这个实例应当是可变的

``` rust
    let mut user1 = User {
        name: String::from("user1"),
        age: 23,
        active: false,
        email: String::from("user1@outlook.com")
    };  // mut 可变
    user1.age = 24  // 通过 .key 的方式来找到值
```

也可以将实例作为表达式的返回值

``` rust
    fn build_user(name: String, email: String) -> User{
        User{
            name: name,
            email: email,
            active: false,
            age: 18
        }
    }  // 返回结构体 User 的实例
```

注意, 当变量或者参数名和类型与结构体的字段完全一致时, 可以使用简略的写法

``` rust
    fn build_user(name: String, email: String) -> User{
        let active = false;
        User{
            name,  // name: name, User的字段name与参数name一致
            email,  // email: email, User的字段email与参数email一致
            active,  // active: active, User的字段active与变量active一致
            age: 18
        }
    }
```

我们也可以借用已经存在的实例的某些字段创建新的实例

``` rust
    let user1 = User {
        name: String::from("user1"),
        age: 23,
        active: false,
        email: String::from("user1@outlook.com")
    };  // user1
    let user2 = User {
        name: user1.name,  // 借用user1的字段
        age: user1.age,  // 借用user1的字段
        email: String::from("user2@outlook.com"),
        active: true
    };
```

如果剩下的字段值都使用老的实例的值, 还可以使用简略的写法

``` rust
    let user1 = User {
        name: String::from("user1"),
        age: 23,
        active: false,
        email: String::from("user1@outlook.com")
    };  // user1
    let user2 = User {
        email: String::from("user2@outlook.com"),
        ..user1  // name/age/active 都使用user1
    };
```

### 元组结构体

有时我们想给某个元组定义一个名字, 让这个元组结构可以复用并且与普通元组分开, 此时你可以使用 元组结构体,

元组结构体不同于普通的结构体, 他没有具体的每个字段的名字, 只有字段的类型, 但是整个元组结构体拥有一个名字

``` rust
    struct Color(i32, i32, i32);  // 元组结构体定义
    struct Point(i32, i32, i32);  // 同上

    let black = Color(0, 0, 0);  // 赋值
    let origin = Point(0, 0, 0);
```

上面的 Color 和 Point 虽然都是 i32, 长度为3 的元组, 但是因为不是一个结构体所以无法混用

同时因为没有字段的名字, 想要访问其中某一个值, 可以通过索引来获取

### 结构体的生命周期

你可能注意到了, 我们定义的结构体, 并没有使用引用, 比如使用 `String` 而不是`&str`, 是因为这设计到了`生命周期`的概念, 这个是之后的内容, 目前我们需要让这个结构体内的字段的所有权在自己手中, 以便正常运行, 如果你使用了引用, 目前是无法编译的

``` rust
    struct User {
        name: &str,  // 用户名
        email: String, // 邮箱
        age: u64,      // 年龄
        active: bool,  // 活跃状态
    }  // 结构体 User, 代表用户信息
```

``` bash
error[E0106]: missing lifetime specifier
 --> src/main.rs:3:15
  |
3 |         name: &str,  // 用户名
  |               ^ expected named lifetime parameter
  |
help: consider introducing a named lifetime parameter
  |
2 |     struct User<'lifetime> {
3 |         name: &'lifetime str,  // 用户名
  |

error: aborting due to previous error

For more information about this error, try `rustc --explain E0106`.
error: could not compile `t_struct`.
```

等到之后, 我们会讲到怎样解决这个问题

### 使用结构体编写示例代码

我们使用之前学的知识, 编写一段代码, 他的功能是求出长方形的面积

``` rust
fn main() {
    let width1 = 30;
    let height1 = 50;
    println!("area={}", area(width1, height1))
}

fn area(width: u32, height: u32) -> u32{
    width * height
}
```

上面的代码能够完成我们的需求, 但是仔细想, 一个长方形, 长和宽应该是绑定的关系, 如何体现绑定关系呢? 我们将长和宽使用元组绑定到一起

``` rust
fn main() {
    let rect1 = (30, 50);
    println!("area={}", area(rect1))
}

fn area(dimensions: (u32, u32)) -> u32{
    dimensions.0 * dimensions.1
}
```

这样就增加了一些结构性. 但是问题出现了, 使用元组的方式, 我们没法知道哪一个是长, 哪一个是宽, 假如说我们需要根据长宽不同进行不同操作, 比如在屏幕中绘制, 那就可能让调用者产生疑问, 不知道参数的意义

于是我们使用结构体来进行代码的编写

``` rust
fn main() {
    let rectange1 = Rectangle{
        width: 20,
        height: 30
    };
    println!("area={}", area(&rectange1))
}

struct Rectangle {
    width: u32,
    height: u32
}
fn area(rectangle: &Rectangle) -> u32{
    rectangle.height * rectangle.width
}
```

这里的函数 `area` 为了防止所有权的转让, 我们使用了引用的方式


### 通过派生 trait 增加功能

有时候我们想打印一个结构体实例的内容, 使用`println!`是不行的, 例如

``` rust
fn main() {
    let rectange1 = Rectangle{
        width: 20,
        height: 30
    };
    println!("rec = {}", rectange1);
}
```

``` bash
error[E0277]: `Rectangle` doesn't implement `std::fmt::Display`
 --> src/main.rs:6:26
  |
6 |     println!("rec = {}", rectange1);
  |                          ^^^^^^^^^ `Rectangle` cannot be formatted with the default formatter
  |
  = help: the trait `std::fmt::Display` is not implemented for `Rectangle`
  = note: in format strings you may be able to use `{:?}` (or {:#?} for pretty-print) instead
  = note: required by `std::fmt::Display::fmt`

error: aborting due to previous error

For more information about this error, try `rustc --explain E0277`.
error: could not compile `t_struct`.
```

这是因为, `println!` 宏默认使用类型的`Display`格式输出, 意思是打印出来的输出, 之前所有的基本类型都实现了`Display`, 但是因为结构体, rust并不知道你想要输出什么, 所以没有提供`Display`实现

但是rust给了我们建议, 查看输出, 有一行

``` bash
note: in format strings you may be able to use `{:?}` (or {:#?} for pretty-print) instead
```

似乎是告诉我们应该这样输出, 于是我们将打印修改为

``` rust
println!("rec = {:?}", rectange1);
```

运行后发现还是不行, 但是又给了一个提示

``` bash
error[E0277]: `Rectangle` doesn't implement `std::fmt::Debug`
 --> src/main.rs:6:28
  |
6 |     println!("rec = {:?}", rectange1);
  |                            ^^^^^^^^^ `Rectangle` cannot be formatted using `{:?}`
  |
  = help: the trait `std::fmt::Debug` is not implemented for `Rectangle`
  = note: add `#[derive(Debug)]` or manually implement `std::fmt::Debug`
  = note: required by `std::fmt::Debug::fmt`

error: aborting due to previous error

For more information about this error, try `rustc --explain E0277`.
```

``` bash
  = help: the trait `std::fmt::Debug` is not implemented for `Rectangle`
  = note: add `#[derive(Debug)]` or manually implement `std::fmt::Debug`
```

这里告诉我们rust确实有打印, 但是是Debug模式, 需要我们显式的开启, 我们将代码修改为

``` rust
fn main() {
    let rectange1 = Rectangle{
        width: 20,
        height: 30
    };
    println!("rec = {:?}", rectange1);
}

#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32
}
```

运行

``` bash
    Finished dev [unoptimized + debuginfo] target(s) in 0.40s
     Running `target/debug/t_struct`
rec = Rectangle { width: 20, height: 30 }
```

可以打印出结构体数据了

我们回看新加入的注释, `#[derive(Debug)]`, 实际上是为结构体 `Rectangle` 加入了 `Debug` 的 `derive`, rust中还有很多这样的用法, 我们之后再说

## 方法语法

当我们写python的时候, 总会使用到类/方法, 使用类生成对象, 调用对象的方法, 让这个方法与类有紧密的联系

再比如Go, 也有类似的概念, 其实rust也是有的, 依附于结构体`struct`, 可能更像`go`, 被称之为结构体的 方法

### 定义方法

``` rust
fn main() {
    let rectange1 = Rectangle{
        width: 20,
        height: 30
    };
    println!("area={}", rectange1.area())  // 调用结构体定义的方法
}

struct Rectangle {  
    width: u32,
    height: u32
}

impl Rectangle{  // impl 结构体名称
    fn area(&self) -> u32 {  // 定义方法 area
        self.height * self.width
    }
}
```

其中, `impl` 是关键字, 意为定义结构体的方法, 在其中定义了方法`area`, 注意参数变成了 `&self`, 学过其他语言的一把都知道这个是代表实例自身, 因为这里我们不想获取实例的所有权, 而是只想获取长和宽, 所以使用了 `&`, 如果想要在一个方法中修改实例, 可以将参数修改为 `&mut self`


将参数设置为 `self` 是不常见的, 这代表获取了实例的所有权, 通常只有将`self` 转换成别的实例时才适用.


调用结构体方法的时候使用 `实例.方法` 即可, 参数`&self` 是自己会传递的, 无需手动的写入


在`C/C++`中, 参数self为指针时, 调用其方法需要`->`, 而`.`是不为指针时调用的方式, 在Rust中会自己为你识别, 而不必关注参数是 `slef/ &self/ &mut self`


### 带有更多参数的方法

很多时候调用方法时肯定需要传入更多参数, 这些参数与实例本身并无联系

``` rust
fn main() {
    let rectange1 = Rectangle{
        width: 20,
        height: 30
    };
    let rectange2 = Rectangle{
        width: 30,
        height: 50
    };
    println!("area={}", rectange1.area());
    println!("r2 can_hold r1 = {}", rectange1.can_hold(&rectange2))  // 调用, 额外参数手动指定
}

struct Rectangle {  
    width: u32,
    height: u32
}

impl Rectangle{
    fn area(&self) -> u32 {
        self.height * self.width
    }
    fn can_hold(&self, other: &Rectangle) -> bool { // 接受一个额外参数 other 类型是 &Rectangle
        self.width > other.width && self.height > other.height
    }
}
```

这时候在 `self` 之后追加即可, 传入参数时需要手动传递, 一样无需传入`self`

### 关联函数

`impl`还可以定义不需要`slef`作为参数的函数, 这种被称作 关联函数, 他们与结构体相关联, 但是因为不依赖`self`, 所以依旧是函数而不是方法, 例如

``` rust
fn main() {
    let sq = Rectangle::square(20);  // 通过 :: 调用, 因为不依赖实例, 所以不需要通过实例去调用, 直接使用结构体
}

struct Rectangle {  
    width: u32,
    height: u32
}

impl Rectangle {
    fn square(size: u32) -> Rectangle {  // 不依赖实例本身
        Rectangle { width: size, height: size }
    }
}
```

`::`的语法是不是很熟悉? 更多的使用方法之后会详解

### 多个impl块

每个结构体都允许有多个impl块, 比如

``` rust

struct Rectangle {  
    width: u32,
    height: u32
}

impl Rectangle {
    fn square(size: u32) -> Rectangle {  // 不依赖实例本身
        Rectangle { width: size, height: size }
    }
}

impl Rectangle {
    fn can_hold(&self, other: &Rectangle) -> bool { // 接受一个额外参数 other 类型是 &Rectangle
        self.width > other.width && self.height > other.height
    }
}


impl Rectangle{
    fn area(&self) -> u32 {
        self.height * self.width
    }
}
```

这样是可以正常使用的, 但是一般不建议这样做, 因为没有意义, 可能在特殊的需求下有用, 我们之后会说

## 枚举与模式匹配

枚举(enumerations/ enums)开发者应该都很熟悉, 枚举让你可以通过列举可能的 成员(variants) 来定义一个类型

### 定义枚举

通过一个场景来理解枚举, 我们知道, IP地址目前主要有两种, IPv4 和 IPv6, 这两个都属于IP, 假设我们的程序有可能会且只会处理这两种IP, 那么我们可以将两个归属为一起, 当代码在处理IP时将其当做一样的来处理, 我们可以使用 枚举 来做.

定义一个枚举 `IpAddrKind` 来整合这两种类型, 分别为 `v4` 和 `v6`

``` rust
enum IpAddrKind {
    // 枚举名
    v4, // ipv4
    v6, // ipv6
}
```

现在, 对于程序来讲, `IpAddrKind`是一个可以使用的数据类型了

### 枚举值

使用定义的枚举

``` rust
    let four = IpAddrKind::v4;
    let six = IpAddrKind::v6;
```

枚举的每一个成员都在其枚举的命名空间中, 使用 `::` 呼出, v4和v6都属于`IpAddrKind`, 所以可以当做一个类型处理

``` rust
enum IpAddrKind {
    // 枚举名
    v4, // ipv4
    v6, // ipv6
}

fn a(ip: IpAddrKind){
}

fn main() {
    let four = IpAddrKind::v4;
    let six = IpAddrKind::v6;
    a(four);
    a(six)
}
```

如果我们想要将IP地址和IP类型形成关联关系, 我们可能优先想到使用结构体

``` rust
enum IpAddrKind {
    // 枚举名
    v4, // ipv4
    v6, // ipv6
}

struct IpAddr {  // ip地址结构体
    address: String,  // ip
    kind: IpAddrKind  // 类型
}

fn main() {
    let address1 = IpAddr{
        kind: IpAddrKind::v4,
        address: String::from("123.234.111.222")
    };
    let address2 = IpAddr{
        kind: IpAddrKind::v6,
        address: String::from("::1")
    };
}
```

其实在枚举`IpAddrKind`时, 我们就已经知道了是`v4`还是`v6`, 而在结构体`IpAddr`中只多出来了字段`address`, 那么我们可以给枚举设置`value`, 来让代码更简单

``` rust
enum IpAddr {
    // 枚举名
    v4(String), // ipv4, String类型
    v6(String), // ipv6, String类型
}

fn main() {
    let address1 = IpAddr::v4(String::from("127.0.0.1"));
    let address2 = IpAddr::v6(String::from("::1"));
}
```

因为IP地址实在是太常见了, 很多时候我们都会用到, 所以Rust内置了数据结构专门存放IP地址, [IpAddr in std::net - Rust (rust-lang.org)](https://doc.rust-lang.org/std/net/enum.IpAddr.html), 内部是这样定义的

``` rust
struct Ipv4Addr {
    // --snip--
}

struct Ipv6Addr {
    // --snip--
}

enum IpAddr {
    V4(Ipv4Addr),
    V6(Ipv6Addr),
}
```

将枚举的`value`设置成结构体, 而这个结构体可以存放任何数据, 这样来增加兼容性


因为我们的例子中都没有引用标准库中的定义, 所以即使我们自己定义了`IpAddr`枚举, 也不会产生冲突


下面我们再看一个新的枚举

``` rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}
```

这个枚举`Message` 下面有4个成员, `Quit`没有关联任何数据, `Move`对应一个匿名结构体, `Write`关联一个元组`String`, `ChangeColor`关联一个元组

如果我们单纯使用结构体也可以达到效果

``` rust
struct QuitMessage; // 类单元结构体
struct MoveMessage {
    x: i32,
    y: i32,
}
struct WriteMessage(String); // 元组结构体
struct ChangeColorMessage(i32, i32, i32); // 元组结构体
```

问题是, 这样的话就没有将这几个Message形成关联关系, 如果使用枚举, 因为枚举本身是一种类型, 就能将这些Message以成员的方式合到一起

对于枚举类型, 我们也可以通过使用`impl`关键字来为枚举类型定义方法(和结构体类似)

``` rust
impl Message {
    fn call(&self) {
        // 方法call
    }
}

let m = Message::Write(String::from("hello"));
m.call();  // 调用
```


具体的调用, self方式, 可以参照上方的结构体impl

#### option枚举

`Option`是标准库定义的另一个枚举, 他的应用很广泛, 他代表了一个值要么有值要么没值. 你可能现在不明白有什么作用

Rust中没有其他语言有的`空值`功能, `空值(Null)`也是一个值, 他代表了没有值. 在其他语言中, 变量都有两种状态: 空值和非空值


Tony Hoare，null 的发明者，在他 2009 年的演讲 “Null References: The Billion Dollar Mistake” 中曾经说到：

> I call it my billion-dollar mistake. At that time, I was designing the first comprehensive type system for references in an object-oriented language. My goal was to ensure that all use of references should be absolutely safe, with checking performed automatically by the compiler. But I couldn't resist the temptation to put in a null reference, simply because it was so easy to implement. This has led to innumerable errors, vulnerabilities, and system crashes, which have probably caused a billion dollars of pain and damage in the last forty years.
>
> 我称之为我十亿美元的错误。当时，我在为一个面向对象语言设计第一个综合性的面向引用的类型系统。我的目标是通过编译器的自动检查来保证所有引用的使用都应该是绝对安全的。不过我未能抵抗住引入一个空引用的诱惑，仅仅是因为它是这么的容易实现。这引发了无数错误、漏洞和系统崩溃，在之后的四十多年中造成了数十亿美元的苦痛和伤害。


空值的问题主要在于, 当你想像使用非空值一样使用空值, 就会出现某种形式上的错误, 因为空和非空无处不在, 所以很容易出现这种问题

rust中没有空值, 他有一个在编码时可以存在或者不存在的概念的枚举, 这个就是`Option`

``` rust
enum Option<T> {
    Some(T),
    None,
}
```

因为`Option`太多常用, 所以不需引用标准库也直接存在, `Option`下拥有两个成员, `Some(T)`和`None`, `<T>`是我们还没有讲到的功能, 他指的是一个泛类型参数, 目前你可以理解成可以包含任何类型的数据, 我们之后会详细讲解


因为对Option做了特殊处理, 所以Option下面的成员Some和None也可以直接使用, 无需`Option::Some`


``` rust
let some_number = Some(5);
let some_string = Some("a string");

let absent_number: Option<i32> = None;
```

如果你使用成员`None`, 则需要告诉Rust `Option` 是什么类型, 因为Rust无法自己知道`None`是什么类型

并且, 因为你通过`Option`创建的值是`Option`类型, 他无法直接与普通的类型进行操作

``` rust
fn main() {
    let x: i8 = 5;
    let y: Option<i8> = Some(5);
    
    let sum = x + y;
}
```

会报错

``` shell
error[E0277]: cannot add `std::option::Option<i8>` to `i8`
 --> src/main.rs:5:17
  |
5 |     let sum = x + y;
  |                 ^ no implementation for `i8 + std::option::Option<i8>`
  |
  = help: the trait `std::ops::Add<std::option::Option<i8>>` is not implemented for `i8`

error: aborting due to previous error

For more information about this error, try `rustc --explain E0277`.
error: could not compile `t_enum`.
```

告诉你无法将 `i8` 与 `Option<i8>` 进行相加, 因为他们的类型不同, 而对于`i8`这种类型, Rust可以保证他一定是有值的, `Option<i8>` 也有可能是为`None`的, Rust为了避免这个错误不允许直接计算.

而要想进行操作, 必须将 `Option<T>` 转换成 `T` , 在这个过程中就会让我们预先的处理空值的问题.

当我们发现一个变量为`Option<T>`是, 牢记可能是空值, 而其他的普通类型, 他一定是非空, 就不用考虑空值的问题

怎么将`Option<T>`转换成`T`, 在之后会告诉你, 你也可以查看[Option in std::option - Rust (rust-lang.org)](https://doc.rust-lang.org/std/option/enum.Option.html)

### match控制流运算符

类似`Golang`有`switch`语法, `Python`可以使用`else if` ,达到对某个值进行多个分支判断的逻辑, `Rust`里当然也是有的, `match`, Rust会在编译期检查所有可能的情况你都做了处理, 当匹配到符合条件的分支时, 就进入对应`模式`的代码中处理

``` rust
enum Coin{  // 枚举
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {  // match
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```

上面是一个枚举和以枚举成员当做模式的`match`表达式

 这里的函数`value_in_cents` 接收一个枚举的实例, 然后进入`match`表达式, `match`关键字之后跟一个表达式, 在这里跟的是`coin`的实例. 没错, `match`之后可以跟任何类型.

而`{}`中的则是这个`match`的分支, 对于分支来讲, 有两个部分组成, 一个模式和一些代码. 比如第一个分支 `Coin::Penny => 1` , 这里的`Coin::Penny`就是模式, `=>` 后跟的就是代码, 当匹配到模式之后, 会运行定义的代码

一个`match`有多个分支, 在匹配时, 会从上到下匹配, 直到匹配成功后就退出`match`

匹配到的代码如果很短, 通常不使用大括号, 如果有多行代码则需要使用, 例如

``` rust
fn value_in_cents(coin: Coin) -> u8 {
    match coin {  // match
        Coin::Penny => {
            println!("Penny");  // 打印
            1  // 返回
        },
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```

### 绑定值的模式

枚举可能是有值的, `match` 同样也可以获取到枚举实例的值

``` rust
#[derive(Debug)]  // debug
enum UsState {
    Alabama,
    Alaska,
}

enum Coin {
    Penny,
    Nickel,
    Dime(u8),
    Quarter(UsState),
}
```

我们为枚举`Coin`的成员`Quarter` 设置值为另一个枚举

``` rust
fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter(state) => {
            println!("State quarter from {:?}!", state);
            25
        },
    }
}
```

然后在 `match` 时, 如果是 `Quarter` 则打印其值

``` rust
#[derive(Debug)]  // debug
enum UsState {
    Alabama,
    Alaska,
}

enum Coin {
    Penny,
    Nickel,
    Dime(u8),
    Quarter(UsState),
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime(v) => {
            println!("{}", v);
            8
        },
        Coin::Quarter(state) => {
            println!("State quarter from {:?}!", state);
            25
        },
    }
}

fn main(){
    let d = Coin::Dime(20);
    let q = Coin::Quarter(UsState::Alaska);
    let dp = value_in_cents(d);
    let qp = value_in_cents(q);
}
```

> 在这里使用`cargo run` 会出现几个报警, 这是因为没有将一些枚举使用起来, 这里不作理会

使用`()`的方式可以接受处理枚举中包含值的情况

###  匹配 `Option<T>`

`match`同样可以处理`Option<T>`

``` rust
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}

fn main(){
    let five = Some(5);
    let six = plus_one(five);
    let none = plus_one(None);
}
```

因为`Optione<T>`可能存在为`None`的情况, 所以通过`match`进行分别处理, 这里的`x` 就是为`None`时不做任何处理, 有值时进行 +1 处理

### 匹配是穷尽的

Rust的匹配是穷尽的, 你必须为`match`设置能覆盖所有情况的分支, 否则会编译失败

``` rust
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        Some(i) => Some(i + 1),
    }
}

fn main(){
    let five = Some(5);
    let six = plus_one(five);
}
```

``` bash
error[E0004]: non-exhaustive patterns: `None` not covered
 --> src/main.rs:2:11
  |
2 |     match x {
  |           ^ pattern `None` not covered
  |
  = help: ensure that all possible cases are being handled, possibly by adding wildcards or more match arms

warning: unused variable: `six`
 --> src/main.rs:9:9
  |
9 |     let six = plus_one(five);
  |         ^^^ help: consider prefixing with an underscore: `_six`
  |
  = note: `#[warn(unused_variables)]` on by default

error: aborting due to previous error

For more information about this error, try `rustc --explain E0004`.
error: could not compile `t_enum`.
```

这里就是没有处理为`None`的情况, Rust会避免出现这种问题

### `_`通配符

其他语言类似的分支处理, 通常会有一个default, 如果都匹配不上, 则会进入default分支, 通常default分支是写在最后的

``` rust
fn main() {
    let some_u8_value = 0;
    match some_u8_value {
        1 => println!("one"),
        3 => println!("three"),
        5 => println!("five"),
        7 => println!("seven"),
        _ => {
            println!("kkkkk")
        },
    }
}
```

Rust有一个`_`, 作用是通配符, 能匹配所有的情况

比如这里, 如果`some_u8_value`不是`1/3/5/7`的其中一个, 则最后会匹配到`_`分支

`_`分支需要写在最后, 因为他是通配的, 假如写在第一位, 那么所有的值都能匹配进`_`, 这样就会导致逻辑出现问题

## `if let`简单控制流

如果有需求, 如果值为3则进行操作, 其他则不处理

``` rust
fn main(){
    let some_u8_value = Some(0);
    match some_u8_value {
        Some(3) => println!("three"),
        _ => (),
    }
}
```

实际上, 如果使用`match`的话, 为了适应无穷性, 必须进行通配符适配, 难免会增加样板代码, 不简洁

Rust提供了`if let`, 来处理只匹配一个模式忽略其他模式的情况

``` rust
fn main(){
    let some_u8_value = Some(3);
    if let Some(3) = some_u8_value {
        println!("three");
    }
}
```

`if let` 后跟一个由`=`分割的模式和表达式, 比如这里, `Some(3)`就是模式, 表达式是

``` rust
{
    println!("three");
}
```

当模式匹配后进行表达式的运行, 不匹配则不运行, 例如

``` rust
fn main(){
    let some_u8_value = Some(1);
    if let Some(3) = some_u8_value {  // 不运行
        println!("three");  
    }
}
```

相比普通的`match` 更加简单, 但是, 这种写法会失去编译时的穷尽检查, 让代码可能会超出你期望的方式运行, 因此使不使用需要自己衡量

`if let` 也可以加 `else` , 作用与通配符`_`一致, 例如

``` rust
fn main(){
    let some_u8_value = Some(1);
    if let Some(3) = some_u8_value {
        println!("three");
    }else{
        println!("other")  // 打印
    }
}
```

也可以和多个 `if let` 一起使用

``` rust
fn main() {
    let some_u8_value = Some(4);
    if let Some(3) = some_u8_value {
        println!("three");
    }
    if let Some(4) = some_u8_value {
        println!("four")
    } else {
        println!("other")
    }
}
```

需要说明的是, 如果多个分支了, 最好还是使用 `match`, 这样反而会提高代码简洁性
