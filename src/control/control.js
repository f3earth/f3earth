import { Observable } from '../util/observable';
import { Const } from '../const';
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
            this._earth.on('rendered', this.render, this);
        }
        return this;
    }

    get element() {
        return this._element;
    }

    render(camera) {
        this.trigger(Const.ControlEventType.RENDER, camera);
        console.log(camera);
    }

    dispose() {
        this._earth.un('rendered', this.render, this);
        this.element.parentNode.removeChild(this._element);
        this._earth = null;
    }
}
