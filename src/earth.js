import glMatrix from 'gl-matrix';
import {
  SourceLayer
}
from './source/sourceLayer';
import { Context } from './context';
import { DragPan } from './interaction/dragPan';
import { Camera } from './camera';
import { LayerRenderer } from './renderer/layerRenderer';

class Earth {
  constructor(containerId) {
    this._container = document.getElementById(containerId);
    this._context = new Context(this._container);
    this._camera = new Camera();

    this._sourceLayers = [];
    this.addLayer({
      type: 'rasterTile',
      url: 'http://mt3.google.cn/vt/lyrs=s@138&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galil'
    });
    this.render();
    
    new DragPan(this, function(deltaX, deltaY){
      if (this._sourceLayers) {
        
        let eye = this._camera.eye;
        let x = deltaX % 360;
        let y = deltaY % 360;
        glMatrix.vec3.rotateX(eye, eye, [0, 0, 0], x * Math.PI / 180);
        glMatrix.vec3.rotateY(eye, eye, [0, 0, 0], y * Math.PI / 180); 
        
        this._camera.setEye(eye);
        this.render();
      }
    }.bind(this));
  }
  
  get context() {
    return this._context;
  }

  addLayer(layer) {
    let sourceLayer = SourceLayer.from(layer);
    this._sourceLayers.push(sourceLayer);
  }

  render() {
    this._sourceLayers.forEach(function (layer) {
      LayerRenderer.render(layer, this.context.gl, this._camera);
//      layer.render(this.context.gl, this._camera);
    }.bind(this));
  }
}

export {
  Earth
};