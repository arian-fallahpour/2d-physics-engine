const fps = 60;

// PENETRATION DETECTION
export const isBallBallPenetrating = (ball1, ball2) => {
  const radiusSum = ball1.radius + ball2.radius;
  const distance = ball2.pos.subtract(ball1.pos);
  return radiusSum >= distance.magnitude();
};

export const isBallWallPenetrating = (ball, wall) => {
  const closestPoint = wall.closestPointTo(ball.pos);
  const distance = closestPoint.subtract(ball.pos);

  return ball.radius + (wall.thickness - 1) / 2 >= distance.magnitude();
};

export const isBallCirclePenetrating = (ball, circle) => {
  const closestPoint = circle.closestPointTo(ball.pos);
  const distance = closestPoint.subtract(ball.pos);

  // Case 1: Ball is at center of circle
  if (distance.magnitude() === 0) {
    return false;
  }

  // Case 2: Anywhere other than center of circle
  return ball.radius + circle.thickness / 2 >= distance.magnitude();
};

export const isCircleCirclePenetrating = (circle1, circle2) => {
  const smallerCircle = circle1.radius < circle2.radius ? circle1 : circle2;
  const largerCircle = circle1.radius > circle2.radius ? circle1 : circle2;

  const closestPoint = largerCircle.closestPointTo(smallerCircle.pos);
  const distance = closestPoint.subtract(smallerCircle.pos);

  // Case 1: Ball is at center of circle
  if (distance.magnitude() === 0) {
    return false;
  }

  // Case 2: Anywhere other than center of circle
  return smallerCircle.radius >= distance.magnitude();
};

// PENETRATION RESOLUTION
export const resolveBallBallPenetration = (ball1, ball2) => {
  const radiusSum = ball1.radius + ball2.radius;
  const distance = ball1.pos.subtract(ball2.pos);

  // Depth of penetration
  let penetrationDepth = radiusSum - distance.magnitude();

  // Fixes balls getting stuck if on positions on x or y axis are the same
  if (ball1.pos.x === ball2.pos.x || ball1.pos.y === ball2.pos.y) {
    penetrationDepth += 1;
  }

  // Penetration Resolution
  const penetrationResolution = distance
    .unit()
    .multiply(penetrationDepth / (ball1.inverseMass + ball2.inverseMass));

  // Apply resolution onto the balls in opposite directions and relative to their masses
  ball1.pos = ball1.pos.add(penetrationResolution.multiply(ball1.inverseMass));
  ball2.pos = ball2.pos.add(penetrationResolution.multiply(-ball2.inverseMass));
};

export const resolveBallWallPenetration = (ball, wall) => {
  const closestPoint = wall.closestPointTo(ball.pos);
  const distance = closestPoint.subtract(ball.pos);
  const normal = distance.unit();

  let penetrationDepth =
    ball.radius + (wall.thickness - 1) / 2 - distance.magnitude();

  // Account for collisions that occur between frames
  // penetrationDepth += (fps / 1000) * ball.vel.magnitude();

  const resolution = normal.multiply(penetrationDepth);

  ball.pos = ball.pos.subtract(resolution);
};

export const resolveBallCirclePenetration = (ball, circle) => {
  const closestPoint = circle.closestPointTo(ball.pos);
  const distance = closestPoint.subtract(ball.pos);

  let penetrationDepth =
    ball.radius + circle.thickness / 2 - distance.magnitude();

  // Account for collisions that occur between frames
  penetrationDepth += (fps / 1000) * ball.vel.magnitude();

  const resolution = distance
    .unit()
    .multiply(penetrationDepth / (ball.inverseMass + circle.inverseMass));

  ball.pos = ball.pos.subtract(resolution.multiply(ball.inverseMass));
  circle.pos = circle.pos.add(resolution.multiply(circle.inverseMass));
};

export const resolveCircleCirclePenetration = (circle1, circle2) => {
  const smallerCircle = circle1.radius < circle2.radius ? circle1 : circle2;
  const largerCircle = circle1.radius > circle2.radius ? circle1 : circle2;

  const closestPoint = largerCircle.closestPointTo(smallerCircle.pos);
  const distance = closestPoint.subtract(smallerCircle.pos);

  let penetrationDepth = smallerCircle.radius - distance.magnitude();

  // Account for collisions that occur between frames
  penetrationDepth += (fps / 1000) * smallerCircle.vel.magnitude();

  const resolution = distance
    .unit()
    .multiply(
      penetrationDepth / (smallerCircle.inverseMass + largerCircle.inverseMass)
    );

  smallerCircle.pos = smallerCircle.pos.subtract(
    resolution.multiply(smallerCircle.inverseMass)
  );
  largerCircle.pos = largerCircle.pos.add(
    resolution.multiply(largerCircle.inverseMass)
  );
};

// COLLISION RESOLUTION
export const resolveBallBallCollision = (ball1, ball2) => {
  const distance = ball1.pos.subtract(ball2.pos);
  const normal = distance.unit(); // Unit normal vector of collision tangent

  // Relative velocity of ball 2 to ball 1
  const relativeVelocity = ball1.vel.subtract(ball2.vel);

  // Relative velocity along unit normal
  const separatingVelocity = relativeVelocity.dot(normal);
  let newSeparatingVelocity =
    -separatingVelocity * Math.min(ball1.elasticity, ball2.elasticity);

  // Calculate impulse
  const separatingVelocityDifference =
    newSeparatingVelocity - separatingVelocity;
  const impulse =
    separatingVelocityDifference / (ball1.inverseMass + ball2.inverseMass);
  const impulseVector = normal.multiply(impulse);

  // Apply collision respond to balls based on relative masses
  ball1.vel = ball1.vel.add(impulseVector.multiply(ball1.inverseMass));
  ball2.vel = ball2.vel.add(impulseVector.multiply(-ball2.inverseMass));
};

export const resolveBallWallCollision = (ball, wall) => {
  const closestPoint = wall.closestPointTo(ball.pos);
  const distance = closestPoint.subtract(ball.pos);
  const normal = distance.unit();

  const separatingVelocity = ball.vel.dot(normal);
  const newSeparatingVelocity = -separatingVelocity * wall.elasticity;

  const separatingVelocityDifference =
    newSeparatingVelocity - separatingVelocity;

  ball.vel = ball.vel.add(normal.multiply(separatingVelocityDifference));
};

export const resolveBallCircleCollision = (ball, circle) => {
  const closestPoint = circle.closestPointTo(ball.pos);
  const distance = closestPoint.subtract(ball.pos);
  const normal = distance.unit();

  // Relative of circle to ball
  const relativeVelocity = ball.vel.subtract(circle.vel);

  const separatingVelocity = relativeVelocity.dot(normal);
  const newSeparatingVelocity = -separatingVelocity * circle.elasticity;
  const separatingVelocityDifference =
    newSeparatingVelocity - separatingVelocity;
  const impulse =
    separatingVelocityDifference / (ball.inverseMass + circle.inverseMass);
  const impulseVector = normal.multiply(impulse);

  // Apply collision respond to balls
  ball.vel = ball.vel.add(impulseVector.multiply(ball.inverseMass));
  circle.vel = circle.vel.add(impulseVector.multiply(-circle.inverseMass));
};

export const resolveCircleCircleCollision = (circle1, circle2) => {
  const smallerCircle = circle1.radius < circle2.radius ? circle1 : circle2;
  const largerCircle = circle1.radius > circle2.radius ? circle1 : circle2;

  const closestPoint = largerCircle.closestPointTo(smallerCircle.pos);
  const distance = closestPoint.subtract(smallerCircle.pos);
  const normal = distance.unit();

  // Relative of circle to ball
  const relativeVelocity = smallerCircle.vel.subtract(largerCircle.vel);

  const separatingVelocity = relativeVelocity.dot(normal);
  const newSeparatingVelocity = -separatingVelocity * largerCircle.elasticity;
  const separatingVelocityDifference =
    newSeparatingVelocity - separatingVelocity;
  const impulse =
    separatingVelocityDifference /
    (smallerCircle.inverseMass + largerCircle.inverseMass);
  const impulseVector = normal.multiply(impulse);

  // Apply collision respond to balls
  smallerCircle.vel = smallerCircle.vel.add(
    impulseVector.multiply(smallerCircle.inverseMass)
  );
  largerCircle.vel = largerCircle.vel.add(
    impulseVector.multiply(-largerCircle.inverseMass)
  );
};
