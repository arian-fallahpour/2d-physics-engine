import Preset from "../classes/Preset";

import Ball from "../classes/objects/Ball";
import Circle from "../classes/objects/Circle";
import Vector from "../classes/Vector";

import Modifier from "../classes/Modifier";
import loggerTemplate from "../modifier-templates/loggerTemplate";

const initializer = (preset) => {
  preset.canvas.setMode("normal");

  // Create Circles
  const circle = new Circle({
    pos: new Vector(
      preset.canvas.element.clientWidth / 2,
      preset.canvas.element.clientHeight / 2
    ),
    radius: 200,
    strokeColor: "rainbow",
  });
  // circle.addModifier(shrinkingCircleModifier(circle, reverter, 0.16));
  // circle.addModifier(growCircleModifier(circle, 1.75));
  preset.addObjects("circles", circle);

  // Create balls
  const settings = {
    pos: new Vector(
      preset.canvas.element.clientWidth / 2,
      preset.canvas.element.clientHeight / 2
    ),
    rainbow: true,
    radius: 10,
    color: "black",
    strokeColor: "rainbow",
    appliedAcc: new Vector(0, -0.6),
    tailLength: 25,
    vel: new Vector(0, 1)
      .unit()
      .multiply(8)
      .rotate(Math.random() * (Math.PI / 6)),
  };
  const ball = new Ball(settings);

  const loggerModifier = new Modifier().use(loggerTemplate, ball);
  ball.addModifier(loggerModifier);

  preset.addObjects("balls", ball);
  preset.canvas.focusOn(ball);
};

const singleBall = new Preset({
  name: "single ball",
  initializer,
});

export default singleBall;
