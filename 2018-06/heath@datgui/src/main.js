
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

// gui.domElement.style = 'position:absolute;top:0px;left:0px';
}

document.getElementById('remove').onclick= function(){
    gui.removeGui()
}
console.log(gui.speedGui)

function guiUpdate(){
    gui.otherGui.onFinishChange((ev)=>{
        // gui.guiData.distance =  gui.guiData.speed
        console.log(ev)
    })
    gui.typeGui.onFinishChange((ev)=>{
        
        console.log(ev);
        let bg = document.getElementById('game')
        switch (ev) {
            case '红背景':
            bg.style.backgroundColor='#ff0000'
                // bg.style.backGround ='#ff0000'
            break;
            case '绿背景':
            bg.style.backgroundColor='#00ffff'

            break;
            case '蓝背景':
            bg.style.backgroundColor='#0000ff'

            break;
            default:
                break;
        }
        selectsBlur(2)
    })
    gui.distanceGui.onFinishChange((ev)=>{
        gui.guiData.acceleration =  gui.guiData.distance
        console.log(gui.guiData.distance)
    })
    gui.speedGui.onFinishChange((ev)=>{
        console.log(ev);
        gui.guiData.distance =  gui.guiData.speed
        console.log(gui.guiData.distance)
    })
    gui.accelerationGui.onFinishChange((ev)=>{
        gui.guiData.speed =  gui.guiData.acceleration
        console.log(gui.guiData.distance)
        gui.speedGui.onFinishChange()
    })



}

function elementBlur(ele) {
    ele.onblur()
    ele.onchange = function() {
      this.blur()
    }
  }
function selectsBlur(num) {
    for (let i = 0;i < num;i++) {
      const oSel = document.getElementsByTagName('select')[i]
    //   elementBlur(oSel)
    oSel.blur()
    }
    document.getElementById('game').focus()

  }
guiUpdate()
// function update(){
//     // guiUpdate()
//     requestAnimationFrame(()=>{
//         update()
//     })
// }

// update()
