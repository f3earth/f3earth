/* created by Alex 2016/7/29 */
import { Observable } from '../util/observable';
import { Geometry } from './geometry';

export class Feature extends Observable {
    constructor(geometry, attr, fid) {
        super();
        this._fid = fid;
        this._geometry = geometry;
        this._attr = attr;
    }

    get fid() {
        return this._fid;
    }

    get geometry() {
        return this._geometry;
    }

    setGeom(geometry) {
        if (geometry instanceof Geometry) {
            this._geometry = geometry;
        }
        return this;
    }

    get attr() {
        return this._attr;
    }

    setAttr(attr) {
        if (attr instanceof Object) {
            this._attr = attr;
        }
        return this;
    }
}
