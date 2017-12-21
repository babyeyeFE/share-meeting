// then函数里面要做的事情

// 1.返回一个promise
request('1.txt')
  .then(() => request('2.txt'))
  .then(val => console.log(val))

// 注意return
request('1.txt')
  .then(() => {
    // request('2.txt')
    return request('2.txt')
  })
  .then(val => console.log(val))



// 2.返回一个同步值

request('1.txt')
  .then(() => {
    return 100
  })
  .then((val) => console.log(val))

// 相当于用Promise.resolve()包裹了一下
request('1.txt')
  .then(() => {
    return Promise.resolve(100)
  })
  .then((val) => console.log(val))



// 3.抛出异常

request('1.txt')
  .then(() => {
    a()    // 错误
    return 100
  })
  .then(response => {
    console.log('then0', response)
  }, err => {
    return err     // 这里是return
  })
  .then(response => {
    console.log('then1', response)    // 到达这里
  }, err => {
    console.log('then2', err)
  })
  .catch(err => {
    console.log('catch', err)
  })

request('1.txt')
  .then(() => {
    a()    // 错误
    return 100
  })
  .then(response => {
    console.log('then0', response)
  }, err => {
    // throw err         // 这里是throw
    return Promise.reject(err)     // 或者return 一个Promise.reject()
  })
  .then(response => {
    console.log('then1', response)
  }, err => {
    console.log('then2', err)      // 就会到达这里
  })
  .catch(err => {
    console.log('catch', err)
  })
