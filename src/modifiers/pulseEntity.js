const defaultValue = {
  property: "color",
  value: "red",
  duration: 0.25,
};

const pulseEntity = (entity, ...pulses) => {
  if (!pulses.length) pulses = defaultValue;

  return (data) => {
    pulses.forEach((t) => {
      entity.pulse(t.property, t.value, t.duration * 60);
    });
  };
};

export default pulseEntity;
