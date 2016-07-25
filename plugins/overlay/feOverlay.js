import { Overlay } from './overlay';
import { IconOverlay } from './iconOverlay';
import { LabelOverlay } from './labelOverlay';
import { MarkerOverlay } from './markerOverlay';
import { PopupOverlay } from './popupOverlay';
import { OverlayLayer } from './overlayLayer';

const FEOverlay = {};

FEOverlay.Overlay = Overlay;
FEOverlay.Icon = IconOverlay;
FEOverlay.Label = LabelOverlay;
FEOverlay.Marker = MarkerOverlay;
FEOverlay.Popup = PopupOverlay;
FEOverlay.Layer = OverlayLayer;

export {
    FEOverlay
};
