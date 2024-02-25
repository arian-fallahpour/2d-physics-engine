import Modifier from "../classes/Modifier";
import Preset from "../classes/Preset";
import Vector from "../classes/Vector";
import Ball from "../classes/objects/Ball";
import Wall from "../classes/objects/Wall";

import generatePlatformsTemplate from "../modifier-templates/generatePlatformsTemplate";
import transitionEntityTemplate from "../modifier-templates/transitionEntity";
import playSoundTemplate from "../modifier-templates/playSound";

import blindingLightsMidi from "../songs/blinding-lights/midi.json";
import blindingLightsTrack1 from "../songs/blinding-lights/track-1.json";
import blindingLightsTrack2 from "../songs/blinding-lights/track-2.json";

const initializer = (preset) => {
  const isGenerating = false;
  const track = 0;
  const instrument = "piano";
  const notesCount = 100;
  const wallThickness = 10;

  const ball = new Ball({
    radius: 10,
    pos: new Vector(
      preset.canvas.element.clientWidth / 2 - 400,
      preset.canvas.element.clientHeight / 2
    ),
    vel: new Vector(3, 0), // Increase if bouncing on left edge of above platforms
    appliedAcc: new Vector(0, -0.2),
    color: !isGenerating ? "rainbow" : "white",
    strokeColor: "transparent",
    shadowLength: 50,
    tailLength: !isGenerating ? 30 : 0,
  });

  preset.addObjects("balls", ball);
  preset.canvas.focusOn(ball);

  // If generating platforms, add modifiers
  if (isGenerating) {
    const template = generatePlatformsTemplate;
    const options = {
      midi: blindingLightsMidi,
      track,
      instrument,
      wallThickness,
      notesCount,
    };
    const frameModifier = new Modifier({ type: "frame" }).use(
      template,
      options
    );
    preset.addModifier(frameModifier);
  }

  // If playing a generated file, add walls
  else {
    let wallsData;

    if (track === 0) {
      wallsData = blindingLightsTrack1.wallsData;
    } else if (track === 1) {
      wallsData = blindingLightsTrack2.wallsData;
    }

    wallsData.forEach((wallData, i) => {
      const wall = new Wall({
        start: new Vector(wallData.start, wallData.y),
        end: new Vector(wallData.end, wallData.y),
        elasticity: wallData.elasticity,
        thickness: wallData.thickness,
        color: "rgba(75, 75, 75, 1)",
        shadowLength: 0,
      });

      wall.addModifier(
        new Modifier().use(
          transitionEntityTemplate,
          wall,
          {
            property: "color",
            value: `hsl(${(i % 10) * (360 / 10)}, 100%, 50%)`,
            duration: 0.2,
          },
          {
            property: "shadowColor",
            value: `hsla(${(i % 10) * (360 / 10)}, 100%, 50%, .2)`,
            duration: 0.2,
          },
          {
            property: "shadowLength",
            value: 300,
            duration: 0.2,
          }
        )
      );
      wall.addModifier(
        new Modifier().use(playSoundTemplate, instrument, wallData.noteName)
      );

      preset.addObjects("walls", wall);
    });
  }
};

const platforms = new Preset({
  name: "platforms",
  initializer,
});

export default platforms;
