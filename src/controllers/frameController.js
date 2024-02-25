import { state } from "../model";

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
  // Only render frame if in play state, or paused on the first frame
  if (!state.play && engine.frame !== 0 && !state.step) return;
  if (state.step) {
    state.step = false;
    state.play = false;
  }

  // Calculate frame metrics
  calculateFrameMetrics(timeMs);

  // Get current preset
  const preset = state.preset;
  const { walls, balls, circles, fractals, texts } = preset.objects;

  // Apply modifiers before render
  preset.modify("before");

  // Clear Canvas for next frame
  preset.canvas.prepare();

  // Render objects
  Entity.render(walls);
  Entity.render(fractals);
  Entity.render(texts);

  Entity.render(circles, (circle1, i) => {
    circles.forEach((circle2, j) => {
      if (i === j) return; // If same circle
      if (i < j) return; // If resolution has already been calculated

      const isPenetrating = isCircleCirclePenetrating(circle1, circle2);
      if (!isPenetrating) return;

      const data = { circle1, circle2, circle1Index: i, circle2Index: j };

      circle1.modify("active", data);
      circle2.modify("active", data);

      resolveCircleCirclePenetration(circle1, circle2);
      resolveCircleCircleCollision(circle1, circle2);
    });
  });

  Entity.render(balls, (ball1, i) => {
    // Check if penetrating any other balls
    // balls.forEach((ball2, j) => {
    //   if (i === j) return; // If same ball
    //   if (i < j) return; // If resolution has already been calculated

    //   const isPenetrating = isBallBallPenetrating(ball1, ball2);
    //   if (!isPenetrating) return;

    //   const data = { ball1, ball2, ball1Index: i, ball2Index: j };

    //   ball1.modify("active", data);
    //   ball2.modify("active", data);

    //   resolveBallBallPenetration(ball1, ball2);
    //   resolveBallBallCollision(ball1, ball2);
    // });

    // Check if penetrating any circles
    circles.forEach((circle, j) => {
      const isPenetrating = isBallCirclePenetrating(ball1, circle);
      if (!isPenetrating) return;

      const data = { circle, ball: ball1, ballIndex: i, circleIndex: j };

      ball1.modify("active", data);
      circle.modify("active", data);

      resolveBallCirclePenetration(ball1, circle);
      resolveBallCircleCollision(ball1, circle);
    });

    // Check if penetrating any walls
    walls.forEach((wall, j) => {
      const isPenetrating = isBallWallPenetrating(ball1, wall);
      if (!isPenetrating) return;

      const data = { ball: ball1, wall, ballIndex: i, wallIndex: j };

      ball1.modify("active", data);
      wall.modify("active", data);

      resolveBallWallPenetration(ball1, wall);
      resolveBallWallCollision(ball1, wall);
    });
  });

  // Apply modifiers after render
  preset.modify("after");

  // Request next frame
  requestAnimationFrame(frameHandler);
};

export const requestNextFrame = (firstFrame = false) => {
  // Call the number of frames defined in options if not only calling first frame
  if (!firstFrame) {
    if (!state.play) return;

    for (let i = 0; i < options.requestFrameCount; i++) {
      requestAnimationFrame(frameHandler);
    }
    return;
  }

  requestAnimationFrame(frameHandler);
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

export const resetFrameMetrics = () => {
  engine.frame = 0;
  engine.frameTime = 0;
  engine.framesPerSecond = 0;
  engine.timeMs = 0;
};

export default frameHandler;
