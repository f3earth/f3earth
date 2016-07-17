import { SourceLayer } from './source/sourceLayer';
import { Context } from './context';
import { Camera } from './camera';
import { Observable } from './util/observable';
import { DomEvent } from './util/domEvent';
import { Const } from './const';
const EARTH_RADIUS = 6378137;
class Earth extends Observable {
    constructor(containerId) {
        super();
        this._zoomDist = [];
        for (let level = 0; level < 18; level++) {
            this._zoomDist.push(EARTH_RADIUS * Math.pow(1.05, 18 - level));
        }

        this._container = document.getElementById(containerId);
        this._context = new Context(this._container);
        this._camera = new Camera();
        this._zoom = 3;
        this._camera.eye = [0, 0, this._zoomDist[this._zoom - 1]];

        this._sourceLayers = [];
        this._interactions = [];
        this._eventType = [{ originalEvent: 'click', event: Const.EarthEventType.CLICK },
            { originalEvent: 'dblclick', event: Const.EarthEventType.DBLCLICK },
            { originalEvent: 'mousedown', event: Const.EarthEventType.MOUSEDOWN },
            { originalEvent: 'mouseup', event: Const.EarthEventType.MOUSEUP },
            { originalEvent: 'mouseover', event: Const.EarthEventType.MOUSEOVER },
            { originalEvent: 'mouseout', event: Const.EarthEventType.MOUSEOUT },
            { originalEvent: 'mousemove', event: Const.EarthEventType.MOUSEMOVE },
            { originalEvent: 'mousewheel', event: Const.EarthEventType.MOUSEWHEEL },
            { originalEvent: 'keypress', event: Const.EarthEventType.KEYPRESS }];
        DomEvent.onKeys(this._context.canvas, this._eventType, this._handleDOMEvent, this);
    }

    get context() {
        return this._context;
    }

    rotateX(radian) {
        this.rotate(radian);
    }

    rotateY(radian) {
        this.rotate(undefined, radian);
    }

    rotate(xRadian, yRadian) {
        if (xRadian) {
            this._camera.rotateX = this._camera.rotateX + xRadian;
        }

        if (yRadian) {
            this._camera.rotateY = this._camera.rotateY + yRadian;
        }
        this.render();
    }

    get zoom() {
        return this._zoom;
    }
    setZoom(level) {
        let validLevel = level;
        if (level > 18) {
            validLevel = 18;
        } else if (level < 1) {
            validLevel = 1;
        }
        if (validLevel !== this._zoom) {
            this.trigger(Earth.EVENT_TYPE_ZOOM_START,
                { oldLevel: this._zoom, newLevel: validLevel });
            this._zoom = validLevel;
            this._camera.eye = [0, 0, this._zoomDist[validLevel - 1]];
            this.render();
            this.trigger(Earth.EVENT_TYPE_ZOOM_END, { oldLevel: this._zoom, newLevel: validLevel });
        }
    }

    addLayer(layer) {
        const sourceLayer = SourceLayer.from(this._context, layer);
        this._sourceLayers.push(sourceLayer);
        this.render();
    }

    render() {
        this._sourceLayers.forEach(layer => layer.render(this._camera));
    }
    _getEventType(type) {
        let eventType = null;
        for (let i = 0, len = this._eventType.length; i < len; i++) {
            const item = this._eventType[i];
            if (item.originalEvent === type) {
                eventType = item.event;
            }
        }
        return eventType;
    }
    _handleDOMEvent(e) {
        if (e._stopped) { return; }
        let type = e.type === 'keypress' && e.keyCode === 13 ? 'click' : e.type;
        type = type === 'wheel' ? 'mousewheel' : type;
        const evetType = this._getEventType(type);
        const data = {
            originalEvent: e
        };
        this.trigger(evetType, data);
    }
    addInteraction(interaction) {
        interaction.setEarth(this);
        interaction.enable();
        this._interactions.push(interaction);
        return this;
    }
    removeInteraction(interaction) {
        for (let i = 0, len = this._interactions.length; i < len; i++) {
            if (this._interactions[i] === interaction) {
                interaction.disable();
                interaction.setEarth(null);
                this._interactions.splice(i, 1);
                break;
            }
        }
        return this;
    }
}
export {
Earth
};
