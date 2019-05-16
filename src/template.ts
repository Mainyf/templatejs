import { childNodes } from './utils/domUtil';
import { execAll } from './utils/regexpUtil';

export type TemplateOptions = {
    el: string;
    data?: any;
}

export class Template {

    private $options: TemplateOptions;
    private $el: HTMLTemplateElement
    private $data: any;

    constructor(options: any) {
        this.$options = options;
        this.$el = document.querySelector(this.$options.el);
        this.$data = this.$options.data || Object.create({});
        this._compile();
    }

    private _expReg = /{{[ \n]*(\w*)[ \n]*}}/g;

    private _compile() {
        const els = childNodes(this.$el);
        els.forEach((v) => {
            console.log(execAll(this._expReg, v.textContent).map((v) => v[1]));
        });
    }

}