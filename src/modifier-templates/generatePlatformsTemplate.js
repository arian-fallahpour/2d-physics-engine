import Modifier from "../classes/Modifier";
import Sound from "../classes/Sound";
import Vector from "../classes/Vector";
import Wall from "../classes/objects/Wall";

import engine from "../data/engine";
import options from "../data/options";

import * as model from "../model";
import playSoundTemplate from "./playSound";

/**
 * NOTES
 * - Infinite loops can occur when the decrease/increase in elasticity physically cannot result in a steeper bounce
 *  - Possible fix: Either decrease tooFastThreshold or decrease minCollideVel
 * - minCollideVel may not be needed
 *
 * PROBLEMS
 * - Reduce chance of collision to left side of wall after long note
 * - Reduce lag caused by having a lot of platforms rendered at once
 * - Have a minimum bounce velocity so it does not just "roll" off the platform
 */

const generatePlatformsTemplate = ({
  melody,
  notesStart = 0,
  notesEnd = 20,
  convertDurations = false,
  tempo = 120,
  instrument = "piano",
  wallThickness = 5,
  firstDuration = 1, // Duration of starting position to first platform
  maxBounceVel = 5, // Maximum vel kept after bounce (try to keep >= 5 to prevent infinite loops)
  minBounceVel = 1, // Minimum vel kep after bounce
  minCollideVel = 1, // Minimum vel needed when colliding (try to keep >= 2 to prevent horizontal velocity loss)
  tooFastThreshold = 0.2, // Minimum time for interaction to be normal
}) => {
  if (!melody) {
    melody = [
      { duration: 0.4, name: "A4" },
      { duration: 0.4, name: "B4" },
      { duration: 2, name: "C4" },
      { duration: 0.2, name: "B4" },
      { duration: 0.2, name: "D4" },
      { duration: 0.2, name: "E4" },
    ];
  } else {
    melody = melody.slice(notesStart, notesEnd);
  }

  if (convertDurations) {
    melody = melody.map((note) => ({
      ...note,
      duration: note.duration * 4 * (60 / tempo),
    }));
  }

  const positions = [];
  const velocities = [];
  const peaks = [];
  const wallsData = [];
  let note = 0;
  let generated = false;
  let checkpoint = 0;
  let retries = 0;
  let faultyNote = null;

  return (preset) => {
    const { balls, walls } = preset.objects;
    const ball = balls[0];

    const cps = 60 * options.requestFrameCount; // Calculations per second
    const timePassed = (engine.frame - checkpoint) / cps; // Time passed of actual rythmn
    const timeOfNote = getNoteTime(note);
    const prevPlaced = wallsData[note - 1]?.placed;

    // Add peak after normal or fast below platforms only
    const firstDip = !peaks[note - 1] && ball.vel.y < 0;
    if (note > 0 && firstDip) {
      peaks[note - 1] = ball.pos;
    }

    // Lengthen normal or fast below until it hits a peak
    const beforePeakAbove = prevPlaced === "below" && !peaks[note - 1];
    if (beforePeakAbove && note < melody.length) {
      walls[note - 1].end = new Vector(ball.pos.x + 1, walls[note - 1].end.y);
      wallsData[note - 1].end = ball.pos.x + 1;
    }

    // Lengthen fast above until it hits a peak
    const beforePeakBelow = prevPlaced === "above" && !positions[note + 1];
    if (beforePeakBelow && note < melody.length) {
      walls[note - 1].end = new Vector(ball.pos.x + 1, walls[note - 1].end.y);
      wallsData[note - 1].end = ball.pos.x + 1;
    }

    // Check if generation is complete
    if (isGenerated(note, prevPlaced)) {
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
      // Calculate duration data
      const { prevDuration, duration, nextDuration } = getDurations(note);
      const tooFast = duration <= tooFastThreshold;
      const prevTooFast = prevDuration <= tooFastThreshold;
      const nextTooFast = nextDuration <= tooFastThreshold;

      console.log(ball.vel.y);

      // Determine if ball bounces too slow
      const tooFlatFall = ball.vel.y > -minCollideVel;
      const tooFlatRise = ball.vel.y < minCollideVel;

      // Determine type of interaction
      const interaction = getInteraction(
        tooFast,
        prevTooFast,
        nextTooFast,
        prevPlaced
      );
      console.log(interaction);

      // If platform is faulty
      if (
        (interaction.startsWith("normal") && tooFlatFall) ||
        (interaction.startsWith("below") && tooFlatFall) ||
        (interaction.startsWith("above") && tooFlatRise)
      ) {
        retries += 1;
        faultyNote = note;
        note = Math.max(note - 1, 0);
        checkpoint = engine.frame - getTotalDuration(note) * cps;

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

        // If platform is going to normal or below
        if (interaction.endsWith("normal") || interaction.endsWith("below")) {
          // If platform is placed above
          if (interaction.startsWith("above")) {
            // Add peak
            peaks[note - 1] = ball.pos;

            const elasticity =
              Math.abs(ball.vel.y) > maxBounceVel
                ? (maxBounceVel / Math.abs(ball.vel.y)) ** (retries + 1)
                : 0.75 ** retries;

            data.placed = "above";
            data.elasticity = elasticity;
            data.y = ball.pos.y + shift;
            data.start =
              note === 0 ? ball.initial.pos.x : positions[note - 1].x;
          }

          // If platform is placed below
          else {
            const elasticity =
              Math.abs(ball.vel.y) > maxBounceVel
                ? (maxBounceVel / Math.abs(ball.vel.y)) ** (retries + 1)
                : 0.75 ** retries;

            data.placed = "below";
            data.elasticity = elasticity;
            data.y = ball.pos.y - shift;
            data.start =
              note === 0 ? ball.initial.pos.x : peaks[peaks.length - 1].x;
          }
        }

        // If platform is going to above
        else if (interaction.endsWith("above")) {
          const elasticity = 1 + 0.1 * retries;

          data.placed = "below";
          data.elasticity = elasticity;
          data.y = ball.pos.y - shift;
          data.start =
            note === 0 ? ball.initial.pos.x : peaks[peaks.length - 1].x;
        }

        // Add platform dataset and canvas
        wallsData.push(data);
        addWall(preset, data);

        // Go to next note
        note += 1;
      }
    }
  };

  function addWall(preset, data) {
    const wall = new Wall({
      start: new Vector(data.start, data.y),
      end: new Vector(data.end, data.y),
      elasticity: data.elasticity,
      thickness: data.thickness,
    });

    wall.addModifier(
      new Modifier().use(playSoundTemplate, instrument, data.noteName)
    );

    preset.addObjects("walls", wall);
  }

  function isGenerated(note, prevPlaced) {
    return (
      !generated &&
      note > melody.length - 1 &&
      ((prevPlaced === "below" && note === peaks.length) ||
        (prevPlaced === "above" && note === positions.length))
    );
  }

  function getInteraction(tooFast, prevTooFast, nextTooFast, prevPlaced) {
    /**
     * All possible platform interactions
     * [current] to [next]
     *
     * Normal to Normal: !tooFast && !nextTooFast
     * Normal to fast above: !tooFast && nextTooFast
     * Normal to fast below: (does not happen)
     * Fast above to fast below: tooFast && nextTooFast && (prevTooFast && prevPlaced === "below" || !prevTooFast)
     * Fast below to fast above: tooFast && nextTooFast && prevTooFast && prevPlaced === "above"
     * Fast above to normal: tooFast && !nextTooFast && (prevTooFast && prevPlaced === "below" || !prevTooFast)
     * Fast below to normal: tooFast && !nextTooFast && prevTooFast && prevPlaced === "above"
     */

    if (!tooFast && !nextTooFast) {
      return "normal-to-normal";
    } else if (!tooFast && nextTooFast) {
      return "normal-to-above";
    } else if (
      tooFast &&
      nextTooFast &&
      ((prevTooFast && prevPlaced === "below") || !prevTooFast)
    ) {
      return "above-to-below";
    } else if (
      tooFast &&
      nextTooFast &&
      prevTooFast &&
      prevPlaced === "above"
    ) {
      return "below-to-above";
    } else if (
      tooFast &&
      !nextTooFast &&
      ((prevTooFast && prevPlaced === "below") || !prevTooFast)
    ) {
      return "above-to-normal";
    } else if (
      tooFast &&
      !nextTooFast &&
      prevTooFast &&
      prevPlaced === "above"
    ) {
      return "below-to-normal";
    }
  }

  function getNoteTime(note) {
    return (
      firstDuration + melody.slice(0, note).reduce((a, b) => a + b.duration, 0)
    );
  }

  function getDurations(note) {
    let prevDuration, duration;
    const nextDuration = melody[note].duration;
    if (note === 0) {
      duration = firstDuration;
    } else if (note > 0) {
      duration = melody[note - 1].duration;
    }
    if (note === 1) {
      prevDuration = firstDuration;
    } else if (note > 1) {
      prevDuration = melody[note - 2].duration;
    }

    return { prevDuration, duration, nextDuration };
  }

  function getTotalDuration(note) {
    return (
      (note > 0 ? firstDuration : 0) +
      melody.slice(0, Math.max(note - 1, 0)).reduce((p, c) => p + c.duration, 0)
    );
  }
};

export default generatePlatformsTemplate;
