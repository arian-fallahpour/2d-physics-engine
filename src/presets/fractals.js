import Preset from "../classes/Preset";
import Vector from "../classes/Vector";
import Fractal from "../classes/shapes/Fractal";

const initializer = (preset) => {
  const fractal = new Fractal({
    pos: preset.canvas.center.add(new Vector(0, -100)),
    angle: 0,
    branches: 3,
    layers: 9,
  });

  fractal.transition("angle", Math.PI, 10 * 60, true);

  preset.addObjects("fractals", fractal);
};

const fractals = new Preset({
  name: "fractals",
  initializer,
  options: {
    stepsPerFrame: 1,
    displayMetrics: true,
  },
});

export default fractals;
