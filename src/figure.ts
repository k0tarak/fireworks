export abstract class Figure {
    protected readonly position: Position;
    protected readonly speed: Speed;
    protected readonly fillStyle: FillStyle;
    public deleted: boolean = false; 
    constructor(position: Position, speed : Speed, fillStyle: FillStyle){
        this.position = position;
        this.speed = speed;
        this.fillStyle = fillStyle;
    }
    abstract render(context : CanvasRenderingContext2D) : void;
    abstract move() : void;
}

export class Position {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    clone() {
        return new Position(this.x, this.y);
    }
}

export class Speed {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    multiply(num: number) : Speed {
        this.x *= num;
        this.y *= num;
        return this;
    }
}

export class FillStyle {
    public r: number;
    public g: number;
    public b: number;
    public a: number;
    constructor(r: number, g: number, b: number, a?: number) {
        this.r = Math.floor(r);
        this.g = Math.floor(g);
        this.b = Math.floor(b);
        this.a = a ?? 1.0;
    }
    toColor(){
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
    clone() : FillStyle {
        return new FillStyle(this.r, this.g, this.b, this.a);
    }
}