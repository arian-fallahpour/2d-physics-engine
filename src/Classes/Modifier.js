class Modifier {
  cb;

  constructor(options = {}) {
    options = {
      type: options.type || "active", // "active" | "passive" | "frame"
      occurance: options.occurance || "before", // "before" | "after"
    };

    this.type = options.type;
    this.occurance = options.occurance;
  }

  use(template, ...params) {
    this.cb = template(...params);

    return this;
  }

  apply(data) {
    this.cb(data);
  }
}

export default Modifier;
