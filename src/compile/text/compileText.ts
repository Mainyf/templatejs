import { String } from "lodash";

export class CompileText {
    public render(el: Element, data: any) {
        console.log(el.children);
        this.setChildNodes(this.getChildNode(el));
        console.log(this.getChildNode(el));
    }
    getChildNode(el:any):[Element]{
        return el.childNodes;
    }
    setChildNodes(nodeList:[any]){
        nodeList.forEach(element => {
            if(element.hasChildNodes()){
                this.setChildNodes(element.childNodes)
            }else{
                if(!!this.cleark(element.nodeValue)){
                    console.log(this.cleark(element.nodeValue));
                }
                
            }
        });
    }
    cleark(nodeValue:string):string{
        if(nodeValue == undefined) return "" 
        var result= nodeValue.replace(/(^\s*)|(\s*$)/g,"");
        if(!!result && result.length !==0 && result != undefined){
            return result;
        }
        
    }
}