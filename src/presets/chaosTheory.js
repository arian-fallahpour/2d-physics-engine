import Preset from "../classes/Preset";

import Ball from "../classes/objects/Ball";
import Circle from "../classes/objects/Circle";
import Vector from "../classes/Vector";

const initializer = (preset) => {
  const circleRadius = 200;
  const ballsCount = 3000;
  const velDirection = new Vector(0, 1);
  const velMagnitude = 5;
  const totalAngle = Math.PI;

  // 1. Create circle
  const circle = new Circle({
    pos: new Vector(
      preset.canvas.element.clientWidth / 2,
      preset.canvas.element.clientHeight / 2
    ),
    radius: circleRadius,
    strokeColor: "white",
    thickness: 2,
    mass: 0,
  });
  preset.addObjects("circles", circle);

  // 2. Create Balls
  const balls = [];
  for (let i = 0; i < ballsCount; i++) {
    const ball = new Ball({
      pos: new Vector(
        preset.canvas.element.clientWidth / 2,
        preset.canvas.element.clientHeight / 2
      ),
      appliedAcc: new Vector(0, -0.05),
      color: `hsl(${((i / ballsCount) * 180 + 250) % 360}, 70%, 50%)`,
      radius: 1,
      strokeColor: "transparent",
    });
    ball.setVel(
      velDirection
        .unit()
        .rotate(-totalAngle / 2)
        .rotate((i / ballsCount) * totalAngle)
        .multiply(velMagnitude)
    );
    balls.push(ball);
  }
  preset.addObjects("balls", ...balls);
};

const chaosTheory = new Preset({
  name: "chaose theory",
  initializer,
});

export default chaosTheory;
