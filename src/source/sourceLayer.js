import { Const } from '../const';
import { RasterTileLayer } from '../layer/rasterTileLayer';
import { FillLayer } from '../layer/fillLayer';
import { LineLayer } from '../layer/lineLayer';
import { PointLayer } from '../layer/pointLayer';
import { CircleLayer } from '../layer/circleLayer';
import { CircleFillLayer } from '../layer/circleFillLayer';
import { StaticImageLayer } from '../layer/staticImageLayer';
import { Source } from './source';

export class SourceLayer {
    static create(view, layerOptions) {
        const source = Source.valueOf(layerOptions.source);
        if (!source) {
            return undefined;
        }

        const options = {
            source,
            view,
            style: layerOptions.style
        };

        if (layerOptions.type === Const.LayerType.RASTER_TILE) {
            return new RasterTileLayer(options);
        } else if (layerOptions.type === Const.LayerType.LINE) {
            return new LineLayer(options);
        } else if (layerOptions.type === Const.LayerType.FILL) {
            return new FillLayer(options);
        } else if (layerOptions.type === Const.LayerType.POINT) {
            return new PointLayer(options);
        } else if (layerOptions.type === Const.LayerType.CIRCLE) {
            return new CircleLayer(options);
        } else if (layerOptions.type === Const.LayerType.CIRCLE_FILL) {
            return new CircleFillLayer(options);
        } else if (layerOptions.type === Const.LayerType.IMAGE) {
            return new StaticImageLayer(options);
        }

        return null;
    }
}
