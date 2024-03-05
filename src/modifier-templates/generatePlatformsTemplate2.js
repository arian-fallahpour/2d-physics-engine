import Modifier from "../classes/Modifier";
import Vector from "../classes/Vector";
import Wall from "../classes/objects/Wall";
import engine from "../data/engine";
import options from "../data/options";
import playSoundTemplate from "./playSound";

import * as model from "../model";
import playToneTemplate from "./playTone";

const cps = 60 * options.requestFrameCount; // Steps per second

/**
 * NOTES
 * - This algorithm is much more efficient at generating
 * - It produces more visually pleasing bounces and platform placements
 *
 * PROBLEMS:
 * - Fix ball hitting edge of wall after a long note
 *
 * TODO:
 * - Maybe add faulty platforms, but may not even be needed
 */

const generatePlatforms2Template = ({
  midi,
  track = 0,
  notesStart = 0,
  notesCount = 50,
  maxBounceVel = 5,
  firstTime = 1,
  wallThickness = 5,
}) => {
  // Remove duplicate notes and limit number of notes
  const notes = getNotes();

  // Wall/ball data
  const positions = [];
  const velocities = [];
  const peaks = [];
  const wallsData = [];

  let note = 0;
  let generated = false;

  // Faulty note data
  let checkpoint = 0;
  let retries = 0;
  let faultyNote = null;

  return (preset) => {
    // Do not generate if generation is done
    if (generated) return;

    const { balls, walls } = preset.objects;
    const ball = balls[0];

    const timePassed = (engine.frame - checkpoint) / cps; // Time that has passed out of the song so far
    const timeNote = firstTime + notes[note].time; // Time that next note plays
    const prevPlaced = wallsData[note - 1]?.placed;

    // Add peak after normal or fast below platforms only
    const firstDip = !peaks[note - 1] && ball.vel.y < 0;
    if (note > 0 && firstDip) {
      peaks[note - 1] = ball.pos;
    }

    // Lengthen last platform if placed below until it hits a another wall
    const beforePeakAbove = prevPlaced === "below" && !peaks[note - 1];
    if (beforePeakAbove) {
      walls[note - 1].end = new Vector(ball.pos.x + 1, walls[note - 1].end.y);
      wallsData[note - 1].end = ball.pos.x + 1;
    }

    // Lengthen last platform if placed above until it hits a peak
    const beforePeakBelow = prevPlaced === "above" && !positions[note + 1];
    if (beforePeakBelow) {
      walls[note - 1].end = new Vector(ball.pos.x + 1, walls[note - 1].end.y);
      wallsData[note - 1].end = ball.pos.x + 1;
    }

    const noteShouldPlay = timePassed >= timeNote;
    if (noteShouldPlay) {
      // Determine if ball is rising or falling
      const isRising = ball.vel.y >= 0;
      const isFalling = ball.vel.y < 0;

      // If faulty
      if (isTooClose(ball, isFalling)) {
        retries += 1;
        faultyNote = note;
        note = Math.max(note - 1, 0); // Go back a note
        checkpoint = engine.frame - getTotalDuration() * cps;

        positions.splice(note, 1);
        velocities.splice(note, 1);
        peaks.splice(note, 1);
        wallsData.splice(note, 1);
        walls.splice(note, 1);

        ball.setPos(note > 0 ? positions[note - 1] : ball.initial.pos);
        ball.setVel(note > 0 ? velocities[note - 1] : ball.initial.vel);
      }

      // If not, or no longer faulty
      else {
        const noLongerFaulty = note === faultyNote;
        if (noLongerFaulty) {
          retries = 0;
          faultyNote = null;
        }

        // Add ball's position and velocity
        positions.push(ball.pos);
        velocities.push(ball.vel);

        // Prepare wall data
        const data = {
          end: ball.pos.x + 1,
          noteName: notes[note].name,
          thickness: wallThickness,
          note: notes[note],
        };

        // Determine elasticity to limit bounce velocity
        if (Math.abs(ball.vel.y) > maxBounceVel) {
          data.elasticity = maxBounceVel / Math.abs(ball.vel.y) + 0.1 * retries;
        } else {
          data.elasticity = 1 + 0.1 * retries;
        }
        const shift = ball.radius + (data.thickness - 1) / 2 + 0.00025;

        // If ball is rising, place platform above
        if (isRising) {
          peaks[note - 1] = ball.pos; // Add peak

          data.placed = "above";
          data.y = ball.pos.y + shift;
          data.start = note === 0 ? ball.initial.pos.x : positions[note - 1].x;
        }

        // If ball is falling, place platform below
        else if (isFalling) {
          data.placed = "below";
          data.y = ball.pos.y - shift;
          data.start =
            note === 0 ? ball.initial.pos.x : peaks[peaks.length - 1].x;
        }

        // Push wall data, and add wall to canvas
        wallsData.push(data);
        addWall(preset, data);

        // Go to next note
        note += 1;
      }
    }

    const generationComplete = note === notes.length;
    if (generationComplete) {
      generated = true;
      model.pause();

      // Output data
      const data = { ballInitial: ball.initial, positions, peaks, wallsData };
      console.log("GENERATION COMPLETE: ", data);

      // Lengthen final platform
      walls[note - 1].end = new Vector(ball.pos.x + 1, walls[note - 1].end.y);
      wallsData[note - 1].end = ball.pos.x + 1;

      // Set ball's position to start
      ball.setPos(ball.initial.pos);
      ball.setVel(ball.initial.vel);
    }
  };

  function getNotes() {
    return midi.tracks[track].notes
      .filter((note, i, arr) => i === 0 || note.time !== arr[i - 1].time)
      .map((note, i, arr) => ({
        ...note,
        time: note.time - arr[notesStart].time,
      }))
      .slice(notesStart, notesStart + notesCount);
  }

  function isTooClose(ball, isFalling) {
    if (note > 0) {
      const minWallSep = 2 * ball.radius + wallThickness;
      const prevWall = wallsData[wallsData.length - 1];

      const diffPlaced =
        (prevWall.placed === "above" && isFalling) ||
        (prevWall.placed === "below" && !isFalling);
      const tooClose = Math.abs(ball.pos.y - prevWall.y) < minWallSep;

      return diffPlaced && tooClose;
    }

    return false;
  }

  function getTotalDuration() {
    return firstTime + notes[note - 1].time;
  }

  function addWall(preset, data) {
    const wall = new Wall({
      start: new Vector(data.start, data.y),
      end: new Vector(data.end, data.y),
      elasticity: data.elasticity,
      thickness: data.thickness,
      edges: "round",
    });

    wall.addModifier(new Modifier().use(playToneTemplate, notes[note]));

    preset.addObjects("walls", wall);
  }
};

export default generatePlatforms2Template;
