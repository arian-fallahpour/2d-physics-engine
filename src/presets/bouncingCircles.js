import Modifier from "../classes/Modifier";
import Preset from "../classes/Preset";
import Vector from "../classes/Vector";
import Circle from "../classes/objects/Circle";

import playMelody from "../modifiers/playMelody";
import increaseRadius from "../modifiers/changeProp";
import nextCircle from "../modifiers/nextCircle";

import midi from "../songs/midis/kerosene.json";

const initializer = (preset) => {
  const circleThickness = 15;

  // Create center circle
  const circle1 = new Circle({
    name: "circle 0",
    pos: new Vector(
      preset.canvas.element.clientWidth / 2,
      preset.canvas.element.clientHeight / 2
    ),
    radius: circleThickness * 2,
    color: "blue",
    strokeColor: "transparent",
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
    radius: 230,
    strokeColor: "rgba(0, 0, 255, .3)",
    appliedAcc: new Vector(0, -0.5),
    thickness: circleThickness,
    vel: new Vector(4, 4),
  });
  const playMelodyModifier = new Modifier().use(playMelody, midi, 4);
  const increaseRadiusModifier = new Modifier().use(
    increaseRadius,
    circle2,
    () => -(circleThickness * (4 / 3))
  );
  const nextCircleModifier = new Modifier({ type: "frame" }).use(nextCircle);
  circle2.addModifier(playMelodyModifier);
  circle2.addModifier(increaseRadiusModifier);
  preset.addObjects("circles", circle2, circle1);
  preset.addModifier(nextCircleModifier, circle2);
};

const bouncingCircles = new Preset({
  name: "bouncing circles",
  initializer,
});

export default bouncingCircles;
