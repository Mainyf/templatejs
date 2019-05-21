import { Template } from '@src/template';
import { CompileEntry } from '../compileBase';
import { childNodes } from '@src/utils/domUtil';
import { execAll } from '@src/utils/regexpUtil';
import { findIndex, find } from '@src/utils/collectionUtil';

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

    // 框架代码，尽量不用高阶函数，例如forEach、map、filter
    // 一个方法(函数)，只做一件事
    private _indexMap: Map<Text, CacheDataItem[]> = new Map();

    private _expReg = /{{[ \n]*(\w*)[ \n]*}}/g;

    private _oldData = null;

    public render(el: Element, data: any) {
        if (!this._oldData) {
            // 第一次渲染
            this._renderFirstData(el, data);
        } else {
            // 第二次之后的渲染处理
            this._renderSecondData(el, this._oldData, data);
        }
        // 记录之前一次渲染的数据
        this._oldData = data;
    }

    private _renderFirstData(el: Element, data: any) {
        // 获得所有的子Node(Element、Text)
        const els = childNodes(el);
        const elsLen = els.length;
        for (let i = 0; i < elsLen; i++) {
            const node = els[i];
            // 匹配到所有的文本
            const result = execAll(this._expReg, node.textContent);
            const resultLen = result.length;
            for (let j = 0; j < resultLen; j++) {
                const execItem = result[j];
                const originalStr = execItem[0];
                const name = execItem[1];
                const _data = data[name];
                const text = node.textContent;
                // 更新文本的角标
                // {{demo}}
                // ↑      ↑
                // first  second
                // 记录以便于第二次进行替换
                this._updateIndex(node, originalStr, text.indexOf(originalStr), _data, name);
                node.textContent = text.replace(originalStr, _data);
            }
        }
    }

    private _renderSecondData(el: Element, oldData: any, newData: any) {
        // 循环储存角标的Map
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

                    // 再次进行更新，以便于之后的替换
                    this._updateIndex(node, v.original, v.first, newValue, v.key);
                    console.log(v);
                    console.log(find(this._indexMap.get(node), (x) => x.key === v.key));
                    // 更新内容
                    node.textContent = this._updateText(text, v.first, v.second, newValue);
                }
            }
        }
    }

    private _updateText(text: string, first: number, second: number, newStr: string): string {
        // 取到 first 和 second 在文本中的前后内容，截取他们和 newStr 拼接
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
        // 一个节点(node)有数个插值，如果此节点不存在，那么保存
        if (!this._indexMap.has(node)) {
            this._indexMap.set(node, [_data]);
        } else {
            // 如果以及存在，先拿到之前保存的角标
            const arr = this._indexMap.get(node);
            // 通过 original 拿到角标对象
            const index = findIndex(arr, (v) => v.original === original);
            // 如果没有则说明是新增的，那么则添加进去
            if (index === -1) {
                arr.push(_data)
            } else {
                // 如果有则处理
                this._lengthPatch(arr, index, _data);
            }
        }
    }

    private _lengthPatch(
        arr: CacheDataItem[],
        index: number,
        data: any
    ) {
        // 替换一下指定位置的角标对象，并更新角标位置
        const prev = arr[index];
        const secondPatch = data.second - prev.second;
        arr[index] = data;
        
        // 在改变前一个角标位置的时候，后面的也会错位，所以需要打补丁
        const arrLen = arr.length;
        for(let i = index + 1;i < arrLen;i++) {
            const item = arr[i];
            arr[i] = {
                ...item,
                ...{
                    first: item.first + secondPatch,
                    second: item.second + secondPatch
                }
            }
        }
    }

}