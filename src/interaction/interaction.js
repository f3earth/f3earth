/**
 * Created by zhangwenjin on 2016/7/13.
 */
// @class Interaction
// Abstract class for earth interaction handlers
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
    // @method enable(): this
    // Enables the interaction
    enable(){
        if(this._enabled){return this;}
        this._enabled=true;
        this.addHandle();
        return this;
    }
    // @method disable(): this
    // Disables the interaction
    disable () {
        if (!this._enabled) {
            return this;
        }

        this._enabled = false;
        this.removeHandle();
        return this;
    }
    // @method enabled(): Boolean
    // Returns `true` if the interaction is enabled
    enabled () {
        return !!this._enabled;
    }

}
