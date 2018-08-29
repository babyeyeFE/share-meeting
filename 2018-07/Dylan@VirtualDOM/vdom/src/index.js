const container = document.getElementById('container')
const btn = document.getElementById('btn')

const data = [
  {
    name: '张三',
    age: '18',
    gender: '男'
  },
  {
    name: '李四',
    age: '18',
    gender: '女'
  },
  {
    name: '王五',
    age: '20',
    gender: '男'
  }
]

function render(data) {
  container.innerHTML = ''
  const table = document.createElement('table')

  const content = data.map(item => {
    return `<tr>
      <td>${item.name}</td>
      <td>${item.age}</td>
      <td>${item.gender}</td>
    </tr>`
  }).join('')

  table.innerHTML = content

  container.appendChild(table)

}

render(data)

btn.addEventListener('click', () => {
  data[0].name = 'Heath'
  render(data)
}, false)

import './snabbdom'