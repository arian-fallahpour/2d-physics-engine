import * as engine from "./data/engine";

export function serialize(classInstance) {
  return JSON.stringify(classInstance, (key, value) => {
    if (value && typeof value === "object") {
      value.__type = value.constructor.name;
    }

    return value;
  });
}

export function deserialize(str) {
  const classes = { Object, ...engine.classes };

  return JSON.parse(str, (key, value) => {
    if (value && typeof value === "object" && value.__type) {
      const Instance = classes[value.__type];

      // Input custom params depending on class type
      if (value.__type === "Vector") {
        value = new Instance(value.x, value.y);
      } else {
        value = new Instance(value);
      }

      delete value.__type;
    }
    return value;
  });
}

export function transition(step, duration, initial, final) {
  if (initial === final) {
    return initial;
  }
  return initial + (step / duration) * (final - initial);
}
