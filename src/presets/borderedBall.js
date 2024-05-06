import Preset from "../classes/Preset";
import Vector from "../classes/Vector";
import Ball from "../classes/shapes/entities/Ball";
import Wall from "../classes/shapes/Wall";

const initializer = (preset) => {
  // Create walls
  const boundsWidth = preset.canvas.element.clientWidth;
  const boundsHeight = preset.canvas.element.clientHeight;
  const edges = [
    preset.canvas.center.add(new Vector(-boundsWidth / 2, -boundsHeight / 2)),
    preset.canvas.center.add(new Vector(-boundsWidth / 2, +boundsHeight / 2)),
    preset.canvas.center.add(new Vector(+boundsWidth / 2, +boundsHeight / 2)),
    preset.canvas.center.add(new Vector(+boundsWidth / 2, -boundsHeight / 2)),
  ];
  const bounds = [];
  for (let i = 0; i <= 3; i++) {
    bounds.push(
      new Wall({
        start: edges[i],
        end: edges[(i + 1) % edges.length],
        fill: "white",
        elasticity: 1,
      })
    );
  }
  preset.addObjects("walls", ...bounds);

  const ball1 = new Ball({
    pos: preset.canvas.center,
    fill: "red",
    controls: true,
    mass: 0,
    friction: 0.1,
  });

  preset.canvas.focusOn(ball1);

  const ballsCount = 1000;
  const balls = [];
  for (let i = 0; i < ballsCount; i++) {
    balls.push(
      new Ball({
        pos: preset.canvas.center.add(
          new Vector(300 * Math.random() - 150, 300 * Math.random() - 150)
        ),
        color: "blue",
        radius: 5,
        elasticity: 1,
      })
    );
  }

  preset.addObjects("balls", ball1, ...balls);
};

const borderedBall = new Preset({
  name: "bordered ball",
  initializer,
  options: {
    stepsPerFrame: 2,
  },
});

export default borderedBall;
