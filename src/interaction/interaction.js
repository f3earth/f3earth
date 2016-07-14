/**
 * Created by zhangwenjin on 2016/7/13.
 * @class Interaction
 * Abstract class for earth interaction handlers
 */

export class Interaction{
    constructor() {
        this._earth = null;
        this._enabled=false;
    }
    setEarth(earth){
        this._earth=earth;
    }
    getEarth(){
       return this._earth;
    }
    enable(){
        if(this._enabled){return this;}
        this._enabled=true;
        this.addHandle();
        return this;
    }
    disable () {
        if (!this._enabled) {
            return this;
        }

        this._enabled = false;
        this.removeHandle();
        return this;
    }
    enabled () {
        return !!this._enabled;
    }

}
