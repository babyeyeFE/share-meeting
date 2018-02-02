# Generator

## generator能扮演的角色

### 1. generator作为迭代器(数据生产者)

### 2. generator作为观察者(数据消费者)

### 3. 协作程序(协同多任务)

考虑到generator是可以暂停的并且可以同时作为数据生产者和消费者，不会做太多的工作就可以把generator转变成协作程序(合作进行的多任务)

先看一个简单的例子：

```js
let x = 1
function foo() {
  x++
  bar()
  console.log('x:', x)
}

function bar() {
  x++
}

foo()  // x: 3
```

```js
let x = 1
function *foo() {
  x++
  yield
  console.log('x:', x)
}

function bar() {
  x++
}
```

那么我们如何用generator函数把任务进行协作呢？

```js
const gen = foo()  // 生成器函数执行，返回一个生成器对象
gen.next()   // 启动生成器，遇到yield就会暂停
console.log(x)  // 2 遇到yield会暂停
bar()   // 执行bar() x变为3
gen.next()  // x: 3
```

我们可以看到generator函数通过`yield`暂停，可以和其他任务进行协作

```js
function *foo() {
  let x = yield 2
  z++
  let y = yield (x * z)
  console.log(x, y, z)
}

let z = 1

const gen1 = foo()
const gen2 = foo()

let value1 = gen1.next().value  // 2
let value2 = gen2.next().value  // 2

value1 = gen1.next( value2 * 10 ).value   // 40
value2 = gen2.next( value1 * 5 ).value    // 600

gen1.next( value2 / 2 )  // 20 300 3
gen2.next( value1 / 4 )  // 200 10 3
```

 ## 异步迭代生成器

生成器与异步编码模式及解决回调问题等有什么关系呢？

```js
// 封装一个ajax, error-first风格
function ajax(url, callback) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.send()
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          callback(null, JSON.parse(xhr.responseText))
        } catch (e) {
          callback(e)
        }
      } else {
        console.log('出错了')
      }
    }
  }
}
```

```js
function getData(url, callback) {
  ajax(url, callback)
}
const url = 'http://update.babyeye.com/releases/upgrade.json'
getData(url, (err, data) => {
  if (err) {
    console.log('捕获错误', err)
  } else {
    console.log('获取数据', data)
  }
})
```

接下来我们用生成器实现

```js
function getDataGen(url) {
  ajax(url, (err, data) => {
    if (err) {
      // 向 *foo()抛出一个错误
      gen.throw(err)
    } else {
      // 用收到的data恢复 *foo()
      gen.next(data)
    }
  })
}

function *foo() {
  try {
    const data = yield getDataGen(url)
    console.log(data)
  } catch (e) {
    console.log(e)
  }
}

const gen = foo()  // 生成generator对象
gen.next()   // 启动
```

从本质上而言，我们把异步最为实现细节抽象了出去，使得我们可以以同步顺序的形式追踪流程控制：“发出一个ajax请求，等它完成后打印出响应结果。”并且，当然，我们只在这个流程控制中表达了这两个步骤，而这种表达能力是可以无限扩展的，以便我们无论需要多少步骤都可以表达。

### 同步错误处理

前面生成器代码还给我们带来了其他的好处，让我们把注意力转移到生成器内部的`try...catch`

```js
try {
  const data = yield getDataGen(url)
  console.log(data)
} catch (e) {
  console.log(e)
}
```

我们知道`try...catch`是无法捕捉到异步错误的。

精彩的部分在于`yield`暂停也使得生成器能够捕获错误。是怎么做到的呢，我们往下看

```js
if (err) {
  // 向 *foo()抛出一个错误
  gen.throw(err)
} else {
  // 用收到的data恢复 *foo()
  gen.next(data)
}
```

生成器`yield`暂停的特性意味着我们不仅能够从异步函数调用得到看似同步的返回值，还可以同步捕获来自这些异步函数调用的错误。

所以我们已经知道，我们可以把错误抛入生成器中，不过如果是从生成器向外抛出错误呢？

```js
function *bar() {
  const x = yield 'Hello'
  const y = x.toLowerCase()  // 引发一个异常
  console.log('永远不会到这里')
}

const it = bar()
it.next()
try {
  it.next(42)
} catch(e) {
  console.log(e)
}
```

我们也可以捕获到。

## Generator + Promise

首先复习一下Promise,这里用Promise封装一个原生ajax

```js
function request(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.send()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText))
        } else {
          reject(xhr.responseText)
        }
      }
    }
  })
}
```

在前面的ajax例子的生成器代码中，`getDataGen(..)`没有返回值(undefined),并且我们的迭代器控制代码并不关心`yield`出来的值。

而这里支持Promise的`request(..)`返回了一个promise。这暗示我们可以通过`request(..)`构造一个promise,然后通过生成器把它`yield`出来，然后迭代器控制代码就可以接收到这个promise了。

**问题：**迭代器应该对这个promise做些什么呢？

**它应该监听这个promise的决议（完成或拒绝），然后要么使用完成消息(next)恢复生成器运行,要么向生成器抛出(throw)一个带有拒绝原因的错误。**

**重要：获得Promise和生成器最大效用的最自然的方法就是`yield`出来一个promise,然后通过这个promise来控制生成器的迭代器。**

```js
// 这里的代码完全不需要改变(和上面的foo基本一样)
function *foo2() {
  try {
    const response = yield request(url)
    console.log('Generator + Promise', response)
  } catch(e) {
    console.log(e)
  }
}

```

但现在如何运行`foo2`呢？还有一些实现细节需要补充，来实现接收和连接`yield`出来的promise,使它能够在决议之后恢复生成器。先从手工实现开始：

```js
const gen2 = foo2()
const p = gen2.next().value
// 等待promise协议
p.then(response => {
  gen2.next(response)
}, err => {
  gen2.throw(err)
})
```

那么多个呢？

```js
function *foo2() {
  try {
    const response = yield request(url)
    console.log('Generator + Promise', response)
    const response2 = yield request(url)
    console.log('p2', response2)
  } catch(e) {
    console.log(e)
  }
}

const gen2 = foo2()
const p = gen2.next().value
// 等待promise协议
p.then(response => {
  return gen2.next(response).value
}, err => {
  gen2.throw(err)
})
.then(response => {
  gen2.next(response)
}, err => {
  gen2.throw(err)
}) 
```

封住一个简单的`runner`

```js
function runner(generator) {
  const gen = generator()
  const p = gen.next().value
  if (p.then) {
    p.then(response => {
      gen.next(response)
    }, err => {
      gen.throw(err)
    })
  }
}

runner(function *() {
  const response = yield request(url)
  console.log('runner', response)
})
```

多个请求呢？

```js
// 动手实现一个co

function co(generator) {
  const gen = generator()
  step(gen.next())
  function step ({ value, done }) {
    if (!done) {
      value
        .then(response => step(gen.next(response)))
        .catch(err => gen.throw(err))
    }
  }
}
```

```js
co(function *() {
  const response = yield request(url)
  console.log('co1', response)
  const response2 = yield request(url)
  console.log('co2', response2)
})
```

如果喜欢，还可以把`step`函数拿出来

```js
function co2(generator) {
  const gen = generator()
  step2(gen, gen.next())
}

function step2(gen, { value, done}) {
  if (!done) {
    value
      .then(response => step2(gen, gen.next(response)))
      .catch(err => step2(gen, gen.throw(err)))
  }
}

co2(function *() {
  const response = yield request(url)
  console.log('co1111', response)
  const response2 = yield request(url)
  console.log('co2222', response2)
})

```

整个过程多么巧妙，生成器  `yield`  出 Promise ，然后其控制生成器的迭代器来执行它，直到结束—是非常强大有用的一种方法。如果我们能够无需辅助工具函数库(比如co)就好了，别急，我们接着往下看。

# ES7:async/await

```js
async function fetchData() {
  try {
    const response = await request(url)
    console.log('async/await', response)
  } catch(e) {
    console.log(e)
  }
}

fetchData()
```

可以用箭头函数

```js
const fetchData = async () => {
  try {
    const response = await request(url)
    console.log('async/await', response)
  } catch(e) {
    console.log(e)
  }
}

fetchData()
```

# 生成器中的 Promise 并发

借用上面的 `co`

```js
co(function *() {
  const res1 = yield request(url1)
  const res2 = yield request(url2)

  const res3 = yield request(url3)
  console.log(res3)
})
```

这段代码的意思其实是请求 `url1` 得到 `res1` 之后再请求 `url2`  得到 `res2` 后再请求 `url3` 然后得到 `res3`，是有依赖的。

那么怎么并发请求呢？

最简单的方法：

```js
co(function *() {
  // 让两个请求并行执行
  const p1 = request(url)
  const p2 = request(url)
  // 等待两个promise都决议
  const res1 = yield p1
  const res2 = yield p2

  const res3 = yield request(url)
  console.log(res3)
})
```

仔细比较上面两段代码的区别。

**观察一下 `yield` 的位置，p1 和 p2 是并发执行的用于 ajax 请求的 Promise。哪一个先完成都无所谓，因为 promise 会按照需要在决议状态保持任意长时间。**

**然后我们使用接下来的两个 `yield` 语句等待并取得 promise 的决议（分别写入 res1 和 res2）。如果 p1 先决议，那么 `yield p1` 就会先恢复执行，然后等待 `yield p2` 恢复。如果 p2 先决议，它就会耐心保持其决议值等待请求，但是 `yield p1` 将会先等待，直到 p1 决议。**

**不管哪种情况，p1 和 p2 都会并发执行，无论完成顺序如何，两者都要全部完成，然后才会发出 `const res3 = yield request(url)` 的 ajax 请求。**

接下来我们用定时器来模拟一下耗时的 ajax 请求

```js
function five() {
  return new Promise(resolve => {
    setTimeout(resolve, 5000, '5秒')
  })
}

function two() {
  return new Promise(resolve => {
    setTimeout(resolve, 2000, '2秒')
  })
}
```

```js
// 模拟第一段代码
console.time('7s')
co(function *() {
  const res1 = yield two()
  const res2 = yield five()
  console.log(res1, res2)
  console.timeEnd('7s')   // 7s: 7009.35595703125ms
  const res3 = yield request(url)
  console.log(res3)
})
// 我们可以看出耗时 7s，说明请求不是并发
```

```js
// 模拟第二代代码
console.time('5s')
co(function *() {
  const p1 = two()
  const p2 = five()

  const res1 = yield p1
  const res2 = yield p2
  console.log(res1, res2)
  console.timeEnd('5s')   // 5s: 5001.36376953125ms
  const res3 = yield request(url)
  console.log(res3)
})
// 我们可以看出耗时 5s，说明请求是并发
```

## Promise.all 并发

**还记得 `Promise.all(..)` 吗？**

```js
// 用 Promise.all(..) 并发执行异步请求
co(function *() {
  const results = yield Promise.all([
    request(url),
    request(url)
  ])
  const [res1, res2] = results
  console.log(res1, res2)
  const res3 = yield request(url)
  console.log(res3)
})
```

继续用我们的定时器做验证

```js
console.time('Promise.all')
co(function *() {
  const results = yield Promise.all([
    two(),
    five()
  ])
  const [res1, res2] = results
  console.log(res1, res2)
  console.timeEnd('Promise.all') // Promise.all: 5001.491943359375ms
  const res3 = yield request(url)
  console.log(res3)
})
```

## 隐藏 Promise

作为一个风格方面的提醒：要注意你的生成器内部包含了多少 Promise 逻辑。我们介绍的使用生成器实现异步的方法的全部要点在于创建简单、顺序、看似同步的代码，将异步的细节尽可能隐藏起来。

比如，这可能是一个简洁的方案。

```js
// 将 Promise.all 抽象出来
const all = (url1, url2) => Promise.all([request(url1), request(url2)])

co(function *() {
  const [res1, res2] = yield all(url, url) // 隐藏 all 内部基于 Promise 的并发细节 
  console.log(res1, res2)
  const res3 = request(url)
  console.log(res3)
})
```

# 小结

生成器是 ES6 的一个新的函数类型，它并不像普通函数那样总是运行到结束。取而代之的是，生成器可以在运行当中（完全保持其状态）暂停，并且将来再从暂停的地方恢复运行。

这种交替的暂停和恢复时合作性的而不是抢占式的，这意味着生成器具有独一无二的能力来暂停自身，这是通过关键字 `yield` 实现的。不过，只有控制生成器的迭代器具有恢复生成器的能力（通过 `next(..)`）。

`yield/next()..` 这一对不自是一种控制机制，实际上也是一种双向消息传递机制。`yield ..`表达式本质上是暂停下来等待某个值，接下来的 `next(..)` 调用会向被暂停的 `yield` 表达式传回一个值（或者是隐式的 undefined）。

在异步流程控制方面，生成器的关键优点是：生成器内部的代码是以自然的同步 / 顺序方式表达任务的一系列步骤。其技巧在于，我们把可能的异步隐藏在了关键字 `yield` 的后面，把异步移动到了控制生成器的迭代器的代码部分。

换句话说，生成器为异步代码保持了顺序、同步、阻塞的代码模式，这是的大脑可以更自然地追踪代码，解决了基于回调的异步的两个关键缺陷之一。

# 参考资料

 [你不知道的JavaScript:ES6与未来--第三章:组织](https://github.com/getify/You-Dont-Know-JS/blob/1ed-zh-CN/es6%20%26%20beyond/ch3.md)

[Genertaors](http://exploringjs.com/es6/ch_generators.html#sec_generators-as-coroutines)

[你不知道的JavaScript:异步与性能--第四章:Generator](https://github.com/getify/You-Dont-Know-JS/blob/1ed-zh-CN/async%20%26%20performance/ch4.md)