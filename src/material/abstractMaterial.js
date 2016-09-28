import { RGBAColor } from './rgbaColor';

export class AbstractMaterial {

    constructor(options) {
        this._color = options ? new RGBAColor(options.color) : new RGBAColor();
    }

    get color() {
        return this._color;
    }

    setup(gl) {
        // nothing to do here
    }
}
