export declare class ASTElement<HTMLTag extends keyof keyof HTMLElementTagNameMap> {
    tagName: HTMLTag;
    constructor(tagName: HTMLTag);
}
