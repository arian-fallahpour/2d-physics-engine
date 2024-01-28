import Ball from "../Classes/Ball";
import canvas from "../Classes/Canvas";
import Circle from "../Classes/Circle";
import Preset from "../Classes/Preset";
import Vector from "../Classes/Vector";
import Wall from "../Classes/Wall";
import {
  plinkoBallModifier,
  plinkoRemoveBallWallModifier,
  plinkoWallModifier,
} from "../controllers/modifierController";

const plinko = new Preset("plinko");

plinko.init((preset) => {
  // Draw cicles
  const layers = 6;
  const layerHeight = 57.4;
  const circlesInitial = 3;
  const gridHeight = 150;
  const radiusCircle = 7.5;
  const radiusBall = 7.5;

  const circles = [];
  for (let i = 0; i < layers; i++) {
    const circlesCount = i + circlesInitial; // Start at 3 circles

    for (let j = 0; j < circlesCount; j++) {
      const circle = new Circle({
        pos: new Vector(
          canvas.element.clientWidth / 2 +
            (-circlesCount / 2 + j) * layerHeight +
            layerHeight / 2,
          canvas.element.clientHeight / 2 + gridHeight - i * layerHeight
        ),
        radius: radiusCircle,
        color: "grey",
        borderColor: "transparent",
        elasticity: 0.4,
      });
      circles.push(circle);
    }
  }
  preset.addObjects("circles", ...circles);

  // Render balls
  const range = 1;
  const createNewBall = (initial = false) => {
    const ball = new Ball({
      pos: new Vector(
        canvas.element.clientWidth / 2 + Math.random() * range - range / 2,
        canvas.element.clientHeight / 2 + gridHeight + layerHeight
      ),
      radius: radiusBall,
      color: initial ? "red" : "rainbow",
      borderColor: "transparent",
      appliedAcc: !initial ? new Vector(0, -0.2) : undefined,
      elasticity: 0,
    });
    ball.addModifier(plinkoBallModifier(ball));

    return ball;
  };

  const ball = createNewBall();
  preset.addObjects("balls", ball);

  // Render bottom walls
  const walls = [];
  for (let i = 0; i <= layers; i++) {
    const circlesCount = layers + circlesInitial;
    const startX =
      canvas.element.clientWidth / 2 +
      (-circlesCount / 2 + i) * layerHeight +
      layerHeight +
      radiusCircle;
    const startY =
      canvas.element.clientHeight / 2 + gridHeight - layers * layerHeight;

    const wall = new Wall({
      start: new Vector(startX, startY),
      end: new Vector(startX + layerHeight - radiusCircle * 2, startY),
      color: "grey",
    });
    wall.addModifier(plinkoRemoveBallWallModifier(wall));
    wall.addModifier(plinkoWallModifier(wall, createNewBall));
    walls.push(wall);
  }
  preset.addObjects("walls", ...walls);

  // Render bounds
  const boundsHeight = canvas.element.clientHeight;
  const boundsWidth = canvas.element.clientHeight * (9 / 16);
  const edges = [
    new Vector(
      canvas.element.clientWidth / 2 - boundsWidth / 2,
      canvas.element.clientHeight / 2 - boundsHeight / 2
    ),
    new Vector(
      canvas.element.clientWidth / 2 - boundsWidth / 2,
      canvas.element.clientHeight / 2 + boundsHeight / 2
    ),
    new Vector(
      canvas.element.clientWidth / 2 + boundsWidth / 2,
      canvas.element.clientHeight / 2 + boundsHeight / 2
    ),
    new Vector(
      canvas.element.clientWidth / 2 + boundsWidth / 2,
      canvas.element.clientHeight / 2 - boundsHeight / 2
    ),
  ];
  const bounds = [];
  for (let i = 0; i <= 3; i++) {
    const bound = new Wall({
      start: edges[i],
      end: edges[(i + 1) % edges.length],
      color: "white",
    });

    bound.addModifier(plinkoWallModifier(bound, createNewBall));
    bound.addModifier(plinkoRemoveBallWallModifier(bound));
    bounds.push(bound);
  }
  preset.addObjects("walls", ...bounds);
});

export default plinko;
