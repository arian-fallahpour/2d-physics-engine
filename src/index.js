import "./style.css";

import * as model from "./model";

import eventHandler from "./controllers/eventController";

import singleBall from "./presets/singleBall";
import multipleBalls from "./presets/multipleBalls";
import borderedBall from "./presets/borderedBall";
import plinko from "./presets/plinko";
import chaosTheory from "./presets/chaosTheory";
import circularBalls from "./presets/circularBalls";
import bouncingCircles from "./presets/bouncingCircles";
import fractalOpen from "./presets/fractalOpen";
import platforms from "./presets/platforms";

const main = () => {
  // Load presets
  model.loadPresets(
    platforms,
    multipleBalls,
    singleBall,
    borderedBall,
    fractalOpen,
    circularBalls,
    plinko,
    chaosTheory,
    bouncingCircles
  );

  // Load current preset
  model.loadPreset();

  // Handle events
  eventHandler();
};

main();

/** TODO

FIX: Collisions when ball goes in opposite direction to circle inside circle when circle is moving

*/
