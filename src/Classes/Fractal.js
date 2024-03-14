import Vector from "./Vector";
import Entity from "./objects/Entity";

class Fractal extends Entity {
  vectors = [];

  constructor({
    branches = 2,
    baseLength = 100,
    layers = 4,
    angle = Math.PI / 6,
    ...otherArgs
  }) {
    super(otherArgs);

    this.branches = branches;
    this.baseLength = baseLength;
    this.layers = layers;
    this.angle = angle;

    // InitialState
    this.setInitial();
  }

  /** Constructs fractals and their positions */
  draw() {
    // Reset vectors array
    this.vectors = [];

    // First branch
    const v = new Vector(0, this.baseLength);
    this.vectors.push([{ vector: v, pos: this.pos }]);
    v.draw(this.pos, this.color);

    // Fill this.vectors with layers that are filled with vectors
    for (let i = 1; i < this.layers; i++) {
      const previousLayer = this.vectors[i - 1];
      this.vectors[i] = [];

      // For every vector in the previous layer
      for (let j = 0; j < previousLayer.length; j++) {
        const vi = previousLayer[j].vector;
        const magnitude = vi.magnitude() * (3 / 4);
        const pos = vi.add(previousLayer[j].pos);
        const totalAngle = this.angle * (this.branches - 1);

        for (let k = 0; k < this.branches; k++) {
          const v = new Vector(vi.x, vi.y)
            .rotate(totalAngle / 2 + k * -this.angle)
            .unit()
            .multiply(magnitude);
          v.draw(pos, this.color);
          this.vectors[i].push({ vector: v, pos });
        }
      }
    }
  }
}

export default Fractal;
