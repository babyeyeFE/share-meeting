$(window).ready(function(){
    let log = console.log;
    class Game {
        constructor(trainInfor) {
            this.trainInfor = trainInfor;
            this.stage = new createjs.Stage("game-canvas");
            this.stage.enableMouseOver();
            createjs.Touch.enable(this.stage);
            this.width = this.stage.canvas.width;
            this.height = this.stage.canvas.height;
            this.lastFrame = 0;
            this.buildWorld();//产生训练场景
            this.render();
        }

        buildWorld() {
            this.world = new World(this);
            this.stage.addChild(this.world.view);
        }

        render(timestamp = 0) {
            if (this.pauseValue) return;
            if (this.failValue) return;

            let dt = timestamp - this.lastFrame;
            if (dt > 150 || dt < 0) dt = 0;
            this.lastFrame = timestamp;

            this.world.update(dt);
            this.stage.update();

            requestAnimationFrame((timestamp) => {
                this.render(timestamp);
            })
        }

        pause() {
            this.pauseValue = true;
        }

        continue() {
            if (this.pauseValue) {
                this.pauseValue = false;
                this.render();
            }
        }

        replay() {
            $(window).unbind();//解绑事件
            this.stage.removeAllChildren();
            this.stage.removeAllEventListeners();
            this.stage.enableMouseOver(0);
            this.pause();
            createjs.Sound.stop();
            babyEye.prepareTrain(prepareConfig);
        }
    }
    
    class World {
        constructor(game) {
            this.game = game;
            this.view = new createjs.Container();
            this.buildVehicle();
        }

        update(dt){
            this.vehicle.update();
        }

        buildVehicle(){
            this.vehicle = new Vehicle();
            this.view.addChild(this.vehicle.view);
        }
    }

    class Vehicle {
        constructor(){
            this.initX = 50;
            this.initY = 50;
            this.vx = 0.5;
            this.vy = 0.5;
            this.buildView();
        }

        update(){
            this.view.x += this.vx;
            this.view.y += this.vy;
        }

        buildView(){
            this.view = new createjs.Shape();
            this.view.graphics.f("red").dc(0,0,10);
            this.view.set({
                x: this.initX,
                y: this.initY
            })
        }
    }

    window.game = new Game();
})