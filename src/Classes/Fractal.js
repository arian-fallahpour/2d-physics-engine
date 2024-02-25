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
  construct() {
    // Reset vectors array
    this.vectors = [];

    // Fill this.vectors with layers that are filled with vectors
    for (let i = 0; i < this.layers; i++) {
      // Initial layer
      if (i === 0) {
        const v = new Vector(0, this.baseLength, this.pos);
        this.vectors.push([v]);
        continue;
      }

      const previousLayer = this.vectors[i - 1];
      this.vectors[i] = [];

      // For every vector in the previous layer
      for (let j = 0; j < previousLayer.length; j++) {
        const vi = previousLayer[j];
        const magnitude = vi.magnitude() * (3 / 4);
        const pos = vi.add(vi.pos);

        const v1 = new Vector(vi.x, vi.y, pos)
          .rotate(-this.angle)
          .unit()
          .multiply(magnitude);
        const v2 = new Vector(vi.x, vi.y, pos)
          .rotate(this.angle)
          .unit()
          .multiply(magnitude);

        this.vectors[i].push(v1, v2);
      }
    }
  }

  draw() {
    // Construct vectors array
    this.construct();

    // Draw vectors
    this.vectors.forEach((layer) =>
      layer.forEach((vector) => {
        vector.draw();
      })
    );

    this.vectors = [];
  }
}

export default Fractal;
