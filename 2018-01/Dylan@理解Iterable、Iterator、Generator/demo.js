// let i = 0
// const iterator = {
//   [Symbol.iterator]() {
//     return this
//   },
//   next() {
//     return {
//       done: false,
//       value: i++
//     }
//   }
// }
// for (let val of it) {
//   if (val > 5) break
//   console.log(val)
// }
// for (let val, res, it = iterator[Symbol.iterator](); (res = it.next()) && !res.done;) {
//   val = res.value
//   if (val > 5) break
//   console.log(val)
// }
//
//
// console.log(it.next())
// console.log(it.next())
// console.log(it.next())
// console.log(it.next())

// const arr = [1, 2, 3]
// const it = arr.entries()
// const it2 = arr.entries()
// console.log(it === it2)
// console.log(it)
// console.log(arr.entries().next())

// const str = 'hello'
// const it = str[Symbol.iterator]()
// console.log(it)
// rest
// const [a, b, ...c] = [1, 2, 3, 4, 5]
// console.log(a)
// console.log(b)
// console.log(c)
// // spread
// console.log([a, ...c, b])
// const arr = [1,2,3,4]
// const it = arr[Symbol.iterator]()
// const [x, y] = it
// const [a, b] = it
// console.log(x,y)
// console.log(a,b)

// const arr = [1,2,3,4]
// const it = arr[Symbol.iterator]()
// // console.log(it.next())
// // console.log(it.next())
// // console.log(it.next())
// // console.log(it.next())
// // console.log(it.next())

// console.log(...it)

// function *fn() {
//
//
//   const x = (yield 2) + 1
//   console.log(x)
// }
//
// const gen = fn(12)
// console.log(gen.next())
// gen.next(5)

// function *foo() {
//   yield 1
//   throw new Error('err')
//   yield 3
// }
// const gen = foo()
// gen.next()   // {value: 1, done: false}
// gen.next()   // {value: 2, done: true}
// gen.next()   // {value: undefined, done: true}

// function* g1() {
//   yield 1;
//   yield 2;
// }
//
// function *g2() {
//   // yield *g1();
//   yield 1
//   yield 2
//   yield *[3, 4];
//   yield *"56";
//   yield *arguments;
// }
//
// const generator = g2(7, 8);
// console.log(...generator);   // 1 2 3 4 "5" "6" 7 8
// function *foo() {
//   try {
//     yield 1
//     yield 2
//     yield 3
//   } catch (e) {
//     console.log('捕获到了' + e)
//   }
//   // yield 1
//   // yield 2
// }
// const gen = foo()
// // console.log(gen.next())
// // console.log(gen.return('return'))
// // console.log(gen.next())
// // // gen.throw()
//
// console.log(gen.next())
// console.log(gen.throw(new Error('error')))
// // console.log(gen.next())
// // console.log(gen.next())

// const arr = [1, 2, 3]


