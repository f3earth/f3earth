export class MouseWheelZoom {
  constructor(earth){
    this._earth = earth;
    this._bindMouseEventListener();
  }
  
  _bindMouseEventListener() {
    let self = this;
    this._earth.context.canvas.onmousewheel = function (e) {
      let zoomDelta = -e.deltaY / 100;
      let zoom = self._earth.zoom + zoomDelta;
      self._earth.setZoom(zoom);
    };
  }
}