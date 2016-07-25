
import { DoubleClickZoomInteraction } from './doubleClickZoomInteraction';
import { DragInteraction } from './dragInteraction';
import { MouseWheelZoomInteraction } from './mouseWheelZoomInteraction';

const FEInteraction = {};

FEInteraction.DoubleClickZoom = DoubleClickZoomInteraction;
FEInteraction.Drag = DragInteraction;
FEInteraction.MouseWheelZoom = MouseWheelZoomInteraction;

export {
    FEInteraction
};
