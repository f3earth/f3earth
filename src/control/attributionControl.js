import {
    Control
} from './control';
import {
    DomEvent
} from '../util/domEvent';
export class AttributionControl extends Control {
    constructor() {
        const controlContainers = document.getElementById('fe-controls-container');
        const ele = document.createElement('div');
        // css-file be used;
        ele.innerHTML = `
            <div class="fe-attribution-logo">
            </div>
            <div class="fe-attribution-copyright">
                <span>Copyright@2016 F3Earth</span>
            </div>
        `;
        controlContainers.appendChild(ele);
        super(ele);
        DomEvent.on(this.element, 'click', this._clickHandler, this);
    }

    _clickHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        window.open('https://github.com/f3earth/f3earth');
    }
}
