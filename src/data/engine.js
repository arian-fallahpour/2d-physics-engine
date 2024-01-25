import Ball from "../Classes/Ball";
import Entity from "../Classes/Entity";
import Melody from "../Classes/Melody";
import Sound from "../Classes/Sound";
import Vector from "../Classes/Vector";
import Wall from "../Classes/Wall";
import Fractal from "../Classes/Fractal";

export default {
  frame: 0,
  framesPerSecond: 0,
  frameTime: 0,
  timeMs: 0,
};

export const classes = { Entity, Ball, Wall, Fractal, Vector, Sound, Melody };
