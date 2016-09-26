import { Observable } from '../util/observable';
import { RasterTileLayerRender } from '../render/rasterTileLayerRender';
import { Tile as RenderTile } from '../renderable/tile';
import { TileMesh } from '../mesh/tileMesh';
import { ImageMaterial } from '../material/imageMaterial';
import { Proj } from '../util/proj';
import { Const } from '../const';

export class RasterTileLayer extends Observable {

    constructor(options) {
        super();
        this._source = options.source;
        this._view = options.view;
        this._render = new RasterTileLayerRender(this._view.gl);
        this._renderList = [];
        this._renderVersion = -1;
        this._camera = null;
        this._tileRange = {};
        this._curZoom = 0;

        this._prepareRenderTiles = [];
    }

    render(camera) {
        this._camera = camera;
        this._buildRenderList();
        this._prepareTiles();

        this._render.render(this._prepareRenderTiles, camera);
        this._renderVersion = this._renderVersion + 1;
    }

    _prepareTiles() {
        // only the tiles of the current view of current zoom
        this._prepareRenderTiles = [];
        const count = 1 << this._curZoom;
        for (let row = this._tileRange.minTileY; row <= this._tileRange.maxTileY; row++) {
            const newRow = row % count;
            for (let col = this._tileRange.minTileX; col <= this._tileRange.maxTileX; col++) {
                const newCol = col % count;
                const tile = this._getRenderTile(this._curZoom, newRow, newCol);
                if (tile) {
                    this._prepareRenderTiles.push(tile);
                }
            }
        }

        // render low zoom's tiles firstly.
        this._prepareRenderTiles.sort((a, b) => a.mesh.zoom - b.mesh.zoom);
    }

    _getRenderTile(zoom, row, col) {
        if (row < 0 || col < 0) {
            return undefined;
        }
        const tile = this._findTile(zoom, row, col);
        if (tile) {
            return tile;
        }

        if (zoom === 2) {
            this._source.getTileImage(zoom, row, col);
        }

        if (zoom <= 2) {
            return undefined;
        }
        // find tile of prev zoom
        return this._getRenderTile(zoom - 1, Math.floor(row / 2), Math.floor(col / 2));
    }

    _calcTileRange(viewRange) {
        // calc
        // console.log(` ranges = ${JSON.stringify(viewRange)}`);
        const leftTop = Proj.wgs842Mercator(viewRange.minLng, viewRange.minLat);
        // console.log(` lefttop = ${JSON.stringify(leftTop)} `);
        const bottomRight = Proj.wgs842Mercator(viewRange.maxLng, viewRange.maxLat);
        // console.log(` bottomRight = ${JSON.stringify(bottomRight)} `);

        const perTileRange = this._view.getResolution(this._view.zoom) * 256;
        const minTileX = Math.floor((leftTop.x + Const.EARTH_RADIUS * Math.PI) / perTileRange);
        const minTileY = Math.floor((Const.EARTH_RADIUS * Math.PI - bottomRight.y) / perTileRange);

        let maxTileX = Math.ceil((bottomRight.x + Const.EARTH_RADIUS * Math.PI) / perTileRange);
        let maxTileY = Math.ceil((Const.EARTH_RADIUS * Math.PI - leftTop.y) / perTileRange);

        const count = 1 << this._view.zoom;
        if (maxTileX < minTileX) {
            maxTileX = maxTileX + count;
        }
        if (maxTileY < minTileY) {
            maxTileY = maxTileY + count;
        }

        return {
            minTileX,
            minTileY,
            maxTileX,
            maxTileY
        };
    }

    _buildRenderList() {
        // this._renderList = [];
        const zoom = this._view.zoom;
        // todo: get render list according to view range
        // const count = 1 << zoom;
        const count = 1 << zoom;
        // console.log(`cur zoom = ${zoom}`);
        this._curZoom = zoom;
        this._tileRange = this._calcTileRange(this._view.viewRange);
        this._source.removeWaitRequests();
        const tileList = this._buildRenderTilesList(this._tileRange);
        tileList.forEach(tilePos => {
            const newRow = tilePos.row % count;
            const newCol = tilePos.col % count;
            if (newRow < 0 || newCol < 0) {
                return;
            }
            const image = this._source.getTileImage(zoom, newRow, newCol);
            if (image) {
                const tile = new RenderTile({
                    mesh: new TileMesh({
                        zoom,
                        row: newRow,
                        col: newCol
                    }),
                    material: new ImageMaterial(image)
                });
                this._renderList.push(tile);
            }
        });
    }

    _buildRenderTilesList(tileRange) {
        // load tiles from center to outer
        const tileList = [];
        const centerRow = Math.floor((tileRange.minTileY + tileRange.maxTileY) / 2);
        const centerCol = Math.floor((tileRange.minTileX + tileRange.maxTileX) / 2);
        tileList.push({
            row: centerRow,
            col: centerCol
        });
        // console.log(`tileRange = ${JSON.stringify(tileRange)}`);
        // console.log(`calc center tileX = ${centerCol}, tileY = ${centerRow}`);

        let outIndex = 1;
        while (centerRow - outIndex >= tileRange.minTileY ||
                centerRow + outIndex <= tileRange.maxTileY ||
                centerCol - outIndex >= tileRange.minTileX ||
                centerCol + outIndex <= tileRange.maxTileX) {
            // top
            if (centerRow - outIndex >= tileRange.minTileY) {
                let startCol = centerCol - outIndex;
                if (startCol < tileRange.minTileX) {
                    startCol = tileRange.minTileX;
                }
                let endCol = centerCol + outIndex;
                if (endCol > tileRange.maxTileX) {
                    endCol = tileRange.maxTileX;
                }
                for (let index = startCol; index <= endCol; index++) {
                    tileList.push({
                        row: centerRow - outIndex,
                        col: index
                    });
                }
            }
            // left
            if (centerCol - outIndex >= tileRange.minTileX) {
                let startRow = centerRow - outIndex + 1;
                if (startRow < tileRange.minTileY) {
                    startRow = tileRange.minTileY;
                }
                let endRow = centerRow + outIndex - 1;
                if (endRow > tileRange.maxTileY) {
                    endRow = tileRange.maxTileY;
                }
                for (let index = startRow; index <= endRow; index++) {
                    tileList.push({
                        row: index,
                        col: centerCol - outIndex
                    });
                }
            }

            // right
            if (centerCol + outIndex <= tileRange.maxTileX) {
                let startRow = centerRow - outIndex + 1;
                if (startRow < tileRange.minTileY) {
                    startRow = tileRange.minTileY;
                }
                let endRow = centerRow + outIndex - 1;
                if (endRow > tileRange.maxTileY) {
                    endRow = tileRange.maxTileY;
                }
                for (let index = startRow; index <= endRow; index++) {
                    tileList.push({
                        row: index,
                        col: centerCol + outIndex
                    });
                }
            }

            // bottom
            if (centerRow + outIndex <= tileRange.maxTileY) {
                let startCol = centerCol - outIndex;
                if (startCol < tileRange.minTileX) {
                    startCol = tileRange.minTileX;
                }
                let endCol = centerCol + outIndex;
                if (endCol > tileRange.maxTileX) {
                    endCol = tileRange.maxTileX;
                }
                for (let index = startCol; index <= endCol; index++) {
                    tileList.push({
                        row: centerRow + outIndex,
                        col: index
                    });
                }
            }

            outIndex = outIndex + 1;
        }

        return tileList;
    }

    _findTile(zoom, row, col) {
        return this._renderList.find(
            (tile) => tile.mesh.zoom === zoom && tile.mesh.row === row && tile.mesh.col === col);
    }

    get source() {
        return this._source;
    }
}
