---
title: 记一次破解 gitbook_lock 密码的过程             
date: 2021-12-21            
updated: 2021-12-21         
comments: true              
toc: true                   
excerpt: 网上越来越多的博客和文章使用了 lock 组件, 具体表现为给你甩一个二维码, 然后告诉你关注某某公众号获取解锁码才可以解锁剩余内容, 可以说是恶臭的做法, 我个人是坚决抵制的, 我输出的内容也不会加入这种机制来引流. 
tags:                       
- 好玩的技术
categories:                 
- 编程     
---

## 前言

不知道啥时候起的歪风邪气, 国内人写的文章都会在下面标二维码, 是赞助的也就算了, 还整个公众号, 我也关注了几个公众号, 日推90%都是卖课, 找点营养简直是:shit:里淘金, 你放广告可以, 我不关注就行, 结果后来越来越离谱, 渐渐的有些变成了关注公众号才能看见内容, 大无语了.

就是类似于这样

![恶臭](/images/posts/1.png)

今天就突发奇想, 看看能不能绕过这种机制, 结果还真发现挺简单的, 几分钟就搞定了, 于是这里小小的记录一下排查过程

> 下面的"作者"代表的是我们要破解的这个网站的作者, 而本人以"我"代称

## 思考作者的实现方式

一上来就去实操是不明智的, 一个人很容易走入死胡同, 我习惯在解决问题前先思考问题, 期望能了解原因和目的

作者在这里写的是"获取注册码后永久免费观看文章", 首先我随便输入一个验证码, 点击提交, 发现并没有要求我登录, 这说明这个验证码是通用的, 可能只有一个或者有限的几个, 不然我不登录, 他怎么知道这个验证码属于我呢? 

而且我在第一家公司做过一些需要对接微信接口的功能, 我知道对于微信公众号来讲, 要想做一些比较开放的操作, 比如做到不同的人在公众号发送同样的消息, 回复不同的内容, 需要企业开发者开发的公众号才可以, 个人的开发者只能做到在后台设置用户发送某个消息你自动回复某个消息, 消息是固定的, 只有接自己的接口才可以做到随机生成, 而一般这种公众号都是个人公众号, 企业的很少

而且网站本身不支持登录, 没有办法这个微信用户与当前正在浏览的用户建立关系.

那么就有两种可能

- 这个验证码就放到了网页之中, 我的意思是作者靠 JS 去判断验证码是否正确, 这就代表正确答案也在某个文件中
- 这个验证码的校验是通过 HTTP 请求来做的, 这种需要自己有服务器写 api, 可能性不大

如果是可能2, 那么就很难去做了, 我们要先看一下是哪一种, 校验的方式很简单, f12打开看一下点击提交时有没有发送请求

很幸运, 并没有, 因为绝大部分都不是自己写 api, 这是因为:

一般博客都使用现成的博客框架, 比如 hexo 这些, 自己写前端的人很少, 对于使用框架的人来讲, 这种🔒的机制都是通过别人写的组件来做的, 而别人写组件不会考虑你自己的 api 是怎么实现的, 接口怎么走, 返回的数据是什么, 所以公开的组件除了接入出名的服务, 比如谷歌统计这些, 剩下的都是本地实现的

那么到这里就明了了, 这里的作者使用了某个博客框架的某个组件, 这个组件可以做到将文章隐藏部分, 只有输入正确的验证码才能解锁, 而这个正确的验证码也是写进前端中的, 由本地去做校验

## 查找正确的验证码

我先使用 f12 定位到提交按钮的前端元素

``` html
<button onclick="bc()" id="btw-submit-btn" style="padding: 0 20px; height: 32px; font-size: 14px; outline: none; border: none; color: rgb(255, 255, 255); background: rgb(222, 104, 109); cursor: pointer;">提          交      </button>
```

看到这里写了点击按钮时触发函数`bc`, 但是这个函数名太短了, 我先尝试一下能不能找到这个函数.

依旧是打开 f12, 在点击 tab `源代码` 一栏, 这里会展示页面所有的资源

![源代码栏](/images/posts/2.png)

鼠标移动到 top, 右键有一个选项: 在所有文件中搜索, 点击这个选项, 搜索 `bc(`

![搜索结果](/images/posts/3.png)

搜索出了4个匹配, 第一个一看就是百度统计, `hm.baidu.com/hm.js`太熟悉了, 直接跳过

第二个, 看这个 js 名: `gitbook-plugin-lock/lock.js`, 这应该就是我们需要的, 查看这个 js

``` js
require(['gitbook', 'jQuery'], function(gitbook, $) {
    let lockTokenKey;
    let wechatName;
    let wechatQr;
    let verificationCode;
    let thisCode;
    let thisValue;
    let allPage;
    let articleHeightPercent;

    function insertPageLock(e) {
        let authToken= localStorage.getItem(lockTokenKey)
        if (authToken!==isNaN(0)||authToken!==""||authToken!==undefined) {
            for (let  i in verificationCode) {
                if (verificationCode[i]["value"] === authToken) {
                    return true;
                }
            }
        }

        const cla = document.getElementById("book-search-results");
        const article = cla, height = article.scrollHeight;
        const halfHeight = height * articleHeightPercent;
        cla.style.height= halfHeight + 'px';
        cla.style.overflow = 'hidden'


        const html = '<div id="page-lock-wrap" style="position: absolute; bottom: 0; z-index: 9999; width: 100%; margin-top: -100px; font-family: PingFangSC-Regular, sans-serif;">' +
            '<div id="page-lock-mask" style="position: relative; height: 200px; background: -webkit-gradient(linear, 0 0%, 0 100%, from(rgba(255, 255, 255, 0)), to(rgb(255, 255, 255)));"></div>' +
            '<div class="info" style="position: absolute;left: 50%;top: 70%;bottom: 30px;transform: translate(-50%, -50%);font-size: 15px;text-align: center;background: -webkit-gradient(linear, 0 0%, 0 100%, from(rgba(255, 255, 255, 0)), to(rgb(255, 255, 255)));">\n' +
            '        <div>扫码或搜索：<span style="color: #E9405A; font-weight: bold;">'+wechatName+'</span></div>\n' +
            '        <div>\n' +
            '            <span>发送 </span><span class="token" style="color: #e9415a; font-weight: bold; font-size: 17px; margin-bottom: 45px;">'+thisCode+'</span>\n' +
            '        </div>\n' +
            '        <div>\n' +
            '            即可<span style="color: #e9415a; font-weight: bold;">立即永久</span>解锁本站全部文章\n' +
            '        </div>\n' +
            '        <div id="btw-modal-input-code" style="margin-top: 20px; background: rgb(255, 255, 255);"><input '+
            '         id="btw-modal-input" type="text" maxLength="10" placeholder="请输入验证码" '+
            '    style="width: 160px; height: 32px; line-height: 32px; padding: 0 10px; margin: 0 10px; font-size: 13px; text-rendering: auto; text-transform: none; cursor: text; outline: none; box-sizing: border-box; border: 1px solid rgb(221, 221, 221); appearance: textfield; background-color: white; -webkit-rtl-ordering: logical;">'+
            '    <button onclick="bc()" id="btw-submit-btn" '+
            '             style="padding: 0 20px; height: 32px; font-size: 14px; outline: none; border: none; color: rgb(255, 255, 255); background: rgb(222, 104, 109); cursor: pointer;">提 '+
            '         交'+
            '      </button></div>\n '+
            '    <div>\n' +
            '        <img class="code-img" style="width: 300px;display:unset" src="'+wechatQr+'">\n' +
            '    </div>\n' +
            '</div>' +
            '</div>';

        const child = document.createElement('div')
        child.innerHTML = html
        cla.appendChild(child)
        bc = function () {
            const val = document.getElementById('btw-modal-input').value
            if (val === thisValue) {
                cla.style.height = height + 'px';
                cla.style.overflow = 'visible';
                const rm = document.getElementById("page-lock-wrap")
                rm.parentNode.removeChild(rm)
                localStorage.setItem(lockTokenKey, thisValue)
            } else if (val === "" || val === undefined || val === isNaN(0)) {
                return false;
            } else {
                alert("验证码不正确!")
            }
        }
    }

    gitbook.events.bind('start', function(e, config) {
        lockTokenKey = config.lock.lockTokenKey || 'lock-token';
        wechatName  = config.lock.wechatName || '';
        wechatQr  = config.lock.wechatQr || '';
        verificationCode = config.lock.verificationCode || '';
        allPage = config.lock.allPage || false;
        articleHeightPercent = config.lock.articleHeightPercent || 0.5;
        if (articleHeightPercent >= 1 || articleHeightPercent <= 0) {
            articleHeightPercent = 0.5
        }

        const rand = Math.floor(Math.random() * verificationCode.length)
        thisCode = verificationCode[rand]["key"]
        thisValue = verificationCode[rand]["value"]

    });

    gitbook.events.bind('page.change', function(e) {
        const place = document.getElementsByClassName("page-lock-place")
        if (allPage || place.length !== 0) {
            insertPageLock(e);
        }
    });
});

```

这里我们看到了函数`bc`, 比对是这里 `if (val === thisValue)`, 相等则将结果展示, 不想等就弹出验证码不正确, 明确了`thisValue`就是正确的验证码

我在这个 js 中搜索 `thisValue` , 总共四处, 有一处是这里

``` js
const rand = Math.floor(Math.random() * verificationCode.length)        
thisCode = verificationCode[rand]["key"]
thisValue = verificationCode[rand]["value"]
```

从代码来看, 是获取的`verificationCode`, 这个`verificationCode`是一个列表, 然后随机获取一个列表内的 key 和 value, 这里的 key 就是图上的`1024`, value 就是正确的验证码了,  这里并没有定义具体的值, 这也是正确的, 因为既然是组件, 肯定不会让组件的开发者写死正确的验证码, 有一个配置文件放置正确的验证码, 这里应该是加了点花样, 每次还是会随机获取一个 key 和 value, 我刷新了一下页面, 果然提示的要给公众号发送的 key 已经变成另一个了,

我猜测, `verificationCode`的结构应该是

``` json
[
  {"key": "1024", "value": "正确的验证码"},
  {"key": "面试", "value": "正确的验证码"},
  ...
]
```

 所以我全部文件搜索 `verificationCode`, 果然在一个 html 文件中查到了信息

``` html
<script>
        var gitbook = gitbook || [];
        gitbook.push(function() {
            gitbook.page.hasChanged({"page":{"title":"基础","level":"2.1","depth":1,"next":{"title":"个人学习笔记","level":"2.2","depth":1,"path":"Golang/学习笔记.md","ref":"Golang/学习笔记.md","articles":[]},"previous":{"title":"@xzghua","level":"1.2","depth":1,"url":"https://www.github.com/xzghua","ref":"https://www.github.com/xzghua","articles":[]},"dir":"ltr"},"config":{"plugins":["accordion","pageview-count","copy-code-button","click-reveal","expandable-chapters","donate","anchor-navigation-ex","hide-element","statistics","github-buttons","lightbox","custom-favicon","-lunr","-search","search-pro","insert-logo","splitter","gitalks","lock","mermaid-gb3","theme-comscore"],"styles":{"website":"styles/website.css","pdf":"styles/pdf.css","epub":"styles/epub.css","mobi":"styles/mobi.css","ebook":"styles/ebook.css","print":"styles/print.css"},"pluginsConfig":{"statistics":{"bd_url":"https://hm.baidu.com/hm.js","cnzz_url":"https://s95.cnzz.com/z_stat.php","google_url":"https://www.googletagmanager.com/gtag/js","bd_token":"efcf1af531176f98a2ecd0648da80892","cnzz_id":1278118665},"gitalks":{"flipMoveOptions":{},"clientID":"1cf16fa2a845aab2bfa4","number":-1,"perPage":10,"proxy":"https://withered-block-2317.interview.workers.dev/?https://github.com/login/oauth/access_token","admin":["chuhsent","xzghua"],"createIssueManually":false,"distractionFreeMode":false,"repo":"interview-comment","owner":"wzcu","enableHotKey":true,"clientSecret":"25fdef949a46bdc9507ecdea23c21ce745b56cf0","pagerDirection":"last","labels":["Gitalk"]},"splitter":{},"search-pro":{},"accordion":{},"lock":{"verificationCode":[{"key":"1024","value":"2048"},{"key":"666","value":"6666"},{"key":"面试","value":"造火箭"},{"key":"2048","value":"1024"}],"lockTokenKey":"lock-token-key","wechatName":"技术抛光","wechatQr":"http://interview.wzcu.com/static/qrcode.jpg","allPage":false,"articleHeightPercent":0.6},"donate":{"alipay":"http://www.iphpt.com/static/uploads/images/alipay.jpeg","alipayText":"支付宝打赏","button":"赏","title":"","wechat":"http://www.iphpt.com/static/uploads/images/wechat2.jpeg","wechatText":"微信打赏"},"hide-element":{},"fontsettings":{"theme":"white","family":"sans","size":2},"click-reveal":{},"highlight":{},"mermaid-gb3":{},"anchor-navigation-ex":{"associatedWithSummary":true,"float":{"floatIcon":"fa fa-navicon","level1Icon":"","level2Icon":"","level3Icon":"","showLevelIcon":false},"mode":"float","multipleH1":true,"pageTop":{"level1Icon":"","level2Icon":"","level3Icon":"","showLevelIcon":false},"printLog":false,"showGoTop":true,"showLevel":true},"favicon":"./static/red_rocket02.png","lightbox":{"jquery":true,"sameUuid":false},"theme-comscore":{},"pageview-count":{},"github-buttons":{"buttons":[{"user":"wzcu","repo":"interview-comment","type":"star","size":"small","count":true},{"user":"wzcu","repo":"interview-comment","type":"watch","size":"small","count":true}]},"custom-favicon":{},"copy-code-button":{},"mygitalk":{"clientID":"1cf16fa2a845aab2bfa4","clientSecret":"25fdef949a46bdc9507ecdea23c21ce745b56cf0","repo":"interview-comment","owner":"wzcu","admin":["chuhsent","xzghua"],"distractionFreeMode":false,"proxy":"https://withered-block-2317.interview.workers.dev/?https://github.com/login/oauth/access_token"},"sharing":{"facebook":true,"twitter":true,"google":false,"weibo":false,"instapaper":false,"vk":false,"all":["facebook","google","twitter","weibo","instapaper"]},"theme-default":{"styles":{"website":"styles/website.css","pdf":"styles/pdf.css","epub":"styles/epub.css","mobi":"styles/mobi.css","ebook":"styles/ebook.css","print":"styles/print.css"},"showLevel":false},"insert-logo":{"style":"background: none; max-height: 30px; min-height: 30px","url":"/static/red_rocket01.jpg"},"expandable-chapters":{}},"theme":"default","pdf":{"pageNumbers":true,"fontSize":12,"fontFamily":"Arial","paperSize":"a4","chapterMark":"pagebreak","pageBreaksBefore":"/","margin":{"right":62,"left":62,"top":56,"bottom":56}},"structure":{"langs":"LANGS.md","readme":"README.md","glossary":"GLOSSARY.md","summary":"SUMMARY.md"},"variables":{},"links":{"sidebar":{"Home":"http://interview.wzcu.com"}},"gitbook":"*"},"file":{"path":"Golang/基础.md","mtime":"2021-08-29T03:42:36.050Z","type":"markdown"},"gitbook":{"version":"3.2.3","time":"2021-12-05T02:37:19.012Z"},"basePath":"..","book":{"language":""}});
        });
    </script>
```

这里发现了 `verificationCode`的值是

``` json
"lock":{"verificationCode":[{"key":"1024","value":"2048"},{"key":"666","value":"6666"},{"key":"面试","value":"造火箭"},{"key":"2048","value":"1024"}]
```

也就是说有3个 key, 分别是`1024`, `2048`, `造火箭` 至于正确的验证码就是其对应的 value

我本次的 key 是`1024`, 所以我输`2048`点击提交果然成功了

## 正确凭证存储在了哪里

其实这个也很简单. 看函数`bc`的代码, 在验证码正确时那部分

``` js
localStorage.setItem(lockTokenKey, thisValue)
```

这里是将数据保存在 `localStorage` 中, key 暂时不知道是什么, 而 value 则是正确的验证码

而`lockTokenKey`在全部文件搜索后, 发现跟`verificationCode`在一起定义了

``` json
"lockTokenKey":"lock-token-key"
```

那么我们为了校验, 打开 f12, 查看 应用程序 的 tag, 果然找到了

![localStorage](/images/posts/4.png)

我们将其删除后刷新页面, 发现果然又需要重新输入验证码了

## 总结

其实这是很简单的一次破解, 几分钟搞定, 没有做更细致的查找, 比如流程逻辑, 因为你的目的只是想看文章而已, 而类似这种没有自己的用户体系, 但是又告诉你关注公众号发送指定的消息获取永久验证码访问内容, 基本也都是这样的讨论

希望以这种方式来给自己的公众号引流的博客越来越少, 主要是你内容都是卖课, 都是垃圾内容, 实在是让人反感



























