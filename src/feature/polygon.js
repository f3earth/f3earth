/* created by Alex 2016/7/29 */
import { Const } from '../const';
import { Geometry } from './geometry';

export class Polygon extends Geometry {
    constructor(coords) {
        super(coords);
        if (coords instanceof Array) {
            this._coords = coords;
        }
        this._type = Const.GeomType.POLYGON;
    }

    get coords() {
        return this._coords;
    }

    /* [[[x,y],[x,y],[x,y]]] polygon must close.*/
    setCoords(coords) {
        if (coords instanceof Array) {
            this._coords = coords;
        }
        return this;
    }

    get type() {
        return this._type;
    }
}
