// 第一版
const request = (url) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.send()
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText))
        } else {
          reject(new Error(xhr.responseText))
        }
      }
    }
  })
}

// 第二版
const request2 = (url) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.send()
    // 简约版的
    xhr.onload = () => resolve(JSON.parse(xhr.responseText))
    xhr.onerror = () => reject(new Error(xhr.responseText))
  })
}

// 第三版
const request3 = (url) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.send()
    // xhr.onload = () => resolve(JSON.parse(xhr.responseText))
    xhr.onload = function () {
      // 不用箭头函数，函数里面可以用this
      resolve(JSON.parse(this.responseText))
    }
    // xhr.onerror = () => reject(new Error(xhr.responseText))
    xhr.onerror = function () {
      reject(new Error(this.responseText))
    }
  })
}

request('http://update.babyeye.com/releases/upgrade.json')
  .then(response => {
    console.log(response)
  })

request2('http://update.babyeye.com/releases/upgrade.json')
  .then(response => {
    console.log(response)
  })

request3('http://update.babyeye.com/releases/upgrade.json')
  .then(response => {
    console.log(response)
  })

// 原生fetch
fetch('http://update.babyeye.com/releases/upgrade.json')
  .then(response => response.json())
  .then(response => {
    console.log(response)
  })