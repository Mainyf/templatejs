import { Template } from "@src/template";

export class CompileEntry {
    
    protected readonly _template: Template;

    constructor(template: Template) {
        this._template = template;
    }
}