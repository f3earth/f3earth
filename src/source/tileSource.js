import { Observable } from '../util/observable';

export class TileSource extends Observable {
    constructor(url) {
        super();
        this._url = url;
        this._images = {};
        this._imageLoading = {};
    }
    
    getTileImage(zoom, row, col) {
        let key = zoom + '-' + row + '-' + col;
        
        if (this._images[key]) {
            return this._images[key];
        } else if (this._imageLoading[key]) {
            return null;
        }
        
        let imageUrl = this._url.replace('{x}', col).replace('{y}', row).replace('{z}', zoom);
        new Promise(function (resolve) {
            let image = new Image();
            image.crossOrigin = "Anonymous";
            image.onload = function () {
                resolve(image);
            };
            image.onerror = function(){
                reject("error");
            }
            image.src = imageUrl;
        }).then(function(image){
            this._images[key] = image;
            delete this._imageLoading[key];
            this.trigger('change', {zoom: zoom, row: row, col: col, image: image});
        }.bind(this));
        this._imageLoading[key] = true;
            
        return null;
    }
}