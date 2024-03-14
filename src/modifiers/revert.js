const revert = (condition = (preset) => {}, reverter = (preset) => {}) => {
  let reverted = false;

  return (preset) => {
    const meetsCondition = condition(preset);
    if (meetsCondition && !reverted) {
      reverted = true;
      reverter(preset);
    }
  };
};

export default revert;
