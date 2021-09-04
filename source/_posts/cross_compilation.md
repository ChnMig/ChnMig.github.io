---
title: Golang交叉编译
date: 2021-09-04            
updated: 2021-09-04         
comments: true              
toc: true                   
excerpt: 交叉编译指在某个平台编译另一平台能使用的文件
tags:                       
- Golang
categories:                 
- 编程
---

## 前言

什么是交叉编译?

交叉编译指在某个平台编译另一平台能使用的文件

本文列出交叉编译的命令, 全程干货, 不多BB

## 正文

本文参考官方文档

```
https://golang.google.cn/doc/install/source#introduction
https://golang.google.cn/doc/install/source#environment
```

一条基本的编译命令结构如下(mac/linux)

```
GOOS=linux GOARCH=amd64 go build main.go
```

windows版比较特殊(目的一致,只是win加set)

```
set GOOS=linux
set GOARCH=amd64
go build main.go
```

这个命令有两个参数(main.go不做解释了)

GOOS --> GO,OS 生成文件执行的平台

GOPACH --> GO,PACH 平台的架构

以上这条命令就是生成在amd64架构的linux上的可执行文件

注意的是, 如果你是在同等架构和系统上编译,例如在linux上编译linux的文件,则什么都不用带,go会自己判断

GOOS和GOARCH都有多个选项,可组合,对照如下

| `$GOOS`     | `$GOARCH`  |
| ----------- | ---------- |
| `aix`       | `ppc64`    |
| `android`   | `386`      |
| `android`   | `amd64`    |
| `android`   | `arm`      |
| `android`   | `arm64`    |
| `darwin`    | `amd64`    |
| `darwin`    | `arm64`    |
| `dragonfly` | `amd64`    |
| `freebsd`   | `386`      |
| `freebsd`   | `amd64`    |
| `freebsd`   | `arm`      |
| `illumos`   | `amd64`    |
| `js`        | `wasm`     |
| `linux`     | `386`      |
| `linux`     | `amd64`    |
| `linux`     | `arm`      |
| `linux`     | `arm64`    |
| `linux`     | `ppc64`    |
| `linux`     | `ppc64le`  |
| `linux`     | `mips`     |
| `linux`     | `mipsle`   |
| `linux`     | `mips64`   |
| `linux`     | `mips64le` |
| `linux`     | `riscv64`  |
| `linux`     | `s390x`    |
| `netbsd`    | `386`      |
| `netbsd`    | `amd64`    |
| `netbsd`    | `arm`      |
| `openbsd`   | `386`      |
| `openbsd`   | `amd64`    |
| `openbsd`   | `arm`      |
| `openbsd`   | `arm64`    |
| `plan9`     | `386`      |
| `plan9`     | `amd64`    |
| `plan9`     | `arm`      |
| `solaris`   | `amd64`    |
| `windows`   | `386`      |
| `windows`   | `amd64`    |



当然,有些架构编译可能会出现错误,因为对他的支持还不完善,具体请看最上方的官方文档