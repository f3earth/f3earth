import proj4 from 'proj4';
import { Const } from '../const';

const MERCATOR_PROJECTION = `+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 
    +a=${Const.EARTH_RADIUS} +b=${Const.EARTH_RADIUS} 
    +towgs84=0,0,0,0,0,0,0 +units=m +no_defs`;

const MERCATOR_PROJ = proj4(MERCATOR_PROJECTION);

export class Proj {
    /*
     * convert mercator coordinate to wgs84
     * @param {Number} x mercator
     * @param {Number} y
     * @return {lat, lng}
     */
    static mercator2Wgs84(x, y) {
        // more detail: https://github.com/proj4js/proj4js
        //   http://api.geo.admin.ch/main/wsgi/lib/proj4js/proj4js/
        const point = MERCATOR_PROJ.inverse([x, y]);
        return {
            lat: point[1],
            lng: point[0]
        };
    }

    /*
     * convert wgs84 coordinate to mercator
     * @param {Number} lng mercator
     * @param {Number} lat
     * @return {x, y}
     */
    static wgs842Mercator(lng, lat) {
        // more detail: https://github.com/proj4js/proj4js
        //   http://api.geo.admin.ch/main/wsgi/lib/proj4js/proj4js/
        const point = MERCATOR_PROJ.forward([lng, lat]);
        return {
            y: point[1],
            x: point[0]
        };
    }
}
