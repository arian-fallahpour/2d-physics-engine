import Preset from "../classes/Preset";
import Vector from "../classes/Vector";
import Ball from "../classes/shapes/entities/Ball";
import Attraction from "../classes/interactions/Attraction";
import { withPixelData } from "../helper";

const initializer = (preset) => {
  const ballsCount = 100;
  const gravityStrength = 5;
  const distanceMax = 100000;
  const distanceMin = 5000;
  const angleDiff = 0;
  const velocity = new Vector(3, 0).rotate(0);
  const ballRadius = 1;
  const translation = new Vector(-200, 200);

  withPixelData("/src/images/obama.jpeg", 150, 150, ballRadius / 1.5, (pixels) => {
    // 1. Create black holes
    const hole1 = new Ball({
      radius: 15,
      pos: preset.canvas.center,
      // pos: preset.canvas.center.add(new Vector(-distance / 2, 0)),
      shadowBlur: 50,
      shadow: "rgba(255,255,255,.3)",
      fill: "black",
      stroke: "white",
      mass: 0,
    });

    const circleRadius = 10;

    const balls = [];
    for (let i = 0; i < pixels.length; i++) {
      // const color = `hsl(${((i / ballsCount) * 180 + 250) % 360}, 70%, 50%)`;
      const color = pixels[i].color;

      const ball = new Ball({
        radius: 1,
        fill: color,
        path: color,
        pos: preset.canvas.center.add(translation).add(pixels[i].pos),
        mass: 0.000001,
        vel: velocity.rotate(i * angleDiff - (angleDiff * ballsCount) / 2),
        path: color,
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

      balls.push(ball);
      preset.addInteractions(attraction1);
    }

    preset.addObjects("balls", ...balls);
    preset.addObjects("balls", hole1);
  });
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
  // canvas: { mode: "lucid" },
});

export default nBodyChaosTheory;
