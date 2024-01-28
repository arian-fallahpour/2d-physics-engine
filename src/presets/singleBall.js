import canvas from "../Classes/Canvas";

import Ball from "../Classes/Ball";
import Circle from "../Classes/Circle";
import Preset from "../Classes/Preset";
import Vector from "../Classes/Vector";

import {
  boostedBallModifier,
  fasterBallModifier,
  growingBallModifier,
  growingTailBallModifier,
  revertBallModifier,
  soundBallModifier,
} from "../controllers/modifierController";

const singleBall = new Preset("single ball");

singleBall.init((preset) => {
  // Create Circles
  const circle = new Circle({
    pos: new Vector(
      canvas.element.clientWidth / 2,
      canvas.element.clientHeight / 2
    ),
    radius: 200,
    mass: 0,
  });
  preset.addObjects("circles", circle);

  // Create balls
  const ball = new Ball({
    pos: new Vector(
      canvas.element.clientWidth / 2,
      canvas.element.clientHeight / 2
    ),
    vel: new Vector(4, 4),
    rainbow: true,
    appliedAcc: new Vector(0, -0.2),
    radius: 15,
    color: "red",
  });
  preset.addObjects("balls", ball);

  // Modifiers
  const reverter = () => circle.radius <= ball.radius + 1;
  ball.addModifier(soundBallModifier(ball, reverter));
  ball.addModifier(revertBallModifier(ball, reverter));
  //   ball.addModifier(growingTailBallModifier(ball, reverter));
  ball.addModifier(growingBallModifier(ball, reverter));
  // ball.addModifier(fasterBallModifier(ball, reverter));
  // ball.addModifier(boostedBallModifier(ball, reverter));
});

export default singleBall;
