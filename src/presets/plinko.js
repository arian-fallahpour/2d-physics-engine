import canvas from "../classes/Canvas";
import Preset from "../classes/Preset";

import Ball from "../classes/objects/Ball";
import Circle from "../classes/objects/Circle";
import Vector from "../classes/Vector";
import Wall from "../classes/objects/Wall";
import {
  plinkoBallModifier,
  plinkoRemoveBallWallModifier,
  plinkoWallModifier,
} from "../controllers/modifierController";

const initializer = (preset) => {
  // Draw cicles
  const layers = 6;
  const layerHeight = 57.4;
  const circlesInitial = 3;
  const circleElasticity = 0;
  const gridHeight = 150;
  const radiusCircle = 7.5;
  const radiusBall = 7.5;
  const startRange = 0.5;

  const circles = [];
  for (let i = 0; i < layers; i++) {
    const circlesCount = i + circlesInitial; // Start at 3 circles

    for (let j = 0; j < circlesCount; j++) {
      const circle = new Circle({
        pos: new Vector(
          preset.canvas.element.clientWidth / 2 +
            (-circlesCount / 2 + j) * layerHeight +
            layerHeight / 2,
          preset.canvas.element.clientHeight / 2 + gridHeight - i * layerHeight
        ),
        radius: radiusCircle,
        color: "grey",
        borderColor: "transparent",
        elasticity: circleElasticity,
      });
      circles.push(circle);
    }
  }
  preset.addObjects("circles", ...circles);

  // Render balls
  const createNewBall = (initial = false) => {
    const ball = new Ball({
      pos: new Vector(
        preset.canvas.element.clientWidth / 2 +
          Math.random() * startRange -
          startRange / 2,
        preset.canvas.element.clientHeight / 2 + gridHeight + layerHeight * 2
      ),
      radius: radiusBall,
      color: initial ? "red" : "rainbow",
      borderColor: "transparent",
      appliedAcc: !initial ? new Vector(0, -0.4) : undefined,
    });
    // ball.addModifier(plinkoBallModifier(ball));

    return ball;
  };

  const ball = createNewBall();
  preset.addObjects("balls", ball);

  // Render bottom walls
  const walls = [];
  for (let i = 0; i <= layers; i++) {
    const circlesCount = layers + circlesInitial;
    const startX =
      preset.canvas.element.clientWidth / 2 +
      (-circlesCount / 2 + i) * layerHeight +
      layerHeight +
      radiusCircle;
    const startY =
      preset.canvas.element.clientHeight / 2 +
      gridHeight -
      layers * layerHeight;

    const wall = new Wall({
      start: new Vector(startX, startY),
      end: new Vector(startX + layerHeight - radiusCircle * 2, startY),
      color: "grey",
    });
    // wall.addModifier(plinkoRemoveBallWallModifier());
    // wall.addModifier(plinkoWallModifier(createNewBall));
    walls.push(wall);
  }
  preset.addObjects("walls", ...walls);

  // Render bounds
  const boundsHeight = preset.canvas.element.clientHeight;
  const boundsWidth = preset.canvas.element.clientHeight * (9 / 16);
  const edges = [
    new Vector(
      preset.canvas.element.clientWidth / 2 - boundsWidth / 2,
      preset.canvas.element.clientHeight / 2 - boundsHeight / 2
    ),
    new Vector(
      preset.canvas.element.clientWidth / 2 - boundsWidth / 2,
      preset.canvas.element.clientHeight / 2 + boundsHeight / 2
    ),
    new Vector(
      preset.canvas.element.clientWidth / 2 + boundsWidth / 2,
      preset.canvas.element.clientHeight / 2 + boundsHeight / 2
    ),
    new Vector(
      preset.canvas.element.clientWidth / 2 + boundsWidth / 2,
      preset.canvas.element.clientHeight / 2 - boundsHeight / 2
    ),
  ];
  const bounds = [];
  for (let i = 0; i <= 3; i++) {
    const bound = new Wall({
      start: edges[i],
      end: edges[(i + 1) % edges.length],
      color: "white",
    });

    // bound.addModifier(plinkoWallModifier(createNewBall));
    // bound.addModifier(plinkoRemoveBallWallModifier());
    bounds.push(bound);
  }
  preset.addObjects("walls", ...bounds);
};

const plinko = new Preset({
  name: "plinko",
  initializer,
});

export default plinko;
