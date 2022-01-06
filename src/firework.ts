import {FPS } from "./constants";
import {Figure, FillStyle, Position, Speed} from "./figure";

export default class Firework extends Figure {
    private size: number;
    private shards?: Figure[];
    private delay: number;
    constructor(position: Position, speed : Speed, size: number, fillStyle: FillStyle, delay: number){
        super(position, speed, fillStyle);
        this.size = size;
        this.delay = delay;
    }
    render(context: CanvasRenderingContext2D): void {
        if(this.shards){
            this.shards.forEach(x => x.render(context));
            this.shards = this.shards.filter(x => !x.deleted);
            if(this.shards.length === 0) {
                this.deleted = true;
            }
        }
        else{
            this.move();
            context.beginPath();
            context.arc(
                this.position.x * window.screen.availHeight / 1200,
                this.position.y * window.screen.availHeight / 1200,
                this.size,
                0,
                2 * Math.PI,
                false
            );
            context.fillStyle = this.fillStyle.toColor();
            context.closePath();
            context.fill(); 
        }
    }
    move() : void {
        this.speed.y = this.speed.y + 100 * 1/FPS;
        this.position.x = this.position.x + this.speed.x * 1/FPS;
        this.position.y = this.position.y + this.speed.y * 1/FPS;

        this.delay = this.delay - 1/FPS;

        if(this.delay <=0) {
            this.blow();
        }
    }
    private blow() {
        this.shards = [];
        let delay = 0;
        let r = Math.random();
        let g = Math.random();
        let b = Math.random();

        if(r > b)
            b = b/2;
        if(b > g)
            g = g/2
        if(g > r)
            r = r/2
        var rnd = Math.floor(Math.random() * 16)
        if(rnd < 6)
            rnd = 6;
        var dist = Math.random()/2 + 1;
        for(let t = 0; t<60; t++) {
            let fill = new FillStyle((r != 0 ? 100 * r : 0) + r*3,(g != 0 ? 100 * g : 0) +  g*3,(b != 0 ? 100 * b : 0) +  b*3);
            this.fillStyle.r += 20;

            for(let i = 0; i < 2 * Math.PI; i += Math.PI/rnd) {
                this.shards.push(
                    new CircleShard(
                        this.position.clone(),
                        new Speed(Math.cos(i), Math.sin(i)).multiply(200 * dist),
                        5 * dist * Math.sqrt((1-delay)),
                        fill.clone(),
                        4,
                        delay,
                        delay
                    )
                );
            }
            delay += 1/FPS;
        }
    }

}

class CircleShard extends Figure {
    private size: number;
    private lifetime: number;
    private timeLeft: number;
    private delay: number;
    visualDelay: number;
    constructor(position: Position, speed : Speed, size: number, fillStyle: FillStyle, lifetime: number, delay: number, visualDelay: number){
        super(position, speed, fillStyle);
        this.size = size;
        this.lifetime = lifetime;
        this.timeLeft = lifetime;
        this.delay = delay;
        this.visualDelay = visualDelay;
    }
    render(context: CanvasRenderingContext2D): void {
        if(this.delay > 0){
            this.delay -= 1/FPS;
            return;
        }
        this.move();
        if(this.visualDelay > 0){
            this.visualDelay -= 1/FPS;
            return;
        }
        context.beginPath();
        context.arc(  
            this.position.x * window.screen.availHeight / 1400,
            this.position.y * window.screen.availHeight / 1400,
            this.size * (2 - this.timeLeft/this.lifetime),
            0,
            2 * Math.PI
        );
        this.fillStyle.a = Math.sqrt(this.timeLeft/this.lifetime);
        this.timeLeft -= 1/FPS;
        context.fillStyle = this.fillStyle.toColor();
        context.closePath();
        context.fill(); 

        if(this.timeLeft <= 0){
            this.deleted = true;
        }
    }

    move() : void {
        this.speed.y = this.speed.y + 50 * 1/FPS;
        this.position.x = this.position.x + this.speed.x * 1/FPS;
        this.position.y = this.position.y + this.speed.y * 1/FPS;
    }   
}