/* created by Alex 2016/7/29 */
import { Const } from '../const';
import { Geometry } from './geometry';

export class LineString extends Geometry {
    constructor(coords) {
        super(coords);
        if (coords instanceof Array) {
            this._coords = coords;
        }
        this._type = Const.GeomType.LINE;
    }

    get coords() {
        return this._coords;
    }

    /* [[x,y],[x,y],[x,y]] custom linestring coord type, same with polygon*/
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
