// 就是比赛，谁先异步完成执行谁

const timeoutResolve = (time, value) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time, value)
  })
}

const timeoutReject = (time, reason) => {
  return new Promise((resolve, reject) => {
    setTimeout(reject, time, reason)
  })
}

// 可以调整时间试试看
Promise.race([
  timeoutResolve(40, '40毫秒resolved'),
  timeoutReject(100, '100毫秒rejected')
])
  .then(
    value => console.log('resolve', value),
    reason => console.log('reject', reason)
  )