import { Template } from '@src/template';
import { CompileEntry } from '../compileBase';
import { childNodes } from '@src/utils/domUtil';
import { execAll } from '@src/utils/regexpUtil';
import { type } from 'os';
import { find, findIndex } from '@src/utils/collectionUtil';

type CacheDataItem = {
    data: any;
    original: string;
    key: string;
    first: number;
    second: number;
}

export class CompileText extends CompileEntry {

    constructor(template: Template) {
        super(template);
    }

    private _indexMap: Map<Text, CacheDataItem[]> = new Map();

    private _expReg = /{{[ \n]*(\w*)[ \n]*}}/g;

    private _oldData = null;

    public render(el: Element, data: any) {
        if (!this._oldData) {
            this._renderFirstData(el, data);
        } else {
            this._renderSecondData(el, this._oldData, data);
        }
        this._oldData = data;
    }

    private _renderFirstData(el: Element, data: any) {
        const els = childNodes(el);
        const elsLen = els.length;
        for (let i = 0; i < elsLen; i++) {
            const node = els[i];
            const result = execAll(this._expReg, node.textContent);
            const resultLen = result.length;
            for (let j = 0; j < resultLen; j++) {
                const execItem = result[j];
                const originalStr = execItem[0];
                const name = execItem[1];
                const _data = data[name];
                const text = node.textContent;
                node.textContent = text.replace(originalStr, _data);
                this._updateIndex(node, originalStr, text.indexOf(originalStr), _data, name);
            }
        }
    }

    private _renderSecondData(el: Element, oldData: any, newData: any) {
        for (
            let iterator = this._indexMap.entries(),
            execResult = iterator.next()
            ;
            !execResult.done
            ;
            execResult = iterator.next()
        ) {
            const [node, item] = execResult.value;
            const itemLen = item.length;
            for(let i = 0;i < itemLen;i++) {
                const v = item[i];
                const oldValue = oldData[v.key];
                const newValue = newData[v.key];
                if(oldValue !== newValue) {
                    const text = node.textContent;
                    // node.textContent = text.replace(text.substring(v.first, v.second), newValue);
                    node.textContent = this._updateText(text, v.first, v.second, newValue);
                    this._updateIndex(node, v.original, v.first, newValue, v.key);
                }
            }
        }
    }

    private _updateText(text: string, first: number, second: number, newStr: string): string {
        const result = text;
        const left = result.substring(0, first) || '';
        const right = result.substring(second) || '';
        return left + newStr + right;
    }

    private _updateIndex(
        node: Text,
        original: string,
        index: number,
        data: any,
        name: string
    ) {
        const _data = {
            data,
            original,
            key: name,
            first: index,
            second: index + data.length
        };
        if (!this._indexMap.has(node)) {
            this._indexMap.set(node, [_data]);
        } else {
            const arr = this._indexMap.get(node);
            const index = findIndex(arr, (v) => v.original === original);
            if (index === -1) {
                arr.push(_data)
            } else {
                arr[index] = _data;
            }
        }
    }
}