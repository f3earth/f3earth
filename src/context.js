export class Context {
  
  constructor(container){
    this._container = container;
    this._canvas = document.createElement('canvas');
    this._container.appendChild(this._canvas);
    this._canvas.width = this._container.offsetWidth;
    this._canvas.height = this._container.offsetHeight;
    this._gl = this._createWebGLContext();
  }
  
  get gl(){
    return this._gl;
  }
  
  get canvas() {
    return this._canvas;
  }
  
  _createWebGLContext() {

    let names = ["webgl", "experimental-webgl"];
    let context = null;
    for (let name of names) {
      try {
        context = this._canvas.getContext(name);
      } catch (e) {
        console.error('failed to get context: ' + e);
      }

      if (context) {
        break;
      }
    }

    if (context) {
      context.viewportWidth = this._canvas.width;
      context.viewportHeight = this._canvas.height;
    } else {
      console.error("Failed to create WebGL context!");
    }
    return context;
  }
  
}