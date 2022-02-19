import { SymbolList } from "./Backend/SymbolList";
import { addClassTo, getIDOfSelected, ProjectWindow, removeClassOfAll } from "./ProjectWindow";
import { createClickListener } from "./Tools";


const main = ()=>{
    let p = new ProjectWindow();
    p.createListeners();
}
main();

const consoleClicked = (e: any) =>{ //Eventbubbling is f-ing sick!
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
    //console.log(getIDOfSelected(e));
}
const b = createClickListener("InputLines",consoleClicked);
const a = createClickListener("OutputLines",consoleClicked);
