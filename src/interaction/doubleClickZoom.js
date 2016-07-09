export class DoubleClickZoom {
  constructor(earth, callback){
    this._earth = earth;
    this._bindMouseEventListeners(callback);
  }
  
  _bindMouseEventListeners(callback) {
    let self = this;
    this._earth.context.canvas.ondblclick = function (e) {
      let zoomDelta = 1;
      if (e.shiftKey) {
        zoomDelta = -1;
      }
      let zoom = self._earth.zoom + zoomDelta;
      
      self._earth.setZoom(zoom);
    };
  }
  
}