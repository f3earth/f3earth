import { Const } from '../const';
export class PointMesh {
    constructor(points) {
        this._points = points;
        this._vertices = [];
        this._radius = Const.EARTH_RADIUS + 100;

        this._createMesh();
    }

    _createMesh() {
        this._points.forEach(point => {
            this._vertices.push(point[0]);
            this._vertices.push(point[1]);
        });
    }

    setup(gl) {
        if (this.vertexPosBuffer) {
            return;
        }

        this.vertexPosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertices),
            gl.STATIC_DRAW);
        this.VERTEX_POS_BUF_ITEM_SIZE = 2;
    }

    bindPoint(gl, loc) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPosBuffer);
        gl.vertexAttribPointer(loc,
            this.VERTEX_POS_BUF_ITEM_SIZE,
            gl.FLOAT, false, 0, 0);
    }

    get count() {
        return this._points.length;
    }

    get radius() {
        return this._radius;
    }

    destroy(gl) {
        gl.deleteBuffer(this.vertexPosBuffer);
    }
}
