import { state } from "../model";

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  add(vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  subtract(vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  multiply(scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  divide(scalar) {
    return new Vector(this.x / scalar, this.y / scalar);
  }

  unit() {
    if (this.magnitude() === 0) {
      return new Vector(0, 0);
    }

    return this.divide(this.magnitude());
  }

  normal() {
    return new Vector(-this.y, this.x);
  }

  dot(vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  draw(pos = new Vector(0, 0), color = "white", factor = 1) {
    const { canvas } = state.preset;

    canvas.ctx.beginPath();
    canvas.ctx.lineWidth = 1;
    canvas.ctx.moveTo(pos.x, canvas.toCanvasY(pos.y));
    canvas.ctx.lineTo(
      pos.x + this.x * factor,
      canvas.toCanvasY(pos.y + this.y * factor)
    );
    canvas.ctx.strokeStyle = color;
    canvas.ctx.stroke();
  }

  rotate(radians) {
    const x = this.x * Math.cos(radians) - this.y * Math.sin(radians);
    const y = this.x * Math.sin(radians) + this.y * Math.cos(radians);

    return new Vector(x, y);
  }

  angle() {
    return Math.atan(this.y / this.x);
  }
}

export default Vector;
