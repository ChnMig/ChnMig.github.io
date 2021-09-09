---
title: Dramatiq遇到的坑
date: 2021-09-09            
updated: 2021-09-09         
comments: true              
toc: true                   
excerpt: 有一个项目涉及到一些简单的任务调度, 然后使用了dramatiq框架进行任务的调度处理, 没想到遇到了很多坑...
tags:                       
- Python
categories:                 
- 编程
---

## Dramatiq

[Bogdanp/dramatiq: A fast and reliable background task processing library for Python 3. (github.com)](https://github.com/Bogdanp/dramatiq)

是一个Python3的任务队列框架, 比较轻量化, 使用`RabbitMQ`或`Redis`作为存储介质, 当时看有2.xk的start就使用了, 结果在使用中发现了几个问题, 这里记录一下.

## 任务"不发送"

测试时, 发现总有些任务会遗留在管道中, work好像不接收, 也没有执行, 当重启work后就立刻接受了. 

当时使用的存储介质是`redis`, 查看了源代码后发现问题

因为`redis`本身没有`ack`机制, `dramatiq`就自己实现了`ACK`, 在接受到任务后, 执行任务, **执行完成后**放入到另一个`xx.ack`管道中同时**删除**原有管道的这一条数据.(消费者端实现`ACK`)

那么问题就出现了, 首先, 如果一个任务运行需要1小时, 那么在这1小时中, 查看`redis`会发现一直在原有管道中, 不知道是否是正在执行.

另外, 如果在这个任务执行中, 因为某些原因导致当前进程崩溃了, 如果没有来得及将中断的任务重新放入管道中(`dramatiq`虽然有处理措施, 但是毕竟是`Python`的多进程方式, 并不是很能保证可靠性), 就会造成这个任务"丢失"

最后决定更换**存储介质**为`RabbitMQ`, `Dramatiq`在使用`RabbitMQ`作为`broker`时使用的是`RabbitMQ`自带的`ACK`机制, 更加的成熟

## ACK错误

客户端报错

``` bash
Consumer encountered a connection error: (406, 'PRECONDITION_FAILED - delivery acknowledgement on channel 1 timed out......
```

更换为`RabbitMQ`之后, 发现消费者会报`ACK错误`, 在`RabbitMQ`中体现为生产者获取了任务后没有返回`ACK`, 在超时后被`RabbitMQ`重新放回任务队列

在上一次排查问题的过程中, 我发现消费者需要等待代码执行完毕后再`ACK`, 这本身也是没有问题的, 我搭配`Dramatiq`自身的超时来设置`RabbitMQ`的`ACK`超时, 比如这个任务可能会执行2小时, 我设置`Dramatiq`的超时为2.5小时, 设置`RabbitMQ`的超时为3小时, 这样让程序能自己处理, 但是还是出现问题

后来查看源代码时, 发现, `Dramatiq`有一个功能是`预读`, 即每次**提前获取**n个任务, 放在内存中, 当某一个任务完成后直接从内存中获取新任务, 省去网络io. 那这样就会出现问题, 因为在获取到任务后, `RabbitMQ`就会认为该任务处于`等待ACK`的状态, 如果每个任务需要1小时, `Dramatiq`获取了两个任务, 那么第二个任务就会超时, 当第二个任务执行完成后, `Dramatiq`进行`ACK`时就会被`RabbitMQ`拦截

看了代码后发现这个预读的数量参数可调, 从环境变量中获取, 我们设置

``` bash
export dramatiq_queue_prefetch=1
```

让他只获取一个然后立刻执行这一个即可

## 心跳超时

修复了`ACK`之后, 又发现了一个问题, 隔一段时间`RabbitMQ`就会有错误输出

``` bash
[erro] <0.2398.0> missed heartbeats from client, timeout: 60s
```

这代表的是客户端的心跳出现了问题, 当心跳超时后, `RabbitMQ`会主动断开与这个客户端的连接

查看项目的日志, 没有发现有任何错误或者警告输出

之前两个问题都是消费者的错误, 于是先排查的消费者, 发现消费者有心跳的维持且正常运行了

又回来看生产者的源代码, 发现**`Dramatiq`根本没有实现生产者的心跳**, 但是因为每次生产者发送任务时, 发送任务的代码写的是死循环, 连接被`RabbitMQ`断开后,或者因为别的原因没有被发送, 就再次生成新的连接, 再次发送, 而当发送失败时, 只打了一个`Debug`档的日志, 可能作者也知道这个问题, 然后就粗暴的使用捕捉错误然后重新建立连接的方式去做了:sweat_smile:

如果要解决, 可以设置心跳为0来去除心跳检测, url连接支持这个参数, 比如

``` bash
amqp://worker:BEQFRAmC5@127.0.0.1:5672?heartbeat=0
```

## 创建broker失效

我们是将`FastApi`与`Dramatiq`结合使用, 当接受到请求后做处理, 然后通过`Dramatiq`发送出去

为了更好的代码结构, 我们将代码整合了一下, 结果会出现连接不到`RabbitMQ`的问题

`Dramatiq`的使用一般是

``` python
import dramatiq

@dramatiq.actor(max_retries=0, queue_name="test", actor_name="test")
def scan(work):
  pass
```

建立如上的scan函数, 主要是加入装饰器`dramatiq.actor`

调用时是

``` python
from . import work
worker.iot.scan.send(send_info)
```

设置broker是

``` python
import dramatiq

rabbitmq_broker = RabbitmqBroker(url=RABBITMQ_URL)
rabbitmq_broker.add_middleware(ConfigMiddleware())
dramatiq.set_broker(rabbitmq_broker)
```

改动主要是将设置broker的部分放置进了`fastapi`的启动事件, 原先是放置进了`work`文件夹的`__init__.py`里

刚开始以为是不是broker的设置比较晚了, 导致broker没有正常生效

后来发现在`Dramatiq`中broker是一个Golobal变量, 测试也发现即使在后面`set_broker`也可以

继续深入, 发现问题所在了

因为`dramatiq.actor`是作为装饰器使用, 而`Python`的装饰器内的代码, 实际上在导入时会执行, 举个例子

``` python
registry = []

def register(func):
    print('running register(%s)' % func)
    registry.append(func)
    return func

@register
def f1():
    print('running f1()')

@register
def f2():
    print('running f2()')

def f3():
    print('running f3()')

def main():
    print('running main()')
    print('registry ->', registry)
    f1()
    f2()
    f3()

if __name__ == '__main__':
    main()
```

打印结果为

``` python
running register(<function f1 at 0x0000027913AA8708>)
running register(<function f2 at 0x0000027913AA8E58>)
running main()
registry -> [<function f1 at 0x0000027913AA8708>, <function f2 at 0x0000027913AA8E58>]
running f1()
running f2()
running f3()
```

没错, 假如有个装饰器函数 a, 将函数 b 包裹在 a 中, 也就是 

``` python
def a():
  pass

@a
def b():
  pass
```

在Python导入到这个代码时, 会将被 a 包裹的 b 变成 `a(b)`, 会执行函数 a, 生成一个新的函数 `a(b)`, 然后每次调用 b 时, 实际上在调用这个新的函数

而`Dramatiq`中, 在装饰器 `dramatiq.actor` 中的代码进行了初始化操作, 此时就将全局的`broker`生成了客户端供自己使用, 此时的全局`broker`还没有人为的设置, 变成了默认的`127.0.0.1`的`RabbitMQ`, 而后运行`send`时直接使用此客户端发送, 因为我们在修改代码后, 将创建`broker`的部分放置在了引用`work`之后, 导致了先生成了客户端, 而后来的自定义`broker`没有正确的被`actor`使用, 使用的是本地的`RabbitMQ`, 因为本地没有, 理所当然的就发送失败了

解决方法是排查项目的运行顺序, 在导入`work`之前先进行`set_broker`操作, 在`work`的`__init__.py`中

``` python
from app.task.broker import setup_broker; setup_broker()    # noqa
from . import xx
```

当导入包时运行`__init__.py`, 优先`set_broker`

