import Modifier from "../classes/Modifier";
import Vector from "../classes/Vector";
import Ball from "../classes/shapes/entities/Ball";
import playTone from "./playTone";

import keroseneMIDI from "../songs/midis/kerosene.json";

const splitBall = (preset, entity, splitCount = 2) => {
  let collisions = 0;
  const splitCollisions = 8;

  return ({ preset, ball, ball1, ballIndex, ball1Index }) => {
    const targetIndex = ball1Index || ballIndex;
    const target = ball || ball1;

    if (target._frame > 400) {
      collisions += 1;
    }

    if (collisions === splitCollisions) {
      collisions = 0;

      for (let i = 0; i < splitCount; i++) {
        const color = `hsl(${
          (((preset.objects.balls.length - targetIndex) /
            preset.objects.balls.length) *
            180) %
          360
        }, 70%, 50%)`;

        const child = new Ball({
          ...entity,
          radius: entity.radius * (3 / 4),
          mass: entity.mass,
          fill: color,
          vel: new Vector(0, 6)
            .rotate(-Math.PI / 4)
            .rotate((Math.PI / 4) * (i / splitCount)),
        });
        const splitBallModifier = new Modifier({ type: "active" });
        const playToneModifier = new Modifier({ type: "active" });
        splitBallModifier.use(splitBall, preset, child);
        playToneModifier.use(playTone, keroseneMIDI.tracks[4]);
        child.addModifier(splitBallModifier);
        child.addModifier(playToneModifier);

        preset.addObjects("balls", child);
      }

      preset.objects.balls.splice(targetIndex, 1);
    }
  };
};

export default splitBall;
