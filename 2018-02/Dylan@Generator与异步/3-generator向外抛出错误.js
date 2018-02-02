function *foo() {
  const x = yield 'hello'
  const y = x.toUpperCase()
}

const gen = foo()
// console.log(gen.next().value)
gen.next()
try {
  gen.next(2)
} catch (err) {
  console.log(err)
}