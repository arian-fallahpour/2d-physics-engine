import { state } from "../../../model";
import Shape from "../Shape";
import Entity from "./Entity";

class Circle extends Shape(Entity) {
  constructor({
    radius = 100,

    mass = 0,
    fill = "transparent",
    stroke = "white",
    ...otherArgs
  }) {
    otherArgs.mass = mass;
    otherArgs.fill = fill;
    otherArgs.stroke = stroke;

    super(otherArgs);

    this.radius = radius;

    this.initial = { ...this };
  }

  draw() {
    const canvas = state.preset.canvas;

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
    canvas.ctx.strokeStyle = this._colors.stroke;
    canvas.ctx.stroke();
    canvas.ctx.fillStyle = this._colors.fill;
    canvas.ctx.fill();

    this.reposition();
  }

  drawShadow() {
    const canvas = state.preset.canvas;

    canvas.ctx.beginPath();

    const inner = Math.min(this.shadowBlur, this.radius);
    const outer = this.shadowBlur;
    const gradient = canvas.ctx.createRadialGradient(
      this.pos.x,
      canvas.toCanvasY(this.pos.y),
      this.radius - inner,
      this.pos.x,
      canvas.toCanvasY(this.pos.y),
      this.radius + outer
    );

    gradient.addColorStop(0, "transparent");
    gradient.addColorStop(inner / (inner + outer), this._colors.shadow);
    gradient.addColorStop(1, "transparent");

    canvas.ctx.arc(
      this.pos.x,
      canvas.toCanvasY(this.pos.y),
      this.radius + outer,
      0,
      2 * Math.PI
    );
    canvas.ctx.fillStyle = gradient;
    canvas.ctx.fill();

    canvas.ctx.closePath();
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
