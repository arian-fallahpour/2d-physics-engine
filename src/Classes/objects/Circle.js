import { state } from "../../model";
import Entity from "./Entity";

class Circle extends Entity {
  constructor({
    radius = 100,
    mass = 0,
    color = "transparent",
    strokeColor = "white",
    ...otherArgs
  }) {
    otherArgs.mass = mass;
    otherArgs.color = color;
    otherArgs.strokeColor = strokeColor;

    super(otherArgs);

    this.radius = radius;

    this.setInitial();
  }

  draw() {
    const { canvas } = state.preset;

    // Draw shadow
    if (this.shadowColor !== "transparent") {
      this.drawShadow();
    }

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

  drawShadow() {
    const { canvas } = state.preset;
    canvas.ctx.beginPath();

    const inner = Math.min(this.shadowLength, this.radius);
    const outer = this.shadowLength;
    const gradient = canvas.ctx.createRadialGradient(
      this.pos.x,
      canvas.toCanvasY(this.pos.y),
      this.radius - inner,
      this.pos.x,
      canvas.toCanvasY(this.pos.y),
      this.radius + outer
    );

    gradient.addColorStop(0, "transparent");
    gradient.addColorStop(inner / (inner + outer), this.getColor("shadow"));
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
