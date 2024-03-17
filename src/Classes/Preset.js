import Canvas from "./Canvas";

class Preset {
  initialized = false;
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
      displayFPS: options.displayFPS || false,
      stepsPerFrame: options.stepsPerFrame || 4,
    };
    this.objects = {
      balls: [],
      circles: [],
      walls: [],
      fractals: [],
      vectors: [],
      texts: [],
      points: [],
      springs: [],
    };
  }

  init() {
    this.initializer(this);
  }

  addObjects(type, ...objects) {
    this.objects[type].push(...objects);
  }

  popObjects(type) {
    this.objects[type].pop();
  }

  addModifier(modifier) {
    this._modifiers[modifier.occurance].push(modifier);
  }

  modify(occcurance) {
    this._modifiers[occcurance].forEach((modifier) => modifier.apply(this));
  }
}

export default Preset;
