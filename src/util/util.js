/**
 * Created by zhangwenjin on 2016/7/18.
 */
export class Util {
    static trim(str) {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    }
    static splitWords(str) {
        return Util.trim(str).split(/\s+/);
    }
    static toDegrees(angleInRadians) {
        return angleInRadians * 180 / Math.PI;
    }
    static toRadians(angleInDegrees) {
        return angleInDegrees * Math.PI / 180;
    }
    static sphereOffset(c1, distance, bearing, sphereRadius) {
        const lat1 = this.toRadians(c1[1]);
        const lon1 = this.toRadians(c1[0]);
        const dByR = distance / sphereRadius;
        const lat = Math.asin(
            Math.sin(lat1) * Math.cos(dByR) +
            Math.cos(lat1) * Math.sin(dByR) * Math.cos(bearing));
        const lon = lon1 + Math.atan2(
                Math.sin(bearing) * Math.sin(dByR) * Math.cos(lat1),
                Math.cos(dByR) - Math.sin(lat1) * Math.sin(lat));
        return [this.toDegrees(lon), this.toDegrees(lat)];
    }
}
