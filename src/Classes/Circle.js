import canvas from "./Canvas";
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
    canvas.ctx.beginPath();
    canvas.ctx.arc(
      this.pos.x,
      canvas.toCanvasY(this.pos.y),
      this.radius,
      0,
      2 * Math.PI
    );
    canvas.ctx.strokeStyle = this._colors.border;
    canvas.ctx.stroke();
    canvas.ctx.fillStyle = this._colors.fill;
    canvas.ctx.fill();

    this.reposition();
  }
}

export default Circle;
