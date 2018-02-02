function request(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.send()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText))
        } else {
          reject('错误')
        }
      }
    }
  })
}

const url = 'http://update.babyeye.com/releases/upgrade.json'

// request(url)
//   .then(response => console.log(response))
//   .catch(err => console.log(err))

// function *foo() {
//   const res = yield request(url)
//   const res2 = yield request(url)
//   console.log(res, res2)
// }
//
// const gen = foo()
// const p = gen.next().value
// p.then(res => gen.next(res).value)
//   .then(res => gen.next(res))

function co(generator) {
  const gen = generator()
  step(gen.next())
  function step({ value, done }) {
     if (!done) {
       value
         .then(response => step(gen.next(response)))
         .catch(err => step(gen.throw(err)))
     }
  }
}
// 串行
// co(function *() {
//   const res1 = yield request(url)
//   const res2 = yield request(url)
//   console.log(res1, res2)
// })
// 并行
// co(function *() {
//   const p1 = request(url)
//   const p2 = request(url)
//   const res1 = yield p1
//   const res2 = yield p2
//   console.log(res1, res2)
// })

co(function *() {
  const [res1, res2] = yield Promise.all([request(url), request(url)])
  console.log(res1, res2)
})


const three = () => new Promise(resolve => setTimeout(resolve, 3000, '3s'))
const two = () => new Promise(resolve => setTimeout(resolve, 2000, '2s'))
// console.time('5s')
// co(function *() {
//   const res1 = yield three()
//   const res2 = yield two()
//   console.log(res1, res2)
//   console.timeEnd('5s')
// })
console.time('all')
co(function *() {
  const [res1, res2] = yield Promise.all([three(), two()])
  console.log(res1, res2)
  console.timeEnd('all')
})