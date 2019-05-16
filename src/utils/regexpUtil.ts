import { removeStr } from './stringUtil';

export function execAll(regex: RegExp, source: string): RegExpExecArray[] {
    const reg = new RegExp(regex.source, removeStr(regex.flags, 'g'));
    const result = [];
    let lastIndex = 0,
        execResult = null,
        str = source;
    while (execResult = reg.exec(str)) {
        result.push(execResult);
        lastIndex = execResult.index + execResult[0].length;
        str = str.substring(lastIndex);
    }
    return result;
}