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
    static isContainsExtent(extent1, extent2) {
        return extent1[0] <= extent2[0] && extent2[2] <= extent1[2] &&
                extent1[1] <= extent2[1] && extent2[3] <= extent1[3];
    }
}
