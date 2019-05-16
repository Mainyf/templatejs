export function isEmpty(obj: any): boolean {
    return !isNotEmpty(obj);
}

export function isNotEmpty(obj: any): boolean {
    return obj && obj.length > 0;
}

const _slice = Array.prototype.slice;
export function convertArray<T = any>(obj: any): T[] {
    if(!obj || !('length' in obj)) {
        return [];
    }
    return _slice.call(obj);
}