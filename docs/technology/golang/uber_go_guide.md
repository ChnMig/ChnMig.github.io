# uber guide

[uber-go/guide: The Uber Go Style Guide. (github.com)](https://github.com/uber-go/guide) 是uber公司的go代码编写规范, 有很多值得借鉴的地方

``` shell
go version go1.17 linux/amd64
```

## style

这里是代码的编写风格, 目的是让一些问题提早的暴露在编译时, 也有一些是为了提高代码的可扩展性. 可读性

### interface 合理性验证

在代码编译时验证接口的合理性, 通过 var 一个空变量的方式,如果你的接口没有实现好, 在创建变量时就会报错

``` go
```



