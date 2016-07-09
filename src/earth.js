import glMatrix from 'gl-matrix';
import {
  SourceLayer
}
from './source/sourceLayer';
import {
  Context
}
from './context';
import {
  DragPan
}
from './interaction/dragPan';
import {
  DoubleClickZoom
}
from './interaction/doubleClickZoom';
import {
  MouseWheelZoom
}
from './interaction/mouseWheelZoom';
import {
  Camera
}
from './camera';
import {
  LayerRenderer
}
from './renderer/layerRenderer';

const EARTH_RADIUS = 6378137;

class Earth {
  constructor(containerId) {
    this._zoomDist = [];
    for (let level = 0; level < 18; level++) {
      this._zoomDist.push(EARTH_RADIUS * Math.pow(1.05, 18 - level));
    }

    this._container = document.getElementById(containerId);
    this._context = new Context(this._container);
    this._camera = new Camera();
    this._zoom = 3;
    this._camera.setEye([0, 0, this._zoomDist[this._zoom - 1]]);

    this._sourceLayers = [];

    new DragPan(this);
    new DoubleClickZoom(this);
    new MouseWheelZoom(this);
  }

  get context() {
    return this._context;
  }

  rotateX(radian) {
    this.rotate(radian);
  }

  rotateY(radian) {
    this.rotate(undefined, radian);
  }

  rotate(xRadian, yRadian) {
    let eye = this._camera.eye;
    if (xRadian) {
      glMatrix.vec3.rotateX(eye, eye, [0, 0, 0], xRadian);
    }
    if (yRadian) {
      glMatrix.vec3.rotateY(eye, eye, [0, 0, 0], yRadian);
    }
    this._camera.setEye(eye);
    this.render();
  }

  get zoom() {
    return this._zoom;
  }

  setZoom(level) {
    level = level > 18 ? 18 : level < 1 ? 1: level; 
    if (level !== this._zoom) {
      let eye = this._camera.eye;
      glMatrix.vec3.scale(eye, eye, this._zoomDist[level - 1] / this._zoomDist[this._zoom - 1]);
      this._zoom = level;
      this._camera.setEye(eye);
      this.render();
    }
  }

  addLayer(layer) {
    let sourceLayer = SourceLayer.from(layer);
    this._sourceLayers.push(sourceLayer);
    this.render();
  }

  render() {
    this._sourceLayers.forEach(function (layer) {
      LayerRenderer.render(layer, this.context.gl, this._camera);
    }.bind(this));
  }
}

export {
  Earth
};