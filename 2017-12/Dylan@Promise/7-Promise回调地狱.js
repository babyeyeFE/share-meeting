// Promise回调地狱

request('1.txt')
  .then(response => {
    console.log(response)
    request('2.txt')
      .then(response => {
        console.log(response)
        request('3.txt')
          .then(response => {
            console.log(response)
          })
      })
  })


// 正确姿势

request('1.txt')
  .then(response => {
    console.log(response)
    return request('2.txt')
  })
  .then(response => {
    console.log(response)
    return request('3.txt')
  })
  .then(response => {
    console.log(response)
  })