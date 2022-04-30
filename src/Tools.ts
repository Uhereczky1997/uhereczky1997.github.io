import { root, rootVariables } from "./index";
import { inputText, outputText, symbolTableLines } from "./ProjectWindow";

export const getHtmlElement = (id:string)=> document.getElementById(id)!;
export const createClickListener = (id:string,f: (this: HTMLElement, ev: MouseEvent) => any) =>{
    try{
        const a= document.getElementById(id);
            if(a!=null){
            a.addEventListener("click",f);
        }
        else throw new Error("Element "+id+" is null!");

    }catch(e){
        console.log(e);
    }
}
export const updateScroll=(id:string)=>{
    var element = getHtmlElement(id);
    element.scrollTop = element.scrollHeight;
}
export const updateScrollOfSymbolTable=(id:string):number=>{
    let targetElem = document.getElementById(id);
    let n=0;

    if(targetElem!=null){
        if(targetElem.offsetTop+targetElem.offsetHeight>symbolTableLines.scrollTop+symbolTableLines.clientHeight+symbolTableLines.offsetTop){
            symbolTableLines.scrollTop=(targetElem.offsetTop+2*targetElem.offsetHeight-symbolTableLines.offsetTop-symbolTableLines.clientHeight);
            // return targetElem.offsetTop+2*targetElem.offsetHeight-symbolTableLines.offsetTop-symbolTableLines.clientHeight;
            n=targetElem.offsetTop+2*targetElem.offsetHeight-symbolTableLines.offsetTop-symbolTableLines.clientHeight;
            return n>symbolTableLines.scrollHeight-symbolTableLines.offsetHeight
                    ?symbolTableLines.scrollHeight-symbolTableLines.offsetHeight
                    :n;
        }
        else if(targetElem.offsetTop<symbolTableLines.offsetTop+symbolTableLines.scrollTop){
            symbolTableLines.scrollTop=(targetElem.offsetTop-symbolTableLines.offsetTop);
            return targetElem.offsetTop-symbolTableLines.offsetTop;
        }
    }
    return symbolTableLines.scrollTop;
}
export const updateScrollOfIn_Out=(id:string,targetID:string):number=>{
    var elem = id==inputText.id?inputText:outputText;
    var targetElem = getHtmlElement(targetID);
    let n=0;
    if(targetElem.offsetTop+2*targetElem.offsetHeight>elem.scrollTop+elem.clientHeight+elem.offsetTop){
        inputText.scrollTop=(targetElem.offsetTop-elem.offsetTop-elem.clientHeight+2*targetElem.offsetHeight);
        outputText.scrollTop=(targetElem.offsetTop-elem.offsetTop-elem.clientHeight+2*targetElem.offsetHeight);
        n=targetElem.offsetTop-elem.offsetTop-elem.clientHeight+2*targetElem.offsetHeight;
        return n>elem.scrollHeight-elem.offsetHeight?elem.scrollHeight-elem.offsetHeight:n;
    }
    else if(targetElem.offsetTop<elem.offsetTop+elem.scrollTop){
        inputText.scrollTop=(targetElem.offsetTop-elem.offsetTop);
        outputText.scrollTop=(targetElem.offsetTop-elem.offsetTop);
        return targetElem.offsetTop-elem.offsetTop;
    }
    return elem.scrollTop;
}
export const removeClassOfAll=(s:string)=>{
    let elements = Array.from(document.querySelectorAll("."+s+""));
    for(let elem of elements){
        elem.classList.remove(s);
    }
}
export const removeClassOf = (id:string,cls:string) =>{
    let elem = document.getElementById(id);
    if(elem != null){
        elem.classList.remove(cls);
    }
}
export const addClassTo=(id:string,cls:string)=>{
    let elem = getHtmlElement(id);
    if(elem !=null || elem != undefined){
        elem.classList.add(cls);
    }
}
export const getIDOfSelected=(s:string):string=>{
    return s[0]+s[1];
}

export const updateScrollOfDescriptionLines=(id:string,targetID:string)=>{
    var elem = getHtmlElement(id);
    var targetElem = getHtmlElement(targetID);
    targetElem.scrollTop=elem.offsetTop-targetElem.offsetTop;
}
class Resizer{

    private outerHeight:number  = 100;
    private outerWidth:number   = 100;
    private arrowHead:number    = 40;
    private arrowBody:number    = 20;
    private var10px:number      = 10;
    private var8px:number       = 8;
    private var6px:number       = 6;
    private var5px:number       = 5;
    private var4px:number       = 4;
    private var3px:number       = 3;
    private var2px:number       = 2;
    private var1_5px:number     = 1.5;
    private var1px:number       = 1;

    constructor(){}
    private getInitialValues =()=>{
        this.var1px     =   Number(rootVariables.getPropertyValue("--var1px").replace("px",""));
        this.var1_5px   =   Number(rootVariables.getPropertyValue("--var1_5px").replace("px",""));
        this.var2px     =   Number(rootVariables.getPropertyValue("--var2px").replace("px",""));
        this.var3px     =   Number(rootVariables.getPropertyValue("--var3px").replace("px",""));
        this.var4px     =   Number(rootVariables.getPropertyValue("--var4px").replace("px",""));
        this.var5px     =   Number(rootVariables.getPropertyValue("--var5px").replace("px",""));
        this.var6px     =   Number(rootVariables.getPropertyValue("--var6px").replace("px",""));
        this.var8px     =   Number(rootVariables.getPropertyValue("--var8px").replace("px",""));
        this.var10px    =   Number(rootVariables.getPropertyValue("--var10px").replace("px",""));
        this.arrowHead  =   Number(rootVariables.getPropertyValue("--arrowHeadlrW").replace("px",""));
        this.arrowBody  =   Number(rootVariables.getPropertyValue("--arrowBodyW").replace("px",""));

    }
    private getWidthAndHeightOfWindow = () =>{
        this.outerHeight = window.outerHeight;
        this.outerWidth  = window.outerWidth;
    }
    public initialResize = () =>{
        this.getInitialValues();
        this.getWidthAndHeightOfWindow();
        this.var1px     = 100*this.var1px/1920;
        this.var1_5px   = 100*this.var1_5px/1920;
        this.var2px     = 100*this.var2px/1920;
        this.var3px     = 100*this.var3px/1920;
        this.var4px     = 100*this.var4px/1920;
        this.var5px     = 100*this.var5px/1920;
        this.var6px     = 100*this.var6px/1920;
        this.var8px     = 100*this.var8px/1920;
        this.var10px    = 100*this.var10px/1920;
        this.arrowBody  = 100*this.arrowBody/1920;
        this.arrowHead  = 100*this.arrowHead/1920;
        this.calculateValues();
    }
    private calculateValues=()=>{
        root.style.setProperty("--var1px",`${this.var1px}vmax`);
        root.style.setProperty("--var2px",`${this.var2px}vmax`);
        root.style.setProperty("--var3px",`${this.var3px}vmax`);
        root.style.setProperty("--var4px",`${this.var4px}vmax`);
        root.style.setProperty("--var5px",`${this.var5px}vmax`);
        root.style.setProperty("--var6px",`${this.var6px}vmax`);
        root.style.setProperty("--var8px",`${this.var8px}vmax`);
        root.style.setProperty("--var10px",`${this.var10px}vmax`);
        root.style.setProperty("--arrowBodyW",`${this.arrowBody}vmax`);
        root.style.setProperty("--arrowHeadlrW",`${this.arrowHead}vmax`);
        root.style.setProperty("--arrowHeadlrH",`${this.arrowHead}vmax`);
    }
    public resizeWindow = () =>{
        this.getWidthAndHeightOfWindow();
    }
}
export const resizer = new Resizer();