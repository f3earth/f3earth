/**
 * Created by zhangwenjin on 2016/7/16.
 */
class Const {
}
Const.EarthEventType = {
    ZOOM_START: 'earthZoomStart',
    ZOOM_END: 'earthZoomEnd',
    CLICK: 'earthClick',
    DBLCLICK: 'earthDblclick',
    MOUSEDOWN: 'earthMousedown',
    MOUSEUP: 'earthMouseup',
    MOUSEOVER: 'earthMouseover',
    MOUSEOUT: 'earthMouseout',
    MOUSEMOVE: 'earthMousemove',
    MOUSEWHEEL: 'earthMousewheel',
    KEYPRESS: 'earthKeypress'
};

Const.SourceEventType = {
    CHANGE: 'sourceChange'
};

Const.ControlEventType = {
    RENDER: 'controlRender'
};

Const.LayerType = {
    LINE: 'line',
    RASTER_TILE: 'rasterTile'
};

Const.SourceType = {
    LINE: 'line'
};

Const.EARTH_RADIUS = 6378137;

export {
    Const
};
