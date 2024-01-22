import canvas from "./Canvas";
import Vector from "./Vector";

class Wall {
  constructor({
    start = new Vector(0, 0),
    end = new Vector(0, 0),
    elasticity = 1,
    color = "white",
  }) {
    this.start = start;
    this.end = end;
    this.elasticity = elasticity;
    this.color = color;
  }

  draw() {
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(this.start.x, canvas.toCanvasY(this.start.y));
    canvas.ctx.lineTo(this.end.x, canvas.toCanvasY(this.end.y));
    canvas.ctx.strokeStyle = this.color;
    canvas.ctx.stroke();
  }

  // Unit vector from start to end of wall
  unit() {
    return this.start.subtract(this.end).unit();
  }
}

export default Wall;
