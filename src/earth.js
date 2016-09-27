import { SourceLayer } from './source/sourceLayer';
import { Source } from './source/source';
import { Context } from './context';
import { Camera } from './camera';
import { Observable } from './util/observable';
import { DomEvent } from './util/domEvent';
import { Const } from './const';
import { Dom } from './util/dom';
import { View } from './view';

class Earth extends Observable {
    constructor(containerId, params) {
        super();

        this._container = document.getElementById(containerId);
        this._context = new Context(this._container);
        this._camera = new Camera();
        this._camera.aspect = this._context.gl.viewportWidth / this._context.gl.viewportHeight;
        this._view = new View(this._context, this._camera, params ? params.View : undefined);

        this._sourceLayers = [];
        this._interactions = [];
        this._controls = [];
        this._overlayLayers = [];
        this._eventType = new Map([['click', Const.EarthEventType.CLICK],
            ['dblclick', Const.EarthEventType.DBLCLICK],
            ['mousedown', Const.EarthEventType.MOUSEDOWN],
            ['mouseup', Const.EarthEventType.MOUSEUP],
            ['mouseover', Const.EarthEventType.MOUSEOVER],
            ['mouseout', Const.EarthEventType.MOUSEOUT],
            ['mousemove', Const.EarthEventType.MOUSEMOVE],
            ['mousewheel', Const.EarthEventType.MOUSEWHEEL],
            ['keypress', Const.EarthEventType.KEYPRESS]
        ]);
        DomEvent.on(this._context.canvas, Array.from(this._eventType.keys()),
            this._handleDOMEvent, this);

        this._view.on(Const.ViewEventType.CHANGE, (obj) => {
            requestAnimationFrame(() => {
                this.render();
                if (obj && obj.afterCallback) {
                    obj.afterCallback();
                }
            });
        }, this);
    }

    get context() {
        return this._context;
    }

    getPixelCoordinate(longitude, latitude) {
        const openglCoordinate = this._camera.getGLCoordinate(longitude, latitude);
        return {
            x: ((1 + openglCoordinate.x) / 2.0) * this._context.gl.viewportWidth,
            y: (1 - ((1 + openglCoordinate.y) / 2.0)) * this._context.gl.viewportHeight
        };
    }

    /**
     * @param {Object} layerOptions {{
     *  id: {String},
     *  source: {String | {{
     *                          id: {String},
     *                          type: {String},
     *                          url: {String},
     *                          features: {String} only for vector source,
     *                      }} },
     *  type: {String}
     * }}
     */
    addLayer(layerOptions) {
        if (!layerOptions) {
            return;
        }
        if (!layerOptions.id) {
            throw new Error('id is requied!');
        }
        if (!layerOptions.source) {
            throw new Error('source is requied!');
        }

        const sourceLayer = SourceLayer.create(this._view, layerOptions);
        if (sourceLayer) {
            sourceLayer.source.on(Const.SourceEventType.CHANGE, () => this.render());
            this._sourceLayers.push(sourceLayer);
            this.render();
        }
    }

    addSource(options) {
        Source.valueOf(options);
    }

    getSource(id) {
        return Source.get(id);
    }

    render() {
        const gl = this._context.gl;
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.CULL_FACE);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this._sourceLayers.forEach(layer => layer.render(this._camera));
        this.trigger(Const.EarthEventType.RENDER_END);
    }

    _handleDOMEvent(e) {
        if (e._stopped) { return; }
        let type = e.type === 'keypress' && e.keyCode === 13 ? 'click' : e.type;
        type = type === 'wheel' ? 'mousewheel' : type;
        const eventType = this._eventType.get(type);
        const data = {
            originalEvent: e
        };
        this.trigger(eventType, data);
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

    addControl(control) {
        control.setEarth(this);
        this._controls.push(control);
        return this;
    }

    removeControl(control) {
        for (let i = 0, len = this._interactions.length; i < len; i++) {
            if (this._controls[i] === control) {
                control.dispose();
                this._controls.splice(i, 1);
                break;
            }
        }
        return this;
    }

    addOverlayLayer(overlayLayer) {
        overlayLayer.setEarth(this);
        this._overlayLayers.push(overlayLayer);
    }

    removeOverlayLayer(overlayLayer) {
        for (let i = 0, len = this._overlayLayers.length; i < len; i++) {
            if (this._overlayLayers[i] === overlayLayer) {
                overlayLayer.dispose();
                this._overlayLayers.splice(i, 1);
                break;
            }
        }
        return this;
    }

    clearOverlayLayers() {
        this._overlayLayers.forEach(overlayLayer => overlayLayer.dispose());
        this._overlayLayers = [];
    }

    get container() {
        return this._container;
    }

    get size() {
        return Dom.getSize(this._container);
    }

    setCenter(lng, lat) {
        this._camera.setTarget(lng, lat);
        return this;
    }

    get view() {
        return this._view;
    }
}
export {
    Earth
};
