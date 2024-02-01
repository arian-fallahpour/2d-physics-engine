import "./style.css";

import * as model from "./model";

import canvas from "./classes/Canvas";

import eventHandler from "./controllers/eventController";
import frameHandler from "./controllers/frameController";

import singleBall from "./presets/singleBall";
import multipleBalls from "./presets/multipleBalls";
import borderedBall from "./presets/borderedBall";
import plinko from "./presets/plinko";
import chaosTheory from "./presets/chaosTheory";
import circularBalls from "./presets/circularBalls";
import bouncingCircles from "./presets/bouncingCircles";

const main = () => {
  canvas.mode = "normal";

  // Push presets to state
  model.state.presets.push(
    bouncingCircles,
    singleBall,
    borderedBall,
    circularBalls,
    multipleBalls,
    chaosTheory,
    plinko
  );

  // Handle events
  eventHandler();

  // Call first frame
  requestAnimationFrame(frameHandler);
};

main();

/** TODO

FIX: Collisions when ball goes in opposite direction to circle inside circle when circle is moving

*/
