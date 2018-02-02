const boilWater = () => new Promise(resolve => setTimeout(resolve, 5000, 'boiledWater'))

const washGlass = () => new Promise(resolve => setTimeout(resolve, 3000, 'cleanGlass'))

const prepareTea = () => new Promise(resolve => setTimeout(resolve, 1000, 'tea'))

// 串行
// console.time('async/await-one-by-one')
// async function foo() {
//   const boiledWater = await boilWater()
//   console.log(boiledWater)
//   const cleanGlass = await washGlass()
//   console.log(cleanGlass)
//   const tea = await prepareTea()
//   console.log(tea)
//   console.timeEnd('async/await-one-by-one')
// }
// foo()

// 并行
console.time('async/await-all')
const foo = async () => {
  const [boiledWater, cleanGlass, tea] = await Promise.all([
    boilWater(), washGlass(), prepareTea()
  ])
  console.log(boiledWater, cleanGlass, tea)
  console.timeEnd('async/await-all')
}
foo()