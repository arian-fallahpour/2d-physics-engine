import ConstantAcc from "../classes/interactions/ConstantAcc";
import Preset from "../classes/Preset";

import Ball from "../classes/shapes/entities/Ball";
import Circle from "../classes/shapes/entities/Circle";
import Vector from "../classes/Vector";
import { withPixelData } from "../helper";

const initializer = (preset) => {
  const velocity = new Vector(3, 0).rotate(2 * Math.PI * Math.random());
  const imageWidth = 200;
  const imageHeight = 200;
  const ballRadius = 1;

  withPixelData("/src/images/obama.png", imageWidth, imageHeight, ballRadius, (pixels) => {
    // 1. Create circle
    const circle = new Circle({
      pos: preset.canvas.center,
      radius: 200,
      strokeColor: "white",
      thickness: 10,
      mass: 0,
    });

    // 2. Create Balls
    const balls = [];
    for (let i = 0; i < pixels.length; i++) {
      // const color = `hsl(${(((i - 1) / ballsCount) * 180 + 250) % 360}, 70%, 50%)`;

      const ball = new Ball({
        pos: pixels[i].pos.add(preset.canvas.center),
        vel: velocity,
        accs: { gravity: new ConstantAcc(0, -0.05) },
        fill: pixels[i].color,
        radius: ballRadius,
        strokeColor: "transparent",
      });
      balls.push(ball);
    }

    preset.addObjects("circles", circle);
    preset.addObjects("balls", ...balls);
  });
};

const chaosTheory = new Preset({
  name: "chaos theory",
  initializer,
  options: {
    stepsPerFrame: 1,
    reduceVelError: true,
    ODESolverMethod: "euler",
    collisions: {
      ballToBall: false,
    },
  },
  canvas: {
    // mode: "trail",
  },
});

export default chaosTheory;
