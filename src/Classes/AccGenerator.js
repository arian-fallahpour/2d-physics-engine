import Vector from "./Vector";

class AccGenerator {
  constructor(fn = (entity, dependency) => {}, entity, dependency) {
    this.fn = fn;
    this.entity = entity;
    this.dependency = dependency;
  }

  evaluate(dependency = this.dependency) {
    const value = this.fn(this.entity, dependency);

    if (value) {
      return value;
    } else {
      return new Vector(0, 0);
    }
  }
}

export default AccGenerator;
