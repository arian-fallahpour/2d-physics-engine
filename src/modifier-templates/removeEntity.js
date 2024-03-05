const removeEntity = (preset, entityType, index, delay) => {
  return (data) => {
    window.setTimeout(() => {
      delete preset.objects[entityType][index];
    }, delay * 1000);
  };
};

export default removeEntity;
