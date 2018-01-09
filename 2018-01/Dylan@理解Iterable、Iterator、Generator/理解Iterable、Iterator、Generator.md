# 什么是迭代器(Iterator)?

[迭代器协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#迭代器协议)

当一个对象被认为是一个迭代器时，它实现了一个 `next() `的方法并且拥有以下含义：对象的`next`方法是一个无参函数，它返回一个对象，该对象拥有`done`和`value`两个属性：

- `done`: 布尔值
  - 如果迭代器已经经过了被迭代序列时为`true`。这时`value`可能描述了该迭代器的返回值。
  - 如果迭代器可以产生序列中的下一个值，则为`false`。这等效于连同`done`属性也不指定。
- `value`:迭代器返回的任何JavaScript值。`done`为true时可省略

手写一个简单迭代器

```js
let i = 0
const iterator = {
  next() {
    return {
      value: i++,
      done: false,
    }
  }
}

console.log(iterator.next())    // { value: 0, done: false}
console.log(iterator.next())    // { value: 1, done: false}
console.log(iterator.next())    // { value: 2, done: false}
```

一些迭代器是转换自**可迭代对象**:

```js
const arr = [1, 2, 3]
const arrEntries = arr.entries()
const arrKeys = arr.keys()
const arrVal = arr[Symbol.iterator]()
console.log(arrEntries)  // Array Iterator
console.log(arrKeys)  // Array Iterator
console.log(arrVal)   // Array Iterator

console.log(arrEntries.next())  // { value: [0, 1], done: false}
console.log(arrEntries.next())  // { value: [1, 2], done: false}
console.log(arrEntries.next())  // { value: [2, 3], done: false}
console.log(arrEntries.next())  // { value: undefined, done: true}
```

## next()迭代

让我们来看一个数组，它是一个可迭代对象，可以生成一个迭代器来消费它的值：

```js
const arr = [1, 2, 3]
const it = arr[Symbol.iterator]()  // 生成迭代器
// next()迭代
it.next();		// { value: 1, done: false }
it.next();		// { value: 2, done: false }
it.next();		// { value: 3, done: false }

it.next();		// { value: undefined, done: true }
```

每一次定位在`[Symbol.iterator]`上的方法在值`arr`上被调用时，它都将生成一个全新的迭代器。

```js
const arr = [1, 2, 3]
const it = arr[Symbol.iterator]()  // 生成迭代器
const it2 = arr[Symbol.iterator]()  // 生成迭代器2
console.log(it === it2)   // false
```

基本类型的字符串值也默认地是可迭代对象

```js
const str = 'hello'
const it = str[Symbol.iterator]()
console.log(it.next())    // { value: 'h', done: false }
console.log(it.next())    // { value: 'e', done: false }
```

- 一个迭代器的`next(…)`方法能够可选地接收一个或多个参数
- **大多数内建的迭代器不可以**
- **Generator的迭代器可以**

根据一般的惯例，包括所有的内建迭代器，在一个已经被耗尽的迭代器上调用`next(…)`不是一个错误，而是简单地持续返回结果`{ value: undefined, done: true }`。

## 可选的return(..)

`return(..)`被定义为向一个迭代器发送一个信号，告知它消费者代码已经完成而且不会再从它那里抽取更多的值。这个信号可以用于通知生产者（应答`next(..)`调用的迭代器）去实施一些可能的清理作业，比如释放/关闭网络，数据库，或者文件引用资源。

如果一个迭代器拥有`return(..)`，而且发生了可以自动被解释为非正常或者提前终止消费迭代器的任何情况，`return(..)`就将会被自动调用。你也可以手动调用`return(..)`。

## 可选的throw(..)

`throw(..)`被用于向一个迭代器发送一个异常/错误信号，与`return(..)`隐含的完成信号相比，它可能会被迭代器用于不同的目的。它不一定像`return(..)`一样暗示着迭代器的完全停止。

例如，在generator迭代器中，`throw(..)`实际上会将一个被抛出的异常注射到generator暂停的执行环境中，这个异常可以用`try..catch`捕获。一个未捕获的`throw(..)`异常将会导致generator的迭代器异常中止。

## 注意

- 在迭代器接口上的可选方法 —— `return(..)`和`throw(..)` —— 在大多数内建的迭代器上都没有被实现。但是，它们在generator的上下文环境中会用到。
- 根据一般的惯例，在`return(..)`或`throw(..)`被调用之后，一个迭代器就不应该在产生任何结果了。

# 什么是可迭代对象(Iterable)？

满足[可迭代协议](https://link.juejin.im/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FIteration_protocols%23%25E5%258F%25AF%25E8%25BF%25AD%25E4%25BB%25A3%25E5%258D%258F%25E8%25AE%25AE)的对象是可迭代对象。
[可迭代协议](https://link.juejin.im/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FIteration_protocols%23%25E5%258F%25AF%25E8%25BF%25AD%25E4%25BB%25A3%25E5%258D%258F%25E8%25AE%25AE): 对象的`[Symbol.iterator]`值是一个无参函数，该函数返回一个迭代器。

在ES6中，所有的集合对象（`Array`、 `Set` 与 `Map`）以及`String`、`arguments`都是可迭代对象，它们都有默认的迭代器。

**内建迭代器(iterator)也是可迭代对象(iterable)**

```js
const arr = [1, 2, 3]
// 调用arr的[Symbol.iterator]()返回一个迭代器
const it = arr[Symbol.iterator]()
// 满足可迭代协议的对象是可迭代对象
// it仍然有[Symbol.iterator]()方法,它返回的结果是一个迭代器(它自己)
console.log(it[Symbol.iterator]() === it)   // true
console.log(arr[Symbol.iterator]() === arr) // false  因为arr不是迭代器，而是可迭代对象

console.log(...it) // 1 2 3
```

**自定义迭代器可以通过给予迭代器一个简单地返回它自身的`[Symbol.iterator]`方法，就可以使它成为一个可迭代对象**

```js
let i = 0
const iterator = {
  // 使迭代器iterator成为一个可迭代对象
  [Symbol.iterator]() { return this },
  next() {
    return {
      value: i++,
      done: false,
    }
  }
}
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator[Symbol.iterator]() === iterator)  // true
for (const val of iterator) {
  if (val > 10) break
  console.log(val)
}
```

可迭代对象可以在以下语句中使用：

## [for...of循环](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...of)

```js
for (let value of ['a', 'b', 'c']) {
  console.log(value);
}
// "a"
// "b"
// "c"
```

### 理解`for...of`循环

`for...of`接受一个可迭代对象（Iterable），或者能被强制转换/包装成一个可迭代对象的值（如'abc'）。遍历时，`for...of`会获取可迭代对象的`[Symbol.iterator]()`，对该迭代器逐次调用next()，直到迭代器返回对象的`done`属性为`true`时，遍历结束，不对该value处理。

```js
const arr = ['a', 'b', 'c']
for (let value of arr) {
  console.log(value);
}
// "a"
// "b"
// "c"
```

```js
const arr = ['a', 'b', 'c']
for (let val, res, it = arr[Symbol.iterator]();(res = it.next() && !res.done;)) {
  val = res.value
  console.log(val)
}
// "a"
// "b"
// "c"
```

## [扩展运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_operator)

```js
// rest
const [a, b, ...c] = [1, 2, 3, 4, 5]
console.log(a, b, c)  // 1, 2, [3, 4, 5]

// spread
console.log([a, ...c, b]) // [1, 3, 4, 5, 2]
[...'abc'];   // ['a', 'b', 'c']
console.log(...['a', 'b', 'c']);   // 'a', 'b', 'c'
```

## [解构赋值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

```js
const a = [1, 2, 3, 4, 5]
const it = a[Symbol.iterator]()
const [x, y] = it  // 仅从`it`中取前两个元素
const [z,...w] = it  // 取第三个，然后一次取得剩下所有的

// `it`被完全耗尽了吗？是的
console.log(it.next())	// { value: undefined, done: true }

console.log(x)					// 1
console.log(y)					// 2
console.log(z)					// 3
console.log(w)					// [4,5]
```

## [yield*](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/yield*)

```js
function* gen() {
  yield* ['a', 'b', 'c'];
}

gen().next(); // { value: "a", done: false }
```

# 什么是生成器(Generator)?

**生成器**对象是由一个生成器函数（ [generator function](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/function*) ）返回的,并且它符合[可迭代协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#iterable)和[迭代器协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#iterator)。

## 生成器函数

生成器函数是能返回一个生成器的函数。生成器函数由放在function关键字之后的一个星号`*`来表示，并能使用新的`yield`关键字。

生成器函数简单地说就是可以暂停的函数

```js
function *fn() {
  let x = 0
  while(true) {
    yield 2 * x + 1
    x++
  }
}
const gen = fn()
console.log(gen.next().value)
```

### 语法

```js
function *foo() {
  //...
}
```

#### 执行一个Generator

虽然一个generator使用`*`进行声明，但是你依然可以像一个普通函数那样执行它：

```js
foo();
```

你依然可以传给它参数值，就像：

```js
function *foo(x,y) {
	// ..
}

foo( 5, 10 );
```

主要区别在于，执行一个generator，比如`foo(5,10)`，并不实际运行generator中的代码。取而代之的是，它生成一个迭代器来控制generator执行它的代码。

### yield

#### 暂停

Generator还有一个你可以在它们内部使用的新关键字，用来表示**暂停点**：`yield`。考虑如下代码：

```js
function *foo() {
	console.log(1)
	yield   // 暂停
	console.log(2)
}
const gen = foo()
console.log(gen.next())
console.log(gen.next())
```

#### 输入和输出

`yield`不只是暂停点，还可以在暂停generator时向外**输出**

```js
function *foo() {
  yield        // 不带值的yield默认yield undefined
  yield 1
  yield 2
}
const gen = foo()
console.log(gen.next())   // {value: undefined, done: false}
console.log(gen.next())   // {value: 1, done: false}
console.log(gen.next())   // {value: 2, done: false}
console.log(gen.next())   // {value: undefined, done: true}
```

`yield`不只是暂停点，还可以在暂停generator时等待一个**输入**值， 这个值稍后被用于各个表达式环境中

```js
function *foo() {
  const x = yield
  console.log(x)
}
const gen = foo()
gen.next(12)   // 第一个next()调用的作用仅仅是开始这个generator，只是为了后面的输入做准备
gen.next(5)     

// 5
```
坑：yield优先级问题

```js
function *foo() {
  const x = yield 2 + 1  // 等同于yield (2 + 1)
  console.log(x)
}
const gen = foo()
gen.next()
gen.next(5)     
// 5
```

```js
function *foo() {
  const x = (yield 2) + 1  // 首先yield 2, 然后 + 1
  console.log(x)
}
const gen = foo()
gen.next()
gen.next(5)     
// 6
```

## 生成器对象

### 生成器对象既是迭代器，有是可迭代对象

```js
function *foo() {
  yield 1
  yield 2
  yield 3
}
const gen = foo()
console.log(gen)
// gen有next()方法，满足迭代器协议，是迭代器
gen.next()   // { value: 1, done: false }
gen.next()   // { value: 2, done: false }
gen.next()   // { value: 3, done: false }
gen.next()   // { value: undefined, done: true }

// gen实现了[Symbol.iterator]接口，并返回一个迭代器，满足可迭代协议，所以是可迭代对象
gen[Symbol.iterator]() === gen   // true
const gen1 = foo()
[...gen1]   // 1, 2, 3
```

### 在生成器中`return `

遍历器返回对象的`done`值为`true`时迭代器即结束，不对该`value`处理。

```js
function *foo() {
  yield 1
  return 2
  yield 3
}
const gen = foo()
gen.next()   // {value: 1, done: false}
gen.next()   // {value: 2, done: true} 
gen.next()   // {value: undefined, done: true}
```

`done`值为true时迭代即结束，迭代不对该value处理。所以对这个迭代器遍历，不会对值`2`处理。

```js
function *foo() {
  yield 1
  return 2
  yield 3
}
const gen = foo()
console.log(...gen)   // 1
```

```js
function *foo() {
  yield 1
  return 2
  yield 3
}
function *bar() {
  yield 0
  yield *foo()
}
const gen = bar()
console.log(...gen)  // 0 1
```

```js
function *foo() {
  yield 1
  return 2
  yield 3
}
function *bar() {
  yield 0
  yield yield *foo()
   
}
const gen = bar()
console.log(...gen)   // 0 1 2   在这里拿到了return的2
```

### 在生成器中`throw`

```js
function *foo() {
  yield 1
  throw new Error('error')
  yield 2
}
const gen = foo()
console.log(gen.next())     // { value: 1, done: false }
console.log(gen.next())     // error
console.log(gen.next())     // 
```

**小结：**通过上面我们可以看出，`next()`可以产生三种类型的值

- 对于可迭代序列中的一项a, 它返回`{ value: a, done: false}`
- 对于可迭代序列的最后一项，明确是`return`返回的是b, 它返回`{ value: b, done: true }`,如果没有`return`,它返回`{ value:undefined, done: true }`
- 对于异常，它抛出这个异常。

### 生成器委托`yield*`

```js
function* g1() {
  yield 1;
  yield 2;
}

function *g2() {
  yield *g1();
  yield *[3, 4];
  yield *"56";
  yield *arguments;
}

var generator = g2(7, 8);
console.log(...generator);   // 1 2 3 4 "5" "6" 7 8
```

`yield*`考虑可迭代对象的最后一个值

```js
function *foo() {
  yield 'a'
  yield 'b'
  return 'c'
}
function *bar() {
  const x = yield *foo()
  console.log(x)
}
console.log([...bar()])   
// c
// ['a', 'b']
```

## generator能扮演的角色

### 1. generator作为迭代器(数据生产者)

每一个`yield`可以通过`next()`返回一个值，这意味着generator可以通过循环或递归生产一系列的值，因为generator对象实现了Iterable接口。

generators同时实现了接口Iterable 和 Iterator，这意味着，generator函数返回的对象*是一个迭代器也是一个可迭代的对象*。

```js
function *fibonacci() {
  let [a, b] = [0, 1]
  while (true) {
    yield a;
    [a, b] = [b, a + b]
  }
}
const gen = fibonacci()
for (const val of gen) {
  if (val > 100) break
  console.log(val)   // 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89
}
```

### 2. generator作为观察者(数据消费者)

`yield`可以通过`next()`接受一个值，这意味着generator变成了一个暂停执行的数据消费者直到通过`next()`给generator传递了一个新值。

作为观察者，生成器暂停，直到它接收到输入。有三种输入，通过接口指定的方法传输：

- `next()` 发送正常输入。
- `return()` 终止生成器。
- `throw()` 发出错误信号。

#### 2.1`next()`发送正常输入

```js
function *foo() {
  const [x, y, z] = [yield, yield, yield]
  console.log(x, y, z)
}
const gen = foo()
gen.next()
gen.next('1')
gen.next('2')
gen.next('3')
// 1 2 3
```

#### 2.2`return()`终止generator

`return()`在生成器里的`yield`的位置执行`return`

```js
function *foo() {
  yield 1
  yield 2
  yield 3
}
const gen = foo()
gen.next()   // { value: 1, done: false }
gen.return('end') // { value: 'end', done: true }
gen.next()   // { value: undefined, done: true }
```

**组织终止**

我们可以阻止`return()`终止generator如果`yield`是在`finally`块内（或者在`finally`中使用`return`语句）

```js
function *foo() {
  try {
    yield 1
    yield 2
  } finally {
    yield 3
    yield 4
  }
}
const gen = foo()
gen.next()  // { value: 1, done: false }
gen.return('not end')  // { value: 3, done: false }
gen.next()  // { value: 4, done: false }
gen.next()  // { value: "not end", done: true }
```

#### 2.3`throw()`一个错误

```js  
function *foo() {
  yield 1
  yield 2
  yield 3
}
const gen = foo()
gen.next()    // { value: 1, done: false }
gen.throw(new Error('error'))  // Uncaught Error: error
```

捕获一下

```js
function *foo() {
  try {
    yield 1
    yield 2
  } catch (e) {
    console.log('捕获到' + e)
  }
}
const gen = foo()
gen.next()    // { value: 1, done: false }
gen.throw(new Error('error'))   // 捕获到Error: error
```

### 3. 协作程序(协同多任务)

考虑到generator是可以暂停的并且可以同时作为数据生产者和消费者，不会做太多的工作就可以把generator转变成协作程序(合作进行的多任务)



### To be continued...



# 参考文档

[你不知道的JavaScript:ES6与未来--第三章:组织](https://github.com/getify/You-Dont-Know-JS/blob/1ed-zh-CN/es6%20%26%20beyond/ch3.md)

[Genertaors](http://exploringjs.com/es6/ch_generators.html#sec_generators-as-coroutines)

[你不知道的JavaScript:异步与性能--第四章:Generator](https://github.com/getify/You-Dont-Know-JS/blob/1ed-zh-CN/async%20%26%20performance/ch4.md)