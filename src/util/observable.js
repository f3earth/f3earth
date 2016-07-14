/**
 * Methods mixed in to other classes for observe capabilities.
 * @mixin Observable
 */
export class Observable {
    constructor() {}

    /**
     * Subscribe to a specified observe with a listener function the latter gets the data object that was passed to `fire` and additionally `target` and `type` properties
     *
     * @param {string} type Observable type
     * @param {Function} listener Function to be called when the event is fired
     * @returns {Object} `this`
     */
    on(type, listener) {
        this._listens = this._listens || {};
        this._listens[type] = this._listens[type] || [];
        this._listens[type].push(listener);
        return this;
    }

    /**
     * Remove a observe listener
     *
     * @param {string} [type] Observable type. If none is specified, remove all listeners
     * @param {Function} [listener] Function to be called when the observe is trigger. If none is specified all listeners are removed
     * @returns {Object} `this`
     */
    un(type, listener) {
        if (!type) {
            return this;
        }

        if (!this.hasListens(type)) return this;

        if (listener) {
            let idx = this._listens[type].indexOf(listener);
            if (idx >= 0) {
                this._listens[type].splice(idx, 1);
            }
            if (!this._listens[type].length) {
                delete this._listens[type];
            }
        } else {
            delete this._listens[type];
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
    once(type, listener) {
        let wrapper = function (data) {
            this.un(type, wrapper);
            listener.call(this, data);
        }.bind(this);
        this.on(type, wrapper);
        return this;
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
        let event = {};
        Object.assign(event, data);
        Object.assign(event, {
            type: type,
            target: this
        });

        // make sure adding/removing listeners inside other listeners won't cause infinite loop
        let listeners = this._listens[type].slice();
        listeners.forEach(function (listener) {
            listener.call(this, event);
        }, this);
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