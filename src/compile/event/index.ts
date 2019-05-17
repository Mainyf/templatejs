import { TemplateMethods, Template } from "@src/template";
import { childrens } from "@src/utils/domUtil";
import { isEmpty } from "@src/utils/collectionUtil";
import { CompileEntry } from "../compileBase";

export class EventHandler extends CompileEntry {

    constructor(template: Template) {
        super(template);
    }

    bind(root: Element, methods: TemplateMethods) {
        const els = childrens(root);
        const elsLength = els.length;
        for(let i = 0;i < elsLength;i++) {
            const el = els[i];
            const eventProperty = this._getEventProperty(el);
            if(isEmpty(eventProperty)) {
                continue;
            }
            this._handleBind(el, methods, eventProperty);
        }
    }

    private _handleBind(el: Element, methods: TemplateMethods, eventProperty: Map<string, string>) {
        for(
            let iterator = eventProperty.entries(),
            result = iterator.next()
            ;
            !result.done
            ;
            result = iterator.next()
        ) {
            const eventName = result.value[0];
            const fnName = result.value[1];
            if(fnName in methods) {
                this._bindEventToElemnent(el, eventName, methods[fnName]);
            }
        }
    }

    private _getEventProperty(el: Element): Map<string, string> {
        const result = new Map<string, string>();
        const attrs = el.getAttributeNames();
        for(let i = 0;i < attrs.length;i++) {
            const name = attrs[i];
            if(name.startsWith('@')) {
                result.set(name.substring(1), el.getAttribute(name));
            }
        }
        return result;
    }

    private _bindEventToElemnent(el: Element, event: string, handle: Function) {
        el.addEventListener(event, (e) => handle.call(this._template, e))
    }
}