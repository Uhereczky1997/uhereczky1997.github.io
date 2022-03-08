
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
export const updateScrollOfIn_Out=(id:string,targetID:string,n:number)=>{
    var elem = getHtmlElement(id);
    var targetElem = getHtmlElement(targetID);
    if(targetElem.offsetTop+targetElem.offsetHeight>elem.offsetTop+elem.clientHeight){
        console.log((targetElem.offsetTop-elem.offsetTop-elem.clientHeight)+" <-> "+elem.scrollTop);
        console.log("-------------------------");
        elem.scrollTop=(targetElem.offsetTop-elem.offsetTop-elem.clientHeight+targetElem.offsetHeight);

    }
}
