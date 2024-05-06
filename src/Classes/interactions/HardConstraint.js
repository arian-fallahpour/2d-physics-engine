import { state } from "../../model";
import Shape from "../shapes/Shape";
import Entity from "../shapes/entities/Entity";
import Interaction from "./Interaction";

class HardConstraint extends Shape(Interaction) {
  _frame = 0;

  constructor({
    entity1 = new Entity({}),
    entity2 = new Entity({}),
    length = 100,
    biasFactor = 30,
    stroke = "white",
    ...otherArgs
  }) {
    otherArgs.stroke = stroke;
    super(otherArgs);

    this.entity1 = entity1;
    this.entity2 = entity2;
    this.length = length;
    this.biasFactor = biasFactor;
  }

  // Link: https://research.ncl.ac.uk/game/mastersdegree/gametechnologies/physicstutorials/8constraintsandsolvers/Physics%20-%20Constraints%20and%20Solvers.pdf
  interact() {
    const relativePos = this.entity1.pos.subtract(this.entity2.pos);
    const distance = relativePos.magnitude();

    const offset = this.length - distance;

    // Only apply impulse if there is an offset
    if (Math.abs(offset) === 0) return;

    const offsetDir = relativePos.unit();

    const relativeVel = this.entity1.vel.subtract(this.entity2.vel);
    const velocityDot = relativeVel.dot(offsetDir);

    const constraintMass = this.entity1.inverseMass + this.entity2.inverseMass;

    // Don't move entities if both have zero mass
    if (constraintMass === 0) return;

    const bias =
      -(this.biasFactor / state.preset.options.stepsPerFrame) * offset;

    const impulseMagnitude = (velocityDot + bias) / constraintMass;

    this.entity1.vel = this.entity1.vel.add(
      offsetDir.multiply(-impulseMagnitude * this.entity1.inverseMass)
    );
    this.entity2.vel = this.entity2.vel.add(
      offsetDir.multiply(impulseMagnitude * this.entity2.inverseMass)
    );
  }

  draw() {
    const canvas = state.preset.canvas;
    canvas.ctx.beginPath();
    canvas.ctx.lineWidth = this.thickness;
    canvas.ctx.lineCap = this.edges;
    canvas.ctx.moveTo(this.entity1.pos.x, canvas.toCanvasY(this.entity1.pos.y));
    canvas.ctx.lineTo(this.entity2.pos.x, canvas.toCanvasY(this.entity2.pos.y));
    canvas.ctx.strokeStyle = this.getColor("stroke");
    canvas.ctx.stroke();
    canvas.ctx.closePath();
  }

  update() {
    this.draw();

    this.interact();
  }
}

export default HardConstraint;
