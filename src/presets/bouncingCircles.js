import Modifier from "../classes/Modifier";
import Preset from "../classes/Preset";
import Vector from "../classes/Vector";
import Circle from "../classes/shapes/entities/Circle";

import playMelody from "../modifiers/playMelody";
import nextCircle from "../modifiers/nextCircle";

import midi from "../songs/midis/kerosene.json";
import changeProp from "../modifiers/changeProp";
import ConstantAcc from "../classes/interactions/ConstantAcc";

const initializer = (preset) => {
  const circleThickness = 15;

  // Create center circle
  const circle1 = new Circle({
    name: "circle 0",
    pos: preset.canvas.center,
    radius: circleThickness * 2,
    fill: "blue",
    stroke: "transparent",
    mass: 0,
  });

  // Create circle
  const getVel = () => new Vector(0, 3).rotate(Math.PI * 2 * Math.random());
  const circle2 = new Circle({
    name: "circle 1",
    pos: preset.canvas.center,
    mass: 1,
    radius: 230,
    stroke: "rgba(0, 0, 255, .3)",
    accs: { gravity: new ConstantAcc(0, -0.2) },
    thickness: circleThickness,
    vel: getVel(),
  });
  const playMelodyModifier = new Modifier().use(playMelody, midi, 4);
  const increaseRadiusModifier = new Modifier().use(
    changeProp,
    circle2,
    (entity) => (entity.radius = entity.radius - circleThickness * (4 / 3))
  );
  circle2.addModifier(playMelodyModifier);
  circle2.addModifier(increaseRadiusModifier);

  // Configure preset
  const nextCircleModifier = new Modifier({ type: "frame" });
  nextCircleModifier.use(nextCircle, getVel);
  preset.addModifier(nextCircleModifier, circle2);
  preset.addObjects("circles", circle2, circle1);
};

const bouncingCircles = new Preset({
  name: "bouncing circles",
  initializer,
});

export default bouncingCircles;
