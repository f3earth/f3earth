
import { Observable } from '../util/observable';
import { Const } from '../const';

export class TileSource extends Observable {
    constructor(url) {
        super();
        this._url = url;
        this._images = {};
        this._waitRequests = [];
        this._waitRequestsKey = {};
        this._runing = false;
        this._loadedCount = 0;
    }

    getTileImage(zoom, row, col) {
        const key = `${zoom}-${row}-${col}`;

        if (this._images[key]) {
            return this._images[key];
        } else if (this._waitRequestsKey[key]) {
            return null;
        }

        this._waitRequests.push({
            zoom, row, col
        });
        this._waitRequestsKey[key] = true;
        if (!this._runing) {
            this._runing = true;
            const firstTile = this._waitRequests[0];
            this._loadTileImage(firstTile.zoom, firstTile.row, firstTile.col);
        }
        return null;
    }

    _loadTileImage(zoom, row, col) {
        const key = `${zoom}-${row}-${col}`;
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
            this._loadedCount++;
            if (this._loadedCount >= 4) {
                this.trigger(Const.SourceEventType.CHANGE, { zoom, row, col, image });
                this._loadedCount = 0;
            }

            if (this._waitRequests.length > 0) {
                const firstTile = this._waitRequests[0];
                if (firstTile.zoom === zoom && firstTile.row === row && firstTile.col === col) {
                    this._waitRequests.shift();
                }
            }
            delete this._waitRequestsKey[key];

            if (this._waitRequests.length === 0) {
                this._runing = false;
                this.trigger(Const.SourceEventType.CHANGE, { zoom, row, col, image });
                this._loadedCount = 0;
            } else {
                this._runing = true;
                const firstTile = this._waitRequests[0];
                this._loadTileImage(firstTile.zoom, firstTile.row, firstTile.col);
            }
        }).catch(error => {
            console.error(error);
            if (this._waitRequests.length > 0) {
                const firstTile = this._waitRequests[0];
                if (firstTile.zoom === zoom && firstTile.row === row && firstTile.col === col) {
                    this._waitRequests.shift();
                }
            }
            delete this._waitRequestsKey[key];

            if (this._waitRequests.length === 0) {
                this._runing = false;
                this.trigger(Const.SourceEventType.CHANGE, { zoom, row, col, image: undefined });
                this._loadedCount = 0;
            } else {
                this._runing = true;
                const firstTile = this._waitRequests[0];
                this._loadTileImage(firstTile.zoom, firstTile.row, firstTile.col);
            }
        });
    }

    removeWaitRequests() {
        this._waitRequests = [];
        this._waitRequestsKey = {};
    }
}
