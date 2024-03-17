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
import pendulums from "./presets/pendulums";

const main = () => {
  // Load presets
  model.loadPresets(
    singleBall,
    pendulums,
    breakout,
    chaosTheory,
    testing,
    platformRythms,
    circlesInCircles,
    bouncingCircles,
    digitsOfPI,
    circularBalls,
    fractalOpen,
    plinko,
    borderedBall,
    multipleBalls
  );

  console.log(model.state.presets);

  // Load current preset
  model.initPreset();

  // Handle events
  eventHandler();
};

main();

/** TODO

FIX: Collisions when ball goes in opposite direction to circle inside circle when circle is moving

*/
