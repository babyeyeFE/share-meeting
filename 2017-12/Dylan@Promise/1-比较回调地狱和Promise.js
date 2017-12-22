// setTimeout模拟异步请求
// 比较回调地狱和Promise

// 回调地狱
const fn = (cb) => {
  setTimeout(cb, 1000)
}

fn(() => {
  console.log(1)
  fn(() => {
    console.log(2)
    fn(() => {
      console.log(3)
      fn(() => {
        console.log(4)
      })
    })
  })
})


// Promise
const fn1 = () => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 1000)
  })
}

fn1()
  .then(() => {
    console.log(1)
    return fn1()
  })
  .then(() => {
    console.log(2)
    return fn1()
  })
  .then(() => {
    console.log(3)
    return fn1()
  })
  .then(() => {
    console.log(4)
    return fn1()
  })
