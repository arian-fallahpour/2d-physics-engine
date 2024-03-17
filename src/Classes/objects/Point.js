import * as model from "../../model";
import Entity from "./Entity";

class Point extends Entity {
  constructor({ radius = 5, mass = 0, ...otherArgs }) {
    otherArgs.mass = mass;
    super(otherArgs);

    this.radius = radius;
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
    canvas.ctx.fillStyle = this.color;
    canvas.ctx.fill();

    canvas.ctx.strokeStyle = this.strokeColor;
    canvas.ctx.lineWidth = this.thickness;
    canvas.ctx.stroke();

    canvas.ctx.closePath();
  }
}

export default Point;
