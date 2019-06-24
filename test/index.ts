
type Getter<T, O = any> = T | ((value: O) => T);

function diffList(oldList: any[], newList: any[], keyName: Getter<string>) {
    const result = [];
    const oldKeyMap = makeKeyIndexMap(oldList, keyName);
    const newKeyMap = makeKeyIndexMap(newList, keyName);

    for (let i = 0, len = oldList.length; i < len; i++) {
        const oldItem = oldList[i];
        const oldKey = getItemKey(oldItem, keyName);
        if (!newKeyMap[oldKey]) {
            result.push({
                type: 0,
                index: i,
                item: oldItem
            });
        }
    }

    for (let i = 0, len = newList.length; i < len; i++) {
        const newItem = newList[i];
        const newKey = getItemKey(newItem, keyName);
        if (!oldKeyMap[newKey]) {
            result.push({
                type: 1,
                index: i,
                item: newItem
            });
        }
    }
    return result;
}

function makeKeyIndexMap(list: any[], keyName: Getter<string>): { [key: string]: string } {
    const res = {};
    for (let i = 0, len = list.length; i < len; i++) {
        const item = list[i];
        const key = getItemKey(item, keyName);
        res[key] = item;
    }
    return res;
}

function getItemKey(item: any, keyName: Getter<string>): string | undefined {
    return typeof keyName === 'function' ? keyName(item) : item[keyName];
}

const o1 = ['1', '2', '3', '4', '5'];
const o2 = ['1', '2', '6', '3', '4'];

console.time();
console.log(diffList(o1, o2, (v) => v));
console.timeEnd();