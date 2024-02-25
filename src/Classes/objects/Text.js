import { state } from "../../model";
import Entity from "./Entity";

class Text extends Entity {
  constructor({
    content = "",
    centered = true,
    fontFamily = "Monospace",
    fontSize = 20,
    color = "white",
    ...otherArgs
  }) {
    otherArgs.color = color;

    super(otherArgs);

    this.content = content;
    this.centered = centered;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;

    // InitialState
    this.setInitial();
  }

  draw() {
    const { canvas } = state.preset;

    canvas.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    canvas.ctx.fillStyle = this.getColor("fill");

    if (this.centered) {
      canvas.ctx.textBaseline = "middle";
      canvas.ctx.textAlign = "center";
    }

    canvas.ctx.fillText(this.content, this.pos.x, canvas.toCanvasY(this.pos.y));
  }
}

export default Text;
