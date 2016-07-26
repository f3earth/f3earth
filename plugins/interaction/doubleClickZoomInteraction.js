/**
 * Created by zhangwenjin on 2016/7/13.
 */
import { Interaction } from './interaction';
import { Const } from '../../src/const';
export class DoubleClickZoomInteraction extends Interaction {
    addHandle() {
        this._earth.on(Const.EarthEventType.DBLCLICK, this._doubleClick, this);
        return this;
    }
    removeHandle() {
        this._earth.un(Const.EarthEventType.DBLCLICK, this._doubleClick, this);
        return this;
    }
    _doubleClick(e) {
        let zoomDelta = 1;
        if (e.originalEvent.shiftKey) {
            zoomDelta = -1;
        }
        const zoom = this._earth.zoom + zoomDelta;
        this._earth.setZoom(zoom);
    }
}
