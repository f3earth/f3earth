/* created by Alex 2016/7/29 */
import { Observable } from '../util/observable';
import { Geom } from './geom';

export class Feature extends Observable {
    constructor(geom, attr, fid) {
        super();
        this._fid = fid;
        this._geom = geom;
        this._attr = attr;
    }

    get fid() {
        return this._fid;
    }

    get geom() {
        return this._geom;
    }

    setGeom(geom) {
        if (geom instanceof Geom) {
            this._geom = geom;
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
