import { CompileText } from './compile';
import { EventHandler } from './compile/event';

export type TemplateOptions = {
    el: string;
    data?: TemplateData;
    methods?: TemplateMethods;
}

export type TemplateData = {
    [key: string]: any;
}

export type TemplateMethods = {
    [key: string]: Function;
}

export class Template {

    private $options: TemplateOptions;
    private $el: HTMLTemplateElement
    private $data: TemplateData;
    private $methods: TemplateMethods;
    private $compile: CompileText;
    private $eventHandler: EventHandler;

    constructor(options: any) {
        this.$options = options;
        this.$el = document.querySelector(this.$options.el);
        this.$data = this.$options.data || Object.create({});
        this.$methods = this.$options.methods || Object.create({});
        this.$compile = new CompileText(this);
        this.$eventHandler = new EventHandler(this);
        this._compile();
    }

    private _compile() {
        this.$compile.render(this.$el, this.$data);
        this.$eventHandler.bind(this.$el, this.$methods);
    }

}