import notes from "../data/notes";

import canvas from "../Classes/Canvas";

import * as model from "../model";

import options from "../data/options";
import engine from "../data/engine";
import Ball from "../Classes/Ball";
import Vector from "../Classes/Vector";

const frameHandler = (timeMs) => {
  const { state } = model;
  calculateFrameMetrics(timeMs);

  const circle = state.objects.circles[0];
  const ball = state.objects.balls[0];
  circle.radius -= 0.1;

  if (state.reverting || circle.radius <= ball.radius) {
    state.reverting = true;
    canvas.mode = "normal";

    // Revert ball
    ball.color = ball.initial.color;
    ball.rainbow = false;
    ball.radius = Math.max(ball.radius * 0.96, ball.initial.radius);
    ball.pos = new Vector(
      (ball.pos.x - ball.initial.pos.x) * 0.96 + ball.initial.pos.x,
      (ball.pos.y - ball.initial.pos.y) * 0.96 + ball.initial.pos.y
    );
    ball.vel = new Vector(0, 0);
    ball.acc = new Vector(0, 0);
    ball.appliedAcc = new Vector(0, 0);

    // Revert circle
    console.log(circle.radius * 1.01);
    circle.radius = Math.min(circle.radius * 1.005, 200);
  }

  // Clear Canvas for next frame
  canvas.clear();

  // Render circles
  state.objects.circles.forEach((circle, i) => circle.draw());

  // Render walls
  state.objects.walls.forEach((wall, i) => wall.draw());

  // Render fractals
  state.objects.fractals.forEach((fractal, i) => fractal.draw());

  // Render balls
  state.objects.balls.forEach((ball1, i) => {
    // Draw ball
    ball1.draw();

    // Check if penetrating any other balls
    state.objects.balls.forEach((ball2, j) => {
      if (i === j) return;
      if (!ball1.isPenetratingBall(ball2)) return;

      ball1.resolveBallPenetration(ball2);
      ball1.resolveBallCollision(ball2);
    });

    // Check if penetrating any circles
    state.objects.circles.forEach((circle, j) => {
      if (!ball1.isPenetratingCircle(circle)) return;

      if (!state.reverting) {
        model.state.melodies.flowerSong.playNote();
        ball1.radius += 1;
        ball1.vel = ball1.vel.multiply(1.01);
        circle.radius += 0.8;
      }

      ball1.resolveCirclePenetration(circle);
      ball1.resolveCircleCollision(circle);
    });

    // Check if penetrating any walls
    state.objects.walls.forEach((wall, j) => {
      if (!ball1.isPenetratingWall(wall)) return;

      model.collided();

      ball1.resolveWallPenetration(wall);
      ball1.resolveWallCollision(wall);
    });
  });

  // Request next frame if in play state
  requestNextFrame(true);
};

export const requestNextFrame = (insideLoop = true) => {
  const { state } = model;

  // Call one frame (next frame) only, if inside the mainLoop
  if (insideLoop) {
    if (!state.play) return;
    requestAnimationFrame(frameHandler);
    return;
  }

  // Call the number of frames defined in options
  for (let i = 0; i < options.requestFrameCount; i++) {
    requestAnimationFrame(frameHandler);
  }
};

const calculateFrameMetrics = (timeMs) => {
  if (engine.frame % options.requestFrameCount === 0) {
    engine.frameTime = timeMs - engine.timeMs;
    engine.framesPerSecond =
      engine.frameTime === 0 ? null : 1000 / engine.frameTime;
    engine.timeMs = timeMs;

    window.framesPerSecond = engine.framesPerSecond;
  }

  engine.frame += 1;
};

export default frameHandler;
