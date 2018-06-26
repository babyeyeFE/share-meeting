// import * as dat from 'dat.gui';
class DatGui{
    constructor(){
        this.initData()
        this.init()
    }
    initData(){
        this.guiData = {
            speed:5.0,
            acceleration:0.01,
            distance:'讲讲',
            isRun:true,
            type:'红背景',
            other:'呵呵'
        }
    }
    init(){
        this.initGui()
    }
    initGui(){
        this.datGui = new dat.GUI()
        this.addFolder()
    }
    addFolder(){
        this.folder0 = this.datGui.addFolder('显示')

        this.distanceGui = this.folder0.add(this.guiData,'distance',0,100).name('测试距离').listen()
        this.isRunGui = this.folder0.add(this.guiData,'isRun').name('运行').listen()
        this.folder1 = this.datGui.addFolder('设置')
        this.folder1.open()

        this.speedGui = this.folder1.add(this.guiData,'speed',0,10).name('速度').listen()
        this.accelerationGui = this.folder1.add(this.guiData,'acceleration',0,10).name('加速度').listen()

        this.typeGui = this.folder1.add(this.guiData,'type',['红背景','蓝背景','绿背景']).name('闪烁类型').listen()

        this.otherGui = this.datGui.add(this.guiData,'other',['哈哈','是的','不错']).name('other')
    }
    getDatGuiElement(){
        // document.getElementsByClassName('dg ac')[0].style.zIndex = 100
        this.datGui.domElement.style = 'position:absolute;top:0px;left:0px;z-index = 100';
        let parent = this.datGui.getRoot()
        console.log(this.datGui.domElement,'hhh');
        console.log(document.getElementsByClassName('dg ac')[0]);
        console.log(parent,'hhh');

    }
    removeGui(){
        this.datGui.destroy()
        // let element = document.getElementsByClassName('dg main a')[0]
        // element.parentNode.removeChild(element)
    }
}