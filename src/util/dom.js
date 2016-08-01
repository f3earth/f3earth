import { Const } from '../const';
export class Dom {
    static setVisible(el, visible) {
        const style = el.style;
        style.display = visible ? '' : 'none';
    }
    static removeChildren(el) {
        let child = el.firstChild;
        while (child) {
            el.removeChild(child);
            child = el.firstChild;
        }
    }
    static getSize(el) {
        const offsetWidth = el.offsetWidth;
        const offsetHeight = el.offsetHeight;
        if (!offsetWidth || !offsetHeight) {
            const clientRect = el.getBoundingClientRect();
            return [clientRect.right - clientRect.left, clientRect.bottom - clientRect.top];
        }
        return [offsetWidth, offsetHeight];
    }
    static getOwnerDocument(el) {
        return el.nodeType === Const.DomNodeType.Document ? el : el.ownerDocument || el.document;
    }
    static getClientViewportElement(doc) {
        return doc.documentElement || doc.body;
    }
    static getDocumentScrollElement(doc) {
        if (doc.scrollingElement) {
            return doc.scrollingElement;
        }
        return doc.body || doc.documentElement;
    }
    static getPageOffset(el) {
        const doc = Dom.getOwnerDocument(el);
        const pos = [0, 0];
        const viewportElement = Dom.getClientViewportElement(doc);
        if (el === viewportElement) {
            // viewport is always at 0,0 as that defined the coordinate system for this
            // function - this avoids special case checks in the code below
            return pos;
        }
        const box = el.getBoundingClientRect();
        // Must add the scroll coordinates in to get the absolute page offset
        // of element since getBoundingClientRect returns relative coordinates to
        // the viewport.
        const scrollCoord = Dom.getDocumentScroll(doc);
        pos.x = box.left + scrollCoord.x;
        pos.y = box.top + scrollCoord.y;
        return pos;
    }

    static getElementRect(element, size) {
        const offset = Dom.getPageOffset(element);
        return [
            offset.x,
            offset.y,
            offset.x + size[0],
            offset.y + size[1]
        ];
    }

}
