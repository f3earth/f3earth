import {
    RasterTileLayerRenderer
}
from './rasterTileLayerRenderer';

export class LayerRenderer {
    constructor() {}

    static render(layer, gl, camera) {
        if (layer.type === 'rasterTile') {
            RasterTileLayerRenderer.render(layer, gl, camera);
        }
    }
}