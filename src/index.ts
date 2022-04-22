import { InputLines, OutputTextAreaElement, OutputWindowMachineCode, ProjectWindow } from "./ProjectWindow";
import { addClassTo, createClickListener, getHtmlElement, getIDOfSelected, removeClassOfAll, resizer } from "./Tools";
import { aniControl, sleepFor } from "./AnimationUtil";
import { inputText, outputText } from "./ProjectWindow";
import { Manipulator } from "./Backend/Manipulator";

export const onscrollIn_Out = () =>{
    /* let inputText= document.getElementById("InputText");
    let outputText= document.getElementById("OutputText"); */
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
                // if(inputText!=null && outputText!=null&&!aniControl.play){
                if(aniControl.play) return;

                var ignore = ignoreScrollEvents
                ignoreScrollEvents = false
                if (ignore) return

                ignoreScrollEvents = true
                if(inputText!=null && outputText!=null){
                    /* if(inputText.scrollTop>outputText.scrollTop && inputText.scrollTop+inputText.clientHeight>outputText.scrollHeight){

                    } */
                    inputText.scrollTop=outputText.scrollTop;
                }
            }
        }
        else throw new Error("Element InputText oder OutputText ist null!");
    
    }catch(e){
        console.log(e);
    }
}
export const root = document.documentElement;
export const rootVariables = getComputedStyle(root);
export let contentloaded:boolean= false;
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
const switchToFullscreen=()=>{
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
const consoleWindowsize=()=>{
    let s:number = Number(rootVariables.getPropertyValue("--arrowBodyW").replace("px",""));
    console.log("Innerwidth: "+window.innerWidth);
    console.log("Innerheight: "+window.innerHeight);

    console.log("Outerwidth: "+window.outerWidth);
    console.log("Outerheight: "+window.outerHeight);

}
const outputClip = () =>{
    var copyText = document.getElementById("OutputTextArea") as HTMLTextAreaElement;
    if(copyText!=null){
        navigator.clipboard.writeText(copyText.value);
    }
}
const syncScroll_MachineCode_Hexadecimal = () =>{
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
    /* if(e instanceof PointerEvent){
    } */
    return false;
}

const changeTheme = () =>{
    let theme:string = preferedTheme==="light" ? 'dark' : 'light';
    preferedTheme = theme;
    const root = document.querySelector(':root');
    root!.setAttribute('color-scheme', `${theme}`);
    
}

let preferedTheme = "light";
let fullscreened:boolean = false;

let p = new ProjectWindow();

window.addEventListener('DOMContentLoaded', async() =>{
    const root1 = document.querySelector(':root');
    root1!.setAttribute('color-scheme', `${preferedTheme}`);
    contentloaded=true;
    resizer.initialResize();
    aniControl.setLoaded(true);
})
const testBinToHex=()=>{
    let ss:string[]=[
        Manipulator.binToHex("1111"),
        Manipulator.binToHex("01111"),
        Manipulator.binToHex("001111"),
        Manipulator.binToHex("001111"),
        Manipulator.binToHex("0001111"),
        Manipulator.binToHex("00001111"),
        Manipulator.binToHex("000001111")
    ];
    ss.forEach(e=>console.log(e));
}
const  main =async ()=>{
    p.createListeners();
    onscrollIn_Out();
    createClickListener("InputLines",setCurrentlyHovered);
    InputLines.addEventListener("touchstart",setCurrentlyHovered);
    createClickListener("light",changeTheme);
    createClickListener("OutputClip",outputClip);
    syncScroll_MachineCode_Hexadecimal();
    createClickListener("vollbild",switchToFullscreen);
    window.addEventListener("resize",consoleWindowsize);
    document.getElementById("vollbild")!.setAttribute("fullscreen","off");
    // testBinToHex();
}
main();
