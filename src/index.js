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
import platformRythms from "./presets/platformRythms";
import breakout from "./presets/breakout";
import digitsOfPI from "./presets/digitsOfPI";
import testing from "./presets/testing";
import circlesInCircles from "./presets/circlesInCircles";

const main = () => {
  // Load presets
  model.loadPresets(
    circlesInCircles,
    bouncingCircles,
    platformRythms,
    testing,
    breakout,
    digitsOfPI,
    chaosTheory,
    circularBalls,
    fractalOpen,
    singleBall,
    plinko,
    borderedBall,
    multipleBalls
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
