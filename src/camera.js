import glMatrix from 'gl-matrix';

import { Const } from './const';
import { FMath } from './util/math';
import { Sphere } from './util/sphere';

export class Camera {
    constructor() {
        this._eyePos = {
            lat: 0,
            lng: 0
        };
        this._tilt = 0;

        this._fov = 45;
        this._aspect = 1;
        this._distance = 2 * Const.EARTH_RADIUS;
        this._altitude = this._distance;

        this._calcProjectionMatrix();
        this._calcModelViewMatrix();
    }

    _calcProjectionMatrix() {
        this._near = this._altitude * 0.01;
        const distToCenterOfEarth = this._altitude + Const.EARTH_RADIUS;
        const tangentalDist = Math.sqrt(
            distToCenterOfEarth * distToCenterOfEarth - Const.EARTH_RADIUS * Const.EARTH_RADIUS);
        this._far = tangentalDist;

        this._projectionMatrix = glMatrix.mat4.create();
        this._projectionMatrix = glMatrix.mat4.perspective(
            this._projectionMatrix,
            FMath.toRadians(this._fov),
            this._aspect,
            this._near, this._far);
    }

    _calcModelViewMatrix() {
        this._modelViewMatrix = glMatrix.mat4.create();
        glMatrix.mat4.identity(this._modelViewMatrix);

        const sphere = new Sphere(Const.EARTH_RADIUS + this._altitude);
        const cartesianPos = sphere.getXYZ(this._eyePos.lng, this._eyePos.lat);

        // TODO: change to real target pos
        const earthSphere = new Sphere(Const.EARTH_RADIUS);
        const targetPos = earthSphere.getXYZ(this._eyePos.lng, this._eyePos.lat);

        glMatrix.mat4.lookAt(this._modelViewMatrix, cartesianPos, targetPos, [0, 0, 1]);
    }

    get projectionMatrix() {
        return this._projectionMatrix;
    }

    get modelViewMatrix() {
        return this._modelViewMatrix;
    }

    get eyeLatitude() {
        return this._eyePos.lat;
    }

    setEyeLatitude(degree) {
        let validDegree = degree;
        if (degree < -90) {
            validDegree = -90;
        } else if (degree > 90) {
            validDegree = 90;
        }
        this._eyePos.lat = validDegree;
        this._calcModelViewMatrix();
        return this;
    }

    get eyeLongitude() {
        return this._eyePos.lng;
    }

    setEyeLongitude(degree) {
        this._eyePos.lng = degree;
        this._calcModelViewMatrix();
        return this;
    }

    get center() {
        return this._center;
    }

    setCenter(center) {
        this._center = center;
        this._calcModelViewMatrix();
        return this;
    }

    _calcTilt(altitude, distance) {
        const edgeA = Const.EARTH_RADIUS + altitude;
        const edgeB = distance;
        const edgeC = Const.EARTH_RADIUS;
        this._tilt = Math.acos(
            (edgeA * edgeA + edgeB * edgeB - edgeC * edgeC) / (2 * edgeA * edgeB));
        return this;
    }

    get fov() {
        return this._fov;
    }

    get aspect() {
        return this._aspect;
    }

    set aspect(aspect) {
        this._aspect = aspect;
        this._calcProjectionMatrix();
        return this;
    }

    get near() {
        return this._near;
    }

    get far() {
        return this._far;
    }

    zoomByPercent(percent) {
        if (percent > 0) {
            this.distance = this._distance / (1.0 + percent);
        } else {
            this.distance = this._distance * (1.0 - percent);
        }
        return this;
    }

    set distance(distance) {
        this._distance = distance;
        this._calcAltitude(this._distance, this._tilt);
        this._calcModelViewMatrix();
    }

    _calcAltitude(distance, tilt) {
        const dfromeq = Math.sqrt(Const.EARTH_RADIUS * Const.EARTH_RADIUS + distance * distance -
            2 * Const.EARTH_RADIUS * distance * Math.cos(Math.PI - tilt));
        this._altitude = dfromeq - Const.EARTH_RADIUS;
    }

    getGLCoordinate(lng, lat) {
        const sphere = new Sphere(Const.EARTH_RADIUS);
        const position = sphere.getXYZ(lng, lat);
        const vec4Position = glMatrix.vec4.fromValues(position[0], position[1], position[2], 1.0);

        const result = glMatrix.vec4.create();
        glMatrix.vec4.transformMat4(result, vec4Position, this._modelViewMatrix);
        glMatrix.vec4.transformMat4(result, result, this._projectionMatrix);

        return {
            x: result[0] / result[3],
            y: result[1] / result[3]
        };
    }

    setTarget(lng, lat) {
        this._eyePos.lng = lng;
        this._eyePos.lat = lat;
        this._calcModelViewMatrix();
        return this;
    }

}
