const boilWater = () => new Promise(resolve => setTimeout(resolve, 5000, 'boiledWater'))

const washGlass = () => new Promise(resolve => setTimeout(resolve, 3000, 'cleanGlass'))

const prepareTea = () => new Promise(resolve => setTimeout(resolve, 1000, 'tea'))

function co(generator) {
  const gen = generator()
  step(gen.next())
  function step({ value, done }) {
    if (!done) {
      value
        .then(response => step(gen.next(response)))
        .catch(err => step(gen.throw(err)))
    }
  }
}

// 串行
// console.time('generator-one-by-one')
// co(function *() {
//   const boiledWater = yield boilWater()
//   console.log(boiledWater)
//   const cleanGlass = yield washGlass()
//   console.log(cleanGlass)
//   const tea = yield prepareTea()
//   console.log(tea)
//   console.timeEnd('generator-one-by-one')
// })

// 并行
console.time('generator-all')
co(function *() {
  const [boiledWater, cleanGlass, tea] = yield Promise.all([
    boilWater(),
    washGlass(),
    prepareTea()
  ])
  console.log(boiledWater, cleanGlass, tea)
  console.timeEnd('generator-all')
})