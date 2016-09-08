import { Observable } from '../../src/util/observable';
import { Const } from '../../src/const';

export class Control extends Observable {
    constructor(element) {
        super();
        this._element = element;
        this._earth = null;
    }

    get earth() {
        return this._earth;
    }
    setEarth(earth) {
        this._earth = earth;
        if (earth) {
            this._earth.on(Const.EarthEventType.RENDER_END, this.render, this);
        }
        return this;
    }

    get element() {
        return this._element;
    }

    render() {
        this.trigger(Const.ControlEventType.RENDER);
    }

    dispose() {
        this._earth.un('rendered', this.render, this);
        this.element.parentNode.removeChild(this._element);
        this._earth = null;
    }
}
