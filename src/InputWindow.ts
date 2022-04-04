import { InputLineControl } from "./Backend/InputLineControl";
import { erlaubteLängeL_C, Manipulator } from "./Backend/Manipulator";
import { ProjectWindow } from "./ProjectWindow";
import { InputLine } from "./Backend/InputLine";
import { getHtmlElement, createClickListener, updateScroll } from "./Tools";
import { aniControl, sleepFor, sleepUntilNextStep } from "./AnimationUtil";


let errorDescriptionDiv:HTMLElement = getHtmlElement('ErrorDescription');
let inputWindowContainer:HTMLElement = getHtmlElement('InputWindowContainter');




export class InputWindow{
    private inputcontrol:InputLineControl=InputLineControl.getInstance();
    private InputTextAreaElement:HTMLTextAreaElement;
    private pWindow:ProjectWindow;

    constructor(p:ProjectWindow){
        this.InputTextAreaElement=getHtmlElement('InputTextArea')as HTMLTextAreaElement;
        this.pWindow=p;
    }
    public translate = ():void=>{
        try{
            let s:string[]=this.InputTextAreaElement.value.split("\n");
            if(!(s.length<1)){
                this.pWindow.refreshInputStrings(s);
                // this.inputcontrol.addInputLines(s);
            }
            else{
                throw new Error('No InputLines!');
            }
        }catch(e){
            console.log(e);
        }
    }
    private addLinetoTextArea=(s:string[])=>{
        this.InputTextAreaElement.value="";
        s.forEach(e => {
            this.InputTextAreaElement.value+=e+"\n";
        });
    }

    public translateAndGo = async()=>{
        await this.translate();
        await this.pushInputLines();
        await this.openEditWindow();        
    }
    public pushInputLines=async()=>{
        if(this.pWindow){
            await this.pWindow.reset()
            await this.pWindow.refreshInputLines();
            await this.pWindow.displayInputLines();
        }
    }
    public openEditWindow =()=>{
        try{
            aniControl.setPaused();
            let b =window.getComputedStyle(inputWindowContainer);
            if(b.getPropertyValue('visibility')=="hidden"){
                inputWindowContainer.style.visibility="visible";
            }
            else{
                inputWindowContainer.style.visibility="hidden";
            }
        }catch(e){
            console.log(e);
        }
    }
    
    public createEventListeners=()=>{
        try{
            
            const a= document.getElementById('EditWindowOpenButton');
                if(a!=null){
                a.addEventListener("click",this.openEditWindow);
            }
            else throw new Error("Element #EditWindowOpenButton is null!");
            
            const c=document.getElementById('Submit');
            if(c!=null){
                c.addEventListener("click",this.translateAndGo);
            }
            else throw new Error("Element #Submit is null!")
        }
        catch(e){
            console.log(e);
        }
        // createClickListener('Preview',this.previewTranslation);
        createClickListener('GenerateDummy',this.generateDummy);
        createClickListener('CloseInputWindow',this.openEditWindow);
    }
    public generateDummy = ():void=>{
        this.addLinetoTextArea([
            "Label1:Mov A,95h",
            "Mov B,95h",
            "Mov C,95h",
            "Mov IX,1295h",
            "Mov HL,1095h",
            "Mov SP,2395h",
            "Mov A,B",
            "Mov A,C",
            "Mov B,A",
            "Mov B,C",
            "Mov C,A",
            "Mov C,B",
            "Mov A,Label1",
            "Mov HL,Label1",
            "Mov IX,Label1",
            "Mov Label1,A",
            "Mov Label1,HL",
            "Mov Label1,IX",
            "MOV A,[HL]",
            "MOV [HL],A",
            "PUSH",
            "POP",
            "IN A, 67h",
            "OUT 46, A",
            "INC A",
            "DEC A",
            "ADD A",
            "SUB A",
            "AND A",
            "OR A",
            "XOR A",
            "SHL",
            "SHR",
            "RCL",
            "ROL",
            "RCR",
            "ROR",
            "CP A",
            "JP Label1",
            "CALL Label1",
            "RET",
            "HALT",
            "NOP",
            "DB 45h",
            "DW 45h",
            "RS 3",
            "ORG 2323h",
            "const1 EQU 3434h",
        ]);
    }
} 