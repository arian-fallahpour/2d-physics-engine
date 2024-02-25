import Preset from "../classes/Preset";
import Vector from "../classes/Vector";
import Ball from "../classes/objects/Ball";
import Wall from "../classes/objects/Wall";

const initializer = (preset) => {
  // Create walls
  const boundsWidth = preset.canvas.element.clientWidth;
  const boundsHeight = preset.canvas.element.clientHeight;
  const edges = [
    new Vector(
      preset.canvas.element.clientWidth / 2 - boundsWidth / 2,
      preset.canvas.element.clientHeight / 2 - boundsHeight / 2
    ),
    new Vector(
      preset.canvas.element.clientWidth / 2 - boundsWidth / 2,
      preset.canvas.element.clientHeight / 2 + boundsHeight / 2
    ),
    new Vector(
      preset.canvas.element.clientWidth / 2 + boundsWidth / 2,
      preset.canvas.element.clientHeight / 2 + boundsHeight / 2
    ),
    new Vector(
      preset.canvas.element.clientWidth / 2 + boundsWidth / 2,
      preset.canvas.element.clientHeight / 2 - boundsHeight / 2
    ),
  ];
  const bounds = [];
  for (let i = 0; i <= 3; i++) {
    bounds.push(
      new Wall({
        start: edges[i],
        end: edges[(i + 1) % edges.length],
        color: "white",
        // elasticity: 0,
      })
    );
  }
  preset.addObjects("walls", ...bounds);

  const ball1 = new Ball({
    pos: new Vector(
      preset.canvas.element.clientWidth / 2,
      preset.canvas.element.clientHeight / 2
    ),
    color: "red",
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
        pos: new Vector(
          preset.canvas.element.clientWidth / 2 + 300 * Math.random() - 150,
          preset.canvas.element.clientHeight / 2 + 300 * Math.random() - 150
        ),
        color: "blue",
        radius: 5,
        elasticity: 1,
        // friction: 0.1,
        // appliedAcc: new Vector(0, -0.2),
      })
    );
  }

  preset.addObjects("balls", ball1, ...balls);
};

const borderedBall = new Preset({
  name: "bordered ball",
  initializer,
});

export default borderedBall;
