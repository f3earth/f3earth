/* geojsonformat.js */
/* created by Alex */
import { Format } from './format';
import { Const } from '../../src/const';
import { Feature } from '../../src/feature/feature';
import { Point } from '../../src/feature/point';
import { LineString } from '../../src/feature/linestring';
import { Polygon } from '../../src/feature/polygon';

export class GeoJSON extends Format {
    constructor() {
        super();
        this._ext = ['json', 'geojson'];
    }

    /* parse features from geojsonstr, coords: total coords.
     * gcoords is extracted from geoJSON geometry
     */
    readFeatures(data) {
        let geomtype;
        let gcoords = [];
        let attr;
        let curfeature;
        let geodata = {};
        if (typeof (data) !== 'object') {
            // parse JSON string to Object.
            geodata = JSON.parse(data);
        } else {
            geodata = data;
        }
        // at least one feature.
        if (geodata.type === 'FeatureCollection' && geodata.features.length > 0) {
            for (let i = 0; i < geodata.features.length; i++) {
                /* according geomtype, call different function */
                curfeature = geodata.features[i];
                geomtype = curfeature.geometry.type;
                gcoords = curfeature.geometry.coordinates;
                attr = curfeature.properties;
                /* switch diff geom */
                switch (geomtype) {
                    case 'Point':
                        this._features.push(new Feature(new Point(gcoords), attr));
                        break;
                    case 'LineString':
                        this._features.push(new Feature(new LineString(gcoords), attr));
                        break;
                    case 'MultiLineString':
                        geomtype = Const.GeomType.LINE;
                        this.createLines(gcoords, attr);
                        break;
                    case 'Polygon':
                        this._features.push(new Feature(new Polygon(gcoords), attr));
                        break;
                    case 'MultiPolygon':
                        geomtype = Const.GeomType.POLYGON;
                        this.createPolygons(gcoords, attr);
                        break;
                    default:
                        throw new Error('Invalid GeoJSON object.');
                }
            }
        }
        this._geometryType = geomtype;
        return this;
    }

    createLines(gcoords, attr) {
        gcoords.forEach(gcoord => this._features.push(
                            new Feature(new LineString(gcoord), attr)));
    }

    createPolygons(gcoords, attr) {
        gcoords.forEach(gcoord => this._features.push(
                            new Feature(new Polygon(gcoord), attr)));
    }

    /* write2geojsonstr from features */
    writeFeatures(features) {
    }
}
