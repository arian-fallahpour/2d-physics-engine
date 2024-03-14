import Preset from "../classes/Preset";
import Vector from "../classes/Vector";
import Ball from "../classes/objects/Ball";
import Wall from "../classes/objects/Wall";
import Modifier from "../classes/Modifier";
import Text from "../classes/objects/Text";
import countCollisions from "../modifiers/countCollisions";
import playTone from "../modifiers/playTone";

const initializer = (preset) => {
  const biggerBallMass = 100 ** 4;
  const separation = 200;
  const textSetter = (collisions) => `${collisions} collisions`;
  const center = new Vector(
    preset.canvas.element.clientWidth / 2,
    preset.canvas.element.clientHeight / 2
  );

  // 1. Create text
  const text = new Text({
    pos: center.add(new Vector(0, separation)),
    color: "white",
    content: textSetter(0),
  });

  // 2. Create bigger ball
  const biggerBall = new Ball({
    mass: biggerBallMass,
    name: `${biggerBallMass}kg`,
    color: "transparent",
    strokeColor: "white",
    textColor: "white",
    radius: 50,
    pos: center.add(new Vector(-(separation / 2), 0), 0),
    vel: new Vector(5, 0),
    displayInfo: ["name"],
  });

  // 3. Create smaller ball
  const smallerBall = new Ball({
    mass: 1,
    name: "1kg",
    color: "transparent",
    strokeColor: "white",
    textColor: "white",
    pos: center.add(new Vector(separation / 2, 0), 0),
    displayInfo: ["name"],
  });
  const countCollisionsModifier = new Modifier();
  const playToneModifier = new Modifier();
  countCollisionsModifier.use(countCollisions, text, textSetter);
  playToneModifier.use(playTone, { name: "A4", duration: 0.01 });
  smallerBall.addModifier(countCollisionsModifier);
  smallerBall.addModifier(playToneModifier);

  // 4. Add wall
  const wall = new Wall({
    start: new Vector(
      preset.canvas.element.clientWidth / 2 + separation,
      preset.canvas.element.clientHeight / 2 + 100
    ),
    end: new Vector(
      preset.canvas.element.clientWidth / 2 + separation,
      preset.canvas.element.clientHeight / 2 - 100
    ),
    thickness: 3,
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
});

export default digitsOfPI;
