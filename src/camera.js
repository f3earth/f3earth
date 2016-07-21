import glMatrix from 'gl-matrix';

import { Const } from './const';

export class Camera {
    constructor() {
        this._eye = [0, 0, 3 * Const.EARTH_RADIUS];
        this._center = [0, 0, 0];
        this._up = [0, 1, 0];

        this._rotateX = 0;
        this._rotateY = 0;
        this._rotateZ = 0;
    }

    get rotateX() {
        return this._rotateX;
    }

    set rotateX(radian) {
        let validRadian = radian;
        if (radian < -Math.PI / 2) {
            validRadian = -Math.PI / 2;
        } else if (radian > Math.PI / 2) {
            validRadian = Math.PI / 2;
        }
        this._rotateX = validRadian;
    }

    get rotateY() {
        return this._rotateY;
    }

    set rotateY(radian) {
        this._rotateY = radian;
    }

    get rotateZ() {
        return this._rotateZ;
    }

    set rotateZ(radian) {
        this._rotateZ = radian;
    }

    get center() {
        return this._center;
    }

    get eye() {
        const eye = glMatrix.vec3.create();
        glMatrix.vec3.rotateX(eye, this._eye, [0, 0, 0], this._rotateX);
        glMatrix.vec3.rotateY(eye, eye, [0, 0, 0], this._rotateY);
        return eye;
    }

    set eye(eye) {
        this._eye = eye;
    }

    get up() {
        return this._up;
    }
}
