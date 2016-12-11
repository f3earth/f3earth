/**
 * Created by zhangwenjin on 2016/7/18.
 */

const vendorPrefixes = ['', 'WEBKIT_', 'MOZ_'];

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

    static getGLExtension(gl, name) {
        for (let index = 0; index < vendorPrefixes.length; index++) {
            const ext = gl.getExtension(vendorPrefixes[index] + name);
            if (ext) {
                return ext;
            }
        }
        return null;
    }
}
