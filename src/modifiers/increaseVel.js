import * as model from "../model";

const defaultFactor = (entity) => 1.05;

const increaseVel = (entity, factor = defaultFactor) => {
  return (data) => {
    entity.vel = entity.vel.multiply(factor(entity));
  };
};

export default increaseVel;
