import { state } from "../model";

import notes from "../data/notes";

import Vector from "../classes/Vector";
import options from "../data/options";
import Sound from "../classes/Sound";
import Melody from "../classes/Melody";
import Circle from "../classes/objects/Circle";
import Ball from "../classes/objects/Ball";

const blend = (current, final, step) => {
  if (current < final) {
    return Math.min(current + step, final);
  }

  if (current > final) {
    return Math.max(current - step, final);
  }

  return final;
};

// WORKS ONLY FOR PASSIVE
const determineAction = (
  change = () => {},
  revert = () => {},
  reverter = () => {}
) => {
  const shouldRevert = reverter();
  if (state.reverting || shouldRevert) {
    state.reverting = true;

    revert();
  } else {
    change();
  }
};

export const revertBallModifier = (ball, reverter) => {
  const revert = () => {
    state.preset.canvas.setMode("lucid");

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
    ball.tailLength = blend(ball.tailLength, ball.initial.tailLength, 5);
  };

  return {
    passive: () => determineAction(undefined, revert, reverter),
    active: () => {},
  };
};

export const growingBallModifier = (ball, increment = 1) => {
  const activeChange = () => {
    if (state.reverting) return;

    ball.radius += Math.max(increment, ball.radius * 0.01);
    // ball.radius += increment;
  };

  return {
    passive: () => {},
    active: activeChange,
  };
};

export const fasterBallModifier = (ball, multiplier = 1.01) => {
  const activeChange = () => {
    if (state.reverting) return;

    ball.vel = ball.vel.multiply(multiplier);
  };

  return {
    passive: () => {},
    active: activeChange,
  };
};

export const rotatingGravityBallModifier = (ball, circle, reverter) => {
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
    passive: () => determineAction(passiveChange, undefined, reverter),
    active: () => {},
  };
};

export const randomGravityBallModifier = (ball, circle, reverter) => {
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
    ball.appliedAcc = ball.appliedAcc.rotate((Math.random() * Math.PI) / 2);
  };

  return {
    passive: () => determineAction(passiveChange, revert, reverter),
    active: activeChange,
  };
};

export const centerGravityBallMidifier = (ball, circle) => {
  const passiveChange = () => {
    // ball.pos.subtract(circle.pos).draw(circle.pos.x, circle.pos.y);
    ball.appliedAcc = ball.pos.subtract(circle.pos).unit().multiply(-0.2);
  };

  return {
    passive: passiveChange,
    active: () => {},
  };
};

export const boostedBallModifier = (ball, circle) => {
  const activeChange = () => {
    if (state.reverting) return;

    const ballToCircle = circle.pos.subtract(ball.pos);
    ball.vel = ball.vel.subtract(ballToCircle.unit().multiply(0.05));
  };

  return {
    passive: () => {},
    active: activeChange,
  };
};

export const growingTailBallModifier = (ball) => {
  const activeChange = () => {
    ball.tailLength += 4;
  };

  return {
    passive: () => {},
    active: activeChange,
  };
};

export const plinkoBallModifier = () => {
  const beep = new Sound("beep", Sound.sprite(notes, 500));
  const bossBattle = new Sound("boss-battle", Sound.sprite(notes, 500));
  let previousCircle;

  const activeChange = (data) => {
    // Play ball hit unrepreatedly
    if (data.circle && previousCircle !== data.circle.name) {
      previousCircle = data.circle.name;
      const note = notes[20 + Math.random() * 40];
      // beep.play(note);
    }

    // Play random note on wall impact
    if (data.wall) {
      const note = notes[Math.floor(Math.random() * 20) + 30];
      // bossBattle.play(note);
    }
  };

  return {
    passive: () => {},
    active: activeChange,
  };
};

export const addBallModifier = (settings) => {
  const activeChange = () => {
    const ball = new Ball(settings);
    state.preset.addObjects("balls", ball);
  };

  return {
    passive: () => {},
    active: activeChange,
  };
};

// Centers ball when it hits platform to maintain rythmn
export const platformsBallModifiers = (pegsData) => {
  const activeChange = (data) => {
    const { ball } = data;

    ball.pulse("shadowColor", "rgba(255, 255, 255, 0.15)", 0.1 * 60);
    ball.pulse("shadowLength", 300, 0.1 * 60);

    state.collisions += 1;
  };

  return {
    passive: () => {},
    active: activeChange,
  };
};

// CIRCLES
export const shrinkingCircleModifier = (circle, reverter, decrement = 0.1) => {
  const passiveChange = () => {
    circle.radius -= decrement / options.requestFrameCount;
  };

  const revert = () => {
    state.preset.canvas.mode = "normal";
    circle.radius = blend(circle.radius, circle.initial.radius, 1);
  };

  return {
    passive: () => determineAction(passiveChange, revert, reverter),
    active: () => {},
  };
};

export const growCircleModifier = (circle, increment = 2) => {
  const activeChange = () => {
    if (state.reverting) return;

    circle.radius += increment;
  };

  return {
    passive: () => {},
    active: activeChange,
  };
};

export const bouncingCircleModifier = (circle) => {
  let stuck = false;
  const sound = new Sound("level-up", Sound.sprite(notes, 500));
  const colors = ["red", "blue"];

  const activeChange = () => {
    if (stuck) return;

    const circles = state.preset.objects.circles;
    const previousCircle = circles[circles.length - 2];

    // If not stuck and current circle's radius is less than previous circle's radius
    if (!stuck && circle.radius <= previousCircle.radius + circle.thickness) {
      stuck = true;

      // Replace current circle with a static one
      const replacingBall = new Circle({
        pos: new Vector(circle.initial.pos.x, circle.initial.pos.y),
        radius: previousCircle.radius + circle.thickness + 2, // +2 to prevent phasing
        thickness: circle.thickness,
        borderColor: circle.getRainbow(),
        mass: 0,
      });
      circles[circles.length - 1] = replacingBall;

      // Spawn next circle
      let nextCircle;

      // Summon new ball only if next ball's radius is more than previous ball's radius
      if (
        replacingBall.radius + circle.initial.thickness / 2 >
        circle.initial.radius
      )
        return;
      const repeats = 2;
      for (let i = 0; i <= repeats; i++) {
        window.setTimeout(() => {
          // Play level up sound
          sound.play(notes[20 + i]);

          // Cycle through colors
          if (nextCircle) {
            nextCircle.borderColor = colors[i % 2];
          }

          // Spawn next circle with initial settings if on first iteration
          if (i === 0) {
            nextCircle = new Circle({
              ...circle.initial,
              vel: new Vector(0, 0),
              appliedAcc: new Vector(0, 0),
              borderColor: i === 2 ? "rainbow" : colors[i % 2],
            });
            nextCircle.addModifier(bouncingCircleModifier(nextCircle));
            nextCircle.addModifier(soundModifier("fluid-bass", true));
            state.preset.addObjects("circles", nextCircle);

            // Set color to rainbow if final iteration
          } else if (i === 2) {
            nextCircle.borderColor = "rainbow";
          }
        }, (i + 2) * 250);
      }

      // Enable movement after a while if nextCircle exists
      window.setTimeout(() => {
        nextCircle.appliedAcc = new Vector(0, -0.5);
        nextCircle.vel = new Vector(4, 4);
      }, (repeats + 3) * 250);

      // Decrease radius
    } else {
      circle.radius -= 10;
    }
  };

  return {
    passive: () => {},
    active: activeChange,
  };
};

// WALLS

export const plinkoWallModifier = (createNewBall) => {
  const maxBalls = 1000;

  const reverter = () => {
    const balls = state.preset.objects.balls;
    return balls.length > maxBalls;
  };

  const revert = () => {
    const balls = state.objects.balls;

    if (state.reverting && balls.length === 0) {
      const ball = createNewBall(true);
      state.preset.objects.balls.push(ball);
    }
  };

  const activeChange = (data) => {
    // Add initial ball at starting position after all balls disappear
    state.preset.objects.balls.push(
      createNewBall(),
      createNewBall(),
      createNewBall()
    );
  };

  return {
    passive: () => {},
    active: () => determineAction(activeChange, revert, reverter),
  };
};

export const plinkoRemoveBallWallModifier = (wall) => {
  const activeChange = (data) => {
    const { preset } = state;

    // Delete ball
    state.preset.objects.balls.splice(data.ballIndex, 1);
  };

  return {
    passive: () => {},
    active: activeChange,
  };
};

// SOUNDS
export const soundModifier = (soundName, randomNote = false) => {
  const sprite = Sound.sprite(notes, 500);
  const sound = new Sound(soundName, sprite);

  const activeChange = () => {
    const note = randomNote
      ? notes[20 + Math.floor(Math.random() * 40)]
      : undefined;
    sound.play(note);
  };

  return {
    passive: () => {},
    active: activeChange,
  };
};

export const melodyModifier = (melodyName, instrument) => {
  if (!state.melodies[melodyName]) {
    state.melodies[melodyName] = new Melody(melodyName, instrument);
  }

  const activeChange = () => {
    state.melodies[melodyName].playNote();
  };

  return {
    passive: () => {},
    active: activeChange,
  };
};

// FRACTALS
export const changeFractalLayerBallModifier = (ball, circle, fractal) => {
  const activeChange = () => {
    const closestPoint = circle.closestPointTo(ball.pos);

    if (closestPoint.y > state.preset.canvas.element.clientHeight / 2) {
      fractal.layers -= 1;
    } else {
      fractal.layers += 1;
    }
  };

  return {
    passive: () => {},
    active: activeChange,
  };
};

export const changeFractalAngleBallModifier = (ball, circle, fractal) => {
  const activeChange = () => {
    const closestPoint = circle.closestPointTo(ball.pos);

    if (closestPoint.y > state.preset.canvas.element.clientHeight / 2) {
      fractal.angle -= 0.05; // ~60s
      // fractal.angle -= 0.17; // ~30s
    } else {
      fractal.angle += 0.05; // ~60s
      // fractal.angle += 0.17; // ~30s
    }
  };

  return {
    passive: () => {},
    active: activeChange,
  };
};

export const revertFractalModifier = (fractal, reverter) => {
  const revert = () => {
    fractal.layers = blend(fractal.layers, fractal.initial.layers, 1);
    fractal.angle = blend(fractal.angle, fractal.initial.angle, 0.002);
  };

  return {
    passive: () => determineAction(undefined, revert, reverter),
    active: () => {},
  };
};
