import Vector from "./Vector";

class Matrix {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.data = [];

    for (let i = 0; i < this.rows; i++) {
      this.data[i] = [];

      for (let j = 0; j < this.cols; j++) {
        this.data[i][j] = 0;
      }
    }
  }

  multiplyVector(vector) {
    let result = new Vector(0, 0);
    result.x = this.data[0][0] * vector.x + this.data[0][1] * vector.y;
    result.y = this.data[1][0] * vector.x + this.data[1][1] * vector.y;
    return result;
  }
}
