import Preset from "../classes/Preset";
import canvas from "../classes/Canvas";

import Ball from "../classes/objects/Ball";
import Circle from "../classes/objects/Circle";
import Vector from "../classes/Vector";

import {
  boostedBallModifier,
  fasterBallModifier,
  growingBallModifier,
  melodyModifier,
  revertBallModifier,
  soundModifier,
} from "../controllers/modifierController";

const initializer = (preset) => {
  const circleRadius = 200;
  const ballRadius = 10;
  const ballsCount = 40;
  const initialHeight = 20;
  const initialVelocity = 5;

  // Create circles
  const circle = new Circle({
    pos: new Vector(
      preset.canvas.element.clientWidth / 2,
      preset.canvas.element.clientHeight / 2
    ),
    radius: circleRadius,
    mass: 0,
    borderColor: "rainbow",
  });
  preset.addObjects("circles", circle);

  // Create ball
  const balls = [];
  for (let i = 0; i < ballsCount; i++) {
    const distanceFromCenter = circleRadius - ballRadius - initialHeight;
    const posRotation = new Vector(0, distanceFromCenter).rotate(
      2 * Math.PI * (i / ballsCount)
    );
    const pos = new Vector(
      preset.canvas.element.clientWidth / 2,
      preset.canvas.element.clientHeight / 2
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

    // const reverter = () => circle.radius <= ball.radius + 5;
    // ball.addModifier(revertBallModifier(ball, reverter));
    // ball.addModifier(growingBallModifier(ball, 1.25));
    // ball.addModifier(fasterBallModifier(ball, 1.01));
    // ball.addModifier(boostedBallModifier(ball, circle));

    // Add sound to one ball only
    // if (i === 0) {
    // ball.addModifier(melodyModifier("sad", "drop-synth"));
    // }

    balls.push(ball);
  }
  preset.addObjects("balls", ...balls);
};

const multipleBalls = new Preset({
  name: "multiple balls",
  initializer,
});

export default multipleBalls;
