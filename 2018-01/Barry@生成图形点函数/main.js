$(window).ready(function(){
    window.log = console.log
    gameResource = new createjs.LoadQueue()
    // 加载并发
    gameResource.setMaxConnections(100)
    // 关键！---一定要将其设置为 true, 否则不起作用。
    gameResource.maintainScriptOrder = true
    gameResource.installPlugin(createjs.Sound)

    // 添加加载事件
    gameResource.addEventListener('complete', (ev) => {
        start()
    })
    // 加载资源路径
    let loadArr = [
      { id: 'apple', src: './apple.png' }
    ]

    // 加载
    gameResource.loadManifest(loadArr)



    // function getImagePoints(image,resolution=30,regular=false){
    //   let target = new createjs.Bitmap(image)
    //   let points = []
    //   if(regular){
    //       for(let i = 0; i < target.image.width; i+=resolution){
    //           for(let j = 0; j < target.image.height; j+=resolution){
    //               if(target.hitTest(i,j)){
    //                   points.push({x:i,y:j})
    //               }
    //           }
    //       }
    //   }else {
    //       let px, py
    //       for(let i = 0; i < target.image.width; i+=resolution){
    //           for(let j = 0; j < target.image.height; j+=resolution){
    //               px = babyEye.randomRange(0, target.image.width)
    //               py = babyEye.randomRange(0, target.image.height)
    //               if(target.hitTest(px,py)){
    //                   points.push({x:px,y:py})
    //               }
    //           }
    //       }
    //   }
    //   return points
    // }

    function start(){
        let stage = new createjs.Stage('game-canvas')
        // let size = 100
        // let rectangle = new createjs.Shape()
        // rectangle.graphics.f('red').dr(0,0,size,size)
        // let circle = new createjs.Shape()
        // circle.graphics.f('blue').dc(size/2,size/2,size/2)
        // stage.addChild(rectangle,circle)

        // let pointInCircle = 0
        // let total = 1000
        // for(let i = 0; i < total; i++){
        //     let x = babyEye.randomRange(0,size+1)
        //     let y = babyEye.randomRange(0,size+1)
        //     if(circle.hitTest(x,y)){
        //         pointInCircle++
        //     }
        // }

        // log((size*size)*(pointInCircle/total) / (size/2 * size/2))


        let apple = new createjs.Bitmap(gameResource.getResult('apple'))
        let width = apple.image.width
        let height = apple.image.height
        let total = 100
        let points = []
        for(let i = 0; i < total; i++){
            let x = babyEye.randomRange(0,width+1)
            let y = babyEye.randomRange(0,height+1)
            if(apple.hitText(x,y)){
                points.push({x:x,y:y})
            }
        }







        stage.update()


    }
      
})