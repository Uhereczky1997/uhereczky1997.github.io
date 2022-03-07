import { SymbolList } from "./Backend/SymbolList";
import { addClassTo, getIDOfSelected, ProjectWindow, removeClassOfAll } from "./ProjectWindow";
import { createClickListener, getHtmlElement } from "./Tools";


const main = ()=>{
    let p = new ProjectWindow();
    p.createListeners();
}
main();

const turnHidden=()=>{
    let existingElem = document.getElementById("TestElem") as HTMLParagraphElement;
    existingElem.style.visibility="hidden";
}
const createOrMoveTestElem=(e: PointerEvent)=>{
    let newElem:HTMLParagraphElement;
    let existingElem:HTMLParagraphElement;
    if(e.target instanceof HTMLParagraphElement){
        console.log("offsetHeight -"+e.target.offsetHeight);
        console.log("offsetLeft -"+e.target.offsetLeft);
        console.log(e.target.offsetParent);
        console.log("offsetTop -"+e.target.offsetTop);
        console.log("offsetWidth -"+e.target.offsetWidth);
        newElem = document.createElement("p");
        newElem.id="TestElem";
        newElem.classList.add("testElemStyle");
        newElem.style.top=`${e.target.offsetTop}`;
        newElem.style.left=`${e.target.offsetLeft}`;
        newElem.style.width=`${e.target.offsetWidth}`;
        newElem.style.height=`${e.target.offsetHeight}`;
        newElem.style.zIndex="5";
        if(document.getElementById("TestElem")==null){
            getHtmlElement("body").appendChild(newElem);
            createClickListener("TestElem",turnHidden);
        }
        else{
            existingElem = document.getElementById("TestElem") as HTMLParagraphElement;
            existingElem.style.top=`${e.target.offsetTop}`;
            existingElem.style.left=`${e.target.offsetLeft}`;
            existingElem.style.width=`${e.target.offsetWidth}`;
            existingElem.style.height=`${e.target.offsetHeight}`;
            existingElem.style.visibility="visible";
        }
    }
}
const moveTestElemToCurrentline = async ()=>{
    let testelem;
    let currentLineElem;
    let fromTop:number,toTop:number,fromLeft:number,toLeft:number;
    if(document.getElementById("TestElem")==null){
        throw Error("TestElem is null");
    }
    testelem = getHtmlElement("TestElem");
    currentLineElem = getHtmlElement("currentLine");

    console.log("offsetHeight /TestElem/ -> "+testelem.offsetHeight);
    console.log("offsetLeft /TestElem/ -> "+testelem.offsetLeft);
    fromLeft= testelem.offsetLeft;
    fromTop = testelem.offsetTop;
    console.log(testelem.offsetParent);
    console.log("offsetTop /TestElem/ -> "+testelem.offsetTop);
    console.log("offsetWidth /TestElem/ -> "+testelem.offsetWidth);


    console.log("offsetHeight /CurrentLineElem/ -> "+currentLineElem.offsetHeight);
    console.log("offsetLeft /CurrentLineElem/ -> "+currentLineElem.offsetLeft);
    console.log(currentLineElem.offsetParent);
    console.log("offsetTop /CurrentLineElem/ -> "+currentLineElem.offsetTop);
    console.log("offsetWidth /CurrentLineElem/ -> "+currentLineElem.offsetWidth);
}


const consoleClicked = async (e: any) =>{ //Eventbubbling is f-ing sick!
    let id:string;
    
    if(e instanceof PointerEvent){
        if(e.target instanceof HTMLElement){
            removeClassOfAll("highlighted");
            id=getIDOfSelected(e.target.id);
            addClassTo(id+"inputP","highlighted");
            addClassTo(id+"outputP","highlighted");
            console.log(getIDOfSelected(e.target.id));
            /* createOrMoveTestElem(e);
            try {
                await moveTestElemToCurrentline();
            } catch (error) {
                console.log(error);
            } */
            
        }
        
    }
    //console.log(getIDOfSelected(e));
}
const b = createClickListener("InputLines",consoleClicked);
const a = createClickListener("OutputLines",consoleClicked);
