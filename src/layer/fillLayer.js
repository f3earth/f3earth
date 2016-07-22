import { Layer } from './layer';
import { Fill as RenderableFill } from '../renderable/fill';
import { FillMesh } from '../mesh/fillMesh';
import { LayerRender } from '../render/layerRender';
import { LayerShader } from '../shader/layerShader';
export class FillLayerLayer extends Layer {
    constructor(options) {
        super(options);
        this._render = new LayerRender(options.context.gl,
            LayerShader.FillVertexSource, LayerShader.FillFragmentSource);
    }
    _buildRenderObjects() {
        this.source.getFill().forEach(line => {
            const renderablePolygon = new RenderableFill({
                mesh: new FillMesh(line),
                material: undefined
            });
            this._renderList.push(renderablePolygon);
        });
    }
}
