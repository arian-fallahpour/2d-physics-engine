import "./style.css";

import notes from "./data/notes";

import * as model from "./model";

import Ball from "./Classes/Ball";
import canvas from "./Classes/Canvas";
import Vector from "./Classes/Vector";
import Wall from "./Classes/Wall";
import Sound from "./Classes/Sound";
import Circle from "./Classes/Circle";
import Melody from "./Classes/Melody";

import eventHandler from "./controllers/eventController";
import frameHandler from "./controllers/frameController";

const main = () => {
  canvas.mode = "normal";

  // Load sounds
  const memes = ["anita-max-wynn", "bruh", "mario", "pew", "siu"];
  const presidentsSprite = {
    trump: [0, 1110],
    biden: [1110, 2090],
    obama: [2090, 3140],
  };

  model.state.melodies.kerosene = new Melody("kerosene", "piano");
  model.state.melodies.flowerSong = new Melody("flowerSong", "piano");
  model.state.sounds.chords = new Sound("chords.mp3", Sound.sprite(notes, 250));
  model.state.sounds.ballHit = new Sound("ball-hit.mp3");
  model.state.sounds.memes = memes.map((name) => new Sound(name + ".mp3"));
  model.state.sounds.presidents = new Sound("presidents.mp3", presidentsSprite);

  // Create walls
  const boundsHeight = 700;
  const boundsWidth = 700;
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
    const bound = new Wall({
      start: edges[i],
      end: edges[(i + 1) % edges.length],
      color: "white",
    });
    bounds.push(bound);
  }
  // model.state.objects.walls.push(...bounds);

  const ball1 = new Ball({
    pos: new Vector(
      canvas.element.clientWidth / 2,
      canvas.element.clientHeight / 2
    ),
    rainbow: true,
    borderColor: "white",
  });
  ball1.applyAcc(new Vector(0, -0.2));
  ball1.setVel(new Vector(4, 4));

  model.state.objects.balls.push(ball1);

  // Create Circles
  const circle = new Circle({
    pos: new Vector(
      canvas.element.clientWidth / 2,
      canvas.element.clientHeight / 2
    ),
    color: "white",
    radius: 200,
  });
  model.state.objects.circles.push(circle);

  // const fractal = new Fractal({
  //   pos: new Vector(canvas.element.clientWidth / 2, 100),
  //   angle: Math.PI / 6,
  //   layers: 15,
  // });
  // model.state.objects.fractals.push(fractal);

  // Handle events
  eventHandler();

  // Call first frame
  requestAnimationFrame(frameHandler);
};

main();
