$(window).ready(()=>{
    if(!Object.assign){
        Object.assign = (target, source)=>{
            for(let p in source){
                target[p] = source[p];
            }
        }
    }
    if(!window.babyEye){
        window.babyEye = {};
    }
    babyEye.anTarget = (bg,lazy,glasses)=>{
        return (bg^lazy)^glasses;
    }

    babyEye.steInOut = (bg,target,glasses)=>{
        return (bg^target)^glasses;
    }

    window.anTarget = babyEye.anTarget;
    window.steInOut = babyEye.steInOut;

    babyEye.redFilter = new createjs.ColorFilter(1,0,0,1,255,0,0,0);
    babyEye.blueFilter = new createjs.ColorFilter(0,0,1,1,0,0,255,0);

    babyEye.getParam = (url, name)=>{
        if(url.indexOf("?") == -1) return null;
        let value = null;
        let params = url.split("?")[1].split('&').forEach((param)=>{
            if(param.split('=')[0] == name){
                value = param.split('=')[1];
            }
        })
        return value;
    }

    babyEye.average = (arr) => {
        let l = arr.length;
        let sum = arr.reduce((x,y)=>(x+y),0);
        return sum/l;
    }

    babyEye.distance = (x1,y1,x2,y2) => {
        let dx = Math.abs(x1 - x2);
        let dy = Math.abs(y1 - y2);
        return Math.sqrt(dx*dx+dy*dy);
    }

    babyEye.pointDistance = (p1, p2) => {
        return Math.sqrt(Math.pow(p1.x - p2.x,2) + Math.pow(p1.y - p2.y,2));
    }

    babyEye.disSquare = (x1,y1,x2,y2) => {
        return Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2);
    }

    babyEye.randomRange = (low, high) => {
        return Math.floor(low + Math.random() * (high - low));
    }

    babyEye.randomExcept = (low, high, except) => {
        let result = babyEye.randomRange(low, high);
        return result == except? babyEye.randomExcept(low, high, except): result;
    }

    babyEye.shuffle = (arr) => {
        let i = 0;
        while (i < arr.length) {
            let j = babyEye.randomRange(0, i);
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
            i++;
        }
    }

    babyEye.randomChoice = (arr)=>{
        return arr[babyEye.randomRange(0, arr.length)];
    }
    
    //([1,2,3,4,5], 2) -> [[1,2],[3,4],[5]];
    babyEye.bundle = (arr, n) => {
        let result = []
        for(let i = 0; i < arr.length; i=i+n) {
            result.push(arr.slice(i,i+n));
        }
        return result;
    }

    babyEye.reversed = (arr) => {
        let result = [];
        for(let i = arr.length - 1; i >=0; i--) {
            result.push(arr[i]);
        }
        return result;
    }

    babyEye.inRange = (point, range) => {
        return range[0] < point && point < range[1];
    }

    babyEye.rangeArr = (min,max, step=1) => {
        let arr = [];
        for(let i = min; i < max; i+=step){
            arr.push(i);
        }
        return arr;
    }

    babyEye.constrain = (value,min,max) => {
        if(value > max) {
            return max;
        }else if(value < min){
            return min;
        }else {
            return value;
        }
    }

    babyEye.map = (value,minSource,maxSource,minTarget,maxTarget)=>{
        let deltaResource = maxSource - minSource;
        let deltaTarget = maxTarget - minTarget;
        let result = minTarget + (value/deltaResource) * deltaTarget;
        return babyEye.constrain(result, minTarget, maxTarget);
    }

    babyEye.selectFrom = (arr, num=1) => {
        if(arr.length < num) throw new Error("the array is too small");
        let copy = [], result = [];
        Object.assign(copy, arr);
        while(result.length < num){
            let index = babyEye.randomRange(0,copy.length);
            let selected = copy.splice(index,1)[0];
            result.push(selected)
        }
        return result;
    }

    class Vec2 {
        constructor(x=0,y=0){
            this.x = x;
            this.y = y
        }

        set(x,y){
            this.x = x;
            this.y = y;
        }

        add(v){
            this.x +=v.x;
            this.y +=v.y;
        }

        sub(v){
            this.x -= v.x;
            this.y -= v.y;
        }

        mult(m){
            this.x *= m;
            this.y *= m;
        }

        div(m){
            this.x /= m;
            this.y /= m;
        }
        
        normalize(){
            let m = this.mag();
            if(m == 0) m = 1;
            this.x /= m;
            this.y /= m;
        }

        mag(){
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        limit(n){
            let m = this.mag();
            if(m > n){
                this.normalize();
                this.mult(n);
            }
        }

        heading(){
            return Math.atan2(this.y,this.x) * 180 * 0.31831//180/Math.PI;
        }

        neg(){
            this.x = -this.x;
            this.y = -this.y;
        }

        get(){
            return new Vec2(this.x,this.y);
        }

        static dot(v1, v2){
            return this.x * v.x + this.y * v.y;
        }

        static distance(v1, v2){
            return Vec2.sub(v2,v1).mag();
        }

        static add(v1,v2){
            return new Vec2(v1.x + v2.x,v1.y + v2.y);
        }

        static sub(v1,v2){
            return new Vec2(v1.x-v2.x, v1.y-v2.y);
        }

        static mult(v,m){
            return new Vec2(v.x * m, v.y * m);
        }

        static div(v,m){
            return new Vec2(v.x/m,v.y/m);
        }
    }

    babyEye.Vec2 = Vec2;


    // 缓慢画线
    // let config = {
    //     shape: target,
    //     points: [new c.Point(0,0), new c.Point(400,300), new c.Point(-50,300), new c.Point(0,0)],
    //     color: "red",
    //     strokeStyle: [10, "round"],
    //     speed: 0.8,
    //     finalFill: true,//  可选
    //     fillColor: "blue",// 可选
    //     onComplete: ()=>{console.log("complete!")},//可选
    //     onChange: (ltCmd)=>{console.log(ltCmd)}, //可选
    // }
    // babyEye.animateDraw(config);
    babyEye.animateDraw = (config, hidden=[]) => {
        let {shape, points, color, strokeStyle, speed} = config;
        let g = shape.graphics.s(color).ss(...strokeStyle).mt(points[0].x, points[0].y);
        let cmd = g.lt(points[0].x, points[0].y).command;
        let time = babyEye.pointDistance(points[0],points[1]) * (1/speed);
        let tween = createjs.Tween.get(cmd).to({x:points[1].x, y: points[1].y}, time);

        if(config.onChange) tween.on("change",()=>{config.onChange(cmd)});
        tween.call(()=>{
            if(points.length < 3) {
                if(!config.finalFill) return;
                points = hidden.concat(points);
                points.forEach((point, index) => {
                    if(index == 0) {
                        let fc = config.fillColor? config.fillColor:color;
                        g.f(fc).mt(point.x,point.y)
                    }else {
                        g.lt(point.x,point.y);
                    }
                });
                if(config.onComplete) config.onComplete(); 
                return;
            }
            hidden.push(points.shift());
            babyEye.animateDraw(config, hidden);
        })
    }

    //new ImageSTE({image:xxx, colors:["r","b"], delta:10}) -> image;
    class ImageSTE {
        constructor(config){
            if(config.colors.indexOf("r") == -1) {
                console.log("参数错了");
                return;
            }
            let img = config.image;
            let colors = config.colors;
            let delta = config.delta;
            let canvas = document.getElementById("img-canvas");
            canvas.width = img.width + delta;
            canvas.height = img.height;

            let ctx = canvas.getContext('2d');
            ctx.fillStyle = "rgba(0,0,0,0)";
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.drawImage(img, colors[0] == "r"? 0:delta, 0);
            let imageDataLeft = ctx.getImageData(0,0,img.width + delta, img.height);
            ctx.clearRect(0,0,canvas.width,canvas.height);

            ctx.drawImage(img, colors[0] == "r"? delta:0, 0);
            let imageDataRight = ctx.getImageData(0,0,img.width + delta, img.height);
            ctx.clearRect(0,0,canvas.width,canvas.height);

            let result = ctx.createImageData(img.width + delta,img.height);
            ctx.clearRect(0,0,canvas.width,canvas.height);

            let dataLength = imageDataRight.data.length;

            if(config.type == 2) {
                for (let i = 0; i < dataLength; i += 4) {
                  imageDataRight.data[i] = 0;
                  imageDataLeft.data[i+1] = 0;
                }
            } else {
                for (let i = 0; i < dataLength; i += 4) {
                  imageDataRight.data[i] = 0;
                }
            }

            for (let i = 0; i < dataLength; i += 4) {
              imageDataLeft.data[i+1] = 0;
              imageDataLeft.data[i+2] = 0;
            }

            for (let i = 0; i < dataLength; i += 4) {
              result.data[i] = imageDataLeft.data[i];
              result.data[i+1] = imageDataRight.data[i+1];
              result.data[i+2] = imageDataRight.data[i+2];
              result.data[i+3]= imageDataRight.data[i+3] + imageDataLeft.data[i+3];
            }
            ctx.putImageData(result, 0, 0);

            let imgDom = document.createElement("img");
            imgDom.src = canvas.toDataURL("image/png");
            imgDom.width = img.width + delta;
            imgDom.height = img.height;
            return imgDom; 
        }
    }

    babyEye.ImageSTE = ImageSTE;

    class ImageSTE2 {
        constructor(config){
            config.type = 2;
            return new ImageSTE(config);
        }
    }

    babyEye.ImageSTE2 = ImageSTE2;

    //只取中间像素
    class ImageMidSTE {
        constructor(config){
            if(config.colors.indexOf("r") == -1) {
                console.log("参数错了");
                return;
            }
            let img = config.image;
            let colors = config.colors;
            let delta = config.delta
            let canvas = document.getElementById("img-canvas");
            canvas.width = img.width + delta;
            canvas.height = img.height;

            let ctx = canvas.getContext('2d');
            ctx.fillStyle = "rgba(0,0,0,0)";
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.drawImage(img, colors[0] == "r"? 0:delta, 0);
            let imageDataLeft = ctx.getImageData(0,0,img.width + delta, img.height);
            ctx.clearRect(0,0,canvas.width,canvas.height);

            ctx.drawImage(img, colors[0] == "r"? delta:0, 0);
            let imageDataRight = ctx.getImageData(0,0,img.width +  delta, img.height);
            ctx.clearRect(0,0,canvas.width,canvas.height);

            let result = ctx.createImageData(img.width + delta,img.height);
            ctx.clearRect(0,0,canvas.width,canvas.height);

            let dataLength = imageDataRight.data.length;
            for (let i = 0; i < dataLength; i += 4) {
              imageDataRight.data[i] = 0;
            }

            for (let i = 0; i < dataLength; i += 4) {
              imageDataLeft.data[i+1] = 0;
              imageDataLeft.data[i+2] = 0;
            }

            for (let i = 0; i < dataLength; i += 4) {
              result.data[i] = imageDataLeft.data[i];
              result.data[i+1] = imageDataRight.data[i+1];
              result.data[i+2] = imageDataRight.data[i+2];
              result.data[i+3]= imageDataRight.data[i+3] && imageDataLeft.data[i+3];
            }
            ctx.putImageData(result, 0, 0);

            let imgDom = document.createElement("img");
            imgDom.src = canvas.toDataURL("image/png");
            imgDom.width = img.width + delta;
            imgDom.height = img.height;
            return imgDom; 
        }
    }

    babyEye.ImageMidSTE = ImageMidSTE;

    class FilteredImg {
        constructor(originalImg,filters) {
            this.canvas = document.getElementById("img-canvas");
            this.canvas.width = originalImg.width;
            this.canvas.height = originalImg.height;

            this.stage = new createjs.Stage("img-canvas");
            this.stage.update();

            this.bitmap = new createjs.Bitmap(originalImg);
            this.bitmap.filters = filters;
            this.bitmap.cache(0,0,originalImg.width, originalImg.height);
            this.stage.addChild(this.bitmap);
            this.stage.update();

            let result = document.createElement("img"); // Create an <img> element
            result.src = this.canvas.toDataURL(); // Set its src attribute
            result.width = originalImg.width;
            result.height = originalImg.height;
            return result;
        }
    }
    babyEye.FilteredImg = FilteredImg;
    babyEye.ImageFiltered = FilteredImg;

    class Button extends c.Bitmap{
        constructor(id, param1, param2){
            //fuck 以前写的烂，为了兼容已经使用的；
            //id,callback
            //id,resourceQueue, callback
            let resourceQueue, callback, img;

            if(arguments.length == 2){
                callback = param1;
                img = window.queue.getResult(id);
            }else if(arguments.length == 3){
                resourceQueue = param1;
                callback = param2;
                img = resourceQueue.getResult(id);
            }
            super(img);
            if(arguments.length == 3) this.cursor = "pointer";
            this.addEventListener("mousedown",(ev)=>{
                ev.stopPropagation();
                callback(id);
            })

            this.regX = img.width/2;
            this.regY = img.height/2;
        }
    }
    babyEye.Button = Button;

    class ImageButton extends createjs.Bitmap{
        constructor(img, callback){
            super(img);
            if(callback){
                this.addEventListener("mousedown",(ev)=>{
                    ev.stopPropagation();
                    callback();
                })
            }

            this.regX = img.width/2;
            this.regY = img.height/2;
        }
    }

    babyEye.ImageButton = ImageButton;

    class InteractiveButton extends createjs.Container {
        constructor(imgNormal, imgHover, callback){
            super();
            this.callback = callback;
            this.viewNormal = new createjs.Bitmap(imgNormal);
            this.viewHover = new createjs.Bitmap(imgHover);
            this.viewHover.visible = false;
            this.hovering = false;
            this.cursor = "pointer";
            this.addChild(this.viewNormal, this.viewHover);
            this.events();
        }

        events(){
            this.addEventListener("mouseover",()=>{
                this.viewHover.visible = true;
                if(this.viewNormal.stage) this.viewNormal.stage.update();
            })

            this.addEventListener("mouseout",()=>{
                this.viewHover.visible = false;
                if(this.viewNormal.stage) this.viewNormal.stage.update();
            })

            this.addEventListener("mousedown",(ev)=>{
                ev.stopPropagation();
                this.callback();
            })
        }
    }

    babyEye.InteractiveButton = InteractiveButton;

    class ReplayButton extends InteractiveButton{
        constructor(callback) {
            let callbackNew = ()=>{
                if(window.game&&window.game.stage) window.game.stage.enableMouseOver(0)
                callback()
            }
            super(babyEye.prepareTrainQueue.getResult("replay-text"), babyEye.prepareTrainQueue.getResult("replay"), callbackNew);
            this.set({x: 10, y: 5});
        }
    }
    babyEye.ReplayButton = ReplayButton;
    class HelpButton extends InteractiveButton {
        constructor(config) {
            let callback = ()=>{
                if(window.game.pause) window.game.pause();
                let showInstructionConfig = {
                    calledByHelp: true,
                    instruction: config.instruction,
                    staticPath: config.staticPath,
                    instructionItems: config.instructionItems,
                    fontSizeDelta: config.fontSizeDelta,//文字大小控制，默认0
                    lineHeightDelta: config.lineHeightDelta,//行距控制，默认0
                    language: config.language,//"zh"中文 "en"英文, 默认中文
                    callback: ()=>{
                        if(window.game.continue) window.game.continue();
                    }
                }
                babyEye.prepareTrain(showInstructionConfig);
            }
            super(babyEye.prepareTrainQueue.getResult("help-text"), babyEye.prepareTrainQueue.getResult("help"), callback);
            this.set({x: 90, y: 5});
        }
    }
    babyEye.HelpButton = HelpButton;

    class Bitmap extends createjs.Bitmap{
        constructor(img){
            super(img);
            this.regX = img.width/2;
            this.regY = img.height/2;
        }
    }

    babyEye.Bitmap = Bitmap;

    class CountDown {
        constructor(config){
            this.duration = config.duration;
            this.callback = config.callback;
            this.termination = false;
            this.current = 0;
            this.lastUpdateView = 0;
            this.buildView();
            this.updateView();
        }

        update(dt) {
            if(this.termination) return;
            this.current += dt;
            if(this.current - this.lastUpdateView > 1000) {
                this.lastUpdateView = this.current;
                this.updateView();
            } 

            if(this.current > this.duration){
                this.termination = true;
                this.textTime.text = "00:00";
                this.callback();
            }
        }

        buildView(){
            this.view = new createjs.Container();
            this.view.set({x: 1050, y: 5});
            let img = babyEye.prepareTrainQueue.getResult("count-down");
            let bg = new createjs.Bitmap(img);
            this.textTime = new createjs.Text("", "28px fantasy", "white");
            this.textTime.set({textAlign: "center", x: 160, y: 15});
            this.view.addChild(bg, this.textTime);
        }

        updateView(){
            this.remain = ((this.duration - this.current) * 0.001).toFixed(0);
            let minutes = Math.floor(this.remain/60).toString();
            let seconds = (this.remain % 60).toFixed(0);
            if(minutes.length == 1) minutes = "0" + minutes;
            if(seconds.length == 1) seconds = "0" + seconds;
            this.textTime.text = minutes + ":" + seconds;
        }

    }

    babyEye.CountDown = CountDown;

    class NumericType {
        constructor(initValue=0,minValue=-Infinity,maxValue=Infinity) {
            this.value = initValue;
            this.minValue = minValue;
            this.maxValue = maxValue;
        }

        buildView(id){
            this.view = new createjs.Container();
            this.view.set({x: 1050, y: 5});
            let img = babyEye.prepareTrainQueue.getResult(id);
            let bg = new createjs.Bitmap(img);
            this.text = new createjs.Text(this.value, "28px fantasy", "white");
            this.text.set({textAlign: "center", x: 150, y: 15});
            this.view.addChild(bg, this.text);

        }

        changeValue(value){
            this.setValue(this.value + value);
        }

        setValue(value){
            if(this.minValue <= value&&value <= this.maxValue){
                this.value = value;
                this.text.text = this.value;
            }
        }
    }

    class Level extends NumericType {
        constructor(initValue=1, minValue, maxValue){
            super(initValue,minValue,maxValue);
            this.buildView("level");
        }
    }

    babyEye.Level = Level;

    class Score extends NumericType {
        constructor(initValue = 0, minValue, maxValue){
            super(initValue, minValue, maxValue);
            this.buildView("score");
        }
    }

    babyEye.Score = Score;

    class Remain extends NumericType {
        constructor(initValue=100, minValue,maxValue){
            super(initValue,minValue, maxValue);
            this.buildView("remain");
        }
    }

    babyEye.Remain = Remain;

    class Travel extends NumericType {
        constructor(initValue=0, minValue, maxValue){
            super(initValue,minValue, maxValue);
            this.buildView("travel");
            this.text.x = 120;
        }
    }

    babyEye.Travel = Travel;

    class SkiTravel extends NumericType {
        constructor(initValue=0, minValue, maxValue){
            super(initValue,minValue, maxValue);
            this.buildView("ski-travel");
            this.text.x = 120;
        }
    }

    babyEye.SkiTravel = SkiTravel;

    class Page {
        constructor(config){
            this.bg = config.bg;
            this.items = config.items;
            this.buildView();
        }

        buildView(){
            this.view = new createjs.Container();
            this.view.addChild(this.bg);
            this.items.forEach((item, index)=>{
                this.view.addChild(item.content);
                item.content.set({x: item.x, y: item.y});
            })
        }
    }

    babyEye.Page = Page;
    class PopUp {
        constructor(config){
            this.config = config;
            this.buildView();
        }

        buildView(){
            this.view = new createjs.Container();
            let img = babyEye.prepareTrainQueue.getResult("end-pop-up");
            let bg = new createjs.Bitmap(img);
            bg.set({regX: img.width/2, regY: img.height/2});
            this.text = new createjs.Text(this.config.text, "32px sans-serif", "rgb(50,50,50)");
            this.text.set({ x: -250,y: -100, lineHeight: 50});

            this.view.addChild(bg, this.text);
            this.view.set({
                x: 1280/2 + 50,
                y: 720/2
            });
        }
    }

    babyEye.PopUp = PopUp;

    babyEye.setWrapText = (textInstance, text) => {
      let initWidth = textInstance.lineWidth;
      let textArray = text.split('');
      let i = -1;
      let prevText = '';
      let lines = [];

      textInstance.text = '';

      while (textArray[++i]) {
        textInstance.text += textArray[i];

        if (textInstance.getMeasuredWidth() > initWidth) {
          lines.push(prevText);
          textInstance.text = textArray[i];
        }
        prevText = textInstance.text;
      }
    lines.push(prevText);

      textInstance.text = lines.join('\n');
    }

    babyEye.prepareTrain = (infor)=>{
        $("#game-canvas").hide();
        if($("#instruction-canvas").length == 0) {
            let canvas = document.createElement("canvas")
            canvas.id = "instruction-canvas";
            canvas.width = 1280;
            canvas.height = 720;
            $(canvas).addClass("scale");
            $("#game-canvas").before(canvas); 
            window.handleResize();
        }
        $("#instruction-canvas").show();
        let stage = new createjs.Stage("instruction-canvas");
        stage.enableMouseOver();
        let result = {};
        let [halfWidth, halfHeight] = [stage.canvas.width/2, stage.canvas.height/2];

        let options = ["selectGlasses","selectLazyEye","instruction","selectDifficulty","selectFuseType","selectTwinkleType","selectVergenceType","testForFU","callback"];
        let optionFuncs = [selectGlasses,selectLazyEye,buildInstruction,selectDifficulty,selectFuseType,selectTwinkleType,selectVergenceType,testForFU,finalCallback];
        let funcIndex = [];
        let currentIndex = 0;

        if(!babyEye.prepareTrainQueue){
            loadResource(onComplete);
        }else {
            onComplete();
        }

        function onComplete(){
            beginSelect();
            if(!infor.calledByHelp)generateBitmaps();
        }

        function generateBitmaps(){
            babyEye.failBitmap = new Bitmap(babyEye.prepareTrainQueue.getResult("fail"));
            babyEye.successBitmap = new Bitmap(babyEye.prepareTrainQueue.getResult("success"));
            babyEye.failBitmap.set({x: 1280/2, y: 720/2, scaleX: 0.65,scaleY:0.65});
            babyEye.successBitmap.set({x: 1280/2, y: 720/2, scaleX:0.65, scaleY:0.65});
        }

        function beginSelect(){
            options.forEach((option,index)=>{
                if(infor[option]){
                    funcIndex.push(index);
                }
            })
            optionFuncs[funcIndex[currentIndex]]()
        }

        function nextFunc(){
            stage.removeAllChildren();
            currentIndex++;
            if(optionFuncs[funcIndex[currentIndex]]) optionFuncs[funcIndex[currentIndex]]();
        }

        function selectGlasses(){
            let img = babyEye.prepareTrainQueue.getResult("selectGlassesBG");
            let selectGlassesBG = new createjs.Bitmap(img);
            let redBlue = new babyEye.InteractiveButton(
                babyEye.prepareTrainQueue.getResult("redBlue"), 
                babyEye.prepareTrainQueue.getResult("redBlue-hover") ,()=>{
                glassesSelected("rb");
            })

            let blueRed = new babyEye.InteractiveButton(
                babyEye.prepareTrainQueue.getResult("blueRed"), 
                babyEye.prepareTrainQueue.getResult("blueRed-hover") ,()=>{
                glassesSelected("br");
            })

            redBlue.set({x: halfWidth/2 - 40 ,y: halfHeight-120});
            blueRed.set({x: halfWidth*1.5 - 245, y: halfHeight-120});

            stage.removeAllChildren();
            stage.addChild(selectGlassesBG, redBlue, blueRed);
            stage.update();

            if(infor.background){
                let link = infor.staticPath + "img/version5/background/" + infor.background + ".png";
                $("body").css({
                    "background-image": "url" + "(" + link + ")",
                    "background-repeat": "repeat"
                })
            }
        }

        function selectLazyEye(){
            let lazyEye = localStorage.getItem("lazyeye");

            if (lazyEye !== "0" && lazyEye !== "1") {
                let selectEyeBG = new createjs.Bitmap(babyEye.prepareTrainQueue.getResult("selectEyeBG"));
                stage.addChild(selectEyeBG);
                let leftEye = new babyEye.InteractiveButton
                (babyEye.prepareTrainQueue.getResult("left-eye")
                ,babyEye.prepareTrainQueue.getResult("left-eye-hover")
                ,()=>{
                    lazyEyeSeleted(0);
                });

                let rightEye = new babyEye.InteractiveButton(
                    babyEye.prepareTrainQueue.getResult("right-eye")
                    ,babyEye.prepareTrainQueue.getResult("right-eye-hover")
                ,()=>{
                    lazyEyeSeleted(1);
                });

                rightEye.set({x: halfWidth*1.5 - 245, y: halfHeight - 140});
                leftEye.set({x: halfWidth/2 - 40,y: halfHeight - 140});

                stage.addChild(leftEye, rightEye);
            } else {
                lazyEye = parseInt(lazyEye);
                lazyEyeSeleted(lazyEye);
            }
            stage.update();
        }

        function selectDifficulty(){
            let BG = new createjs.Bitmap(babyEye.prepareTrainQueue.getResult("skyBG"));
            stage.addChild(BG);
            let difficultyTypes = ["easy","medium","hard"];
            let difficultyButtons = difficultyTypes.map((difficulty)=>{
                let button = new babyEye.InteractiveButton(
                    babyEye.prepareTrainQueue.getResult(difficulty)
                    , babyEye.prepareTrainQueue.getResult(difficulty + "-hover")
                    , ()=>{difficultySelected(difficulty);}
                );
                let img = babyEye.prepareTrainQueue.getResult(difficulty);
                button.set({regX: img.width/2});
                button.set({regY: img.height/2});
                stage.addChild(button);
                return button;
            })

            difficultyButtons[0].set({x: halfWidth,y: 250});
            difficultyButtons[1].set({x: halfWidth,y: 400});
            difficultyButtons[2].set({x: halfWidth,y: 550});
            stage.update();
        }

        function selectFuseType(){
            let BG = new createjs.Bitmap(babyEye.prepareTrainQueue.getResult("selectMode"));
            stage.addChild(BG);
            let fuseTypes = ["fuse-center","fuse-round","fuse-entire"];
            let fuseButtons = fuseTypes.map((id)=>{
                let button = new babyEye.InteractiveButton(
                    babyEye.prepareTrainQueue.getResult(id)
                    , babyEye.prepareTrainQueue.getResult(id + "-hover")
                    , ()=>{ fuseTypeSelected( id.split("-")[1] ) }
                );
                let img = babyEye.prepareTrainQueue.getResult(id);
                button.set({regX: img.width/2});
                button.set({regY: img.height/2});
                stage.addChild(button);
                return button;
            })

            fuseButtons[0].set({x: halfWidth,y: 250});
            fuseButtons[1].set({x: halfWidth,y: 400});
            fuseButtons[2].set({x: halfWidth,y: 550});
            stage.update();
        }

        function selectTwinkleType(){
            let BG = new createjs.Bitmap(babyEye.prepareTrainQueue.getResult("selectMode"));
            stage.addChild(BG);
            let twinkleTypes = ["twinkle-altermate","twinkle-lazy","twinkle-same-time"];
            let twinkleButtons = twinkleTypes.map((id)=>{
                let button = new babyEye.InteractiveButton(
                    babyEye.prepareTrainQueue.getResult(id)
                    , babyEye.prepareTrainQueue.getResult(id + "-hover")
                    , ()=>{ twinkleTypeSelected( id.split("-")[1] ) }
                );
                let img = babyEye.prepareTrainQueue.getResult(id);
                button.set({regX: img.width/2});
                button.set({regY: img.height/2});
                stage.addChild(button);
                return button;
            })

            twinkleButtons[0].set({x: halfWidth,y: 250});
            twinkleButtons[1].set({x: halfWidth,y: 400});
            twinkleButtons[2].set({x: halfWidth,y: 550});
            stage.update();
        }

        function selectVergenceType(){
            let BG = new createjs.Bitmap(babyEye.prepareTrainQueue.getResult("selectMode"));
            stage.addChild(BG);
            let vergenceTypes = ["convergence","divergence"];
            let fuseButtons = vergenceTypes.map((id)=>{
                let button = new babyEye.InteractiveButton(
                    babyEye.prepareTrainQueue.getResult(id)
                    , babyEye.prepareTrainQueue.getResult(id + "-hover")
                    , ()=>{ vergenceTypeSelected(id) }
                );
                let img = babyEye.prepareTrainQueue.getResult(id);
                button.set({regX: img.width/2});
                button.set({regY: img.height/2});
                stage.addChild(button);
                return button;
            })

            fuseButtons[0].set({x: halfWidth,y: 300});
            fuseButtons[1].set({x: halfWidth,y: 500});
            stage.update();
        }

        function testForFU(){
            let leftColor = result.glasses == "rb"? "red": "blue";
            let rightColor = result.glasses == "rb"? "blue": "red";
            let minFU = 30, maxFU = 300;
            let squint = babyEye.getParam(window.location.href, "squint");
            let bgIDs = null;
            if(squint == "exotropia"){
                bgIDs = ["testForConvergence"];
            }else if(squint == "esotropia") {
                bgIDs = ["testForDivergence"];
            }else {
                bgIDs = ["testForConvergence", "testForDivergence"];
            }
            let currentBGIndex = 0;
            let currentBG =  new createjs.Bitmap(babyEye.prepareTrainQueue.getResult(bgIDs[currentBGIndex]));
            stage.addChild(currentBG);
            class TargetFU {
                constructor(){
                    this.vx = 0.01;
                    this.lastFrame = 0;
                    this.setView();
                    this.buildButtons();
                    this.render();
                }

                setView(){
                    this.view = new createjs.Container();
                    this.view.compositeOperation = "darken";
                    this.targetLeft = new createjs.Shape();
                    this.targetLeftCommand = this.targetLeft.graphics.f(leftColor).command;
                    this.targetLeft.graphics.dc(0,0,50);
                    this.targetRight = new createjs.Shape();
                    this.targetRightCommand = this.targetRight.graphics.f(rightColor).command;
                    this.targetRight.graphics.dc(0,0,50);
                    if (squint == "esotropia") [this.targetLeft, this.targetRight] = [this.targetRight, this.targetLeft];
                    this.view.addChild(this.targetLeft,this.targetRight);
                    stage.addChild(this.view);
                    this.view.set({
                        x: stage.canvas.width/2,
                        y: stage.canvas.height/2
                    })
                }

                buildButtons(){
                    this.statusButton = new StatusButton();
                    this.confirmButton = new ConfirmButton(()=>{
                        this.handleConfirm();
                    });
                    this.skipButton = new createjs.Bitmap(babyEye.prepareTrainQueue.getResult("skip"));
                    this.skipButton.set({x: stage.canvas.width/2 - 180, y: stage.canvas.height * 3/4,cursor:"pointer"});
                    this.skipButton.addEventListener("mousedown",()=>{
                        if(babyEye.lastTrainInfor) {
                            result.convergenceDelta = babyEye.lastTrainInfor.convergenceDelta;
                            result.divergenceDelta = babyEye.lastTrainInfor.divergenceDelta;
                        }else {
                            result.convergenceDelta = minFU;
                            result.divergenceDelta = minFU;
                        }
                        this.complete = true;
                        nextFunc();
                    })
                    
                    stage.addChild(this.statusButton.view,this.confirmButton.view, this.skipButton);
                }

                handleConfirm(){
                    this.statusButton.changeStatus("stop");
                    let deltaX = this.targetRight.x - this.targetLeft.x;
                    deltaX = babyEye.constrain(deltaX, minFU, maxFU);
                    this.targetLeft.x = this.targetRight.x = 0;

                    if(bgIDs[currentBGIndex] == "testForConvergence"){
                        result.convergenceDelta = deltaX;
                    } else {
                        result.divergenceDelta = deltaX;
                    }
                    currentBGIndex++;
                    if(bgIDs[currentBGIndex]){
                        stage.removeChild(currentBG);
                        currentBG = new createjs.Bitmap(babyEye.prepareTrainQueue.getResult(bgIDs[currentBGIndex]));
                        stage.addChildAt(currentBG,0);
                        [this.targetRightCommand.style, this.targetLeftCommand.style] = [this.targetLeftCommand.style,this.targetRightCommand.style];
                    }else {
                        this.complete = true;
                        if(!result.divergenceDelta) result.divergenceDelta = 0;
                        if(!result.convergenceDelta) result.convergenceDelta = 0;
                        stage.removeAllChildren();
                        nextFunc();
                    }
                }

                update(dt){
                    if(this.statusButton.status == "stop") return;
                    if(this.targetRight.x < 150) {
                        this.targetLeft.x -= this.vx * dt;
                        this.targetRight.x += this.vx * dt;
                    } else {
                        this.handleConfirm();
                    }
                }

                render(timestamp = 0){
                    if(this.complete) return;
                    let dt = timestamp - this.lastFrame;
                    this.lastFrame = timestamp;
                    if(dt < 0 || dt > 150) dt = 0;
                    this.update(dt);
                    stage.update();
                    window.requestAnimationFrame((timestamp)=>{
                        this.render(timestamp);
                    })
                }
            }

            class StatusButton {
                constructor(callback){
                    this.callback = callback;
                    this.status = "stop";
                    this.setView();
                    this.events();
                }

                setView(){
                    if(!this.view) this.view = new createjs.Container();
                    this.view.removeAllChildren();
                    let img = this.status == "move" ? babyEye.prepareTrainQueue.getResult("pause"):babyEye.prepareTrainQueue.getResult("move-right");
                    let bitmap = new createjs.Bitmap(img);
                    bitmap.set({
                        cursor: "pointer"
                    })
                    this.view.x = stage.canvas.width/2 + 100;
                    this.view.y = stage.canvas.height * 3/4;
                    this.view.addChild(bitmap);
                    window.stage = stage;
                }

                events(){
                    this.view.addEventListener("mousedown",()=>{
                        this.changeStatus();
                        this.setView();
                    })
                }

                changeStatus(status){
                    if(status) {
                        this.status = status;
                    } else {
                        this.status = this.status == "move"? "stop":"move";
                    }
                    this.setView();
                }
            }

            class ConfirmButton {
                constructor(callback){
                    this.callback = callback;
                    this.confirmTimes = 0;
                    this.setView();
                    this.events();
                }
                setView(){
                    this.view = new createjs.Bitmap(babyEye.prepareTrainQueue.getResult("confirm-text"));
                    this.view.set({
                        x: stage.canvas.width/2 - 40,
                        y: stage.canvas.height * 3/4,
                        cursor: "pointer"
                    })
                }
                events(){
                    this.view.addEventListener("mousedown",()=>{
                        this.confirmTimes++;
                        this.callback();
                    })
                }
            }

            new TargetFU();
        }

        //选择完毕
        function glassesSelected(glasses){
            result.glasses = glasses;
            nextFunc();
        }

        function lazyEyeSeleted(lazyEye){

            result.targetInfor = {}
            result.lazyEye = lazyEye
            if(!result.glasses) { throw new Error("glasses not defined"); return;};
            let glassesNumber = result.glasses=="rb"? 0: 1;

            if(anTarget(1,lazyEye,glassesNumber) == 0){
                result.targetInfor.filter = new createjs.ColorFilter(1,0,0,1,255,0,0,0);
                result.targetInfor.color = "red";
            } else {
                result.targetInfor.filter = new createjs.ColorFilter(0,0,1,1,0,0,255,0);
                result.targetInfor.color = "blue";
            }

            nextFunc();
        }

        function difficultySelected(difficulty){
            result.difficulty = difficulty;
            nextFunc();
        }

        function fuseTypeSelected(type){
            result.fuseType = type;
            nextFunc();
        }

        function twinkleTypeSelected(type){
            result.twinkleType = type;
            nextFunc();
        }

        function vergenceTypeSelected(type){
            result.vergenceType = type;
            nextFunc();
        }

        function buildInstruction(){
            stage.removeAllChildren();
            if(typeof infor.instruction == "string") {
                let instructionBG = new createjs.Bitmap(babyEye.prepareTrainQueue.getResult("instructionBG"));
                stage.addChild(instructionBG);

                let fontSizeDelta = infor.fontSizeDelta? infor.fontSizeDelta:0;
                let instructionText = new createjs.Text("", "normal "+ (30 + fontSizeDelta)+ "px sans-serif", "rgb(50,50,50)");
                instructionText.set({
                    lineWidth: 700,
                    x: 300,
                    y: 200,
                    lineHeight: 38 + (infor.lineHeightDelta?infor.lineHeightDelta: 0)
                });

                if (is360()) {
                    instructionText.font = "bold "+ (28 + fontSizeDelta) +"px sans-serif";
                    let space = "    "
                    babyEye.setWrapText(instructionText, infor.instruction);
                } else {
                    let space = "      "
                    babyEye.setWrapText(instructionText, infor.instruction);
                }

                stage.addChild(instructionText);
            } else {
                let bg = new createjs.Bitmap(babyEye.prepareTrainQueue.getResult(infor.instruction.id));
                stage.addChild(bg);
            }

            let imgID = infor.calledByHelp? "confirm": "start";
            let start = new babyEye.InteractiveButton(
                babyEye.prepareTrainQueue.getResult(imgID + "-text")
                , babyEye.prepareTrainQueue.getResult(imgID)
                , nextFunc
            );

            start.set({x: 1280 - 100,y: 720 - 100});

            stage.addChild(start);
            if(infor.instructionItems){
                infor.instructionItems.forEach((item)=>{
                    let bitmap = new createjs.Bitmap(babyEye.prepareTrainQueue.getResult(item.id))
                    bitmap.set({x: item.x,y:item.y})
                    stage.addChild(bitmap)
                })
            }
            stage.update();
        }

        function finalCallback(){
            babyEye.lastTrainInfor = {};
            Object.assign(babyEye.lastTrainInfor,result);
            if(infor.callback) infor.callback(result);
            stage.removeAllChildren();
            stage.update();
            stage.enableMouseOver(0);

            $("#instruction-canvas").hide();
            $("#game-canvas").show();
        }

        function loadResource(onComplete){
            babyEye.prepareTrainQueue = new createjs.LoadQueue();

            babyEye.prepareTrainQueue.setMaxConnections(100);
            // 关键！---一定要将其设置为 true, 否则不起作用。  
            babyEye.prepareTrainQueue.maintainScriptOrder=true;  

            let path;
            if(!infor.language||infor.language&&infor.language == "zh") {
                path = infor.staticPath + "img/version5/";
            }else if(infor.language){
                path = infor.staticPath + "img/version5-" + infor.language +"/";
            }
            let loadArr = [];
            let loadingText = new createjs.Text("", "30px fantasy", "rgb(50,50,50)");
            loadingText.set({x: halfWidth, y: halfHeight, textAlign: "center",textBaseline: "middle"});
            stage.addChild(loadingText);

            let buttons = ["redBlue.png","redBlue-hover.png", "blueRed.png",
            "blueRed-hover.png", "left-eye.png","left-eye-hover.png", "right-eye.png", "right-eye-hover.png", "start.png",
            "start-text.png", "confirm.png", "confirm-text.png", "replay.png",
             "help.png","replay-text.png","help-text.png","move-right.png","pause.png", "skip.png"]
            .map(name => toLoadObj(name, path + "buttons/" + name));

            let background = ["selectGlassesBG.png", "instructionBG.png", "selectEyeBG.png", "skyBG.png","selectMode.png"]
            .map(name => toLoadObj(name, path + "background/" + name));

            let testForFUBG = ["testForConvergence.png","testForDivergence.png"]
            .map(name => toLoadObj(name, path + "background/" + name));

            let other = ["fail.png","success.png","count-down.png", "end-pop-up.png", "level.png","score.png","remain.png","travel.png", "ski-travel.png"]
            .map(name=> toLoadObj(name, path + "other/" + name));

            let difficultyRelated = ["easy.png","easy-hover.png", "medium.png","medium-hover.png","hard.png", "hard-hover.png"]
            .map(name => toLoadObj(name, path + "buttons/" + name));

            let fuseButtons = ["fuse-center.png","fuse-center-hover.png","fuse-entire.png","fuse-entire-hover.png",
            "fuse-round.png","fuse-round-hover.png"]
            .map(name=> toLoadObj(name,path + "buttons/" + name));

            let twinkleButtons = ["twinkle-altermate.png","twinkle-altermate-hover.png","twinkle-lazy.png","twinkle-lazy-hover.png",
            "twinkle-same-time.png","twinkle-same-time-hover.png"]
            .map(name=> toLoadObj(name,path + "buttons/" + name));

            let vergenceButtons = ["convergence.png","convergence-hover.png","divergence.png","divergence-hover.png"]
            .map(name=> toLoadObj(name, path + "buttons/" + name));

            loadArr = loadArr.concat(buttons).concat(background).concat(other);
            if(infor.testForFU) loadArr = loadArr.concat(testForFUBG);
            if(infor.selectDifficulty) loadArr=loadArr.concat(difficultyRelated);
            if(infor.selectFuseType) loadArr=loadArr.concat(fuseButtons);
            if(infor.selectTwinkleType) loadArr=loadArr.concat(twinkleButtons);
            if(infor.selectVergenceType) loadArr=loadArr.concat(vergenceButtons);
            if(infor.instructionItems) loadArr=loadArr.concat(infor.instructionItems);
            if(infor.instruction && typeof infor.instruction != "string") loadArr.push(infor.instruction);

            if(infor.language != "en") {
                babyEye.prepareTrainQueue.addEventListener("progress", (ev)=>{
                    loadingText.text = "资源加载中...";
                    stage.update();
                })
            }
            babyEye.prepareTrainQueue.addEventListener("complete", (ev)=>{
                $("#loading").hide();
                stage.removeAllChildren();
                onComplete();
            });
            babyEye.prepareTrainQueue.loadManifest(loadArr);
        }

        function toLoadObj(name, path) {
            let id = name.slice(0,name.indexOf("."));
            return {id: id , src: path}
        }
    }



    window.handleResize = ()=>{
        if(window.innerWidth < window.innerHeight * 1280/720){
            $("#game-canvas").css({
                "height": "auto",
                "width": "100vw"
            })
            $(".scale").css({
                "height": "auto",
                "width": "100vw"
            })
        }else {
            $("#game-canvas").css({
                "height": "100vh",
                "width": "auto"
            })
            $(".scale").css({
                "height": "100vh",
                "width": "auto"
            })
        };
    };

    window.addEventListener('resize', handleResize, false);
    window.handleResize();


    function is360() {
        //检测是否是谷歌内核(可排除360及谷歌以外的浏览器)
        function isChrome(){
            var ua = navigator.userAgent.toLowerCase();

            return ua.indexOf("chrome") > 1;
        }
        //测试mime
        function _mime(option, value) {
            var mimeTypes = navigator.mimeTypes;
            for (var mt in mimeTypes) {
                if (mimeTypes[mt][option] == value) {
                    return true;
                }
            }
            return false;
        }

        //application/vnd.chromium.remoting-viewer 可能为360特有
        var is360Value = _mime("type", "application/vnd.chromium.remoting-viewer");

        return (isChrome() && is360Value);
    }

    function getCookie(name) {
      var value = "; " + document.cookie;
      var parts = value.split("; " + name + "=");
      if (parts.length == 2) return parts.pop().split(";").shift();
    }

    babyEye.getCookie = getCookie;

    function isMobile() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            return true;
        } else {
            return false;
        }
    }

    babyEye.isMobile = isMobile;

    window.babyEye = babyEye;
})