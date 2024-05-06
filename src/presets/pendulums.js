import Preset from "../classes/Preset";
import Vector from "../classes/Vector";
import Ball from "../classes/shapes/entities/Ball";
import Point from "../classes/shapes/entities/Point";
import HardConstraint from "../classes/interactions/HardConstraint";
import Spring from "../classes/interactions/Spring(deprecated)";
import SoftConstraint from "../classes/interactions/SoftConstraint";
import AccGenerator from "../classes/AccGenerator";

const initializer = (preset) => {
  const pendulums = 1;
  const joints = 3;
  const length = 100;
  const angleDiff = 0.000005;

  const fixed = new Point({
    pos: preset.canvas.center,
    radius: 0.5,
  });
  preset.addObjects("points", fixed);

  const points = preset.objects.points;
  for (let i = 0; i < pendulums; i++) {
    const stroke = `hsl(${((i / pendulums) * 180 + 250) % 360}, 70%, 50%)`;

    for (let j = 0; j < joints; j++) {
      const point = new Ball({
        pos: preset.canvas.center.add(
          new Vector(length * (j + 1), 0).rotate(i * -angleDiff)
        ),
        accs: {
          gravity: new AccGenerator(() => new Vector(0, -0.5)),
        },
        radius: 0.5,
        fill: "transparent",
        path: "rainbow",
        displayPath: j === joints - 1,
      });

      const pendulum = new HardConstraint({
        entity1: j === 0 ? fixed : points[points.length - 1],
        entity2: point,
        length,
        stroke: i === pendulums - 1 ? "white" : stroke,
      });

      preset.addObjects("points", point);
      preset.addInteractions(pendulum);
    }
  }
};

const pendulums = new Preset({
  name: "pendulums",
  initializer,
  options: {
    ODESolverMethod: "rk4",
    stepsPerFrame: 4,
  },
  canvas: {
    // mode: "lucid",
  },
});

export default pendulums;
