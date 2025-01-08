import Preset from "../classes/Preset";

import Ball from "../classes/shapes/entities/Ball";
import Circle from "../classes/shapes/entities/Circle";
import Vector from "../classes/Vector";
import Wall from "../classes/shapes/Wall";
import ConstantAcc from "../classes/interactions/ConstantAcc";
import Modifier from "../classes/Modifier";
import Text from "../classes/shapes/entities/Text";
import Sound from "../classes/Sound";
import notes from "../data/notes";

const initializer = (preset) => {
  const options = {
    layers: 6,
    layerHeight: 57.4,
    circlesInitial: 3,
    circleElasticity: 0,
    gridHeight: 150,
    radiusCircle: 7.5,
    radiusBall: 7.5,
    startRange: 0.5,
    maxThickness: 175,
  };

  const textCount = new Text({
    content: "Balls: 1",
    pos: preset.canvas.center.add(new Vector(0, 300)),
  });

  // 1. Create pegs
  const circles = [];
  for (let i = 0; i < options.layers; i++) {
    const count = i + options.circlesInitial; // Start at 3 circles

    for (let j = 0; j < count; j++) {
      const circle = new Circle({
        radius: options.radiusCircle,
        pos: preset.canvas.center.add(
          new Vector(
            (-count / 2 + j) * options.layerHeight + options.layerHeight / 2,
            options.gridHeight - i * options.layerHeight
          )
        ),
        elasticity: options.circleElasticity,
        thickness: 5,
      });

      circles.push(circle);
    }
  }

  // 2. Create ball
  const ball = new Ball({
    pos: preset.canvas.center.add(
      new Vector(
        Math.random() * options.startRange - options.startRange / 2,
        options.gridHeight + options.layerHeight * 2
      )
    ),
    radius: options.radiusBall,
    fill: "rainbow",
    accs: { gravity: new ConstantAcc(0, -0.4) },
  });
  const moveBallModifier = new Modifier({ type: "active" });
  moveBallModifier.use(moveBall, ball);
  ball.addModifier(moveBallModifier);

  // 3. Create detector walls
  const walls = [];
  for (let i = 0; i <= options.layers; i++) {
    const circlesCount = options.layers + options.circlesInitial;
    const startX = (-circlesCount / 2 + i) * options.layerHeight + options.layerHeight + options.radiusCircle;
    const startY = options.gridHeight - options.layers * options.layerHeight - options.maxThickness / 2;

    const wall = new Wall({
      start: preset.canvas.center.add(new Vector(startX, startY)),
      end: preset.canvas.center.add(new Vector(startX + options.layerHeight - options.radiusCircle * 2, startY)),
      color: "rgba(255, 255, 255, .5)",
      thickness: options.maxThickness,
    });
    const detectBallModifier = new Modifier({ type: "active" });
    detectBallModifier.use(detectBall, preset, options, textCount);
    wall.addModifier(detectBallModifier);
    walls.push(wall);
  }

  // 5. Create bounds
  const bounds = [];
  const boundsHeight = preset.canvas.element.clientHeight;
  const boundsWidth = preset.canvas.element.clientHeight * (9 / 16);
  const edges = [
    preset.canvas.center.add(new Vector(-boundsWidth / 2, -boundsHeight / 2)),
    preset.canvas.center.add(new Vector(-boundsWidth / 2, +boundsHeight / 2)),
    preset.canvas.center.add(new Vector(+boundsWidth / 2, +boundsHeight / 2)),
    preset.canvas.center.add(new Vector(+boundsWidth / 2, -boundsHeight / 2)),
  ];
  for (let i = 0; i <= 3; i++) {
    const bound = new Wall({
      start: edges[i],
      end: edges[(i + 1) % edges.length],
      stroke: "black",
    });
    bounds.push(bound);
  }

  // 7. Configure preset
  preset.addObjects("circles", ...circles);
  preset.addObjects("balls", ball);
  preset.addObjects("walls", ...walls);
  preset.addObjects("walls", ...bounds);
  preset.addObjects("texts", textCount);
};

function detectBall(preset, options, textCount) {
  if (!preset.data.distribution) {
    preset.data.distribution = [];

    for (let i = 0; i <= options.layers; i++) {
      preset.data.distribution.push(0);
    }
  }

  return (data) => {
    // Remove current ball
    preset.objects.balls.splice(data.ballIndex, 1);

    // Spawn two more balls
    const ball1 = new Ball({
      pos: preset.canvas.center.add(
        new Vector(
          Math.random() * options.startRange - options.startRange / 2,
          options.gridHeight + options.layerHeight * 2 + Math.random() * 50
        )
      ),
      radius: options.radiusBall,
      fill: "rainbow",
      vel: new Vector(0, Math.random() * 3),
      accs: { gravity: new ConstantAcc(0, -0.4) },
    });
    const moveBall1Modifier = new Modifier({ type: "active" });
    moveBall1Modifier.use(moveBall, ball1);
    ball1.addModifier(moveBall1Modifier);

    const ball2 = new Ball({
      pos: preset.canvas.center.add(
        new Vector(
          Math.random() * options.startRange - options.startRange / 2,
          options.gridHeight + options.layerHeight * 2 + Math.random() * 50
        )
      ),
      radius: options.radiusBall,
      fill: "rainbow",
      vel: new Vector(0, Math.random() * 3),
      accs: { gravity: new ConstantAcc(0, -0.4) },
    });
    const moveBall2Modifier = new Modifier({ type: "active" });
    moveBall2Modifier.use(moveBall, ball2);
    ball2.addModifier(moveBall2Modifier);

    preset.addObjects("balls", ball1, ball2);

    textCount.content = "Balls: " + preset.objects.balls.length;

    preset.data.distribution[data.wallIndex] += 1;
    const distributed = distribute(preset.data.distribution);

    distributed.forEach((v, i) => {
      const wall = preset.objects.walls[i];

      wall.thickness = options.maxThickness * v + 10;
      const startY = wall.initial.start.y + options.maxThickness / 2 - wall.thickness / 2;

      wall.start = new Vector(wall.start.x, startY);
      wall.end = new Vector(wall.end.x, startY);
    });
  };
}

function distribute(arr) {
  const sum = arr.reduce((p, c) => p + c, 0);
  const avged = arr.map((v, i) => {
    if (v === 0) return 0;
    else return v / sum;
  });
  const max = Math.max(...avged);

  return avged.map((v) => {
    if (v === 0) return 0;
    else return v / max;
  });
}

function moveBall(ball) {
  const collidedCircles = [];

  return (data) => {
    if (!data.circle) return;

    if (!collidedCircles.includes(data.circleIndex)) {
      collidedCircles.push(data.circleIndex);

      const move = Math.random() < 0.5 ? -1 : 1;

      ball.pos = new Vector(data.circle.pos.x + move, ball.pos.y);
      ball.vel = new Vector(0, 0);
      console.log(move);
    }
  };
}

const plinko = new Preset({
  name: "plinko",
  initializer,
  options: {
    stepsPerFrame: 2,
    collisions: {
      ballToBall: false,
    },
  },
});

export default plinko;
