import canvas from "./Canvas";
import Entity from "./Entity";

class Circle extends Entity {
  constructor({ radius = 100, ...otherArgs }) {
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
    canvas.ctx.strokeStyle = this.color;
    canvas.ctx.stroke();

    this.reposition();
  }
}

export default Circle;
