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
    if(!obj) {
        return [];
    }
    if('length' in obj) {
        return _slice.call(obj);
    }
    const rawType = getRawType(obj);
    if(rawType === 'Map') {
        return _convertMapToArray(obj);
    }
    if(rawType === 'Set') {
        return _convertSetToArray(obj);
    }
    return _slice.call(obj);
}

function _convertMapToArray<T>(obj: Map<any, any>): T[] {
    const result: T[] = [];
    for(
        let iterator = (obj as Map<any, any>).entries(),
        nextResult = iterator.next()
        ;
        !nextResult.done
        ;
        nextResult = iterator.next()
    ) {
        result.push(nextResult.value as any);
    }
    return result;
}

function _convertSetToArray<T>(obj: Set<any>): T[] {
    if(!obj) {
        return [];
    }
    if(Array.from) {
        return Array.from(obj);
    }
    const result = [];
    for(
        let iterator = obj.values(),
        nextResult = iterator.next()
        ;
        !nextResult.done
        ;
        nextResult = iterator.next()
    ) {
        result.push(nextResult.value);
    }
    return result;
}