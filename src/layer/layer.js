import { Observable } from '../util/observable';
import { LineLayerRender } from '../render/lineLayerRender';
export class Layer extends Observable {
    constructor(options) {
        super();
        this._source = options.source;
        this._view = options.view;
        this._fill = options.fill;
        this._render = new LineLayerRender(options.context.gl);
        this._renderList = [];
        this._renderVersion = -1;
        this._camera = null;
    }
    render(camera) {
        this._camera = camera;
        if (this._renderVersion === -1) {
            // this._buildRenderObjects();
            this._renderList = this._source.getRenderObjects();
        }

        this._render.render(this._renderList, camera);
        this._renderVersion = this._renderVersion + 1;
    }
    get source() {
        return this._source;
    }
}
