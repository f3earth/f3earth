/* created by Alex */
import { Observable } from '../../src/util/observable';
import { Const } from '../../src/const';
import { Feature } from '../../src/feature/feature';
import { Point } from '../../src/feature/point';
import { LineString } from '../../src/feature/linestring';
import { Polygon } from '../../src/feature/polygon';

const FORMATS = {};

export class Format extends Observable {
    constructor() {
        super();
        /* map between geomtype and layerType */
        this.TypeTable = {
            Point: Const.LayerType.POINT,
            LineString: Const.LayerType.LINE,
            Polygon: Const.LayerType.FILL
        };
        this._features = [];
        this._geometryType = '';
    }

    static register(formatName, format) {
        FORMATS[formatName] = format;
    }

    static get(formatName) {
        return FORMATS[formatName];
    }

    /* create layer config obj required by vectorsource. */
    createLayerConfig() {
        const layerconfig = {};
        layerconfig.type = this.TypeTable[this._geometryType];
        layerconfig.source = {
            id: 1,
            features: this._features.concat(),
            type: layerconfig.type
        };
        // clear cache in Formatter.
        this._features = [];
        this._geometryType = '';
        return layerconfig;
    }

    /* parse features from datasource */
    readFeatures(data) {
    }

    createPoint(gcoord, attr) {
        /* parse [x,y] to single Point feature */
        return new Feature(new Point(gcoord), attr);
    }

    createLine(gcoord, attr) {
        /* parse [[x,y],[x,y]] to single Line feature */
        return new Feature(new LineString(gcoord), attr);
    }

    createPolygon(gcoord, attr) {
        /* parse [[[x0,y0],[x1,y1] ... [x0,y0]]] to single Line feature */
        return new Feature(new Polygon(gcoord), attr);
    }

    createLines(gcoords, attr) {
        /* parse one multline geometry to single lines */
    }

    createPolygons(gcoords, attr) {
        /* parse one multline geometry to single lines */
    }

    /* write2datasource from features */
    writeFeatures(features) {
    }
}
