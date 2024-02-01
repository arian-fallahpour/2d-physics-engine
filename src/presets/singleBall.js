import canvas from "../classes/Canvas";
import Preset from "../classes/Preset";

import Ball from "../classes/objects/Ball";
import Circle from "../classes/objects/Circle";
import Vector from "../classes/Vector";

import {
  fasterBallModifier,
  growingBallModifier,
  growCircleModifier,
  growingTailBallModifier,
  melodyBallModifier,
  revertBallModifier,
  shrinkingCircleModifier,
} from "../controllers/modifierController";

const singleBall = new Preset("single ball");

singleBall.init((preset) => {
  const reverter = () => circle.radius <= ball.radius + 1;

  // Create Circles
  const circle = new Circle({
    pos: new Vector(
      canvas.element.clientWidth / 2,
      canvas.element.clientHeight / 2
    ),
    radius: 200,
    borderColor: "rainbow",
  });
  circle.addModifier(shrinkingCircleModifier(circle, reverter, 0.1));
  circle.addModifier(growCircleModifier(circle, 1.75));
  preset.addObjects("circles", circle);

  // Create balls
  const ball = new Ball({
    pos: new Vector(
      canvas.element.clientWidth / 2,
      canvas.element.clientHeight / 2
    ),
    rainbow: true,
    radius: 15,
    color: "black",
    borderColor: "rainbow",
    appliedAcc: new Vector(0, -0.2),
    vel: new Vector(4, 4),
  });
  preset.addObjects("balls", ball);

  // Modifiers
  ball.addModifier(melodyBallModifier("takeOnMe"));
  ball.addModifier(revertBallModifier(ball, reverter));
  ball.addModifier(growingTailBallModifier(ball, reverter));
  ball.addModifier(growingBallModifier(ball));
  ball.addModifier(fasterBallModifier(ball, 1.01));
});

export default singleBall;
