/* geojsonformat.js */
/* created by Alex */
import { Format } from '../../src/source/format';
import { Const } from '../../src/const';
import { Feature } from '../../src/feature/feature';
import { Point } from '../../src/feature/point';
import { MultiPoint } from '../../src/feature/multiPoint';
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
        const features = [];
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
                        features.push(new Feature(new Point(gcoords), attr));
                        break;
                    case 'MultiPoint':
                        features.push(new Feature(new MultiPoint(gcoords), attr));
                        break;
                    case 'LineString':
                        features.push(new Feature(new LineString(gcoords), attr));
                        break;
                    case 'MultiLineString':
                        geomtype = Const.GeomType.LINE;
                        this.createLines(gcoords, attr);
                        break;
                    case 'Polygon':
                        features.push(new Feature(new Polygon(gcoords), attr));
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
        return features;
    }

    createLines(gcoords, attr) {
        const features = [];
        gcoords.forEach(gcoord => features.push(
                            new Feature(new LineString(gcoord), attr)));
        return features;
    }

    createPolygons(gcoords, attr) {
        const features = [];
        gcoords.forEach(gcoord => features.push(
                            new Feature(new Polygon(gcoord), attr)));
        return features;
    }

    /* write2geojsonstr from features */
    writeFeatures(features) {
        throw new Error('unsupport!');
    }
}

Format.register('geojson', new GeoJSON());
