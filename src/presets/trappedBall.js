import Preset from "../classes/Preset";

import Ball from "../classes/shapes/entities/Ball";
import Circle from "../classes/shapes/entities/Circle";
import Vector from "../classes/Vector";

import Modifier from "../classes/Modifier";
import playTone from "../modifiers/playTone";

import MIDI from "../songs/midis/megalovania.json";
import ConstantAcc from "../classes/interactions/ConstantAcc";

const initializer = (preset) => {
  const circleRadius = 200;
  const circleCount = 20;
  const circleLineWidth = 5;
  const circleGap = 1;
  const circleColorInc = 10;
  const circleRespawnTime = 0.35;
  const midiTrack = MIDI.tracks[0];

  preset.data.color = 0;
  preset.data.reverting = false;
  preset.data.incrementColor = (inc) => {
    preset.data.color = (preset.data.color + inc) % 360;
  };

  // 1. Generate circles
  const circles = [];
  for (let i = 0; i < circleCount; i++) {
    const radius = circleRadius - i * (circleLineWidth + circleGap);
    const circle = new Circle({
      pos: preset.canvas.center,
      radius,
      thickness: circleLineWidth,
      stroke: `hsl(${preset.data.color}, 70%, 50%)`,
      elasticity: 1.01,
    });
    circle.transition("radius", 0, 10 * 60 * (radius / circleRadius));
    circles.unshift(circle);

    preset.data.incrementColor(circleColorInc);
  }
  const addCircleModifier = new Modifier({
    type: "passive",
    occrance: "before",
  });
  addCircleModifier.use(() => {
    return (preset) => {
      if (preset.data.reverting) return;

      const ball = preset.objects.balls[0];
      const circleLargest =
        preset.objects.circles[preset.objects.circles.length - 1];
      const frame = ball._frame;

      if (!circleLargest) {
        ball.accs = {};
        ball.vel = new Vector(0, 0);
        ball.transition("pos", preset.canvas.center, 0.5 * 60);

        preset.data.reverting = true;
        return;
      }

      const shouldRespawn =
        frame % (circleRespawnTime * 60 * preset.options.stepsPerFrame) === 0;
      if (shouldRespawn) {
        const radius = circleLargest.radius + (circleLineWidth + circleGap);
        const circle = new Circle({
          pos: preset.canvas.center,
          radius,
          thickness: circleLineWidth,
          stroke: `hsl(${preset.data.color}, 70%, 50%)`,
          elasticity: 1.01,
        });
        circle.transition("radius", 0, 10 * 60 * (radius / circleRadius));
        preset.addObjects("circles", circle);

        preset.data.incrementColor(circleColorInc);
      }
    };
  });
  preset.addModifier(addCircleModifier);

  // 2. Generate ball
  const ball = new Ball({
    pos: preset.canvas.center,
    vel: new Vector(4, 0).rotate(Math.PI * 2 * Math.random()),
    accs: { gravity: new ConstantAcc(0, -0.4) },
    fill: "#0051FF",
    stroke: "#407CFF",
    thickness: 3,
  });
  const playToneModifier = new Modifier({ type: "active" });
  playToneModifier.use(playTone, midiTrack);
  ball.addModifier(playToneModifier);

  const removeCircleModifier = new Modifier({ type: "active" });
  removeCircleModifier.use(() => {
    return ({ circleIndex }) => {
      preset.objects.circles.splice(circleIndex, 1);
    };
  });
  ball.addModifier(removeCircleModifier);

  preset.addObjects("circles", ...circles);
  preset.addObjects("balls", ball);
};

const trappedBall = new Preset({
  name: "trapped ball",
  initializer,
  options: {
    reduceVelError: true,
    ODESolverMethod: "euler",
  },
});

export default trappedBall;
