import glMatrix from 'gl-matrix';

export class Camera {
  constructor(){
    this._eye = [0, 0, 3*6378137];
    this._center = [0, 0, 0];
    this._up = [0, 1, 0];
    
    this._rotateX = 0;
    this._rotateY = 0;
    this._rotateZ = 0;
  }
  
  get rotateX() {
    return this._rotateX;
  }
  
  set rotateX(radian) {
    this._rotateX = radian
  }
  
  get rotateY() {
    return this._rotateY;
  }
  
  set rotateY(radian) {
    this._rotateY = radian
  }
  
  get rotateZ() {
    return this._rotateZ;
  }
  
  set rotateZ(radian) {
    this._rotateZ = radian
  }
  
  get center() {
    return this._center;
  }
  
  get eye() {
    let eye = glMatrix.vec3.create();
    glMatrix.vec3.rotateX(eye, this._eye, [0, 0, 0], this._rotateX);
    glMatrix.vec3.rotateY(eye, eye, [0, 0, 0], this._rotateY);
    return eye;
  }
  
  set eye(eye) {
    this._eye = eye;
  }
  
  get up() {
    return this._up;
  }
}