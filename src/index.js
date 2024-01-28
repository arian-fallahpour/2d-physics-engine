import "./style.css";

import notes from "./data/notes";

import * as model from "./model";

import canvas from "./Classes/Canvas";
import Sound from "./Classes/Sound";
import Melody from "./Classes/Melody";

import eventHandler from "./controllers/eventController";
import frameHandler from "./controllers/frameController";

import singleBall from "./presets/singleBall";
import quadrupleBalls from "./presets/quadrupleBalls";
import borderedBall from "./presets/borderedBall";
import plinko from "./presets/plinko";

const main = () => {
  canvas.mode = "normal";

  // Load sounds and melodies
  loadSounds();

  // Push presets to state
  model.state.presets.push(plinko, singleBall, borderedBall, quadrupleBalls);

  // Handle events
  eventHandler();

  // Call first frame
  requestAnimationFrame(frameHandler);
};

const loadSounds = () => {
  const memes = ["anita-max-wynn", "bruh", "mario", "pew", "siu"];
  const presidentsSprite = {
    trump: [0, 1110],
    biden: [1110, 2090],
    obama: [2090, 3140],
  };
  model.state.sounds.chords = new Sound("chords.mp3", Sound.sprite(notes, 250));
  model.state.sounds.piano = new Sound("piano.mp3", Sound.sprite(notes, 500));
  model.state.sounds.ballHit = new Sound("ball-hit.mp3");
  model.state.sounds.bossBattle = new Sound(
    "boss-battle.mp3",
    Sound.sprite(notes, 500)
  );
  model.state.sounds.memes = memes.map((name) => new Sound(name + ".mp3"));
  model.state.sounds.presidents = new Sound("presidents.mp3", presidentsSprite);
  model.state.melodies.kerosene = new Melody("kerosene", "piano");
  model.state.melodies.axelF = new Melody("axelF", "electric-piano");
  model.state.melodies.flowerSong = new Melody("flowerSong", "piano");
  model.state.melodies.blindingLights = new Melody(
    "blindingLights",
    "electric-piano"
  );
};

main();

/** TODO

FIX: Collisions when ball goes in opposite direction to circle inside circle when circle is moving

*/
