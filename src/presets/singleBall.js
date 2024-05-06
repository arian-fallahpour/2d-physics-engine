import Preset from "../classes/Preset";

import Ball from "../classes/shapes/entities/Ball";
import Circle from "../classes/shapes/entities/Circle";
import Vector from "../classes/Vector";
import Point from "../classes/shapes/entities/Point";

import Modifier from "../classes/Modifier";
import changeProp from "../modifiers/changeProp";
import playTone from "../modifiers/playTone";

import AccGenerator from "../classes/AccGenerator";

import MIDI from "../songs/midis/pedro.json";
import Text from "../classes/shapes/entities/Text";
import ConstantAcc from "../classes/interactions/ConstantAcc";
import Wall from "../classes/shapes/Wall";
import SoftConstraint from "../classes/interactions/SoftConstraint";

const initializer = (preset) => {
  // 1. Create Circle
  const circle = new Circle({
    pos: preset.canvas.center,
    radius: 200,
    thickness: 10,
    elasticity: 1.005,
  });

  const ball1 = new Ball({
    pos: preset.canvas.center.add(new Vector(-100, 0)),
    radius: 15,
    accs: { gravity: new ConstantAcc(0, -0.4) },
    fill: "rainbow",
  });
  const playToneModifier1 = new Modifier();
  playToneModifier1.use(playTone, MIDI.tracks[0]);
  ball1.addModifier(playToneModifier1);

  const ball2 = new Ball({
    pos: preset.canvas.center.add(new Vector(100, 0)),
    radius: 15,
    accs: { gravity: new ConstantAcc(0, -0.4) },
    fill: "rainbow",
  });
  const playToneModifier2 = new Modifier();
  playToneModifier2.use(playTone, MIDI.tracks[0]);
  ball2.addModifier(playToneModifier2);

  const spring = new SoftConstraint({
    entity1: ball1,
    entity2: ball2,
    length: 100,
    zigzagCount: 29,
  });

  const collideModifier = new Modifier({ type: "active" });
  collideModifier.use((ball) => {
    return (data) => {
      if (!ball1 && !ball2) return;

      ball1.radius += 0.75;
      ball2.radius += 0.75;
      spring.length += 0.75;
      spring.zigzagCount += 0.75;
    };
  });
  ball2.addModifier(collideModifier);

  preset.addObjects("circles", circle);
  preset.addObjects("balls", ball1, ball2);
  preset.addInteractions(spring);
};

const singleBall = new Preset({
  name: "single ball",
  initializer,
  options: {
    reduceVelError: true,
  },
});

export default singleBall;
