import Preset from "../classes/Preset";
import Vector from "../classes/Vector";
import Point from "../classes/objects/Point";
import Spring from "../classes/objects/Spring";

const initializer = (preset) => {
  const totalLength = 300;
  const joints = 10;
  const length = totalLength / joints;

  // 1. Create fixed point
  const fixed = new Point({
    pos: preset.canvas.center,
  });
  preset.addObjects("points", fixed);

  const points = preset.objects.points;
  for (let i = 1; i <= joints; i++) {
    const point = new Point({
      mass: 1,
      pos: points[points.length - 1].pos.add(new Vector(length, 0)),
      accs: { gravity: new Vector(0, -0.2) },
      radius: 0.5,
      controls: true,
      movingMagnitude: 50,
    });
    preset.addObjects("points", point);

    const joint = new Spring({
      start: points[points.length - 2],
      end: points[points.length - 1],
      length,
      stiffness: 20000,
      damping: 0.05,
    });
    preset.addObjects("springs", joint);
  }
};

const pendulums = new Preset({
  name: "pendulums",
  initializer,
  options: {
    stepsPerFrame: 100,
  },
});

export default pendulums;
