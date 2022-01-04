import { Distance, FPS } from "./constants";
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
            console.log(`[${this.position.x}, ${this.position.y}, ${this.position.z}]`);
            this.move();
            context.beginPath();
            context.arc(
                this.position.x,
                this.position.y,
                this.size * Distance/(Distance + this.position.z),
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
        this.position.z = this.position.z + this.speed.z * 1/FPS;

        this.delay = this.delay - 1/FPS;

        if(this.delay <=0) {
            this.blow();
        }
    }
    private blow() {
        let speeds : Speed[] = [];
        this.shards = [];

        for(let i = 0; i < 2 * Math.PI; i += Math.PI/6) {
            speeds.push(new Speed(Math.cos(i), Math.sin(i), 0));
        }
        for(let i = 0; i < 2 * Math.PI; i += Math.PI/3) {
            speeds.push(new Speed(Math.cos(i) * Math.cos(Math.PI/6), Math.sin(i), Math.sin(Math.PI/6)));
            speeds.push(new Speed(Math.cos(i) * Math.cos(Math.PI/6), Math.sin(i), -Math.sin(Math.PI/6)));
        }
        for(let i = 0; i < 2 * Math.PI; i += Math.PI/2) {
            speeds.push(new Speed(Math.cos(i)* Math.cos(Math.PI/3), Math.sin(i), Math.sin(Math.PI/3)));
            speeds.push(new Speed(Math.cos(i)* Math.cos(Math.PI/3), Math.sin(i), -Math.sin(Math.PI/3)));
        }

        for(let s of speeds){
            this.shards.push(
                new CircleShard(
                    this.position.clone(),
                    s.multiply(200),
                    10,
                    this.fillStyle.clone(),
                    3
                )
            );
        }


    }

}

class CircleShard extends Figure {
    private size: number;
    private lifetime: number;
    private timeLeft: number;
    constructor(position: Position, speed : Speed, size: number, fillStyle: FillStyle, lifetime: number){
        super(position, speed, fillStyle);
        this.size = size;
        this.lifetime = lifetime;
        this.timeLeft = lifetime;
    }
    render(context: CanvasRenderingContext2D): void {
        this.move();
        context.beginPath();
        context.arc(  
            this.position.x,
            this.position.y,
            this.size * (2 - this.timeLeft/this.lifetime) * Distance/(Distance + this.position.z),
            0,
            2 * Math.PI
        );
        this.fillStyle.a = this.timeLeft/this.lifetime;
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
        this.position.z = this.position.z + this.speed.z * 1/FPS;
    }   
}