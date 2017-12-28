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
            this.vehicles = [];
            this.buildVehicles();
            this.events();
        }

        update(dt){
            // this.vehicle.repel(this.mouseLocation);
            // this.vehicle.update();
            for(let i = 0; i < this.vehicles.length; i++){
                this.vehicles[i].attract(this.mouseLocation);
                for(let j = 0; j < this.vehicles.length; j++){
                    if(i != j) this.vehicles[i].repel(this.vehicles[j].location);
                }
                this.vehicles[i].update();
            }
        }

        events(){
            this.mouseLocation = new babyEye.Vec2();
            this.game.stage.addEventListener("stagemousemove",(ev)=>{
                this.mouseLocation.set(ev.localX, ev.localY);
            });
        }

        buildVehicles(){
            for(let i = 0; i < 10; i++){
                let vehicle = new Vehicle();
                this.view.addChild(vehicle.view);
                this.vehicles.push(vehicle);
            }
        }
    }

    class Vehicle {
        constructor(){
            // this.initX = 50;
            // this.initY = 50;
            // this.vx = 0.5;
            // this.vy = 0.5;
            this.maxSpeed = 5;
            this.location = new babyEye.Vec2(babyEye.randomRange(100,1000),babyEye.randomRange(100,500));
            this.velocity = new babyEye.Vec2(0.5,1);
            this.acceleration = new babyEye.Vec2(0.01,0);
            this.buildView();
        }

        update(){
            // this.view.x += this.vx;
            // this.view.y += this.vy;

            this.velocity.add(this.acceleration);
            this.velocity.limit(3);
            this.location.add(this.velocity);
            // this.checkBounds();
            this.updateView();

            this.clearForce();
        }

        checkBounds(){
            let offset = 50;
            if(this.location.x > 1280 + offset){
                this.location.x = 0;
            }else if(this.location.x < -offset){
                this.location.x = 1280;
            }

            if(this.location.y > 720 + offset){
                this.location.y = 0;
            }else if(this.location.y < -offset){
                this.location.y = 720;
            }
        }

        attract(loc, scope = 200){
            let direction = babyEye.Vec2.sub(loc, this.location);
            if(direction.mag() > scope) return;
            direction.normalize();
            direction.mult(this.maxSpeed * 4);
            this.applyForce(direction);
        }

        repel(loc, scope = 50){
            let direction = babyEye.Vec2.sub(this.location, loc);
            if(direction.mag() > scope) return;
            direction.normalize();
            direction.mult(this.maxSpeed);
            this.applyForce(direction);
        }

        applyForce(f){
            this.acceleration.add(f);
        }

        clearForce(){
            this.acceleration.set(0,0);
        }

        updateView(){
            this.view.set(this.location);
        }

        buildView(){
            this.view = new createjs.Shape();
            this.view.graphics.f("red").dc(0,0,10);
            this.view.set(this.location);
        }
    }

    window.game = new Game();
})