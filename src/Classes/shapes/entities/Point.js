import * as model from "../../../model";
import Shape from "../Shape";
import Entity from "./Entity";

class Point extends Shape(Entity) {
  constructor({ radius = 1, mass = 0, ...otherArgs }) {
    otherArgs.mass = mass;
    super(otherArgs);

    this.radius = radius;

    this.initial = { ...this };
  }

  draw() {
    this.drawDot();
  }

  drawDot() {
    const canvas = model.state.preset.canvas;

    canvas.ctx.beginPath();

    canvas.ctx.arc(
      this.pos.x,
      canvas.toCanvasY(this.pos.y),
      this.radius,
      0,
      2 * Math.PI
    );
    canvas.ctx.fillStyle = this._colors.fill;
    canvas.ctx.fill();

    canvas.ctx.strokeStyle = this._colors.stroke;
    canvas.ctx.lineWidth = this.thickness;
    canvas.ctx.stroke();

    canvas.ctx.closePath();
  }
}

export default Point;
