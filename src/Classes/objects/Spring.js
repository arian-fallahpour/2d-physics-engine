import { state } from "../../model";
import Vector from "../Vector";
import Entity from "./Entity";

class Spring extends Entity {
  constructor({
    stiffness = 0.03,
    damping = 0,
    start = new Entity({}),
    end = new Entity({}),
    length = 100,
    strokeColor = "white",

    ...otherArgs
  }) {
    otherArgs.strokeColor = strokeColor;
    super(otherArgs);

    this.start = start;
    this.end = end;
    this.length = length;
    this.damping = damping;

    this.stiffness = stiffness;
  }

  affect() {
    const distance = this.end.pos.subtract(this.start.pos);

    const force = this.stiffness * (distance.magnitude() - this.length);
    const startTension =
      (this.start.inverseMass /
        (this.start.inverseMass + this.end.inverseMass)) *
      force;
    const endTension =
      (this.end.inverseMass / (this.start.inverseMass + this.end.inverseMass)) *
      force;

    // Not sure if this damping is good
    this.end.vel = this.end.vel.multiply(1 - 0.001 * this.damping);

    this.start.accs[this.name] = distance.unit().multiply(startTension);
    this.end.accs[this.name] = distance.unit().multiply(-endTension);
  }

  draw() {
    const canvas = state.preset.canvas;
    canvas.ctx.beginPath();
    canvas.ctx.lineWidth = this.thickness;
    canvas.ctx.lineCap = this.edges;
    canvas.ctx.moveTo(this.start.pos.x, canvas.toCanvasY(this.start.pos.y));
    canvas.ctx.lineTo(this.end.pos.x, canvas.toCanvasY(this.end.pos.y));
    canvas.ctx.strokeStyle = this.getColor("fill");
    canvas.ctx.stroke();
    canvas.ctx.closePath();
  }
}

export default Spring;
