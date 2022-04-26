import { InputLineControl } from "./Backend/InputLineControl";
import { erlaubteLängeL_C, Manipulator } from "./Backend/Manipulator";
import { ProjectWindow } from "./ProjectWindow";
import { InputLine } from "./Backend/InputLine";
import { getHtmlElement, createClickListener, updateScroll } from "./Tools";
import { aniControl, sleepFor, sleepUntilNextStep } from "./AnimationUtil";
import { contentloaded } from "./index";


const errorDescriptionDiv:HTMLElement = getHtmlElement('ErrorDescription');
const inputWindowContainer:HTMLElement = getHtmlElement('InputWindowContainter');


export const inputSelect:HTMLInputElement = getHtmlElement("bsppSelect") as HTMLInputElement;

export class InputWindow{

    private previousP:string="0";
    private inputcontrol:InputLineControl=InputLineControl.getInstance();
    private InputTextAreaElement:HTMLTextAreaElement;
    private pWindow:ProjectWindow;
    private filterOutput:HTMLElement;
    private filterInput:HTMLInputElement;

    constructor(p:ProjectWindow){
        this.InputTextAreaElement=getHtmlElement('InputTextArea')as HTMLTextAreaElement;
        this.pWindow=p;
        this.filterInput = getHtmlElement("filterInput") as HTMLInputElement;
        this.filterOutput = getHtmlElement("filterOutput");
    }

    public translate = ():void=>{
        try{
            let s:string[]=this.InputTextAreaElement.value.split("\n");
            if(!(s.length<1)){
                this.pWindow.refreshInputStrings(s);
                this.inputcontrol.addInputLines(s);
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

    private switchInputContent=()=>{
        let s:string = inputSelect.value;
        if(this.previousP=="0"){
            bsp0 =this.InputTextAreaElement.value.split("\n");
            if(bsp0[bsp0.length-1]==""){
                bsp0.pop();
            }
        }
        switch(s){
            case "0":
                this.addLinetoTextArea(bsp0);
                break;
            case "1":
                this.addLinetoTextArea(bsp1);
                break;
            case "2":
                this.addLinetoTextArea(bsp2);
                break;
            case "3":
                this.addLinetoTextArea(bsp3);
                break;
        }
        this.previousP=s;
        // this.addLinetoTextArea()
    }

    /* private getBsp=(s:string):string[]=>{
        Object.keys
    } */
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

    public createFilterable = () =>{
        let filterables:string[] = this.inputcontrol.filterables();
        let elem:HTMLElement;
        let type:string=""
        if(this.filterOutput != null){
            filterables.forEach(e=>{
                if(e=="Mnemocodes" || e=="PSEUDO-Mnemocodes"){
                    if(e=="Mnemocodes"){
                        type = "Mnemo";
                    }
                    else{
                        type = "pseudoMnemo";
                    }
                    elem = document.createElement("h3");
                    elem.innerHTML = e;
                    elem.id="filterable"+filterables.indexOf(e);
                    
                    this.filterOutput.appendChild(elem);
                }
                else{
                    elem = document.createElement("p");
                    elem.innerHTML = e;
                    elem.id="filterable"+filterables.indexOf(e);
                    elem.setAttribute("type",type);
                    this.filterOutput.appendChild(elem);
                }
            });
        }
    }
    public filterOutputDiv=()=>{
        let s = this.filterInput.value;
        let tempElem:HTMLElement|null;
        let i= 0;
        s = s.replace(/\s{1,}/g," ");
        
        tempElem = document.getElementById("filterable"+i);
        while(tempElem!=null){
            i++;
            if(tempElem.getAttribute("type")=="Mnemo" || tempElem.getAttribute("type")=="pseudoMnemo"){
                if(tempElem.innerHTML.toLowerCase().startsWith(s.toLowerCase()) || s==" " || s==""){
                    tempElem.classList.add("filterableShown");
                    tempElem.classList.remove("filterableNotShown");
                }
                else{
                    tempElem.classList.remove("filterableShown");
                    tempElem.classList.add("filterableNotShown");

                }
            }
            tempElem = document.getElementById("filterable"+i);
        }        
        console.log(s);
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
        inputSelect.addEventListener("change",this.switchInputContent);
        this.createFilterable();
        document.getElementById("filterDiv")!.addEventListener("mouseenter",function(){
            document.getElementById("filterOutput")!.setAttribute("filtering","true");
        })
        document.getElementById("filterDiv")!.addEventListener("mouseleave",function(){
            document.getElementById("filterOutput")!.setAttribute("filtering","false");
        });
        document.getElementById("filterDiv")!.addEventListener("touchstart",function(){
            document.getElementById("filterOutput")!.setAttribute("filtering","true");
        })
        document.getElementById("filterDiv")!.addEventListener("touchcancel",function(){
            document.getElementById("filterOutput")!.setAttribute("filtering","false");
        });
        this.filterInput.addEventListener("input",this.filterOutputDiv);
        this.filterOutput.addEventListener("click",(e)=>{
            let targetElem;
            console.log(e.target);
            if(e.target instanceof HTMLElement){
                targetElem = document.getElementById("filterInput") as HTMLInputElement
                if(targetElem != null){
                    console.log(e.target.innerHTML)
                    // targetElem.value = e.target.innerHTML;
                }
            }
        })
    }
    public generateDummy = ():void=>{
        this.addLinetoTextArea(bsp1);
    }
} 
let bsp0:string[]=[]
const bsp1:string[]=[
    "Label1:Mov A,95h","Mov B,95h","Mov C,95h","Mov IX,1295h","Mov HL,1095h","Mov SP,2395h","Mov A,B",
    "Mov A,C","Mov B,A","Mov B,C","Mov C,A","Mov C,B","Mov A,Label1","Mov HL,Label1","Mov IX,Label1",
    "Mov Label1,A","Mov Label1,HL","Mov Label1,IX","MOV A,[HL]","MOV [HL],A","PUSH","POP","IN A, 67h",
    "OUT 46, A","INC A","DEC A","ADD A","SUB A","AND A","OR A","XOR A","SHL","SHR","RCL","ROL","RCR",
    "ROR","CP A","JP Label1","CALL Label1","RET","HALT","NOP","DB 45h","DW 45h","RS 3","ORG 2323h",
    "const1 EQU 3434h"
]
const bsp2:string[]=[
    "mov hl, 0"
    ,"mov hl, 00h"
    ,"mov hl, 000000000000000000000000h"
    ,"mov hl, 000000000000000000000000"
    ,"dw 0"
    ,"dw 00"
    ,"dw 000"
    ,"dw 0000"
    ,"dw 000000000"
    ,"org 0000"
    ,"org 0"
    ,"const equ 0000h"
    ,"const2 equ 00h"
    ,"const3 equ 0"
    ,";org h"
]
const bsp3:string[]=[
    "label1:"
    ,"label2:"
    ,"label3:"
    ,"label4:"
    ,"label5:"
    ,"label6:"
    ,"label7:"
    ,"label8:"
    ,"label9:"
    ,"label10:"
    ,""
    ,"label:jp label"
    ,"jp label1"
    ,"jp label4"
    ,"jp label5"
    ,"jp label4"
]