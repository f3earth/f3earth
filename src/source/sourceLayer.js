import { RasterTileLayer } from '../layer/rasterTileLayer';
import { TileSource } from './tileSource';

export class SourceLayer {
    static from(context, layerConfig) {
        return new RasterTileLayer({
            source: new TileSource(layerConfig.url),
            view: { zoom: 3 },
            context
        });
    }
}
