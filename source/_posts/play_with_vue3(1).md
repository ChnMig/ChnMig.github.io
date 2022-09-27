---
title: <<玩转 vue3>>笔记(1)
date: 2022-07-07            
updated: 2022-07-07           
comments: true              
toc: true                   
excerpt: 这是极客时间的课程<<玩转 vue3>>的个人学习笔记
tags:                       
- Vue
categories:                 
- 编程
---
## 前言
学习前端势在必行, 这里是一个初学者(只写过 JS+BootStrap)学习 vue3 的学习笔记, 课程在 [玩转 Vue 3 全家桶 (geekbang.org)](https://time.geekbang.org/column/intro/100094401?tab=catalog)
## 为什么是 vue3
### 前端发展历程
- 纯静态网页: 纯静态, 手动更新页面
- 模板语言网页: 直接嵌入后端数据, 数据更新需要重新刷新页面
- ajax: 前端异步获取数据并动态刷新
- jquery+bootStrap: 通过 jquery 操作 dom, bootStrap 做基本的响应式和栅格处理
- angularJs+nodeJs: MVVM 模式, 前端可以入侵到后端, `数据驱动页面`, 数据变化则页面自动变化, 而不需要操作 dom, 开发者只需要关注数据的变化, 对 dom 的修改由框架完成
- 百花齐放: angularJs/vue/react.....
### 三大框架
- angularJs
- vue
- react
### 实现原理
- angular :  脏检查, 每次交互都检查数据是否变化, 从而更新 dom
- vue: 响应式, 对于每个需要变化的数据都建立一个 watcher 监听数据的属性, 有变化时才通知修改对应的 dom
- react: 虚拟 dom, 通过 js 来生成虚拟的 dom, diff 检测数据更新直接更改虚拟 dom, 更快速
### vue 和 angular 区别
- angular 通过 diff 来自己进行数据变化的感知, vue 框架本身在数据变化时会主动通知
### vue 和 react 区别
vue为了实现数据感知, 需要在框架内生成若干 watcher, 数量多就影响性能. 
react 生成虚拟 dom, 每次需要对虚拟 dom 进行 diff 来得知数据变化, 当虚拟 dom 很大则影响性能
- react 使用将虚拟 dom 分片的方式将 dom 切片, 在浏览器空闲时再进行 diff, 每次计算一片, 当浏览器需要计算时下次让给浏览器, 解决卡顿
- vue2 引入了虚拟 dom, 取 react 之长, 对于组件之间的变化, 才通过 watcher 通知, 对于组件内的变化, 通过虚拟 dom 来更新, 组件数量不会很多, 解决了 watcher 多导致的性能问题, 同时, 每个组件都单独的虚拟 dom, 也避免虚拟 dom 大导致的性能问题
- react 将 jsx 编译成 js 执行, 所以语法都是 js 本身的语法和特征
- vue 是自己的语法, vue 通过语法检测数据是否是需要监听的, 在 vue3中做到了极致, vue3对代码进行精准的分类, 只有需要监听的数据更改才进行虚拟 dom 的修改, 不需要监听的数据, 越过了虚拟 dom 检测, 速度更快
### 小知识
Q: vue 在引入虚拟 dom 后, 需不需要 react 的分片来提高性能?
A: 不需要, vue 的虚拟 dom 是组件级别, 所以虚拟 dom 不大, 进行 diff 不会有性能问题
## 清单应用
编写一个清单应用, 类似于各种 TODO 程序, 用户在输入框中写要做的事情, 回车会加入到下面的若干 TODO 列表中, 同时列表某一条可以点击完成, 呈现出不同的效果
### 思想的转变
接触过传统的 JS+BootStrop 的开发者来讲, 可能对于这种需求, 思路是找到输入框并进行监听, 当用户输入后, 先在 dom 中找到对应元素, 然后进行修改dom, 这种思路需要转变
对于 MVVM 方式的框架来讲, 我们只需要关注数据是怎么变化, 而不是 dom 怎么操作
### 列表的加载
我们先进行数据的展示, 之前说过, 我们只关注数据, 在 vue 中, 我们可以在 dom 中使用 `{{}}` 来进行已定义的数据展示, 使用 `v-for`可以循环列表类型的数据
``` html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/vue@next"></script>
</head>

<body>
    <div id="app">
        <ul>
            <!-- v-for 循环 todos, 每个值叫 todo, li 的值为每个 todo -->
            <li v-for="todo in todos"> {{todo}} </li>
        </ul>
    </div>
</body>
<script>
    // 建立变量 App
    const App = {
        // data() 返回监听的变量
        data() {
            return {
                todos: ["吃饭", "睡觉"],
            }
        },
    }
    // 创建 App, 绑定到 id app
    Vue.createApp(App).mount("#app")
</script>

</html>
```
### 数据的追加
MVVM 中, 数据的修改, 框架会自己监听并重新渲染 dom
使用`@keydown.enter`监听键盘回车事件, 执行方法`addTodo`
在这里, 你会发现, 当数据 todos 进行变化后, 相对应的 dom 会自己发生变化, 这就是 MVVM 的奇妙之处, 数据驱动页面
``` html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/vue@next"></script>
</head>

<body>
    <div id="app">
        <!-- 监听变量 title 的值-->
        <h2>{{title}}</h2>
        <!-- v-model 将 input 值绑定到变量 title -->
        <!-- @keydown.enter 在回车键时触发方法 addTodo -->
        <input type="text" v-model="title" @keydown.enter="addTodo">
        <ul>
            <!-- v-for 循环 todos, 每个值叫 todo, li 的值为每个 todo -->
            <li v-for="todo in todos"> {{todo}} </li>
        </ul>
    </div>
</body>
<script>
    // 建立变量 App
    const App = {
        // data() 返回监听的变量
        data() {
            return {
                title: "",
                todos: ["吃饭", "睡觉"],
            }
        },
        // methods 设置方法
        methods: {
            // 设置 addTodo 方法
            addTodo() {
                // this 指的是自己, 也就是 App
                // 如果 title 为空, 不添加, 目的是防止无输入直接回车
                if (this.title === ""){
                    return
                }
                this.todos.push(this.title)  // 给 todos 列表新增一个值为用户输入的 title 值
                this.title = ""  // 将 title 设置为空
            }
        }
    }
    // 创建 App, 绑定到 id app
    Vue.createApp(App).mount("#app")
</script>

</html>
```
### 添加完成按钮和效果
TODO 都是可以进行选中完成的, 我们也要实现, 为了给每个 todo 添加是否完成的标识, 我们将 todo 的类型从字符串变成对象
还是那句话, 数据驱动页面, 当我们的 checkbox 的 checked 属性发生变化时, 也会重新渲染对应的 dom, 导致 class 也动态的增减
``` html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/vue@next"></script>
</head>

<body>
    <div id="app">
        <!-- 监听变量 title 的值-->
        <h2>{{title}}</h2>
        <!-- v-model 将 input 值绑定到变量 title -->
        <!-- @keydown.enter 在回车键时触发方法 addTodo -->
        <input type="text" v-model="title" @keydown.enter="addTodo">
        <ul>
            <!-- v-for 循环 todos, 每个值叫 todo, li 的值为每个 todo -->
            <li v-for="todo in todos">
                <!-- 当 type 为 checkbox 时, v-mode 绑定的变量如果是数组时, 作为 checkbox 的 value 使用, 当为 bool 时, 作为 checkbox 的 checked 值使用 -->
                <!-- 使用 todo.done 属性标识是否选中 -->
                <input type="checkbox" v-model="todo.done">
                <!-- vue 中, : 用来传递数据, 这里的意思是, 如果 todo.done 为真, 则将 css done 传递给 class -->
                <span :class="{done:todo.done}">{{todo.text}}</span>
            </li>
        </ul>
    </div>
</body>
<script>
    // 建立变量 App
    const App = {
        // data() 返回监听的变量
        data() {
            return {
                title: "",
                todos: [
                    { done: false, text: "吃饭" },
                    { done: true, text: "睡觉" }
                ],
            }
        },
        // methods 设置方法
        methods: {
            // 设置 addTodo 方法
            addTodo() {
                // this 指的是自己, 也就是 App
                // 如果 title 为空, 不添加, 目的是防止无输入直接回车
                if (this.title === "") {
                    return
                }
                this.todos.push({
                    done: false,
                    text: this.title
                })  // 给 todos 列表新增一个值为用户输入的 title 值
                this.title = ""  // 将 title 设置为空
            }
        }
    }
    // 创建 App, 绑定到 id app
    Vue.createApp(App).mount("#app")
</script>
<style>
    /* 颜色变灰, 中间加划线 */
    .done {
        color: gray;
        text-decoration: line-through;
    }
</style>

</html>
```
### 添加统计
在页面添加未完成的数量和全部数量
``` html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/vue@next"></script>
</head>

<body>
    <div id="app">
        <!-- 监听变量 title 的值-->
        <h2>{{title}}</h2>
        <!-- v-model 将 input 值绑定到变量 title -->
        <!-- @keydown.enter 在回车键时触发方法 addTodo -->
        <input type="text" v-model="title" @keydown.enter="addTodo">
        <ul>
            <!-- v-for 循环 todos, 每个值叫 todo, li 的值为每个 todo -->
            <li v-for="todo in todos">
                <!-- 当 type 为 checkbox 时, v-mode 绑定的变量如果是数组时, 作为 checkbox 的 value 使用, 当为 bool 时, 作为 checkbox 的 checked 值使用 -->
                <!-- 使用 todo.done 属性标识是否选中 -->
                <input type="checkbox" v-model="todo.done">
                <!-- vue 中, : 用来传递数据, 这里的意思是, 如果 todo.done 为真, 则将 css done 传递给 class -->
                <span :class="{done:todo.done}">{{todo.text}}</span>
            </li>
        </ul>
        <!-- 在 html 中写代码的方式虽然可行, 但是不推荐!, 并且性能不好! -->
        <div>
            <!-- .filter 对 todos 进行筛选, () 内是筛选规则, v 是每个 todo, 如果为 true 则此 v 筛选通过 -->
            <!-- 这里统计未完成数量, 因此对 v.done 进行反转, 如果 done 为 true, 反转为 false, 筛选失败, 反之成功 -->
            {{todos.filter(v=>!v.done).length}}
            /
            <!-- .length 计算列表长度 -->
            {{todos.length}}
        </div>
    </div>
</body>
<script>
    // 建立变量 App
    const App = {
        // data() 返回监听的变量
        data() {
            return {
                title: "",
                todos: [
                    { done: false, text: "吃饭" },
                    { done: true, text: "睡觉" }
                ],
            }
        },
        // methods 设置方法
        methods: {
            // 设置 addTodo 方法
            addTodo() {
                // this 指的是自己, 也就是 App
                // 如果 title 为空, 不添加, 目的是防止无输入直接回车
                if (this.title === "") {
                    return
                }
                this.todos.push({
                    done: false,
                    text: this.title
                })  // 给 todos 列表新增一个值为用户输入的 title 值
                this.title = ""  // 将 title 设置为空
            }
        }
    }
    // 创建 App, 绑定到 id app
    Vue.createApp(App).mount("#app")
</script>
<style>
    /* 颜色变灰, 中间加划线 */
    .done {
        color: gray;
        text-decoration: line-through;
    }
</style>

</html>
```
如同注释所说, 虽然在html 中编写代码的方式可以实现, 但是并不推荐, 有如下问题:
- 把 JS 代码放置进了 body 中, 不美观
- 使用 vue 的计算属性功能, 会将结果进行缓存优化(当这个属性在多地方使用时, 只计算一次), 避免每次的重复计算导致性能问题
下面, 我们使用计算属性功能来完成统计
``` html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/vue@next"></script>
</head>

<body>
    <div id="app">
        <!-- 监听变量 title 的值-->
        <h2>{{title}}</h2>
        <!-- v-model 将 input 值绑定到变量 title -->
        <!-- @keydown.enter 在回车键时触发方法 addTodo -->
        <input type="text" v-model="title" @keydown.enter="addTodo">
        <ul>
            <!-- v-for 循环 todos, 每个值叫 todo, li 的值为每个 todo -->
            <li v-for="todo in todos">
                <!-- 当 type 为 checkbox 时, v-mode 绑定的变量如果是数组时, 作为 checkbox 的 value 使用, 当为 bool 时, 作为 checkbox 的 checked 值使用 -->
                <!-- 使用 todo.done 属性标识是否选中 -->
                <input type="checkbox" v-model="todo.done">
                <!-- vue 中, : 用来传递数据, 这里的意思是, 如果 todo.done 为真, 则将 css done 传递给 class -->
                <span :class="{done:todo.done}">{{todo.text}}</span>
            </li>
        </ul>
        <div>
            <!-- 直接调用计算属性 -->
            {{active}}/{{all}}
        </div>
    </div>
</body>
<script>
    // 建立变量 App
    const App = {
        // data() 返回监听的变量
        data() {
            return {
                title: "",
                todos: [
                    { done: false, text: "吃饭" },
                    { done: true, text: "睡觉" }
                ],
            }
        },
        // methods 设置方法
        methods: {
            // 设置 addTodo 方法
            addTodo() {
                // this 指的是自己, 也就是 App
                // 如果 title 为空, 不添加, 目的是防止无输入直接回车
                if (this.title === "") {
                    return
                }
                this.todos.push({
                    done: false,
                    text: this.title
                })  // 给 todos 列表新增一个值为用户输入的 title 值
                this.title = ""  // 将 title 设置为空
            }
        },
        // computed 设置 vue 的计算属性
        computed: {
            // active 属性, 返回 done 为 false 的长度
            active() {
                return this.todos.filter(v => !v.done).length
            },
            // all 属性, 返回总长度
            all() {
                return this.todos.length
            }
        }
    }
    // 创建 App, 绑定到 id app
    Vue.createApp(App).mount("#app")
</script>
<style>
    /* 颜色变灰, 中间加划线 */
    .done {
        color: gray;
        text-decoration: line-through;
    }
</style>

</html>
```
### 全选
我们需要加入一个全选框, 当点击全选时, 所有todo 都选中, 并且, 当手动将所有 todo 选中时, 全选框默认变为勾选状态
计算属性, 不止可以用来做数据统计, 也可以修改对应的数据, 例如
``` html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/vue@next"></script>
</head>

<body>
    <div id="app">
        <!-- 监听变量 title 的值-->
        <h2>{{title}}</h2>
        <!-- v-model 将 input 值绑定到变量 title -->
        <!-- @keydown.enter 在回车键时触发方法 addTodo -->
        <input type="text" v-model="title" @keydown.enter="addTodo">
        <div>
            <!-- checkbox 绑定 allDone 计算属性, 生成时调用 get 方法, 返回 bool, 作为 checkbox 的 checked 使用 -->
            <!-- 当点击 checkbox 时, 计算属性发生变化, 将 checked 作为参数调用 allDone 的 set 方法 -->
            全选<input type="checkbox" v-model="allDone">
            <span>{{active}}/{{all}}</span>
        </div>
        <ul>
            <!-- v-for 循环 todos, 每个值叫 todo, li 的值为每个 todo -->
            <li v-for="todo in todos">
                <!-- 当 type 为 checkbox 时, v-mode 绑定的变量如果是数组时, 作为 checkbox 的 value 使用, 当为 bool 时, 作为 checkbox 的 checked 值使用 -->
                <!-- 使用 todo.done 属性标识是否选中 -->
                <input type="checkbox" v-model="todo.done">
                <!-- vue 中, : 用来传递数据, 这里的意思是, 如果 todo.done 为真, 则将 css done 传递给 class -->
                <span :class="{done:todo.done}">{{todo.text}}</span>
            </li>
        </ul>
        <div>
            <!-- 直接调用计算属性 -->
            {{active}}/{{all}}
        </div>
    </div>
</body>
<script>
    // 建立变量 App
    const App = {
        // data() 返回监听的变量
        data() {
            return {
                title: "",
                todos: [
                    { done: false, text: "吃饭" },
                    { done: true, text: "睡觉" }
                ],
            }
        },
        // methods 设置方法
        methods: {
            // 设置 addTodo 方法
            addTodo() {
                // this 指的是自己, 也就是 App
                // 如果 title 为空, 不添加, 目的是防止无输入直接回车
                if (this.title === "") {
                    return
                }
                this.todos.push({
                    done: false,
                    text: this.title
                })  // 给 todos 列表新增一个值为用户输入的 title 值
                this.title = ""  // 将 title 设置为空
            }
        },
        // computed 设置 vue 的计算属性
        computed: {
            // active 属性, 返回 done 为 false 的长度
            active() {
                return this.todos.filter(v => !v.done).length
            },
            // all 属性, 返回总长度
            all() {
                return this.todos.length
            },
            // 计算属性为对象时, 可以通过定义 get 和 set 方法来修改属性
            allDone: {
                // get 在获取计算属性时触发
                get() {
                    // 调用 this.active 计算属性, active 返回的是 done 为 false 的长度, 这里与0进行比较, 为0代表全部勾选, 返回 true
                    return this.active === 0
                },
                // set 在计算属性发生变化时触发
                set(val) {
                    console.log(val)
                    // forEach 是循环
                    // 循环 todos , 将每个 done 设置为 val
                    this.todos.forEach(todo => {
                        todo.done = val
                    });
                }
            }
        }
    }
    // 创建 App, 绑定到 id app
    Vue.createApp(App).mount("#app")
</script>
<style>
    /* 颜色变灰, 中间加划线 */
    .done {
        color: gray;
        text-decoration: line-through;
    }
</style>

</html>
```
### 清空按钮
快完成了, 我们添加一个清空按钮在输入框之后, 要求点击清空则将所有已完成条目删除, 而当没有已完成条目时, 按钮不展示
使用 v-if 来进行条件筛选渲染
``` html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/vue@next"></script>
</head>

<body>
    <div id="app">
        <!-- 监听变量 title 的值-->
        <h2>{{title}}</h2>
        <!-- v-model 将 input 值绑定到变量 title -->
        <!-- @keydown.enter 在回车键时触发方法 addTodo -->
        <input type="text" v-model="title" @keydown.enter="addTodo">
        <!-- v-if 作为条件筛选, 当值为 true 才显示该 dom -->
        <!-- @click 在鼠标点击时触发, 这里调用 clear 方法 -->
        <button v-if="active<all" @click="clear">清理</button>
        <div>
            <!-- checkbox 绑定 allDone 计算属性, 生成时调用 get 方法, 返回 bool, 作为 checkbox 的 checked 使用 -->
            <!-- 当点击 checkbox 时, 计算属性发生变化, 将 checked 作为参数调用 allDone 的 set 方法 -->
            全选<input type="checkbox" v-model="allDone">
            <span>{{active}}/{{all}}</span>
        </div>
        <ul>
            <!-- v-for 循环 todos, 每个值叫 todo, li 的值为每个 todo -->
            <li v-for="todo in todos">
                <!-- 当 type 为 checkbox 时, v-mode 绑定的变量如果是数组时, 作为 checkbox 的 value 使用, 当为 bool 时, 作为 checkbox 的 checked 值使用 -->
                <!-- 使用 todo.done 属性标识是否选中 -->
                <input type="checkbox" v-model="todo.done">
                <!-- vue 中, : 用来传递数据, 这里的意思是, 如果 todo.done 为真, 则将 css done 传递给 class -->
                <span :class="{done:todo.done}">{{todo.text}}</span>
            </li>
        </ul>
        <div>
            <!-- 直接调用计算属性 -->
            {{active}}/{{all}}
        </div>
    </div>
</body>
<script>
    // 建立变量 App
    const App = {
        // data() 返回监听的变量
        data() {
            return {
                title: "",
                todos: [
                    { done: false, text: "吃饭" },
                    { done: true, text: "睡觉" }
                ],
            }
        },
        // methods 设置方法
        methods: {
            // 设置 addTodo 方法
            addTodo() {
                // this 指的是自己, 也就是 App
                // 如果 title 为空, 不添加, 目的是防止无输入直接回车
                if (this.title === "") {
                    return
                }
                this.todos.push({
                    done: false,
                    text: this.title
                })  // 给 todos 列表新增一个值为用户输入的 title 值
                this.title = ""  // 将 title 设置为空
            },
            clear() {
                // 将 todos 赋值为老的 todos 中 done 为 false 的部分
                // 去除了已经完成的条目
                this.todos = this.todos.filter(v => !v.done)
            }
        },
        // computed 设置 vue 的计算属性
        computed: {
            // active 属性, 返回 done 为 false 的长度
            active() {
                return this.todos.filter(v => !v.done).length
            },
            // all 属性, 返回总长度
            all() {
                return this.todos.length
            },
            // 计算属性为对象时, 可以通过定义 get 和 set 方法来修改属性
            allDone: {
                // get 在获取计算属性时触发
                get() {
                    // 调用 this.active 计算属性, active 返回的是 done 为 false 的长度, 这里与0进行比较, 为0代表全部勾选, 返回 true
                    return this.active === 0
                },
                // set 在计算属性发生变化时触发
                set(val) {
                    console.log(val)
                    // forEach 是循环
                    // 循环 todos , 将每个 done 设置为 val
                    this.todos.forEach(todo => {
                        todo.done = val
                    });
                }
            }
        }
    }
    // 创建 App, 绑定到 id app
    Vue.createApp(App).mount("#app")
</script>
<style>
    /* 颜色变灰, 中间加划线 */
    .done {
        color: gray;
        text-decoration: line-through;
    }
</style>

</html>
```
### 添加空置提示
最后一步!, 我们为这个清单应用添加最后一个功能: 当清单为空时, 展示目前没有数据
我们这里搭配使用 `v-if` 与 `v-else`, 来做分支处理, 当然还可以搭配 `v-else-if` 针对多分支处理
``` html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/vue@next"></script>
</head>

<body>
    <div id="app">
        <!-- 监听变量 title 的值-->
        <h2>{{title}}</h2>
        <!-- v-model 将 input 值绑定到变量 title -->
        <!-- @keydown.enter 在回车键时触发方法 addTodo -->
        <input type="text" v-model="title" @keydown.enter="addTodo">
        <!-- v-if 作为条件筛选, 当值为 true 才显示该 dom -->
        <!-- @click 在鼠标点击时触发, 这里调用 clear 方法 -->
        <button v-if="active<all" @click="clear">清理</button>
        <div>
            <!-- checkbox 绑定 allDone 计算属性, 生成时调用 get 方法, 返回 bool, 作为 checkbox 的 checked 使用 -->
            <!-- 当点击 checkbox 时, 计算属性发生变化, 将 checked 作为参数调用 allDone 的 set 方法 -->
            全选<input type="checkbox" v-model="allDone">
            <span>{{active}}/{{all}}</span>
        </div>
        <!-- 如果长度不为0代表目前有数据, 展示数据 -->
        <ul v-if="all!==0">
            <!-- v-for 循环 todos, 每个值叫 todo, li 的值为每个 todo -->
            <li v-for="todo in todos">
                <!-- 当 type 为 checkbox 时, v-mode 绑定的变量如果是数组时, 作为 checkbox 的 value 使用, 当为 bool 时, 作为 checkbox 的 checked 值使用 -->
                <!-- 使用 todo.done 属性标识是否选中 -->
                <input type="checkbox" v-model="todo.done">
                <!-- vue 中, : 用来传递数据, 这里的意思是, 如果 todo.done 为真, 则将 css done 传递给 class -->
                <span :class="{done:todo.done}">{{todo.text}}</span>
            </li>
        </ul>
        <!-- v-else 必须紧跟在 v-if 的 dom 之后, 当 if 不通过执行渲染 else 内容 -->
        <div v-else>
            暂无数据
        </div>
        <div>
            <!-- 直接调用计算属性 -->
            {{active}}/{{all}}
        </div>
    </div>
</body>
<script>
    // 建立变量 App
    const App = {
        // data() 返回监听的变量
        data() {
            return {
                title: "",
                todos: [
                    { done: false, text: "吃饭" },
                    { done: true, text: "睡觉" }
                ],
            }
        },
        // methods 设置方法
        methods: {
            // 设置 addTodo 方法
            addTodo() {
                // this 指的是自己, 也就是 App
                // 如果 title 为空, 不添加, 目的是防止无输入直接回车
                if (this.title === "") {
                    return
                }
                this.todos.push({
                    done: false,
                    text: this.title
                })  // 给 todos 列表新增一个值为用户输入的 title 值
                this.title = ""  // 将 title 设置为空
            },
            clear() {
                // 将 todos 赋值为老的 todos 中 done 为 false 的部分
                // 去除了已经完成的条目
                this.todos = this.todos.filter(v => !v.done)
            }
        },
        // computed 设置 vue 的计算属性
        computed: {
            // active 属性, 返回 done 为 false 的长度
            active() {
                return this.todos.filter(v => !v.done).length
            },
            // all 属性, 返回总长度
            all() {
                return this.todos.length
            },
            // 计算属性为对象时, 可以通过定义 get 和 set 方法来修改属性
            allDone: {
                // get 在获取计算属性时触发
                get() {
                    // 调用 this.active 计算属性, active 返回的是 done 为 false 的长度, 这里与0进行比较, 为0代表全部勾选, 返回 true
                    return this.active === 0
                },
                // set 在计算属性发生变化时触发
                set(val) {
                    console.log(val)
                    // forEach 是循环
                    // 循环 todos , 将每个 done 设置为 val
                    this.todos.forEach(todo => {
                        todo.done = val
                    });
                }
            }
        }
    }
    // 创建 App, 绑定到 id app
    Vue.createApp(App).mount("#app")
</script>
<style>
    /* 颜色变灰, 中间加划线 */
    .done {
        color: gray;
        text-decoration: line-through;
    }
</style>

</html>
```
## 初探 vue3 新特性
相比于 vue2, vue3 的优势是什么?
### vue2 的历史遗留问题
- vue2 使用 `Flow.js` 作为类型校验, 但是`Flow.js`已经停止维护, 整个社区都在使用`TypeScript` 来构建基础库, vue 也需要这样
- vue2 内部运行时, 直接执行浏览器的 API, 这样在跨端时, 就需要适配多端,的否则会出现问题
- vue2 并不是真正意义上的代理(响应式), 而是基于 `Object.defineProperty()`实现的, 这是对某个属性进行拦截, 有一些缺陷, 比如无法监听删除(vue 使用 $delete 辅助才能达到效果)
- vue2 使用 OptionApi, 在代码比较多时, 对于功能的修改, 需要兼顾`data`, `methods`代码块, 比较麻烦
### vue3的新特性
**RFC 机制**
这与代码无关, 这是 vue 团队的开发工作方式, 对于新的功能和语法, 先放置在 github 征求意见, 任何人都可以讨论和尝试实现
**响应式系统**
之前说过, vue2使用`Object.defineProperty()`实现响应式, 而开发者必须将`defineProperty`监听的数据明确的写在代码中, 这是因为, `defineProperty` 对于不存在的属性无法拦截, 因此必须在`data`中声明监听变量
而 vue3 可以使用 `proxy` , 他的代码类似于
``` html
    new Proxy(obj, {
        get(){},
        set(){}
    })
```
`proxy`对 obj 是什么属性不做关心, 统一拦截, 还可以监听更多的格式数据, 例如`Set/Map`等
需要注意的是, `Proxy`不支持 IE11 以下的浏览器
`Proxy`是浏览器的新特性, 这代表着, 框架随着更新会和浏览器相辅相成, 一起为前端提供更多可能.
**自定义渲染**
vue2 内部的模块都是揉和在一起的, 导致扩展比较困难, 而 vue3 使用流行的 `monorepo` 的拆包管理方式, 将模块剥离, 进行解耦.
**全部模块使用 TS 进行重构**
TS(TypeScript)带来了系统类型, 能让代码的提示更为智能, 同时提高代码的健壮性
这里博主也推荐大家有空学习一下 TS, 类型注解可以让代码的编写更为得心应手.
并且 TypeScript 也是目前前端流行的技术, 很多框架都已经使用 TS 来进行底层的编写
**Compostion API**
Composition API 作者将他称之为组合 API, 从 DEMO 来了解他们的不同
比如我们使用 vue2 来编写一个累加器, 并且有一个计算属性显示累加器 x2的结果
``` html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/vue@next"></script>
</head>

<body>
    <div id="app">
        <!-- 点击触发 add 函数 count*2, double 计算*2结果 -->
        <h1 @click="add">{{count}} x 2 = {{double}}</h1>  
    </div>
</body>
<script>
    // 建立变量 App
    const App = {
        data(){
            return{
                count: 1
            }
        },
        methods: {
            add(){
                this.count += 1
            }
        },
        computed:{
            double(){
                return this.count * 2
            }
        }
    }
    // 创建 App, 绑定到 id app
    Vue.createApp(App).mount("#app")
</script>


</html>
```
而在 vue3 里, 我们可以使用 `setup` 来写
``` html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="https://unpkg.com/vue@next"></script>
</head>

<body>
    <div id="app">
        <!-- 点击触发 add 函数 count*2, double 计算*2结果 -->
        <h1 @click="add">{{state.count}} x 2 = {{double}}</h1>  
    </div>
</body>
<script>
    // 导入所需的模块
    const {reactive, computed} = Vue
    // 建立变量 App
    let App = {
        // setup 这里返回 App 的一些方法和变量等
        setup(){
            // 新建 state 对象
            const state = reactive({
                count: 1  // count 属性
            })
            // 新建 add 方法
            function add(){
                // count 属性+1
                state.count += 1
            }
            // 创建 double 的计算属性
            const double = computed(()=>state.count * 2)
            return {state, add, double}  // 返回到外层
        }
    }
    // 创建 App, 绑定到 id app
    Vue.createApp(App).mount("#app")
</script>


</html>
```
使用新版的组合 api 之后, 表面看代码反而繁琐了, 但是之前的 OptionsAPI 有几个严重的问题:
- 所有的数据都挂载在 this 里, 因此对于类型推倒很不友好, 并且在清理和代码分块时很难受
- 新增功能都要修改 data, method 块, 维护困难
- 代码难以复用, 因为代码都糅杂在一起, 还可能会出现命名冲突
而使用组合 API 之后, 好处多多:
- api 都是通过 import 引入, 不需要的模块无需引入
- 将某块功能所有的 methods/data 封装在一个独立的函数中, 复用很容易, 也没有冲突问题
- 组合 api 新增的 return 等语句, 在实际项目中可清除
**新增组件**
vue3新增了若干组件, 比如:
- Fragment: 不再要求有一个唯一的根节点, 清理无用的 div 标签
- Teleport: 允许组件渲染在别的元素内, 在开发弹窗组件时特别有用
- Suspense: 异步请求组件
**Vite**
Vite 跟 vue3 并不是绑定关系, 和 vue 也不是强制绑定, Vite 的竞品是 Webpack, 主要提升开发的体验
传统的 webpack, 在打包时, 是将所有的代码和页面打包完成再启动, 可能需要几分钟, 而 Vite 是阶梯式打包, 按需加载, 这样大大提升了开发体验
## vue2 如何升级到  vue3
原作者说了很多, 大致是使用一些工具来进行升级
但是我个人认为, 如果是已经完成或者开发中的 vue2 项目, 不建议升级到 vue3, 我做过一些项目, 我认为前端组件的版本升级带来的问题很多, 尤其是不兼容问题. 所以我不建议对已有的项目进行升级
而对于新的项目, 可以使用 vue3来从头开始
## 搭建 vue3 项目的第一步
### 环境准备
你必须首先安装以下软件:
- NodeJs
### 初始化代码
找到你的工作目录, 命令行输入
``` bash
npm init @vitejs/app
```
初始化会让你输入项目的名字, 这里我们输入 student
``` bash
➜  Vue npm init @vitejs/app

@vitejs/create-app is deprecated, use npm init vite instead

? Project name: › student
```
之后选择 vue 的项目
``` bash
? Select a framework: › - Use arrow-keys. Return to submit.
    vanilla
❯   vue
    react
    preact
    lit
    svelte
```
回车后再选择 vue(javaScript) 或者 vue-ts(typeScript语言), 这里我们先选择普通的 vue, 方便学习, 之后学习了 TS 之后, 可以选择 vue-ts
``` bash
? Select a variant: › - Use arrow-keys. Return to submit.
❯   vue
    vue-ts
```
之后就创建成功了项目
``` bash
Scaffolding project in /Users/chenming/Work/Code/Vue/student...

Done. Now run:

  cd student
  npm install
  npm run dev
```
而后在当前文件夹就生成了一个新的文件夹 student
我们使用 vscode 打开 student 目录
现在目录下就会生成若干文件
``` bash
➜  student tree
.
├── README.md
├── index.html     入口文件
├── package.json
├── public   资源文件夹
│   └── favicon.ico
├── src   源码
│   ├── App.vue     组件
│   ├── assets
│   │   └── logo.png
│   ├── components
│   │   └── HelloWorld.vue
│   └── main.js   入口
└── vite.config.js   vite 配置

4 directories, 9 files
```
### 运行
此时脚手架就算搭建完成, 然后我们执行命令来安装依赖
``` bash
npm install
```
执行完命令后, 会在当前路径下生成新的文件夹`node_modules`, 里面存放下载的依赖文件, 通常, 该文件夹不应上传到代码仓库, 而是由开发者本地生成
再执行命令, 在本地启动 dev 环境
``` bash
npm run dev

> student@0.0.0 dev
> vite


  vite v2.9.14 dev server running at:

  > Local: http://localhost:3000/
  > Network: use `--host` to expose

  ready in 177ms.

```
而后浏览器打开网址 `http://localhost:3000/`, 会出现欢迎页面代表成功
同时, 我们修改文件 `src/APP.vue` 的内容, 会发现网页会同步刷新, 这样就给我们的开发提供了很大的便利
同时, 因为我们的开发是多页面, 同时要和后端进行交互, 因此我们还需要安装两个组件来帮助我们完成需求, 分别是`vuex(管理数据)`和`vue-router(管理路由)`
``` bash
npm install vuex@next vue-router@next
```
