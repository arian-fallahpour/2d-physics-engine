import Ball from "../classes/objects/Ball";
import Entity from "../classes/objects/Entity";
import Melody from "../classes/Melody";
import Sound from "../classes/Sound";
import Vector from "../classes/Vector";
import Wall from "../classes/objects/Wall";
import Fractal from "../classes/Fractal";

export default {
  frame: 0,
  framesPerSecond: 0,
  frameTime: 0,
  timeMs: 0,
};

export const classes = { Entity, Ball, Wall, Fractal, Vector, Sound, Melody };
