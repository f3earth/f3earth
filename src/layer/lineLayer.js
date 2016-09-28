import { Layer } from './layer';
import { Line as RenderableLine } from '../renderable/line';
import { LineMesh } from '../mesh/lineMesh';
import { LineMaterial } from '../material/lineMaterial';
import { LayerRender } from '../render/layerRender';
import { LayerShader } from '../shader/layerShader';
export class LineLayer extends Layer {
    constructor(options) {
        super(options);
        this._render = new LayerRender(options.view.gl,
            LayerShader.lineVertexSource, LayerShader.lineFragmentSource);
    }
    _buildRenderObjects() {
        this._renderObjects = [];
        this.source.getLines().forEach(line => {
            const renderableLine = new RenderableLine({
                mesh: new LineMesh(line),
                material: new LineMaterial(this.style)
            });
            this._renderObjects.push(renderableLine);
        });
    }
}
