import options from "../data/options";
import Vector from "./Vector";

class Entity {
  _frame = 0;
  _colors = {
    fill: "",
    border: "",
    text: "",
  };

  constructor({
    name = `${this.constructor.name}-${Math.random()}-${Date.now()}`,
    pos = new Vector(0, 0),
    vel = new Vector(0, 0),
    appliedAcc = new Vector(0, 0),
    color = "white",
    borderColor = "white",
    textColor = "black",
    displayVectors = false,
    displayInfo = [],
    mass = 1,
    rainbow = false,
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
      (this._frame / options.requestFrameCount) % 360
    }, 100%, 50%)`;
  }

  getRainbow() {
    return `hsl(${(this._frame / options.requestFrameCount) % 360}, 100%, 50%)`;
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
  modify(type, data) {
    this.modifiers.forEach((modifier) => modifier[type](data));
  }

  /** Resets entity to its initial state */
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
    if (this.color === "rainbow") {
      this._colors.fill = this.getRainbow();
    } else {
      this._colors.fill = this.color;
    }

    if (this.borderColor === "rainbow") {
      this._colors.border = this.getRainbow();
    } else {
      this._colors.border = this.borderColor;
    }

    if (this.textColor === "rainbow") {
      this._colors.text = this.getRainbow();
    } else {
      this._colors.text = this.textColor;
    }
  }

  /** Modifies and draws objects with a callback function occuring after */
  static render(objects, cb = (object, i, arr) => {}) {
    objects.forEach((object, i, arr) => {
      object._frame += 1;

      // Calculate true color value
      object.calculateColor();

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
