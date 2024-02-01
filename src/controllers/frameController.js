import canvas from "../classes/Canvas";

import * as model from "../model";

import options from "../data/options";
import engine from "../data/engine";
import Entity from "../classes/objects/Entity";

import {
  isBallBallPenetrating,
  isBallWallPenetrating,
  resolveBallBallCollision,
  resolveBallWallPenetration,
  resolveBallBallPenetration,
  resolveBallWallCollision,
  isBallCirclePenetrating,
  resolveBallCirclePenetration,
  resolveBallCircleCollision,
  isCircleCirclePenetrating,
  resolveCircleCirclePenetration,
  resolveCircleCircleCollision,
} from "./collisionController";

const frameHandler = (timeMs) => {
  const { state } = model;

  calculateFrameMetrics(timeMs);

  // Clear Canvas for next frame
  canvas.prepare();

  // Get current preset
  const preset = state.presets[state.preset];

  // Render objects
  Entity.render(preset.objects.walls);
  Entity.render(preset.objects.fractals);
  Entity.render(preset.objects.texts);

  Entity.render(preset.objects.circles, (circle1, i) => {
    preset.objects.circles.forEach((circle2, j) => {
      if (i === j) return; // If same circle
      if (i < j) return; // If resolution has already been calculated

      const isPenetrating = isCircleCirclePenetrating(circle1, circle2);
      if (!isPenetrating) return;

      const data = {
        circle1,
        circle2,
        circle1Index: i,
        circle2Index: j,
      };
      circle1.modify("active", data);
      circle2.modify("active", data);

      resolveCircleCirclePenetration(circle1, circle2);
      resolveCircleCircleCollision(circle1, circle2);
    });
  });

  Entity.render(preset.objects.balls, (ball1, i) => {
    // Check if penetrating any other balls
    preset.objects.balls.forEach((ball2, j) => {
      if (i === j) return; // If same ball
      if (i < j) return; // If resolution has already been calculated

      const isPenetrating = isBallBallPenetrating(ball1, ball2);
      if (!isPenetrating) return;

      const data = {
        ball1,
        ball2,
        ball1Index: i,
        ball2Index: j,
      };

      ball1.modify("active", data);
      ball2.modify("active", data);

      resolveBallBallPenetration(ball1, ball2);
      resolveBallBallCollision(ball1, ball2);
    });

    // Check if penetrating any circles
    preset.objects.circles.forEach((circle, j) => {
      const isPenetrating = isBallCirclePenetrating(ball1, circle);
      if (!isPenetrating) return;

      const data = {
        circle,
        ball: ball1,
        ballIndex: i,
        circleIndex: j,
      };

      ball1.modify("active", data);
      circle.modify("active", data);

      resolveBallCirclePenetration(ball1, circle);
      resolveBallCircleCollision(ball1, circle);
    });

    // Check if penetrating any walls
    preset.objects.walls.forEach((wall, j) => {
      const isPenetrating = isBallWallPenetrating(ball1, wall);
      if (!isPenetrating) return;

      const data = {
        ball: ball1,
        wall,
        ballIndex: i,
        wallIndex: j,
      };

      ball1.modify("active", data);
      wall.modify("active", data);

      resolveBallWallPenetration(ball1, wall);
      resolveBallWallCollision(ball1, wall);
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
