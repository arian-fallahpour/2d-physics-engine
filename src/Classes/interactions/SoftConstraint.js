import { state } from "../../model";
import AccGenerator from "../AccGenerator";
import Vector from "../Vector";
import Shape from "../shapes/Shape";
import Entity from "../shapes/entities/Entity";
import Interaction from "./Interaction";

class SoftConstraint extends Shape(Interaction) {
  _frame = 0;

  constructor({
    entity1 = new Entity({}),
    entity2 = new Entity({}),
    length = 100,
    stiffness = 0.03,
    damping = 0,
    stroke = "white",
    zigzagCount = 9,
    zigzagAmplitude = 10,
    ...otherArgs
  }) {
    otherArgs.stroke = stroke;
    super(otherArgs);

    this.entity1 = entity1;
    this.entity2 = entity2;
    this.length = length;
    this.stiffness = stiffness;
    this.damping = damping;
    this.zigzagCount = zigzagCount;
    this.zigzagAmplitude = zigzagAmplitude;

    // Add function generators to entities
    this.entity1.accs[this.name] = new AccGenerator(
      this.createAccGenerator(),
      entity1,
      entity1.pos
    );
    this.entity2.accs[this.name] = new AccGenerator(
      this.createAccGenerator(),
      entity2,
      entity2.pos
    );
  }
  createAccGenerator() {
    return (entity, pos) => {
      let entity1, entity2;
      if (entity === this.entity1) {
        entity1 = this.entity1;
        entity2 = this.entity2;
      } else {
        entity1 = this.entity2;
        entity2 = this.entity1;
      }

      const distance = entity2.pos.subtract(pos);
      const offset = distance.magnitude() - this.length;

      if (offset === 0) return;

      const force = this.stiffness * offset;

      const constraintMass = entity1.inverseMass + entity2.inverseMass;

      // Don't move any masses if
      if (constraintMass === 0) return;

      const tensionMagnitude = force / constraintMass;
      let tension = distance.unit().multiply(tensionMagnitude);

      const relVel = entity1.vel.subtract(entity2.vel);
      const friction = relVel.multiply(this.damping);
      tension = tension.subtract(friction);

      return tension.multiply(entity.inverseMass);
    };
  }

  draw() {
    const relativePos = this.entity2.pos.subtract(this.entity1.pos);
    const distance = relativePos.magnitude();
    const stretch = distance / this.length;

    const lineLength = 10;
    const zigzagLength = (this.length - 2 * lineLength) / this.zigzagCount;

    let line = this.entity1.pos;

    const canvas = state.preset.canvas;
    canvas.ctx.beginPath();
    canvas.ctx.lineWidth = this.thickness;
    canvas.ctx.lineCap = this.edges;
    canvas.ctx.moveTo(line.x, canvas.toCanvasY(line.y));

    line = line.add(relativePos.unit().multiply(lineLength * stretch));
    canvas.ctx.lineTo(line.x, canvas.toCanvasY(line.y));

    for (let i = 0; i < this.zigzagCount; i++) {
      // Move forward by zigzag length
      line = line.add(relativePos.unit().multiply(zigzagLength * stretch));

      // Move up or down for zigzag
      if (i === 0) {
        line = line.add(
          relativePos
            .unit()
            .normal()
            .multiply(this.zigzagAmplitude / 2)
        );
      } else if (i === this.zigzagCount - 1) {
        const factor =
          this.zigzagCount % 2 === 0
            ? -this.zigzagAmplitude / 2
            : this.zigzagAmplitude / 2;
        line = line.add(relativePos.unit().normal().multiply(factor));
      } else {
        const factor =
          i % 2 === 0 ? this.zigzagAmplitude : -this.zigzagAmplitude;
        line = line.add(relativePos.unit().normal().multiply(factor));
      }

      // Draw zigzag
      canvas.ctx.lineTo(line.x, canvas.toCanvasY(line.y));
    }

    line = line.add(relativePos.unit().multiply(lineLength * stretch));
    canvas.ctx.lineTo(line.x, canvas.toCanvasY(line.y));

    canvas.ctx.strokeStyle = this._colors.stroke;
    canvas.ctx.stroke();
    canvas.ctx.closePath();
  }

  update() {
    // Interaction applied as a dependent acceleration onto both entities

    this.draw();
  }
}

export default SoftConstraint;
