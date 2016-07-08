
export class Camera {
  constructor(){
    this._eye = [0, 0, 3*6378137];
    this._center = [0, 0, 0];
    this._up = [0, 1, 0];
  }
  
  get center() {
    return this._center;
  }
  
  get eye() {
    return this._eye;
  }
  
  get up() {
    return this._up;
  }
  
  setEye(eye) {
    this._eye = eye;
  }
}