import { state } from "../../model";
import Vector from "../Vector";

import Entity from "./Entity";

import options from "../../data/options";

class Ball extends Entity {
  _moving = {
    acc: new Vector(0, 0),
    up: false,
    down: false,
    right: false,
    left: false,
  };
  _tail = [];
  _imageInstance;

  constructor({
    radius = 25,
    tailLength = 0,
    image,
    controls = false,
    ...otherArgs
  }) {
    super(otherArgs);

    this.radius = radius;
    this.tailLength = tailLength;
    this.image = image;
    this.controls = controls;

    if (this.controls) {
      this.controlMovement();
    }

    if (this.image) {
      this.loadImage();
      this.color = "transparent";
    }

    // InitialState
    this.setInitial();
  }

  // DRAW FUNCTIONS
  draw() {
    // Leave trail behind
    if (this.tailLength !== 0) {
      this.drawTail();
    }

    // Draw shadow
    if (this.shadowColor !== "transparent") {
      this.drawShadow();
    }

    // Draw circle
    this.drawCircle({
      pos: this.pos,
      radius: this.radius,
      color: this.getColor("fill"),
      strokeColor: this.getColor("stroke"),
      shadowColor: this.getColor("shadow"),
      shadowLength: this.shadowLength,
    });

    // Draw image if exists
    if (this.image) {
      this.drawImage();
    }

    // Reposition ball
    this.reposition();

    // Draw movement vectors
    if (this.displayVectors) {
      this.drawVectors();
    }

    // Draw ball information
    if (this.displayInfo.length) {
      this.drawInfo();
    }
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
    if ((this._frame + 35) % options.requestFrameCount === 0) {
      // Add newest segment
      this._tail.push(data);

      // Remove oldest segment if more than this.tailLength
      if (this.tailLength !== -1 && this._tail.length > this.tailLength) {
        this._tail.splice(0, 1);
      }
    }

    // Render tail
    this._tail.forEach((segment) => {
      this.drawCircle(segment);
    });
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
    const { canvas } = state.preset;

    canvas.ctx.beginPath();

    canvas.ctx.arc(pos.x, canvas.toCanvasY(pos.y), radius, 0, 2 * Math.PI);
    canvas.ctx.fillStyle = color;
    canvas.ctx.fill();

    canvas.ctx.strokeStyle = strokeColor;
    canvas.ctx.strokeWidth = thickness;
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
      this.pos.x + (onLoad ? -this.vel.x / options.requestFrameCount : 0);
    const y =
      this.pos.y + (onLoad ? -this.vel.y / options.requestFrameCount : 0);

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

  drawVectors() {
    this.vel
      .unit()
      .multiply(2 * this.radius)
      .draw(this.pos.x, this.pos.y, "blue");
    this.acc.unit().multiply(this.radius).draw(this.pos.x, this.pos.y, "red");
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
        this.pos.x - this.vel.x,
        canvas.toCanvasY(
          this.pos.y -
            this.vel.y +
            ((props.length - 1) * lineHeight) / 2 -
            i * lineHeight
        )
      );
    });
  }

  reposition() {
    this.acc = this.appliedAcc.add(this._moving.acc);
    this.vel = this.vel
      .add(this.acc.divide(options.requestFrameCount))
      .multiply(1 - this.friction);
    this.pos = this.pos.add(this.vel.divide(options.requestFrameCount));
  }

  controlMovement() {
    const events = ["keydown", "keyup"];

    const magnitude = 0.6;
    const direction = new Vector(0, 0);

    events.forEach((event) => {
      window.addEventListener(event, (e) => {
        if (e.key === "w") {
          this._moving.up = e.type === "keydown" ? true : false;
        }
        if (e.key === "s") {
          this._moving.down = e.type === "keydown" ? true : false;
        }
        if (e.key === "d") {
          this._moving.right = e.type === "keydown" ? true : false;
        }
        if (e.key === "a") {
          this._moving.left = e.type === "keydown" ? true : false;
        }

        if (this._moving.up) {
          direction.y = 1;
        }
        if (this._moving.down) {
          direction.y = -1;
        }
        if (this._moving.right) {
          direction.x = 1;
        }
        if (this._moving.left) {
          direction.x = -1;
        }

        if (!this._moving.up && !this._moving.down) {
          direction.y = 0;
        }

        if (!this._moving.right && !this._moving.left) {
          direction.x = 0;
        }

        this._moving.acc = direction.unit().multiply(magnitude);
      });
    });
  }
}

export default Ball;
