import { Const } from '../const';
import { Earcut } from '../util/earCut';
import { Sphere } from '../util/sphere';
export class FillMesh {
    constructor(points) {
        this._points = points;
        this._vertices = [];
        this._radius = Const.EARTH_RADIUS + 100;

        this._createMesh();
    }
    _createMesh() {
        const sphere = new Sphere(this._radius);
        const newPoints = [];
        this._points.forEach(point => {
            newPoints.push(point[0], point[1]);
        });
        const earCut = new Earcut();
        const verticesIndex = earCut.getTriangles(newPoints);
        const lastPoints = [];
        verticesIndex.forEach(point => {
            lastPoints.push(this._points[point]);
        });
        lastPoints.forEach(point => {
            this._vertices.push(...sphere.getXYZ(point[0], point[1]));
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
        this.VERTEX_POS_BUF_ITEM_SIZE = 3;
    }

    bindPoint(gl, loc) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPosBuffer);
        gl.vertexAttribPointer(loc,
            this.VERTEX_POS_BUF_ITEM_SIZE,
            gl.FLOAT, false, 0, 0);
    }

    get count() {
        return this._vertices.length / 3;
    }
}
