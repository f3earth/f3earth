import { Layer } from './layer';
import { Fill as RenderableFill } from '../renderable/fill';
import { FillMesh } from '../mesh/fillMesh';
import { FillMaterial } from '../material/fillMaterial';
import { LayerRender } from '../render/layerRender';
import { LayerShader } from '../shader/layerShader';
export class FillLayer extends Layer {
    constructor(options) {
        super(options);
        this._render = new LayerRender(options.view.gl,
            LayerShader.fillVertexSource, LayerShader.fillFragmentSource);
    }
    _buildRenderObjects() {
        this.source.getFill().forEach(polygon => {
            const renderablePolygon = new RenderableFill({
                mesh: new FillMesh(polygon),
                material: new FillMaterial(this.style)
            });
            this._renderObjects.push(renderablePolygon);
        });
    }
}
