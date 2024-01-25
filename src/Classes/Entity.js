import engine from "../data/engine";
import options from "../data/options";
import Vector from "./Vector";

class Entity {
  constructor({
    name = `${this.constructor.name}-${Math.random()}-${Date.now()}`,
    pos = new Vector(0, 0),
    vel = new Vector(0, 0),
    appliedAcc = new Vector(0, 0),
    color = "white",
    borderColor = "transparent",
    textColor = "white",
    rainbow = false,
    displayVectors = false,
    displayInfo = [],
    mass = 1,
    elasticity = 1,
    friction = 0,
    modifiers = [],
  }) {
    // Vectors
    this.pos = pos;
    this.vel = vel;
    this.acc = new Vector(0, 0);
    this.appliedAcc = appliedAcc;

    // Scalars
    this.color = color;
    this.borderColor = borderColor;
    this.textColor = textColor;
    this.rainbow = rainbow;
    this.mass = mass;
    this.inverseMass = mass > 0 ? 1 / mass : 0;
    this.friction = friction;
    this.elasticity = elasticity;

    // Other info
    this.name = name;

    // Settings
    this.displayVectors = displayVectors;
    this.displayInfo = displayInfo;

    // Modifier
    this.modifiers = modifiers.map((modifier) => modifier(this));
  }

  // APPLIED MOVEMENT
  applyAcc(acc) {
    this._appliedAcc = acc;
  }

  setVel(vel) {
    this.vel = vel;
  }

  // DRAWING
  shiftColor() {
    this.color = `hsl(${
      (engine.frame / options.requestFrameCount) % 360
    }, 100%, 50%)`;
  }

  reposition() {
    this.acc = this.appliedAcc;
    this.vel = this.vel
      .add(this.acc.divide(options.requestFrameCount))
      .multiply(1 - this.friction);
    this.pos = this.pos.add(this.vel.divide(options.requestFrameCount));
  }

  setInitial() {
    this.initial = { ...this };
  }

  addModifier(modifier = {}) {
    this.modifiers.push(modifier);
  }

  /** Runs all modifiers of indicated type */
  modify(type) {
    this.modifiers.forEach((modifier) => modifier[type]());
  }

  /** Reverts ball to initial state */
  static revert(object) {
    Entity.keys(object.initial).forEach((key) => {
      object[key] = object.initial[key];
    });
  }

  /** Modifies and draws objects with a callback function occuring after */
  static render(objects, cb = (object, i, arr) => {}) {
    objects.forEach((object, i, arr) => {
      object.modify("passive");
      object.draw();
      cb(object, i, arr);
    });
  }
}

export default Entity;
