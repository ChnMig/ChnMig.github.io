# 个人常用的gitignore文件模板

> 每次建项目的时候可以直接复制了,也算是方便自己,以后发现少的会更新
>
> 虽说github官方有一个项目 [github/gitignore: A collection of useful .gitignore templates](https://github.com/github/gitignore) 但是使用过程中发现还是少了很多, 里面没有写一些比如开发工具, 系统的相关文件
>

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

