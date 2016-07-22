import { Layer } from './layer';
import { Polygon as RenderablePolygon } from '../renderable/polygon';
import { PolygonMesh } from '../mesh/polygonMesh';
import { LayerRender } from '../render/layerRender';
import { LayerShader } from '../shader/layerShader';
export class FillLayerLayer extends Layer {
    constructor(options) {
        super(options);
        this._render = new LayerRender(options.context.gl,
            LayerShader.PolygonVertexSource, LayerShader.PolygonFragmentSource);
    }
    _buildRenderObjects() {
        this.source.getPolygon().forEach(line => {
            const renderablePolygon = new RenderablePolygon({
                mesh: new PolygonMesh(line),
                material: undefined
            });
            this._renderList.push(renderablePolygon);
        });
    }
}
