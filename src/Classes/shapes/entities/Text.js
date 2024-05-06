import Shape from "../Shape";
import { state } from "../../../model";

class Text extends Shape() {
  constructor({
    content = "",
    centered = true,
    fontFamily = "Monospace",
    fontSize = 20,
    fill = "white",
    pos,
    ...otherArgs
  }) {
    otherArgs.fill = fill;

    super(otherArgs);

    this.content = content;
    this.centered = centered;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.pos = pos;

    // InitialState
    this.initial = { ...this };
  }

  draw() {
    const { canvas } = state.preset;

    canvas.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    canvas.ctx.fillStyle = this._colors.fill;

    if (this.centered) {
      canvas.ctx.textBaseline = "middle";
      canvas.ctx.textAlign = "center";
    }

    canvas.ctx.fillText(this.content, this.pos.x, canvas.toCanvasY(this.pos.y));
  }

  update() {
    this.draw();
  }
}

export default Text;
