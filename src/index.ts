import { ProjectWindow } from "./ProjectWindow";
import { createClickListener } from "./Tools";
import { aniControl } from "./AnimationUtil";
import { addClassTo, getIDOfSelected, inputText, outputText, removeClassOfAll } from "./ProjectWindow";

export const onscrollIn_Out = () =>{
    /* let inputText= document.getElementById("InputText");
    let outputText= document.getElementById("OutputText"); */
    try{
        if(inputText!=null && outputText!=null){
            inputText.onscroll = function(){
                if(inputText!=null && outputText!=null){
                    outputText.scrollTop=inputText.scrollTop;
                }
            }
            outputText.onscroll = function (){
                // if(inputText!=null && outputText!=null&&!aniControl.play){
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

const main = ()=>{
    let p = new ProjectWindow();
    p.createListeners();
    onscrollIn_Out();
    createClickListener("InputLines",setCurrentlyHovered);
    createClickListener("OutputLines",setCurrentlyHovered);
}
main();

/* const b = createClickListener("InputLines",consoleClicked);
const a = createClickListener("OutputLines",consoleClicked); */
