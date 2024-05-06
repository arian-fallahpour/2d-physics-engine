import Shape from "../classes/shapes/Shape";

import { state } from "../model";
import engine from "../data/engine";

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
  isCircleWallPenetrating,
  resolveCircleWallPenetration,
  resolveCircleWallCollision,
} from "./collisionController";
import Vector from "../classes/Vector";

/**
 *
 * NOTES:
 * - Entities may disappear, or act weird if both of them have a mass of 0
 */

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
  const { walls, balls, circles, fractals, texts, points } = preset.objects;

  // Apply modifiers before render
  preset.modify("before", preset);

  // Prepare Canvas for next frame
  preset.canvas.prepare();

  // Render interactions
  Shape().render(preset.interactions);

  // Render objects
  Shape().render(walls);
  Shape().render(fractals);
  Shape().render(texts);
  Shape().render(circles, (circle1, i) => {
    // Circle to circle penetrations
    if (preset.options.collisions.circleToCircle) {
      for (let j = 0; j < circles.length; j++) {
        if (i <= j) continue;

        const circle2 = circles[j];

        const isPenetrating = isCircleCirclePenetrating(circle1, circle2);
        if (!isPenetrating) continue;

        const data = {
          preset,
          circle1,
          circle2,
          circle1Index: i,
          circle2Index: j,
        };

        circle1.modify("active", data);
        circle2.modify("active", data);

        resolveCircleCirclePenetration(circle1, circle2);
        resolveCircleCircleCollision(circle1, circle2);
      }
    }

    // Circle to wall penetrations
    if (preset.options.collisions.circleToCircle) {
      for (let j = 0; j < walls.length; j++) {
        const wall = walls[j];

        const isPenetrating = isCircleWallPenetrating(circle1, wall);
        if (!isPenetrating) continue;

        const data = {
          preset,
          circle: circle1,
          wall,
          circle1Index: i,
          wallIndex: j,
        };

        circle1.modify("active", data);
        wall.modify("active", data);

        resolveCircleWallPenetration(circle1, wall);
        resolveCircleWallCollision(circle1, wall);
      }
    }
  });
  Shape().render(balls, (ball1, i) => {
    // Ball to ball penetrations
    if (preset.options.collisions.ballToBall) {
      for (let j = 0; j < balls.length; j++) {
        if (i <= j) continue;

        const ball2 = balls[j];

        const isPenetrating = isBallBallPenetrating(ball1, ball2);
        if (!isPenetrating) continue;

        const data = { preset, ball1, ball2, ball1Index: i, ball2Index: j };

        ball1.modify("active", data);
        ball2.modify("active", data);

        resolveBallBallPenetration(ball1, ball2);
        resolveBallBallCollision(ball1, ball2);
      }
    }

    // Ball to circle penetrations
    if (preset.options.collisions.ballToCircle) {
      for (let j = 0; j < circles.length; j++) {
        const circle = circles[j];

        const isPenetrating = isBallCirclePenetrating(ball1, circle);
        if (!isPenetrating) continue;

        const data = {
          preset,
          circle,
          ball: ball1,
          ballIndex: i,
          circleIndex: j,
        };

        ball1.modify("active", data);
        circle.modify("active", data);

        resolveBallCirclePenetration(ball1, circle);
        resolveBallCircleCollision(ball1, circle);
      }
    }

    // Ball to wall penetrations
    if (preset.options.collisions.ballToWall) {
      for (let j = 0; j < walls.length; j++) {
        const wall = walls[j];

        const isPenetrating = isBallWallPenetrating(ball1, wall);
        if (!isPenetrating) continue;

        const data = { preset, ball: ball1, wall, ballIndex: i, wallIndex: j };

        ball1.modify("active", data);
        wall.modify("active", data);

        resolveBallWallPenetration(ball1, wall);
        resolveBallWallCollision(ball1, wall);
      }
    }
  });
  Shape().render(points);

  // Apply modifiers after render
  preset.modify("after", preset);

  // Request next frame
  requestAnimationFrame(frameHandler);
};

export const requestNextFrame = (firstFrame = false) => {
  // Call the number of frames defined in options if not only calling first frame
  if (!firstFrame) {
    if (!state.play) return;

    for (let i = 0; i < state.preset.options.stepsPerFrame; i++) {
      requestAnimationFrame(frameHandler);
    }
    return;
  }

  requestAnimationFrame(frameHandler);
};

const calculateFrameMetrics = (timeMs) => {
  if (engine.frame % state.preset.options.stepsPerFrame === 0) {
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
