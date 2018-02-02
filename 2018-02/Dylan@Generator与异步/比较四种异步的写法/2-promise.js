const boilWater = () => new Promise(resolve => setTimeout(resolve, 5000, 'boiledWater'))

const washGlass = () => new Promise(resolve => setTimeout(resolve, 3000, 'cleanGlass'))

const prepareTea = () => new Promise(resolve => setTimeout(resolve, 1000, 'tea'))

// 串行
// console.time('promise-one-by-one')
// boilWater()
//   .then(boiledWater => {
//     console.log(boiledWater)
//     return washGlass()
//   })
//   .then(cleanGlass => {
//     console.log(cleanGlass)
//     return prepareTea()
//   })
//   .then(tea => {
//     console.log(tea)
//     console.timeEnd('promise-one-by-one')
//   })

// 并行
console.time('promise-all')
Promise.all([
  boilWater(),
  washGlass(),
  prepareTea()
]).then(([boiledWater, cleanGlass, tea]) => {
  console.log(boiledWater, cleanGlass, tea)
  console.timeEnd('promise-all')
})