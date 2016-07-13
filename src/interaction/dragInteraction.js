/**
 * Created by zhangwenjin on 2016/7/13.
 */
// @class DragInteraction
// Abstract class for earth drag interaction handlers
export class DragInteraction {
    constructor() {
        super();
        this._isMouseDown = false;
        this._prevMouseX = null;
        this._prevMouseY = null;
    }
    addHandle(){
        
    }
    removeHandle(){
        
    }
}