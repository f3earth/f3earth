
import { Util } from '../util/util';

export class RGBAColor {
    constructor(strColor) {
        this._r = 0;
        this._g = 0;
        this._b = 0;
        this._a = 1.0;
        this._parse(strColor);
    }

    _parse(strColor) {
        if (!strColor) {
            return;
        }
        const newStrColor = Util.trim(strColor);
        if (newStrColor.length === 0 || !this._validColor(strColor)) {
            return;
        }
        if (newStrColor.length === 4 || newStrColor.length === 5) {
            this._r = parseInt(newStrColor[1] + newStrColor[1], 16) / 256;
            this._g = parseInt(newStrColor[2] + newStrColor[2], 16) / 256;
            this._b = parseInt(newStrColor[3] + newStrColor[3], 16) / 256;
            if (newStrColor.length === 5) {
                this._a = parseInt(newStrColor[4] + newStrColor[4], 16) / 256;
            }
        } else if (newStrColor.length === 7 || newStrColor.length === 9) {
            this._r = parseInt(newStrColor[1] + newStrColor[2], 16) / 256;
            this._g = parseInt(newStrColor[3] + newStrColor[4], 16) / 256;
            this._b = parseInt(newStrColor[5] + newStrColor[6], 16) / 256;
            if (newStrColor.length === 9) {
                this._a = parseInt(newStrColor[7] + newStrColor[8], 16) / 256;
            }
        }
    }

    _validColor(strColor) {
        return /^#[0123456789abcdef]{3}/i.test(strColor) ||
            /^#[0123456789abcdef]{4}/i.test(strColor) ||
            /^#[0123456789abcdef]{6}/i.test(strColor) ||
            /^#[0123456789abcdef]{8}/i.test(strColor);
    }

    get R() {
        return this._r;
    }

    get G() {
        return this._g;
    }

    get B() {
        return this._b;
    }

    get A() {
        return this._a;
    }
}
