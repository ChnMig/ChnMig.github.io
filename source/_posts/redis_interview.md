---
title: Redis 常问知识点(简略)
date: 2022-02-04       
updated: 2022-02-04       
comments: true              
toc: true                   
excerpt: 记录一下面试常问的知识点吧
tags:                       
- DB
categories:                 
- 编程
---

## `redis`的数据类型

### 字符串(string)

`string`是`redis`最基本的类型, 一个`key`对应一个`value`, `string`可以包含任何数据, 甚至是序列化的对象也可以, 一个`value`最大容量为512MB

### 哈希(Hash)

`Hash`是一个键值对的集合, 类似于后端语言的字典, 是一个`string`类型的`field`和`value`的映射表, 很适合用来存储对象

### 列表(List)

`list`是一个简单的字符串列表, 里面的元素是有序的, 在添加新元素的时候可以选择添加到列表的头部或尾部, 每个列表的数据长度最多为40多亿

### 集合(Set)

`Set`是`string`类型的**无序**集合, 一个`key`对应多个`string`的`value`, 因为是通过哈希表实现的, 所以对集合的操作, 复杂度都是`O(1)`

### 有序集合(ZSet)

与普通的`Set`不同的是, `ZSet`的`value`是有序的. 在`ZSet`中, `value`还有一个`score`字段, 排序时按照`score`从小到大排序

## `Redis`的过期失效机制

`Redis`在设置任何数据类型时, 都可以设置过期时间, 为`-1`是永不过期, 以秒为单位

`Redis`使用两种策略来删除过期的数据:

### 惰性清除

在访问`key`时, 如果`key`已经过期了, 将`key`删除

### 定时清理

`Redis`内部存在一个定时任务, 默认 25ms 执行一次. 每次清理都会遍历所有 db, 从每个 db 中随机取20个 `key`, 如果过期就删除`key`, 如果其中有5个 key 过期, 就继续对这个 db 剩下的 key 清理, 否则清理下一个 db.

## `Redis`数据淘汰

如果执行写入命令时, 发现内存不够, 就会按照配置好的淘汰策略清理内存, 淘汰策略分为以下几种:

### noeviction

不删除, 如果内存不够了, 直接返回写入错误

### allkeys-lru

在所有`key`中, 优先删除最少使用(访问)的`key`(lru 算法)

### allkeys-random

在所有`key`中, 随机删除一部分`key`

### volatile-lru

在所有设置了过期时间的`key`中, 优先删除最少使用的`key`(lru 算法)

### volatile-random

在所有设置了过期时间的`key`中, 随机删除一部分`key`

### volatile-ttl

在所有设置了过期时间的`key`中, 优先删除剩余时间短的`key`

### volatile-lfu

在所有设置了过期时间的`key`中, 优先删除最少使用(访问)的`key`(lfu 算法)

### allkeys-lfu

在所有`key`中, 优先删除最少使用(访问)的`key`(lfu 算法)

### lru 算法

lru 算法是最开始的淘汰算法, lru 认为, 如果一个数据近期没有访问, 那么之后一段时间也不会访问

### lfu 算法

lfu 算法在`Redis4.0`之后推出, lfu 认为, 一个数据在一段时间内被访问的次数越多, 之后被访问的概率越大.

## `Redis`持久化方案

### `RDB`

把数据按照快照的形式保存在磁盘中, 达到触发条件时, 生成一个快照, 然后替换原有的持久化文件

每次进行`save`时, 会阻塞`Redis`的主线程, 向硬盘中写数据会造成一定的 I/O 压力

### `AOF`

每次有新的数据操作, 就把新的数据持久化

每次对数据进行操作, 会将操作记录写入到`aof_buf`缓冲区的末尾, `Redis`每隔一段时间(默认是1s), 会将`aof_buf`缓冲区里的数据写入和保存到`aof`文件中. 

将缓冲区的数据同步到磁盘时会有 I/O 压力, 而且写入的频率比`RDB`高很多, 同步过程中可能会造成 2s 的阻塞

防止`AOF`文件越来越大, 可以执行`BGREWRITEAOF`命令, 生成新的`AOF`文件, 新的修改记录会写进新的`AOF`文件

### 两者之间的区别

> 推荐使用 AOF 作为持久化

- aof 比 rdb 更新的频率更高
- aof 比 rdb 更安全, 但是更大
- rdb 的性能比 aof 好

### `RDB`和`AOF`混合

4.0新增的混合持久化方式, 在`AOF`文件中, 前半段是`RDB`格式, 后半段是`AOF`格式

结合了`RDB`和`AOF`的优点, 速度更快, 同时增量更新的数据通过`AOF`的方式保存, 减少可能的数据丢失

但是与4.0之前的版本不兼容, 同时阅读性差

### 持久化选择

必须要强调的是, 在不需要考虑数据丢失的情况下, 不需要考虑持久化.

单机情况下, 如果可以接收十几分钟的`Redis`不可用, 可以直接选择`RDB`持久化, 对性能的影响更小, 如果对数据丢失的容忍度不高, 只能选择`AOF`

如果你使用的是多节点部署, 最好还是开启持久化, 防止节点都出现故障时, 重新拉起后没有数据. 多节点可以选择将主节点不开启持久化, 从服务器开启`AOF`持久化, 并定时备份`AOF`文件.

## `Redis`当做缓存系统

 `Redis`常被当做缓存使用, 将一些数据缓存在 Redis 中, 不用每次都访问数据库, 减少压力, 同时`Redis`自带的数据过期机制, 可以方便的维护缓存

### 缓存的常见使用方式

> 这里跟具体的业务有关

**等待缓存自己过期**

在用户请求某个数据时, 优先从`Redis`中查询是否存在这个数据, 如果存在直接返回, 如果不存在就从数据库中获取数据并录入到`Redis`中, 当数据库中的数据更新时, 不对`redis`中的老数据缓存进行处理, 等待缓存自己过期后再从数据库中拉取新的数据

优点: 不必关注缓存过期策略, 开发成本低, 管理成本低, 出 BUG 概率低

缺点: 完全依赖过期时间, 时间短容易造成缓存频繁失效, 时间长容易造成数据更新后老的缓存存在时间长

**主动删除缓存**

在用户请求某个数据时, 优先从`Redis`中查询是否存在这个数据, 如果存在直接返回, 如果不存在就从数据库中获取数据并录入到`Redis`中, 当数据库中的数据更新时, 删除`redis`里的缓存数据, 等待下次查询时, 走未命中缓存的流程

优点: 错误缓存的存在时间短, 只增加了更新数据时的删除缓存逻辑

缺点: 后端需要同时连接数据库和`Redis`, 损耗双倍的连接资源

**主动更新缓存**

在用户请求某个数据时, 优先从`Redis`中查询是否存在这个数据, 如果存在直接返回, 如果不存在就从数据库中获取数据并录入到`Redis`中, 当数据库中的数据更新时, 主动将`Redis`中的缓存更新为最新数据, 同时重置过期时间

为了保证速度和效率, 更新缓存这一步使用消费者来做, 将需要更新的数据推入消息队列, 由消费者来接收处理数据

优点: 使用消息队列, 降低代码的耦合性, 旧缓存存在时间很短

缺点: 如果多后端同时修改同一个缓存, 可能因为网络传输问题, 导致先后顺序错误, 未将数据修改为正确的最终结果, 同时引入了消息队列, 增加成本

**订阅日志来修改缓存**

假如数据库是`MySQL`, 可以通过订阅`MySQL`的`binlog`日志, 通过解析日志来获取数据, 同步到缓存中

优点: 完全解耦, 延迟低, 可靠性强

缺点: 开发成本高, 同步服务出现问题时`Redis`的缓存完全不可信

> 一般的方案一比较适用, 因为其开发快, Bug 少, 适合对缓存延迟没有特别要求的业务

### 缓存穿透

缓存穿透指的是用户想要获取一个一定不存在的数据, 因为缓存是在没有命中时才写入, 导致不存在的数据每次请求都需要落到数据库中, 如果流量很大有可能拖垮数据库

**解决方法**

如果某个数据查询不到, 比如查询`name`为`s1`的信息, 查询不到时, 将查询不到的标识也记录进缓存中, 设置较短的过期时间, 当第二次查询时, 直接命中缓存, 返回不存在

### 缓存血崩

缓存血崩指的是在设置缓存是设置了相同的过期时间, 导致缓存在某一时刻全部过期失效, 全部查询进数据库, 导致数据库压力瞬间增大

**解决**

在写入缓存时设置时间段内随机的过期时间, 例如20-30分钟的随机值过期

### 缓存击穿

在某个缓存刚好过期的时候, 有大量的请求并行获取这条数据, 因为缓存刚刚失效, 新的缓存还没落入, 导致都访问数据库查询数据, 数据库压力瞬间增大

**解决**

在缓存失效时, 在`redis`中留下标识位, 标志这个数据正在从数据库获取数据中, 当有新的请求获取这条数据时, 如果找到了这个标识位, 代表有其他的连接正在获取数据, 等待一段时间后直接从`redis`中重新获取数据, 而不从数据库中获取

可以使用`redis`的`SETNX`来插入标识位, `SETNX`只有`key`不存在时才创建(返回1), 存在则返回已经存在, 可以使用`SETNX`来判断当前有没有连接正在更新缓存

### 热 key 问题

**什么是热 key**

类似于微博热搜榜, 知乎热搜榜这些, 访问频率很高的 key 就成为热点 key, 当请求热点 key 时, 由于请求量很大, 可能会导致缓存服务宕机

**危害**

 热 key 会让流量集中, 如果达到了硬件上限, 比如网卡满了, 会导致其他 key 访问出现堵塞, 甚至有可能直接将缓存服务或者这个节点失效, 如果是分片存储缓存, 则可能导致整个片缓存丢失, 其他片没有此数据, 同样的也可能导致缓存击穿, 引起业务崩溃

**如何找到热 key**

- 根据业务判断, 比如 热搜榜/ 推荐商品/ 热评 等在设计时就应该考虑到可能出现热 key 问题
- 客户端进行埋点收集统计后上报
- 服务有代理层的话可以在代理层进行收集和分析

**如何解决**

- 如果是分片, 增加分片副本, 分担读取流量
- 对热 key 进行备份, 读取时随机访问其中的一个副本
- 在客户端使用本地缓存, 只在本地缓存过期或者不存在或者用户主动点击刷新才请求缓存服务器

### 为什么不使用`Memcached`作为缓存框架

- `Memcached`又大又重, 没有特别必要不使用
- `Redis`速度更快

### 为什么不使用语言自带的数据结构作为缓存

- 多个后端无法进行数据共享
- 申请的内存有限
- 无法持久化
- 无法分布式
- 无法单独部署

### 缓存预热

在系统启动时, 将常用的数据主动写入到缓存中, 避免第一次请求时从数据库获取

**方式**

- 数据量不大时在工程启动时进行加载缓存
- 数据量大时, 通过执行定时脚本进行缓存刷新
- 数据量特大时, 优先保证热 key 加载到缓存

### 缓存降级

指的是在缓存失效或者缓存服务器直接挂掉的时候, 不去访问数据库, 直接返回默认数据. 降级服务一般是有损的, 使用时代表着问题出现了

## RESP

`RESP`是 `Redis`的序列化协议, 仅用作`Redis`的客户端与服务端进行通讯

`RESP`的优点是: 实现简单, 解析快速, 可读性强

`RESP`可以序列化不同的数据类型, 比如: 整形, 字符串, 数组等等, 并且专门为错误提供了类型

`RESP`是二进制安全协议, 在处理批量数据时, 也不用逐条单独的进行处理, 在批量传输数据时, 有参数标识了数据长度

`RESP`支持五中数据类型:

- 字符串: 以`+`开头
- 错误: 以`-`开头
- 整形: 以`:`开头
- 批量字符串: 以`$`开头
- 数组: 以`*`开头

## 架构模式

### 单机

> 单机部署在单个机器上

优点: 方便快速简单省资源

缺点: 内存容量和处理能力有限, 没办法高可用

### 主从复制

> 使用自带的主从复制功能, 将某个节点设置为主, 其他为从, `redis`将主中的数据复制到若干从节点中, 每次更新也是, 前提是能够连接

优点: 读(从)写(主)分离, 分散`Redis`压力

缺点: 无法保证高可用, 写数据的压力依旧全在主节点

### 哨兵

[Redis Sentinel Documentation – Redis](https://redis.io/topics/sentinel)

> 哨兵模式也是主从模式, 只是有至少三个哨兵节点, 会不断的检查各个节点是否在正常运转, 当节点错误时, 如果是从节点则自动剔除, 主节点则进行故障转移, 如果是主节点下线, 则从剩下的从节点中选取一个节点成为主节点, 同时还会向指定的 API 向其他程序发送错误通知

优点: 高可用, 自动监控各个节点并进行故障转移

缺点: 主从模式, 当主节点出现问题时, 故障转移需要一定时间, 还有可能会丢弃数据, 而且没有解决主节点的压力

### 集群

> `Redis-cluster`无中心结构, 其中的节点与其他节点数据共享, 每个节点都保存了数据和整个集群的状态, 每个节点都和其他节点连接

优点: 无中心结构, 节点间数据共享, 可动态新增和删除节点, 其中一个节点下线不影响其他节点

缺点: 数据隔离性差, 容易相互影响, 数据通过异步进行复制, 不保证数据强一致性

## CAP

### C(一致性)

分布式系统中的所有数据, 在某一时刻是否等同于同样的值

### A(可用性)

一部分节点故障后, 集群整体是否还能响应客户端的读写请求

### P(分区容错性)

如果系统不能在指定的时限内达到数据的一致性, 就意味着发生了分区的问题, 此时需要在一致性和可用性之间做出选择

## 悲观锁和乐观锁

### 悲观锁

获取数据时都认为别人会修改这个数据, 所以在每次拿到数据的时候都会上锁, 别人拿到锁之前无法拿到数据

### 乐观锁

获取数据时都认为别人不会修改这个数据, 不会上锁, 但是在数据更新之前, 去数据库中查看别人有没有更新这个数据, 可以使用版本号来做, 比如`Redis`中的`INCR`命令

### 两种锁的选型

不能说哪个锁是绝对好的, 两者之间各有优缺, 具体还是需要看业务:

乐观锁适用于写很少的情况下, 冲突真的很少发送时, 不加锁可以省去加锁解锁的时间, 提高效率

当你在设计的过程中, 就意识到可能会发生数据的冲突, 那么就需要使用悲观锁来保证数据的正确性

## 为什么`Redis`是单线程

> `Redis`6.0修改为多线程处理, 之前都是单线程
>
> `Redis`6.0也只是处理网络数据和协议解析使用了多线程, 执行命令依旧是单线程

`Redis`是基于内存的操作, 因此`CPU`不是瓶颈, 其瓶颈更多是内存大小和网络带宽, 而使用多线程会提高`Redis`开发难度, 可能带来更多 BUG

`Redis`6.0将网络数据处理修改为了多线程, 提高了网络处理的效率, 充分利用 CPU 资源, 分摊 I/O 任务, 效率基本上翻倍

**优点**

使用单线程编写`Redis`, 会使得代码变得清晰, 减少 BUG, 提高可读性, 也无需考虑数据的加锁问题, 提高性能, 也不存在线程或者进程切换带来的性能损耗

**缺点**

无法充分的发挥多核机器的优势

## `Redis`为什么快

- 完全基于内存, 数据全部存储在内存中(不开启持久化), 没有磁盘 I/O
- 单线程模型, 没有上下文切换的开销, 不用加锁, 没有性能消耗

## `Redis`主从同步实现

### 新节点

当一个新节点上线后, 如果是从节点, 会从主节点拉取全量数据, 进行全量同步

### 旧节点上线

节点将之前的最后一次同步的 id 和偏移量发送到主节点, 主节点进判断并将需要同步的数据推送到节点中

- 如果 id 与当前主节点最新的 id 不一致, 就会进行全量同步
- 如果 id 与当前主节点最新的 id 一致, 就会进行部分同步

### 全量同步

主节点重新生成一个`RDB`数据快照文件, 发送给节点, 节点解析`RDB`文件, 并将数据载入到节点中, 同时, 在同步过程中, 如果有新的操作, 也会由主节点记录后发送给节点

### 部分同步

根据偏移量, 主节点获取最后几次操作日志, 发送给节点

### 命令传播

在同步完成后, 就进入到了命令传播阶段. 当主节点有新的数据修改时, 异步的发送给其他节点

## 哨兵的实现故障转移

### 检测节点下线

每隔一段时间(默认2s), 哨兵节点会给主节点发送`PING`命令, 如果一段时间内没有收到回复, 哨兵就认为主节点客观下线

然后, 哨兵节点会向其他哨兵节点发送命令, 获取其他哨兵内这个节点的状态, 当其他哨兵也认为该节点下线到达一定数量后, 就确认确实客观下线了

### 哨兵选举

主节点客观下线后, 多个哨兵之间互相通信, 选举出一个领导者哨兵, 这个领导者哨兵对主节点进行故障转移

选举使用`Raft`算法, 就是最先检测到主节点下线的哨兵节点, 向其他哨兵节点发送申请成为领导者的命令, 如果其他哨兵没有同意过其他哨兵的申请, 就同意本次申请, 当同意的票数过半, 就成为领导者哨兵, 否则由另外的哨兵节点重新申请, 一般情况下, 第一次选举就会成功, 变成领导者

### 故障转移

领导者哨兵从节点中按照规则选出一个节点作为主节点, 筛选的规则是:

- 排除不健康的节点(下线的/断线的/最近5s 内没有回复哨兵`INFO`命令的/与旧的主节点断开时间长的)
- 根据优先级, 复制偏移量, 来选择一个从节点为主节点

然后向这个从节点发送升级命令, 让从节点变成主节点, 老的主节点更新为新的主节点的从节点

## `Redis`的常用使用场景

- 缓存系统, 存储数据
- 排行榜系统, 使用有序集合
- 计数器系统, 比如 浏览量, 播放量, 在线人数
- 分布式锁, 多个后端使用同一个资源时, 加锁防止竞争
- 消息系统, 消息队列也提供了`Redis`作为中间件使用

## `Lua`在`Redis`中的使用

### 什么是`Lua`

[The Programming Language Lua](https://www.lua.org/)

`Lua`是个脚本语言, 使用`C`语言编写, 目的是为了嵌入各种应用程序中, 为应用程序提供灵活的扩展定制功能

### 为什么使用`Lua`

- 减少网络开销: 对于客户端来讲, 可以将多个操作放置进一个脚本中执行, 只需要一次网络通信
- 原子操作: 脚本中通常有多步操作, `Redis`会将脚本作为一个整体执行, 中间不会插入其他命令, 避免资源竞争
- 可复用: 脚本可永远存在`Redis`中, 其他不同语言的客户端都可以复用这个脚本
- 方便: `Redis`的`2.6`之后就默认集成了`lua`环境, 无需引入插件或者修改配置文件等方式开启

### `lua`的普遍用法

1. 将脚本写进`xx.lua`中, 或者以变量的方式写在代码中
2. 使用`SCRIPT LOAD`将脚本 load 进脚本缓存中, `Redis`返回这个脚本的`sha1`校验和
3. 使用`EVALSHA sha1 numkeys key [key ...] arg [arg ...]` 调用函数

### `lua`的参数

`lua`可以通过传参的方式来进行变量的输入,`EVALSHA sha1 numkeys key [key ...] arg [arg ...] `分为几部分:

`sha1`字段为load 时返回的校验和

 `numkeys`指`key`的数量, 比如`EVALSHA 5332031c6b470dc5a0dd9b4bf2030dea6d65de91  1 test  500 100` , 此时`key`有1个为`test`, `arg`有两个为`500` 和`100`

在脚本中, 通过 `KEYS[1]`, `KEYS[2]`等等来按位置获取参数`key`, 通过`ARGV[1]`, `ARGV[2]`等等来按位置获取参数`arg`

### 哨兵模式中`lua`的执行逻辑

1. 在 load 脚本时, 会将脚本存储在每个节点
2. 在调用脚本时, 会调用当前节点的脚本

`redis`规定, 在运行`lua`脚本时, 必须不能在代码中含有随机性质的代码, 例如生成随机数, 目的是防止在节点 a 执行脚本结果与节点 b 执行结果不一致

## 分布式锁

> lua 脚本保证原子性

### 要点

- 使用 lua 脚本来完成加解锁步骤, 目的是 lua 脚本运行是原子性的, 防止资源竞争
- value 随机生成, 目的是防止 key 过期时间设置的不合理, 在第一个锁加上后, 未主动解锁前,  key 过期, 此时第二个线程请求加锁, 查证没有 key, 则正常加锁, 而第一个线程结束后进行解锁, 如果没有唯一标识进行判断, 就会将线程2的锁解除

**加锁**

1. 使用`setnx`, 如果 key 存在则不做任何动作, key 不存在插入 value
2. key 不存在时需要继续给这个 key 设置超时时间
3. value 要求随机生成

**解锁**

1. 获取 key 的 value
2. value 一致则删除
3. 不一致代表已经被占用, 此时直接退出


















