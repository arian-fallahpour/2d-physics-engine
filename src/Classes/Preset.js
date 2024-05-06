import Canvas from "./Canvas";

class Preset {
  initialized = false;
  data = {};
  _modifiers = {
    before: [],
    after: [],
  };

  constructor({
    name = `preset-${Math.random()}-${Date.now()}`,
    initializer = function () {},
    canvas = {},
    options = {},
  }) {
    this.name = name;
    this.canvas = new Canvas(canvas);
    this.initializer = initializer;
    this.options = {
      displayMetrics: options.displayMetrics || false,
      stepsPerFrame: options.stepsPerFrame || 4,
      reduceVelError: options.reduceVelError || false,
      ODESolverMethod: options.ODESolverMethod || "euler",
      collisions: {
        ballToBall:
          options.collisions &&
          typeof options.collisions.ballToBall === "boolean"
            ? options.collisions.ballToBall
            : true,
        ballToWall:
          options.collisions &&
          typeof options.collisions.ballToWall === "boolean"
            ? options.collisions.ballToWall
            : true,
        ballToCircle:
          options.collisions &&
          typeof options.collisions.ballToCircle === "boolean"
            ? options.collisions.ballToCircle
            : true,
        circleToCircle:
          options.collisions &&
          typeof options.collisions.circleToCircle === "boolean"
            ? options.collisions.circleToCircle
            : true,
        circleToWall:
          options.collisions &&
          typeof options.collisions.ballToBall === "boolean"
            ? options.collisions.ballToBall
            : true,
      },
    };
    this.objects = {
      balls: [],
      circles: [],
      walls: [],
      fractals: [],
      vectors: [],
      texts: [],
      points: [],
    };
    this.interactions = [];
  }

  init() {
    this.initializer(this);
  }

  addObjects(type, ...objects) {
    this.objects[type].push(...objects);
  }

  addInteractions(...interactions) {
    this.interactions.push(...interactions);
  }

  popObjects(type) {
    this.objects[type].pop();
  }

  addModifier(modifier) {
    this._modifiers[modifier.occurance].push(modifier);
  }

  modify(occcurance, preset) {
    this._modifiers[occcurance].forEach((modifier) => modifier.apply(preset));
  }
}

export default Preset;
