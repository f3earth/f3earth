import { Const } from '../const';

const SEGMENT_COUNT = 1;
const UV = [];
for (let y = 0; y <= SEGMENT_COUNT; y++) {
    for (let x = 0; x <= SEGMENT_COUNT; x++) {
        const u = x / SEGMENT_COUNT;
        const v = y / SEGMENT_COUNT;
        UV.push(u, 1 - v);
    }
}

export class ImagePointMesh {
    constructor(points) {
        this._points = points;
        this._vertices = [];
        this._radius = Const.EARTH_RADIUS + 100;

        this._createMesh();
    }

    type() {
        return 'ImagePointMesh';
    }

    _createMesh() {
        this._points.forEach(point => {
            // 1 point to 4 points
            // lefttop
            this._vertices.push(point[0]);
            this._vertices.push(point[1]);
            this._vertices.push(-1);
            // righttop
            this._vertices.push(point[0]);
            this._vertices.push(point[1]);
            this._vertices.push(1);
            // leftbottom
            this._vertices.push(point[0]);
            this._vertices.push(point[1]);
            this._vertices.push(-2);
            // rightbottom
            this._vertices.push(point[0]);
            this._vertices.push(point[1]);
            this._vertices.push(2);
        });
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
    }

    bindPoint(gl, loc, offset = 0) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPosBuffer);
        gl.vertexAttribPointer(loc,
            this.VERTEX_POS_BUF_ITEM_SIZE,
            gl.FLOAT, false, 0, offset);
    }

    bindTexture(gl, loc) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordinateBuffer);
        gl.vertexAttribPointer(loc,
            this.VERTEX_TEX_COORD_BUF_ITEM_SIZE,
            gl.FLOAT, false, 0, 0);
    }

    get triangleCount() {
        return this._vertices.length / 3;
    }

    get radius() {
        return this._radius;
    }

    destroy(gl) {
        gl.deleteBuffer(this.vertexTextureCoordinateBuffer);
        gl.deleteBuffer(this.vertexPosBuffer);
    }
}
