/**
 * Created by zhangwenjin on 2016/7/20.
 */
class Node {
    constructor(i, x, y) {
        // vertice index in coordinates array
        this.i = i;

        // vertex coordinates
        this.x = x;
        this.y = y;

        // previous and next vertice nodes in a polygon ring
        this.prev = null;
        this.next = null;

        // z-order curve value
        this.z = null;

        // previous and next nodes in z-order
        this.prevZ = null;
        this.nextZ = null;

        // indicates whether this is a steiner point
        this.steiner = false;
    }
}
class Earcut {
    getTriangles(data, holeIndices, d) {
        const dim = d || 2;
        const hasHoles = holeIndices && holeIndices.length;
        const outerLen = hasHoles ? holeIndices[0] * dim : data.length;
        let outerNode = this.linkedList(data, 0, outerLen, dim, true);
        const triangles = [];

        if (!outerNode) return triangles;

        let minX;
        let minY;
        let maxX;
        let maxY;
        let x;
        let y;
        let size;

        if (hasHoles) outerNode = this.eliminateHoles(data, holeIndices, outerNode, dim);
        /**
         * if the shape is not too simple,
         * we'll use z-order curve hash later; calculate polygon bbox
         */
        if (data.length > 80 * dim) {
            minX = maxX = data[0];
            minY = maxY = data[1];

            for (let i = dim; i < outerLen; i += dim) {
                x = data[i];
                y = data[i + 1];
                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if (x > maxX) maxX = x;
                if (y > maxY) maxY = y;
            }
            /**
             * minX, minY and size are later used to transform
             * coords into integers for z-order calculation
             */
            size = Math.max(maxX - minX, maxY - minY);
        }

        this.earcutLinked(outerNode, triangles, dim, minX, minY, size);

        return triangles;
    }

    /**
     * create a circular doubly linked
     * list from polygon points in the specified winding order
     * @param data
     * @param start
     * @param end
     * @param dim
     * @param clockwise
     * @returns {*}
     */
    linkedList(data, start, end, dim, clockwise) {
        let i;
        let last;

        if (clockwise === (Earcut._signedArea(data, start, end, dim) > 0)) {
            for (i = start; i < end; i += dim) {
                last = this.insertNode(i, data[i], data[i + 1], last);
            }
        } else {
            for (i = end - dim; i >= start; i -= dim) {
                last = this.insertNode(i, data[i], data[i + 1], last);
            }
        }

        if (last && this.equals(last, last.next)) {
            this.removeNode(last);
            last = last.next;
        }

        return last;
    }

// eliminate colinear or duplicate points
    filterPoints(startPoint, endPoint) {
        if (!startPoint) return startPoint;
        let end = endPoint;
        if (!endPoint) end = startPoint;

        let p = startPoint;
        let again;
        do {
            again = false;

            if (!p.steiner && (this.equals(p, p.next) || this.area(p.prev, p, p.next) === 0)) {
                this.removeNode(p);
                p = end = p.prev;
                if (p === p.next) return null;
                again = true;
            } else {
                p = p.next;
            }
        } while (again || p !== end);

        return end;
    }

// main ear slicing loop which triangulates a polygon (given as a linked list)
    earcutLinked(ear, triangles, dim, minX, minY, size, pass) {
        let newEar = ear;
        if (!newEar) return;

        // interlink polygon nodes in z-order
        if (!pass && size) this.indexCurve(newEar, minX, minY, size);

        let stop = newEar;
        let prev;
        let next;

        // iterate through ears, slicing them one by one
        while (newEar.prev !== newEar.next) {
            prev = newEar.prev;
            next = newEar.next;

            if (size ? this.isEarHashed(newEar, minX, minY, size) : this.isEar(newEar)) {
                // cut off the triangle
                triangles.push(prev.i / dim);
                triangles.push(newEar.i / dim);
                triangles.push(next.i / dim);

                this.removeNode(newEar);

                // skipping the next vertice leads to less sliver triangles
                newEar = next.next;
                stop = next.next;

                continue;
            }

            newEar = next;

            // if we looped through the whole remaining polygon and can't find any more ears
            if (newEar === stop) {
                // try filtering points and slicing again
                if (!pass) {
                    this.earcutLinked(this.filterPoints(newEar),
                        triangles, dim, minX, minY, size, 1);

                    // if this didn't work, try curing all small self-intersections locally
                } else if (pass === 1) {
                    newEar = this.cureLocalIntersections(newEar, triangles, dim);
                    this.earcutLinked(newEar, triangles, dim, minX, minY, size, 2);

                    // as a last resort, try splitting the remaining polygon into two
                } else if (pass === 2) {
                    this.splitEarcut(newEar, triangles, dim, minX, minY, size);
                }

                break;
            }
        }
    }

// check whether a polygon node forms a valid ear with adjacent nodes
    isEar(ear) {
        const a = ear.prev;
        const b = ear;
        const c = ear.next;

        if (this.area(a, b, c) >= 0) return false; // reflex, can't be an ear

        // now make sure we don't have other points inside the potential ear
        let p = ear.next.next;

        while (p !== ear.prev) {
            if (this.pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                this.area(p.prev, p, p.next) >= 0) return false;
            p = p.next;
        }

        return true;
    }

    isEarHashed(ear, minX, minY, size) {
        const a = ear.prev;
        const b = ear;
        const c = ear.next;

        if (this.area(a, b, c) >= 0) return false; // reflex, can't be an ear

        // triangle bbox; min & max are calculated like this for speed
        let minTX;
        if (a.x < b.x) {
            minTX = (a.x < c.x ? a.x : c.x);
        } else {
            minTX = (b.x < c.x ? b.x : c.x);
        }
        let minTY;
        if (a.y < b.y) {
            minTY = (a.y < c.y ? a.y : c.y);
        } else {
            minTY = (b.y < c.y ? b.y : c.y);
        }
        let maxTX;
        if (a.x > b.x) {
            maxTX = (a.x > c.x ? a.x : c.x);
        } else {
            maxTX = (b.x > c.x ? b.x : c.x);
        }
        let maxTY;
        if (a.y > b.y) {
            maxTY = (a.y > c.y ? a.y : c.y);
        } else {
            maxTY = (b.y > c.y ? b.y : c.y);
        }
        // z-order range for the current triangle bbox;
        const minZ = this.zOrder(minTX, minTY, minX, minY, size);
        const maxZ = this.zOrder(maxTX, maxTY, minX, minY, size);

        // first look for points inside the triangle in increasing z-order
        let p = ear.nextZ;

        while (p && p.z <= maxZ) {
            if (p !== ear.prev && p !== ear.next &&
                this.pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                this.area(p.prev, p, p.next) >= 0) return false;
            p = p.nextZ;
        }

        // then look for points in decreasing z-order
        p = ear.prevZ;

        while (p && p.z >= minZ) {
            if (p !== ear.prev && p !== ear.next &&
                this.pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                this.area(p.prev, p, p.next) >= 0) return false;
            p = p.prevZ;
        }

        return true;
    }

// go through all polygon nodes and cure small local self-intersections
    cureLocalIntersections(start, triangles, dim) {
        let p = start;
        let o = start;
        do {
            const a = p.prev;
            const b = p.next.next;
            if (!this.equals(a, b) && this.intersects(a, p, p.next, b) &&
                this.locallyInside(a, b) && this.locallyInside(b, a)) {
                triangles.push(a.i / dim);
                triangles.push(p.i / dim);
                triangles.push(b.i / dim);

                // remove two nodes involved
                this.removeNode(p);
                this.removeNode(p.next);

                p = o = b;
            }
            p = p.next;
        } while (p !== o);

        return p;
    }

// try splitting polygon into two and triangulate them independently
    splitEarcut(start, triangles, dim, minX, minY, size) {
        // look for a valid diagonal that divides the polygon into two
        let a = start;
        do {
            let b = a.next.next;
            while (b !== a.prev) {
                if (a.i !== b.i && this.isValidDiagonal(a, b)) {
                    // split the polygon in two by the diagonal
                    let c = this.splitPolygon(a, b);

                    // filter colinear points around the cuts
                    a = this.filterPoints(a, a.next);
                    c = this.filterPoints(c, c.next);

                    // run earcut on each half
                    this.earcutLinked(a, triangles, dim, minX, minY, size);
                    this.earcutLinked(c, triangles, dim, minX, minY, size);
                    return;
                }
                b = b.next;
            }
            a = a.next;
        } while (a !== start);
    }

// link every hole into the outer loop, producing a single-ring polygon without holes

    eliminateHoles(data, holeIndices, outerNode, dim) {
        let newOuterNode = outerNode;
        const queue = [];
        let i;
        let len;
        let start;
        let end;
        let list;

        for (i = 0, len = holeIndices.length; i < len; i++) {
            start = holeIndices[i] * dim;
            end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
            list = this.linkedList(data, start, end, dim, false);
            if (list === list.next) list.steiner = true;
            queue.push(this.getLeftmost(list));
        }

        queue.sort(this.compareX);

        // process holes from left to right
        for (i = 0; i < queue.length; i++) {
            this.eliminateHole(queue[i], newOuterNode);
            newOuterNode = this.filterPoints(newOuterNode, newOuterNode.next);
        }

        return newOuterNode;
    }

    compareX(a, b) {
        return a.x - b.x;
    }

// find a bridge between vertices that connects hole with an outer ring and and link it

    eliminateHole(hole, outerNode) {
        const newOuterNode = this.findHoleBridge(hole, outerNode);
        if (newOuterNode) {
            const b = this.splitPolygon(newOuterNode, hole);
            this.filterPoints(b, b.next);
        }
    }

// David Eberly's algorithm for finding a bridge between hole and outer polygon

    findHoleBridge(hole, outerNode) {
        let p = outerNode;
        const hx = hole.x;
        const hy = hole.y;
        let qx = -Infinity;
        let m;

        // find a segment intersected by a ray from the hole's leftmost point to the left;
        // segment's endpoint with lesser x will be potential connection point
        do {
            if (hy <= p.y && hy >= p.next.y) {
                const x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
                if (x <= hx && x > qx) {
                    qx = x;
                    if (x === hx) {
                        if (hy === p.y) return p;
                        if (hy === p.next.y) return p.next;
                    }
                    m = p.x < p.next.x ? p : p.next;
                }
            }
            p = p.next;
        } while (p !== outerNode);

        if (!m) return null;

        if (hx === qx) return m.prev; // hole touches outer segment; pick lower endpoint

        // look for points inside the triangle of hole point, segment intersection and endpoint;
        // if there are no points found, we have a valid connection;
        // otherwise choose the point of the minimum angle with the ray as connection point

        const stop = m;
        const mx = m.x;
        const my = m.y;
        let tanMin = Infinity;
        let tan;

        p = m.next;

        while (p !== stop) {
            if (hx >= p.x && p.x >= mx &&
                this.pointInTriangle(
                    hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {
                tan = Math.abs(hy - p.y) / (hx - p.x); // tangential
                if ((tan < tanMin || (tan === tanMin && p.x > m.x)) &&
                    this.locallyInside(p, hole)) {
                    m = p;
                    tanMin = tan;
                }
            }

            p = p.next;
        }

        return m;
    }

// interlink polygon nodes in z-order

    indexCurve(start, minX, minY, size) {
        let p = start;
        do {
            if (p.z === null) p.z = this.zOrder(p.x, p.y, minX, minY, size);
            p.prevZ = p.prev;
            p.nextZ = p.next;
            p = p.next;
        } while (p !== start);

        p.prevZ.nextZ = null;
        p.prevZ = null;

        this.sortLinked(p);
    }

// Simon Tatham's linked list merge sort algorithm
// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html

    sortLinked(list) {
        let i;
        let p;
        let q;
        let e;
        let tail;
        let numMerges;
        let pSize;
        let qSize;
        let inSize = 1;
        let newList = list;
        do {
            p = newList;
            newList = null;
            tail = null;
            numMerges = 0;

            while (p) {
                numMerges++;
                q = p;
                pSize = 0;
                for (i = 0; i < inSize; i++) {
                    pSize++;
                    q = q.nextZ;
                    if (!q) break;
                }

                qSize = inSize;
                while (pSize > 0 || (qSize > 0 && q)) {
                    if (pSize === 0) {
                        e = q;
                        q = q.nextZ;
                        qSize--;
                    } else if (qSize === 0 || !q) {
                        e = p;
                        p = p.nextZ;
                        pSize--;
                    } else if (p.z <= q.z) {
                        e = p;
                        p = p.nextZ;
                        pSize--;
                    } else {
                        e = q;
                        q = q.nextZ;
                        qSize--;
                    }

                    if (tail) tail.nextZ = e;
                    else newList = e;

                    e.prevZ = tail;
                    tail = e;
                }

                p = q;
            }

            tail.nextZ = null;
            inSize *= 2;
        } while (numMerges > 1);
        return newList;
    }
// z-order of a point given coords and size of the data bounding box

    zOrder(x, y, minX, minY, size) {
        // coords are transformed into non-negative 15-bit integer range
        let newX = x;
        let newY = y;
        newX = 32767 * (newX - minX) / size;
        newY = 32767 * (newY - minY) / size;

        newX = (newX | (newX << 8)) & 0x00FF00FF;
        newX = (newX | (newX << 4)) & 0x0F0F0F0F;
        newX = (newX | (newX << 2)) & 0x33333333;
        newX = (newX | (newX << 1)) & 0x55555555;

        newY = (newY | (newY << 8)) & 0x00FF00FF;
        newY = (newY | (newY << 4)) & 0x0F0F0F0F;
        newY = (newY | (newY << 2)) & 0x33333333;
        newY = (newY | (newY << 1)) & 0x55555555;

        return newX | (newY << 1);
    }

// find the leftmost node of a polygon ring

    getLeftmost(start) {
        let p = start;
        let leftmost = start;
        do {
            if (p.x < leftmost.x) leftmost = p;
            p = p.next;
        } while (p !== start);

        return leftmost;
    }

// check if a point lies within a convex triangle

    pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
        return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
            (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
            (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
    }

// check if a diagonal between two polygon nodes is valid (lies in polygon interior)

    isValidDiagonal(a, b) {
        return a.next.i !== b.i && a.prev.i !== b.i && !this.intersectsPolygon(a, b) &&
            this.locallyInside(a, b) && this.locallyInside(b, a) && this.middleInside(a, b);
    }

// signed area of a triangle

    area(p, q, r) {
        return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    }

// check if two points are equal

    equals(p1, p2) {
        return p1.x === p2.x && p1.y === p2.y;
    }

// check if two segments intersect

    intersects(p1, q1, p2, q2) {
        if ((this.equals(p1, q1) && this.equals(p2, q2)) ||
            (this.equals(p1, q2) && this.equals(p2, q1))) return true;
        return this.area(p1, q1, p2) > 0 !== this.area(p1, q1, q2) > 0 &&
            this.area(p2, q2, p1) > 0 !== this.area(p2, q2, q1) > 0;
    }

// check if a polygon diagonal intersects any polygon segments

    intersectsPolygon(a, b) {
        let p = a;
        do {
            if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
                this.intersects(p, p.next, a, b)) return true;
            p = p.next;
        } while (p !== a);

        return false;
    }

// check if a polygon diagonal is locally inside the polygon

    locallyInside(a, b) {
        return this.area(a.prev, a, a.next) < 0
            ? this.area(a, b, a.next) >= 0 &&
        this.area(a, a.prev, b) >= 0
            : this.area(a, b, a.prev) < 0 || this.area(a, a.next, b) < 0;
    }

// check if the middle point of a polygon diagonal is inside the polygon

    middleInside(a, b) {
        let p = a;
        let inside = false;
        const px = (a.x + b.x) / 2;
        const py = (a.y + b.y) / 2;
        do {
            if (((p.y > py) !== (p.next.y > py)) &&
                (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x)) {
                inside = !inside;
            }
            p = p.next;
        } while (p !== a);
        return inside;
    }

    /**
     * link two polygon vertices with a bridge;
     * if the vertices belong to the same ring, it splits polygon into two;
     * if one belongs to the outer ring and another to a hole
     * it merges it into a single ring
     * @param a
     * @param b
     * @returns {Node}
     */
    splitPolygon(p1, p2) {
        const a = p1;
        const b = p2;
        const a2 = new Node(a.i, a.x, a.y);
        const b2 = new Node(b.i, b.x, b.y);
        const an = a.next;
        const bp = b.prev;

        a.next = b;
        b.prev = a;

        a2.next = an;
        an.prev = a2;

        b2.next = a2;
        a2.prev = b2;

        bp.next = b2;
        b2.prev = bp;

        return b2;
    }

// create a node and optionally link it with previous one (in a circular doubly linked list)

    insertNode(i, x, y, last) {
        const newLast = last;
        const p = new Node(i, x, y);

        if (!newLast) {
            p.prev = p;
            p.next = p;
        } else {
            p.next = newLast.next;
            p.prev = newLast;
            newLast.next.prev = p;
            newLast.next = p;
        }
        return p;
    }
    removeNode(n) {
        const p = n;
        p.next.prev = p.prev;
        p.prev.next = p.next;
        if (p.prevZ) p.prevZ.nextZ = p.nextZ;
        if (p.nextZ) p.nextZ.prevZ = p.prevZ;
    }

    /**
     * return a percentage difference between the polygon area and its triangulation area;
     * used to verify correctness of triangulation
     * @param data
     * @param holeIndices
     * @param dim
     * @param triangles
     * @returns {number}
     */
    static deviation(data, holeIndices, dim, triangles) {
        const hasHoles = holeIndices && holeIndices.length;
        const outerLen = hasHoles ? holeIndices[0] * dim : data.length;

        let polygonArea = Math.abs(this._signedArea(data, 0, outerLen, dim));
        if (hasHoles) {
            for (let i = 0, len = holeIndices.length; i < len; i++) {
                const start = holeIndices[i] * dim;
                const end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
                polygonArea -= Math.abs(this._signedArea(data, start, end, dim));
            }
        }

        let trianglesArea = 0;
        for (let i = 0; i < triangles.length; i += 3) {
            const a = triangles[i] * dim;
            const b = triangles[i + 1] * dim;
            const c = triangles[i + 2] * dim;
            trianglesArea += Math.abs(
                (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
                (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
        }

        return polygonArea === 0 && trianglesArea === 0 ? 0
            : Math.abs((trianglesArea - polygonArea) / polygonArea);
    }
    static _signedArea(data, start, end, dim) {
        let sum = 0;
        for (let i = start, j = end - dim; i < end; i += dim) {
            sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
            j = i;
        }
        return sum;
    }

// turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
    static flatten(data) {
        const dim = data[0][0].length;
        const result = { vertices: [], holes: [], dimensions: dim };
        let holeIndex = 0;
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                for (let d = 0; d < dim; d++) {
                    result.vertices.push(data[i][j][d]);
                }
            }
            if (i > 0) {
                holeIndex += data[i - 1].length;
                result.holes.push(holeIndex);
            }
        }
        return result;
    }
}
export {
    Earcut
};
