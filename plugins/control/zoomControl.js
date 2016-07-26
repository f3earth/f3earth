import { Control } from './control';
import { DomEvent } from '../../src/util/domEvent';

export class ZoomControl extends Control {
    constructor() {
        const controlContainers = document.getElementById('fe-controls-container');
        const ele = document.createElement('div');
        ele.className = 'fe-control-zoom fe-control';
        ele.innerHTML = `<button class="fe-zoom-in" type="button" title="Zoom in">+</button>
            <button class="fe-zoom-out" type="button" title="Zoom out">−</button>`;
        controlContainers.appendChild(ele);
        super(ele);
        const buttons = ele.getElementsByTagName('button');
        this.btnZoomIn = buttons[0];
        this.btnZoomOut = buttons[1];

        DomEvent.on(this.btnZoomIn, 'click', this._zoomIn, this);
        DomEvent.on(this.btnZoomOut, 'click', this._zoomOut, this);
    }

    _zoomIn(e) {
        e.preventDefault();
        e.stopPropagation();
        this._earth.setZoom(this._earth.zoom + 1);
    }
    _zoomOut(e) {
        e.preventDefault();
        e.stopPropagation();
        this._earth.setZoom(this._earth.zoom - 1);
    }
}
