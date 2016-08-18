import { Observable } from '../util/observable';
import { Const } from '../const';

export class VectorSource extends Observable {

    constructor(options) {
        super();
        this._id = options.id;
        this._type = options.type ? options.type : undefined;
        this._features = options.features
            ? options.features : undefined;
        this._coordinates = [];

        /* this._coordinates.push(lineCoordinates);*/
        this._radius = options.radius;
        this._center = options.center;
        this.forRender();
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
        return this;
    }

    addFeatures(features) {
        this._features.push(...features);
        this.forRender();
        return this;
    }

    remoteAllFeatures() {
        this._features = [];
        this._coordinates = [];
        this.forRender();
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
