/* created by Alex 2016/7/29 */
import { Const } from '../const';
import { Geometry } from './geometry';

export class Point extends Geometry {
    constructor(coords) {
        super(coords);
        if (coords instanceof Array) {
            this._coords = coords;
        }
        this._type = Const.GeomType.POINT;
    }

    get coords() {
        return this._coords;
    }

    /* [x,y] */
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
