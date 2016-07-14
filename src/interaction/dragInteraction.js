/**
 * Created by zhangwenjin on 2016/7/13.
 */

import { Interaction } from './interaction';
export class DragInteraction extends Interaction {
    constructor() {
        super();
        this._isMouseDown = false;
        this._prevMouseX = null;
        this._prevMouseY = null;
    }
    addHandle() {
        this._earth.on('mousedown', this._onmousedown, this);
        this._earth.on('mouseup', this._onmouseup, this);
        this._earth.on('mousemove', this._onmousemove, this);
        this._earth.on('mouseout', this._onmouseout, this);
    }
    removeHandle() {
        this._earth.un('mousedown', this._onmousedown, this);
        this._earth.un('mouseup', this._onmouseup, this);
        this._earth.un('mousemove', this._onmousemove, this);
        this._earth.un('mouseout', this._onmouseout, this);
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
            const y = -deltaY / 10 % 360;
            this._earth.rotate(y * Math.PI / 180, x * Math.PI / 180);

            this._prevMouseX = originalEvent.clientX;
            this._prevMouseY = originalEvent.clientY;
        }
    }
    _onmouseout(e) {
        this._isMouseDown = false;
    }
}
