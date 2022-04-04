---
title: Vue3 从入门到入土(TypeScript数据类型)
date: 2022-04-03            
updated: 2022-04-24        
comments: true              
toc: true                   
excerpt: Vue3入门第二章, 主要是 TS 的内容, 涉及到 TS 数据类型和基本使用
tags:                       
- Vue
categories:                 
- 编程
---



## 数字/字符串/布尔

``` typescript
// 基础类型
(()=>{
    // let 变量名: 变量类型 = 值
    // 对于已经定义了类型的变量, 可以重复赋值为相同类型的值, 但是不能赋值为不同类型

    // bool
    let ok: boolean = true

    // 数字
    // 可以存放四种进制, 但是在打印时都会转成十进制
    let count0: number = 10  // 十进制
    let count1: number = 0b1010 // 二进制
    let count2: number = 0o12  // 八进制
    let count3: number = 0xa  // 十六进制

    // 字符串类型
    let str0: string = "str0"
    let str1: string = "str1"
    // 字符串 format
    console.log(`${str0}, ${str1}, ${count0}`)

    // 字符串和数字拼接
    console.log(str0+count1)  // str010
})()
```

## undefined/null

``` typescript
 // 基础类型
(()=>{
    // undefined 和 null 是不同的类型
    // 默认的时候, undefined 和 null 是所有类型的子类型
    let u: undefined = undefined
    let n: null = null
    // 默认情况下, 不能将其他类型的变量赋值为 undefined 或者 null
})()
```

## 数组类型

``` typescript
// 基础类型
(()=>{
    // 数组类型
    // 数组里的每个变量类型必须相同, 且符合定义数组时设置的数据类型

    // 数据类型[]
    // number[] 代表一个数组, 里面的类型为 number
    let arr0: number[] = [1, 2, 3, 4, 5, 6]
    // 数组类型的另一种定义方法
    // Array<数据类型>
    let arr1: Array<number> = [1, 2, 3]


    // 元组类型
    // 元组可以存储不同的数据类型, 但是必须在定义时设置好元组的长度和每个的类型

    // [元组0位的类型, 元组1位的类型, ....]
    let arr3: [string, number, boolean] = ["s", 0, false]
})()
```

## 枚举

``` typescript
// 基础类型
(()=>{
    // 枚举
    // 枚举中的每一个数据值都可以叫做元素, 每个元素都有自己的编号, 默认编号从0开始, 依次递增+1
    enum Color{
        red,  // 0
        green,  // 1
        blue,  // 2
    }
    let color: Color = Color.red  // 0

    // 枚举可以指定其每个元素的值, 但是必须是 number 类型
    enum Color1{
        red = 100,  // 100
        green,  // 101
        blue,  // 102
    }
    enum Color2{
        red,  // 0
        green = 100,  // 100
        blue,  // 101
    }
    enum Color3{
        red = 1,  // 1
        green = 3,  // 3
        blue = 100,  // 100
    }

    // 从元素拿到值
    console.log(Color2.red)  // 0
    // 从值拿到元素
    console.log(Color2[100])  // green

})()
```

## any

``` typescript
// 基础类型
(()=>{
    // any
    // any 对应任意类型, 在不确定当前是什么类似时使用
    // 因为编译器并不能确定具体的类型, 所以要慎用 any, any 可能会导致错误在运行时才暴露出来
    let str: any = 100
    str = "string"
    str = false

    let arr: any[] = [100, "str", false]
})()
```

## void

``` typescript
// 基础类型
(()=>{
    // void
    // void 一般在函数没有返回值时使用, 标识该函数无返回值
    function show():void{
        console.log("func show")
    }
    show()
    // void 与 undefined 
    // void 类型的变量, 可以接受一个 undefined 的值, 一般不使用
    let vd:void = undefined
})()
```

## object

``` typescript
// 基础类型
(()=>{
    // object
    // object类型
    function getObject(obj:object):object{
        console.log(obj)
        return {
            name: "18",
            age: 19,
        }
    }

    console.log(getObject({
        age: 18,
        name: "text"
    }))
})()
```

## 联合类型/类型断言

``` typescript
// 基础类型
(()=>{
    // 联合类型
    // 类似泛型
    // 联合类型表示取值为多种类型中的某一种

    // 定义函数getStr接收参数 str, 类型为 number 或 string, 返回 string
    function getStr(str:number|string):string{
        return str.toString()  // 将参数转成 string 类型返回
    }
    console.log(getStr(1))
    console.log(getStr("tttt"))

    // 配合类型断言使用
    // 类型断言, 告诉编译器, 这个变量是什么类型
    // (<类型>变量) 则代表告诉编译器, x 是 string 类型
    function getLen(x:number|string):number{
        if ((<string>x).length){   // 只有 string 有.length 方法, 这里如果没有, 则是 number 类型
            return (<string>x).length
        }else{  // number 类型 需要 toString 再输出长度
            return x.toString().length
        }
    }

    // 类型断言的第2种语法
    // 等同于方法1
    function getLen1(x:number|string):number{
        if ((x as string).length){   // 只有 string 有.length 方法, 这里如果没有, 则是 number 类型
            return (x as string).length
        }else{  // number 类型 需要 toString 再输出长度
            return x.toString().length
        }
    }
})()
```

## 类型推断

``` typescript
// 基础类型
(()=>{
    // 类型推断
    // 类型推断, TS 在没有明确的自动类型时推测出一个类型, 编译器自己会进行类型推断, 自动判断出变量的类型
    // 当定义变量且赋值时, 会根据值进行推断类型
    // 当定义变量但是不赋值时, 推断为 any 类型
    let t = 100  // 编译器自己推断成 number
    let a;  // 自己推断成 any
})()
```
