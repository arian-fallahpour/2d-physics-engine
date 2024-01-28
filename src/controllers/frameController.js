import canvas from "../Classes/Canvas";

import * as model from "../model";

import options from "../data/options";
import engine from "../data/engine";
import Entity from "../Classes/Entity";

const frameHandler = (timeMs) => {
  const { state } = model;

  calculateFrameMetrics(timeMs);

  // Clear Canvas for next frame
  canvas.prepare();

  // Get current preset
  // console.log(state.presets[state.preset].objects.balls);
  const preset = state.presets[state.preset];

  // Render static objects
  Entity.render(preset.objects.circles);
  Entity.render(preset.objects.walls);
  Entity.render(preset.objects.fractals);

  // Render dynamic objects
  Entity.render(preset.objects.balls, (ball1, i) => {
    // Check if penetrating any other balls
    // preset.objects.balls.forEach((ball2, j) => {
    //   if (i === j) return;
    //   if (!ball1.isPenetratingBall(ball2)) return;

    //   const data = {
    //     ball1,
    //     ball2,
    //     ball1Index: i,
    //     ball2Index: j,
    //   };

    //   ball1.modify("active");
    //   ball2.modify("active");

    //   ball1.resolveBallPenetration(ball2);
    //   ball1.resolveBallCollision(ball2);
    // });

    // Check if penetrating any circles
    preset.objects.circles.forEach((circle, j) => {
      if (!ball1.isPenetratingCircle(circle)) return;
      const data = {
        circle,
        ball: ball1,
        ballIndex: i,
        circleIndex: j,
      };

      ball1.modify("active", data);
      circle.modify("active", data);

      ball1.resolveCirclePenetration(circle);
      ball1.resolveCircleCollision(circle);
    });

    // Check if penetrating any walls
    preset.objects.walls.forEach((wall, j) => {
      if (!ball1.isPenetratingWall(wall)) return;

      const data = {
        wall,
        ball: ball1,
        ballIndex: i,
        wallIndex: j,
      };

      ball1.modify("active", data);
      wall.modify("active", data);

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
