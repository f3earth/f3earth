
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

export {
    Earth,
    Const,
    Control,
    Interaction,
    Overlay
};
