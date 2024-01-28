import canvas from "./Canvas";
import Vector from "./Vector";

import options from "../data/options";
import engine from "../data/engine";
import Entity from "./Entity";

const fps = 60;

class Ball extends Entity {
  _moving = {
    acc: new Vector(0, 0),
    up: false,
    down: false,
    right: false,
    left: false,
  };
  _tail = [];
  _imageInstance;

  constructor({
    radius = 25,
    tailLength = 0,
    image,
    controls = false,
    ...otherArgs
  }) {
    super(otherArgs);

    // Vectors

    // Scalars
    this.radius = radius;
    this.tailLength = tailLength;

    // Other Info
    this.image = image;

    // Settings
    this.controls = controls;

    if (this.controls) {
      this.controlMovement();
    }

    if (this.image) {
      this.loadImage();
      this.color = "transparent";
    }

    // InitialState
    this.setInitial();
  }

  showTail() {
    const tailSegment = {
      pos: this.pos,
      color: this.color,
      radius: this.radius,
      borderColor: this.borderColor,
    };

    // Build tail
    if (this._tail.length < this.tailLength || this.tailLength === -1) {
      this._tail.push(tailSegment);
    } else {
      this._tail.splice(0, 1);
      this._tail.push(tailSegment);
    }

    // Render tail
    this._tail.forEach((tailSegment) => {
      this.drawCircle(tailSegment);
    });
  }

  // DRAW FUNCTIONS
  draw() {
    // Leave trail behind
    if (this.tailLength !== 0) {
      this.showTail();
    }

    // Draw circle
    this.drawCircle({
      pos: this.pos,
      radius: this.radius,
      color: this._colors.fill,
      borderColor: this._colors.border,
    });

    // Draw image if exists
    if (this.image) {
      this.drawImage();
    }

    // Reposition ball
    this.reposition();

    // Draw movement vectors
    if (this.displayVectors) {
      this.drawVectors();
    }

    // Draw ball information
    if (this.displayInfo.length) {
      this.drawInfo();
    }
  }

  drawCircle({ pos, radius, color, borderColor }) {
    canvas.ctx.beginPath();
    canvas.ctx.arc(pos.x, canvas.toCanvasY(pos.y), radius, 0, 2 * Math.PI);
    canvas.ctx.fillStyle = color;
    canvas.ctx.strokeStyle = borderColor;
    canvas.ctx.fill();
    canvas.ctx.stroke();
  }

  drawVectors() {
    this.vel
      .unit()
      .multiply(2 * this.radius)
      .draw(this.pos.x, this.pos.y, "blue");
    this.acc.unit().multiply(this.radius).draw(this.pos.x, this.pos.y, "red");
  }

  loadImage() {
    this._imageInstance = new Image();
    this._imageInstance.src = this.image;
    this._imageInstance.onload = () => this.drawImage(true);
  }

  drawImage(onLoad = false) {
    canvas.ctx.save();

    const x =
      this.pos.x + (onLoad ? -this.vel.x / options.requestFrameCount : 0);
    const y =
      this.pos.y + (onLoad ? -this.vel.y / options.requestFrameCount : 0);

    canvas.ctx.beginPath();
    canvas.ctx.arc(
      x,
      canvas.toCanvasY(y),
      this.radius - (this.borderColor === "transparent" ? 0 : 1 / 2),
      0,
      Math.PI * 2,
      false
    );
    canvas.ctx.clip();
    canvas.ctx.drawImage(
      this._imageInstance,
      x - this.radius,
      canvas.toCanvasY(y + this.radius),
      this.radius * 2,
      this.radius * 2
    );
    canvas.ctx.closePath();

    canvas.ctx.restore();
  }

  /** Draws properties provided in argument */
  drawInfo() {
    const fontSize = 15;
    const lineHeight = 15;

    const props = [];

    // Refactor data
    this.displayInfo.forEach((prop) => {
      let name = prop;
      let value = this[prop];

      // Get magnitude if a vector
      if (value instanceof Vector) {
        value = value.magnitude();
      }

      // Round all numbers to 2 decimals
      if (typeof value === "number") {
        value = value.toFixed(2);
        name = name[0];
      }

      // Do not show name tag if propery is name
      if (name === "name") {
        name = undefined;
      }

      props.push({ name, value });
    });

    // Draw centered text
    props.forEach((info, i) => {
      const value = info.value;
      const text = `${info.name ? `${info.name}: ` : ""}${value}`;

      canvas.ctx.font = `${fontSize}px Georgia`;
      canvas.ctx.fillStyle = this.textColor;
      canvas.ctx.textBaseline = "middle";
      canvas.ctx.textAlign = "center";
      canvas.ctx.fillText(
        text,
        this.pos.x - this.vel.x,
        canvas.toCanvasY(
          this.pos.y -
            this.vel.y +
            ((props.length - 1) * lineHeight) / 2 -
            i * lineHeight
        )
      );
    });
  }

  // POSITION FUNCTIONS
  reposition() {
    this.acc = this.appliedAcc.add(this._moving.acc);
    this.vel = this.vel
      .add(this.acc.divide(options.requestFrameCount))
      .multiply(1 - this.friction);
    this.pos = this.pos.add(this.vel.divide(options.requestFrameCount));
  }

  controlMovement() {
    const events = ["keydown", "keyup"];

    const magnitude = 0.4;
    const direction = new Vector(0, 0);

    events.forEach((event) => {
      window.addEventListener(event, (e) => {
        if (e.key === "w") {
          this._moving.up = e.type === "keydown" ? true : false;
        }
        if (e.key === "s") {
          this._moving.down = e.type === "keydown" ? true : false;
        }
        if (e.key === "d") {
          this._moving.right = e.type === "keydown" ? true : false;
        }
        if (e.key === "a") {
          this._moving.left = e.type === "keydown" ? true : false;
        }

        if (this._moving.up) {
          direction.y = 1;
        }
        if (this._moving.down) {
          direction.y = -1;
        }
        if (this._moving.right) {
          direction.x = 1;
        }
        if (this._moving.left) {
          direction.x = -1;
        }

        if (!this._moving.up && !this._moving.down) {
          direction.y = 0;
        }

        if (!this._moving.right && !this._moving.left) {
          direction.x = 0;
        }

        this._moving.acc = direction.unit().multiply(magnitude);
      });
    });
  }

  // BALL PENETRATIONS
  isPenetratingBall(ball) {
    return this.radius + ball.radius >= ball.pos.subtract(this.pos).magnitude();
  }

  resolveBallPenetration(ball) {
    // Distance between center of the balls
    const distance = this.pos.subtract(ball.pos);

    // Depth of penetration
    let penetrationDepth = this.radius + ball.radius - distance.magnitude();

    // Fixes balls getting stuck if on exact same axis
    if (this.pos.x === ball.pos.x || this.pos.y === ball.pos.y) {
      penetrationDepth += 1;
    }

    // Penetration Resolution
    const penetrationResolution = distance
      .unit()
      .multiply(penetrationDepth / (this.inverseMass + ball.inverseMass));

    // Apply resolution onto the balls
    this.pos = this.pos.add(penetrationResolution.multiply(this.inverseMass));
    ball.pos = ball.pos.add(penetrationResolution.multiply(-ball.inverseMass));
  }

  resolveBallCollision(ball) {
    // Unit normal vetor of collision tangent
    const normal = this.pos.subtract(ball.pos).unit();

    // Relative of ball 2 to ball 1
    const relativeVelocity = this.vel.subtract(ball.vel);

    // Relative velocity along unit normal
    const separatingVelocity = relativeVelocity.dot(normal);
    let newSeparatingVelocity =
      -separatingVelocity * Math.min(this.elasticity, ball.elasticity);

    // Calculate impulse
    const separatingVelocityDifference =
      newSeparatingVelocity - separatingVelocity;
    const impulse =
      separatingVelocityDifference / (this.inverseMass + ball.inverseMass);
    const impulseVector = normal.multiply(impulse);

    // Apply collision respond to balls
    this.vel = this.vel.add(impulseVector.multiply(this.inverseMass));
    ball.vel = ball.vel.add(impulseVector.multiply(-ball.inverseMass));
  }

  // WALL PENETRATIONS
  closestPointToWall(wall) {
    // Case 1: If ball is closer to start of wall
    const ballToWallStart = wall.start.subtract(this.pos);
    if (wall.unit().dot(ballToWallStart) < 0) {
      return wall.start;
    }

    // Case 2: If ball is closer to end of wall
    const ballToWallEnd = wall.end.subtract(this.pos);
    if (wall.unit().dot(ballToWallEnd) > 0) {
      return wall.end;
    }

    // Case 3: If ball is closer to path of wall
    const closestDistance = wall.unit().dot(ballToWallStart);
    const closestDistanceVector = wall.unit().multiply(closestDistance);
    return wall.start.subtract(closestDistanceVector);
  }

  isPenetratingWall(wall) {
    const ballToClosestPoint = this.closestPointToWall(wall).subtract(this.pos);

    return ballToClosestPoint.magnitude() <= this.radius;
  }

  resolveWallPenetration(wall) {
    const penetrationVector = this.closestPointToWall(wall).subtract(this.pos);

    let penetrationDepth = this.radius - penetrationVector.magnitude();
    penetrationDepth += (fps / 1000) * this.vel.magnitude();

    const penetrationResolution = penetrationVector
      .unit()
      .multiply(penetrationDepth);

    this.pos = this.pos.subtract(penetrationResolution);
  }

  resolveWallCollision(wall) {
    const normal = this.pos.subtract(this.closestPointToWall(wall)).unit();

    const separatingVelocity = this.vel.dot(normal);
    const newSeparatingVelocity = -separatingVelocity * wall.elasticity;

    const separatingVelocityDifference =
      newSeparatingVelocity - separatingVelocity;

    this.vel = this.vel.add(normal.multiply(separatingVelocityDifference));
  }

  // CIRCLE PENETRATIONS
  closestPointToCircle(circle) {
    const circleToBall = this.pos.subtract(circle.pos);
    const closestPoint = circleToBall
      .unit()
      .multiply(circle.radius)
      .add(circle.pos);

    return closestPoint;
  }

  isPenetratingCircle(circle) {
    const ballToClosestPoint = this.closestPointToCircle(circle).subtract(
      this.pos
    );

    // Case 1: Ball is at center of circle
    if (!ballToClosestPoint.magnitude()) {
      return false;
    }

    // Case 2: Anywhere other than center of circle
    return ballToClosestPoint.magnitude() <= this.radius;
  }

  resolveCirclePenetration(circle) {
    const penetrationVector = this.closestPointToCircle(circle).subtract(
      this.pos
    );

    let penetrationDepth = this.radius - penetrationVector.magnitude();
    penetrationDepth += (fps / 1000) * this.vel.magnitude();

    // Conserves energy if penetrationDepth occurs at an "awkward" frame
    // if (penetrationDepth < 0.001) {
    //   penetrationDepth += this.vel.magnitude();
    // }

    const penetrationResolution = penetrationVector
      .unit()
      .multiply(penetrationDepth / (this.inverseMass + circle.inverseMass));

    this.pos = this.pos.subtract(
      penetrationResolution.multiply(this.inverseMass)
    );
    circle.pos = circle.pos.add(
      penetrationResolution.multiply(circle.inverseMass)
    );
  }

  resolveCircleCollision(circle) {
    const normal = this.pos.subtract(this.closestPointToCircle(circle)).unit();

    const separatingVelocity = this.vel.dot(normal);
    const newSeparatingVelocity = -separatingVelocity * circle.elasticity;

    const separatingVelocityDifference =
      newSeparatingVelocity - separatingVelocity;
    const impulse =
      separatingVelocityDifference / (this.inverseMass + circle.inverseMass);
    const impulseVector = normal.multiply(impulse);

    // this.vel = this.vel.add(normal.multiply(separatingVelocityDifference));

    // Apply collision respond to balls
    this.vel = this.vel.add(impulseVector.multiply(this.inverseMass));
    circle.vel = circle.vel.add(impulseVector.multiply(-circle.inverseMass));
  }
}

// const closestPoint = wall.start.subtract(closestDistanceVector);
// const closestPointVector = closestPoint.subtract(this.pos);

export default Ball;
