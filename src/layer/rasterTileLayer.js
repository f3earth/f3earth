import { RasterTileLayerRender } from '../render/rasterTileLayerRender';
import { Tile as RenderTile } from '../renderable/tile';
import { TileMesh } from '../mesh/tileMesh';
import { ImageMaterial } from '../material/imageMaterial';

export class RasterTileLayer {
    
    constructor(options) {
        this._source = options.source;
        this._view = options.view;
        this._render = new RasterTileLayerRender(options.context.gl);
        this._renderList = [];
        this._renderVersion = -1;
        this._camera = null;
        
        this._source.on('change', function(event){
            this._rerender(this._camera);
        }.bind(this));
    }
    
    render(camera) {
        this._camera = camera;
        if (this._renderVersion === -1) {
            this._buildRenderList();
        }
        
        this._render.render(this._renderList, camera);
        this._renderVersion = this._renderVersion + 1;
    }
    
    _rerender(camera) {
        this._buildRenderList();
        this._render.render(this._renderList, camera);
        this._renderVersion = this._renderVersion + 1;
    }
    
    _buildRenderList() {
        this._renderList = [];
        let zoom = this._view.zoom;
        // todo: get render list according to view range
        let count = 1 << zoom;
        for (let row = 0; row < count; row++) {
            for (let col = 0; col < count; col++) {
                let image = this._source.getTileImage(zoom, row, col);
                if (!image) {
                    continue;
                }
                let tile = new RenderTile({
                    mesh: new TileMesh({
                        zoom: zoom, 
                        row: row, 
                        col: col
                    }),
                    material: new ImageMaterial(image) 
                });
                this._renderList.push(tile);
            }
        }
    }

}