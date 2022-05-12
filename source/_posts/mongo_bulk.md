---
title: mongo 的 bulk 功能
date: 2022-04-14            
updated: 2021-04-14         
comments: true              
toc: true                   
excerpt: 在客户端需要一秒钟处理很多的数据到 mongodb 时, 你可以使用 bulk 来提高效率
tags:                       
- Golang
categories:                 
- 编程
---
## 前言
**Tips: go 的 mongo 模块, 有两个, 一个是 [go-mgo/mgo: The MongoDB driver for Go. UNMAINTAINED - SEE BELOW (github.com)](https://github.com/go-mgo/mgo) 一个是 [mongodb/mongo-go-driver: The Go driver for MongoDB (github.com)](https://github.com/mongodb/mongo-go-driver) 这里演示使用后者, 也推荐大家使用后者, 因为 mgo 已经于2018年停止更新, 对 mongo 的版本支持也只到4.8, 而后者是由 mongodb 官方维护, 对于 go 和 mongo 的版本更新都很及时**
## 问题
在实际开发中, 我们可能遇到这样的需求场景: 有一个消费者要不停的获取到数据并且根据数据修改/增加 mongodb 的值, 可能第一时间我们考虑到的是获取一个数据后立刻对数据进行处理并同步到 mongo, 他的代码类似于
``` Go
package main

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var mongoClient *mongo.Client

func InitMDB() error {
	// Set client options
	clientOptions := options.Client().ApplyURI("mongodb://user:pwd@127.0.0.1:15000/test?replicaSet=replica")
	// Connect to MongoDB
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		fmt.Println(err)
		return err
	}
	// Check the connection
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		fmt.Println(err)
		return err
	}
	mongoClient = client
	return nil
}

func GetMDBCollection(dataBase, collection string) *mongo.Collection {
	return mongoClient.Database(dataBase).Collection(collection)
}

type Task struct {
	ID  primitive.ObjectID
	Age int
}

var TaskChan chan Task

func Demo() {
	for t := range TaskChan { // 监听 chan, 有任务就处理
		f := bson.M{
			"_id": t.ID,
		}
		u := bson.M{
			"$set": bson.M{
				"age": t.Age,
			},
		}
		c := GetMDBCollection("test", "demo")
		c.UpdateOne(context.TODO(), f, u) // c 是 mongo 连接
	}
}

func main() {
	InitMDB()
	TaskChan = make(chan Task, 1)
	Demo()
}

```

使用监听 chan 的方式, 每获取到一个 task, 便去 mongo 进行一次更新, 当量不大时不会出现问题, 但如果生产者的速度非常快, 例如 1s 有50个 task 被生产, 这时候, 通过每次获取一个 c 进行一次更新的方案就会导致消费者消费速度出现瓶颈, 导致性能问题出现
## 使用 goroutine 尝试解决
获取你会想到, 使用 goroutine 来去除消费时需要等待 mongo 交互的等待时间, 将代码修改为
``` Go
package main

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var mongoClient *mongo.Client

func InitMDB() error {
	// Set client options
	clientOptions := options.Client().ApplyURI("mongodb://user:pwd@127.0.0.1:15000/test?replicaSet=replica")
	// Connect to MongoDB
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		fmt.Println(err)
		return err
	}
	// Check the connection
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		fmt.Println(err)
		return err
	}
	mongoClient = client
	return nil
}

func GetMDBCollection(dataBase, collection string) *mongo.Collection {
	return mongoClient.Database(dataBase).Collection(collection)
}

type Task struct {
	ID  primitive.ObjectID
	Age int
}

var TaskChan chan Task

func Demo() {
	for t := range TaskChan { // 监听 chan, 有任务就处理
		// 每次获取到任务则启动一个 goroutine 进行入库操作
		go func(t Task) {
			f := bson.M{
				"_id": t.ID,
			}
			u := bson.M{
				"$set": bson.M{
					"age": t.Age,
				},
			}
			c := GetMDBCollection("test", "demo")
			c.UpdateOne(context.TODO(), f, u) // c 是 mongo 连接
		}(t)
	}
}

func main() {
	InitMDB()
	TaskChan = make(chan Task, 1)
	Demo()
}

```
通过启动协程的方式, 减少 mongo 等待时间, 这样虽然能很快的获取任务, 但是对于 mongo 的 c 数量, 并不能进行控制, 可能因为数据库连接数过多导致更新失败
## 使用 mongo bulk
其实在 mongo 中, 已经提供了一次交互批量执行命令的功能, 就是 mongo bulk [Bulk() — MongoDB Manual](https://www.mongodb.com/docs/manual/reference/method/Bulk/)
在官方文档中, 已经在一开始注明了mongo 在3.2版本之后新增了封装的`bulkWrite()`
>   Starting in version 3.2, MongoDB also provides the [`db.collection.bulkWrite()`](https://www.mongodb.com/docs/manual/reference/method/db.collection.bulkWrite/#mongodb-method-db.collection.bulkWrite) method for performing bulk write operations.

`bulkWrite()`相比于很早的`bulk()`, 有更高的封装, 比如对于一次执行过多的操作, 会自己进行切割分为几次执行, 因此, 更推荐使用`bulkWrite()`, 我们下面的 Demo, 也全部使用`bulkWrite()`进行演示
## bulkWrite
[db.collection.bulkWrite() — MongoDB Manual](https://www.mongodb.com/docs/manual/reference/method/db.collection.bulkWrite/#mongodb-method-db.collection.bulkWrite)
我们将代码修改如下
``` Go
package main

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var mongoClient *mongo.Client

func InitMDB() error {
	// Set client options
	clientOptions := options.Client().ApplyURI("mongodb://user:pwd@127.0.0.1:15000/test?replicaSet=replica")
	// Connect to MongoDB
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		fmt.Println(err)
		return err
	}
	// Check the connection
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		fmt.Println(err)
		return err
	}
	mongoClient = client
	return nil
}

func GetMDBCollection(dataBase, collection string) *mongo.Collection {
	return mongoClient.Database(dataBase).Collection(collection)
}

type Task struct {
	ID  primitive.ObjectID
	Age int
}

var TaskChan chan Task

const maxWrite = 3 // 最大的更新长度

func Demo() {
	w := []mongo.WriteModel{}
	opt := options.BulkWriteOptions{}
	opt.SetOrdered(true)      // 设置执行为顺序的
	for t := range TaskChan { // 监听 chan, 有任务就处理
		// 如果长度未达到规定的最大长度, 添加到 w 后等待下一次循环
		// 长度达到最大长度时, 调用 mongo 执行语句

		// NewUpdateOneModel: 更新一个文档
		// SetFilter: 查找
		// SetUpdate: 更新
		// SetUpsert: 设置有则更新, 没有则插入, 设置为 false 则代表没有就不做操作
		w = append(w, mongo.NewUpdateOneModel().SetFilter(bson.M{"_id": t.ID}).SetUpdate(bson.M{"$set": bson.M{"age": t.Age}}).SetUpsert(true))
		if len(w) == maxWrite {
			// 使用 bulkWrite 更新多条语句
			c := GetMDBCollection("teinfra_hs_log", "app")
			r, err := c.BulkWrite(context.TODO(), w, &opt)
			if err != nil {
				fmt.Println(err)
			}
			fmt.Println(r.UpsertedIDs) // 返回操作的 ID: map[0:ObjectID("625ad4eaee42d75d76203685") 1:ObjectID("625ad4eaee42d75d76203686") 2:ObjectID("625ad4eaee42d75d76203687")]
			w = []mongo.WriteModel{}   // 重新将 w 设置为空
		}
	}
}

func set() {
	ts := []Task{
		{ID: primitive.NewObjectID(), Age: 10},
		{ID: primitive.NewObjectID(), Age: 11},
		{ID: primitive.NewObjectID(), Age: 12},
	}
	for _, v := range ts {
		TaskChan <- v
	}
}

func main() {
	InitMDB()
	TaskChan = make(chan Task, 1)
	go set()
	Demo()
}

```
以上是一次执行多次更新的 Demo 代码
而 bulkWrite() 不止只有 `NewUpdateOneModel`, 还有其他的诸如`NewDeleteManyModel`, `NewReplaceOneModel`, `NewInsertOneModel` 等等方法, 具体可以查看文档 [db.collection.bulkWrite() — MongoDB Manual](https://www.mongodb.com/docs/manual/reference/method/db.collection.bulkWrite/#db.collection.bulkwrite--) 和 [mongo package - go.mongodb.org/mongo-driver/mongo - pkg.go.dev](https://pkg.go.dev/go.mongodb.org/mongo-driver@v1.9.0/mongo?utm_source=gopls)
但是细心的你可能很快会发现问题, 如果我们将最终发送的长度指标设置的很大, 而没有达到最大长度时就不会将数据发送到数据库, 那么如果突然某一时刻没有新的 task 了, 而存上的 task 因为长度不够没有发出去, 那么这些数据就很长时间没有落到数据库, 导致问题出现
于是我们可以考虑加入一个超时时间, 当时间到达超时时间或者达到指定长度, 都会发送到 mongo, 这样就解决了问题
## bulkWrite 发送的触发机制
通过`time.Tick`来创建定时器, 通过定时器来进行隔一段时间发送一次的操作
然后通过判断切片长度来进行发送操作, 因为两个都不是使用 goroutine , 所以不会出现切片的资源竞争问题
``` GO
package main

import (
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var mongoClient *mongo.Client

func InitMDB() error {
	// Set client options
	clientOptions := options.Client().ApplyURI("mongodb://user:pwd@127.0.0.1:15000/test?replicaSet=replica")
	// Connect to MongoDB
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		fmt.Println(err)
		return err
	}
	// Check the connection
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		fmt.Println(err)
		return err
	}
	mongoClient = client
	return nil
}

func GetMDBCollection(dataBase, collection string) *mongo.Collection {
	return mongoClient.Database(dataBase).Collection(collection)
}

type Task struct {
	ID  primitive.ObjectID
	Age int
}

var TaskChan chan Task

const maxWrite = 1000                      // 最大的更新长度
const maxWiteTime = time.Millisecond * 300 // 如果最近300ms没有更新且有需要更新的数据则更新一次

func bulk(writes []mongo.WriteModel, opt options.BulkWriteOptions) {
	// 使用 bulkWrite 更新多条语句
	c := GetMDBCollection("teinfra_hs_log", "app")
	r, err := c.BulkWrite(context.TODO(), writes, &opt)
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(r.UpsertedIDs) // 返回操作的 ID: map[0:ObjectID("625ad4eaee42d75d76203685") 1:ObjectID("625ad4eaee42d75d76203686") 2:ObjectID("625ad4eaee42d75d76203687")]
}

func Demo() {
	w := []mongo.WriteModel{}
	opt := options.BulkWriteOptions{}
	opt.SetOrdered(true)             // 设置执行为顺序的
	ticket := time.NewTicker(maxWiteTime) // 设置定时器, 每 maxWiteTime 触发一次 chan
	for {
		select {
		case t, ok := <-TaskChan:
			if !ok {
				fmt.Println("down")
				ticket.Stop()  // 关闭定时器防止内存泄露		
				return
			}
			// 如果长度未达到规定的最大长度, 添加到 w 后等待下一次循环
			// 长度达到最大长度时, 调用 mongo 执行语句
			// NewUpdateOneModel: 更新一个文档
			// SetFilter: 查找
			// SetUpdate: 更新
			// SetUpsert: 设置有则更新, 没有则插入, 设置为 false 则代表没有就不做操作
			w = append(w, mongo.NewUpdateOneModel().SetFilter(bson.M{"_id": t.ID}).SetUpdate(bson.M{"$set": bson.M{"age": t.Age}}).SetUpsert(true))
			if len(w) == maxWrite {
				bulk(w, opt)
				w = []mongo.WriteModel{}
			}
		case <-ticket.C: // 300ms 触发一次
			if len(w) != 0 { // 如果 w 有值, 则提交给 mongo
				bulk(w, opt)
				w = []mongo.WriteModel{}
			}
		}
	}
}

func set() {
	ts := []Task{
		{ID: primitive.NewObjectID(), Age: 10},
		{ID: primitive.NewObjectID(), Age: 11},
		{ID: primitive.NewObjectID(), Age: 12},
	}
	for _, v := range ts {
		TaskChan <- v
	}
}

func main() {
	InitMDB()
	TaskChan = make(chan Task, 1)
	go set()
	Demo()
}
```
这样就可以正常的运行了
## QA
### 应该使用 bulkWrite 而不是 bulk
bulkWrite 更推荐使用, builWrite 相比于 bulk+run 的方式, 更加上层, 比如针对一次 操作的组数量超过 maxWriteBatchSize 的时候, run 会直接报错, 而 Write 会自己切分
mgo 不支持 bulkWrite, 结合上面的项目更新状况, 新的项目应当使用  [mongo package - go.mongodb.org/mongo-driver/mongo - pkg.go.dev](https://pkg.go.dev/go.mongodb.org/mongo-driver@v1.9.0/mongo?utm_source=gopls)
### 有序和无序
[db.collection.bulkWrite() — MongoDB Manual](https://www.mongodb.com/docs/manual/reference/method/db.collection.bulkWrite/#execution-of-operations)
有序时, mongo 会按照列表顺序, 一步一步执行代码, 如果某个语句出错, 剩下的语句不会执行, 直接停止
无序时, mongo 会自己进行并发执行, 不保证执行顺序, 其中某几个错误不会造成其他的执行停止
有序时速度更慢, 但是对数据的处理可能更加符合开发者预期, 如果你在一个 bulk 中对某个文档进行多次修改, 如果使用无序, 并不能保证最后的结果符合列表中的顺序,是否使用顺序执行, 要根据具体业务分析处理
### 不要在 bulkWrite 中进行创建表操作
不要在 bulk 中对不存在的表进行操作, 尽管在有些mongo版本中, 她不会抛出异常
### 错误返回
如果在 bulk 一次运行中, 返回的错误信息大于1M, 则 mongo 会将其余的错误信息全部设置为空返回, 所以根据之前的列表上限来讲, 可能将每次执行的 list 长度设置为1-3k 比较合适