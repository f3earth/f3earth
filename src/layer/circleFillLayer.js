import { Layer } from './layer';
import { CircleFill as RenderableCircleFill } from '../renderable/circleFill';
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
        const renderableCircle = new RenderableCircleFill({
            mesh: new CircleFillMesh({
                center: this.source.getCenter(),
                radius: this.source.getRadius()
            }),
            material: undefined
        });
        this._renderObjects.push(renderableCircle);
    }
}
