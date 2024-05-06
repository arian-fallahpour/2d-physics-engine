import convert from "color-convert";
import engine from "../data/engine";
import Vector from "./Vector";
import { state } from "../model";

class Canvas {
  frame = 0;
  framesPerSecond = 0;
  frameTimeSeconds = 0;

  focused;

  constructor({ backgroundColor = "black", mode = "normal" }) {
    this.element = document.getElementById("canvas");
    this.ctx = this.element.getContext("2d");
    this.mode = mode;
    this.dpr = window.devicePixelRatio;
    this.backgroundColor = backgroundColor;
    this.translation = new Vector(0, 0);
    this.scale = 1;

    // Set Dimensions
    this.element.width = window.innerWidth * this.dpr;
    this.element.height = window.innerHeight * this.dpr;

    this.ctx.scale(this.dpr, this.dpr);
    this.fillCanvas(backgroundColor);
  }

  get center() {
    return new Vector(
      this.element.clientWidth / 2,
      this.element.clientHeight / 2
    );
  }

  toCanvasY(y) {
    return this.element.clientHeight - y;
  }

  fillCanvas(color = this.backgroundColor) {
    this.ctx.fillStyle = color;

    this.ctx.fillRect(
      -this.translation.x / this.scale,
      -this.translation.y / this.scale,
      (this.element.clientWidth * this.dpr) / this.scale,
      (this.element.clientHeight * this.dpr) / this.scale
    );
  }

  resetTransform() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  updateTransform() {
    this.ctx.setTransform(
      this.scale * this.dpr,
      0,
      0,
      this.scale * this.dpr,
      this.translation.x,
      this.translation.y
    );
  }

  setTranslation(translation) {
    this.translation = translation;
    this.updateTransform();
  }

  setScale(scale) {
    if (scale === this.scale) return;

    this.translation = this.translation.add(
      this.center.multiply(this.dpr * (this.scale - scale))
    );
    this.scale = scale;
    this.updateTransform();
  }

  translate(translation) {
    this.setTranslation(this.translation.add(translation));
  }

  reset() {
    this.fillCanvas(this.backgroundColor);
    this.resetTransform();
  }

  prepare() {
    if (this.focused) {
      const translation = new Vector(
        -(this.focused.pos.x - this.element.clientWidth / 2),
        this.focused.pos.y - this.element.clientHeight / 2
      );
      this.setTranslation(translation);
    }

    const rgb = convert.keyword.rgb(this.backgroundColor);
    const modes = {
      normal: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`,
      lucid: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${
        engine.frame % state.preset.options.stepsPerFrame === 0 ? 0.1 : 0
      })`,
      trail: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0)`,
    };

    this.fillCanvas(modes[this.mode]);
  }

  focusOn(object) {
    this.focused = object;
  }
}

export default Canvas;
