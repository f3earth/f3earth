import { Const } from '../../src/const';
export class OverlayLayer {
    constructor(options) {
        this._id = options.id;
        this._container = options.container;
        this._earth = null;
        this._overlays = [];
    }

    addOverlay(overlay) {
        overlay.setEarth(this._earth);
        this._overlays.push(overlay);
        overlay.appendTo(this._container);
        return overlay;
    }

    removeOverlay(overlay) {
        for (let i = 0, len = this._overlays.length; i < len; i++) {
            if (this._overlays[i] === overlay) {
                overlay.dispose();
                this._overlays.splice(i, 1);
                break;
            }
        }
    }

    clear() {
        this._overlays.forEach((overlay) => {
            overlay.dispose();
        });
        this._overlays = [];
    }

    setEarth(earth) {
        this._earth = earth;
        if (this._earth) {
            this._earth.on(Const.EarthEventType.RENDER_END, this._handleEarthRendered, this);
        }
        return this;
    }
    _handleEarthRendered() {
        this._overlays.forEach(overlay => overlay.render());
    }
    dispose() {
        this.clear();
        this._earth = null;
        this._earth.un('rendered', this._handleEarthRendered, this);
    }
}
