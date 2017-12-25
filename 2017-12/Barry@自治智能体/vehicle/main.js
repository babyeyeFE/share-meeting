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
            this.runningTime = 0;
            this.targets = [];
            this.buildView();
            this.buildCar();
            this.buildTargets();
            this.events();
        }

        update(dt){
            // this.car.seek(this.target.location);
            this.car.followPath();
            this.car.update(dt);
        }

        events(){
            this.view.addEventListener("pressmove",(ev)=>{
                this.target.setLocation(ev.stageX, ev.stageY);
            })
        }

        buildView(){
            this.view = new createjs.Container();
            let bg = new createjs.Shape();
            bg.graphics.f("white").dr(0,0,this.game.width, this.game.height);
            this.view.addChild(bg);
        }

        buildCar(){
            this.car = new Car({
                location: new babyEye.Vec2(babyEye.randomRange(0,this.game.width),babyEye.randomRange(0,this.game.height)),
                acceleration: new babyEye.Vec2(0,0),
                velocity: new babyEye.Vec2(Math.random(), Math.random()),
                maxSpeed: 0.3,
                maxForce: 0.01,
                spaceOffset: 200
            });
            this.view.addChild(this.car.view);
        }

        buildTargets(){
            let targetLocations = [{x: 100,y: 50}, {x: 200,y:500}, {x: 800,y:200}, {x: 800,y:400}];
            for(let i=0; i<targetLocations.length;i++){
                let target = new Target({
                    location: targetLocations[i],
                    index:i
                })
                this.view.addChild(target.view);
                this.targets.push(target)
            }
            this.car.addPath(this.targets.map(target=>target.location));
        }
    }

    class Vehicle{
        constructor(config){
            this.location = config.location;
            this.velocity = config.velocity;
            this.acceleration = config.acceleration;
            this.maxSpeed = config.maxSpeed;
            this.maxForce = config.maxForce;
            this.spaceOffset = config.spaceOffset;
            this.buildSpace();
        }

        update(dt){
            this.velocity.add(this.acceleration);
            this.velocity.limit(this.maxSpeed);
            this.location.add(babyEye.Vec2.mult(this.velocity,dt));
            this.clearForce();
            this.bounds();
            this.updateView();
        }

        updateView(){
            this.view.set({
                x: this.location.x,
                y: this.location.y,
                rotation: this.velocity.heading() - 90
            });
        }

        buildSpace(){
            this.space = {
                lowerX: -this.spaceOffset,
                lowerY: -this.spaceOffset,
                higherX: 1280 + this.spaceOffset,
                higherY: 720 + this.spaceOffset
            }
        }

        seek(target, minScope=30, maxScope=Infinity){
            let desired = babyEye.Vec2.sub(target,this.location);
            let distance = desired.mag();
            if(distance > maxScope) return false;//距离太远，不再seek
            if(distance < minScope) {//进入目标附近
                this.velocity.limit(babyEye.map(desired.mag(),0,30,0,this.maxSpeed));
                return true;
            }

            desired.normalize();
            desired.mult(this.maxSpeed);
            this.applyForce(babyEye.Vec2.sub(desired, this.velocity));
            return false;
        }

        flee(target, scope=100){
            let desired = babyEye.Vec2.sub(this.location,target);
            let distance = desired.mag();
            if(distance < scope) {
                desired.normalize();
                desired.mult(this.maxSpeed);
                this.applyForce(babyEye.Vec2.sub(desired, this.velocity));
            }
        }

        followPath(){
            let pointToSeek = this.path[this.currentPathIndex];
            if(this.seek(pointToSeek)){
                this.currentPathIndex++;
                if(this.currentPathIndex >= this.path.length) this.currentPathIndex = this.path.length - 1;
            }
        }

        addPath(path){
            this.currentPathIndex = 0;
            this.path = path;
        }

        applyForce(f){
            if(f.mag() > this.maxForce) {
                f.normalize();
                f.mult(this.maxForce);
            }
            this.acceleration.add(f);
        }

        clearForce(){
            this.acceleration.x = 0;
            this.acceleration.y = 0;
        }

        bounds(){
            if(this.location.x < this.space.lowerX) this.location.x = this.space.higherX;
            if(this.location.y < this.space.lowerY) this.location.y = this.space.higherY;
            if(this.location.x > this.space.higherX) this.location.x = this.space.lowerX;
            if(this.location.y > this.space.higherY) this.location.y = this.space.lowerY;
        }
    }

    class Car extends Vehicle{
        constructor(config){
            super(config);
            this.buildView();
        }

        buildView(){
            this.view = new createjs.Shape();
            this.view.graphics.f('red').mt(-10,0).lt(0,30).lt(10,0);
        }
    }

    class Target {
        constructor(config){
            this.location = config.location;
            this.index = config.index;
            this.buildView();
        }

        buildView(){
            this.view = new createjs.Container();
            let bg = new createjs.Shape();
            bg.graphics.f("green").dc(0,0,5);
            let text = new createjs.Text(this.index, "30px cursive", "black");
            this.view.addChild(bg, text);
            this.view.set(this.location);
        }

        setLocation(nextX,nextY){
            this.location = {x: nextX, y: nextY};
            this.view.set(this.location);
        }
    }

    window.game = new Game();
})