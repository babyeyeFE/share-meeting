let gui = new DatGui()
document.getElementById('add').onclick= function(){
    // gui = new DatGui()
    var controls = {
        rotationSpeed:'低速'
    }
    var gui2=new dat.GUI();//创建GUI对象
    gui2.domElement.style = 'position:absolute;top:0px;left:200px;width:50px';
    gui2.add(controls,'rotationSpeed',['低速', '中速','高速']);

    
}
document.getElementById('over').onclick = function(){
    gui.getDatGuiElement()
    // gui.domElement.style = 'z-index:100;'
}

document.getElementById('remove').onclick= function(){
    gui.removeGui()
}
console.log(gui.speedGui)

function guiUpdate(){
    gui.otherGui.onFinishChange((ev)=>{
        // gui.guiData.distance =  gui.guiData.speed
        console.log(gui.guiData.distance)
    })
    gui.typeGui.onFinishChange((ev)=>{

        if(gui.guiData.type ===  '同时闪烁'){
            gui.guiData.isRun = true
        }else{
            gui.guiData.isRun = false
 
        }
    })
    gui.distanceGui.onFinishChange((ev)=>{
        gui.guiData.distance =  gui.guiData.speed*100
        console.log(gui.guiData.distance)
    })
    gui.speedGui.onFinishChange((ev)=>{
        gui.guiData.distance =  gui.guiData.speed*100
        console.log(gui.guiData.distance)
    })
}



function update(){
    guiUpdate()
    requestAnimationFrame(()=>{
        update()
    })
}

update()
