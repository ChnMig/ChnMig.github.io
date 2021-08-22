# Python -c

python -c 命令还是有用的哈

python的 -c 可以在命令行中调用 python 代码, 实际上 -c 就是 command 的意思

官方文档中解释为(节选自: [python docs](https://docs.python.org/3/using/cmdline.html#cmdoption-c)):

> Execute the Python code in *command*. *command* can be one or more statements separated by newlines, with significant leading whitespace as in normal module code.
>
> If this option is given, the first element of [`sys.argv`](https://docs.python.org/3/library/sys.html#sys.argv) will be `"-c"` and the current directory will be added to the start of [`sys.path`](https://docs.python.org/3/library/sys.html#sys.path) (allowing modules in that directory to be imported as top level modules).
>
> Raises an [auditing event](https://docs.python.org/3/library/sys.html#auditing) `cpython.run_command` with argument `command`.

简单来说, 就是 python -c 可以在命令行中执行 python 代码, 跟把代码放置在 .py 文件中然后运行这个文件比无明显差别, 我们来测试一下

``` python
python -c "print('TTXT')"
```

随后正确输出了 TTXT

需要注意的是, python -c 后必须跟一个字符串, 因此必须带上引号, 而且在要执行的代码中也不要重叠, 这样会引发错误, 这是因为 python 认不出该到哪里结尾, 例如

``` python
python -c "print("TTXT")"
```

这样就会报错, 输出

``` python
Traceback (most recent call last):
  File "<string>", line 1, in <module>
NameError: name 'TTXT' is not defined
```

我们一般可以使用三引号来标示需要执行的代码, 例如

``` python
python -c '''print("TTXT")'''
```

这样还有一个好处就是也可以执行多行的代码, 例如

``` python
python -c '''
import arrow    
print(arrow.now())
'''
```

这样也是可以的, 也可以定义并调用函数

``` python
python -c '''
def a():        
    print(111)
a()
'''
```

当然也是可以导入自定义的模块或者已经安装的包的

## 妙用

那么 -c 有什么妙用呢? 这个要具体问题具体分析, 比如说我在开发中要使用一个第三方包 `patool`, 项目在 [github](https://github.com/wummel/patool), 这个包作用是根据格式解压压缩文件, 但是在调用时发生总是会报找不到 patoollib 模块的错误

官方给的例子如下

``` python
import patoolib
patoolib.extract_archive("archive.zip", outdir="/tmp")
```

排查发现, 该模块的起始文件最上面写定了python的地址, 导致运行时强制指定了python路径而没有使用自己的虚拟环境, 因为 `/usr/bin/python` 没有安装 patool 包所以报错找不到

py文件节选

``` python
#!/usr/bin/python
# -*- coding: utf-8 -*-
# Copyright (C) 2010-2015 Bastian Kleineidam
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
"""
patool [global-options] {extract|list|create|diff|search|formats} [sub-command-options] <command-args>
"""

def main():
    """Parse options and execute commands."""
    try:
        argparser = create_argparser()
        args = argparser.parse_args()
        if args.command is None:
            # Python 3.3.1 under linux allows an empty command somehow
            argparser.error("too few arguments")
        # run subcommand function
        res = globals()["run_%s" % args.command](args)
    except KeyboardInterrupt:
        log_error("aborted")
        res = 1
    except Exception:
        log_internal_error()
        res = 2
    return res


if __name__ == '__main__':
    sys.exit(main())

```

似乎只能将包的源代码修改, 实际上只要把第一行删除即可, 但是考虑到Docker部署, 就没有更好的办法了吗? 使用 python -c 即可完美解决

我们使用 python -c 在命令行中使用我们指定的 python 去执行模块, 就会使py文件中指定的不生效, 所以调用改成如下即可

``` python
code = f"import patoolib; patoolib.extract_archive('{file}', outdir='{unfile}')"
proc = await asyncio.create_subprocess_exec(sys.executable, '-c', code)
await proc.wait()
```

这样就可以完美的解决问题了, 不用修改原来包的代码

