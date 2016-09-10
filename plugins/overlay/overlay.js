import { Observable } from '../../src/util/observable';
import { Const } from '../../src/const';
import { Dom } from '../../src/util/dom';
import { DomEvent } from '../../src/util/domEvent';
import { Util } from '../../src/util/util';

export class Overlay extends Observable {
    constructor(options) {
        super();
        this._id = options.id;
        this._earth = null;
        this._entity = options.entity;
        const ele = document.createElement('DIV');
        ele.className = 'fe-overlay-container';
        ele.style.position = 'absolute';
        this._element = ele;
        this._style = {
            bottom: '',
            left: '',
            right: '',
            top: '',
            visible: true
        };

        if (options.element !== undefined) {
            this.setElement(options.element);
        }
        this._coordinate = undefined;
        this._positioning = Const.OverlayPositioning.TOP_LEFT;
        this._offset = [0, 0];
        if (options.offset !== undefined) {
            this._offset = options.offset;
        }
        if (options.positioning !== undefined) {
            this._positioning = options.positioning;
        }
        if (options.coordinate !== undefined) {
            this._coordinate = options.coordinate;
        }
    }

    get element() {
        return this._element;
    }
    setElement(element) {
        Dom.removeChildren(this._element);
        if (element) {
            this._element.appendChild(element);
            this.render();
        }
        return this;
    }
    get entity() {
        return this._entity;
    }
    // addtional object of entity
    setEntity(entity) {
        this._entity = entity;
        return this;
    }

    get coordinate() {
        return this._coordinate;
    }
    setCoordinate(coordinate) {
        if (this._coordinate !== coordinate) {
            this._coordinate = coordinate;
            this.render();
        }
    }

    get positioning() {
        return this._positioning;
    }
    setPositioning(positioning) {
        if (this._positioning !== positioning) {
            this._positioning = positioning;
            this.render();
            // this._panToViewport();
        }
        return this;
    }
    get offset() {
        return this._offset;
    }
    setOffset(offset) {
        if (this._offset !== offset) {
            this._offset = offset;
            this.render();
        }
        return this;
    }

    get id() {
        return this._id;
    }
    setId(id) {
        this._id = id;
        return this;
    }

    setEarth(earth) {
        this._earth = earth;
        return this;
    }

    appendTo(container) {
        container.appendChild(this._element);
        this.render();
        return this;
    }

    render() {
        if (this._earth === null || this._coordinate === undefined) {
            this.setVisible(false);
            return;
        }
        const style = this._element.style;
        const earthContainerSize = this._earth.size;
        // this._coordinate to fixel; todo transform coordinate into pixel
        const pixel = this._earth.getPixelCoordinate(...this._coordinate);
        console.log(pixel);
        let offsetX = this._offset[0];
        let offsetY = this._offset[1];
        const elementSize = Dom.getSize(this._element);
        if (this._positioning === Const.OverlayPositioning.BOTTOM_RIGHT ||
            this._positioning === Const.OverlayPositioning.CENTER_RIGHT ||
            this._positioning === Const.OverlayPositioning.TOP_RIGHT) {
            if (this._style.left_ !== '') {
                this._style.left_ = style.left = '';
            }
            const right = `${Math.round(earthContainerSize[0] - pixel.x - offsetX)}px`;
            if (this._style.right !== right) {
                this._style.right = style.right = right;
            }
        } else {
            if (this._style.right !== '') {
                this._style.right = style.right = '';
            }
            if (this._positioning === Const.OverlayPositioning.BOTTOM_CENTER ||
                this._positioning === Const.OverlayPositioning.CENTER_CENTER ||
                this._positioning === Const.OverlayPositioning.TOP_CENTER) {
                offsetX -= (elementSize[0] / 2);
            }
            const left = `${Math.round(pixel.x + offsetX)}px`;
            if (this._style.left !== left) {
                this._style.left = style.left = left;
            }
        }
        if (this._positioning === Const.OverlayPositioning.BOTTOM_LEFT ||
            this._positioning === Const.OverlayPositioning.BOTTOM_CENTER ||
            this._positioning === Const.OverlayPositioning.BOTTOM_RIGHT) {
            if (this._style.top !== '') {
                this._style.top = style.top = '';
            }
            const bottom = `${Math.round(earthContainerSize[1] - pixel.y - offsetY)}px`;
            if (this._style.bottom !== bottom) {
                this._style.bottom = style.bottom = bottom;
            }
        } else {
            if (this._style.bottom !== '') {
                this._style.bottom = style.bottom = '';
            }
            if (this._positioning === Const.OverlayPositioning.CENTER_LEFT ||
                this._positioning === Const.OverlayPositioning.CENTER_CENTER ||
                this._positioning === Const.OverlayPositioning.CENTER_RIGHT) {
                offsetY -= (elementSize[1] / 2);
            }
            const top = `${Math.round(pixel.y + offsetY)}px`;

            if (this._style.top !== top) {
                this._style.top = style.top = top;
            }
        }
        this.setVisible(true);
    }

    _panToViewport() {
        if (this._earth === null || this._coordinate === undefined) {
            return;
        }
        const earthContainerRect = Dom.getElementRect(this._earth.container, this._earth.getSize());
        const overlayRect = Dom.getElementRect(this._element, Dom.getSize(this._element));
        const margin = 20;

        if (!Util.containsExtent(earthContainerRect, overlayRect)) {
            // the overlay is not completely inside the viewport, so pan the map
            const offsetLeft = overlayRect[0] - earthContainerRect[0];
            const offsetRight = earthContainerRect[2] - overlayRect[2];
            const offsetTop = overlayRect[1] - earthContainerRect[1];
            const offsetBottom = earthContainerRect[3] - overlayRect[3];

            const delta = [0, 0];
            if (offsetLeft < 0) {
                delta[0] = offsetLeft - margin;
            } else if (offsetRight < 0) {
                delta[0] = Math.abs(offsetRight) + margin;
            }
            if (offsetTop < 0) {
                delta[1] = offsetTop - margin;
            } else if (offsetBottom < 0) {
                delta[1] = Math.abs(offsetBottom) + margin;
            }
            // todo position the overlay in viewport;
            if (delta[0] !== 0 || delta[1] !== 0) {
                // let center = this._earth.getCenter();
                // let centerPx = this._earth.getPixelFromCoordinate(center);
                // const newCenterPixel = [
                //     centerPx[0] + delta[0],
                //     centerPx[1] + delta[1]
                // ];
            }
            // this._earth.setCenter(this._earth.getCoordinateFromPixel(newCenterPx));
        }
    }

    setVisible(visible) {
        Dom.setVisible(this._element, visible);
        this._style.visible = visible;
        return this;
    }

    on(eventType, fn) {
        DomEvent.on(this._element, eventType, fn, this);
    }

    dispose() {
        this._coordinate = null;
        this._positioning = null;
        this._earth = null;
        this.element.parentNode.removeChild(this._element);
    }

}

