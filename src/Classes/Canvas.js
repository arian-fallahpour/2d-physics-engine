import engine from "../data/engine";
import options from "../data/options";

class Canvas {
  constructor({ backgroundColor = "black", mode = "normal" }) {
    this.element = document.getElementById("canvas");
    this.ctx = this.element.getContext("2d");
    this.backgroundColor = backgroundColor;
    this.mode = mode;

    const dpr = window.devicePixelRatio;

    // Set Dimensions
    this.element.width = window.innerWidth * dpr;
    this.element.height = window.innerHeight * dpr;
    this.ctx.scale(dpr, dpr);

    this.fillCanvas(backgroundColor);
  }

  toCanvasY(y) {
    return this.element.clientHeight - y;
  }

  fillCanvas(color = this.backgroundColor) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      0,
      0,
      this.element.clientWidth,
      this.element.clientHeight
    );
  }

  clear() {
    const modes = {
      normal: "rgba(0,0,0,1)",
      lucid: `rgba(0,0,0,${
        engine.frame % options.requestFrameCount === 0 ? 0.1 : 0
      })`,
      trail: "rgba(0,0,0,0)",
    };

    this.fillCanvas(modes[this.mode]);
  }
}

const canvas = new Canvas({});

export default canvas;
