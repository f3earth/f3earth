
import { Earth } from './src/earth';
import { Const } from './src/const';

import { AttributionControl } from './plugins/control/attributionControl';
import { ZoomControl } from './plugins/control/zoomControl';
import { Control as FEControl } from './plugins/control/control';

import { DoubleClickZoomInteraction } from './plugins/interaction/doubleClickZoomInteraction';
import { DragInteraction } from './plugins/interaction/dragInteraction';
import { MouseWheelZoomInteraction } from './plugins/interaction/mouseWheelZoomInteraction';

import { Overlay as FEOverlay } from './plugins/overlay/overlay';
import { IconOverlay } from './plugins/overlay/iconOverlay';
import { LabelOverlay } from './plugins/overlay/labelOverlay';
import { MarkerOverlay } from './plugins/overlay/markerOverlay';
import { PopupOverlay } from './plugins/overlay/popupOverlay';
import { OverlayLayer } from './plugins/overlay/overlayLayer';

import { Format as FEFormat } from './plugins/format/format';
import { GeoJSON } from './plugins/format/geojson';

import { Feature } from './src/feature/feature';
import { Geometry as FEGeometry } from './src/feature/geometry';
import { Point } from './src/feature/point';
import { LineString } from './src/feature/linestring';
import { Polygon } from './src/feature/polygon';

const Control = {};
Control.Attribution = AttributionControl;
Control.Zoom = ZoomControl;
Control.Control = FEControl;

const Interaction = {};
Interaction.DoubleClickZoom = DoubleClickZoomInteraction;
Interaction.Drag = DragInteraction;
Interaction.MouseWheelZoom = MouseWheelZoomInteraction;

const Overlay = {};
Overlay.Overlay = FEOverlay;
Overlay.Icon = IconOverlay;
Overlay.Label = LabelOverlay;
Overlay.Marker = MarkerOverlay;
Overlay.Popup = PopupOverlay;
Overlay.Layer = OverlayLayer;

const Format = {};
Format.Format = FEFormat;
Format.GeoJSON = GeoJSON;

const Geometry = {};
Geometry.Geometry = FEGeometry;
Geometry.Point = Point;
Geometry.LineString = LineString;
Geometry.Polygon = Polygon;

export {
    Earth,
    Const,
    Control,
    Interaction,
    Overlay,
    Format,
    Geometry,
    Feature
};
