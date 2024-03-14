import Preset from "../classes/Preset";

import Ball from "../classes/objects/Ball";
import Circle from "../classes/objects/Circle";
import Vector from "../classes/Vector";

import Modifier from "../classes/Modifier";
import changeProp from "../modifiers/changeProp";
import playMelody from "../modifiers/playMelody";

import keroseneMIDI from "../songs/midis/kerosene.json";
import revert from "../modifiers/revert";

const initializer = (preset) => {
  const ballGrowth = 0.75;
  const ballSpeedFactor = 1;
  const circleShrink = 0.05;
  const circleGrowth = 3;
  const revertDuration = 0.5 * 60;

  preset.canvas.setMode("normal");

  // 1. Create Circles
  const circle = new Circle({
    pos: new Vector(
      preset.canvas.element.clientWidth / 2,
      preset.canvas.element.clientHeight / 2
    ),
    radius: 200,
    strokeColor: "white",
    thickness: 10,
  });
  const decreasingCircleRadiusModifier = new Modifier({ type: "passive" });
  const increaseCircleRadiusModifier = new Modifier();
  decreasingCircleRadiusModifier.use(
    changeProp,
    circle,
    (entity) => (entity.radius -= circleShrink)
  );
  increaseCircleRadiusModifier.use(
    changeProp,
    circle,
    (entity) => (entity.radius += circleGrowth)
  );
  circle.addModifier(decreasingCircleRadiusModifier);
  circle.addModifier(increaseCircleRadiusModifier);

  // 2. Create balls
  const ball = new Ball({
    pos: new Vector(
      preset.canvas.element.clientWidth / 2,
      preset.canvas.element.clientHeight / 2
    ),
    radius: 12,
    appliedAcc: new Vector(0, -0.4),
    tailLength: 50,
    color: "rainbow",
    vel: new Vector(0, 1)
      .unit()
      .multiply(8)
      .rotate(Math.PI * (1 / 4)),
  });
  const increaseBallRadiusModifier = new Modifier();
  const increaseBallVelModifier = new Modifier();
  const playMelodyModifier = new Modifier();
  increaseBallRadiusModifier.use(
    changeProp,
    ball,
    (entity) => (entity.radius += ballGrowth)
  );
  increaseBallVelModifier.use(
    changeProp,
    ball,
    (entity) => (entity.vel = entity.vel.multiply(ballSpeedFactor))
  );
  playMelodyModifier.use(playMelody, keroseneMIDI, 4);
  ball.addModifier(increaseBallRadiusModifier);
  ball.addModifier(increaseBallVelModifier);
  ball.addModifier(playMelodyModifier);

  // 3. Configure preset
  const revertPresetModifier = new Modifier({
    type: "frame",
    occurance: "after",
  });
  revertPresetModifier.use(
    revert,
    (preset) => ball.radius >= circle.radius,
    (preset) => {
      circle.clearModifiers();
      ball.clearModifiers();

      circle.clearModifiers();
      circle.transition("radius", circle.initial.radius, revertDuration);
      ball.appliedAcc = new Vector(0, 0);
      ball.vel = new Vector(0, 0);
      ball.transition("radius", ball.initial.radius, revertDuration);
      ball.transition("color", "red", revertDuration);
      ball.transition("pos.x", ball.initial.pos.x, revertDuration);
      ball.transition("pos.y", ball.initial.pos.y, revertDuration);
    }
  );
  preset.addModifier(revertPresetModifier);
  preset.addObjects("circles", circle);
  preset.addObjects("balls", ball);
  // preset.canvas.focusOn(ball);
};

const singleBall = new Preset({
  name: "single ball",
  initializer,
});

export default singleBall;
