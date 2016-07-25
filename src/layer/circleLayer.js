import { Layer } from './layer';
import { Circle as RenderableCircle } from '../renderable/circle';
import { CircleMesh } from '../mesh/circleMesh';
import { LayerRender } from '../render/layerRender';
import { LayerShader } from '../shader/layerShader';
export class CircleLayer extends Layer {
    constructor(options) {
        super(options);
        this._render = new LayerRender(options.context.gl,
            LayerShader.circleVertexSource, LayerShader.circleFragmentSource);
    }
    _buildRenderObjects() {
        const renderableCircle = new RenderableCircle({
            mesh: new CircleMesh({
                center: this.source.getCenter(),
                radius: this.source.getRadius()
            }),
            material: undefined
        });
        this._renderObjects.push(renderableCircle);
    }
}
