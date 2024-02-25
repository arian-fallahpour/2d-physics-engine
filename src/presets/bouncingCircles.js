import Preset from "../classes/Preset";
import Vector from "../classes/Vector";
import Ball from "../classes/objects/Ball";
import Circle from "../classes/objects/Circle";
import {
  melodyModifier,
  bouncingCircleModifier,
  soundModifier,
} from "../controllers/modifierController";

const initializer = (preset) => {
  const circleRadius = 200;

  // Create center circle
  const circle1 = new Circle({
    name: "circle 0",
    pos: new Vector(
      preset.canvas.element.clientWidth / 2,
      preset.canvas.element.clientHeight / 2
    ),
    radius: 15,
    color: "white",
    borderColor: "transparent",
    mass: 0,
  });

  // Create circle
  const circle2 = new Circle({
    name: "circle 1",
    pos: new Vector(
      preset.canvas.element.clientWidth / 2,
      preset.canvas.element.clientHeight / 2
    ),
    mass: 1,
    radius: circleRadius,
    borderColor: "rainbow",
    appliedAcc: new Vector(0, -0.5),
    thickness: 8,
    vel: new Vector(4, 4),
  });
  // circle2.addModifier(bouncingCircleModifier(circle2));
  // circle2.addModifier(soundModifier("fluid-bass", true));
  preset.addObjects("circles", circle1, circle2);
};

const bouncingCircles = new Preset({
  name: "bouncing circles",
  initializer,
});

export default bouncingCircles;
