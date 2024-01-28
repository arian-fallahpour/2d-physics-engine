import * as model from "../model";
import Vector from "../Classes/Vector";
import notes from "../data/notes";

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
  const { state } = model;

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
    canvas.mode = "normal";

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
    passive: () => determineAction(undefined, revert, reverter),
    active: () => {},
  };
};

export const growingBallModifier = (ball, reverter) => {
  const activeChange = () => {
    if (model.state.reverting) return;

    ball.radius = Math.max(ball.radius + 1.5, ball.radius * 1.013);
  };

  return {
    passive: () => determineAction(undefined, undefined, reverter),
    active: activeChange,
  };
};

export const fasterBallModifier = (ball, reverter) => {
  const activeChange = () => {
    if (model.state.reverting) return;

    ball.vel = ball.vel.multiply(1.01);
  };

  return {
    passive: () => determineAction(undefined, activeChange, reverter),
    active: activeChange,
  };
};

export const rotatingGravityBallModifier = (ball, reverter) => {
  const circle = model.state.presets[model.state.preset].objects.circles[0];

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

export const randomGravityBallModifier = (ball, reverter) => {
  const circle = model.state.presets[model.state.preset].objects.circles[0];

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
    passive: () => determineAction(passiveChange, revert, reverter),
    active: activeChange,
  };
};

// export const followingGravityBallModifier = (ball, reverter) => {};

export const boostedBallModifier = (ball, reverter) => {
  const circle = model.state.presets[model.state.preset].objects.circles[0];

  const activeChange = () => {
    if (model.state.reverting) return;

    const ballToCircle = circle.pos.subtract(ball.pos);
    ball.vel = ball.vel.subtract(ballToCircle.unit().multiply(0.75));
  };

  return {
    passive: () => determineAction(undefined, undefined, reverter),
    active: activeChange,
  };
};

export const soundBallModifier = (ball, reverter) => {
  const activeChange = () => {
    // model.state.melodies.blindingLights.playNote();
    model.state.sounds.ballHit.play();
  };

  return {
    passive: () => {},
    active: activeChange,
  };
};

export const growingTailBallModifier = (ball, reverter) => {
  const activeChange = () => {
    ball.tailLength += 5;
  };

  return {
    passive: () => {},
    active: activeChange,
  };
};

export const shrinkingCircleModifier = (circle, reverter) => {
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
    passive: () => determineAction(passiveChange, revert, reverter),
    active: activeChange,
  };
};

export const plinkoWallModifier = (wall, createNewBall) => {
  const maxBalls = 1000;

  const reverter = () => {
    const { state } = model;

    const balls = state.presets[state.preset].objects.balls;
    return balls.length > maxBalls;
  };

  const revert = () => {
    const { state } = model;

    const preset = state.presets[state.preset];
    const balls = preset.objects.balls;

    if (state.reverting && balls.length === 0) {
      const ball = createNewBall(true);
      preset.objects.balls.push(ball);
    }
  };

  const activeChange = (data) => {
    const { state } = model;

    const preset = state.presets[state.preset];

    // Add initial ball at starting position after all balls disappear
    preset.objects.balls.push(
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
    const { state } = model;
    const preset = state.presets[state.preset];

    // Delete ball
    preset.objects.balls.splice(data.ballIndex, 1);
  };

  return {
    passive: () => {},
    active: activeChange,
  };
};

export const plinkoBallModifier = (ball) => {
  let previousBall;

  const activeChange = (data) => {
    // Play ball hit unrepreatedly
    if (data.circle && previousBall !== data.circle.name) {
      previousBall = data.circle.name;
      model.state.sounds.ballHit.play();
    }

    // Play random note on wall impact
    if (data.wall) {
      const note = notes[Math.floor(Math.random() * 20) + 30];
      model.state.sounds.bossBattle.play(note);
    }
  };

  return {
    passive: () => {},
    active: activeChange,
  };
};
