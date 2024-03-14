const countCollisions = (text, setter = (collisions) => {}) => {
  let collisions = 0;
  setter(collisions);

  return (data) => {
    collisions += 1;
    text.content = setter(collisions);
  };
};

export default countCollisions;
