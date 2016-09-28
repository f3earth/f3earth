import { Observable } from '../util/observable';
import { Format } from './format';
import { Const } from '../const';

function XHR() {
    this._xhr = new XMLHttpRequest();
    this._url = '';
    this._err = null;

    /*
        * XHR.send
        * @url: url response data
        * @err: function to handle err when get data
    */
    this.get = function (url, callback, err) {
        this._url = url;
        const tmpxhr = this._xhr;
        this._xhr.onreadystatechange = function () {
            if (tmpxhr.readyState === 4) {
                if (tmpxhr.status === 200) {
                    const responseText = tmpxhr.responseText;
                    if (callback) {
                        callback(responseText);
                    }
                    return responseText;
                }
                return err;
            }
            return err;
        };
        tmpxhr.open('GET', url);
        tmpxhr.send(null);
    };
}

export class VectorSource extends Observable {

    /**
     * {Object} options: {
     *  id: {String} source id
     *  type: {String} source type: vector
     *  format: {String} such as `geojson, wkt`
     *  url: {geojson} geojson features
     *  }
     */
    constructor(options) {
        super();
        this._id = options.id;
        this._type = options.type ? options.type : undefined;
        this._features = [];
        this._coordinates = [];

        /* this._coordinates.push(lineCoordinates);*/
        this._radius = options.radius;
        this._center = options.center;
        this.forRender();

        if (options.url && options.url.length > 0) {
            // load vector features
            if (options.format) {
                const xhr = new XHR();
                // xhr.get('data/major_cities.json', loadJSON2);
                // xhr.get('data/JPN_line.json', loadJSON2);
                xhr.get(options.url, (data) => {
                    const format = Format.get(options.format);
                    if (format) {
                        const features = format.readFeatures(data);
                        if (features.length > 0) {
                            this.addFeatures(features);
                        }
                    }
                });
            }
        }
    }

    get id() {
        return this._id;
    }

    /*
     *format features to coordinates which can be used by VectorSource constructor
    */
    forRender() {
        const features = this._features;
        let feature;
        let geom;
        let coords;
        if (features.length < 1) return;
        for (let i = 0; i < features.length; i++) {
            feature = features[i];
            geom = feature.geometry;
            coords = geom.coords;
            /* coord of one geometry. maybe point[x,y]
             * line[[x,y],[x,y]], poly[[[x,y],[x,y],[x,y]]]
            */
            if (geom.type === Const.GeomType.POINT) {
                this._coordinates.push(coords);
            } else if (geom.type === Const.GeomType.LINE) {
                this._coordinates.push(coords);
            } else if (geom.type === Const.GeomType.POLYGON) {
                this._coordinates.push(coords[0]);
            }
        }
        if (geom.type === Const.GeomType.POINT) {
            const tmp = this._coordinates;
            this._coordinates = [];
            this._coordinates.push(tmp);
        }
    }

    addFeature(feature) {
        this._features.push(feature);
        this.forRender();
        this.trigger(Const.SourceEventType.CHANGE);
        return this;
    }

    addFeatures(features) {
        this._features.push(...features);
        this.forRender();
        this.trigger(Const.SourceEventType.CHANGE);
        return this;
    }

    removeAllFeatures() {
        this._features = [];
        this._coordinates = [];
        this.forRender();
        this.trigger(Const.SourceEventType.CHANGE);
        return this;
    }

    getFeatures() {
        return this._coordinates;
    }
    getLines() {
        return this._coordinates;
    }
    getPoints() {
        return this._coordinates;
    }
    getFill() {
        return this._coordinates;
    }
    getCenter() {
        return this._center;
    }
    getRadius() {
        return this._radius;
    }

}
