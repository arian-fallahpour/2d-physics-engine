import canvas from "../Canvas";
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
  }

  draw() {
    canvas.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    canvas.ctx.fillStyle = this._colors.fill;

    if (this.centered) {
      canvas.ctx.textBaseline = "middle";
      canvas.ctx.textAlign = "center";
    }

    canvas.ctx.fillText(this.content, this.pos.x, canvas.toCanvasY(this.pos.y));
  }
}

export default Text;
