# zap包简单使用

[zap](https://github.com/uber-go/zap) 是 uber 开源的一个日志记录的包, uber 在 go 的领域建树颇多, zap 更是优秀, 相比于自带的 log ,他有更多的功能, 当然, 最显眼的还是他很快, 本文介绍 zap 模块的基本使用

## 简单使用

zap的使用由 编码器 和 初始化 组成, 编码器表示输出的格式, DEMO如下(使用默认的编码器)

```go
package tool

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// Log zapLog对象
var Log *zap.Logger

Log, _ = zap.NewProduction()
```

使用方法为直接调用生成的 Log, 比如

```go
	_, err := tools.DB.Exec(sqlStr, formPassWord, time.Now(), formPhone)
	if err != nil {
		tools.Log.Error("1002", zap.Error(err))  // log
		tools.FormatError(c, 1002, "error")
		return
	}
```

## 将日志保存在本地

如果项目有日志服务进行日志收集那么到这里就结束了, 如果需要将日志写在本地你还需要看下去

我们使用第三方包来达到这个效果

[lumberjack](https://github.com/natefinch/lumberjack)

该包可以自己进行日志的切割, 避免日志推挤过多, 当然你不需要日志切割等高级功能的话你完全可以直接使用 os.Create 来适配

结合 zap 使用如下

```go
package tools

import (
	"github.com/natefinch/lumberjack"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// Log zapLog对象
var Log *zap.Logger

// 日志切割设置
func getLogWriter() zapcore.WriteSyncer {
	lumberJackLogger := &lumberjack.Logger{
		Filename:   "api.log", // 日志文件位置
		MaxSize:    10,         // 日志文件最大大小(MB)
		MaxBackups: 5,          // 保留旧文件最大数量
		MaxAge:     30,         // 保留旧文件最长天数
		Compress:   false,      // 是否压缩旧文件
	}
	return zapcore.AddSync(lumberJackLogger)
}

// 编码器
func getEncoder() zapcore.Encoder {
	// 使用默认的JSON编码
	encoderConfig := zap.NewProductionEncoderConfig()
	encoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	encoderConfig.EncodeLevel = zapcore.CapitalLevelEncoder
	return zapcore.NewJSONEncoder(encoderConfig)
}

// InitLogger 初始化Logger
func InitLogger() {
	writeSyncer := getLogWriter()
	encoder := getEncoder()
	core := zapcore.NewCore(encoder, writeSyncer, zapcore.DebugLevel)

	Log = zap.New(core, zap.AddCaller())
}

```

使用方法与上方一致

Log.Error 代表生成一条 Error 的log, 参数一是 msg 内容, 这个是自定义的, 根据团队的规范来, 参数二是 err 信息, 使用 zap.Error 包装可生成额外的信息比如报错的路径/文件/行 等信息, 输出的日志类似

```go
{"level":"ERROR","ts":"2020-04-19T12:38:14.587+0800","caller":"property/view.go:464","msg":"1002","error":"Error 1054: Unknown column 'propertyid' in 'on clause'"}
```

