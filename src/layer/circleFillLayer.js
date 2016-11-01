import { Layer } from './layer';
import { Fill as RenderableFill } from '../renderable/fill';
import { CircleFillMesh } from '../mesh/circleFillMesh';
import { FillMaterial } from '../material/fillMaterial';
import { LayerRender } from '../render/layerRender';
import { LayerShader } from '../shader/layerShader';
export class CircleFillLayer extends Layer {
    constructor(options) {
        super(options);
        this._render = new LayerRender(options.view.gl,
            LayerShader.fillVertexSource, LayerShader.fillFragmentSource);
    }
    _buildRenderObjects() {
        const renderableCircle = new RenderableFill({
            mesh: new CircleFillMesh({
                center: this.source.getCenter(),
                radius: this.source.getRadius()
            }),
            material: new FillMaterial(this.style)
        });
        this._renderObjects.push(renderableCircle);
    }
}
