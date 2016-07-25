/**
 * Created by zhangwenjin on 2016/7/25.
 */
import { FMath } from './math';
export class Sphere {
    constructor(radius) {
        this._radius = radius;
    }

    offset(c1, distance, bearing) {
        const lat1 = FMath.toRadians(c1[1]);
        const lon1 = FMath.toRadians(c1[0]);
        const dByR = distance / this._radius;
        const lat = Math.asin(
            Math.sin(lat1) * Math.cos(dByR) +
            Math.cos(lat1) * Math.sin(dByR) * Math.cos(bearing));
        const lon = lon1 + Math.atan2(
                Math.sin(bearing) * Math.sin(dByR) * Math.cos(lat1),
                Math.cos(dByR) - Math.sin(lat1) * Math.sin(lat));
        return [FMath.toDegrees(lon), FMath.toDegrees(lat)];
    }
    getXYZ(lng, lat) {
        const pointX = this._radius * Math.sin(FMath.toRadians(lng)) *
            Math.cos(FMath.toRadians(lat));
        const pointY = this._radius * Math.sin(FMath.toRadians(lat));
        const pointZ = this._radius * Math.cos(FMath.toRadians(lng)) *
            Math.cos(FMath.toRadians(lat));
        return [pointX, pointY, pointZ];
    }
}
