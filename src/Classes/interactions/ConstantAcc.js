import AccGenerator from "../AccGenerator";
import Vector from "../Vector";

class ConstantAcc extends AccGenerator {
  constructor(x, y) {
    super(() => new Vector(x, y));
  }
}

export default ConstantAcc;
