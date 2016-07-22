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
