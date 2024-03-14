import canvas from "../classes/Canvas";
import Fractal from "../classes/Fractal";
import Preset from "../classes/Preset";
import Vector from "../classes/Vector";
import Ball from "../classes/objects/Ball";
import Circle from "../classes/objects/Circle";
import Text from "../classes/objects/Text";
import Wall from "../classes/objects/Wall";

const initializer = (preset) => {
  const circleRadius = 150;
  const reverter = () => fractal.angle >= Math.PI / 2 || fractal.angle <= 0;
  const centerPosition = new Vector(
    preset.canvas.element.clientWidth / 2,
    preset.canvas.element.clientHeight / 2 - 75
  );

  // Create Circles
  const circle = new Circle({
    pos: centerPosition,
    radius: circleRadius,
    strokeColor: "white",
  });
  preset.addObjects("circles", circle);

  // Create fractals
  const fractal = new Fractal({
    // layers: 5,
    layers: 7,
    baseLength: 50,
    pos: centerPosition.add(new Vector(0, circleRadius)),
  });
  preset.addObjects("fractals", fractal);

  // Create walls
  const wall1 = new Wall({
    start: centerPosition.add(new Vector(circleRadius, 0)),
    end: centerPosition
      .add(new Vector(circleRadius, 0))
      .add(new Vector(100, 0)),
  });
  const wall2 = new Wall({
    start: centerPosition.add(new Vector(-circleRadius, 0)),
    end: centerPosition
      .add(new Vector(-circleRadius, 0))
      .add(new Vector(-100, 0)),
  });
  preset.addObjects("walls", wall1, wall2);

  // Create texts
  const text1 = new Text({
    content: "-",
    centered: true,
    fontSize: 30,
    fontFamily: "arial",
    pos: centerPosition.add(new Vector(0, 50)),
  });
  const text2 = new Text({
    content: "+",
    centered: true,
    fontSize: 30,
    fontFamily: "arial",
    pos: centerPosition.add(new Vector(0, -50)),
  });
  preset.addObjects("texts", text1, text2);

  // Create balls
  const ball = new Ball({
    pos: centerPosition,
    rainbow: true,
    radius: 10,
    color: "rainbow",
    strokeColor: "white",
    appliedAcc: new Vector(0, 0.4),
    vel: new Vector(0, 1)
      .unit()
      .multiply(12)
      .rotate(Math.random() * (Math.PI / 6)),
  });
  preset.addObjects("balls", ball);
};

const fractalOpen = new Preset({
  name: "fractal open",
  initializer,
});

export default fractalOpen;
