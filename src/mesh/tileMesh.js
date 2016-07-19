// const MERCATOR_LAT_MAX = 85.051128;
// const MERCATOR_LNG_MAX = 180.0;
// const SEGMENT_COUNT = 16;

import {
    Proj
}
from '../util/proj';

const PIXELS_PER_TILE = 256;
const SEGMENT_COUNT = 16;

export class TileMesh {

    constructor(options) {
        this._zoom = options.zoom;
        this._row = options.row;
        this._col = options.col;

        this._vertices = [];
        this._uvs = [];
        this._elementIndexes = [];

        this._radius = 6378137;
        this._bound = {};
        this._createMesh();
    }

    get zoom() {
        return this._zoom;
    }

    get row() {
        return this._row;
    }

    get col() {
        return this._col;
    }

    _getMetersPerPixel(zoom) {
        return this._radius * 2.0 * Math.PI / (Math.pow(2, zoom) * PIXELS_PER_TILE);
    }

    _calcMercatorBound() {
        // get tile's topleft coordinate in mercator projection
        const metersPerPixel = this._getMetersPerPixel(this._zoom);
        const totalTilesPerEdge = Math.pow(2, this._zoom);
        const totalMeters = totalTilesPerEdge * PIXELS_PER_TILE * metersPerPixel;
        const halfMeters = totalMeters / 2;

        this._bound.N = this._row * (PIXELS_PER_TILE * metersPerPixel);
        this._bound.W = this._col * (PIXELS_PER_TILE * metersPerPixel);

        // get tile's bound
        this._bound.N = halfMeters - this._bound.N;
        this._bound.W = this._bound.W - halfMeters;
        this._bound.E = this._bound.W + (PIXELS_PER_TILE * metersPerPixel);
        this._bound.S = this._bound.N - (PIXELS_PER_TILE * metersPerPixel);
    }

    /*
     * @description get coordinate in wgs84
     * @param {Number} x mecator's x
     * @param {Number} y mecator's y
     * @param {Boolean} isFirstRow, true if the point is on the most north edge
     * @param {Boolean} isLastRow, true if the point is on the most south edge
     */
    _calcLatLng(x, y, isFirstRow, isLastRow) {
        const latLng = Proj.mercator2Wgs84(x, y);
        // we must process the most north edge and south edge,
        // because the mercator's latitude range is (-85, 85),
        // which is * smaller than earth's latitude range  (-90, 90).
        if (isFirstRow) {
            latLng.lat = 90;
        } else if (isLastRow) {
            latLng.lat = -90;
        }
        return latLng;
    }

    _createMesh() {
        this._calcMercatorBound();
        // make SEGMENT_COUNT*SEGMENT_COUNT square mesh
        const intervalMeters = Math.abs(this._bound.E - this._bound.W) / SEGMENT_COUNT;
        const maxRow = (1 << this._zoom) - 1;

        const verticeIndexes = [];
        for (let y = 0; y <= SEGMENT_COUNT; y++) {
            const verticeIndex = [];

            for (let x = 0; x <= SEGMENT_COUNT; x++) {
                const pointN = this._bound.N - y * intervalMeters;
                const pointW = this._bound.W + x * intervalMeters;
                const latLng = this._calcLatLng(pointW,
                                                pointN,
                                                this._row === 0 && y === 0,
                                                this._row === maxRow && y === SEGMENT_COUNT);

                const pointX = this._radius * Math.sin(latLng.lng * Math.PI / 180) *
                                Math.cos(latLng.lat * Math.PI / 180);
                const pointY = this._radius * Math.sin(latLng.lat * Math.PI / 180);
                const pointZ = this._radius * Math.cos(latLng.lng * Math.PI / 180) *
                                Math.cos(latLng.lat * Math.PI / 180);
                this._vertices.push(pointX, pointY, pointZ);
                verticeIndex.push(this._vertices.length / 3 - 1);

                const u = x / SEGMENT_COUNT;
                const v = y / SEGMENT_COUNT;
                this._uvs.push(u, 1 - v);
            }

            verticeIndexes.push(verticeIndex);
        }

        // make element index
        const elementIndexes = [];
        for (let y = 0; y < SEGMENT_COUNT; y++) {
            for (let x = 0; x < SEGMENT_COUNT; x++) {
                elementIndexes.push(
                    verticeIndexes[y][x + 1],
                    verticeIndexes[y][x],
                    verticeIndexes[y + 1][x]);
                elementIndexes.push(
                    verticeIndexes[y][x + 1],
                    verticeIndexes[y + 1][x],
                    verticeIndexes[y + 1][x + 1]);
            }
        }
        this._elementIndexes = elementIndexes;
    }

    setup(gl) {
        if (this.vertexIndexBuffer) {
            return;
        }

        this.vertexPosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertices),
            gl.STATIC_DRAW);
        this.VERTEX_POS_BUF_ITEM_SIZE = 3;

        this.vertexTextureCoordinateBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordinateBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._uvs),
            gl.STATIC_DRAW);
        this.VERTEX_TEX_COORD_BUF_ITEM_SIZE = 2;

        this.vertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._elementIndexes),
            gl.STATIC_DRAW);

        this.VERTEX_INDEX_BUF_ITEM_SIZE = 1;
        this.VERTEX_INDEX_BUF_NUM_ITEMS = this._elementIndexes.length;
    }

    bindPoint(gl, loc) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPosBuffer);
        gl.vertexAttribPointer(loc,
            this.VERTEX_POS_BUF_ITEM_SIZE,
            gl.FLOAT, false, 0, 0);
    }

    bindTexture(gl, loc) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordinateBuffer);
        gl.vertexAttribPointer(loc,
            this.VERTEX_TEX_COORD_BUF_ITEM_SIZE,
            gl.FLOAT, false, 0, 0);
    }

    bindIndex(gl) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
    }

    get triangleCount() {
        return this.VERTEX_INDEX_BUF_NUM_ITEMS;
    }

}
