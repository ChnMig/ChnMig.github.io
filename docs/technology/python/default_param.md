# 默认参数的坑

在 https://docs.python.org/3/tutorial/controlflow.html#default-argument-values 中,有这样一段话

> **Important warning:** The default value is evaluated only once. This makes a difference when the default is a mutable object such as a list, dictionary, or instances of most classes. For example, the following function accumulates the arguments passed to it on subsequent calls:

大致意思为

> 重要警告：默认值仅计算一次。 当默认值是可变对象（例如列表，字典或大多数类的实例）时，这会有所不同。 例如，以下函数累积在后续调用中传递给它的参数：

下面给出了一个例子

``` python
def f(a, L=[]):
    L.append(a)
    return L

print(f(1))
print(f(2))
print(f(3))
```

打印出来的结果是

``` python
[1]
[1, 2]
[1, 2, 3]
```

这是因为, 作为默认参数, python在启动时就会将变量 L 建立, 我们在函数 f 内对 L 处理就会导致后来调用的 L 已经是修改过的 L 了, 我们可以通过打印 L 的内存地址来验证

``` python
def f(a, L=[]):
    print(id(L))
    L.append(a)
    print(id(L))
    return L

print(f(1))
print(f(2))
print(f(3))
```

结果是

``` python
4513289600
4513289600
[1]
4513289600
4513289600
[1, 2]
4513289600
4513289600
[1, 2, 3]
```

当然, python的文档中也给出了一个推荐的方法

> If you don’t want the default to be shared between subsequent calls, you can write the function like this instead:

``` python
def f(a, L=None):
    if L is None:
        L = []
    L.append(a)
    return L
```

即: 将 L 默认为 None, 当该参数未传时, 将 L 设置为空列表, 在Python启动时 L 会设置为 None, 而当我们调用而不传参数 L 时, 在函数 f 内部重新给 L 赋值, 此时 L 为函数 f 内的一个私有变量, 其不会影响到参数 L 本身, 同样的我们可以通过打印内存地址来验证

``` python
def f(a, L=None):
    print(id(L))
    if L is None:
        L = []
    print(id(L))
    L.append(a)
    return L

print(f(1))
print(f(2))
print(f(3))
```

输出

``` python
4467395776
4469232960
[1]
4467395776
4469232960
[2]
4467395776
4469232960
[3]
```

当然我们也可以在不更改函数 f 的情况下, 在每次调用 f 的时候都传输参数 L, 如果想让他为一个空列表那就传一个空列表同样能解决问题, 因为你每次指定了值, 便会在传入时修改 L 的值

``` python
def f(a, L=[]):
    print(id(L))
    L.append(a)
    print(id(L))
    return L

print(f(1, []))
print(f(2, []))
print(f(3, []))
```

输出

``` python
4474168192
4474168192
[1]
4474168192
4474168192
[2]
4474168192
4474168192
[3]
```