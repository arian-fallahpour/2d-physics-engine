import canvas from "../classes/Canvas";
import Preset from "../classes/Preset";
import Vector from "../classes/Vector";
import Ball from "../classes/objects/Ball";
import Circle from "../classes/objects/Circle";
import {
  melodyBallModifier,
  shrinkCircleModifier,
  soundBallModifier,
} from "../controllers/modifierController";

const bouncingCircles = new Preset("bouncing circles");

bouncingCircles.init((preset) => {
  const circleRadius = 200;

  // Create center circle
  const circle1 = new Circle({
    pos: new Vector(
      canvas.element.clientWidth / 2,
      canvas.element.clientHeight / 2
    ),
    radius: 15,
    color: "white",
    mass: 0,
  });

  // Create circle
  const circle2 = new Circle({
    pos: new Vector(
      canvas.element.clientWidth / 2,
      canvas.element.clientHeight / 2
    ),
    mass: 1,
    radius: circleRadius,
    borderColor: "rainbow",
    appliedAcc: new Vector(0, -0.2),
    vel: new Vector(0, 1)
      .unit()
      .multiply(10)
      .rotate(Math.random() * Math.PI * 2),
  });
  circle2.addModifier(shrinkCircleModifier(circle2));

  preset.addObjects("circles", circle1, circle2);
});

export default bouncingCircles;
