/**
 * Methods mixed in to other classes for observe capabilities.
 * @mixin Observable
 */
export class Observable {
    constructor() {
    }
    /**
     * Subscribe to a specified observe with a listener function the latter gets the data object that was passed to `fire` and additionally `target` and `type` properties
     *
     * @param {string} type Observable type
     * @param {Function} listener Function to be called when the event is fired
     * @returns {Object} `this`
     */
    on(type, listener,thisObj) {
        this._listens = this._listens || {};
        this._listens[type] = this._listens[type] || [];
        let newListener={fn: listener, ctx: thisObj};
        this._listens[type].push(newListener);
        return this;
    }

    /**
     * Remove a observe listener
     *
     * @param {string} [type] Observable type. If none is specified, remove all listeners
     * @param {Function} [listener] Function to be called when the observe is trigger. If none is specified all listeners are removed
     * @returns {Object} `this`
     */
    un(type, listener,thisObj) {
        if (!type) {
            return this;
        }
        if (!this.hasListens(type)) return this;
        for(let i=0,len=this._listens[type].length;i<len;i++){
            let l=this._listens[type][i];
            if(len>1) {
                if (l.fn === listener) {
                    this._listens[type].splice(i, 1);
                    break;
                }
            }else {
                delete this._listens[type];
            }
        }

        return this;
    }
    unAll() {
        delete this._listens;
        return this;
    }
    /**
     * Call a function once when an observe has trigger
     *
     * @param {string} type Observable type.
     * @param {Function} listener Function to be called once when the event is trigger
     * @returns {Object} `this`
     */
    once(type, listener,thisObj) {
        let wrapper = function() {
            this.un(type, listener,thisObj);
            this.un(type,wrapper,thisObj);
        }.bind(this);
        return this
            .on(type,listener,thisObj)
            .on(type, wrapper,thisObj);
    }

    /**
     * trigger observe of a given string type with the given data object
     *
     * @param {string} type Observable type
     * @param {Object} [data] Optional data passed to the event receiver (e.g. {@link event})
     * @returns {Object} `this`
     */
    trigger(type, data) {
        if (!this.hasListens(type)) return this;
        let event={};
        Object.assign(event,data);
        Object.assign(event,{type: type, target: this});

        // make sure adding/removing listeners inside other listeners won't cause infinite loop
        let listeners = this._listens[type].slice();
        listeners.forEach(function (l) {
            l.fn.call(l.ctx||this,event);
        },this);
        return this;
    }

    /**
     * Check if an observe is registered to a type
     * @param {string} type Observable type
     * @returns {boolean} `true` if there is at least one registered listener for events of type `type`
     */
    hasListens(type) {
        return !!(this._listens && this._listens[type]);
    }
};

