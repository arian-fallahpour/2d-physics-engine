import canvas from "./Canvas";
import Entity from "./Entity";
import Vector from "./Vector";

class Wall extends Entity {
  constructor({
    start = new Vector(0, 0),
    end = new Vector(0, 0),
    elasticity = 1,
    ...otherArgs
  }) {
    super(otherArgs);

    this.start = start;
    this.end = end;
    this.elasticity = elasticity;

    this.setInitial();
  }

  draw() {
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(this.start.x, canvas.toCanvasY(this.start.y));
    canvas.ctx.lineTo(this.end.x, canvas.toCanvasY(this.end.y));
    canvas.ctx.strokeStyle = this._colors.fill;
    canvas.ctx.stroke();
  }

  // Unit vector from start to end of wall
  unit() {
    return this.start.subtract(this.end).unit();
  }
}

export default Wall;
