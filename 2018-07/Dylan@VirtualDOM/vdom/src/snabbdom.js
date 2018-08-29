/*@jsx h*/ 

const snabbdom = require('snabbdom')
const patch = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/props').default, // for setting properties on DOM elements
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners').default, // attaches event listeners
]);
const h = require('snabbdom/h').default; // helper function for creating vnodes
 
const container = document.getElementById('container1')
const btn = document.getElementById('btn1')
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
let vnode
function render(data) {
  // const newVnode = h('table', {}, data.map(item => {
  //   return h('tr', {}, Object.values(item).map(value => {
  //     return h('td', {}, value)
  //   }))
  // }))

  const newVnode = <table key={1}>
    {data.map((item, index) => 
      <tr key={index}>
        {Object.values(item).map((value, index) => <td key={index}>{value}</td>)}
      </tr>)}
  </table>

  !vnode ? patch(container, newVnode) : patch(vnode, newVnode)
  vnode = newVnode
}

render(data)

btn.addEventListener('click', () => {
  data[0].name = 'Heath'
  render(data)
})