const changeProp = (entity, change = (entity) => {}) => {
  return (data) => {
    change(entity);
  };
};

export default changeProp;
