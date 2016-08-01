/**
 * Created by zhangwenjin on 2016/7/13.
 */
import { Util } from './util';
export class DomEvent {
    /**
     * @function on(obj: HTMLElement, types: [], fn: Function, context?: Object): this
     * Adds a listener function (`fn`) to a particular DOM event type of the
     * element `obj`. You can optionally specify the context of the listener
     * (object the `this` keyword will point to).
     * space-separated types (e.g. `'click dblclick'`).
    */
    static on(obj, types, fn, context) {
        let typesArray = types;
        if (typeof types !== 'object') {
            typesArray = Util.splitWords(types);
        }
        typesArray.forEach(type => {
            this._on(obj, type, fn, context);
        });
        return this;
    }
    /**
     * @function un(obj: HTMLElement, types: [], fn: Function, context?: Object): this
     * Removes a previously added listener function. If no function is specified,
     * it will remove all the listeners of that particular DOM event from the element.
     * Note that if you passed a custom context to on, you must pass the same
     * context to `un` in order to remove the listener.
     */
    /** now no need to use this method,so not suppot this function
    * static un(obj, types, fn, context) {
    *    types.forEach(type => this._un(obj, type, fn, context));
    *    return this;
    * }
    */
    static _on(obj, type, fn, context) {
        const self = this;
        let handler = (e) => fn.call(context || obj, e || window.event);

        const originalHandler = handler;

        if ('addEventListener' in obj) {
            if (type === 'mousewheel') {
                obj.addEventListener('onwheel' in obj ? 'wheel' : 'mousewheel', handler, false);
            } else if ((type === 'mouseenter') || (type === 'mouseleave')) {
                handler = (e) => {
                    const event = e || window.event;
                    if (self._isExternalTarget(obj, event)) {
                        originalHandler(event);
                    }
                };
                obj.addEventListener(type === 'mouseenter'
                                    ? 'mouseover' : 'mouseout', handler, false);
            } else {
                obj.addEventListener(type, handler, false);
            }
        } else if ('attachEvent' in obj) {
            obj.attachEvent(`on${type}`, handler);
        }
        return this;
    }

    // static _un(obj, type, fn, context) {
    //     if ('removeEventListener' in obj) {
    //         if (type === 'mousewheel') {
    //             obj.removeEventListener('onwheel' in obj ? 'wheel' : 'mousewheel', fn, false);
    //         } else {
    //             let eventType = type;
    //             if (type === 'mouseenter') {
    //                 eventType = 'mouseover';
    //             } else if (type === 'mouseleave') {
    //                 eventType = 'mouseout';
    //             }
    //             obj.removeEventListener(
    //                 eventType, fn, false);
    //         }
    //     } else if ('detachEvent' in obj) {
    //         obj.detachEvent(`on${type}`, fn);
    //     }
    //     return this;
    // }

    /**
     * check if element really left/entered the event target (for mouseenter/mouseleave)
     */
    static _isExternalTarget(el, e) {
        let related = e.relatedTarget;

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
