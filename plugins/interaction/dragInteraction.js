/**
 * Created by zhangwenjin on 2016/7/13.
 */
import { Interaction } from './interaction';
import { Const } from '../../src/const';

export class DragInteraction extends Interaction {
    constructor() {
        super();
        this._isMouseDown = false;
        this._prevMouseX = null;
        this._prevMouseY = null;
    }
    addHandle() {
        this._earth.on(Const.EarthEventType.MOUSEDOWN, this._onmousedown, this)
                    .on(Const.EarthEventType.MOUSEUP, this._onmouseup, this)
                    .on(Const.EarthEventType.MOUSEMOVE, this._onmousemove, this)
                    .on(Const.EarthEventType.MOUSEOVER, this._onmouseout, this);
        return this;
    }
    removeHandle() {
        this._earth.un(Const.EarthEventType.MOUSEDOWN, this._onmousedown, this)
                    .un(Const.EarthEventType.MOUSEUP, this._onmouseup, this)
                    .un(Const.EarthEventType.MOUSEMOVE, this._onmousemove, this)
                    .un(Const.EarthEventType.MOUSEOVER, this._onmouseout, this);
        return this;
    }
    _onmousedown(e) {
        const originalEvent = e.originalEvent;
        this._isMouseDown = true;
        this._prevMouseX = originalEvent.clientX;
        this._prevMouseY = originalEvent.clientY;
    }
    _onmouseup(e) {
        this._isMouseDown = false;
    }
    _onmousemove(e) {
        const originalEvent = e.originalEvent;
        if (this._isMouseDown) {
            const deltaX = originalEvent.clientX - this._prevMouseX;
            const deltaY = originalEvent.clientY - this._prevMouseY;

            const x = -deltaX / 10 % 360;
            const y = deltaY / 10 % 360;
            this._earth.panByDelta(x, y);

            this._prevMouseX = originalEvent.clientX;
            this._prevMouseY = originalEvent.clientY;
        }
    }
    _onmouseout(e) {
        this._isMouseDown = false;
    }
}
