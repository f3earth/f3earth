import { Overlay } from './overlay';
export class LabelOverlay extends Overlay {
    constructor(options) {
        super(options);

        this._style = {
            size: options.size === undefined ? [36, 36] : options.sizewidth,
            margin: options.margin === undefined ? 0 : options.margin,
            padding: options.padding === undefined ? 0 : options.padding,
            border: options.border === undefined ? '1px solid rgb(0, 0, 0)' : options.border,
            bgCorlor: options.bgCorlor === undefined ? '#CCFFBF' : options.bgCorlor,
            color: options.color === undefined ? '#050805' : options.color,
            fontSize: options.fontSize === undefined ? 12 : options.fontSize,
            fontFamily: options.fontFamily === undefined ? 'Georgia, serif' : options.fontFamily,
            fontStyle: options.fontStyle === undefined ? 'normal' : options.fontStyle,
            fontWeight: options.fontWeight === undefined ? 'normal' : options.fontWeight,
            content: options.content
        };
        const divElement = document.createElement('div');
        divElement.style = `position: absolute;margin: ${this._style.margin}px; 
        padding: ${this._style.padding}px;overflow: hidden;
        left:${this.offset[0]}px;top:${this.offset[1]}px;`;

        divElement.innerHTML = `<label style="-moz-user-select: none; 
        display: inline;cursor: inherit; background-color: ${this._style.bgCorlor}; 
        border: ${this._style.border};padding: 1px; white-space: nowrap; 
        font-family:${this._style.fontFamily};font-size:${this._style.fontSize};
        font-weight:${this._style.fontWeight};font-style:${this._style.fontStyle};z-index: 100;
        color:${this._style.color};">${this._style.content}</label>`;

        this.setElement(divElement);
        this._labelElement = divElement.getElementsByTagName('label')[0];
    }

    setContent(content) {
        this._style.content = content;
        this._labelElement.innerHTML = content;
    }
}
