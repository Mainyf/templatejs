import { getRawType } from './objectUtil';
import { makeMap } from './stringUtil';

export function isEmpty(obj: any): boolean {
    if(!obj) {
        return true;
    }
    if(Array.isArray(obj) && obj.length <= 0) {
        return true;
    }
    if(makeMap('Map,Set')(getRawType(obj)) && obj.size <= 0) {
        return true;
    }
    return false;
}

export function isNotEmpty(obj: any): boolean {
    return !isEmpty(obj);
}

const _slice = Array.prototype.slice;
export function convertArray<T = any>(obj: any): T[] {
    if(!obj || !('length' in obj)) {
        return [];
    }
    return _slice.call(obj);
}