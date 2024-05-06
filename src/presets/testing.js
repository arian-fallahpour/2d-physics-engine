import Preset from "../classes/Preset";
import Vector from "../classes/Vector";
import Ball from "../classes/shapes/entities/Ball";
import Point from "../classes/shapes/entities/Point";
import Circle from "../classes/shapes/entities/Circle";

const initializer = (preset) => {
  const ball1 = new Ball({
    pos: preset.canvas.center.add(new Vector(-100, 0)),
  });
  const ball2 = new Circle({
    pos: preset.canvas.center.add(new Vector(100, 0)),
    controls: true,
    radius: ball1.radius,
    thickness: 10,
  });

  preset.addObjects("balls", ball1);
  preset.addObjects("circles", ball2);
};

const testing = new Preset({
  name: "testing",
  initializer,
  options: {
    stepsPerFrame: 4,
    ODESolverMethod: "rk4",
  },
});

export default testing;
