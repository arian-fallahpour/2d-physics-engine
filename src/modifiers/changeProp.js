const changeProp = (entity, change = (entity, data) => {}) => {
  return (data) => {
    change(entity, data);
  };
};

export default changeProp;
