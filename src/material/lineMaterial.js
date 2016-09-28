import { AbstractMaterial } from './abstractMaterial';

export class LineMaterial extends AbstractMaterial {

    constructor(options) {
        super(options);
        this._size = options && options.size ? options.size : 0;
    }

    get size() {
        return this._size;
    }
}
