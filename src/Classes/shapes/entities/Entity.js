import { state } from "../../../model";
import AccGenerator from "../../AccGenerator";
import Vector from "../../Vector";

class Entity {
  _path = [];
  _moving = {
    direction: new Vector(0, 0),
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

    fill = "white",
    stroke = "transparent",
    lineWidth = 0,
    text = "white",
    shadow = "transparent",
    shadowBlur = 50,

    mass = 1,
    elasticity = 1,
    thickness = 1,
    friction = 0,

    displayPath = false,
    pathLength = 100,
    displayVectors = false,
    displayInfo = [],
    disableReposition = false,
    controls = false,
  }) {
    this.pos = pos;
    this.vel = vel;
    this.maxVel = maxVel;
    this.accs = accs;
    this.movingMagnitude = movingMagnitude;

    this.fill = fill;
    this.stroke = stroke;
    this.lineWidth = lineWidth;
    this.text = text;
    this.shadow = shadow;
    this.shadowBlur = shadowBlur;

    this.mass = mass;
    this.friction = friction;
    this.elasticity = elasticity;
    this.thickness = thickness;

    this.displayPath = displayPath;
    this.pathLength = pathLength;
    this.displayVectors = displayVectors;
    this.displayInfo = displayInfo;
    this.disableReposition = disableReposition;
    this.controls = controls;

    if (this.controls) {
      this.keyControls();
    }
  }

  get inverseMass() {
    return this.mass > 0 ? 1 / this.mass : 0;
  }

  generateAcc(pos) {
    let acc = new Vector(0, 0);
    Object.keys(this.accs).forEach((key) => {
      acc = acc.add(this.accs[key].evaluate(pos));
    });
    return acc;
  }

  update() {
    if (this.displayPath) {
      this.drawPath();
    }

    if (this.drawTail && this.tailLength !== 0) {
      this.drawTail();
    }

    if (this.drawShadow && this.shadow !== "transparent") {
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

  drawPath() {
    const data = {
      pos: this.pos,
      color: this._colors.path,
    };

    // Throttle to 60 times a second
    if ((this._frame + 35) % state.preset.options.stepsPerFrame === 0) {
      // Add newest segment
      this._path.push(data);

      // Remove oldest segment if more than this.pathLength
      if (this.pathLength !== -1 && this._path.length > this.pathLength) {
        this._path.splice(0, 1);
      }
    }

    // Draw path
    const canvas = state.preset.canvas;

    canvas.ctx.beginPath();

    canvas.ctx.lineWidth = 1;
    canvas.ctx.lineCap = "round";

    for (let i = 0; i < this._path.length; i++) {
      canvas.ctx.lineTo(
        this._path[i].pos.x,
        canvas.toCanvasY(this._path[i].pos.y)
      );
      canvas.ctx.strokeStyle = this._path[i].color;
      canvas.ctx.stroke();
    }
  }

  drawVectors() {
    this.vel
      .unit()
      .multiply(3 * this.radius)
      .draw(this.pos, "blue");
    Object.keys(this.accs).forEach((key) => {
      this.accs[key]
        .unit()
        .multiply(2 * this.radius)
        .draw(this.pos, "green");
    });
  }

  repositionEuler() {
    const deltaTime = 1 / state.preset.options.stepsPerFrame;

    const acc = this.generateAcc(this.pos);

    this.vel = this.vel
      .add(acc.multiply(deltaTime))
      .multiply(1 - this.friction);

    // Limit velocity if maxVel exists
    if (this.maxVel) {
      this.vel = new Vector(
        Math.max(Math.min(this.vel.x, this.maxVel.x), -this.maxVel.x),
        Math.max(Math.min(this.vel.y, this.maxVel.y), -this.maxVel.y)
      );
    }

    this.pos = this.pos.add(this.vel.multiply(deltaTime));
  }

  repositionRK4() {
    const deltaTime = 1 / state.preset.options.stepsPerFrame;

    const x0 = this.pos;
    const v0 = this.vel;
    const a0 = this.generateAcc(x0);

    const x1 = x0.add(v0.multiply(deltaTime / 2));
    const v1 = v0.add(a0.multiply(deltaTime / 2));
    const a1 = this.generateAcc(x1);

    const x2 = x0.add(v1.multiply(deltaTime / 2));
    const v2 = v0.add(a1.multiply(deltaTime / 2));
    const a2 = this.generateAcc(x2);

    const x3 = x0.add(v2.multiply(deltaTime));
    const v3 = v0.add(a2.multiply(deltaTime));
    const a3 = this.generateAcc(x3);

    this.pos = x0.add(
      v0
        .add(v1.multiply(2))
        .add(v2.multiply(2))
        .add(v3)
        .multiply(deltaTime / 6)
    );
    this.vel = v0.add(
      a0
        .add(a1.multiply(2))
        .add(a2.multiply(2))
        .add(a3)
        .multiply(deltaTime / 6)
    );
  }

  reposition() {
    if (this.disableReposition) return;

    const method = state.preset.options.ODESolverMethod;
    if (method === "euler") {
      this.repositionEuler();
    } else if (method === "rk4") {
      this.repositionRK4();
    }
  }

  keyControls() {
    const events = ["keydown", "keyup"];

    events.forEach((event) => {
      window.addEventListener(event, (e) => {
        const direction = new Vector(0, 0);

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

        this.accs.movement = new AccGenerator(() =>
          direction.multiply(this.movingMagnitude)
        );
      });
    });
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
    Object.keys(this._colors).forEach((type) => {
      if (this[type] === "rainbow") {
        this._colors[type] = this.getRainbow();
      } else {
        this._colors[type] = this[type];
      }
    });
  }

  static render(objects, cb = (object, i, arr) => {}) {
    if (objects.length === 0) return;

    for (let i = 0; i < objects.length; i++) {
      const object = objects[i];

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
      cb(object, i, objects);
    }
  }
}

export default Entity;
