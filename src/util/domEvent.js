/**
 * Created by zhangwenjin on 2016/7/13.
 */
export class DomEvent {
    /**
     * @function on(obj: HTMLElement, types: [], fn: Function, context?: Object): this
     * Adds a listener function (`fn`) to a particular DOM event type of the
     * element `obj`. You can optionally specify the context of the listener
     * (object the `this` keyword will point to).
    */
    static on(obj, types, fn, context) {
        for (let type in types) {
            this._on(obj,  types[type], fn,context);
        }
        return this;
    }
    /**
     * @function un(obj: HTMLElement, types: [], fn: Function, context?: Object): this
     * Removes a previously added listener function. If no function is specified,
     * it will remove all the listeners of that particular DOM event from the element.
     * Note that if you passed a custom context to on, you must pass the same
     * context to `un` in order to remove the listener.
     */
    static un (obj, types, fn, context) {
            for (var type in types) {
                this._un(obj,  types[type], fn,context);
            }
        return this;
    }
    static _on (obj, type, fn, context) {
        let self = this;
        let handler = function (e) {
            return fn.call(context || obj, e || window.event);
        };

        let originalHandler = handler;

        if ('addEventListener' in obj) {

            if (type === 'mousewheel') {
                obj.addEventListener('onwheel' in obj ? 'wheel' : 'mousewheel', handler, false);

            } else if ((type === 'mouseenter') || (type === 'mouseleave')) {
                handler = function (e) {
                    e = e || window.event;
                    if (self._isExternalTarget(obj, e)) {
                        originalHandler(e);
                    }
                };
                obj.addEventListener(type === 'mouseenter' ? 'mouseover' : 'mouseout', handler, false);

            } else {
                obj.addEventListener(type, handler, false);
            }

        } else if ('attachEvent' in obj) {
            obj.attachEvent('on' + type, handler);
        }
        return this;
    }
    static _un (obj, type, fn, context) {

       if ('removeEventListener' in obj) {

            if (type === 'mousewheel') {
                obj.removeEventListener('onwheel' in obj ? 'wheel' : 'mousewheel', handler, false);

            } else {
                obj.removeEventListener(
                    type === 'mouseenter' ? 'mouseover' :
                        type === 'mouseleave' ? 'mouseout' : type, handler, false);
            }

        } else if ('detachEvent' in obj) {
            obj.detachEvent('on' + type, handler);
        }
        return this;
    }
    /**
     * check if element really left/entered the event target (for mouseenter/mouseleave)
     */
    static _isExternalTarget (el, e) {

        var related = e.relatedTarget;

        if (!related) {
            return true;
        }

        try {
            while (related && (related !== el)) {
                related = related.parentNode;
            }
        } catch (err) {
            return false;
        }
        return (related !== el);
    }
}
