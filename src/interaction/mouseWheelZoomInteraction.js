/**
 * Created by zhangwenjin on 2016/7/14.
 */
import { Interaction } from './interaction';

export class MouseWheelZoomInteraction extends Interaction {
    addHandle() {
        this._earth.on('mousewheel', this._onmousewheel, this);
    }
    removeHandle() {
        this._earth.un('mousewheel', this._onmousewheel, this);
    }
    _onmousewheel(e) {
        const originalEvent = e.originalEvent;
        const zoomDelta = -originalEvent.deltaY / 100;
        const zoom = this._earth.zoom + zoomDelta;
        this._earth.setZoom(zoom);
    }
}
