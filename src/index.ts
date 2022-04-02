import { ProjectWindow } from "./ProjectWindow";
import { createClickListener } from "./Tools";
import { aniControl } from "./AnimationUtil";
import { addClassTo, getIDOfSelected, inputText, outputText, removeClassOfAll } from "./ProjectWindow";


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
export const setCurrentlyHovered = async (e: any) =>{ //Eventbubbling is f-ing sick!
    let id:string;
    if(e instanceof PointerEvent){
        if(e.target instanceof HTMLElement){
            removeClassOfAll("highlighted");
            id=getIDOfSelected(e.target.id);
            addClassTo(id+"inputP","highlighted");
            addClassTo(id+"outputP","highlighted");
            console.log(getIDOfSelected(e.target.id));
            
        }
    }
}
let preferedTheme = "dark"

let p = new ProjectWindow();
const changeTheme = () =>{
    let theme:string = preferedTheme==="light" ? 'dark' : 'light';
    preferedTheme = theme;
    const root = document.querySelector(':root');
    root!.setAttribute('color-scheme', `${theme}`);

}

const main = ()=>{
    
    p.createListeners();
    onscrollIn_Out();
    createClickListener("InputLines",setCurrentlyHovered);
    createClickListener("light",changeTheme);
    window.addEventListener('DOMContentLoaded', () =>{
        const root = document.querySelector(':root');
        root!.setAttribute('color-scheme', `${preferedTheme}`);
    })
    // createClickListener("OutputLines",setCurrentlyHovered);
}
main();


/* const b = createClickListener("InputLines",consoleClicked);
const a = createClickListener("OutputLines",consoleClicked); */
