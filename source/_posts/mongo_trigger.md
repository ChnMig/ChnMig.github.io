---
title: mongo 初探触发器
date: 2022-05-23            
updated: 2022-05-23         
comments: true              
toc: true                   
excerpt: mongodb 的触发器可以帮助我们方便的实现某些功能, 例如对数据的操作进行记录
tags:                       
- Golang
- DB
categories:                 
- 编程
---

## 前言
mongo 作为出名的 nosql 数据库, 随着版本的迭代, 被越来越多的开发者所接受, [DB-Engines Ranking - popularity ranking of database management systems](https://db-engines.com/en/ranking)  而我们今天来初探一下 mongo 的触发器功能, 并编写一个 DEMO 来实现 mongo 指定表的数据变更记录存储
## 触发器与 oplog
顾名思义, 触发器就是注册事件通知到 mongodb 中, 当指定的情况发生时, mongodb 会自动触发开发者注册的代码, 进行若干逻辑处理.
mongo 的触发器使用的是 oplog 的方式, oplog 是 mongo 中为了实现集群中的数据同步出现的概念, 与 mysql 类似, mongo 的多节点之间的数据同步通过操作 oplog 同步来完成: [Replica Set Data Synchronization — MongoDB Manual](https://www.mongodb.com/docs/manual/core/replica-set-sync/)
而触发器就注册在 oplog 的监听这里, 实际上触发器监听的是 oplog 的释出节点, 因此, 需要明确的是, 在触发器被触发时, 这个变更的操作已经落地到了数据库中, 而触发器事件并不会告知你之前的数据: [Getting the previous data in a database trigger - MongoDB Realm / Functions & Triggers - MongoDB Developer Community Forums](https://www.mongodb.com/community/forums/t/getting-the-previous-data-in-a-database-trigger/5843/6).
同样, 因为 oplog 是为了集群模式中进行数据同步出现的, 因此触发器的注册必须前提是该 mongodb 是集群分片模式, 不过, mongodb 支持在单机之上设置该模式, 具体可查看: [Using Change Streams in a standalone database - Ops and Admin / Replication - MongoDB Developer Community Forums](https://www.mongodb.com/community/forums/t/using-change-streams-in-a-standalone-database/127281)
## 是否应该使用触发器
只有当你确定需要使用触发器的时候, 才应该考虑使用触发器, 只有在非常特定的情况下, 使用触发器才合适. 
- 触发器是由 mongo 本身进行调用, 但是很多业务可能只关注业务本身, 没有必要将逻辑放置在 mongo 调用部分
- 前面说到, 触发器在触发时, 新的数据已经落地了, 如果你需要记录老的数据, 需要从别的方式入手, 这样使用触发器的理由是否足够大?
- 如果承载触发器逻辑的代码程序本身是分布式的, 多个, 那么每个记录会触发多次处理逻辑, 是否已经思考过这种情况可能出现的问题和解决方案?
## 触发器的支持版本
- 分片模式的 mongodb
- mongodb 版本 >= 3.6
## 模拟需求
假设需求如下:
- 监听指定表的数据
- 可设置字段白名单, 白名单内的字段发生变动才记录
- 记录老的数据和新的数据
- 记录 插入/更新/删除
- 记录由谁进行改动
- 区分代码自动修改与管理员手动修改
## 设计记录表结构
为满足需求, 设计操作日志记录结构如下
``` go
type ChangeLog struct {
	ID        primitive.ObjectID  `bson:"_id"`
	ChangeID  primitive.ObjectID  `bson:"change_id"` // 操作的 document _id
	DB        string              `bson:"db"`
	Coll      string              `bson:"coll"`
	UserID    *primitive.ObjectID `bson:"uesr_id"` // 当程序操作, 此字段为空
	CreatedAt time.Time           `bson:"created_at"`
	Type      string              `bson:"type"`   // 操作类型
	Fileds    string              `bson:"fileds"` // 字段
	Old       string              `bson:"old"`    // 老的值
	New       string              `bson:"new"`    // 新的值
}
```
## 设计监听的表结构
为满足记录字段由谁修改, 需要在需要监听的表新增字段`updated_by`, 当用户手动修改时, 务必将该字段设置为更改人的`_id`
当程序自动更改时, 务必将该字段设置为`nil`
例如表 demo 的结构如下
``` go
type Demo struct {
	ID        bson.ObjectId  `bson:"_id"`
	IP        string         `bson:"ip"`
	User      string         `bson:"user"`
	Time      time.Time      `bson:"time"`
	UpdatedBy *bson.ObjectId `bson:"updated_by"` // 务必为地址
}
```
其中, 我们对字段`ip`和`user`进行监听
## 触发器注册
本篇代码依旧使用 mongo 自己维护的 go 包 [mongodb/mongo-go-driver: The Go driver for MongoDB (github.com)](https://github.com/mongodb/mongo-go-driver) 而不是 mgo, 具体原因查看我之前的 mongo bulk 部分, 另外, 实际使用发现 mgo 对触发器支持并不理想, 并且预留的 example 并不准确, 这与 mgo 早已经停止更新有关.
直接放代码:
``` go

func SetAndListenTrigger(db, table string, fileds []string) {
	// conn := GetMDB().Database(db) // 这是监听整个数据库, 可通过回调的字段判断哪张表和字段变动
	conn := GetMDBCollection(db, table)                                                                                  // 监听某张表
	s, err := conn.Watch(context.TODO(), mongo.Pipeline{}, options.ChangeStream().SetFullDocument(options.UpdateLookup)) // 设置监听所有事件, 如需修改可参照 https://www.mongodb.com/docs/manual/changeStreams/
	// UpdateLookup
	if err != nil {
		log.Fatalln(err)
	}
	for {
		// for 监听每一个事件
		if ok := s.Next(context.TODO()); !ok {
			log.Println(err)
			continue
		}
		fmt.Println(s.Current) // 这里是具体的事件内容
		changeDoc := ChangeDoc{}
		if err := s.Decode(&changeDoc); err != nil { // 解析 body
			log.Println(err)
			continue
		}
		changeDoc.Parse(fileds) // 交给 parse 处理
	}
}
```
主要使用 `Watch` 设置触发器, 当获取到具体的消息后, 解析数据
## 事件结构体
事件结构体可参照 [Change Events — MongoDB Manual](https://www.mongodb.com/docs/manual/reference/change-events/#change-events)
``` go

type Truncated struct {
	Field   string `bson:"field"`
	NewSize int    `bson:"newSize"`
}

type Update struct {
	Updated         map[string]interface{} `bson:"updatedFields"` // 更新字段
	Removed         []string               `bson:"removedFields"` // 删除字段
	TruncatedArrays []Truncated            `bson:"truncatedArrays"`
}

type Source struct {
	Coll string `bson:"coll"` // 来源表
	DB   string `bson:"db"`   // 来源库
}

type OpID struct {
	Data string `bson:"_data"`
}

type Goal struct {
	Coll string `bson:"coll"`
	DB   string `bson:"db"`
}

type SID struct {
	ID  string `bson:"id"`
	UID string `bson:"uid"`
}

type Key struct {
	ID primitive.ObjectID `bson:"_id"`
}

// 格式参照 https://www.mongodb.com/docs/manual/reference/change-events/
type ChangeDoc struct {
	ID                OpID                   `bson:"_id"`
	OperationType     string                 `bson:"operationType"`
	FullDocument      map[string]interface{} `bson:"fullDocument"`
	NS                Source                 `bson:"ns"`
	To                Goal                   `bson:"to"`
	DocumentKey       Key                    `bson:"documentKey"`
	UpdateDescription Update                 `bson:"updateDescription"`
	ClusterTime       time.Time              `bson:"clusterTime"`
	TxnNumber         int                    `bson:"txnNumber"`
	LsID              SID                    `bson:"lsid"`
}
```
## DEMO
至此, 我们大致将代码流程整理完成, 先注册触发器, 然后对回调信息进行解析, 通过获取`updated_by`来判断是否是手动更新, 通过查询操作日志的该 ID 该 字段的最后一次更新记录来确认最后一次更新的数据, 来当做老的数据
demo 代码完全版如下:
``` go
package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

/*
mongo 连接部分
*/

var mongoClient *mongo.Client
var MongoAddress = "mongodb://teinfra_hs_log:xxx@127.0.0.1:8000,1127.0.0.2:8000/teinfra_hs_log?replicaSet=replica"

func InitMDB() error {
	// Set client options
	clientOptions := options.Client().ApplyURI(MongoAddress)
	// Connect to MongoDB
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatalln(err)
		return err
	}
	// Check the connection
	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatalln(err)
		return err
	}
	mongoClient = client
	return nil
}

func GetMDB() *mongo.Client {
	return mongoClient
}

func GetMDBCollection(dataBase, collection string) *mongo.Collection {
	return mongoClient.Database(dataBase).Collection(collection)
}

/*
trigger and parse 部分
*/

var (
	UPDATE = "update"
	DELETE = "delete"
	INSERT = "insert"
)

type Truncated struct {
	Field   string `bson:"field"`
	NewSize int    `bson:"newSize"`
}

type Update struct {
	Updated         map[string]interface{} `bson:"updatedFields"` // 更新字段
	Removed         []string               `bson:"removedFields"` // 删除字段
	TruncatedArrays []Truncated            `bson:"truncatedArrays"`
}

type Source struct {
	Coll string `bson:"coll"` // 来源表
	DB   string `bson:"db"`   // 来源库
}

type OpID struct {
	Data string `bson:"_data"`
}

type Goal struct {
	Coll string `bson:"coll"`
	DB   string `bson:"db"`
}

type SID struct {
	ID  string `bson:"id"`
	UID string `bson:"uid"`
}

type Key struct {
	ID primitive.ObjectID `bson:"_id"`
}

// 格式参照 https://www.mongodb.com/docs/manual/reference/change-events/
type ChangeDoc struct {
	ID                OpID                   `bson:"_id"`
	OperationType     string                 `bson:"operationType"`
	FullDocument      map[string]interface{} `bson:"fullDocument"`
	NS                Source                 `bson:"ns"`
	To                Goal                   `bson:"to"`
	DocumentKey       Key                    `bson:"documentKey"`
	UpdateDescription Update                 `bson:"updateDescription"`
	ClusterTime       time.Time              `bson:"clusterTime"`
	TxnNumber         int                    `bson:"txnNumber"`
	LsID              SID                    `bson:"lsid"`
}

func ValueParser(row interface{}) string {
	// 根据类型断言输出合适的 string 供存储
	// TODO 根据更多的情况进行补充
	switch row := row.(type) {
	case nil:
		return ""
	case int:
		return fmt.Sprintf("%d", row)
	case string:
		return row
	case primitive.ObjectID:
		return row.Hex()
	case time.Time:
		return row.String()
	default:
		log.Printf("unsupport row: %v\n", row)
		return fmt.Sprintf("%v", row)
	}
}

// 解析新增参数
func (c *ChangeDoc) InsertParse(fileds []string) {
	// 获取操作人
	userID := func() *primitive.ObjectID {
		i, ok := c.FullDocument["updated_by"] // 新增时, 字段都会在 full 里
		if !ok {
			return nil
		}
		o, ok := i.(primitive.ObjectID) // 类型断言
		if !ok {
			log.Printf("id validate err: %v", i)
			return nil
		}
		return &o
	}()
	for _, f := range fileds { // 只关注需要关注的字段
		ff, ok := c.FullDocument[f]
		if !ok {
			log.Printf("not find filed: %s\n", f)
			continue
		}
		l := ChangeLog{
			ID:        primitive.NewObjectID(),
			ChangeID:  c.DocumentKey.ID,
			DB:        c.NS.DB,
			Coll:      c.NS.Coll,
			Type:      INSERT,
			CreatedAt: time.Now(),
			Fileds:    f,
			UserID:    userID,
		}
		l.New = ValueParser(ff)
		fmt.Printf("%+v\n", l)
		// 新增时, old 字段为空
		ChangeChan <- l
	}
}

// 解析删除参数
func (c *ChangeDoc) DeleteParse(fileds []string) {
	// 真删除时, 无法携带更多信息
	// 每个关注的字段都是删除, 因此保存多条记录
	for _, f := range fileds {
		l := ChangeLog{
			ID:        primitive.NewObjectID(),
			ChangeID:  c.DocumentKey.ID,
			DB:        c.NS.DB,
			Coll:      c.NS.Coll,
			Type:      DELETE,
			Fileds:    f,
			New:       "",
			CreatedAt: time.Now(),
		}
		// 从记录表中获取最新的字段值作为 old
		old, err := GetFiledsLastValue(l.DB, l.Coll, l.Fileds, l.ChangeID)
		if err != nil {
			log.Println(err)
			old = ""
		}
		l.Old = old
		ChangeChan <- l
	}
}

// 更新参数
func (c *ChangeDoc) UpdateParse(fileds []string) {
	userID := func() *primitive.ObjectID {
		i, ok := c.FullDocument["updated_by"] // 防止 mongodb 对相同value多次更新优化为不更新, 从 full 里拿
		if !ok {
			log.Println("not find updated_by")
			return nil
		}
		o, ok := i.(primitive.ObjectID)
		if !ok {
			log.Printf("id validate err: %v\n", i)
			return nil
		}
		return &o
	}()
	for _, f := range fileds { // 只关注需要关注的字段
		ff, ok := c.UpdateDescription.Updated[f] // 判断 updated里是否有 key
		if !ok {
			log.Printf("not find filed: %s\n", f)
			continue
		}
		l := ChangeLog{
			ID:        primitive.NewObjectID(),
			ChangeID:  c.DocumentKey.ID,
			DB:        c.NS.DB,
			Coll:      c.NS.Coll,
			Type:      UPDATE,
			CreatedAt: time.Now(),
			Fileds:    f,
			UserID:    userID,
		}
		l.New = ValueParser(ff)
		old, err := GetFiledsLastValue(l.DB, l.Coll, l.Fileds, l.ChangeID)
		if err != nil {
			log.Println(err)
			old = ""
		}
		l.Old = old
		fmt.Printf("%+v\n", l)
		// 新增时, old 字段为空
		ChangeChan <- l
	}
	for _, f := range fileds { // 只关注需要关注的字段
		// 有可能是将某个字段删除了
		// 删除则没有新的 value
		for _, rmf := range c.UpdateDescription.Removed {
			if rmf == f {
				l := ChangeLog{
					ID:        primitive.NewObjectID(),
					ChangeID:  c.DocumentKey.ID,
					DB:        c.NS.DB,
					Coll:      c.NS.Coll,
					Type:      DELETE, // 在更新时删除某个字段, 作为删除
					CreatedAt: time.Now(),
					Fileds:    f,
					UserID:    userID,
				}
				old, err := GetFiledsLastValue(l.DB, l.Coll, l.Fileds, l.ChangeID)
				if err != nil {
					log.Println(err)
					old = ""
				}
				l.Old = old
				fmt.Printf("%+v\n", l)
				// 新增时, old 字段为空
				ChangeChan <- l
			}
		}
	}
}

// 解析 oplog 数据
func (c *ChangeDoc) Parse(fileds []string) {
	// 格式参照 https://www.mongodb.com/docs/manual/reference/change-events/
	switch c.OperationType {
	case "insert":
		c.InsertParse(fileds)
	case "update":
		c.UpdateParse(fileds)
	case "delete":
		c.DeleteParse(fileds)
	default:
		// TODO
	}
}

/*
调度部分
*/

var ChangeLogTable = "change_log"
var Database = "teinfra_hs_log"
var ChangeChan chan ChangeLog

type ChangeLog struct {
	ID        primitive.ObjectID  `bson:"_id"`
	ChangeID  primitive.ObjectID  `bson:"change_id"` // 操作的 document _id
	DB        string              `bson:"db"`
	Coll      string              `bson:"coll"`
	UserID    *primitive.ObjectID `bson:"uesr_id"` // 当程序操作, 此字段为空
	CreatedAt time.Time           `bson:"created_at"`
	Type      string              `bson:"type"`   // 操作类型
	Fileds    string              `bson:"fileds"` // 字段
	Old       string              `bson:"old"`    // 老的值
	New       string              `bson:"new"`    // 新的值
}

func GetFiledsLastValue(db, coll, fileds string, changeID primitive.ObjectID) (string, error) {
	// 连接到当前表
	conn := GetMDBCollection(Database, ChangeLogTable)
	f := bson.M{
		"db":        db,
		"coll":      coll,
		"fileds":    fileds,
		"change_id": changeID,
	}
	l := ChangeLog{}
	if err := conn.FindOne(context.TODO(), f, options.MergeFindOneOptions().SetSort(bson.M{"_id": -1})).Decode(&l); err != nil {
		log.Println(err)
		return "", err
	}
	return l.New, nil
}

func Listen() {
	ChangeChan = make(chan ChangeLog)
	for v := range ChangeChan {
		conn := GetMDBCollection(Database, ChangeLogTable)
		if _, err := conn.InsertOne(context.TODO(), v); err != nil {
			log.Println(err)
		}
	}
}

var taggerFileds = []string{"ip", "user"} // 感兴趣的字段, 不在list 中的字段发生变更时不记录日志
var taggerTable = "demo"                  // 感兴趣的表

func SetAndListenTrigger(db, table string, fileds []string) {
	// conn := GetMDB().Database(db) // 这是监听整个数据库, 可通过回调的字段判断哪张表和字段变动
	conn := GetMDBCollection(db, table) // 监听某张表
	// options.UpdateLookup 作用是传送的数据加上了本document当前最新的所有数据, 目的是为了解决用户 a 连续两次更新同一条数据, 第二次更新 mongodb 不会将 updated_by 带上的问题
	// options.UpdateLookup 返回的是已经更新后的新数据, 并不是老数据
	s, err := conn.Watch(context.TODO(), mongo.Pipeline{}, options.ChangeStream().SetFullDocument(options.UpdateLookup)) // 设置监听所有事件, 如需修改可参照 https://www.mongodb.com/docs/manual/changeStreams/
	// UpdateLookup
	if err != nil {
		log.Fatalln(err)
	}
	for {
		// for 监听每一个事件
		if ok := s.Next(context.TODO()); !ok {
			log.Println(err)
			continue
		}
		fmt.Println(s.Current) // 这里是具体的事件内容
		changeDoc := ChangeDoc{}
		if err := s.Decode(&changeDoc); err != nil { // 解析 body
			log.Println(err)
			continue
		}
		changeDoc.Parse(fileds) // 交给 parse 处理
	}
}

func main() {
	InitMDB()
	go Listen()
	time.Sleep(time.Second * 5)
	go SetAndListenTrigger(Database, taggerTable, taggerFileds)
	_, cancel := context.WithCancel(context.Background())
	defer cancel() // 关闭管道
	cs := make(chan os.Signal, 1)
	signal.Notify(cs, os.Interrupt)
	<-cs
}

```

