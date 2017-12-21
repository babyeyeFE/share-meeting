# 什么是Promise

Promise在英语里的意思是：“承诺”，它表示如A调用一个长时间的任务B的时候，B将返回一个“承诺”给A,A不用关心整个实施过程，继续做自己的任务；当B实施完成的时候，会通过A，并将执行A之间的预先约定的回调。

Promise 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件监听——更合理和更强大。它由社区最早提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了`Promise`对象。

所谓`Promise`，简单说就是一个容器，里面保存着某个**未来**才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供**统一的 API**，各种异步操作都可以用同样的方法进行处理。

Promise是一种封装和组合未来值的易于复用的机制

既然是对象，那么就有**属性**和**方法** 

## 属性

`Promise.length`：长度属性，其值总是为 1 (构造器参数的数目).

[`Promise.prototype`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/prototype)：表示 `Promise` 构造器的原型.

## 方法

- [`Promise.all(iterable)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
- [`Promise.race(iterable)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)


- [`Promise.reject(reason)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject)


- [`Promise.resolve(value)`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)


# 基本用法

```js
new Promise((resolve, reject) => {
  // 待处理的异步逻辑
  // 处理结束后，调用resolve或reject方法
})
```

新建一个`promise`很简单，只需要`new`一个`Promise`对象即可。所以`Promise`本质上就是一个函数，它接受一个函数作为参数，并且会返回`promise对象`，这就给链式调用提供了基础。

## 三种状态

其实`Promise`函数的使命，就是构建出它的实例，并且负责帮我们管理这些实例。而这些实例有以下三种状态：

1. pending: 初始状态，位履行或拒绝
2. fulfilled: 意味着操作成功完成
3. rejected: 意味着操作失败



> # Promise States
> A promise must be in one of three states: pending, fulfilled, or rejected.
>
> - When pending, a promise:
>   - may transition to either the fulfilled or rejected state.
> - When fulfilled, a promise:
>   - must not transition to any other state.
>   - must have a value, which must not change.
> - When rejected, a promise:
>   - must not transition to any other state.
>   - must have a reason, which must not change.

`pending` 状态的 `Promise对象`可能以 `fulfilled`状态返回了一个值，也可能被某种理由（异常信息）拒绝（`reject`）了。当其中任一种情况出现时，`Promise` 对象的 `then` 方法绑定的处理方法（`handlers`）就会被调用，`then`方法分别指定了`resolve`方法和`reject`方法的回调函数

[![alt promise图解](https://mengera88.github.io/images/promises.png)](https://mengera88.github.io/images/promises.png)

简单的示例:

```js
const promise = new Promise((resolve, reject) => {
  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
})

promise.then(value => {
  // 如果调用了resolve方法，执行此函数
}, error => {
  // 如果调用了reject方法，执行此函数
})
```

用Promise封装ajax

```js
const request = (url) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.send()
    xhr.onload = () => resolve(JSON.parse(xhr.responseText))
    xhr.onerror = () => reject(new Error(xhr.responseText))
  })
}

request('http://update.babyeye.com/releases/upgrade.json')
  .then(response => {
    console.log(response)
  })
  .catch(err => {
    console.log(err)
  })
```

## then

每一个 promise 都会提供给你一个 `then()` 函数 (或是 `catch()`，实际上只是 `then(null, ...)` 的语法糖)。它接收两个函数作为参数，`then(onFilfulled, onRejected)`。`onFilfulled`是成功的操作，`onRejected`是失败的操作。我们在 `then()` **函数**内部可以做三种事情：

- return 另一个promise
- return 一个同步的值（或者undefined）
- throw一个同步异常

### return另一个promise

```js
request('1.txt')
  .then(() => {
    return request('2.txt')
  })
  .then(response => {
    console.log(response)      // 2222222222
  })
  .catch(err => {
    console.log(err)
  })

// 这里这里是return第二个promise,这个return非常重要。如果没有写return,那么request('2.txt')将会出问题，并且下一个函数将会接收到undefined,而不是2222222222，请看下面的例子
```



```js
request('1.txt')
  .then(() => {
    request('2.txt')     // 这里没有return
  })
  .then(response => {
    console.log(response)  // 这里的值将是undefined
  })
  .catch(err => {
    console.log(err)
  })
```

### 返回一个同步值（或者undefined）

```js
request('1.txt')
  .then(() => {
    return 100    // 返回一个同步值
  })
  .then(response => {
    console.log(response)    // 100
  })
  .catch(err => {
    console.log(err)
  })

// 返回同步值相当于用Promise包裹了一层
// 上面的return 100 相当于 return Promise.resolve(100)
```

### 抛出同步异常

```js
request('1.txt')
  .then(() => {
    a()       // a未定义
    return 100
  })
  .then(
    response => {
      console.log('then0000', response)
    },
    err => {
      return err
    })
  .then(
    response => {
      console.log('then1111', response)     // then1111 ReferenceError: a is not defined
    },
    err => {
      console.log('then2222', err)
    })
  .catch(err => {
    console.log('catch3333', err)
  })
```

```js
request('1.txt')
  .then(() => {
    a()
    return 100
  })
  .then(
    response => {
      console.log('then0000', response)
    },
    err => {
      throw err
    })
  .then(
    response => {
      console.log('then1111', response)
    },
    err => {
      console.log('then2222', err)         // then2222 ReferenceError: a is not defined
    })
  .catch(err => {
    console.log('catch3333', err)
  })
```

# 为什么使用Promise

## 异步不能使用try…catch

try…catch当然很好，但是无法跨异步操作工作。

```js
function foo() {
  request('1.txt')      // 异步操作
    .then(response => {
      a()               // 因为a没有定义
      console.log(response)
    })
}

try {
  foo()                // 所以执行到foo()的时候从a()抛出全局错误
} catch (err) {
  console.log(err)     // 永远不会到达这里
}
```

error-first

```js
function b() {
  c()             // c未定义，报错
  return 'b'
}
function foo(callback) {
  request('1.txt')
    .then(response => {
      try {
        callback(null, b())      // b里面是同步代码，所以错误会被捕捉到
      } catch (err) {
        callback(err)
      }
    })
}

foo((err, data) => {
  if (err) {
    console.log('错误', err)     // 错误 ReferenceError: c is not defined
  } else {
    console.log('成功', data)
  }
})

```

捕获成功了! 但是我们接着往下看

```js
function b() {
  return request('2.txt')
}
function foo(callback) {
  request('1.txt')
    .then(response => {
      try {
        b().then(response => {
          c()         // c没有定义，会报错，但是不会被捕捉到
          callback(null, response)
        })
      } catch (err) {
        callback(err)
      }
    })
}

foo((err, data) => {
  if (err) {
    console.log('错误', err)
  } else {
    console.log('成功', data)
  }
})

// Uncaught (in promise) ReferenceError: c is not defined
```

上面的代码有什么问题呢？ 很明显，错误没有被捕获到

只有在`try`里面调用同步的立即成功或失败的情况下，这里的`try…catch`才会工作。如果`try`里面还有异步完成函数，其中的任何异步错误都无法捕捉到。

多级error-first回调交织在一起，再加上这些无所不在的`if`检查语句，都不可避免地导致了回调地狱的风险。

## callback hell

![callback hell](https://s1.ax1x.com/2017/12/17/OuXQg.png)

![回调维护成本大](https://s1.ax1x.com/2017/12/20/XckDg.png)

# 链式调用

```js
// request为封装好的Promise
request('http://update.babyeye.com/releases/upgrade.json')
  .then(response => {
    console.log('获取第一个数据', response)
    request('http://update.babyeye.com/releases/upgrade.json')
      .then(response => {
        console.log('获取第二个数据', response)
      })
  })
  .catch(err => {
    console.log(err)
  })
```

问题：Promise回调地狱

正确的姿势

```js
request('http://update.babyeye.com/releases/upgrade.json')
  .then(response => {
    console.log('获取第一个数据', response)
    return request('http://update.babyeye.com/releases/upgrade.json')
  })
  .then(response => {
    console.log('获取第二个数据', response)
  })
  .catch(err => {
    console.log(err)
  })
```

Promise.prototype.then方法返回的是一个新的Promise对象，因此可以采用链式写法。

```js
const p = new Promise((resolve, reject) => {
  resolve(100)
})

p
  .then(response => {
    console.log(response)    // 100
    return response * 2
  })
  .then(response => {
    console.log(response)   // 200
  })
```

# 错误处理

```js
// 写法一
const promise = new Promise((resolve, reject) => {
  try {
    throw new Error('test')
  } catch(e) {
    reject(e)
  }
})
promise.catch(error => {
  console.log(error)
})

// 写法二
const promise = new Promise((resolve, reject) => {
  reject(new Error('test'))
})
promise.catch(error => {
  console.log(error)
})
```

比较上面两种写法，可以发现`reject`方法的作用，等同于抛出错误。

如果 Promise 状态已经变成`resolved`，再抛出错误是无效的。

```js
const promise = new Promise((resolve, reject) =>{
  resolve('ok')
  throw new Error('test')   // 错误不会被抛出，因为Promise的状态一旦改变就永久保持该状态不会再变了
})
promise
  .then(value => console.log(value))    // ok
  .catch(error => console.log(error))
```

## catch

Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个`catch`语句捕获。

一般来说，不要在`then`方法里面定义 Reject 状态的回调函数（即`then`的第二个参数），总是使用`catch`方法。

```js
// bad
promise.then(data => {
  // success
}, err => {
  // error
})

// good
promise
  .then(data => {
    // success
  })
  .catch(err => {
    // error
  })
```

## 吃掉错误

先看一段同步代码

```js
console.log(a)   // 会报错，因为a没有定义
setTimeout(() => console.log('123'), 100)
// 第一行代码报错，程序退出进程，终止脚本，所以不会输出 ”123“
```

再看Promise

```js
const p = new Promise((resolve, reject) => {
  resolve(a)     // 会报错，因为a没有定义
})
setTimeout(() => console.log('123'), 100)   // 依然打印出”123“
// 内部有语法错误。浏览器运行到错误的这一行，会打印出错误提示ReferenceError: a is not defined，但是不会退出进程、终止脚本执行，200 毫秒之后还是会输出123。这就是说，Promise 内部的错误不会影响到 Promise 外部的代码，通俗的说法就是“Promise 会吃掉错误”。
```

一般总是建议，Promise 对象后面要跟`catch`方法，这样可以处理 Promise 内部发生的错误。`catch`方法返回的还是一个 Promise 对象，因此后面还可以接着调用`then`方法。

# Promise.resolve

如果我们经常写下面这样的代码

```js
new Promise((resolve, reject) => {
  resolve(同步值);
}).then(/* ... */);
```

那么我用`Promise.resolve`会更加简洁

```js
Promise.resolve(同步值).then(/* ... */)
```

`Promise.resolve()`常用于创建一个已完成的Promise,但是`Promise.resolve(...)`也会展开`thenable`值。在这种情况下，返回的`Promise`采用传入的这个thenable的最终决议值，可能是完成，也可能是拒绝。

```js
const fulfilled = {
    then(cb) {
      cb(42)
    }
  }

  const rejected = {
    then(cb, errCb) {
      errCb('err')
    }
  }

  const p1 = Promise.resolve(fulfilled)     // p1是完成的promise
  const p2 = Promise.resolve(rejected)      // p2是拒绝的promise

  console.log(p1)      // [[PromiseStatus]]: "resolved"  [[PromiseValue]]: 42
  console.log(p2)      // [[PromiseStatus]]: "rejected"  [[PromiseValue]]: "err"
```



- 如果向`Promise.resolve(…)`传递一个非Promise、非thenable的立即值，就会得到一个用这个值填充的promise。

```js
const p1 = new Promise(resolve => {
  resolve(100)
})

const p2 = Promise.resolve(100)
// 以上两种情况， promise p1和promise p2的行为是完全一样的
```

- 如果向`Promise.resolve(...)`传递一个真正的Promise，就只会返回同一个promise

```js
const p1 = Promise.resolve(100)
const p2 = Promise.resolve(p1)

p1 === p2      // true
```

# Promise.reject

创建一个已被拒绝的Promise的快捷方式是使用`Promise.reject()`,所以以下两个promise是等价的：

```js
const p1 = new Promise((resolve, reject) => {
  reject('err')
})
const p2 = Promsie.reject('err')
```

# Promise.all

```js
Promise.resolve([1, 2, 3])
  .then(list => {
    list.forEach(item => {
      Promise.resolve(item)
        .then(val => {
          console.log('forEach' + val)  // 同步
        })
    })
  })
  .then(result => {
    console.log('遍历完了', result)
  })
  .catch(err => {
    console.log(err)
  })

// forEach1
// forEach2
// forEach3
// 遍历完了undefined
```

异步

```js
Promise.resolve([1, 2, 3])
  .then(list => {
    list.forEach(item => {
      Promise.resolve(item)
        .then(n => {
          request(`${n}.txt`)
            .then(response => console.log(response))   // 异步
        })
    })
  })
  .then(result => {
    console.log('遍历完了' + result)
  })
  .catch(err => {
    console.log(err)
  })

// 遍历完了undefined
// forEach1
// forEach2
// forEach3
```



那么我们怎么在Promise中使用forEach呢？

```js
Promise.resolve([1, 2, 3])
  .then(list => {
    return Promise.all(list.map(item => request(item + '.txt')))
  })
  .then(([data1, data2, data3]) => {
    console.log('全部请求完毕', data1)
    console.log('全部请求完毕', data2)
    console.log('全部请求完毕', data3)
  })
  .catch(err => {
    console.log(err)
  })

// 全部请求完毕 111111111111
// 全部请求完毕 222222222222
// 全部请求完毕 333333333333
```

对`Promise.all([...])`来说，只有传入的所有`promise`都完成，返回`promise`才能完成。如果有任何`promise`被拒绝，返回的主`promise`就立即会被拒绝。如果完成的话，我们会得到一个数组，其中包含传入的所有`promise`完成值。对于拒绝的情况，我们只会得到一个拒绝`promise`的理由。

```js
// 需求：在请求1.txt和2.txt之后再请求3.txt
const p1 = request('1.txt')
const p2 = request('2.txt')
Promise.all([p1, p2])
  .then(([result1, result2]) => {
    // 这里可以把p1,和p2完成后的值传入
    return request('3.txt')
  })
  .then(result3 => {
    console.log(result3)
  })

```

`Promise.all([...])`需要一个参数，是一个数组通常由`Promise`实例组成。从`Promise.all[(...)]`调用返回的`promise`会收到一个完成消息，这是一个由所有传入promise的完成消息组成的数组，与指定的顺序一致（与完成顺序无关）

<u>严格来说，传给`Promise.all([...])`的数组中的值可以是Promise、thenable、甚至是立即值。就本质而言，列表中的每个值都会通过`Promise.resolve(...)`过滤，以确保要等待的是一个真正的`Promise`,所以立即值会被规范化为这个值构建的`Promise`。如果数组是空的，主Promise就会立即完成。</u>

# Promise.race

对于`Promise.race(...)`来说，一旦有任何一个`Promise`决议完成，`Promise,race([...])`就会完成，一旦有任何一个`Promise`决议为拒绝，它就会拒绝。

```js
  const p1 = Promise.resolve(42)
  const p2 = Promise.resolve('完成')
  const p3 = Promise.reject('err')

  Promise.race([p1, p2, p3])
    .then(result => {
      console.log(result)       // 42
    })

  Promise.all([p1, p2])
    .then(result => {
      console.log(result)      // [42, "完成"]
    })

  Promise.all([p1, p2, p3])
    .then(result => {
      console.log(result)
    })
    .catch(err => {
      console.log('错误', err)  // 错误 err
    })
```

```js
const timeoutResolve = (time, value) => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, time, value)
    })
  }

  const timeoutReject = (time, reason) => {
    return new Promise((resolve, reject) => {
      setTimeout(reject, time, reason)
    })
  }
console.log(timeoutResolve())
  Promise.race([
    timeoutResolve(1000, '1000毫秒resolve'),
    timeoutResolve(40, '40毫秒resolve'),
    timeoutReject(50, '50毫秒reject')
  ])
    .then(
      value => console.log('resolve', value),
      reason => console.log('reject', reason)
    )
// resolve 40毫秒resolve
```

**注意：**如果向`Promise.all([...])`传入空数组，它会立即完成，但`Promise.race([...])`会挂住，且永远不会决议。

# 穿透

```js
Promise.resolve('foo')
  .then(Promise.resolve('bar'))
  .then(result => {
    console.log(result)
  })

// foo
```

我们以为会输出`'bar'`,实际上却输出`'foo'`，这是为什么呢？上面我们说到`then`函数接收两个**函数**作为参数，但是如果我们不传函数作为参数会怎么样呢？

它实际上会将其解释为 `then(null)`，这就会导致前一个 promise 的结果会穿透下面。

```js
Promise.resolve('foo')
  .then(null)
  .then(result => {
    console.log(result)
  })
// 这段代码和上一段效果是一样的
// foo
```

添加任意数量的 `then(null)`，它依然会打印 `foo`。

**正确姿势**

```js
Promise.resolve('foo')
  .then(() => Promise.resolve('bar'))
  .then(result => {
    console.log(result)
  })
// bar
```

**记住:**永远在`then()`中传递函数

# 期待async/await

更加语义化

# 参考文档

[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

[Promise/A+规范](https://promisesaplus.com/)

[ECMAScript 6 入门 -- 阮一峰](http://es6.ruanyifeng.com/#docs/promise)

[你不知道的JavaScript:异步与性能 第三章-Promise](https://github.com/melodyVoid/You-Dont-Know-JS/blob/1ed-zh-CN/async%20%26%20performance/ch3.md)



