import { Const } from '../const';
import { Geometry } from './geometry';

export class MultiPoint extends Geometry {
    constructor(coords) {
        super(coords);
        this._type = Const.GeomType.MULTI_POINT;
    }

    /* [[x,y],[x,y],...] */
    setCoords(coords) {
        if (coords) {
            this._coords = coords;
        }
        return this;
    }

    addCoord(coord) {
        if (coord) {
            this._coords.push(coord);
        }
        return this;
    }
}
