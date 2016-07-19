import { RasterTileLayer } from '../layer/rasterTileLayer';
import { LineLayer } from '../layer/lineLayer';
import { TileSource } from './tileSource';
import { VectorSource } from './vectorSource';

export class SourceLayer {
    static from(context, layerConfig) {
        return new RasterTileLayer({
            source: new TileSource(layerConfig.url),
            view: { zoom: 3 },
            context
        });
    }

    static createLineLayer(context) {
        return new LineLayer({
            source: new VectorSource(),
            view: { zoom: 3 },
            context
        });
    }
}
