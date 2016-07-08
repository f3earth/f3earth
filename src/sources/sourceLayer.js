import {
  RasterTileLayer
}
from './rasterTileLayer'

export class SourceLayer {
  constructor() {}

  static from(layer) {
    return new RasterTileLayer();
  }
}