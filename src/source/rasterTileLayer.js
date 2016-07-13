import glMatrix from 'gl-matrix';

import {
    RasterTile
}
from './rasterTile';

const EARTH_RADIUS = 6378137;

export class RasterTileLayer {
    constructor(layerConfig) {
        this._url = layerConfig.url;
    }

    get type() {
        return 'rasterTile';
    }

    setGlProgram(program) {
        this._glProgram = program;
    }

    get glProgram() {
        return this._glProgram;
    }

    isGLReady() {
        return this._glProgram;
    }

    setRenderTiles(tiles) {
        this._renderTiles = tiles;
    }

    getRenderTiles(callback) {

        if (this._renderTiles) {
            callback(this._renderTiles);
            return;
        }

        let self = this;
        let allImagePromise = [];
        let zoom = 3;
        let count = 1 << zoom;
        for (let row = 0; row < count; row++) {
            for (let col = 0; col < count; col++) {
                let promise = new Promise(function (resolve) {
                    let image = new Image();
                    image.crossOrigin = "Anonymous";
                    image.onload = function () {
                        image.col = col;
                        image.row = row;
                        resolve(image);
                    };
                    image.src = self._url.replace('{x}', col).replace('{y}', row).replace('{z}', zoom);
                });
                allImagePromise.push(promise);
            }
        }

        let renderTiles = [];
        Promise.all(allImagePromise).then(function (images) {
            images.forEach(function (image) {
                let tile = new RasterTile(zoom, image.row, image.col, image);
                renderTiles.push(tile);
            })
            self._renderTiles = renderTiles;
            callback(self._renderTiles);
        });
    }
}