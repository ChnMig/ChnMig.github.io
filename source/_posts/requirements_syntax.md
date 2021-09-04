---
title: requirements 语法
date: 2021-09-04            
updated: 2021-09-04         
comments: true              
toc: true                   
excerpt: 通过语法来赋予 requirements.txt 一定的灵活性
tags:                       
- Python
categories:                 
- 编程
---

# requirements 语法

之前一直苦于一个问题,比如一些包在Win上安装不了,比如 `uvloop` 但是为了提高效率,代码中必须有这个模块
在运行中可以通过 os 模块判断是否使用, 那依赖文件呢? requirements.txt 要不要有 `uvloop` 呢?

其实我们可以通过语法来赋予 requirements.txt 一定的灵活性.

比如,我们使用 `pip freeze > requirements.txt` 时,输出的大致为

``` shell
redis==3.2.1
requests==2.21.0
```

每一行为 `模块名==版本号`, 这其实就是一种语法, 用来标记安装的模块的版本号, 其实他还有很多语法

详见官方文档

[PEP508-doc](https://www.python.org/dev/peps/pep-0508/#environment-markers)

## 根据操作系统确定是否安装依赖


这里抛砖引玉,只写一个例子,就是根据系统OS判断要不要装某个模块

比如 `uvloop`, 不支持 Windows

我们可以这样写

``` shell
uvloop==0.14.0;platform_system=="Linux"
```


这样就是判断当前环境,如果为 `Linux` 就安装 `0.14.0` 的 `uvloop` 模块,如果是其他环境就 忽略

需要注意的是, `Linux` 是表格中写的可选值(详见官方文档的`platform_system`栏)

请严格区分大小写并不要写错,写错不会报错但是识别不了

