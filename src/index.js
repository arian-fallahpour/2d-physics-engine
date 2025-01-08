import "./style.css";

import * as model from "./model";

import eventHandler from "./controllers/eventController";

import singleBall from "./presets/singleBall";
import borderedBall from "./presets/borderedBall";
import plinko from "./presets/plinko";
import chaosTheory from "./presets/chaosTheory";
import bouncingCircles from "./presets/bouncingCircles";
import platformRythms from "./presets/platformRythms";
import digitsOfPI from "./presets/digitsOfPI";
import testing from "./presets/testing";
import circlesInCircles from "./presets/circlesInCircles";
import pendulums from "./presets/pendulums";
import nBodyChaosTheory from "./presets/nBodyChaosTheory";
import fractals from "./presets/fractals";
import trappedBall from "./presets/trappedBall";

const main = () => {
  // Load presets
  model.loadPresets(
    pendulums,
    platformRythms,
    nBodyChaosTheory,
    chaosTheory,
    plinko,
    borderedBall,
    trappedBall,
    digitsOfPI,
    singleBall,
    bouncingCircles,
    circlesInCircles,
    fractals,
    testing
  );

  // Load current preset
  model.initPreset();

  // Handle events
  eventHandler();
};

main();

/** TODO

FIX: Collisions when ball goes in opposite direction to circle inside circle when circle is moving

*/
