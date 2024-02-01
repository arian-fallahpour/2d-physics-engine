import canvas from "../classes/Canvas";

import Preset from "../classes/Preset";
import Vector from "../classes/Vector";
import Ball from "../classes/objects/Ball";
import Wall from "../classes/objects/Wall";

const borderedBall = new Preset("bordered ball");

borderedBall.init((preset) => {
  // Create walls
  const boundsHeight = canvas.element.clientHeight;
  const boundsWidth = canvas.element.clientHeight * (9 / 16);
  const edges = [
    new Vector(
      canvas.element.clientWidth / 2 - boundsWidth / 2,
      canvas.element.clientHeight / 2 - boundsHeight / 2
    ),
    new Vector(
      canvas.element.clientWidth / 2 - boundsWidth / 2,
      canvas.element.clientHeight / 2 + boundsHeight / 2
    ),
    new Vector(
      canvas.element.clientWidth / 2 + boundsWidth / 2,
      canvas.element.clientHeight / 2 + boundsHeight / 2
    ),
    new Vector(
      canvas.element.clientWidth / 2 + boundsWidth / 2,
      canvas.element.clientHeight / 2 - boundsHeight / 2
    ),
  ];
  const bounds = [];
  for (let i = 0; i <= 3; i++) {
    bounds.push(
      new Wall({
        start: edges[i],
        end: edges[(i + 1) % edges.length],
        color: "white",
        elasticity: 0,
      })
    );
  }
  preset.addObjects("walls", ...bounds);

  const ball1 = new Ball({
    pos: new Vector(
      canvas.element.clientWidth / 2 - 50,
      canvas.element.clientHeight / 2
    ),
    color: "red",
    controls: true,
    mass: 100,
  });

  const ballsCount = 10;
  const balls = [];
  for (let i = 0; i < ballsCount; i++) {
    balls.push(
      new Ball({
        pos: new Vector(
          canvas.element.clientWidth / 2 + Math.random() * 50,
          canvas.element.clientHeight / 2 + Math.random() * 50
        ),
        color: "blue",
        appliedAcc: new Vector(0, -0.2),
      })
    );
  }

  preset.addObjects("balls", ball1, ...balls);
});

export default borderedBall;
