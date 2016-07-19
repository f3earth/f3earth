import { Const } from '../const';
import { Observable } from '../util/observable';

export class VectorSource extends Observable {

    constructor(options) {
        super();
        this._id = options.id;
        this._type = options.type;
        if (this._type === Const.SourceType.LINE) {
            const lineCoordinates = JSON.parse(options.coordinates);
            this._lines = [];
            this._lines.push(lineCoordinates);
        }
    }

    getLines() {
        return this._lines;
    }

}
