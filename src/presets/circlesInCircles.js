import Modifier from "../classes/Modifier";
import Preset from "../classes/Preset";
import Vector from "../classes/Vector";
import Ball from "../classes/objects/Ball";
import Circle from "../classes/objects/Circle";
import Wall from "../classes/objects/Wall";

const initializer = (preset) => {
  const circlesCount = 13;
  const deltaTime = 2;

  // 1. Create bounds
  const bounds = [];
  const boundsHeight = preset.canvas.element.clientHeight * (2 / 3);
  const boundsWidth = boundsHeight * 1;
  const edges = [
    new Vector(
      preset.canvas.center.x - boundsWidth / 2,
      preset.canvas.center.y - boundsHeight / 2
    ),
    new Vector(
      preset.canvas.center.x - boundsWidth / 2,
      preset.canvas.center.y + boundsHeight / 2
    ),
    new Vector(
      preset.canvas.center.x + boundsWidth / 2,
      preset.canvas.center.y + boundsHeight / 2
    ),
    new Vector(
      preset.canvas.center.x + boundsWidth / 2,
      preset.canvas.center.y - boundsHeight / 2
    ),
  ];
  for (let i = 0; i <= 3; i++) {
    const bound = new Wall({
      start: edges[i],
      end: edges[(i + 1) % edges.length],
      color: "white",
      thickness: 8,
      edges: "square",
    });
    bounds.push(bound);
  }

  // 2. Add largest circle
  const circle = new Circle({
    pos: preset.canvas.center,
    radius: 200,
    vel: new Vector(0, 1)
      .rotate(Math.PI * 2 * Math.random())
      .unit()
      .multiply(8),
    thickness: 8,
    strokeColor: "transparent",
    mass: 1,
  });

  revealCircle(circle, 0, circlesCount, deltaTime);

  // 3. Add inner circles
  for (let i = 1; i < circlesCount; i++) {
    const innerCircle = new Circle({
      ...circle.initial,
      pos: circle.pos,
      radius: circle.radius - circle.thickness * 2 * i,
      color: i === circlesCount - 1 ? "white" : circle.initial.color,
    });

    if (i < circlesCount - 1) {
      revealCircle(innerCircle, i, circlesCount, deltaTime);
    }

    preset.addObjects("circles", innerCircle);
  }

  preset.addObjects("walls", ...bounds);
  preset.addObjects("circles", circle);
};

const circlesInCircles = new Preset({
  name: "circlesInCircles",
  initializer,
});

function insertCircle(circle, preset, circlesCount = 5, bounceCount = 5) {
  let bounces = 0;

  return (data) => {
    if (!data.circle && !data.wall) return;
    const circles = data.preset.objects.circles;

    if (bounces < bounceCount || circles.length > circlesCount) {
      bounces += 1;
      return;
    }

    const radius =
      circle.radius - circle.thickness * 2 * data.preset.objects.circles.length;
    if (radius <= 0) return;

    bounces = 0;
    preset.addObjects(
      "circles",
      new Circle({
        ...circle.initial,
        pos: circle.pos,
        radius,
      })
    );
  };
}

function revealCircle(circle, index, circlesCount, deltaTime = 1) {
  window.setTimeout(() => {
    circle.transition("strokeColor", "white", 1 * 60);
  }, (circlesCount - index) * deltaTime * 1000);
}

export default circlesInCircles;
