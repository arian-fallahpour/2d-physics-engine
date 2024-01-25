import "./style.css";

import notes from "./data/notes";

import * as model from "./model";

import Ball from "./Classes/Ball";
import canvas from "./Classes/Canvas";
import Vector from "./Classes/Vector";
import Wall from "./Classes/Wall";
import Sound from "./Classes/Sound";
import Circle from "./Classes/Circle";
import Melody from "./Classes/Melody";

import { blend } from "./helper";

import eventHandler from "./controllers/eventController";
import frameHandler from "./controllers/frameController";
import Fractal from "./Classes/Fractal";

const main = () => {
  canvas.mode = "lucid";

  // Load sounds and melodies
  loadSounds();

  // Create walls
  const boundsHeight = canvas.element.clientHeight;
  const boundsWidth = canvas.element.clientHeight * (9 / 16);
  const edges = [
    new Vector(
      canvas.element.clientWidth / 2 - boundsWidth / 2,
      canvas.element.clientHeight / 2 - boundsHeight / 2
    ),
    new Vector(
      canvas.element.clientWidth / 2 - boundsWidth / 2,
      canvas.element.clientHeight / 2 + boundsHeight / 2
    ),
    new Vector(
      canvas.element.clientWidth / 2 + boundsWidth / 2,
      canvas.element.clientHeight / 2 + boundsHeight / 2
    ),
    new Vector(
      canvas.element.clientWidth / 2 + boundsWidth / 2,
      canvas.element.clientHeight / 2 - boundsHeight / 2
    ),
  ];
  const bounds = [];
  for (let i = 0; i <= 3; i++) {
    bounds.push(
      new Wall({
        start: edges[i],
        end: edges[(i + 1) % edges.length],
        color: "white",
      })
    );
  }
  // model.state.objects.walls.push(...bounds);

  // Create Circles
  const circle = new Circle({
    pos: new Vector(
      canvas.element.clientWidth / 2,
      canvas.element.clientHeight / 2
    ),
    radius: 200,
  });
  model.state.objects.circles.push(circle);

  const ball = new Ball({
    pos: new Vector(
      canvas.element.clientWidth / 2,
      canvas.element.clientHeight / 2
    ),
    vel: new Vector(4, 4),
    rainbow: true,
    appliedAcc: new Vector(0, -0.2),
    radius: 15,
    color: "red",
  });
  model.state.objects.balls.push(ball);

  const fractal = new Fractal({
    pos: new Vector(canvas.element.clientWidth / 2, 100),
    angle: Math.PI / 6,
    layers: 15,
  });
  // model.state.objects.fractals.push(fractal);

  // Modifiers
  const reverter = () => circle.radius <= ball.radius + 1;
  ball.addModifier(soundBallModifier(ball, reverter));
  ball.addModifier(revertBallModifier(ball, reverter));
  // ball.addModifier(fasterBallModifier(ball, reverter));
  ball.addModifier(growingBallModifier(ball, reverter));
  ball.addModifier(boostedBallModifier(ball, reverter));

  // Handle events
  eventHandler();

  // Call first frame
  requestAnimationFrame(frameHandler);
};

const changeOrRevert = (
  change = () => {},
  revert = () => {},
  reverter = () => {}
) => {
  const { state } = model;

  const shouldRevert = reverter();
  if (state.reverting || shouldRevert) {
    state.reverting = true;

    revert();
  } else {
    change();
  }
};

const revertBallModifier = (ball, reverter) => {
  const revert = () => {
    ball.color = ball.initial.color;
    ball.rainbow = false;
    ball.radius = blend(ball.radius, ball.initial.radius, 3);
    ball.pos = new Vector(
      blend(ball.pos.x, ball.initial.pos.x, 1),
      blend(ball.pos.y, ball.initial.pos.y, 1)
    );
    ball.vel = new Vector(0, 0);
    ball.acc = new Vector(0, 0);
    ball.appliedAcc = new Vector(0, 0);
  };

  return {
    passive: () => changeOrRevert(undefined, revert, reverter),
    active: () => {},
  };
};

const growingBallModifier = (ball, reverter) => {
  const activeChange = () => {
    if (model.state.reverting) return;

    ball.radius = Math.max(ball.radius + 1.5, ball.radius * 1.013);
  };

  return {
    passive: () => changeOrRevert(undefined, undefined, reverter),
    active: activeChange,
  };
};

const fasterBallModifier = (ball, reverter) => {
  const activeChange = () => {
    if (model.state.reverting) return;

    ball.vel = ball.vel.multiply(1.01);
  };

  return {
    passive: () => changeOrRevert(undefined, activeChange, reverter),
    active: activeChange,
  };
};

const rotatingGravityBallModifier = (ball, reverter) => {
  const circle = model.state.objects.circles[0];

  const passiveChange = () => {
    const degree = Math.PI / 180;
    ball.appliedAcc = ball.appliedAcc.rotate(degree / 10);

    if (circle) {
      ball.appliedAcc
        .unit()
        .multiply(circle.radius)
        .draw(circle.pos.x, circle.pos.y);
    }
  };

  return {
    passive: () => changeOrRevert(passiveChange, undefined, reverter),
    active: () => {},
  };
};

const randomGravityBallModifier = (ball, reverter) => {
  const circle = model.state.objects.circles[0];

  const passiveChange = () => {
    if (circle) {
      ball.appliedAcc
        .unit()
        .multiply(circle.radius)
        .draw(circle.pos.x, circle.pos.y);
    }
  };

  const revert = () => {
    const down = new Vector(0, -1).unit().multiply(circle.radius);

    const direction = down.x - ball.appliedAcc.x > 0 ? +1 : -1;

    ball.appliedAcc = ball.appliedAcc.rotate(
      direction * (Math.PI / 180) * 0.75
    );

    ball.appliedAcc
      .unit()
      .multiply(circle.radius)
      .draw(circle.pos.x, circle.pos.y);
  };

  const activeChange = () => {
    ball.appliedAcc = ball.appliedAcc.rotate(Math.random() * Math.PI * 2);
  };

  return {
    passive: () => changeOrRevert(passiveChange, revert, reverter),
    active: activeChange,
  };
};

const boostedBallModifier = (ball, reverter) => {
  const circle = model.state.objects.circles[0];

  const activeChange = () => {
    if (model.state.reverting) return;

    const ballToCircle = circle.pos.subtract(ball.pos);
    ball.vel = ball.vel.subtract(ballToCircle.unit().multiply(0.75));
  };

  return {
    passive: () => changeOrRevert(undefined, undefined, reverter),
    active: activeChange,
  };
};

const soundBallModifier = (ball, reverter) => {
  const activeChange = () => {
    model.state.melodies.blindingLights.playNote();
    // model.state.sounds.ballHit.play();
  };

  return {
    passive: () => {},
    active: activeChange,
  };
};

const shrinkingCircleModifier = (circle, reverter) => {
  const ball = model.state.objects.balls[0];

  const passiveChange = () => {
    circle.radius -= 0.1;
  };

  const revert = () => {
    canvas.mode = "normal";
    circle.radius = blend(circle.radius, circle.initial.radius, 1);
  };

  const activeChange = () => {
    if (model.state.reverting) return;

    circle.radius += 2.35;
  };

  return {
    passive: () => changeOrRevert(passiveChange, revert, reverter),
    active: activeChange,
  };
};

const loadSounds = () => {
  const memes = ["anita-max-wynn", "bruh", "mario", "pew", "siu"];
  const presidentsSprite = {
    trump: [0, 1110],
    biden: [1110, 2090],
    obama: [2090, 3140],
  };
  model.state.sounds.chords = new Sound("chords.mp3", Sound.sprite(notes, 250));
  model.state.sounds.piano = new Sound("piano.mp3", Sound.sprite(notes, 500));
  model.state.sounds.ballHit = new Sound("ball-hit.mp3");
  model.state.sounds.memes = memes.map((name) => new Sound(name + ".mp3"));
  model.state.sounds.presidents = new Sound("presidents.mp3", presidentsSprite);
  model.state.melodies.kerosene = new Melody("kerosene", "piano");
  model.state.melodies.axelF = new Melody("axelF", "electric-piano");
  model.state.melodies.flowerSong = new Melody("flowerSong", "piano");
  model.state.melodies.blindingLights = new Melody(
    "blindingLights",
    "electric-piano"
  );
};

main();

/** TODO

FIX: Collisions when ball goes in opposite direction to circle inside circle when circle is moving

*/
