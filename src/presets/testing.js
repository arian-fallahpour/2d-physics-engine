import Fractal from "../classes/Fractal";
import Preset from "../classes/Preset";
import Vector from "../classes/Vector";
import Ball from "../classes/objects/Ball";
import Wall from "../classes/objects/Wall";

const initializer = (preset) => {
  const ball = new Ball({
    color: "rainbow",
    thickness: 10,
    pos: preset.canvas.center,
    tailLength: 10,
    controls: true,
  });

  for (let i = 0; i < 100; i++) {
    preset.addObjects(
      "balls",
      new Ball({
        pos: preset.canvas.center.add(
          new Vector(0, 100).rotate((i / 100) * 2 * Math.PI)
        ),
        radius: 10,
        color: "white",
        elasticity: 0,
        controls: true,
      })
    );
  }

  // const fractal = new Fractal({
  //   branches: 2,
  //   layers: 10,
  //   angle: Math.PI / 4,
  //   pos: preset.canvas.center,
  // });

  preset.addObjects("balls", ball);
  // preset.addObjects("fractals", fractal);
  // preset.canvas.focusOn(ball);
};

const testing = new Preset({
  name: "testing",
  initializer,
  options: {
    displayFPS: true,
  },
});

export default testing;
