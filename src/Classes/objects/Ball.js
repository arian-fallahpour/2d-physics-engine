import { state } from "../../model";

import Vector from "../Vector";
import Entity from "./Entity";

class Ball extends Entity {
  _tail = [];
  _imageInstance;

  constructor({ radius = 25, tailLength = 0, image, ...otherArgs }) {
    super(otherArgs);

    this.radius = radius;
    this.tailLength = tailLength;
    this.image = image;

    if (this.image) {
      this.loadImage();
    }

    // InitialState
    this.setInitial();
  }

  draw() {
    this.drawCircle({
      pos: this.pos,
      radius: this.radius,
      color: this.getColor("fill"),
      strokeColor: this.getColor("stroke"),
      shadowColor: this.getColor("shadow"),
      shadowLength: this.shadowLength,
      thickness: this.thickness,
    });
  }

  drawTail() {
    const data = {
      pos: this.pos,
      radius: this.radius,
      color: this.getColor("fill"),
      strokeColor: this.getColor("stroke"),
      thickness: this.thickness,
    };

    // Throttle to 60 times a second
    if ((this._frame + 35) % state.preset.options.stepsPerFrame === 0) {
      // Add newest segment
      this._tail.push(data);

      // Remove oldest segment if more than this.tailLength
      if (this.tailLength !== -1 && this._tail.length > this.tailLength) {
        this._tail.splice(0, 1);
      }
    }

    // Render tail
    for (let i = 0; i < this._tail.length; i++) {
      this.drawCircle(this._tail[i]);

      // const { canvas } = state.preset;

      // canvas.ctx.beginPath();
      // canvas.ctx.lineWidth = 1;
      // canvas.ctx.lineCap = "round";

      // for (let i = 0; i < this._tail.length; i++) {
      //   canvas.ctx.lineTo(
      //     this._tail[i].pos.x,
      //     canvas.toCanvasY(this._tail[i].pos.y)
      //   );
      // }
      // canvas.ctx.strokeStyle = this.getColor("fill");
      // canvas.ctx.stroke();
    }
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

  drawCircle({ pos, radius, color, strokeColor, thickness }) {
    const canvas = state.preset.canvas;

    canvas.ctx.beginPath();

    canvas.ctx.arc(pos.x, canvas.toCanvasY(pos.y), radius, 0, 2 * Math.PI);
    canvas.ctx.fillStyle = color;
    canvas.ctx.fill();

    canvas.ctx.strokeStyle = strokeColor;
    canvas.ctx.lineWidth = thickness;
    canvas.ctx.stroke();

    canvas.ctx.closePath();
  }

  loadImage() {
    this._imageInstance = new Image();
    this._imageInstance.src = this.image;
    this._imageInstance.onload = () => this.drawImage(true);
  }

  drawImage(onLoad = false) {
    const { canvas } = state.preset;

    canvas.ctx.save();

    const x =
      this.pos.x +
      (onLoad ? -this.vel.x / state.preset.options.stepsPerFrame : 0);
    const y =
      this.pos.y +
      (onLoad ? -this.vel.y / state.preset.options.stepsPerFrame : 0);

    canvas.ctx.beginPath();
    canvas.ctx.arc(
      x,
      canvas.toCanvasY(y),
      this.radius - (this.strokeColor === "transparent" ? 0 : 1 / 2),
      0,
      Math.PI * 2,
      false
    );
    canvas.ctx.clip();
    canvas.ctx.drawImage(
      this._imageInstance,
      x - this.radius,
      canvas.toCanvasY(y + this.radius),
      this.radius * 2,
      this.radius * 2
    );
    canvas.ctx.closePath();

    canvas.ctx.restore();
  }

  drawInfo() {
    const { canvas } = state.preset;

    const fontSize = 15;
    const lineHeight = 15;

    const props = [];

    // Refactor data
    this.displayInfo.forEach((prop) => {
      let name = prop;
      let value = this[prop];

      // Get magnitude if a vector
      if (value instanceof Vector) {
        value = value.magnitude();
      }

      // Round all numbers to 2 decimals
      if (typeof value === "number") {
        value = value.toFixed(2);
        name = name[0];
      }

      // Do not show name tag if propery is name
      if (name === "name") {
        name = undefined;
      }

      props.push({ name, value });
    });

    // Draw centered text
    props.forEach((info, i) => {
      const value = info.value;
      const text = `${info.name ? `${info.name}: ` : ""}${value}`;

      canvas.ctx.font = `${fontSize}px Georgia`;
      canvas.ctx.fillStyle = this.textColor;
      canvas.ctx.textBaseline = "middle";
      canvas.ctx.textAlign = "center";
      canvas.ctx.fillText(
        text,
        this.pos.x,
        canvas.toCanvasY(
          this.pos.y + ((props.length - 1) * lineHeight) / 2 - i * lineHeight
        )
      );
    });
  }

  drawVectors() {
    this.vel
      .unit()
      .multiply(3 * this.radius)
      .draw(this.pos, "white");
    Object.keys(this.accs).forEach((key) => {
      this.accs[key]
        .unit()
        .multiply(2 * this.radius)
        .draw(this.pos, "white");
    });
  }
}

export default Ball;
