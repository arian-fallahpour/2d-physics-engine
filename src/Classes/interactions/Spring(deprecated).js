import { state } from "../../model";
import AccGenerator from "../AccGenerator";
import Vector from "../Vector";
import Shape from "../shapes/Shape";
import Entity from "../shapes/entities/Entity";
import Interaction from "./Interaction";

class Spring extends Shape(Interaction) {
  _frame = 0;

  constructor({
    stiffness = 0.03,
    damping = 0,
    entity1 = new Entity({}),
    entity2 = new Entity({}),
    length = 100,
    stroke = "white",
    method = "rk4",
    zigzagCount = 9,
    ...otherArgs
  }) {
    otherArgs.stroke = stroke;
    super(otherArgs);

    this.entity1 = entity1;
    this.entity2 = entity2;
    this.length = length;
    this.damping = damping;
    this.zigzagCount = zigzagCount;

    this.stiffness = stiffness;
    this.method = method;
  }

  getAcc(entity, futurePos) {
    this[entity].pos = futurePos;

    const distance = this.entity2.pos.subtract(this.entity1.pos);
    const force = this.stiffness * (distance.magnitude() - this.length);

    const tensionMagnitude =
      (this[entity].inverseMass /
        (this.entity1.inverseMass + this.entity2.inverseMass)) *
      force;
    const tension = distance.unit().multiply(tensionMagnitude);

    let acc = this[entity].generateAcc();
    if (this[entity].accs[this.name]) {
      acc = acc.subtract(this[entity].accs[this.name]);
    }
    if (entity === "entity1") {
      acc = acc.add(tension);
    } else {
      acc = acc.add(tension.multiply(-1));
    }

    return acc;
  }

  repositionRK4(entity) {
    const obj = this[entity];
    const deltaTime = 1 / state.preset.options.stepsPerFrame;

    const x0 = obj.pos;
    const v0 = obj.vel;
    const a0 = this.getAcc(entity, x0);

    const x1 = x0.add(v0.multiply(deltaTime / 2));
    const v1 = v0.add(a0.multiply(deltaTime / 2));
    const a1 = this.getAcc(entity, x1);

    const x2 = x0.add(v1.multiply(deltaTime / 2));
    const v2 = v0.add(a1.multiply(deltaTime / 2));
    const a2 = this.getAcc(entity, x2);

    const x3 = x0.add(v2.multiply(deltaTime));
    const v3 = v0.add(a2.multiply(deltaTime));
    const a3 = this.getAcc(entity, x3);

    obj.pos = x0.add(
      v0
        .add(v1.multiply(2))
        .add(v2.multiply(2))
        .add(v3)
        .multiply(deltaTime / 6)
    );
    obj.vel = v0.add(
      a0
        .add(a1.multiply(2))
        .add(a2.multiply(2))
        .add(a3)
        .multiply(deltaTime / 6)
    );
  }

  applyTension(entity) {
    const distance = this.entity2.pos.subtract(this.entity1.pos);
    const force = this.stiffness * (distance.magnitude() - this.length);

    const tensionMagnitude =
      (this[entity].inverseMass /
        (this.entity1.inverseMass + this.entity2.inverseMass)) *
      force;
    let tension = distance.unit().multiply(tensionMagnitude);
    if (entity === "entity2") {
      tension = tension.multiply(-1);
    }

    this[entity].accs[this.name] = new AccGenerator(() => tension);
  }

  interact() {
    if (this.method === "rk4") {
      if (!this.entity1.disableReposition) {
        this.entity1.disableReposition = true;
        this.entity2.disableReposition = true;
      }

      this.repositionRK4("entity1");
      this.repositionRK4("entity2");
    } else {
      this.applyTension("entity1");
      this.applyTension("entity2");
    }
  }

  draw() {
    const relativePos = this.entity2.pos.subtract(this.entity1.pos);
    const distance = relativePos.magnitude();
    const stretch = distance / this.length;

    const lineLength = 10;
    const zigzagLength = (this.length - 2 * lineLength) / this.zigzagCount;
    const zigzagAmplitude = 10; // Adjust this value as needed

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
        line = line.add(new Vector(0, zigzagAmplitude / 2));
      } else if (i === this.zigzagCount - 1) {
        line = line.add(
          new Vector(
            0,
            this.zigzagCount % 2 === 0
              ? -zigzagAmplitude / 2
              : zigzagAmplitude / 2
          )
        );
      } else {
        line = line.add(
          new Vector(0, i % 2 === 0 ? zigzagAmplitude : -zigzagAmplitude)
        );
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
    this.draw();

    this.interact();
  }
}

export default Spring;
