import { Line as RenderableLine } from '../renderable/line';
import { LineLayerRender } from '../render/lineLayerRender';
import { LineMesh } from '../mesh/lineMesh';

export class LineLayer {

    constructor(options) {
        this._source = options.source;
        this._view = options.view;
        this._render = new LineLayerRender(options.context.gl);
        this._renderList = [];
        this._renderVersion = -1;
        this._camera = null;
    }

    render(camera) {
        this._camera = camera;
        if (this._renderVersion === -1) {
            this._buildRenderObjects();
        }

        this._render.render(this._renderList, camera);
        this._renderVersion = this._renderVersion + 1;
    }

    _buildRenderObjects() {
        const lines = this._source.getLines();
        lines.forEach(line => {
            const renderableLine = new RenderableLine({
                mesh: new LineMesh(line),
                material: undefined
            });
            this._renderList.push(renderableLine);
        });
    }
}
