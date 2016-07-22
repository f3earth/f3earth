import { Const } from '../const';
import { RasterTileLayer } from '../layer/rasterTileLayer';
import { FillLayerLayer } from '../layer/fillLayer';
import { LineLayer } from '../layer/lineLayer';
import { TileSource } from './tileSource';
import { VectorSource } from './vectorSource';
export class SourceLayer {
    static from(context, layerConfig) {
        if (layerConfig.type === Const.LayerType.RASTER_TILE) {
            return new RasterTileLayer({
                source: new TileSource(layerConfig.url),
                view: { zoom: 3 },
                context
            });
        } else if (layerConfig.type === Const.LayerType.LINE) {
            return new LineLayer({
                source: new VectorSource(layerConfig.source),
                view: { zoom: 3 },
                context
            });
        } else if (layerConfig.type === Const.LayerType.POLYGON) {
            return new FillLayerLayer({
                source: new VectorSource(layerConfig.source),
                view: { zoom: 3 },
                context
            });
        }

        return null;
    }
}
