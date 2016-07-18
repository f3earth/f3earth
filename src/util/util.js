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
}
