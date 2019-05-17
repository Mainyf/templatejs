import { Template } from '@src/template';
import { CompileEntry } from '../compileBase';
import { childNodes } from '@src/utils/domUtil';
import { execAll } from '@src/utils/regexpUtil';
import { type } from 'os';

type CacheDataItem = {
    node: Text,
    original: string;
    key: string;
    first: number;
    second: number;
}

export class CompileText extends CompileEntry {

    constructor(template: Template) {
        super(template);
    }

    private _indexMap: Map<Text, CacheDataItem> = new Map();

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
                node.textContent = el.textContent.replace(originalStr, _data)
                this._updateIndex(node, originalStr, _data, name, execItem);
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
            const [data, { key, node, first, second }] = execResult.value;
            const text = node.textContent;
            
            if (oldData[key] !== newData[key]) {
                node.textContent = text.replace(text.substring(first, second), newData[key]);
            }
        }
    }

    private _updateIndex(node: Text, original: string, data: any, name: string, execResult: RegExpExecArray) {
        // TODO code...
        this._indexMap.set(node, {
            node,
            original,
            key: name,
            first: execResult.index,
            second: execResult.index + execResult[0].length
        });
    }
}