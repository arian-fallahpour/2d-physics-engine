import canvas from "../Classes/Canvas";

import Preset from "../Classes/Preset";
import Vector from "../Classes/Vector";
import Wall from "../Classes/Wall";

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
      })
    );
  }
  preset.addObjects("walls", ...bounds);
});

export default borderedBall;
