import { Observable } from '../util/observable';
import { LayerRender } from '../render/layerRender';
import { LayerShader } from '../shader/layerShader';

import { Image as RenderImage } from '../renderable/image';
import { ExtentMesh } from '../mesh/extentMesh';
import { ImageMaterial } from '../material/imageMaterial';

export class StaticImageLayer extends Observable {

    constructor(options) {
        super();
        this._source = options.source;
        this._view = options.view;
        this._render = new LayerRender(options.view.gl,
            LayerShader.imageVertexSource, LayerShader.imageFragmentSource);
        this._renderImage = [];
        this._renderVersion = -1;
    }

    render(camera) {
        this._prepareImage();
        this._render.render(this._renderImage, camera);
    }

    _prepareImage() {
        if (this._renderImage.length === 0) {
            const image = this._source.image;
            if (image) {
                const renderImage = new RenderImage({
                    mesh: new ExtentMesh(this._source.extent),
                    material: new ImageMaterial(image)
                });
                this._renderImage.push(renderImage);
            }
        }
    }

    get source() {
        return this._source;
    }
}
