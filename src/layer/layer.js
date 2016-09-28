import { Const } from '../const';
import { Observable } from '../util/observable';

export class Layer extends Observable {
    constructor(options) {
        super();
        this._source = options.source;
        this._view = options.view;
        // this._render = new LineLayerRender(options.context.gl);
        this._renderObjects = [];
        this._renderVersion = -1;
        this._camera = null;
        this._source.on(Const.SourceEventType.CHANGE, () => this._buildRenderObjects());
    }

    /**
     * @param {Source} source object, not config options
     */
    setSource(source) {
        if (this._source) {
            this._source.unAll();
        }
        this._source = source;
        if (this._source) {
            this._buildRenderObjects();
            this._source.on(Const.SourceEventType.CHANGE, () => this._buildRenderObjects());
        }
    }

    removeSource() {
        if (this._source) {
            this._source.unAll();
        }
        this._source = undefined;
    }

    render(camera) {
        this._camera = camera;
        if (this._renderVersion === -1) {
            this._buildRenderObjects();
        }

        this._render.render(this._renderObjects, camera);
        this._renderVersion = this._renderVersion + 1;
    }
    get source() {
        return this._source;
    }
}
