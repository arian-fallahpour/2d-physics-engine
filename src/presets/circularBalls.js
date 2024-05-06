import canvas from "../classes/Canvas";
import Preset from "../classes/Preset";
import Vector from "../classes/Vector";
import Ball from "../classes/shapes/entities/Ball";
import Circle from "../classes/shapes/entities/Circle";
const initializer = (preset) => {
  const ballRadius = 10;
  const ballsCount = 10;

  // Create circle
  const circle = new Circle({
    pos: preset.canvas.center,
    radius: 200,
    thickness: 5,
    borderColor: "white",
  });

  // Create balls
  const balls = [];
  for (let i = 0; i < ballsCount; i++) {
    const angle = -(2 * Math.PI) * (i / ballsCount);

    // Calculate the position of the ball on the line passing through the center of the outer circle
    const position = new Vector(
      0,
      2 *
        (circle.radius - ballRadius - circle.thickness / 2) *
        (i / ballsCount) -
        (circle.radius - ballRadius - circle.thickness / 2)
    ).rotate(angle);
    const pos = new Vector(circle.pos.x, circle.pos.y).add(position);

    const ball = new Ball({
      pos,
      radius: ballRadius,
    });

    balls.push(ball);
    preset.addObjects("circles", circle);

    // ball.addModifier(centerGravityBallMidifier(ball, circle));
  }

  balls[0].fill = "red";

  preset.addObjects("balls", ...balls);
};

const circularBalls = new Preset({
  name: "circular balls",
  initializer,
});

export default circularBalls;
