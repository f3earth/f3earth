import { Const } from '../const';
import { RasterTileSource } from './rasterTileSource';
import { VectorSource } from './vectorSource';

const ALL_SOURCE = {};

export class Source {
    static valueOf(options) {
        if (!options) {
            return undefined;
        }

        if (Object.prototype.toString.call(options) ===
            '[object String]') {
            return ALL_SOURCE[options];
        }

        if (!options.id) {
            throw new Error('id is required!');
        }
        if (!options.type) {
            throw new Error('type is required!');
        }
        return this._createSource(options);
    }

    static get(id) {
        return ALL_SOURCE[id];
    }

    static _createSource(options) {
        if (options.type === Const.SourceType.RASTER_TILE) {
            const source = new RasterTileSource(options);
            ALL_SOURCE[source.id] = source;
            return source;
        } else if (options.type === Const.SourceType.VECTOR) {
            const source = new VectorSource(options);
            ALL_SOURCE[source.id] = source;
            return source;
        }

        return undefined;
    }
}

