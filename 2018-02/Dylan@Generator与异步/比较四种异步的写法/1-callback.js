// 烧热水 5s
const boilWater = cb => setTimeout(cb, 5000, 'boiledWater')

// 洗杯子 3s
const washGlass = cb => setTimeout(cb, 3000, 'cleanGlass')

// 准备茶叶 1s
const prepareTea = cb => setTimeout(cb, 1000, 'tea')

// 串行
// 先烧热水 -> 然后洗杯子 -> 最后准备茶叶

// console.time('callback-one-by-one')
// boilWater(boiledWater => {
//   console.log(boiledWater)
//   washGlass(cleanGlass => {
//     console.log(cleanGlass)
//     prepareTea(tea => {
//       console.log(tea)
//       console.timeEnd('callback-one-by-one')
//     })
//   })
// })


// 并行
// 以最短的时间完成任务
// 在烧水的同时也在洗杯子准备茶叶

console.time('callback-all')
const result = []
const combine = () => {
  if (result.length === 3) {
    console.log(...result)
    console.timeEnd('callback-all')
  }
}

boilWater(boiledWater => {
  result.push(boiledWater)
  combine()
})

washGlass(cleanGlass => {
  result.push(cleanGlass)
  combine()
})

prepareTea(tea => {
  result.push(tea)
  combine()
})


