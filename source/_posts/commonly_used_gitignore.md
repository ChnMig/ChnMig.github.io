---
title: 个人常用的gitignore文件模板
date: 2021-09-04            
updated: 2021-09-04         
comments: true              
toc: true                   
excerpt: 每次建项目的时候可以直接复制了,也算是方便自己,以后发现少的会更新
tags:                       
- 架构
categories:                 
- 编程
---

## 作用

git提交时忽略的文件

## 文件名

`.gitignore`

## Python

``` shell
# Byte-compiled / optimized / DLL files
__pycache__/
*.py[cod]
*$py.class

# Distribution / packaging
.Python
env/
build/
dist/
*.log

# pyenv
.python-version

# dotenv
.env

# virtualenv
.venv/
venv/
ENV/

# VSCode settings
.vscode

# IDEA files
.idea

# OSX dir files
.DS_Store

# Sublime Text settings
*.sublime-workspace
*.sublime-project
```

## Go

``` shell
# Build
bulid/
*.exe

# dotenv
.env

# venv
/vendor/

# Log
*.log

# VSCode settings
.vscode

# IDEA files
.idea

# OSX dir files
.DS_Store

# Sublime Text settings
*.sublime-workspace
*.sublime-project

```

