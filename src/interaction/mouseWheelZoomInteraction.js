/**
 * Created by zhangwenjin on 2016/7/14.
 */
import {
    Interaction
} from './interaction'
export class MouseWheelZoomInteraction extends Interaction{
    constructor() {
        super();
    }
    addHandle(){
        this._earth.on('mousewheel',this._onmousewheel,this);

    }
    removeHandle(){
        this._earth.un('mousewheel',this._onmousewheel,this);
    }
    _onmousewheel(e){
        let originalEvent=e.originalEvent;
        let zoomDelta = -originalEvent.deltaY / 100;
        let zoom = this._earth.zoom + zoomDelta;
        this._earth.setZoom(zoom);
    }
}
