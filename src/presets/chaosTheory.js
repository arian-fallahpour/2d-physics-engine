import Preset from "../classes/Preset";
import canvas from "../classes/Canvas";

import Ball from "../classes/objects/Ball";
import Circle from "../classes/objects/Circle";
import Vector from "../classes/Vector";
import Text from "../classes/objects/Text";

const initializer = (preset) => {
  const circleRadius = 200;
  const ballsCount = 1000;
  const velDirection = new Vector(0, 1).rotate(Math.PI * 2 * Math.random());
  const velMagnitude = 4;
  const totalAngle = Math.PI;

  // const text = new Text({
  //   content: `Angle difference: π / 10000`,
  //   pos: new Vector(
  //     preset.canvas.element.clientWidth / 2,
  //     preset.canvas.element.clientHeight / 2 + 250
  //   ),
  // });
  // preset.addObjects("texts", text);

  // Create circles
  const circle = new Circle({
    pos: new Vector(
      preset.canvas.element.clientWidth / 2,
      preset.canvas.element.clientHeight / 2
    ),
    radius: circleRadius,
    mass: 0,
  });
  preset.addObjects("circles", circle);

  // Create Balls
  const balls = [];
  for (let i = 0; i < ballsCount; i++) {
    const ball = new Ball({
      pos: new Vector(
        preset.canvas.element.clientWidth / 2,
        preset.canvas.element.clientHeight / 2
      ),
      appliedAcc: new Vector(0, -0.05),
      color: `hsl(${((i / ballsCount) * 180 + 250) % 360}, 70%, 50%)`,
      radius: 0.75,
      borderColor: "transparent",
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
