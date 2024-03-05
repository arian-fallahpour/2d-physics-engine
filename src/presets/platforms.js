import Modifier from "../classes/Modifier";
import Preset from "../classes/Preset";
import Vector from "../classes/Vector";
import Ball from "../classes/objects/Ball";
import Wall from "../classes/objects/Wall";

import generatePlatformsTemplate from "../modifier-templates/generatePlatformsTemplate";
import generatePlatformsTemplate2 from "../modifier-templates/generatePlatformsTemplate2";
import transitionEntityTemplate from "../modifier-templates/transitionEntity";
import removeEntity from "../modifier-templates/removeEntity";
import playToneTemplate from "../modifier-templates/playTone";

import badPiggiesRythm from "../songs/rythms/badPiggies";

import furEliseGen from "../songs/generations/furElise.json";
import badPiggiesGen from "../songs/generations/badPiggies.json";
import tadcGen from "../songs/generations/TADC.json";

import tadcMIDI from "../songs/midis/TADC.json";
import blindingLightsMIDI from "../songs/midis/blindingLights.json";

const initializer = (preset) => {
  const isGenerating = false;
  const options = {
    midi: tadcMIDI,
    track: 0,
    notesStart: 0,
    notesCount: 100,
    wallThickness: 7,
    firstTime: 5,
    maxBounceVel: 5,
  };

  // If generating platforms, add modifiers
  if (isGenerating) {
    // Create ball
    const ball = new Ball({
      radius: 10,
      pos: new Vector(
        preset.canvas.element.clientWidth / 2,
        preset.canvas.element.clientHeight / 2
      ),
      vel: new Vector(4, 0), // Increase if bouncing on left edge of above platforms
      appliedAcc: new Vector(0, -0.2),
      maxVel: new Vector(10, 10),
      color: "white",
      strokeColor: "transparent",
    });

    preset.addObjects("balls", ball);
    preset.canvas.focusOn(ball);

    const frameModifier = new Modifier({ type: "frame" }).use(
      generatePlatformsTemplate2,
      options
    );
    preset.addModifier(frameModifier);
  }

  // If playing a generated file
  else {
    const { ballInitial, wallsData } = tadcGen;

    const ball = new Ball({
      ...ballInitial,
      color: "rainbow",
      tailLength: 30,
      appliedAcc: new Vector(
        ballInitial.appliedAcc.x,
        ballInitial.appliedAcc.y
      ),
      vel: new Vector(ballInitial.vel.x, ballInitial.vel.y),
      pos: new Vector(ballInitial.pos.x, ballInitial.pos.y),
      // image: "src/images/piggy.png",
    });
    preset.addObjects("balls", ball);
    preset.canvas.focusOn(ball);

    wallsData.forEach((wallData, i) => {
      const wall = new Wall({
        start: new Vector(wallData.start, wallData.y),
        end: new Vector(wallData.end, wallData.y),
        elasticity: wallData.elasticity,
        thickness: wallData.thickness,
        color: "rgba(75, 75, 75, 1)",
      });
      const transitions = [
        {
          property: "color",
          value: `hsl(${(i % 40) * (360 / 40)}, 100%, 50%)`,
          duration: 0.2,
        },
        {
          property: "shadowColor",
          value: `hsla(${(i % 40) * (360 / 40)}, 100%, 50%, .2)`,
          duration: 0.2,
        },
        {
          property: "shadowLength",
          value: 200,
          duration: 0.2,
        },
      ];
      wall.addModifier(
        new Modifier().use(transitionEntityTemplate, wall, ...transitions)
      );
      wall.addModifier(new Modifier().use(playToneTemplate, wallData.note));
      wall.addModifier(new Modifier().use(removeEntity, preset, "walls", i, 4));
      preset.addObjects("walls", wall);
    });
  }
};

const platforms = new Preset({
  name: "platforms",
  initializer,
});

export default platforms;
