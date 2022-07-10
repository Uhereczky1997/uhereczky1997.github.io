import { aniControl } from "./AnimationUtil";
import { InputLines, ProjectWindow } from "./ProjectWindow";
import { changeTheme, createClickListener, onscrollIn_Out, outputClip, preferedTheme, resizer, setCurrentlyHovered, switchToFullscreen, syncScroll_MachineCode_Hexadecimal } from "./Tools";


export const p = new ProjectWindow();
export let contentloaded:boolean= false;

window.addEventListener('DOMContentLoaded', async() =>{
    const root1 = document.querySelector(':root');
    root1!.setAttribute('color-scheme', `${preferedTheme}`);
    contentloaded=true;
    resizer.initialResize();
    aniControl.setLoaded(true);
})
const  main =async ()=>{
    onscrollIn_Out();
    createClickListener("InputLines",setCurrentlyHovered);
    InputLines.addEventListener("touchstart",setCurrentlyHovered);
    createClickListener("light",changeTheme);
    createClickListener("OutputClip",outputClip);
    syncScroll_MachineCode_Hexadecimal();
    createClickListener("vollbild",switchToFullscreen);
    window.addEventListener("resize",resizer.resizeWindow);
    document.getElementById("vollbild")!.setAttribute("fullscreen","off");
    p.createListeners();
}
main();
