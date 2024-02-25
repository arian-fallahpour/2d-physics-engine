import { state } from "../../model";
import Entity from "./Entity";

class Circle extends Entity {
  constructor({ radius = 100, mass = 0, color = "transparent", ...otherArgs }) {
    otherArgs.mass = mass;
    otherArgs.color = color;

    super(otherArgs);

    this.radius = radius;

    this.setInitial();
  }

  draw() {
    const { canvas } = state.preset;

    canvas.ctx.beginPath();
    canvas.ctx.lineWidth = this.thickness;
    canvas.ctx.arc(
      this.pos.x,
      canvas.toCanvasY(this.pos.y),
      this.radius,
      0,
      2 * Math.PI
    );
    canvas.ctx.strokeWidth = this.thickness;
    canvas.ctx.strokeStyle = this.getColor("stroke");
    canvas.ctx.stroke();
    canvas.ctx.fillStyle = this.getColor("fill");
    canvas.ctx.fill();

    this.reposition();
  }

  closestPointTo(pos) {
    const circleToBall = pos.subtract(this.pos);
    const closestPoint = circleToBall
      .unit()
      .multiply(this.radius)
      .add(this.pos);

    return closestPoint;
  }
}

export default Circle;
