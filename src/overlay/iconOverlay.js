import { Overlay } from './overlay';

export class IconOverlay extends Overlay {
    constructor(options) {
        super(options);

        this._style = {
            size: options.size === undefined ? [36, 36] : options.size,
            margin: options.margin === undefined ? 0 : options.margin,
            padding: options.padding === undefined ? 0 : options.padding,
            border: options.border === undefined ? 'none' : options.border,
            imageUrl: options.imageUrl
        };
        const divElement = document.createElement('div');
        divElement.style = `position: absolute;margin: ${this._style.margin}px; 
        padding: ${this._style.padding}px;border:${this._style.border};overflow: hidden;`;

        divElement.innerHTML = `<img style="display: block;
        margin-left:${this._style.margin}px;margin-top:${this._style.margin}px;
        width:${this._style.size[0]}px; height:${this._style.size[1]}px;
        left:${this._offset[0]}px;top:${this._offset[1]}px;" src="${this._style.imageUrl}"/>`;
        this.setElement(divElement);
        this._imageElement = divElement.getElementsByTagName('img')[0];
    }

    setImage(imageUrl) {
        this._style.imageUrl = imageUrl;
        this._imageElement.setAttribute('src', imageUrl);
    }
}
