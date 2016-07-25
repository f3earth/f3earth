import { Const } from '../const';
import { Sphere } from '../util/sphere';
export class CircleMesh {
    constructor(options) {
        this._points = [];
        this._circleCenter = options.center;
        this._steps = Const.CIRCLE_BY_STEPS;
        this._pi2 = Math.PI * 2;
        this._vertices = [];
        this._radius = Const.EARTH_RADIUS + 100;
        this._circleRadius = options.radius;
        this._createMesh();
    }

    _createMesh() {
        const sphere = new Sphere(this._radius);
        for (let i = 0; i <= this._steps; i++) {
            this._points.push(sphere.offset(this._circleCenter,
                this._circleRadius, this._pi2 * i / this._steps));
        }
        this._points.forEach(point => {
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
