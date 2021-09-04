---
title: 记一次flask框架返回200前端却拿到了504的问题
date: 2021-09-04            
updated: 2021-09-04         
comments: true              
toc: true                   
excerpt: 今天在调试代码时, 发现了一个诡异的问题
tags:                       
- Python
categories:                 
- 编程
---

## 问题

今天在调试代码时, 发现了一个诡异的问题, 我之前写了一个接口, 作用是接收上传的文件, 因为这个接口需要一定的权限控制, 所以我写了3个装饰器在上面, 这个项目是用的 flask, 代码类似于 

```python
@app.route('/upload', methods=['POST'])
@login_requireds
@verify_requireds
@upload_requireds
def upload_file():
  pass
```

每个装饰器代码类似于

```python
def verify_requireds(func):
    # 阻止未审核的账户进行操作
    @functools.wraps(func)
    def inner(*args, **kwargs):
        pass
        if user_dict.get("verify") != 1:
            response_msg = {"status": 300, "msg": "Sorry, Your · account is not audited", "msg_zh": "该账户未审核"}
            return jsonify(response_msg)
        return func(*args, **kwargs)
    return inner

```

而在测试当中, 发现前端的请求一直是 504 错误(浏览器的f12调试显示), 而后端的log显示每次都正常返回了数据

然后就开始了漫长的捉虫

首先通过postman测试发现postman并没有问题, 猜测是不是跨域问题, 我们使用了 flask-cors 来进行跨域设置, 我们是这样设置的

```python
from flask_cors import CORS

CORS(app, support_credentials=True)
```

为了印证该猜想, 我们开启了 flask-cors 的 debug 模式, 

```python
logging.getLogger('flask_cors').level = logging.DEBUG
```

看到了options 请求时, debug 打印

```python
DEBUG Request to '/upload' matches CORS resource '/*'. Using options: {'origins': ['.*'], 'methods': 'DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT', 'allow_headers': ['.*'], 'expose_headers': None, 'supports_credentials': False, 'max_age': None, 'send_wildcard': False, 'automatic_options': True, 'vary_header': True, 'resources': '/*', 'intercept_exceptions': True, 'always_send': True, 'support_credentials': True}
```

所以初步排除了是跨域导致的问题

后来猜测是不是前端的代码问题, 后来前端 debug 调试发现是浏览器就返回了 504 错误, 就算是BUG也很难去通过前端去解决了

后来无意中发现, 其实并不是每次都返回 504, 当文件足够小时(1k左右), 请求都是正常的, 而文件大时, 则有一定几率会返回正常, 发现了这个现象时, 我们开始考虑是不是后端会 “夯住” 或者前端的连接并没有断开而是一直保持呢? 但是确实postman一切ok, 所以是不是请求有些异常, 而框架并没有很好的处理, postman兼容性很好, 忽略了这个错误呢?

我们使用软件在浏览器的客户端进行了抓包, 发现了问题

我们发现, 其实在前端发出请求后, 后端确实返回了200并且已经被读取, 但是后续又向前端发送了 RST 的数据包

搜了一下 RST 的作用, 其实就是代表服务端告诉客户端, 我要断开链接了, 你的还没发送的数据包直接丢掉吧, 可能就是这样的操作让前端框架以为后端断开链接了, 报了 504/502 错误

其实正常情况下, 触发 RST 的情况也只有去访问一个不存在的端口或服务时才会有, 所以前端框架这样统一判断也情有可原, 而且 RST 的滥用也可能引发安全问题 [https://baike.baidu.com/item/RST%E6%94%BB%E5%87%BB](https://baike.baidu.com/item/RST%E6%94%BB%E5%87%BB)

再结合之前发现的, 很小的文件几乎每次都正常, 我们大致找到了原因

因为我们现有的逻辑, 在装饰器执行过程中, 还没有获取 file 文件, 如果装饰器直接拦截, 此时可能 file 还没有完全接收完毕, 此时 flask 会发送 RST 告诉客户端抛弃发送, 而前端就会报错, 而小文件发送特别快, 不存在数据未发送完成的情况, 所以小文件是 ok 的

所以解决办法就非常简单了, 在装饰器前再加一个装饰器, 这个装饰器的作用是获取 file 文件, 顺便做一下如果没有 file 文件返回一个错误, 确保在服务端返回之前已经完全接收到了 file 文件即可.

我们增加一个 file 装饰器

``` python
def file_requireds(func):
    # 对文件进行校验
    @functools.wraps(func)
    def inner(*args, **kwargs):
        files = request.files.get('file')
        if not files:
            return jsonify({"status": 300, "msg": "not find file", "msg_zh": "没有文件"})
        return func(*args, **kwargs)
    return inner
```

加入到接口的装饰器大军中

``` python
@app.route('/upload', methods=['POST'])
@file_requireds
@login_requireds
@verify_requireds
@upload_requireds
def upload_file():
```

再测试就完全可以了, 抓包也一切正常了

此例警醒我以后接受文件相关的接口一定要将文件全部获取到再进行操作, 或者是前端考虑解决办法

