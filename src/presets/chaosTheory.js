import ConstantAcc from "../classes/interactions/ConstantAcc";
import Preset from "../classes/Preset";

import Ball from "../classes/shapes/entities/Ball";
import Circle from "../classes/shapes/entities/Circle";
import Vector from "../classes/Vector";

const initializer = (preset) => {
  const ballsCount = 1000;
  const velocity = new Vector(3, 0).rotate(Math.PI / 2);
  const totalAngle = Math.PI / 2;

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
  for (let i = 0; i < ballsCount; i++) {
    const color = `hsl(${
      (((i - 1) / ballsCount) * 180 + 250) % 360
    }, 70%, 50%)`;

    const ball = new Ball({
      pos: preset.canvas.center.add(
        new Vector((i / ballsCount) * circle.radius - circle.thickness / 2, 0)
      ),
      vel: velocity,
      // accs: { gravity: new ConstantAcc(0, -0.05) },
      fill: color,
      // path: color,
      radius: 1,
      strokeColor: "transparent",
      // displayPath: true,
      // pathLength: 2,
    });
    balls.push(ball);
  }

  preset.addObjects("circles", circle);
  preset.addObjects("balls", ...balls);
};

const chaosTheory = new Preset({
  name: "chaos theory",
  initializer,
  options: {
    stepsPerFrame: 6,
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
