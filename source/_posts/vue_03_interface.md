---
title: Vue3 从入门到入土(TypeScript接口)
date: 2022-04-04            
updated: 2022-04-04        
comments: true              
toc: true                   
excerpt: Vue3入门第三章, 主要是 TS 的内容, 涉及到 TS 接口部分
tags:                       
- Vue
categories:                 
- 编程
---

## 前言

在上一章, 我们就写过简单的接口, 本章更深入的了解接口

接口是对象的状态(属性)和行为(方法)的抽象(描述)

## 接口

以例子来了解, 我们有这样的需求

``` bash
定义一个对象存放用户信息, 有四种属性
- id 是 number 类型, 必须有, 并且只读
- age 是 number 类型, 必须有
- name 是 string 类型, 必须有
- sex 是 string 类型, 可以没有
```

## 可选/只读属性

``` typescript
(()=>{
    // 接口是一种类型/规范/规则/能力/约束

    // 定义一个接口 IUser
    // 接口一般以 I 开头
    interface IUser{
        readonly id: number,  // 在定义时, 指定 readonly 代表这个属性是只读的
        name: string,
        age: number,
        sex?: string,  // 在定义时, 指定 ? 代表这个属性是可为空的, 不指定默认必须存在
    }

    // 定义一个对象
    const u1:IUser={
        id: 1,
        name: "u1",
        age: 18,
    }
    const u2:IUser={
        id: 2,
        name: "u2",
        age: 19,
        sex: "男",
    }
    // u2.id = 3  // 在实例化后, 无法对只读属性进行重新赋值
})()
```

## 函数类型

上面的接口都是作为对象使用, 其实他也可以作为函数的类型使用

``` typescript
(()=>{
    // 接口是一种类型/规范/规则/能力/约束

    // 定义一个接口 SearchFunc, 作为函数约束使用
    interface SearchFunc{
            // 传入两个参数, 都是字符串, 返回 bool
            (source: string, subString: string): boolean
    }

    // 定义一个函数, mySearch, 遵守接口 SearchFunc 
    const mySearch: SearchFunc = function(source: string, sub: string): boolean{
        return source.search(sub) > -1
    }
    console.log(mySearch("abcd", "bc"))
})()
```

## 类实现接口

``` typescript
(()=>{
    // 接口是一种类型/规范/规则/能力/约束

    // 一个类可以实现多个接口
    // 一个接口可以继承多个接口

    // 定义接口 Alarm
    interface Alarm{
        // 实现 alert 方法
        alert(): any;
    }
    // 定义接口 Light
    interface Light{
        // 实现 lightOn 方法
        lightOn(): void;
        // 实现 lightOff 方法
        lightOff(): void;
    }

    // 定义类 Car, 实现接口 Alarm
    // implements 关键字, 指定继承接口 Alarm
    class Car implements Alarm{
        // 继承后必须实现接口定义的方法
        alert() {
            console.log("alert");
        }
    }

    // 定义类 Car1, 实现接口 Alarm 和 Light
    class Car1 implements Alarm, Light{
        // 必须同时实现接口 Alarm 和 Light 的方法
        alert() {
            console.log("alert");
        }
        lightOff(): void {
            console.log("off");
        }
        lightOn(): void {
            console.log("on");
        }
    }
})()
```

## 接口继承接口

``` typescript
(()=>{
    // 接口是一种类型/规范/规则/能力/约束

    // 接口继承接口

    // 定义接口 Alarm
    interface Alarm{
        // 实现 alert 方法
        alert(): any;
    }
    // 定义接口 Light
    interface Light{
        // 实现 lightOn 方法
        lightOn(): void;
        // 实现 lightOff 方法
        lightOff(): void;
    }

    // 接口 LightAlarm 继承 Alarm 和 Light
    interface LightAlarm extends Alarm, Light{
        simple(): void;
    }

    // 定义类 Car1, 实现接口 LightAlarm
    class Car1 implements LightAlarm{
        // 必须同时实现接口 Alarm 和 Light 和 LightAlarm 的方法
        alert() {
            console.log("alert");
        }
        lightOff(): void {
            console.log("off");
        }
        lightOn(): void {
            console.log("on");
        }
        simple(): void{
            console.log("simple")
        }
    }
})()
```





















