import AccGenerator from "../AccGenerator";
import Shape from "../shapes/Shape";
import Interaction from "./Interaction";

class Attraction extends Shape(Interaction) {
  constructor({
    entity1,
    entity2,
    strength = 1,
    minRadius = 100,
    maxRadius,
    repulsion = false,
    ...otherArgs
  }) {
    super(otherArgs);

    this.entity1 = entity1;
    this.entity2 = entity2;
    this.strength = strength;
    this.minRadius = minRadius;
    this.maxRadius = maxRadius;
    this.repulsion = repulsion;

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

      const relativePos = entity2.pos.subtract(pos);

      const mass1 = entity1.mass !== 0 ? entity1.mass : 1;
      const mass2 = entity2.mass !== 0 ? entity2.mass : 1;

      let distanceSquared = relativePos.magnitude() ** 2;
      if (this.minRadius)
        distanceSquared = Math.max(distanceSquared, this.minRadius);
      if (this.maxRadius)
        distanceSquared = Math.min(distanceSquared, this.maxRadius);

      let force = this.strength * 1000 * ((mass1 * mass2) / distanceSquared);
      if (this.repulsion) force *= -1;

      return relativePos.unit().multiply(force * entity1.inverseMass);
    };
  }
}

export default Attraction;
