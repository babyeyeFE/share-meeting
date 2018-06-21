## 数组过滤

目标

```javascript
var aim = [
    {name:'Anne', age: 23, gender:'female'},
 	{name:'Leila', age: 16, gender:'female'},
    {name:'Jay', age: 19, gender:'male'},
    {name:'Mark', age: 40, gender:'male'}
]
```

根据单个名字筛选

```javascript
function filterByName(aim, name) {
    return aim.filter(item => item.name == name)
}
// 输入 aim 'Leila' 期望输出为 {name:'Leila', age: 16, gender:'female'}
```

根据多个名字筛选

```javascript
function filterByName(aim, nameArr) {
    let result = []
    for(let i = 0; i < nameArr.length; i++) {
        result.push(aim.find(item => item.name = nameArr[i]))
    }
    return result
}
// 输入 aim ['Anne','Jay'] 期望输出为 [{name:'Anne', age: 23, gender:'female'},{name:'Jay', age: 19, gender:'male'}]
```

根据名字和年龄筛选 或的关系

```javascript
function filterByName(aim, name, age) {
    return aim.filter(item => item.name == name || item.age == age)
}
```

根据名字和年龄多元素筛选

？？？？

？？？？

？？？？

```javascript
export function multiFilter(array, filters) {
  const filterKeys = Object.keys(filters)
  // filters all elements passing the criteria
  return array.filter((item) => {
    // dynamically validate all filter criteria
    return filterKeys.every(key => {
      //ignore when the filter is empty - Anne
      if(!filters[key].length) return true
      return !!~filters[key].indexOf(item[key])
    })
  })
}
```



