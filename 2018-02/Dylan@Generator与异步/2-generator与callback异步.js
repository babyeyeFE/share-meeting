
function ajax(url, callback) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.send()
  xhr.onreadystatechange = () => {
    if(xhr.readyState === 4) {
      if (xhr.status === 200) {
        // 成功
        try {
          callback(null, JSON.parse(xhr.responseText))
        } catch (err) {
          callback(err)
        }
        
      } else {
        // 失败
      }
    }
  }
}
const url = 'http://update.babyeye.com/releases/upgrade.json'
// ajax(url, (err,data) => {
//   if (!err) {
//     console.log(data)
//   } else {
//     console.log(err)
//   }
// })

function getData(url) {
  ajax(url, (err, data) => {
    if (err) {
      // 错误
      gen.throw(err)
    } else {
      //成功
      gen.next(data)
    }
  })
}


function *foo() {
  try {
    const res = yield getData(url)
    console.log('gen', res)
  } catch (err) {
    console.log(err)
  }
}

const gen = foo()
gen.next()

