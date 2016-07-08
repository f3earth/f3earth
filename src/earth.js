import {
  SourceLayer
}
from './source/sourceLayer';
import { Context } from './context';
import {DragPan} from './interaction/dragPan';

class Earth {
  constructor(containerId) {
    this._container = document.getElementById(containerId);
    this._context = new Context(this._container);

    this._sourceLayers = [];
    this.addLayer({
      type: 'tile',
      url: ''
    });
    this.render();
    
    new DragPan(this, function(deltaX, deltaY){
      if (this._sourceLayers) {
          this._sourceLayers.forEach(function (layer) {
            layer.rotate(deltaY, deltaX);
          });
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
      layer.render(this.context.gl);
    }.bind(this));
  }
}

export {
  Earth
};