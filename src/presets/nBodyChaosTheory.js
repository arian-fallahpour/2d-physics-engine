import Preset from "../classes/Preset";
import Vector from "../classes/Vector";
import Ball from "../classes/shapes/entities/Ball";
import Attraction from "../classes/interactions/Attraction";
import Point from "../classes/shapes/entities/Point";

const initializer = (preset) => {
  const ballsCount = 100;
  const distance = 300;
  const gravityStrength = 5;
  const distanceMax = 100000;
  const distanceMin = 5000;
  const angleDiff = 0.0000005;
  const velocity = new Vector(7, 0).rotate(Math.PI / 4 + 0.08);
  const translation = new Vector(0, 0);

  // 1. Create black holes
  const hole1 = new Ball({
    radius: 15,
    pos: preset.canvas.center.add(new Vector(-distance / 2, 0)),
    shadowBlur: 50,
    shadow: "rgba(255,255,255,.3)",
    fill: "black",
    stroke: "white",
    mass: 0,
  });

  const hole2 = new Ball({
    radius: 15,
    pos: preset.canvas.center.add(new Vector(distance / 2, 0)),
    shadowBlur: 50,
    shadow: "rgba(255,255,255,.3)",
    fill: "black",
    stroke: "white",
    mass: 0,
  });

  const balls = [];
  for (let i = 0; i < ballsCount; i++) {
    const color = `hsl(${((i / ballsCount) * 180 + 250) % 360}, 70%, 50%)`;

    const ball = new Ball({
      radius: 1,
      fill: color,
      path: color,
      pos: preset.canvas.center.add(translation),
      mass: 0.00001,
      vel: velocity.rotate(i * angleDiff - (angleDiff * ballsCount) / 2),
      path: color,
      displayPath: true,
      pathLength: 50,
    });

    const attraction1 = new Attraction({
      entity1: hole1,
      entity2: ball,
      strength: gravityStrength,
      inverseStrength: 0.05,
      maxRadius: distanceMax,
      minRadius: distanceMin,
      inverseRadius: 50,
    });
    const attraction2 = new Attraction({
      entity1: hole2,
      entity2: ball,
      strength: gravityStrength,
      inverseStrength: 0.05,
      maxRadius: distanceMax,
      minRadius: distanceMin,
      inverseRadius: 50,
    });

    balls.push(ball);
    preset.addInteractions(attraction1, attraction2);
  }

  // for (let i = 1; i < balls.length; i++) {
  //   console.log(balls, i - 1, i);
  //   const attraction = new Attraction({
  //     entity1: balls[i - 1],
  //     entity1: balls[i],
  //     strength: 0.01,
  //     minRadius: 10000,
  //   });
  //   preset.addInteractions(attraction);
  // }

  preset.addObjects("balls", ...balls);
  preset.addObjects("balls", hole1, hole2);
};

const nBodyChaosTheory = new Preset({
  name: "n body chaos theory",
  initializer,
  options: {
    stepsPerFrame: 1,
    ODESolverMethod: "euler",
    collisions: {
      ballToBall: false,
    },
  },
});

export default nBodyChaosTheory;
