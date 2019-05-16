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
    }

}