export class DragPan {
  
  constructor(earth, onDragCallback) {
    this._earth = earth;

    this._isMouseDown = false;
    this._prevMouseX = null;
    this._prevMouseY = null;
    this._bindMouseEventListeners(onDragCallback);
  }
  
  _bindMouseEventListeners(callback) {
    let self = this;
    this._earth.context.canvas.onmousedown = function (e) {
      self._isMouseDown = true;
      self._prevMouseX = e.clientX;
      self._prevMouseY = e.clientY;
    };

    this._earth.context.canvas.onmouseup = function (e) {
      self._isMouseDown = false;
    };

    this._earth.context.canvas.onmousemove = function (e) {
      if (self._isMouseDown) {
        let deltaX = e.clientX - self._prevMouseX;
        let deltaY = e.clientY - self._prevMouseY;
        
        let x = -deltaX / 10 % 360;
        let y = -deltaY / 10 % 360;
        self._earth.rotate(y * Math.PI / 180, x * Math.PI / 180);
        
        self._prevMouseX = e.clientX;
        self._prevMouseY = e.clientY;
      }
    }
    
    this._earth.context.canvas.onmouseout = function (e) {
      self._isMouseDown = false;
    }
  }

}
