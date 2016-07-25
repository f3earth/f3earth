import { Layer } from './layer';
import { Line as RenderableLine } from '../renderable/line';
import { CircleMesh } from '../mesh/circleMesh';
import { LayerRender } from '../render/layerRender';
import { LayerShader } from '../shader/layerShader';
export class CircleLayer extends Layer {
    constructor(options) {
        super(options);
        this._render = new LayerRender(options.context.gl,
            LayerShader.lineVertexSource, LayerShader.lineFragmentSource);
    }
    _buildRenderObjects() {
        const renderableCircle = new RenderableLine({
            mesh: new CircleMesh({
                center: this.source.getCenter(),
                radius: this.source.getRadius()
            }),
            material: undefined
        });
        this._renderObjects.push(renderableCircle);
    }
}
