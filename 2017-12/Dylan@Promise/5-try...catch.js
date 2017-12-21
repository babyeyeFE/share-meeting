// try...catch

function foo() {
  // 同步的错误会被捕获到
  a()
  console.log('1111')
}
try {
  foo()
} catch (e) {
  console.log('catch-foo', e)
}



function bar() {
  // 异步的错误不会被捕获到
  request('1.txt')
    .then(response => {
      a()
      console.log(response)
    })
}
try {
  bar()
} catch (e) {
  console.log('catch-bar', e)
}