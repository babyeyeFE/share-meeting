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


async function foo() {
  try {
    const res = await Promise.all([request(url)])
    console.log(res)
  } catch (err) {
    console.log(err)
  }
}

const bar = async () => {
  const res = await request(url)
  console.log('箭头函数', res)
}
foo()
bar()