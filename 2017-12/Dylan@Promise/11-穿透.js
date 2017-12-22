Promise.resolve('foo')
  .then(Promise.resolve('bar'))
  .then(result => {
    console.log(result)     // foo
  })

// 以上代码相当于
Promise.resolve('foo')
  .then(null)
  .then(result => {
    console.log(result)   // foo
  })

// 切记then里面传函数
Promise.resolve('foo')
  .then(() => Promise.resolve('bar'))
  .then(result => {
    console.log(result)   // bar
  })