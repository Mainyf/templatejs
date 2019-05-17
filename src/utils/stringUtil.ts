export function removeStr(source: string, ...str: string[]): string {
    let _source = source;
    str.forEach((v) => {
        _source = _source.replace(v, '');
    });
    return _source;
}

export function makeMap(source: string): (str: string) => boolean {
    const arr = source.split(',');
    return (str: string) => arr.indexOf(str) !== -1;
}