# 记一次goroutine与wg一起使用导致的问题

今天发现了一个问题是之前一直没有注意到的,这里记一下

## Send Closed Chan

##  问题概述

代码逻辑是启动时启动多个 channel, channel1 获取数据监听数据处理后发送给 channel2 , channel2 处理后再给 channel3 等等

在 channel1 写完数据后将通道 channel1 关闭, channel1 关闭后 channel2 也关闭, 达到任务执行完毕后通道全部关闭的效果

我之前的代码是

```go
func StartVerify() {
	wg := sync.WaitGroup{}
	for {
		data, ok := <-TypicalResChan
		if !ok {
			wg.Wait()
			close(VerifyBossDNSChan)
			break
		}
		go func() {
			wg.Add(1)
			ok := Verify(data)
			if ok {
				VerifyBossDNSChan <- data
			}
			wg.Done()
		}()
	}
}
```

后来使用中发现有时候会报 `send closed channel` 的错误,大佬看了一眼就发现了问题

## 问题剖析

就以上面的举例, 上游向 TypicalResChan 发送数据时, 如果不是 close 请求, 会启动一个 goroutine 去处理逻辑, 而在 启动这个 goroutine 后在内部进行 wg 的 Add 注册, 注意这个过程是有耗时的, 所以问题来了, 当上游向 TypicalResChan 发送 close 时, 进入 !ok 的逻辑, 此时等待 wg 释放, 此时有可能上一个数据接收到后还在启动一个 goroutine ,还没有 Add注册, 此时wg没有监听到这个 goroutine 的注册, 造成不会等待这个 goroutine ,直接就关闭了 TypicalResChan, 而这个 goroutine 执行后向 TypicalResChan 发送数据时 TypicalResChan 已经关闭, 所以会报错导致 panic

另外, 还需要注意的是在 wg 没有注册前就 wait 是不推荐的, 很容易出现问题

还有就是判断通道关闭更推荐使用 range 省去判断 !ok 的步骤保持代码整洁

## 问题解决

修改成这样即可

```go
func StartVerify() {
	wg := sync.WaitGroup{}
	for data := range TypicalResChan {
		wg.Add(1)
		go func(data Result) {
			defer wg.Done()
			ok := Verify(data)
			if ok {
				VerifyBossDNSChan <- data
			}
		}(data)
	}
	wg.Wait()
	close(VerifyBossDNSChan)
}
```

在上游 close 时 range 会自动结束, 而受到正常数据先 Add 防止时间差导致的 Add 失败问题, 在 1.14 后 go 优化了 defer 的逻辑, defer 基本不再有消耗, 所以推荐使用 defer 注册 wg 的关闭, 而在 close 时, for 循环结束, wg 在 wait 后再 close

