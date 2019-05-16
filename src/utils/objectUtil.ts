
export function get<T>(object: any, path: string | any[], defaultValue?: T): T {
    return convertArrayToPath(path).reduce((prev, value) => (prev || {})[value], object) || defaultValue;
}

function convertArrayToPath(path: string | any[]): string[] {
    return (
        !Array.isArray(path)
            ?
            (path as string)
                .replace(/^\[/, '')
                .replace(/\[/g, '.')
                .replace(/\]/g, '')
                .split('.')
            :
            path as string[]
    );
}

export function set(object: any, path: string | any[], value: any) {
    return convertArrayToPath(path).reduce((prev, curr, i, arr) => i < arr.length - 1 ? prev[curr] : prev[curr] = value, object);
}

const _toString = Object.prototype.toString;

export function getRawType(value: any): string {
    // tslint:disable-next-line: triple-equals
    if (value == null) {
        return value === undefined ? 'Undefined' : 'Null'
    }
    return (_toString.call(value) as string).slice(8, -1);
}

export function isObject(obj: any): boolean {
    return getRawType(obj) === 'Object';
}
