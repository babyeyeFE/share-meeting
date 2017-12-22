Promise.resolve([1, 2, 3])
  .then(list => {
    return Promise.all(list.map(item => request(item + '.txt')))
  })
  .then(list => {
    const [data1, data2, data3] = list
    console.log('全部请求完毕', data1)
    console.log('全部请求完毕', data2)
    console.log('全部请求完毕', data3)
  })
  .catch(err => {
    console.log(err)
  })

// 两种解构方式，大家根据自己的口味随意挑选
Promise.resolve([1, 2, 3])
  .then(list => {
    return Promise.all(list.map(item => request(item + '.txt')))
  })
  .then(([data1, data2, data3]) => {
    console.log('全部请求完毕', data1)
    console.log('全部请求完毕', data2)
    console.log('全部请求完毕', data3)
  })
  .catch(err => {
    console.log(err)
  })

// 但是强烈拒绝下面的写法，语义化太差，基本没有语义
Promise.resolve([1, 2, 3])
  .then(list => {
    return Promise.all(list.map(item => request(item + '.txt')))
  })
  .then(list => {
    console.log('全部请求完毕', list[0])
    console.log('全部请求完毕', list[1])
    console.log('全部请求完毕', list[2])
  })
  .catch(err => {
    console.log(err)
  })