import Preset from "../classes/Preset";

import Ball from "../classes/objects/Ball";
import Circle from "../classes/objects/Circle";
import Vector from "../classes/Vector";
import Wall from "../classes/objects/Wall";
import Modifier from "../classes/Modifier";

const initializer = (preset) => {
  const layers = 6;
  const layerHeight = 57.4;
  const circlesInitial = 3;
  const circleElasticity = 0;
  const gridHeight = 150;
  const radiusCircle = 7.5;
  const radiusBall = 7.5;
  const startRange = 0.5;

  // 1. Create pegs
  const circles = [];
  for (let i = 0; i < layers; i++) {
    const circlesCount = i + circlesInitial; // Start at 3 circles

    for (let j = 0; j < circlesCount; j++) {
      const circle = new Circle({
        radius: radiusCircle,
        pos: new Vector(
          preset.canvas.element.clientWidth / 2 +
            (-circlesCount / 2 + j) * layerHeight +
            layerHeight / 2,
          preset.canvas.element.clientHeight / 2 + gridHeight - i * layerHeight
        ),
        color: "rgba(255, 255, 255, 0.5)",
        elasticity: circleElasticity,
      });
      circles.push(circle);
    }
  }

  // 2. Create ball
  const ball = new Ball({
    pos: new Vector(
      preset.canvas.element.clientWidth / 2 +
        Math.random() * startRange -
        startRange / 2,
      preset.canvas.element.clientHeight / 2 + gridHeight + layerHeight * 2
    ),
    radius: radiusBall,
    color: "rainbow",
    borderColor: "transparent",
    appliedAcc: new Vector(0, -0.4),
  });

  // 3. Create detector walls
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
      color: "rgba(255, 255, 255, .5)",
      thickness: 7,
      edges: "round",
    });
    walls.push(wall);
  }

  // 4. Create bounds
  const bounds = [];
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
  for (let i = 0; i <= 3; i++) {
    const bound = new Wall({
      start: edges[i],
      end: edges[(i + 1) % edges.length],
      color: "white",
    });
    bounds.push(bound);
  }

  // 5. Configure preset
  preset.addObjects("circles", ...circles);
  preset.addObjects("balls", ball);
  preset.addObjects("walls", ...walls);
  preset.addObjects("walls", ...bounds);
};

const plinko = new Preset({
  name: "plinko",
  initializer,
});

function detectBall(ball) {
  return (data) => {};
}

export default plinko;
