import Vector from "../classes/Vector";
import Circle from "../classes/objects/Circle";
import * as model from "../model";

const bouncingCircles = () => {
  return (data) => {
    const circles = model.state.preset.objects.circles;
    const prevCircle = circles[circles.length - 1];
    const circle = circles[0];

    if (circle.radius <= prevCircle.radius) {
      circle.reset();

      // Create new circle that is "stuck" to previous one
      const newCircle = new Circle({
        ...circle.initial,
        color: "blue",
        mass: 0,
        radius: prevCircle.radius + (circle.thickness - 1) / 2,
        pos: prevCircle.pos,
        vel: new Vector(0, 0),
        appliedAcc: new Vector(0, 0),
      });

      model.state.preset.addObjects("circles", newCircle);
    }
  };
};

export default bouncingCircles;
