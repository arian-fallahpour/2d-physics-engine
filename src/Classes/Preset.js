class Preset {
  constructor(name = `preset-${Math.random()}-${Date.now()}`) {
    this.name = name;

    this.objects = {
      balls: [],
      circles: [],
      walls: [],
      fractals: [],
      vectors: [],
      texts: [],
    };
  }

  /** Allows modification of preset */
  init(fn) {
    fn(this);
  }

  /** Resets entire preset to initial state */
  reset() {
    Object.keys(this.objects).forEach((key) =>
      this.objects[key].forEach((obj) => obj.reset())
    );
  }

  /** Pushes multiple objects of same type */
  addObjects(type, ...objects) {
    this.objects[type].push(...objects);
  }
}

export default Preset;
