// 吃掉错误

// console.log(a)      // a没有定义会报错，且终止进程，'1234'不会打印
// setTimeout(() => console.log('1234'), 100)

const p = new Promise((resolve, reject) => {
  resolve(a)     // a没有定义会报错，但是Promise会吃掉错误，'1234'依然会打印出来
})

setTimeout(() => console.log('1234'), 100)