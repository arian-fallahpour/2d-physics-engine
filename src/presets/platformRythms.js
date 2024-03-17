import Modifier from "../classes/Modifier";
import Preset from "../classes/Preset";
import Vector from "../classes/Vector";
import Ball from "../classes/objects/Ball";
import Wall from "../classes/objects/Wall";

import generateRythm from "../modifiers/generateRythm";
import generateRythm2 from "../modifiers/generateRythm2";
import transitionEntityTemplate from "../modifiers/transitionEntity";
import removeEntity from "../modifiers/removeEntity";
import playToneTemplate from "../modifiers/playTone";

import furEliseGen from "../songs/generations/furElise.json";
import badPiggiesGen from "../songs/generations/badPiggies.json";
import tadcGen from "../songs/generations/TADC.json";
import tetrisGen from "../songs/generations/tetris.json";
import keroseneGen from "../songs/generations/kerosene.json";
import megalovaniaGen from "../songs/generations/megalovania.json";
import arabianNightsGen from "../songs/generations/arabianNights.json";

import tadcMIDI from "../songs/midis/TADC.json";
import megalovaniaMIDI from "../songs/midis/megalovania.json";
import keroseneMIDI from "../songs/midis/kerosene.json";
import arabianNightsMIDI from "../songs/midis/arabianNights.json";
import tetrisMIDI from "../songs/midis/tetris.json";
import blindingLightsMIDI from "../songs/midis/blindingLights.json";

const initializer = (preset) => {
  // NOTE: IF BUGS OUT, PENETRATION RESOLUTION TRICK MAY BE REASON WHY
  const generated = keroseneGen;
  const isGenerating = true;
  const options = {
    midi: keroseneMIDI,
    track: 4,
    notesStart: 0,
    notesCount: 100,
    wallThickness: 7,
    firstTime: 1,
    maxBounceVel: 7,
  };

  // If generating platforms, add modifiers
  if (isGenerating) {
    const ball = new Ball({
      radius: 15,
      pos: preset.canvas.center,
      vel: new Vector(4, 0),
      accs: { gravity: new Vector(0, -0.5) },
      color: "white",
      strokeColor: "transparent",
    });
    preset.addObjects("balls", ball);
    preset.canvas.focusOn(ball);
    const frameModifier = new Modifier({ type: "frame" }).use(
      generateRythm2,
      options
    );
    preset.addModifier(frameModifier);
  }

  // If playing a generated file
  else {
    const { ballInitial, wallsData } = generated;

    const ball = new Ball({
      ...ballInitial,
      color: "rainbow",
      tailLength: 30,
      accs: {
        gravity: new Vector(
          ballInitial.accs.gravity.x,
          ballInitial.accs.gravity.y
        ),
      },
      vel: new Vector(ballInitial.vel.x, ballInitial.vel.y),
      pos: new Vector(ballInitial.pos.x, ballInitial.pos.y),
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
        edges: "round",
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

const platformRythms = new Preset({
  name: "platform rythms",
  initializer,
});

export default platformRythms;
