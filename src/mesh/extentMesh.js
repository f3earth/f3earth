import {
    Const
} from '../const';
import {
    Proj
} from '../util/proj';
import {
    Sphere
} from '../util/sphere';

const EARTH_SPHERE = new Sphere(Const.EARTH_RADIUS);
const ELEMENT_INDEXES = [];
const SEGMENT_COUNT = 32;

const UV = [];
for (let y = 0; y <= SEGMENT_COUNT; y++) {
    for (let x = 0; x <= SEGMENT_COUNT; x++) {
        const u = x / SEGMENT_COUNT;
        const v = y / SEGMENT_COUNT;
        UV.push(u, 1 - v);
    }
}

export class ExtentMesh {
    /**
     * @param {Array} extent [minX, minY, maxX, maxY]
     */
    constructor(extent) {
        this._extent = extent;
        this._bound = {};
        this._segmentCount = SEGMENT_COUNT;
        this._vertices = [];
        this._createMesh();
    }

    _calcBound() {
        // const leftTop = Proj.wgs842Mercator(this._extent[0], this._extent[3]);
        // const rightBottom = Proj.wgs842Mercator(this._extent[2], this._extent[1]);
        // this._bound.N = leftTop.y;
        // this._bound.W = leftTop.x;
        // this._bound.E = rightBottom.x;
        // this._bound.S = rightBottom.y;
        this._bound.N = this._extent[3];
        this._bound.W = this._extent[0];
        this._bound.E = this._extent[2];
        this._bound.S = this._extent[1];
    }

    _createMesh() {
        this._calcBound();
        // make SEGMENT_COUNT*SEGMENT_COUNT square mesh
        const intervalX = Math.abs(this._bound.E - this._bound.W) / this._segmentCount;
        const intervalY = Math.abs(this._bound.N - this._bound.S) / this._segmentCount;

        if (ELEMENT_INDEXES.length === 0) {
            const verticeIndexes = [];
            let count = 0;
            for (let y = 0; y <= SEGMENT_COUNT; y++) {
                const verticeIndex = [];

                for (let x = 0; x <= SEGMENT_COUNT; x++) {
                    const pointN = this._bound.N - y * intervalY;
                    const pointW = this._bound.W + x * intervalX;
                    // const latLng = this._calcLatLng(pointW, pointN);
                    // this._vertices.push(...EARTH_SPHERE.getXYZ(latLng.lng, latLng.lat));
                    this._vertices.push(...EARTH_SPHERE.getXYZ(pointW, pointN));
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
                    const pointN = this._bound.N - y * intervalY;
                    const pointW = this._bound.W + x * intervalX;
                    // const latLng = this._calcLatLng(pointW, pointN);
                    // this._vertices.push(...EARTH_SPHERE.getXYZ(latLng.lng, latLng.lat));
                    this._vertices.push(...EARTH_SPHERE.getXYZ(pointW, pointN));
                }
            }
        }
    }

    /*
     * @description get coordinate in wgs84
     * @param {Number} x mecator's x
     * @param {Number} y mecator's y
     */
    _calcLatLng(x, y) {
        const latLng = Proj.mercator2Wgs84(x, y);
        // we must process the most north edge and south edge,
        // because the mercator's latitude range is (-85, 85),
        // which is * smaller than earth's latitude range  (-90, 90).
        if (latLng.lat >= 85) {
            latLng.lat = 90;
        } else if (latLng.lat <= -85) {
            latLng.lat = -90;
        }
        return latLng;
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
}
