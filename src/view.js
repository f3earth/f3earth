
import { Const } from './const.js';
// import { FMath } from './util/math.js';
import { Observable } from './util/observable.js';

class View extends Observable {
    constructor(glContext, camera, params) {
        super();
        this._glContext = glContext;
        this._camera = camera;

        this._resolutions = [156543.0340, 78271.5170, 39135.7585, 19567.8792, 9783.9396, 4891.9698,
         2445.9849, 1222.9925, 611.4962, 305.7481, 152.8741, 76.4370, 38.2185, 19.1093,
         9.5546, 4.7773, 2.3887, 1.1943, 0.5972, 0.2986, 0.1493, 0.0746, 0.0373, 0.0187];

        if (params) {
            const minZoom = params.minZoom ? params.minZoom : Const.MIN_ZOOM;
            const maxZoom = params.maxZoom ? params.maxZoom : Const.MAX_ZOOM;
            this._minZoom = Math.max(minZoom, Const.MIN_ZOOM);
            this._maxZoom = Math.min(maxZoom, Const.MAX_ZOOM);
        } else {
            this._minZoom = Const.MIN_ZOOM;
            this._maxZoom = Const.MAX_ZOOM;
        }
        this._resolution = this._resolutions[this._minZoom];
        this._revision = 0;
    }

    get zoom() {
        return this._getZoom(this._resolution);
    }

    _getZoom(resolution) {
        let zoom = 2;
        for (let index = 0, len = this._resolutions.length; index < len; index++) {
            if (Math.abs(this._resolutions[index] - resolution) <= 0.0001) {
                zoom = index;
                break;
            } else if (this._resolutions[index] < resolution) {
                if ((this._resolutions[index - 1] - resolution) >
                    (resolution - this._resolutions[index])) {
                    zoom = index;
                } else {
                    zoom = index - 1;
                }
                break;
            }
        }

        if (zoom >= this._resolutions.length) {
            zoom = this._resolutions.length - 1;
        }

        return zoom;
    }

    _incResolution(delta) {
        let resolution = this._resolution;
        if (this.zoom + 1 < this._resolutions.length) {
            resolution += this._resolutions[this.zoom + 1] * -delta;
        }
        // console.log(`resolution = ${this._resolution}`);
        if (resolution < this._resolutions[this._resolutions.length - 1]) {
            resolution = this._resolutions[this._resolutions.length - 1];
        } else if (resolution > this._resolutions[0]) {
            resolution = this._resolutions[0];
        }
        return resolution;
    }

    setResolution(resolution) {
        this._resolution = resolution;
        this._revision++;
    }

    incZoom(delta) {
        // let validLevel = this._view.zoom + delta;
        let resolution = this._incResolution(delta);
        let validLevel = this._getZoom(resolution);
        // let validLevel = level;
        if (validLevel > this._maxZoom) {
            validLevel = this._maxZoom;
            resolution = this.getResolution(validLevel);
        } else if (validLevel < this._minZoom) {
            validLevel = this._minZoom;
            resolution = this.getResolution(validLevel);
        }
        if (resolution !== this._resolution) {
            const oldLevel = this.zoom;
            if (validLevel !== oldLevel) {
                this.trigger(Const.EarthEventType.ZOOM_START,
                { oldLevel, newLevel: validLevel });
            }
            this.setResolution(resolution);
            this._camera.calcAltitude(this._calcViewRange());
            const thisObj = this;
            this.trigger(Const.ViewEventType.CHANGE, { afterCallback: () => {
                if (validLevel !== oldLevel) {
                    thisObj.trigger(Const.EarthEventType.ZOOM_END,
                    { oldLevel, newLevel: validLevel });
                }
            } });
        }
    }

    setZoom(level) {
        let validLevel = Math.floor(level);
        if (validLevel > this._maxZoom) {
            validLevel = this._maxZoom;
        } else if (validLevel < this._minZoom) {
            validLevel = this._minZoom;
        }
        const oldLevel = this.zoom;
        if (validLevel !== oldLevel) {
            this.trigger(Const.EarthEventType.ZOOM_START,
                { oldLevel, newLevel: validLevel });
            this.setResolution(this.getResolution(validLevel));
            this._camera.calcAltitude(this._calcViewRange());
            const thisObj = this;
            this.trigger(Const.ViewEventType.CHANGE, { afterCallback: () => {
                thisObj.trigger(Const.EarthEventType.ZOOM_END,
                { oldLevel, newLevel: validLevel });
            } });
        }
    }

    get viewRange() {
        // const viewRange = this._camera.getViewRange();
        // const degreeRange = FMath.toDegrees(viewRange);
        // console.log(` range = ${degreeRange}`);

        // using resolution to calc ranges
        const gl = this.gl;
        let lngRange = this._resolution * gl.viewportWidth * 360 /
            (2 * Math.PI * Const.EARTH_RADIUS);
        if (lngRange > 180) {
            lngRange = 180;
        }
        const latRange = this._resolution * gl.viewportHeight * 360 /
            (2 * Math.PI * Const.EARTH_RADIUS);

        const center = this._camera.target;
        // console.log(`lngRange = ${lngRange}, latRange = ${latRange}`);
        // console.log(` center = ${JSON.stringify(center)}`);

        const minLat = this._limitLat(center.lat - latRange / 2);
        const maxLat = this._limitLat(center.lat + latRange / 2);
        let minLng = this._limitLng(center.lng - lngRange / 2);
        let maxLng = this._limitLng(center.lng + lngRange / 2);

        const absCenterLat = Math.abs(center.lat);
        if (absCenterLat >= 45 && absCenterLat <= 55) {
            minLng = this._limitLng(center.lng - 1.5 * lngRange / 2);
            maxLng = this._limitLng(center.lng + 1.5 * lngRange / 2);
        } else if (absCenterLat >= 55 && absCenterLat <= 70) {
            minLng = this._limitLng(center.lng - 1.75 * lngRange / 2);
            maxLng = this._limitLng(center.lng + 1.75 * lngRange / 2);
        } else if (absCenterLat >= 70) {
            minLng = this._limitLng(center.lng - 2 * lngRange / 2);
            maxLng = this._limitLng(center.lng + 2 * lngRange / 2);
        }

        if (Math.abs(maxLat - 85.5) <= 0.0001 || Math.abs(minLat + 85.5) <= 0.0001) {
            minLng = -180;
            maxLng = 180;
        }

        const ranges = {
            minLat,
            maxLat,
            minLng,
            maxLng
        };
        // console.log(` ranges = ${JSON.stringify(ranges)}`);
        return ranges;
    }

    _calcViewRange() {
        const resolution = this._resolution;
        const gl = this.gl;
        const minWidth = gl.viewportHeight > gl.viewportWidth
            ? gl.viewportWidth : gl.viewportHeight;
        const mercatorRange = minWidth * resolution;
        return mercatorRange * 2 * Math.PI / (2 * Math.PI * Const.EARTH_RADIUS);
    }

    panByDelta(longitude, latitude) {
        if (latitude) {
            this._camera.setEyeLatitude(this._camera.eyeLatitude +
                latitude * 2 * this.getResolution(this.zoom) * 360 /
                    (Math.PI * Const.EARTH_RADIUS));
        }

        if (longitude) {
            this._camera.setEyeLongitude(this._camera.eyeLongitude +
                longitude * 2 * this.getResolution(this.zoom) * 360 /
                    (Math.PI * Const.EARTH_RADIUS));
        }
        this._revision++;
        this.trigger(Const.ViewEventType.CHANGE);
    }

    _limitLat(lat) {
        // const newLat = lat % 180;
        if (lat > 85.5) {
            return 85.5;
        } else if (lat < -85.5) {
            return -85.5;
        }
        return lat;
    }

    _limitLng(lng) {
        let newLng = lng % 360;
        if (newLng > 180) {
            newLng = newLng - 360;
        } else if (newLng < -180) {
            newLng = newLng + 360;
        }
        return newLng;
    }

    get camera() {
        return this._camera;
    }

    get gl() {
        return this._glContext.gl;
    }

    get resolution() {
        return this._resolution;
    }

    getResolution(zoom) {
        return this._resolutions[zoom];
    }

    get revision() {
        return this._revision;
    }
}

export {
    View
};

