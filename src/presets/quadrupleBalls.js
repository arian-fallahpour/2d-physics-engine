import Ball from "../Classes/Ball";
import canvas from "../Classes/Canvas";
import Circle from "../Classes/Circle";
import Preset from "../Classes/Preset";
import Vector from "../Classes/Vector";
import {
  fasterBallModifier,
  growingBallModifier,
  revertBallModifier,
  soundBallModifier,
} from "../controllers/modifierController";

const quadrupleBalls = new Preset("quadruple balls");

quadrupleBalls.init((preset) => {
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
  const initialPositions = [
    new Vector(
      canvas.element.clientWidth / 2,
      canvas.element.clientHeight / 2 +
        circleRadius -
        ballRadius -
        initialHeight
    ),
    new Vector(
      canvas.element.clientWidth / 2 +
        circleRadius -
        ballRadius -
        initialHeight,
      canvas.element.clientHeight / 2
    ),
    new Vector(
      canvas.element.clientWidth / 2,
      canvas.element.clientHeight / 2 -
        circleRadius +
        ballRadius +
        initialHeight
    ),
    new Vector(
      canvas.element.clientWidth / 2 -
        circleRadius +
        ballRadius +
        initialHeight,
      canvas.element.clientHeight / 2
    ),
  ];
  const initialVelocities = [
    new Vector(initialVelocity, 0),
    new Vector(0, -initialVelocity),
    new Vector(-initialVelocity, 0),
    new Vector(0, initialVelocity),
  ];

  const balls = [];
  for (let i = 0; i < initialPositions.length; i++) {
    const ball = new Ball({
      radius: ballRadius,
      color: "black",
      borderColor: "rainbow",
      pos: initialPositions[i],
      vel: initialVelocities[i],
    });

    const reverter = () => circle.radius <= ball.radius + 5;
    ball.addModifier(revertBallModifier(ball, reverter));
    ball.addModifier(growingBallModifier(ball, reverter));
    ball.addModifier(fasterBallModifier(ball, reverter));

    // Add sound to one ball only
    if (i === 0) {
      ball.addModifier(soundBallModifier(ball, reverter));
    }

    balls.push(ball);
  }
  preset.addObjects("balls", ...balls);
});

export default quadrupleBalls;
