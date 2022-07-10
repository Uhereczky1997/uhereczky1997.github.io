import { aniControl } from "./AnimationUtil";
import { p } from "./index";
import { inputText, outputText, OutputTextAreaElement, OutputWindowMachineCode, symbolTableLines } from "./ProjectWindow";


export const root = document.documentElement;
export const rootVariables = getComputedStyle(root);
export let preferedTheme = "light";
export let fullscreened:boolean = false;


export const getHtmlElement = (id:string)=> {
    return document.getElementById(id)!;
}

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
declare global {
    interface Document {
      mozCancelFullScreen?: () => Promise<void>;
      msExitFullscreen?: () => Promise<void>;
      webkitExitFullscreen?: () => Promise<void>;
      mozFullScreenElement?: Element;
      msFullscreenElement?: Element;
      webkitFullscreenElement?: Element;
    }
  
    interface HTMLElement {
      msRequestFullscreen?: () => Promise<void>;
      mozRequestFullscreen?: () => Promise<void>;
      webkitRequestFullscreen?: () => Promise<void>;
    }
}

export const switchToFullscreen=()=>{
    var elem = document.documentElement;
    const elem2 = document.getElementById("vollbild");
    if(elem!=null && elem2 !=null){
        if(!fullscreened){
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) { /* Safari */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE11 */
                elem.msRequestFullscreen();
            }
            elem2.setAttribute("fullscreen","on");
            fullscreened =true;
        }
        else{
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            elem2.setAttribute("fullscreen","off");
            fullscreened=false;
        }
    }
}

export const outputClip = () =>{
    var copyText = document.getElementById("OutputTextArea") as HTMLTextAreaElement;
    if(copyText!=null){
        navigator.clipboard.writeText(copyText.value);
    }
}

export const syncScroll_MachineCode_Hexadecimal = () =>{
    var ignoreScrollEvents2 = false;
    // console.log(OutputWindowMachineCode.scrollTop);
    // console.log(OutputTextAreaElement.scrollTop);
    try{
        if(OutputWindowMachineCode!=null && OutputTextAreaElement!=null){
            OutputWindowMachineCode.onscroll = function(){
                var ignore = ignoreScrollEvents2
                ignoreScrollEvents2 = false
                if (ignore) return
                
                ignoreScrollEvents2 = true 
                OutputTextAreaElement.scrollTop=OutputWindowMachineCode.scrollTop;

            }
            OutputTextAreaElement.onscroll = function (){
                var ignore = ignoreScrollEvents2
                ignoreScrollEvents2 = false
                if (ignore) return
                
                ignoreScrollEvents2 = true
                OutputWindowMachineCode.scrollTop=OutputTextAreaElement.scrollTop;
            }
        }
        else throw new Error("Element OutputWindowMachineCode oder OutputTextAreaElement ist null!");
    
    }catch(e){
        console.log(e);
    }
}

export const setCurrentlyHovered = async (e: any) =>{ //Eventbubbling is f-ing sick!
    let id:string;
    if(e.target instanceof HTMLElement){
        removeClassOfAll("highlighted");
        id=getIDOfSelected(e.target.id);
        // console.log(id);
        addClassTo(id+"inputP","highlighted");
        addClassTo(id+"outputP","highlighted");
        
    }
    return false;
}
export const onscrollIn_Out = () =>{
    var ignoreScrollEvents = false
    try{
        if(inputText!=null && outputText!=null){
            inputText.onscroll = function(){
                if(aniControl.play) return;
                var ignore = ignoreScrollEvents
                ignoreScrollEvents = false
                if (ignore) return

                ignoreScrollEvents = true
                if(inputText!=null && outputText!=null){
                    outputText.scrollTop=inputText.scrollTop;
                }
            }
            outputText.onscroll = function (){
                if(aniControl.play) return;

                var ignore = ignoreScrollEvents
                ignoreScrollEvents = false
                if (ignore) return

                ignoreScrollEvents = true
                if(inputText!=null && outputText!=null){

                    inputText.scrollTop=outputText.scrollTop;
                }
            }
        }
        else throw new Error("Element InputText oder OutputText ist null!");
    
    }catch(e){
        console.log(e);
    }
}

export const changeTheme = () =>{
    let theme:string = preferedTheme==="light" ? 'dark' : 'light';
    preferedTheme = theme;
    const root = document.querySelector(':root');
    root!.setAttribute('color-scheme', `${theme}`);
}
class Resizer{

    private outerHeight:number  = 100;
    private outerWidth:number   = 100;
    private prevbodyInnerH:number   = 100;
    private prevbodyInnerW:number   = 100;
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
    public get1PXEquivalent = ():number =>{
        return this.var1px;
    }
    public initialResize = () =>{
        this.getInitialValues();
        this.getWidthAndHeightOfWindow();
        this.setParameterstoPX();
        this.calculateValuestoPX();
    }
    private setParameterstoPX=()=>{
        let n:number,m:number;
        n =this.outerWidth>this.outerHeight?window.innerWidth/1920:window.innerHeight/937;
        m =this.outerWidth<this.outerHeight?window.innerWidth/1920:window.innerHeight/937;
        this.var1px     = 1*Number(n.toFixed(2));
        this.var1_5px   = 1.5*Number(n.toFixed(2));
        this.var2px     = 2*Number(n.toFixed(2));
        this.var3px     = 3*Number(n.toFixed(2));
        this.var4px     = 4*Number(n.toFixed(2));
        this.var5px     = 5*Number(n.toFixed(2));
        this.var6px     = 6*Number(n.toFixed(2));
        this.var8px     = 8*Number(n.toFixed(2));
        this.var10px    = 10*Number(n.toFixed(2));
        this.arrowBody  = Math.ceil(20*Number(m.toFixed(2)));
        if(this.arrowBody%2!=0){
            this.arrowBody=this.arrowBody+1;
        }
        this.arrowHead  = 2*this.arrowBody;
    }
    private calculateValues=()=>{
        root.style.setProperty("--var1px",`${this.var1px}vmax`);
        root.style.setProperty("--var1_5px",`${this.var1_5px}vmax`);
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
    private calculateValuestoPX=()=>{
        root.style.setProperty("--var1px",`${this.var1px}px`);
        root.style.setProperty("--var1_5px",`${this.var1_5px}px`);
        root.style.setProperty("--var2px",`${this.var2px}px`);
        root.style.setProperty("--var3px",`${this.var3px}px`);
        root.style.setProperty("--var4px",`${this.var4px}px`);
        root.style.setProperty("--var5px",`${this.var5px}px`);
        root.style.setProperty("--var6px",`${this.var6px}px`);
        root.style.setProperty("--var8px",`${this.var8px}px`);
        root.style.setProperty("--var10px",`${this.var10px}px`);
        root.style.setProperty("--arrowBodyW",`${this.arrowBody}px`);
        root.style.setProperty("--arrowHeadlrW",`${this.arrowHead}px`);
        root.style.setProperty("--arrowHeadlrH",`${this.arrowHead}px`);
    }
    public resizeWindow = () =>{
        this.getWidthAndHeightOfWindow();
        this.setParameterstoPX();
        console.log("Innerwidth: "+window.innerWidth);
        console.log("Innerheight: "+window.innerHeight);
        this.calculateValuestoPX();
    }
}
export const resizer = new Resizer();