/* created by Alex 2016/7/29 */

export class Geom {
    constructor(coords) {
        if (coords instanceof Array) {
            this._coords = coords;
        }
        this._type = null;
    }

    get coords() {
        return this._coords;
    }

    setCoords(coords) {
        if (coords instanceof Array) {
            this._coords = coords;
        } else {
            console.log('input coordinates must be Array');
        }
        return this;
    }

    get type() {
        return this._type;
    }
}
