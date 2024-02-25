const defaultValue = {
  property: "color",
  value: "red",
  duration: 1,
};

const transitionEntityTemplate = (entity, ...transitions) => {
  if (!transitions.length) transitions = defaultValue;
  return (data) => {
    transitions.forEach((t) => {
      entity.transition(t.property, t.value, t.duration * 60);
    });
  };
};

export default transitionEntityTemplate;
