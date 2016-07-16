import { Observable } from '../util/observable';

export class TileSource extends Observable {
    constructor(url) {
        super();
        this._url = url;
        this._images = {};
        this._imageLoading = {};
    }

    getTileImage(zoom, row, col) {
        const key = `${zoom}-${row}-${col}`;

        if (this._images[key]) {
            return this._images[key];
        } else if (this._imageLoading[key]) {
            return null;
        }

        const imageUrl = this._url.replace('{x}', col).replace('{y}', row).replace('{z}', zoom);
        new Promise((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = 'Anonymous';
            image.onload = () => {
                resolve(image);
            };
            image.onerror = () => {
                reject('error');
            };
            image.src = imageUrl;
        }).then(image => {
            this._images[key] = image;
            delete this._imageLoading[key];
            this.trigger('change', { zoom, row, col, image });
        });
        this._imageLoading[key] = true;

        return null;
    }
}
