import { Overlay } from './overlay';

export class MarkerOverlay extends Overlay {
    constructor(options) {
        super(options);
        this._label = options.label;
        this._icon = options.icon;

        this._style = {
            size: options.size === undefined ? [36, 36] : options.size,
            margin: options.margin === undefined ? 0 : options.margin,
            padding: options.padding === undefined ? 0 : options.padding,
            border: options.border === undefined ? '0px none' : options.border
        };

        const divElement = document.createElement('span');
        divElement.style = `margin: ${this._style.margin}px; 
        padding: ${this._style.padding}px;overflow: hidden;border: 0px none; 
        width: 0px; height: 0px; -moz-user-select: none;`;// border: ${this._style.border};

        if (this._icon) {
            divElement.appendChild(this._icon.element.firstChild);
        }
        if (this._label) {
            divElement.appendChild(this._label.element.firstChild);
        }
        this.setElement(divElement);
    }

    get lable() {
        return this._label;
    }
    get icon() {
        return this._icon;
    }
}
