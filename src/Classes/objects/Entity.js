import { transition } from "../../helper";
import Vector from "../Vector";
import color from "onecolor";

import { state } from "../../model";

const colorTypes = {
  fill: "color",
  stroke: "strokeColor",
  text: "textColor",
  shadow: "shadowColor",
};
const colorValues = ["color", "strokeColor", "textColor", "shadowColor"];

class Entity {
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

  // Controlled movement
  _moving = {
    up: false,
    down: false,
    right: false,
    left: false,
  };

  constructor({
    pos = new Vector(0, 0),
    vel = new Vector(0, 0),
    maxVel,
    accs = {},
    movingMagnitude = 0.75,

    color = "white",
    strokeColor = "transparent",
    textColor = "white",
    shadowColor = "transparent",
    shadowLength = 50,

    mass = 1,
    elasticity = 1,
    thickness = 1,
    friction = 0,

    name = `${this.constructor.name}-${Math.random()}-${Date.now()}`,

    displayPath = false,
    displayVectors = false,
    displayInfo = [],
    controls = false,
  }) {
    this.pos = pos;
    this.vel = vel;
    this.maxVel = maxVel;
    this.accs = accs;
    this.movingMagnitude = movingMagnitude;

    this.color = color;
    this.strokeColor = strokeColor;
    this.textColor = textColor;
    this.shadowColor = shadowColor;
    this.shadowLength = shadowLength;

    this.mass = mass;
    this.friction = friction;
    this.elasticity = elasticity;
    this.thickness = thickness;

    this.name = name;
    this.displayVectors = displayVectors;
    this.displayInfo = displayInfo;
    this.controls = controls;

    if (this.controls) {
      this.keyControls();
    }
  }

  get inverseMass() {
    return this.mass > 0 ? 1 / this.mass : 0;
  }

  setInitial() {
    this.initial = { ...this };
  }

  getRainbow() {
    return `hsl(${
      (this._frame / state.preset.options.stepsPerFrame) % 360
    }, 100%, 50%)`;
  }

  getColor(colorType) {
    return this._colors[colorType];
  }

  getTotalAcc() {
    return Object.entries(this.accs).reduce(
      (p, c) => p.add(c[1]),
      new Vector(0, 0)
    );
  }

  update() {
    if (this.drawTail && this.tailLength !== 0) {
      this.drawTail();
    }

    if (this.drawShadow && this.shadowColor !== "transparent") {
      this.drawShadow();
    }

    this.draw();

    if (this.drawImage && this.image) {
      this.drawImage();
    }

    if (this.drawVectors && this.displayVectors) {
      this.drawVectors();
    }

    if (this.drawInfo && this.displayInfo.length !== 0) {
      this.drawInfo();
    }

    const affecters = ["Spring"];
    if (affecters.includes(this.constructor.name)) {
      this.affect();
    }

    this.reposition();
  }

  reposition() {
    const acc = this.getTotalAcc();
    this.vel = this.vel
      .add(acc.divide(state.preset.options.stepsPerFrame))
      .multiply(1 - this.friction);

    // Limit velocity if maxVel exists
    if (this.maxVel) {
      this.vel = new Vector(
        Math.max(Math.min(this.vel.x, this.maxVel.x), -this.maxVel.x),
        Math.max(Math.min(this.vel.y, this.maxVel.y), -this.maxVel.y)
      );
    }

    this.pos = this.pos.add(
      this.vel.divide(state.preset.options.stepsPerFrame)
    );
  }

  keyControls() {
    const events = ["keydown", "keyup"];
    const direction = new Vector(0, 0);

    events.forEach((event) => {
      window.addEventListener(event, (e) => {
        if (e.key === "w") {
          this._moving.up = e.type === "keydown" ? true : false;
        }
        if (e.key === "s") {
          this._moving.down = e.type === "keydown" ? true : false;
        }
        if (e.key === "d") {
          this._moving.right = e.type === "keydown" ? true : false;
        }
        if (e.key === "a") {
          this._moving.left = e.type === "keydown" ? true : false;
        }

        if (this._moving.up) {
          direction.y = 1;
        }
        if (this._moving.down) {
          direction.y = -1;
        }
        if (this._moving.right) {
          direction.x = 1;
        }
        if (this._moving.left) {
          direction.x = -1;
        }

        if (!this._moving.up && !this._moving.down) {
          direction.y = 0;
        }

        if (!this._moving.right && !this._moving.left) {
          direction.x = 0;
        }

        this.accs.movement = direction
          .unit()
          .multiply(this.movingMagnitude)
          .divide(state.preset.options.stepsPerFrame);
      });
    });
  }

  addModifier(modifier) {
    this._modifiers[modifier.type].push(modifier);
  }

  clearModifiers(type) {
    this._modifiers = {
      active: [],
      passive: [],
    };
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
      duration: frames * state.preset.options.stepsPerFrame,
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
            data.duration / state.preset.options.stepsPerFrame,
            false,
            true
          );
        }

        return;
      }

      const isColor = colorValues.includes(data.property);

      // Apply transition
      if (isColor) {
        let ci;
        if (initial === "rainbow") {
          ci = color(this.getRainbow());
        } else {
          ci = color(initial);
        }
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

      // Update object on canvas
      object.update();

      // Callback function
      cb(object, i, arr);
    });
  }
}

export default Entity;
