/**
 * Created by zhangwenjin on 2016/7/14.
 */
import { Interaction } from './interaction';
import { Const } from '../const';
export class MouseWheelZoomInteraction extends Interaction {
    addHandle() {
        this._earth.on(Const.EarthEventType.MOUSEWHEEL, this._onmousewheel, this);
        return this;
    }
    removeHandle() {
        this._earth.un(Const.EarthEventType.MOUSEWHEEL, this._onmousewheel, this);
        return this;
    }
    _onmousewheel(e) {
        const originalEvent = e.originalEvent;
        const zoomDelta = -originalEvent.deltaY / 100;
        const zoom = this._earth.zoom + zoomDelta;
        this._earth.setZoom(zoom);
    }
}
