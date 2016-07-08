import {
  SourceLayer
}
from './sources/sourceLayer';

class Earth {
  constructor(containerId) {
    // create canvas element
    this._container = document.getElementById(containerId);
    this.createCanvas();
    this.createView();

    this._sourceLayers = [];
    this.addLayer({
      type: 'tile',
      url: ''
    });
    this.render();
  }

  createCanvas() {
    this._canvas = document.createElement('canvas');
    this._container.appendChild(this._canvas);
    this.adjustCanvasSize();
    this._prevMouseX = null;
    this._prevMouseY = null;
    let self = this;
    self.deltaX = 0;
    self.deltaY = 0;

    self.isPress = false;
    self.pressX = 0;
    self.pressY = 0;

    this._canvas.onmousedown = function (e) {
      self.isPress = true;
      self.pressX = e.clientX;
      self.pressY = e.clientY;
      self._prevMouseX = self.pressX;
      self._prevMouseY = self.pressY;
    };

    this._canvas.onmouseup = function (e) {
      self.isPress = false;
    };

    this._canvas.onmousemove = function (e) {
      if (self.isPress) {
        self.deltaX = self.deltaX + e.clientX - self._prevMouseX;
        self.deltaY = self.deltaY + e.clientY - self._prevMouseY;
        if (self._sourceLayers) {
          self._sourceLayers.forEach(function (layer) {
            layer.rotate(self.deltaY, self.deltaX);
          });
        }
        self._prevMouseX = e.clientX;
        self._prevMouseY = e.clientY;
      }
    }
  }

  adjustCanvasSize() {
    this._canvas.width = this._container.offsetWidth;
    this._canvas.height = this._container.offsetHeight;
  }

  addLayer(layer) {
    let sourceLayer = SourceLayer.from(layer);
    this._sourceLayers.push(sourceLayer);
  }

  createView() {
    this._view = null;
  }

  render() {
    // create context
    this._glContext = this.createGLContext();
    let self = this;
    this._sourceLayers.forEach(function (layer) {
      layer.render(self._glContext);
    });
  }

  createGLContext() {

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
      alert("Failed to create WebGL context!");
    }
    return context;
  }
}

export {
  Earth
};