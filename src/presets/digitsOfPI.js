import Preset from "../classes/Preset";
import Vector from "../classes/Vector";
import Ball from "../classes/shapes/entities/Ball";
import Wall from "../classes/shapes/Wall";
import Text from "../classes/shapes/entities/Text";
import Modifier from "../classes/Modifier";
import playSound from "../modifiers/playSound";
import countCollisions from "../modifiers/countCollisions";

const initializer = (preset) => {
  const biggerBallMass = 100 ** 4;
  const separation = 200;
  const setText = (collisions) => `${collisions} collisions`;

  // 1. Create text
  const text = new Text({
    pos: preset.canvas.center.add(new Vector(0, separation)),
    color: "white",
    content: setText(0),
  });

  // 2. Create bigger ball
  const biggerBall = new Ball({
    mass: biggerBallMass,
    name: `${biggerBallMass}kg`,
    fill: "transparent",
    stroke: "white",
    text: "white",
    radius: 50,
    pos: preset.canvas.center.add(new Vector(-separation / 2, 0)),
    vel: new Vector(3, 0),
    displayInfo: ["name"],
  });

  // 3. Create smaller ball
  const smallerBall = new Ball({
    mass: 1,
    name: "1kg",
    fill: "transparent",
    stroke: "white",
    text: "white",
    pos: preset.canvas.center.add(new Vector(separation / 2, 0)),
    displayInfo: ["name"],
    radius: 25,
  });
  const playSoundModifier = new Modifier();
  const countCollisionsModifier = new Modifier();
  playSoundModifier.use(playSound, "ball-hit.mp3");
  countCollisionsModifier.use(countCollisions, text, setText);
  smallerBall.addModifier(playSoundModifier);
  smallerBall.addModifier(countCollisionsModifier);

  // 4. Add wall
  const wall = new Wall({
    start: preset.canvas.center.add(new Vector(separation, 100)),
    end: preset.canvas.center.add(new Vector(separation, -100)),
    thickness: 5,
    strokeColor: "white",
  });

  // 5. Configure preset
  preset.addObjects("texts", text);
  preset.addObjects("balls", biggerBall, smallerBall);
  preset.addObjects("walls", wall);
};

const digitsOfPI = new Preset({
  name: "digits of PI",
  initializer,
  options: {
    stepsPerFrame: 1000,
  },
});

export default digitsOfPI;
