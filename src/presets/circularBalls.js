import canvas from "../classes/Canvas";
import Preset from "../classes/Preset";
import Vector from "../classes/Vector";
import Ball from "../classes/objects/Ball";
import Circle from "../classes/objects/Circle";

import { centerGravityBallMidifier } from "../controllers/modifierController";

const initializer = (preset) => {
  const circleRadius = 200;
  const ballRadius = 10;
  const ballsCount = 10;

  // Create circle
  const circle = new Circle({
    pos: new Vector(
      preset.canvas.element.clientWidth / 2,
      preset.canvas.element.clientHeight / 2
    ),
    radius: circleRadius,
    mass: 0,
    borderColor: "white",
  });
  preset.addObjects("circles", circle);

  // Create balls
  const balls = [];
  for (let i = 0; i < ballsCount; i++) {
    const angle = -(2 * Math.PI) * (i / ballsCount);

    // Calculate the position of the ball on the line passing through the center of the outer circle
    const position = new Vector(0, circleRadius - ballRadius).rotate(angle);
    const pos = new Vector(circle.pos.x, circle.pos.y).add(position);

    const ball = new Ball({
      pos,
      radius: ballRadius,
    });

    balls.push(ball);

    // ball.addModifier(centerGravityBallMidifier(ball, circle));
  }

  preset.canvas.focusOn(balls[0]);
  balls[0].color = "red";

  preset.addObjects("balls", ...balls);
};

const circularBalls = new Preset({
  name: "circular balls",
  initializer,
});

export default circularBalls;
