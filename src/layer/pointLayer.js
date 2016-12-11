import { Const } from '../const';
import { Layer } from './layer';
import { Point as RenderablePoint } from '../renderable/point';
import { PointMesh } from '../mesh/pointMesh';
import { ImagePointMesh } from '../mesh/imagePointMesh';
import { PointMaterial } from '../material/pointMaterial';
import { ImageMaterial } from '../material/imageMaterial';
import { LayerRender } from '../render/layerRender';
import { LayerShader } from '../shader/layerShader';

export class PointLayer extends Layer {
    constructor(options) {
        super(options);
        this._gl = options.view.gl;
        if (this.style.image) {
            this._render = new LayerRender(options.view.gl,
                LayerShader.imagePointVertexSource, LayerShader.imageFragmentSource);
            new Promise((resolve, reject) => {
                const image = new Image();
                image.crossOrigin = 'Anonymous';
                image.onload = () => {
                    resolve(image);
                };
                image.onerror = () => {
                    reject('error');
                };
                image.src = this.style.image;
            }).then(image => {
                this._pointMaterial = new ImageMaterial(image, false);
                this._pointMaterial.style = this.style;
                this._renderVersion = -1;
                this.trigger(Const.SourceEventType.CHANGE, {});
            }).catch(error => {
                console.error(error);
            });
        } else {
            this._render = new LayerRender(options.view.gl,
                LayerShader.pointVertexSource, LayerShader.pointFragmentSource);
            this._pointMaterial = new PointMaterial(this.style);
        }
    }

    _buildRenderObjects() {
        if (this._renderObjects.length > 0) {
            this._renderObjects.forEach(object => object.mesh.destroy(this._gl));
        }
        this._renderObjects = [];
        const points = this.source.getPoints();
        if (points.length === 0) {
            return;
        }
        if (!this._pointMaterial) {
            return;
        }

        // point with image
        if (this.style.image) {
            this._renderObjects.push(new RenderablePoint({
                mesh: new ImagePointMesh(points[0]),
                material: this._pointMaterial
            }));
        } else {
            this._renderObjects.push(new RenderablePoint({
                mesh: new PointMesh(points[0]),
                material: this._pointMaterial
            }));
        }
    }
}
