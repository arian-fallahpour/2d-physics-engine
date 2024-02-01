import Preset from "../classes/Preset";
import canvas from "../classes/Canvas";

import Ball from "../classes/objects/Ball";
import Circle from "../classes/objects/Circle";
import Vector from "../classes/Vector";

import {
  fasterBallModifier,
  growingBallModifier,
  melodyBallModifier,
  revertBallModifier,
  soundBallModifier,
} from "../controllers/modifierController";

const multipleBalls = new Preset("multiple balls");

multipleBalls.init((preset) => {
  const circleRadius = 200;
  const ballRadius = 15;
  const initialHeight = 20;
  const initialVelocity = 5;

  // Create circles
  const circle = new Circle({
    pos: new Vector(
      canvas.element.clientWidth / 2,
      canvas.element.clientHeight / 2
    ),
    radius: circleRadius,
    mass: 0,
    borderColor: "rainbow",
  });
  preset.addObjects("circles", circle);

  // Create ball
  const balls = [];
  const ballsCount = 5;
  for (let i = 0; i < ballsCount; i++) {
    const distanceFromCenter = circleRadius - ballRadius - initialHeight;
    const posRotation = new Vector(0, distanceFromCenter).rotate(
      2 * Math.PI * (i / ballsCount)
    );
    const pos = new Vector(
      canvas.element.clientWidth / 2,
      canvas.element.clientHeight / 2
    ).add(posRotation);
    const vel = new Vector(initialVelocity, 0).rotate(
      2 * Math.PI * (i / ballsCount)
    );
    const color = `hsl(${(i / ballsCount) * 360}, 100%, 50%)`;

    const ball = new Ball({
      radius: ballRadius,
      color: "black",
      borderColor: color,
      pos,
      vel,
    });

    const reverter = () => circle.radius <= ball.radius + 5;
    ball.addModifier(revertBallModifier(ball, reverter));
    ball.addModifier(growingBallModifier(ball));
    ball.addModifier(fasterBallModifier(ball, 1.01));

    // Add sound to one ball only
    if (i === 0) {
      ball.addModifier(melodyBallModifier("axelF"));
    }

    balls.push(ball);
  }
  preset.addObjects("balls", ...balls);
});

export default multipleBalls;
