import { Const } from '../const';
import { RasterTileSource } from './rasterTileSource';
import { VectorSource } from './vectorSource';

const ALL_SOURCE = {};

export class Source {
    static valueOf(params) {
        if (!params) {
            return undefined;
        }

        if (Object.prototype.toString.call(params) ===
            '[object String]') {
            return ALL_SOURCE[params];
        }

        if (!params.id) {
            throw new Error('id is required!');
        }
        if (!params.type) {
            throw new Error('type is required!');
        }
        return this._createSource(params);
    }

    static get(id) {
        return ALL_SOURCE[id];
    }

    static _createSource(params) {
        if (params.type === Const.SourceType.RASTER_TILE) {
            const source = new RasterTileSource(params);
            ALL_SOURCE[source.id] = source;
            return source;
        } else if (params.type === Const.SourceType.VECTOR) {
            const source = new VectorSource(params);
            ALL_SOURCE[source.id] = source;
            return source;
        }

        return undefined;
    }
}

