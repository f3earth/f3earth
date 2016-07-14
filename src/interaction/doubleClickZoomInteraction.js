/**
 * Created by zhangwenjin on 2016/7/13.
 */
import { Interaction } from './interaction';
export class DoubleClickZoomInteraction extends Interaction {
    addHandle() {
        this._earth.on('dblclick', this._doubleClick, this);
    }
    removeHandle() {
        this._earth.un('dblclick', this._doubleClick, this);
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
