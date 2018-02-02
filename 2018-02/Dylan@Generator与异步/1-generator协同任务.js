// let x = 1
// function foo() {
//   x++;
//   bar()
//   console.log('x',x)
// }
// function bar() {
//   x++
// }
// foo()

let x = 1
function *foo() {
  x++
  yield
  console.log('x', x)
}

function bar() {
   x++
}

const gen = foo()
gen.next()
console.log(x)
bar()
gen.next()