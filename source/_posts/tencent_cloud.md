---
title: 折腾腾讯云服务器
date: 2021-11-11            
updated: 2021-11-11         
comments: true              
toc: true                   
excerpt: 最近双11, 腾讯云的活动也很重磅, 最重要的是老用户也可以使用, 就顺手整个了云服务器, 随便折腾一哈
tags:                       
- Linux
- Golang
- Python
- Rust
categories:                 
- 编程
---

## 前言

最近真的很忙, 生活上买的房子要网签, 办贷款拉流水啥的. 工作上老板觉得工作量不够又开始995, 同时工作量也多很多, 只能周末写写博客了, 真是蚌埠住了 :sweat_smile:

双11的时候啥都在做活动, 各大云厂商也是, 但是阿里的属于是 “老用户与狗不能入内”, 相比之下腾讯就很良心了, 不到200块钱买了3年的2核4G的轻量应用服务器, 香香香 :heart_eyes: 

## 升级系统到Debian11

购买完就是折腾了, 因为平时打 Docker 都是用 Debian, 所以当然是用它了. 但是预装的只有 10.2, 有点老了, 所以ssh登录之后的第一件事, 当然是更新系统了

将 Debian10.2 升级到最新的稳定版 Debian11, 因为在国内, 所以去找了一下腾讯云自己的镜像, 结果发现没有11, 我果然还是喜欢 USTC

首先升级 10.2 到 10 的最新版

``` bash
apt update && apt upgrade -y
```

再替换仓库地址到 USTC 的 11

``` bash
vim /etc/apt/sources.list
```

将原有的地址注释掉 (在前面加 `#` ), 然后粘贴新的仓库地址

``` bash
deb https://mirrors.ustc.edu.cn/debian/ bullseye main contrib non-free
deb-src https://mirrors.ustc.edu.cn/debian/ bullseye main contrib non-free

deb https://mirrors.ustc.edu.cn/debian/ bullseye-updates main contrib non-free
deb-src https://mirrors.ustc.edu.cn/debian/ bullseye-updates main contrib non-free

deb https://mirrors.ustc.edu.cn/debian/ bullseye-backports main contrib non-free
deb-src https://mirrors.ustc.edu.cn/debian/ bullseye-backports main contrib non-free

deb https://mirrors.ustc.edu.cn/debian-security/ bullseye-security main contrib non-free
deb-src https://mirrors.ustc.edu.cn/debian-security/ bullseye-security main contrib non-free
```

然后按 `ESC` `:wq` 保存

保存后更新系统和软件

``` bash
apt update && apt full-upgrade
```

提示是否升级, 输入 `Y` 确认

升级过程其实不慢, 可能是因为屏幕滚动的很快, 有黑客帝国的感觉

之后apt会输出要更新的软件包, 此时输入  `q`  选择跳过

之后会出现几个选择界面, 大致上是问你需不需要更新例如ssh配置文件等到最新的版本等, 提供的默认选项也可以使用, 我们使用 `回车键` 确认即可, 但是因为我的服务器本身就是刚开的, 所以我每次会使用`方向键`来选择第一个选项 覆盖

当更新完成后, 我们需要删除更新留下的残留信息

``` bash
apt --purge autoremove
```

``` bash
apt autoclean
```

这样就大体完成了, 我需要进行最后的重启

``` bash
reboot
```

## 升级系统到Debian Testing

升级到 Debian 11 后, 我又纠结到了软件版本里, 因为我的目的是把这个服务器当作开发测试使用, 所以我需要更新的软件版本, Debian 11 的 Golang 才 1.13 , 现在正常的最新已经是 1.17.2

当然, 更新到 Testing 的前提是先更新到最新的 stable, 现在也就是 11

与升级到 11 差不多, 步骤是一样的, 只是仓库的链接更新到 Testing, 当然还是 USTC

``` bash
vim /etc/apt/sources.list
```

内容为

``` bash
deb https://mirrors.ustc.edu.cn/debian/ bookworm main contrib non-free
deb-src https://mirrors.ustc.edu.cn/debian/ bookworm main contrib non-free

deb https://mirrors.ustc.edu.cn/debian/ bookworm-updates main contrib non-free
deb-src https://mirrors.ustc.edu.cn/debian/ bookworm-updates main contrib non-free

deb https://mirrors.ustc.edu.cn/debian-security/ bookworm-security main contrib non-free
deb-src https://mirrors.ustc.edu.cn/debian-security/ bookworm-security main contrib non-free
```

剩下的步骤与上面的一致, 不多赘述了

## 安装相关的开发环境

### python3

``` bash
apt install -y python3
```

``` bash
apt install -y python3-pip
```

果然 Testing 版本的 python 是 3.9.8, 比稳定版高. 而且他的更新也是很快的

### golang

``` bash
apt install golang
```

此时的 golang 版本是 1.17.1 , 相信很快会更新出 1.17.2

### rust

rust不是通过 apt 进行安装, 而是根据 rust 官网的指导

[安装 Rust - Rust 程序设计语言 (rust-lang.org)](https://www.rust-lang.org/zh-CN/tools/install)

执行命令

``` bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

令人高兴的是, 这个脚本需要下载的资源在国内也有速度, 大概 300kb 左右

以后更新 rust 使用命令

``` bash
rustup update
```



