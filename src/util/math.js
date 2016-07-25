/**
 * Created by zhangwenjin on 2016/7/25.
 */
export class FMath {
    static toDegrees(angleInRadians) {
        return angleInRadians * 180 / Math.PI;
    }

    static toRadians(angleInDegrees) {
        return angleInDegrees * Math.PI / 180;
    }
}
