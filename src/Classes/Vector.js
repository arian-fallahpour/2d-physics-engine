import canvas from "./Canvas";

class Vector {
  constructor(x, y, pos) {
    this.x = x;
    this.y = y;
    this.pos = pos;
  }

  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  add(vector) {
    return new Vector(this.x + vector.x, this.y + vector.y, this.pos);
  }

  subtract(vector) {
    return new Vector(this.x - vector.x, this.y - vector.y, this.pos);
  }

  multiply(scalar) {
    return new Vector(this.x * scalar, this.y * scalar, this.pos);
  }

  divide(scalar) {
    return new Vector(this.x / scalar, this.y / scalar, this.pos);
  }

  unit() {
    if (this.magnitude() === 0) {
      return new Vector(0, 0);
    }

    return this.divide(this.magnitude());
  }

  normal() {
    return new Vector(-this.y, this.x, this.pos);
  }

  dot(vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  draw(x = this.pos.x, y = this.pos.y, color = "white", factor = 1) {
    canvas.ctx.beginPath();
    canvas.ctx.moveTo(x, canvas.toCanvasY(y));
    canvas.ctx.lineTo(
      x + this.x * factor,
      canvas.toCanvasY(y + this.y * factor)
    );
    canvas.ctx.strokeStyle = color;
    canvas.ctx.stroke();
  }

  rotate(radians) {
    const x = this.x * Math.cos(radians) - this.y * Math.sin(radians);
    const y = this.x * Math.sin(radians) + this.y * Math.cos(radians);

    return new Vector(x, y, this.pos);
  }

  setPos(vector) {
    return new Vector(this.x, this.y, vector);
  }
}

export default Vector;
