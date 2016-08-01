import { Observable } from '../util/observable';

export class VectorSource extends Observable {

    constructor(options) {
        super();
        this._id = options.id;
        this._type = options.type;
        const lineCoordinates = options.coordinates
            ? JSON.parse(options.coordinates) : undefined;
        this._features = [];
        this._features.push(lineCoordinates);
        this._radius = options.radius;
        this._center = options.center;
    }
    getFeatures() {
        return this._features;
    }
    getLines() {
        return this._features;
    }
    getPoints() {
        return this._features;
    }
    getFill() {
        return this._features;
    }
    getCenter() {
        return this._center;
    }
    getRadius() {
        return this._radius;
    }

}
