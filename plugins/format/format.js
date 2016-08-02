/* created by Alex */
import { Observable } from '../../src/util/observable';
import { Const } from '../../src/const';

export class Format extends Observable {
    constructor() {
        super();
        /* map between geomtype and layerType */
        this.TypeTable = {
            Point: 'point',
            LineString: 'line',
            Polygon: 'fill'
        };
        this._features = [];
    }

    /* parse features from datasource */
    readFeatures(data) {
    }

    /* return opt which can be used by VectorSource*/
    forRender() {
        const lconfig = {};
        const features = this._features;
        let tmpcoords = [];
        let feature;
        let geom;
        let coords;
        let gtype = null;
        if (features.length < 1) return null;
        gtype = features[0].geom.type;
        for (let i = 0; i < features.length; i++) {
            feature = features[i];
            geom = feature.geom;
            coords = geom.coords;
            /* coord of one geometry. maybe point[x,y]
             * line[[x,y],[x,y]], poly[[[x,y],[x,y],[x,y]]]
            */
            if (geom.type === Const.GeomType.POINT) {
                tmpcoords.push(coords);
            } else if (geom.type === Const.GeomType.LINE) {
                tmpcoords.push(coords);
            } else if (geom.type === Const.GeomType.POLYGON) {
                tmpcoords.push(coords[0]);
            }
        }
        if (geom.type === Const.GeomType.POINT) {
            const tmp = tmpcoords;
            tmpcoords = [];
            tmpcoords.push(tmp);
        }
        /* 之前的source 现在对应于 featues */
        lconfig.type = this.TypeTable[gtype];
        lconfig.source = {
            id: 1,
            coordinates: JSON.stringify(tmpcoords),
            type: this.TypeTable[gtype]
        };
        return lconfig;
    }

    /* parse one multline geometry to single lines */
    createLines(gcoords, attr) {
    }

    /* parse one multpolygon geometry to single polygons */
    createPolygons(gcoords, attr) {
    }

    /* write2datasource from features */
    writeFeatures(features) {
    }
}
