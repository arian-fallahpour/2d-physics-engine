import Entity from "./Entity";

class Pendulum extends Entity {
  constructor({ minLength = 50, entity, ...otherArgs }) {
    super(otherArgs);

    this.minLength = minLength;
    this.entity = entity;
  }
}
