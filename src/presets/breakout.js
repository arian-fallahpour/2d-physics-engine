import Preset from "../classes/Preset";
import Vector from "../classes/Vector";
import Wall from "../classes/objects/Wall";

const initializer = (preset) => {
  const columns = 10;
  const rows = 10;
  const padding = 5;
  const gap = padding;

  // 1. Create bounds
  const { clientWidth, clientHeight } = preset.canvas.element;
  const boundsHeight = preset.canvas.element.clientHeight;
  const boundsWidth = preset.canvas.element.clientHeight * (9 / 16);
  const startX = clientWidth / 2 - boundsWidth / 2;
  const startY = clientHeight / 2 - boundsHeight / 2;
  const endX = clientWidth / 2 + boundsWidth / 2;
  const endY = clientHeight / 2 + boundsHeight / 2;
  const edges = [
    new Vector(startX, startY),
    new Vector(startX, endY),
    new Vector(endX, endY),
    new Vector(endX, startY),
  ];
  for (let i = 0; i <= 3; i++) {
    const bound = new Wall({
      start: edges[i],
      end: edges[(i + 1) % edges.length],
      color: "white",
    });
    preset.addObjects("walls", bound);
  }

  // Create bricks
  const wallThickness = 10;
  const wallLength =
    (boundsWidth - 2 * padding - (columns - 1) * gap) / columns;
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      const wall = new Wall({
        start: new Vector(
          startX + padding + i * gap + i * wallLength,
          endY - padding - j * wallThickness - (j + 1) * gap
        ),
        end: new Vector(
          startX + padding + i * gap + (i + 1) * wallLength,
          endY - padding - j * wallThickness - (j + 1) * gap
        ),
        thickness: wallThickness,
      });
      preset.addObjects("walls", wall);
    }
  }
};

const breakout = new Preset({
  name: "breakout",
  initializer,
});

export default breakout;
