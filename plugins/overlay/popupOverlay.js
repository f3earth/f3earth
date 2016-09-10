import { Overlay } from './overlay';
import { Const } from '../../src/const';
import { DomEvent } from '../../src/util/domEvent';

export class PopupOverlay extends Overlay {
    constructor(options) {
        super(options);

        this._style = {
            content: options.content
        };
        const divElement = document.createElement('div');
        divElement.className = 'fe-popup';
        divElement.innerHTML = `<a href="#" class="fe-popup-closer"></a>
        <div>${this._style.content}</div>`;

        this.setElement(divElement);
        this._closeElement = divElement.getElementsByTagName('a')[0];
        this._contentElement = divElement.getElementsByTagName('div')[0];
        DomEvent.on(this._closeElement, Const.DomEventType.CLICK,
            this._handleCloseElementClick, this);
    }

    _handleCloseElementClick(e) {
        // preventDefault & stopPropagation;
        e.preventDefault();
        e.stopPropagation();
        this.setVisible(false);
        return false;
    }

    setContent(content) {
        this._style.content = content;
        this._contentElement.innerHTML = content;
    }
}
