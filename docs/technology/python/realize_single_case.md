# 单例的实现

提前祝大家过个好年

最近忙于项目,今天抽出点时间写写Blog

本篇就写Python的单例实现吧, 就拿自带的模块`logging`举例吧

Python的`logging`模块是Python自带的模块,可方便快捷的进行日志的记录

[python doc](https://docs.python.org/3/library/logging.html)

## logging本身就是单例的
该模块本身就是线程安全的,下面的注释摘抄至 doc
> The logging module is intended to be thread-safe without any special work needing to be done by its clients. It achieves this though using threading locks; there is one lock to serialize access to the module’s shared data, and each handler also creates a lock to serialize access to its underlying I/O.
> 
> If you are implementing asynchronous signal handlers using the signal module, you may not be able to use logging from within such handlers. This is because lock implementations in the threading module are not always re-entrant, and so cannot be invoked from such signal handlers.

也就是说你不需要关注多线程的问题,只要 `getLogger()` 时指定当前空间即可

> Loggers have the following attributes and methods. Note that Loggers should NEVER be instantiated directly, but always through the module-level function logging.getLogger(name). Multiple calls to getLogger() with the same name will always return a reference to the same Logger object.
> 
> The name is potentially a period-separated hierarchical value, like foo.bar.baz (though it could also be just plain foo, for example). Loggers that are further down in the hierarchical list are children of loggers higher up in the list. For example, given a logger with a name of foo, loggers with names of foo.bar, foo.bar.baz, and foo.bam are all descendants of foo. The logger name hierarchy is analogous to the Python package hierarchy, and identical to it if you organise your loggers on a per-module basis using the recommended construction logging.getLogger(__name__). That’s because in a module, __name__ is the module’s name in the Python package namespace.

意思是 `logger.getLogger()` 时传入相同的变量,会永远返回同一个对象,比如我在当前进程内的任何地方, 使用 `log = logger.getLogger("work")` 生成的log对象一直是同一个对象,这就是单例模式,官方推荐传入 `__name__` 因为他是Python包命名空间中模块的名称。

使用logging来讲单例纯粹是一时间没想到有啥能举例子的, 我们就先假如他不是单例的吧:grimacing:

## 不写单例的普通类
> 手动写一个单例完全是为了记忆单例模式的使用,只是以 logging 模块举例

先写一个普通的类, 这个类封装了`logging`类, 没有考虑单例问题

``` python
import logging
import threading
from logging import StreamHandler, handlers



class MyLogger:
    # log 日志
    def __init__(self, *args, **kwargs):
        # 接收参数
        self.level = (kwargs["level"] if kwargs.get("level") else "debug")  # 日志等级
        self.format = (kwargs["format"] if kwargs.get(
            "format") else "%(asctime)s % (levelname)-8s[%(filename)s:%(lineno)d(%(funcName)s)] %(message)s")  # 格式化结构
        self.console = (kwargs["console"] if kwargs.get("console") else True)  # 是否输出
        self.file = (kwargs["file"] if kwargs.get("file") else None)  # 保存的文件名
        self.when = (kwargs["when"] if kwargs.get("when") else "D")  # 日志文件按时间切分
        self.backCount = (kwargs["backCount"]
                          if kwargs.get("backCount") else 30)  # 保留日志文件最大数量
        # 日志级别匹配
        self.level_relations = {
            "debug": logging.DEBUG,
            "info": logging.INFO,
            "warning": logging.WARNING,
            "error": logging.ERROR,
            "critical": logging.CRITICAL
        }
        self.logger = logging.getLogger(__name__)
        self.format = logging.Formatter(self.format)
        if not self.level_relations.get(self.level):
            self.level = "debug"
        self.logger.setLevel(self.level_relations[self.level])
        if self.console:
            # 输出
            streamHandler = logging.StreamHandler()
            streamHandler.setFormatter(self.format)
            self.logger.addHandler(streamHandler)
        if self.file:
            # 保存
            timeHandler = handlers.TimedRotatingFileHandler(
                filename=self.file,
                when=self.when,
                backupCount=self.backCount,
                encoding="utf-8"
            )
            timeHandler.setFormatter(self.format)
            self.logger.addHandler(timeHandler)

if __name__ == "__main__":
    def test():
        l = MyLogger(level="debug")
        l.logger.warning("test")
    ts = []
    for i in range(10):
        t = threading.Thread(target=test)
        t.start()
        ts.append(t)
    for t in ts:
        t.join()

```

如果我们同时起多个线程去使用, 可能就会出现意料之外的问题

## 利用 `__new__` 实现单例

我们知道,python实例化时其实是先走 `__new__` 再走 `__init__`

我们可以重写 `__new__` 方法,如果发现已生成对象直接返回该对象

同时为了防止多线程的资源竞争,我们使用线程锁来保证同一时间只有一个线程能访问 `__new__`

``` python
```

