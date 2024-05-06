import Vector from "../classes/Vector";
import Circle from "../classes/shapes/entities/Circle";
import { state } from "../model";

const bouncingCircles = (getVel = () => {}) => {
  return (data) => {
    const circles = state.preset.objects.circles;
    const prevCircle = circles[circles.length - 1];
    const circle = circles[0];

    if (circle.radius <= prevCircle.radius) {
      circle.reset();
      circle.vel = getVel();

      // Create new circle that is "stuck" to previous one
      const newCircle = new Circle({
        ...circle.initial,
        color: "blue",
        mass: 0,
        radius: prevCircle.radius + (circle.thickness - 1) / 2,
        pos: prevCircle.pos,
        vel: new Vector(0, 0),
        accs: {},
      });

      state.preset.addObjects("circles", newCircle);
    }
  };
};

export default bouncingCircles;
