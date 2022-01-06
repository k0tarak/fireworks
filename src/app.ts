import { Console } from "console";
import { FPS } from "./constants";
import {Figure, FillStyle, Position, Speed} from "./figure";
import Firework from "./firework";


const canvas = document.getElementById("canvas") as HTMLCanvasElement;
let context = canvas.getContext("2d");

let fireworks : Figure[] = [];
document.addEventListener('keyup', event => {
    if (event.code === 'Space') {
        fireworks.push(
            new Firework(
                new Position(canvas.width/2, canvas.height),
                new Speed((Math.random() - 0.5) * 150 , -350 - Math.random() * 200),
                2,
                new FillStyle(255, 255, 255),
                3
            )
        );
    }
  });

console.log(context);
if(context) {
    (function() {
        render();
    })()
}

function render() : void {
    context!.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    fireworks.forEach(x => x.render(context!));
    fireworks = fireworks.filter(x => !x.deleted);
    setTimeout(() => requestAnimationFrame(render), 1000 / FPS);
}


