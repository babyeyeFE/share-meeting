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
console.log(filterByName(aim,'leila'))
```

根据多个名字筛选

```javascript
function filterByName1(aim, nameArr) {
    let result = []
    for(let i = 0; i < nameArr.length; i++) {
        result.push(aim.find(item => item.name = nameArr[i]))
    }
    return result
}
// 输入 aim ['Anne','Jay'] 期望输出为 [{name:'Anne', age: 23, gender:'female'},{name:'Jay', age: 19, gender:'male'}]
console.log(filterByName1(aim,['Leila','Jay']))
```

根据名字和年龄筛选 或的关系

```javascript
function filterByName2(aim, name, age) {
    return aim.filter(item => item.name == name || item.age == age)
}
console.log(filterByName2(aim,'Leila',19))
```

根据名字和年龄多元素筛选

？？？？

？？？？

？？？？

?  ?  ?  ?

```javascript
export function multiFilter(array, filters) {
  const filterKeys = Object.keys(filters)
  // filters all elements passing the criteria
  return array.filter((item) => {
    // dynamically validate all filter criteria
    return filterKeys.every(key => {
      return !!~filters[key].indexOf(item[key])
    })
  })
}

var filters1 = {
    name:['Leila', 'Jay'],
    age:[]
}

export function multiFilter(array, filters) {
  const filterKeys = Object.keys(filters)
  // filterKeys = ['name', 'age']
  return array.filter((item) => {
    return filterKeys.every(key => {
      //ignore when the filter is empty 
      if(!filters[key].length) return true
      return !!~filters[key].indexOf(item[key])
    })
  })
}
```

Object.key()

```javascript

var arr = ['a', 'b', 'c'];
console.log(Object.keys(arr)); 


var obj = { 0: 'a', 1: 'b', 2: 'c' };
console.log(Object.keys(obj)); 


var anObj = { 100: 'a', 2: 'b', 7: 'c' };
console.log(Object.keys(anObj)); 
```



```javascript
//falsy 0 , false, "", null, undefined, NaN
// 为什么使用!!
var a;
if(a!=null&&typeof(a)!=undefined&&a!=''){
    //a有内容才执行的代码  
}

if(!!a){
    //a有内容才执行的代码...  
}
// .every .some
// let obj1 = JSON.parse(JSON.stringify(obj))
```

