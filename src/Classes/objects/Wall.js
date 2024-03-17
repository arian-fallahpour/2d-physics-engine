import { state } from "../../model";

import Entity from "./Entity";
import Vector from "../Vector";

class Wall extends Entity {
  constructor({
    start = new Vector(0, 0),
    end = new Vector(0, 0),
    elasticity = 1,
    edges = "butt",
    strokeColor = "white",
    ...otherArgs
  }) {
    otherArgs.strokeColor = strokeColor;
    super(otherArgs);

    this.start = start;
    this.end = end;
    this.elasticity = elasticity;
    this.edges = edges;

    this.setInitial();
  }

  get center() {
    return this.start.add(this.end.subtract(this.start).divide(2));
  }

  draw() {
    const canvas = state.preset.canvas;

    // Draw line
    canvas.ctx.beginPath();
    canvas.ctx.lineWidth = this.thickness;
    canvas.ctx.lineCap = this.edges;
    canvas.ctx.moveTo(this.start.x, canvas.toCanvasY(this.start.y));
    canvas.ctx.lineTo(this.end.x, canvas.toCanvasY(this.end.y));
    canvas.ctx.strokeStyle = this.getColor("fill");
    canvas.ctx.stroke();
    canvas.ctx.closePath();
  }

  drawShadow() {
    const { canvas } = state.preset;

    canvas.ctx.beginPath();
    canvas.ctx.lineWidth = 0.5;

    // Center shadow
    const shadowReach = this.end
      .subtract(this.start)
      .normal()
      .unit()
      .multiply(this.shadowLength);
    const start1 = this.start.add(shadowReach);
    const start2 = this.start.add(shadowReach.multiply(-1));
    const end1 = this.end.add(shadowReach);
    const end2 = this.end.add(shadowReach.multiply(-1));

    const gradient1 = canvas.ctx.createLinearGradient(
      start1.x,
      canvas.toCanvasY(start1.y),
      start2.x,
      canvas.toCanvasY(start2.y)
    );
    gradient1.addColorStop(0, "transparent");
    gradient1.addColorStop(0.5, this.shadowColor);
    gradient1.addColorStop(1, "transparent");

    canvas.ctx.moveTo(start1.x, canvas.toCanvasY(start1.y));
    canvas.ctx.lineTo(end1.x, canvas.toCanvasY(end1.y));
    canvas.ctx.lineTo(end2.x, canvas.toCanvasY(end2.y));
    canvas.ctx.lineTo(start2.x, canvas.toCanvasY(start2.y));

    canvas.ctx.fillStyle = gradient1;
    canvas.ctx.fill();

    canvas.ctx.closePath();

    const angle = this.end.subtract(this.start).angle();

    // Left shadow
    canvas.ctx.beginPath();

    const gradient2 = canvas.ctx.createRadialGradient(
      this.start.x,
      canvas.toCanvasY(this.start.y),
      0,
      this.start.x,
      canvas.toCanvasY(this.start.y),
      this.shadowLength
    );
    gradient2.addColorStop(0, this.shadowColor);
    gradient2.addColorStop(1, "transparent");

    canvas.ctx.arc(
      this.start.x,
      canvas.toCanvasY(this.start.y),
      this.shadowLength,
      angle - Math.PI / 2,
      angle - Math.PI / 2 - Math.PI,
      true
    );
    const final2 = this.start.add(new Vector(0, this.shadowLength));
    canvas.ctx.lineTo(final2.x, canvas.toCanvasY(final2.y));

    canvas.ctx.fillStyle = gradient2;
    canvas.ctx.fill();

    canvas.ctx.closePath();

    // Right shadow
    canvas.ctx.beginPath();

    const gradient3 = canvas.ctx.createRadialGradient(
      this.end.x,
      canvas.toCanvasY(this.end.y),
      0,
      this.end.x,
      canvas.toCanvasY(this.end.y),
      this.shadowLength
    );
    gradient3.addColorStop(0, this.shadowColor);
    gradient3.addColorStop(1, "transparent");

    canvas.ctx.arc(
      this.end.x,
      canvas.toCanvasY(this.end.y),
      this.shadowLength,
      angle - Math.PI / 2,
      angle - Math.PI / 2 + Math.PI
    );
    const final3 = this.end.add(new Vector(0, this.shadowLength));
    canvas.ctx.lineTo(final3.x, canvas.toCanvasY(final3.y));

    // canvas.ctx.fillStyle = "red";
    canvas.ctx.fillStyle = gradient3;
    canvas.ctx.fill();

    canvas.ctx.closePath();
  }

  // Unit vector from start to end of wall
  unit() {
    return this.start.subtract(this.end).unit();
  }

  closestPointTo(pos) {
    // Case 1: If ball is closer to start of wall
    const ballToWallStart = this.start.subtract(pos);
    if (this.unit().dot(ballToWallStart) < 0) {
      return this.start;
    }

    // Case 2: If ball is closer to end of wall
    const ballToWallEnd = this.end.subtract(pos);
    if (this.unit().dot(ballToWallEnd) > 0) {
      return this.end;
    }

    // Case 3: If ball is closer to path of wall
    const closestPointOnWall = this.unit().dot(ballToWallStart);
    const closestPointOnWallVector = this.unit().multiply(closestPointOnWall);
    return this.start.subtract(closestPointOnWallVector);
  }
}

export default Wall;
