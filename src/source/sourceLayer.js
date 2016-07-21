import { Const } from '../const';
import { RasterTileLayer } from '../layer/rasterTileLayer';
import { Layer } from '../layer/layer';
import { TileSource } from './tileSource';
import { LineSource } from './lineSource';
import { PolygonSource } from './polygonSource';
export class SourceLayer {
    static from(context, layerConfig) {
        if (layerConfig.type === Const.LayerType.RASTER_TILE) {
            return new RasterTileLayer({
                source: new TileSource(layerConfig.url),
                view: { zoom: 3 },
                context
            });
        } else if (layerConfig.type === Const.LayerType.LINE) {
            return new Layer({
                source: new LineSource(layerConfig.source),
                view: { zoom: 3 },
                context
            });
        } else if (layerConfig.type === Const.LayerType.POLYGON) {
            return new Layer({
                source: new PolygonSource(layerConfig.source),
                view: { zoom: 3 },
                context
            });
        }

        return null;
    }
}
