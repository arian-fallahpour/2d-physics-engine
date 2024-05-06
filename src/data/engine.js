import Ball from "../classes/shapes/entities/Ball";
import Entity from "../classes/shapes/entities/Entity";
import Melody from "../classes/Melody";
import Sound from "../classes/Sound";
import Vector from "../classes/Vector";
import Wall from "../classes/shapes/Wall";
import Fractal from "../classes/shapes/Fractal";

export default {
  frame: 0,
  framesPerSecond: 0,
  frameTime: 0,
  timeMs: 0,
};

export const classes = { Entity, Ball, Wall, Fractal, Vector, Sound, Melody };
