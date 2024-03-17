import Fractal from "../classes/Fractal";
import Preset from "../classes/Preset";
import Vector from "../classes/Vector";
import Ball from "../classes/objects/Ball";
import Point from "../classes/objects/Point";
import Spring from "../classes/objects/Spring";
import Wall from "../classes/objects/Wall";

const initializer = (preset) => {
  // preset.canvas.setMode("lucid");

  const point = new Point({
    pos: preset.canvas.center,
    controls: true,
    friction: 0.01,
    movingMagnitude: 20,
    mass: 1,
  });

  const ball1 = new Ball({
    radius: 10,
    pos: preset.canvas.center.add(new Vector(0, -100)),
    color: "transparent",
    strokeColor: "white",
    mass: 2,
    accs: { gravity: new Vector(0, -0.6) },
  });
  const ball2 = new Ball({
    radius: 10,
    pos: preset.canvas.center.add(new Vector(0, 100)),
    color: "transparent",
    strokeColor: "white",
    mass: 2,
    accs: { gravity: new Vector(0, -0.6) },
  });
  const ball3 = new Ball({
    radius: 10,
    pos: preset.canvas.center.add(new Vector(100, 0)),
    color: "transparent",
    strokeColor: "white",
    mass: 2,
    accs: { gravity: new Vector(0, -0.6) },
  });
  const ball4 = new Ball({
    radius: 10,
    pos: preset.canvas.center.add(new Vector(-100, 0)),
    color: "transparent",
    strokeColor: "white",
    mass: 2,
    accs: { gravity: new Vector(0, -0.6) },
  });

  const spring1 = new Spring({
    start: point,
    end: ball1,
    length: 100,
    stiffness: 1,
    damping: 0.9,
  });
  const spring2 = new Spring({
    start: point,
    end: ball2,
    length: 100,
    stiffness: 1,
    damping: 0.9,
  });
  const spring3 = new Spring({
    start: point,
    end: ball3,
    length: 100,
    stiffness: 1,
    damping: 0.9,
  });
  const spring4 = new Spring({
    start: point,
    end: ball4,
    length: 100,
    stiffness: 1,
    damping: 0.9,
  });

  preset.addObjects("points", point);
  preset.addObjects("balls", ball1, ball2, ball3, ball4);
  preset.addObjects("balls", spring1, spring2, spring3, spring4);

  // preset.canvas.focusOn(ball1);
};

const testing = new Preset({
  name: "testing",
  initializer,
  options: {
    displayFPS: true,
  },
});

export default testing;
