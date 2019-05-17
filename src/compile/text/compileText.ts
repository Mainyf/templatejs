import { Template } from '@src/template';
import { CompileEntry } from '../compileBase';

export class CompileText extends CompileEntry {
    
    constructor(template: Template) {
        super(template);
    }

    // private _expReg = /{{[ \n]*(\w*)[ \n]*}}/g;

    public render(el: Element, data: any) {
        // const els = childNodes(this.$el);
        // els.forEach((v) => {
        //     console.log(execAll(this._expReg, v.textContent).map((v) => v[1]));
        // });
    }

}