import { Layer } from './layer';
import { Point as RenderablePoint } from '../renderable/point';
import { PointMesh } from '../mesh/pointMesh';
import { PointMaterial } from '../material/pointMaterial';
import { LayerRender } from '../render/layerRender';
import { LayerShader } from '../shader/layerShader';
export class PointLayer extends Layer {
    constructor(options) {
        super(options);
        this._render = new LayerRender(options.view.gl,
            LayerShader.pointVertexSource, LayerShader.pointFragmentSource);
        this._pointMaterial = new PointMaterial(this.style);
    }
    _buildRenderObjects() {
        // const imageMaterial = undefined;
        // if (this.style.image) {
        //     // load image

        //     // imageMaterial =
        // }
        this._renderObjects = [];
        const points = this.source.getPoints();
        if (points.length === 0) {
            return;
        }
        this._renderObjects.push(new RenderablePoint({
            mesh: new PointMesh(this.source.getPoints()[0]),
            material: this._pointMaterial
        }));
    }
}
