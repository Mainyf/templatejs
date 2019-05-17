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
        this.$methods = Object.freeze(this.$options.methods || Object.create({}));
        this.$compile = new CompileText(this);
        this.$eventHandler = new EventHandler(this);
        this._preLoad();
        this._compile();
    }

    private _preLoad() {
        this._attachMethods();
        this._attachData();
    }

    private _attachMethods() {
        const keys = Object.keys(this.$methods);
        const keyLen = keys.length;
        for(let i = 0;i < keyLen;i++) {
            Object.defineProperty(this, keys[i], {
                enumerable: true,
                configurable: false,
                get() {
                    return this.$methods[keys[i]];
                },
                set() {}
            });
        }
    }

    private _attachData() {
        const keys = Object.keys(this.$data);
        const keyLen = keys.length;
        for(let i = 0;i < keyLen;i++) {
            const name = keys[i];
            Object.defineProperty(this, name, {
                enumerable: true,
                configurable: false,
                get() {
                    return this.$data[name];
                },
                set(newVal) {
                    this.$data[name] = newVal;
                }
            });
        }
    }

    public setData(newData: any) {
        this.$data = newData;
        this._compile();
    }

    private _compile() {
        this.$compile.render(this.$el, this.$data);
        this.$eventHandler.bind(this.$el, this.$methods);
    }

}