import Vector from "./classes/Vector";
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

export function withPixelData(src, width, height, pixelSize, cb) {
  const image = new Image(width, height);
  image.src = src;
  image.onload = function () {
    const canvas = document.getElementById("canvas-2");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, width, height);

    const pixels = [];
    for (let i = 0; i < width; i += 2 * pixelSize) {
      for (let j = 0; j < height; j += 2 * pixelSize) {
        const imageData = ctx.getImageData(i, j, 1, 1).data;
        const color = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;
        pixels.push({ pos: new Vector(i, -j + height).add(new Vector(-width / 2, -height / 2)), color });
      }
    }

    cb(pixels);
  };
}
