window.log = console.log
window.onload = ()=>{
    let socket = io.connect('http://localhost:2000')
    let stage = new createjs.Stage('play')
    let bg = new createjs.Shape()
    bg.graphics.f('black').dr(0,0,1280,720)
    stage.addChild(bg)
    stage.update()


    let getCircle = (color)=>{
        let circle = new createjs.Shape()
        circle.graphics.f(color).dc(0,0,20)
        return circle
    }

    let receiveData = (data) => {
        let circle = getCircle('red')
        circle.set(data)
        stage.addChild(circle)
        stage.update()
    }

    socket.on('pressmove',(data)=>{
        receiveData(data)
    })

    let handlePressmove = (ev) => {
        let circle = getCircle('blue')
        circle.set({x: ev.stageX, y: ev.stageY})
        stage.addChild(circle)
        stage.update()
        sendData(ev.stageX, ev.stageY)
    }

    let sendData = (x, y) => {
        let data = {
            x: x,
            y: y
        }
        socket.emit('pressmove', data)
    }

    stage.addEventListener('pressmove',(ev)=>{
        handlePressmove(ev)
    })
}