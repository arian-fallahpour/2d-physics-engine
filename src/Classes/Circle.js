import canvas from "./Canvas";
import Vector from "./Vector";

class Circle {
  constructor({
    pos = new Vector(0, 0),
    radius = 100,
    color = "black",
    elasticity = 1,
  }) {
    this.pos = pos;
    this.radius = radius;
    this.color = color;
    this.elasticity = elasticity;
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
    canvas.ctx.strokeStyle = this.color;
    canvas.ctx.stroke();
  }
}

export default Circle;
