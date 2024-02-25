import Modifier from "../classes/Modifier";
import Sound from "../classes/Sound";
import Vector from "../classes/Vector";
import Wall from "../classes/objects/Wall";

import engine from "../data/engine";
import options from "../data/options";
import notes from "../data/notes";

import transitionEntityTemplate from "../modifier-templates/transitionEntity";

import * as model from "../model";
import playSoundTemplate from "./playSound";

/**
 * TODO
 * - reduce chance of collision when ball falls from a large height onto a below, then to an above
 *
 */

const generatePlatformsTemplate = ({
  midi,
  track = 0,
  notesCount = 20,
  instrument = "piano",
  wallThickness = 5,
  maxBounceVel = 5, // Try to keep >= 5
  minBounceVel = 2,
}) => {
  let melody;
  if (midi) {
    melody = midi.tracks[track].notes.slice(0, notesCount);
  } else {
    melody = [
      { duration: 0.4, name: "A4" },
      { duration: 0.4, name: "B4" },
      { duration: 2, name: "C4" },
      { duration: 0.2, name: "B4" },
      { duration: 0.2, name: "D4" },
      { duration: 0.2, name: "E4" },
    ];
  }

  melody = [
    { duration: 1, name: "A3" },
    { duration: 1 / 16, name: "A3" },
    { duration: 1 / 16, name: "A3" },
    { duration: 1 / 16, name: "A3" },
    { duration: 1 / 16, name: "A3" },
    { duration: 1 / 16, name: "A3" },
    { duration: 1 / 16, name: "A3" },
    { duration: 1 / 16, name: "A3" },
    { duration: 1 / 16, name: "A5" },
    { duration: 1, name: "A3" },
    { duration: 1 / 32, name: "A3" },
    { duration: 1 / 32, name: "A3" },
    { duration: 1 / 32, name: "A3" },
    { duration: 1 / 32, name: "A3" },
    { duration: 1 / 32, name: "A3" },
    { duration: 1 / 32, name: "A3" },
    { duration: 1 / 32, name: "A3" },
    { duration: 1 / 32, name: "A5" },
  ];

  const bpm = 120;

  melody = melody.map((note) => ({
    ...note,
    duration: note.duration * 4 * (60 / bpm),
  }));

  const positions = [];
  const velocities = [];
  const peaks = [];
  const wallsData = [];

  let note = 0;
  let checkpoint = 0;
  let generated = false;
  let retries = 0;
  let faultyNote = null;

  return (preset) => {
    const { balls, walls } = preset.objects;
    const ball = balls[0];

    const cps = 60 * options.requestFrameCount; // Calculations per second
    const timePassed = (engine.frame - checkpoint) / cps;
    const timeOfNote = melody
      .slice(0, note + 1)
      .reduce((a, b) => a + b.duration, 0);
    const prevPlaced = wallsData[note - 1]?.placed;

    // Add peak after normal or fast below platforms only
    const firstDip = !peaks[note - 1] && ball.vel.y < 0;
    if (note > 0 && firstDip) {
      peaks[note - 1] = ball.pos;
    }

    // Lengthen normal or fast below until it hits a peak
    if (prevPlaced === "below" && !peaks[note - 1] && note < melody.length) {
      walls[note - 1].end = new Vector(ball.pos.x + 1, walls[note - 1].end.y);
      wallsData[note - 1].end = ball.pos.x + 1;
    }

    // Lengthen fast above until it hits a peak
    if (
      prevPlaced === "above" &&
      !positions[note + 1] &&
      note < melody.length
    ) {
      walls[note - 1].end = new Vector(ball.pos.x + 1, walls[note - 1].end.y);
      wallsData[note - 1].end = ball.pos.x + 1;
    }

    // Check if generation is complete
    if (
      !generated &&
      note > melody.length - 1 &&
      ((prevPlaced === "below" && note === peaks.length) ||
        (prevPlaced === "above" && note === positions.length))
    ) {
      const data = { positions, peaks, wallsData };

      console.log("GENERATION COMPLETE: ", data);
      model.pause();
      generated = true;

      // Lengthen final platform
      walls[note - 1].end = new Vector(ball.pos.x + 1, walls[note - 1].end.y);
      wallsData[note - 1].end = ball.pos.x + 1;

      // Set ball's position to start
      ball.setPos(ball.initial.pos);
      ball.setVel(ball.initial.vel);
    }

    // If a note should be played in this frame
    if (timePassed >= timeOfNote && note < melody.length) {
      const noteThreshold = 0.2;
      const tooFast = melody[note].duration <= noteThreshold;
      const prevTooFast = melody[note - 1]?.duration <= noteThreshold;
      const nextTooFast = melody[note + 1]?.duration <= noteThreshold;

      const tooFlatFall = ball.vel.y > -minBounceVel;
      const tooFlatRise = ball.vel.y < minBounceVel;

      // If platform is faulty
      if (
        (tooFast && prevPlaced === "below" && tooFlatRise) || // below to fast
        (tooFast && prevPlaced === "above" && tooFlatFall) || // above to fast
        (!tooFast && tooFlatFall) // below to below
      ) {
        retries += 1;
        faultyNote = note;
        note = Math.max(note - 1, 0);
        checkpoint =
          engine.frame -
          melody.slice(0, note).reduce((a, b) => a + b.duration, 0) * cps;

        positions.splice(note, 1);
        velocities.splice(note, 1);
        peaks.splice(note, 1);
        wallsData.splice(note, 1);
        walls.splice(note, 1);

        ball.setPos(note > 0 ? positions[note - 1] : ball.initial.pos);
        ball.setVel(note > 0 ? velocities[note - 1] : ball.initial.vel);
      }

      // Platform is not faulty
      else {
        const noLongerFaulty = note === faultyNote;
        if (noLongerFaulty) {
          retries = 0;
          faultyNote = null;
        }

        // Record ball's position and velocity
        positions.push(ball.pos);
        velocities.push(ball.vel);

        let data = {
          tooFast,
          prevTooFast,
          end: ball.pos.x + 1,
          noteName: melody[note].name,
          thickness: wallThickness,
        };
        const shift = ball.radius + (data.thickness - 1) / 2 + 0.00025;

        // Fast above to below
        if (tooFast && prevPlaced === "below") {
          console.log("fast above to below");

          // Add peak
          peaks[note - 1] = ball.pos;

          data = {
            ...data,
            placed: "above",
            elasticity: 0.75 ** retries,
            y: ball.pos.y + shift,
            start: note === 0 ? ball.initial.pos.x : positions[note - 1].x,
            // start:
            //   note === 0
            //     ? ball.initial.pos.x
            //     : positions[note - 1].x + ball.radius,
          };
        }

        // Fast below to fast above
        else if (tooFast && nextTooFast && prevPlaced === "above") {
          console.log("fast below to fast above");

          const elasticity =
            Math.abs(ball.vel.y) > maxBounceVel
              ? (maxBounceVel / Math.abs(ball.vel.y)) ** (retries + 1)
              : 0.75 ** retries;
          console.log(Math.abs(ball.vel.y) > maxBounceVel, elasticity);

          data = {
            ...data,
            placed: "below",
            elasticity,
            y: ball.pos.y - shift,
            start: note === 0 ? ball.initial.pos.x : peaks[peaks.length - 1].x,
          };
        }

        // Normal to fast above
        else if (nextTooFast) {
          console.log("normal going to fast above");

          const elasticity =
            Math.abs(ball.vel.y) > maxBounceVel
              ? (maxBounceVel / Math.abs(ball.vel.y)) ** (retries + 1)
              : 1 + 0.15 * retries;

          data = {
            ...data,
            placed: "below",
            elasticity,
            y: ball.pos.y - shift,
            start: note === 0 ? ball.initial.pos.x : peaks[peaks.length - 1].x,
          };
        }

        // Normal to normal
        else {
          console.log("normal going to normal");

          data = {
            ...data,
            placed: "below",
            elasticity: 0.75 ** retries,
            y: ball.pos.y - shift,
            start: note === 0 ? ball.initial.pos.x : peaks[peaks.length - 1].x,
          };
        }
        wallsData.push(data);

        // Add platform to canvas
        const wall = new Wall({
          start: new Vector(data.start, data.y),
          end: new Vector(data.end, data.y),
          elasticity: data.elasticity,
          thickness: data.thickness,
          color: "black",
        });

        // Add modifiers
        wall.addModifier(
          new Modifier().use(transitionEntityTemplate, wall, {
            property: "color",
            value: "white",
            duration: 0.5,
          })
        );
        wall.addModifier(
          new Modifier().use(playSoundTemplate, instrument, data.noteName)
        );

        // Add wall
        preset.addObjects("walls", wall);

        // Go to next note
        note += 1;
      }
    }
  };
};

export default generatePlatformsTemplate;
