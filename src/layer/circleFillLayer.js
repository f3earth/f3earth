import { Layer } from './layer';
import { Fill as RenderableFill } from '../renderable/fill';
import { CircleFillMesh } from '../mesh/circleFillMesh';
import { LayerRender } from '../render/layerRender';
import { LayerShader } from '../shader/layerShader';
export class CircleFillLayer extends Layer {
    constructor(options) {
        super(options);
        this._render = new LayerRender(options.context.gl,
            LayerShader.circleFillVertexSource, LayerShader.circleFillFragmentSource);
    }
    _buildRenderObjects() {
        const renderableCircle = new RenderableFill({
            mesh: new CircleFillMesh({
                center: this.source.getCenter(),
                radius: this.source.getRadius()
            }),
            material: undefined
        });
        this._renderObjects.push(renderableCircle);
    }
}
