import { convertArray, isEmpty, isNotEmpty } from './collectionUtil';

export function childrens(el: Element): HTMLElement[] {
    const children = convertArray<HTMLElement>(el.children);
    if (isEmpty(children)) {
        return [];
    }
    const result = [];
    children.forEach((v) => {
        result.push(v);
        const _children = v.children;
        if (isNotEmpty(_children)) {
            result.push(...childrens(v))
        }
    });
    return result;
}

export function childNodes(el: Element | HTMLElement): Text[] {
    const nodes = convertArray<HTMLElement>(el.childNodes);
    if (isEmpty(nodes)) {
        return [];
    }
    const result = [];
    nodes
        .forEach((v) => {
            if(isTextNode(v)) {
                result.push(v);
            }
            const _nodes = v.childNodes;
            if (isNotEmpty(_nodes) && isElementNode(v)) {
                result.push(...childNodes(v))
            }
        });
    return result;
}

export function isElementNode(el: any): boolean {
    return el.nodeType === 1;
}

export function isTextNode(el: any): boolean {
    return el.nodeType === 3;
}