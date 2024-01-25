import canvas from "../Classes/Canvas";

import * as model from "../model";

import options from "../data/options";
import engine from "../data/engine";
import Entity from "../Classes/Entity";

const frameHandler = (timeMs) => {
  const { state } = model;

  calculateFrameMetrics(timeMs);

  // Clear Canvas for next frame
  canvas.clear();

  // Render static objects
  Entity.render(state.objects.circles);
  Entity.render(state.objects.walls);
  Entity.render(state.objects.fractals);

  // Render Dynamic objects
  Entity.render(state.objects.balls, (ball1, i) => {
    // Check if penetrating any other balls
    state.objects.balls.forEach((ball2, j) => {
      if (i === j) return;
      if (!ball1.isPenetratingBall(ball2)) return;

      ball1.modify("active");
      ball2.modify("active");

      ball1.resolveBallPenetration(ball2);
      ball1.resolveBallCollision(ball2);
    });

    // Check if penetrating any circles
    state.objects.circles.forEach((circle, j) => {
      if (!ball1.isPenetratingCircle(circle)) return;

      ball1.modify("active");
      circle.modify("active");

      ball1.resolveCirclePenetration(circle);
      ball1.resolveCircleCollision(circle);
    });

    // Check if penetrating any walls
    state.objects.walls.forEach((wall, j) => {
      if (!ball1.isPenetratingWall(wall)) return;

      ball1.modify("active");
      wall.modify("active");

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
