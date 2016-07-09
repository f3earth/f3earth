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
        this._zoomDist.push(EARTH_RADIUS * Math.pow(1.05, 18-level));
    }

    this._container = document.getElementById(containerId);
    this._context = new Context(this._container);
    this._camera = new Camera();
    this._zoom = 3;
    this._camera.setEye([0, 0, this._zoomDist[this._zoom-1]]);

    this._sourceLayers = [];
    this.addLayer({
      type: 'rasterTile',
      url: 'http://mt3.google.cn/vt/lyrs=s@138&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galil'
    });
    this.render();

    new DragPan(this);
    new DoubleClickZoom(this);
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
    if (!this._sourceLayers) {
      return;
    }
    
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
    if (level > 18) {
      level = 18;
    } else if (level < 1) {
      level = 1;
    }

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