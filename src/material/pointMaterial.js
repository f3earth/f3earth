import { AbstractMaterial } from './abstractMaterial';

export class PointMaterial extends AbstractMaterial {
    constructor(styleOptions) {
        super(styleOptions);
        this._size = styleOptions && styleOptions.size ? styleOptions.size : 0;
    }

    get size() {
        return this._size;
    }
}
