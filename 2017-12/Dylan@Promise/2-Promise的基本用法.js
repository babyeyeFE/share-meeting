// Promise的基本用法（伪代码）

// 第一步：创建一个Promise实例
const promise = new Promise((resolve, reject) => {
  if (异步调用成功) {
    resolve()
  } else {
    reject()
  }
})

// 第二步：用then方法来异步操作
promise
  .then(value => {
    // 如果调用resolve方法就执行此函数
  }, reason => {
    // 如果调用reject方法就执行此函数
  })
  .catch(err => {
    // 最佳实践，在结尾总有一个catch来捕获错误
    console.log(err)
  })