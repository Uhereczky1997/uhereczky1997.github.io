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