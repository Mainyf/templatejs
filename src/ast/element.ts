type StringDataMap = {
    [K: string]: string;
}

export class ASTElement<HTMLTag extends keyof HTMLElementTagNameMap = any> {

    constructor(
        public tagName: HTMLTag,
        public text?: string,
        public attrs?: StringDataMap,
        public directives?: StringDataMap,
        public events?: StringDataMap,
        public childrens: ASTElement[] = []
    ) {

    }

}