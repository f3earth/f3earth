import { Observable } from '../util/observable';
import { Const } from '../const';

export class StaticImageSource extends Observable {
    /**
     * {Object} options: {
     *  extent: {Array} extent [minX, minY, maxX, maxY]
     *  url: {String} image url
     *  }
     */
    constructor(options) {
        super();
        this._extent = options.extent;
        this._url = options.url;
        this._image = null;
        this._isLoading = false;
    }

    get image() {
        if (!this._image && !this._isLoading) {
            this._isLoading = true;
            new Promise((resolve, reject) => {
                const image = new Image();
                image.crossOrigin = 'Anonymous';
                image.onload = () => {
                    resolve(image);
                };
                image.onerror = () => {
                    reject('error');
                };
                image.src = this._url;
            }).then(image => {
                this._image = image;
                this._isLoading = false;
                this.trigger(Const.SourceEventType.CHANGE, {});
            }).catch(error => {
                console.error(error);
                this._isLoading = false;
            });
        }

        return this._image;
    }

    get extent() {
        return this._extent;
    }
}
