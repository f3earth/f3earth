import { Observable } from '../util/observable';

export class VectorSource extends Observable {

    constructor(options) {
        super();
        this._id = options.id;
        this._type = options.type;
        const lineCoordinates = JSON.parse(options.coordinates);
        this._features = [];
        this._features.push(lineCoordinates);
    }
    getRenderObjects() {
        return this.buildRenderObjects();
    }
    getFeatures() {
        return this._features;
    }

}
