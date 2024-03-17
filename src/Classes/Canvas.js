import convert from "color-convert";
import engine from "../data/engine";
import Vector from "./Vector";
import { state } from "../model";

const dpr = window.devicePixelRatio;

class Canvas {
  focused;
  translated = new Vector(0, 0);

  constructor({ backgroundColor = "black", mode = "normal" }) {
    this.element = document.getElementById("canvas");
    this.ctx = this.element.getContext("2d");
    this.backgroundColor = backgroundColor;
    this.mode = mode;

    // Set Dimensions
    this.element.width = window.innerWidth * dpr;
    this.element.height = window.innerHeight * dpr;
    this.ctx.scale(dpr, dpr);

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
      -this.translated.x,
      -this.translated.y,
      this.element.clientWidth,
      this.element.clientHeight
    );
  }

  resetTransform() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
  }

  reset() {
    this.clear();

    this.resetTransform();
  }

  prepare() {
    if (this.focused) {
      this.resetTransform();

      const translation = new Vector(
        (this.focused.pos.x - this.element.clientWidth / 2) * -1,
        this.focused.pos.y - this.element.clientHeight / 2
      );
      this.translated = translation;

      this.ctx.translate(translation.x, translation.y);
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

  clear() {
    this.fillCanvas(this.backgroundColor);
  }

  focusOn(object) {
    this.focused = object;
  }

  setMode(mode) {
    this.mode = mode;
  }
}

export default Canvas;
