import { Const } from '../const';
import { Earcut } from '../util/earCut';
export class PolygonMesh {
    constructor(points) {
        this._points = points;
        this._vertices = [];
        this._radius = Const.EARTH_RADIUS + 100;

        this._createMesh();
    }
    _createMesh() {
        const vertices = [];
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
            const latLng = {
                lng: point[0],
                lat: point[1]
            };
            const pointX = this._radius * Math.sin(latLng.lng * Math.PI / 180) *
                            Math.cos(latLng.lat * Math.PI / 180);
            const pointY = this._radius * Math.sin(latLng.lat * Math.PI / 180);
            const pointZ = this._radius * Math.cos(latLng.lng * Math.PI / 180) *
                            Math.cos(latLng.lat * Math.PI / 180);
            vertices.push(pointX, pointY, pointZ);
        });
        this._vertices = vertices;
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
