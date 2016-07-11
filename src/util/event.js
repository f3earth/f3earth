/**
 * Methods mixed in to other classes for event capabilities.
 * @mixin Evented
 */
export class Event {
    constructor() {
    }
    /**
     * Subscribe to a specified event with a listener function the latter gets the data object that was passed to `fire` and additionally `target` and `type` properties
     *
     * @param {string} type Event type
     * @param {Function} listener Function to be called when the event is fired
     * @returns {Object} `this`
     */
    on(type, listener) {
        this._events = this._events || {};
        this._events[type] = this._events[type] || [];
        this._events[type].push(listener);
        return this;
    }

    /**
     * Remove a event listener
     *
     * @param {string} [type] Event type. If none is specified, remove all listeners
     * @param {Function} [listener] Function to be called when the event is fired. If none is specified all listeners are removed
     * @returns {Object} `this`
     */
    un(type, listener) {
        if (!type) {
            return this;
        }

        if (!this.hasListens(type)) return this;

        if (listener) {
            let idx = this._events[type].indexOf(listener);
            if (idx >= 0) {
                this._events[type].splice(idx, 1);
            }
            if (!this._events[type].length) {
                delete this._events[type];
            }
        } else {
            delete this._events[type];
        }

        return this;
    }
    unAll() {
        delete this._events;
        return this;
    }
    /**
     * Call a function once when an event has fired
     *
     * @param {string} type Event type.
     * @param {Function} listener Function to be called once when the event is fired
     * @returns {Object} `this`
     */
    once(type, listener) {
        let wrapper = function(data) {
            this.off(type, wrapper);
            listener.call(this, data);
        }.bind(this);
        this.on(type, wrapper);
        return this;
    }

    /**
     * Fire event of a given string type with the given data object
     *
     * @param {string} type Event type
     * @param {Object} [data] Optional data passed to the event receiver (e.g. {@link EventData})
     * @returns {Object} `this`
     */
    trigger(type, data) {
        if (!this.hasListens(type)) return this;
        let new_data={};
        Object.assign(new_data,data);
        Object.assign(new_data,{type: type, target: this});

        // make sure adding/removing listeners inside other listeners won't cause infinite loop
        let listeners = this._events[type].slice();
        listeners.forEach(function (listener) {
            listener.call(this,new_data);
        },this);
        return this;
    }

    /**
     * Check if an event is registered to a type
     * @param {string} type Event type
     * @returns {boolean} `true` if there is at least one registered listener for events of type `type`
     */
    hasListens(type) {
        return !!(this._events && this._events[type]);
    }
};

