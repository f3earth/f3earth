import { Control } from './control';
import { DomEvent } from '../util/domEvent';
export class AttributionControl extends Control {
    constructor() {
        const ele = document.createElement('a');
        ele.innerText = 'this is attribution';
        ele.href = '#';
        ele.style = `display:block;
            width:200px;
            height:30px;
            line-height:30px;
            text-align:center;
            background-color:#60F;
            color:white;
            margin-top:5px;
            text-decoration:none;
            position:absolute;
			top:100;
			right:0;`;
        document.body.appendChild(ele);
        super(ele);
        DomEvent.on(this.element, ['click'], this._clickHandler, this);
    }

    _clickHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        window.open('https://github.com/f3earth/f3earth');
    }
}
