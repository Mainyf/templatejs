export function removeStr(source: string, ...str: string[]): string {
    let _source = source;
    str.forEach((v) => {
        _source = _source.replace(v, '');
    });
    return _source;
}