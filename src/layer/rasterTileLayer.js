import { Observable } from '../util/observable';
import { RasterTileLayerRender } from '../render/rasterTileLayerRender';
import { Tile as RenderTile } from '../renderable/tile';
import { TileMesh } from '../mesh/tileMesh';
import { ImageMaterial } from '../material/imageMaterial';

export class RasterTileLayer extends Observable {

    constructor(options) {
        super();
        this._source = options.source;
        this._view = options.view;
        this._render = new RasterTileLayerRender(options.context.gl);
        this._renderList = [];
        this._renderVersion = -1;
        this._camera = null;
    }

    render(camera) {
        this._camera = camera;
        this._buildRenderList();

        this._render.render(this._renderList, camera);
        this._renderVersion = this._renderVersion + 1;
    }

    _buildRenderList() {
        // this._renderList = [];
        const zoom = this._view.zoom;
        // todo: get render list according to view range
        const count = 1 << zoom;
        for (let row = 0; row < count; row++) {
            for (let col = 0; col < count; col++) {
                if (this._exist(zoom, row, col)) {
                    continue;
                }

                const image = this._source.getTileImage(zoom, row, col);
                if (!image) {
                    continue;
                }
                const tile = new RenderTile({
                    mesh: new TileMesh({
                        zoom,
                        row,
                        col
                    }),
                    material: new ImageMaterial(image)
                });
                this._renderList.push(tile);
            }
        }
    }

    _exist(zoom, row, col) {
        const findIndex = this._renderList.findIndex(
            (tile) => tile.mesh.zoom === zoom && tile.mesh.row === row && tile.mesh.col === col);
        return findIndex !== -1;
    }

    get source() {
        return this._source;
    }
}
