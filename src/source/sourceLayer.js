import {
  RasterTileLayer
}
from './rasterTileLayer'

export class SourceLayer {
  constructor() {}

  static from(layerConfig) {
    return new RasterTileLayer(layerConfig);
  }
}