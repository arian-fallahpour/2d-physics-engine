import ESSerializer from "esserializer";

import Ball from "./Classes/Ball";
import Circle from "./Classes/Circle";
import Vector from "./Classes/Vector";
import Wall from "./Classes/Wall";
import Sound from "./Classes/Sound";

export function serialize(classInstance) {
  return JSON.stringify(classInstance, (key, value) => {
    if (value && typeof value === "object") {
      value.__type = value.constructor.name;
    }

    return value;
  });
}

export function deserialize(str) {
  const classes = { Object, Ball, Wall, Circle, Vector, Sound };

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
