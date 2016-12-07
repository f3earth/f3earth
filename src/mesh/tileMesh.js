import { Const } from '../const';
import { Proj } from '../util/proj';
import { Sphere } from '../util/sphere';
const PIXELS_PER_TILE = 256;
const SEGMENT_COUNT = 32;
const EARTH_HALF_METERS = Math.PI * Const.EARTH_RADIUS;
const EARTH_SPHERE = new Sphere(Const.EARTH_RADIUS);

const EARTH_METERS_PER_PIXEL = [];
for (let zoom = 0; zoom <= Const.MAX_ZOOM; zoom++) {
    EARTH_METERS_PER_PIXEL.push(Const.EARTH_RADIUS * 2.0 * Math.PI /
        (Math.pow(2, zoom) * PIXELS_PER_TILE));
}

const UV = [];
for (let y = 0; y <= SEGMENT_COUNT; y++) {
    for (let x = 0; x <= SEGMENT_COUNT; x++) {
        const u = x / SEGMENT_COUNT;
        const v = y / SEGMENT_COUNT;
        UV.push(u, 1 - v);
    }
}

const ELEMENT_INDEXES = [];

export class TileMesh {

    constructor(options) {
        this._zoom = options.zoom;
        this._row = options.row;
        this._col = options.col;

        this._vertices = [];

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

    _calcMercatorBound() {
        // get tile's topleft coordinate in mercator projection
        const metersPerPixel = EARTH_METERS_PER_PIXEL[this._zoom];
        const metersPerTile = PIXELS_PER_TILE * metersPerPixel;
        this._bound.N = this._row * metersPerTile;
        this._bound.W = this._col * metersPerTile;

        // get tile's bound
        this._bound.N = EARTH_HALF_METERS - this._bound.N;
        this._bound.W = this._bound.W - EARTH_HALF_METERS;
        this._bound.E = this._bound.W + metersPerTile;
        this._bound.S = this._bound.N - metersPerTile;
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

        if (ELEMENT_INDEXES.length === 0) {
            const verticeIndexes = [];
            let count = 0;
            for (let y = 0; y <= SEGMENT_COUNT; y++) {
                const verticeIndex = [];

                for (let x = 0; x <= SEGMENT_COUNT; x++) {
                    const pointN = this._bound.N - y * intervalMeters;
                    const pointW = this._bound.W + x * intervalMeters;
                    const latLng = this._calcLatLng(pointW,
                                                    pointN,
                                                    this._row === 0 && y === 0,
                                                    this._row === maxRow && y === SEGMENT_COUNT);
                    this._vertices.push(...EARTH_SPHERE.getXYZ(latLng.lng, latLng.lat));
                    verticeIndex.push(count);
                    count++;
                }

                verticeIndexes.push(verticeIndex);
            }

            // make element index
            for (let y = 0; y < SEGMENT_COUNT; y++) {
                for (let x = 0; x < SEGMENT_COUNT; x++) {
                    ELEMENT_INDEXES.push(
                        verticeIndexes[y][x + 1],
                        verticeIndexes[y][x],
                        verticeIndexes[y + 1][x]);
                    ELEMENT_INDEXES.push(
                        verticeIndexes[y][x + 1],
                        verticeIndexes[y + 1][x],
                        verticeIndexes[y + 1][x + 1]);
                }
            }
        } else {
            for (let y = 0; y <= SEGMENT_COUNT; y++) {
                for (let x = 0; x <= SEGMENT_COUNT; x++) {
                    const pointN = this._bound.N - y * intervalMeters;
                    const pointW = this._bound.W + x * intervalMeters;
                    const latLng = this._calcLatLng(pointW,
                                                    pointN,
                                                    this._row === 0 && y === 0,
                                                    this._row === maxRow && y === SEGMENT_COUNT);
                    this._vertices.push(...EARTH_SPHERE.getXYZ(latLng.lng, latLng.lat));
                }
            }
        }
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
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(UV),
            gl.STATIC_DRAW);
        this.VERTEX_TEX_COORD_BUF_ITEM_SIZE = 2;

        this.vertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(ELEMENT_INDEXES),
            gl.STATIC_DRAW);

        this.VERTEX_INDEX_BUF_ITEM_SIZE = 1;
        this.VERTEX_INDEX_BUF_NUM_ITEMS = ELEMENT_INDEXES.length;
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

    destroy(gl) {
        gl.deleteBuffer(this.vertexIndexBuffer);
        gl.deleteBuffer(this.vertexTextureCoordinateBuffer);
        gl.deleteBuffer(this.vertexPosBuffer);
    }

}
