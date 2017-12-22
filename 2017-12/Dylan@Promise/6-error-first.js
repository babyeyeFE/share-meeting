// error firse

function b() {
  a()
  return 'b'
}

function foo(cb) {
  request('1.txt')
    .then(response => {
      try {
        cb(null, b())     // try里面是同步语句才能捕获错误
      } catch (err) {
        cb(err)
      }
    })
}

foo((err, data) => {
  if (err) {
    console.log('错误', err)
  } else {
    console.log('成功', data)
  }
})




// 将上面的代码注释后再执行下面的代码

// function b() {
//   return request('2.txt')
// }
//
// function foo(cb) {
//   request('1.txt')
//     .then(response => {
//       try {
//         b()
//           .then(response => {
//             c()
//             cb(null, response)
//           })
//       } catch (err) {
//         cb(err)
//       }
//     })
// }
//
// foo((err, data) => {
//   if (err) {
//     console.log('错误', err)
//   } else {
//     console.log('成功', data)
//   }
// })