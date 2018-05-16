// import * as dat from 'dat.gui';
class DatGui{
    constructor(){
        this.initData()
        this.init()
    }
    initData(){
        this.guiData = {
            speed:0.5,
            distance:40.00,
            isRun:true,
            type:'红闪',
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

        this.distanceGui = this.folder0.add(this.guiData,'distance',10.0,100.0).name('测试距离').listen()
        this.isRunGui = this.folder0.add(this.guiData,'isRun').name('运行').listen()
        this.folder1 = this.datGui.addFolder('设置')
        this.folder1.open()

        this.speedGui = this.folder1.add(this.guiData,'speed',0,1).name('速度'). listen().step(0.066)
        this.typeGui = this.folder1.add(this.guiData,'type',['蓝闪','同时闪烁','交替闪烁','红闪']).name('闪烁类型'). listen()

        this.otherGui = this.datGui.add(this.guiData,'other',['哈哈','是的','不错']).name('other')
    }
    getDatGuiElement(){
        document.getElementsByClassName('dg ac')[0].style.zIndex = 100
    }
    removeGui(){
        let element = document.getElementsByClassName('dg main a')[0]
        element.parentNode.removeChild(element)
    }
}