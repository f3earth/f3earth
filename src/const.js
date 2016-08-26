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
    KEYPRESS: 'earthKeypress',
    RENDER_END: 'renderEnd'
};

Const.SourceEventType = {
    CHANGE: 'sourceChange'
};

Const.ControlEventType = {
    RENDER: 'controlRender'
};

Const.GeomType = {
    POINT: 'Point',
    LINE: 'LineString',
    POLYGON: 'Polygon'
};

Const.LayerType = {
    POINT: 'point',
    LINE: 'line',
    FILL: 'fill',
    CIRCLE: 'circle',
    CIRCLE_FILL: 'circleFill',
    RASTER_TILE: 'rasterTile'
};

Const.SourceType = {
    LINE: 'line'
};

Const.OverlayPositioning = {
    BOTTOM_LEFT: 'bottom-left',
    BOTTOM_CENTER: 'bottom-center',
    BOTTOM_RIGHT: 'bottom-right',
    CENTER_LEFT: 'center-left',
    CENTER_CENTER: 'center-center',
    CENTER_RIGHT: 'center-right',
    TOP_LEFT: 'top-left',
    TOP_CENTER: 'top-center',
    TOP_RIGHT: 'top-right'
};

Const.DomNodeType = {
    ELEMENT: 1,
    ATTRIBUTE: 2,
    TEXT: 3,
    CDATA_SECTION: 4,
    ENTITY_REFERENCE: 5,
    ENTITY: 6,
    PROCESSING_INSTRUCTION: 7,
    COMMENT: 8,
    DOCUMENT: 9,
    DOCUMENT_TYPE: 10,
    DOCUMENT_FRAGMENT: 11,
    NOTATION: 12
};

Const.DomEventType = {
    CLICK: 'click',
    DBLCLICK: 'dblclick',
    MOUSEDOWN: 'mousedown',
    MOUSEUP: 'mouseup',
    MOUSEOVER: 'mouseover',
    MOUSEOUT: 'mouseout',
    MOUSEMOVE: 'mousemove',
    MOUSEWHEEL: 'mousewheel',
    KEYPRESS: 'keypress'
};

Const.EARTH_RADIUS = 6378137;
Const.CIRCLE_BY_STEPS = 64;

Const.MAX_ZOOM = 28;
Const.MIN_ZOOM = 1;

export {
    Const
};
