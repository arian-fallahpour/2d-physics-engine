import options from "../../data/options";
import { transition } from "../../helper";
import Vector from "../Vector";
import color from "onecolor";

const colorTypes = {
  fill: "color",
  stroke: "strokeColor",
  text: "textColor",
  shadow: "shadowColor",
};
const colorValues = ["color", "strokeColor", "textColor", "shadowColor"];

class Entity {
  acc = new Vector(0, 0);
  _modifiers = {
    passive: [],
    active: [],
  };
  _frame = 0;
  _transitions = {};
  _frozen = {};

  // True rgb values
  _colors = {
    fill: "",
    stroke: "",
    text: "",
    shadow: "",
  };

  constructor({
    pos = new Vector(0, 0),
    vel = new Vector(0, 0),
    appliedAcc = new Vector(0, 0),

    color = "white",
    strokeColor = "transparent",
    textColor = "black",
    shadowColor = "transparent",
    shadowLength = 50,

    mass = 1,
    elasticity = 1,
    thickness = 1,
    friction = 0,

    name = `${this.constructor.name}-${Math.random()}-${Date.now()}`,
    displayVectors = false,
    displayInfo = [],
  }) {
    this.pos = pos;
    this.vel = vel;
    this.appliedAcc = appliedAcc;

    this.color = color;
    this.strokeColor = strokeColor;
    this.textColor = textColor;
    this.shadowColor = shadowColor;
    this.shadowLength = shadowLength;

    this.mass = mass;
    this.inverseMass = mass > 0 ? 1 / mass : 0;
    this.friction = friction;
    this.elasticity = elasticity;
    this.thickness = thickness;

    this.name = name;
    this.displayVectors = displayVectors;
    this.displayInfo = displayInfo;
  }

  setAppliedAcc(acc) {
    this.appliedAcc = acc;
  }

  setVel(vel) {
    this.vel = vel;
  }

  setPos(pos) {
    this.pos = pos;
  }

  freeze() {
    this._frozen.vel = this.vel;
    this._frozen.appliedAcc = this.appliedAcc;

    this.vel = new Vector(0, 0);
    this.appliedAcc = new Vector(0, 0);
  }

  unfreeze() {
    this.vel = this._frozen.vel;
    this.appliedAcc = this._frozen.appliedAcc;

    this._frozen = {};
  }

  setMass(mass) {
    this.mass = mass;
    this.inverseMass = mass > 0 ? 1 / mass : 0;
  }

  getRainbow() {
    return `hsl(${(this._frame / options.requestFrameCount) % 360}, 100%, 50%)`;
  }

  getColor(colorType) {
    return this._colors[colorType];
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

  addModifier(modifier) {
    this._modifiers[modifier.type].push(modifier);
  }

  modify(type, data) {
    this._modifiers[type].forEach((modifier) => modifier.apply(data));
  }

  reset() {
    if (!this.initial) throw new Error("You forgot to set initial state");

    Object.keys(this.initial).forEach((key) => {
      // Skip if values don't exist (exclude 0)
      if (
        this[key] === undefined ||
        this[key] === null ||
        this.initial[key] === undefined ||
        this.initial[key] === null
      ) {
        return;
      }

      this[key] = this.initial[key];
    });
  }

  calculateColor() {
    Object.keys(colorTypes).forEach((type) => {
      if (this[colorTypes[type]] === "rainbow") {
        this._colors[type] = this.getRainbow();
      } else {
        this._colors[type] = this[colorTypes[type]];
      }
    });
  }

  transition(property, value, frames, isPulse, wasPulse) {
    const existing = this._transitions[property];

    const data = {
      start: this._frame,
      duration: frames * options.requestFrameCount,
      property,
      initial: this[property],
      final: value,
      isPulse,
      wasPulse,
    };

    // Prevents final value being set as initial if multiple pulses occur faster than the duration
    if (existing && existing.wasPulse) {
      data.initial = existing.final;
    } else if (existing) {
      data.initial = existing.initial;
    }

    this._transitions[property] = data;
  }

  pulse(property, value, frames) {
    this.transition(property, value, frames, true);
  }

  applyTransitions() {
    Object.keys(this._transitions).forEach((property, i) => {
      const data = this._transitions[property];
      const { initial, final } = data;

      // Calculate step
      const step = this._frame - data.start;

      // Stop and remove transition if it is over
      if (step > data.duration) {
        delete this._transitions[property];

        // Revert transition if it is a pulse
        if (data.isPulse) {
          this.transition(
            data.property,
            initial,
            data.duration / options.requestFrameCount,
            false,
            true
          );
        }

        return;
      }

      const isColor = colorValues.includes(data.property);

      // Apply transition
      if (isColor) {
        const ci = color(initial);
        const cf = color(final);

        const rgba = {};
        ["r", "g", "b", "a"].forEach((p) => {
          rgba[p] = transition(step, data.duration, ci[p](), cf[p]());
        });

        this[data.property] = `rgba(${rgba.r * 255},${rgba.g * 255},${
          rgba.b * 255
        },${rgba.a})`;
      } else {
        this[data.property] = transition(step, data.duration, initial, final);
      }
    });
  }

  static render(objects, cb = (object, i, arr) => {}) {
    if (objects.length === 0) return;

    objects.forEach((object, i, arr) => {
      object._frame += 1;

      // Calculate true color value
      object.calculateColor();

      // Apply transitions
      object.applyTransitions();

      // Apply modifiers
      object.modify("passive");

      // Draw object
      object.draw();

      // Callback function
      cb(object, i, arr);
    });
  }
}

export default Entity;
