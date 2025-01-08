import Preset from "../classes/Preset";

import Ball from "../classes/shapes/entities/Ball";
import Circle from "../classes/shapes/entities/Circle";
import Vector from "../classes/Vector";
import Point from "../classes/shapes/entities/Point";

import Modifier from "../classes/Modifier";
import changeProp from "../modifiers/changeProp";
import playTone from "../modifiers/playTone";

import AccGenerator from "../classes/AccGenerator";

import MIDI from "../songs/midis/TADC.json";
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
    stroke: "#2e2e2e",
  });

  const ball = new Ball({
    pos: preset.canvas.center,
    radius: 15,
    accs: { gravity: new ConstantAcc(0, -0.4) },
    vel: new Vector(10, 0).rotate(Math.PI * Math.random()),
    fill: "rainbow",
    tailLength: 10,
  });

  const changePropModifier = new Modifier();
  changePropModifier.use(changeProp, (entity, data) => {});
  ball.addModifier(changePropModifier);

  const playToneModifier = new Modifier();
  playToneModifier.use(playTone, MIDI.tracks[0]);
  ball.addModifier(playToneModifier);

  const movePlatformModifier = new Modifier({
    type: "frame",
    occurance: "after",
  });
  movePlatformModifier.use(() => {
    const length = 100;

    return () => {
      const direction = ball.pos.subtract(circle.pos).unit();
      const tangent = direction.normal();

      const center = circle.pos.add(direction.multiply(circle.radius));
      const point1 = center.add(tangent.multiply(length / 2));
      const point2 = center.subtract(tangent.multiply(length / 2));

      const { canvas } = preset;

      canvas.ctx.beginPath();
      canvas.ctx.lineWidth = circle.thickness;
      canvas.ctx.lineCap = "round";
      canvas.ctx.moveTo(point1.x, canvas.toCanvasY(point1.y));
      canvas.ctx.lineTo(point2.x, canvas.toCanvasY(point2.y));
      canvas.ctx.strokeStyle = "white";
      canvas.ctx.stroke();
      canvas.ctx.closePath();
    };
  });
  preset.addModifier(movePlatformModifier);

  preset.addObjects("circles", circle);
  preset.addObjects("balls", ball);
};

const singleBall = new Preset({
  name: "single ball",
  initializer,
  options: {
    reduceVelError: true,
  },
});

export default singleBall;
