import { CompileText } from './compile';

export type TemplateOptions = {
    el: string;
    data?: any;
}

export class Template {

    private $options: TemplateOptions;
    private $el: HTMLTemplateElement
    private $data: any;
    private $compile: CompileText;

    constructor(options: any) {
        this.$options = options;
        this.$el = document.querySelector(this.$options.el);
        this.$data = this.$options.data || Object.create({});
        this.$compile = new CompileText();
        this._compile();
    }

    private _compile() {
        this.$compile.render(this.$el, this.$data);
    }

}