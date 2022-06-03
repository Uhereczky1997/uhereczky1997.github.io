import { InputLineControl } from "./Backend/InputLineControl";
import { ProjectWindow } from "./ProjectWindow";
import { getHtmlElement, createClickListener  } from "./Tools";
import { aniControl} from "./AnimationUtil";

import { descriptionLoader } from "./Backend/StringConstructor";
import { Manipulator } from "./Backend/Manipulator";


const errorDescriptionDiv:HTMLElement = getHtmlElement('ErrorDescription');
const inputWindowContainer:HTMLElement = getHtmlElement('InputWindowContainter');
export var timeout:NodeJS.Timeout;

export const inputSelect:HTMLInputElement = getHtmlElement("bsppSelect") as HTMLInputElement;
export const filterableDescription:HTMLElement = getHtmlElement("filterableDescription") as HTMLInputElement;
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
                this.pWindow.setPotentialConsts(this.preTranslateDefConst(s));
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

    public preTranslateDefConst = (ss:string[]):string[] =>{
        let potentialConsts:string[]=[];

        let s;
        ss.forEach(e =>{
            let i = Manipulator.splitStringHalf(e,";");
            if(i[0].replace(/\s/g,"")!=""){
                s = i[0].match(/(\s*_|^_)\w+(?=\s+EQU\s+([0-9]+|[A-Fa-f0-9]+h|[01]+b)\s*$)/i)
                if(s!=null){
                    potentialConsts.push(s[0].trim())
                }
            }
        });
        // console.log(potentialConsts);
        return potentialConsts;
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
            case "4":
                this.addLinetoTextArea(bsp4);
                break;
        }
        this.previousP=s;
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
                    elem.setAttribute("type","title");
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
        s = s.replace(/\s+/g," ");
        s = s.replace(/,\s/g,",");
        
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
        document.getElementById("filterDiv")!.addEventListener("focusin",function(){
            document.getElementById("filterOutput")!.setAttribute("filtering","true");
        })
        /* document.getElementById("filterDiv")!.addEventListener("mouseup",function(){
            document.getElementById("filterOutput")!.setAttribute("filtering","false");
        }); */
        document.getElementById("body")!.addEventListener("mouseup",(e)=>{
            let targetElem = document.getElementById("filterDiv");
            if(targetElem!=null){
                if(e.target instanceof HTMLElement){
                    if(!e.target.id.startsWith("filter")){
                        document.getElementById("filterOutput")!.setAttribute("filtering","false");
                    }
                }
            }
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
            if(e.target instanceof HTMLElement){
                targetElem = document.getElementById("filterInput") as HTMLInputElement
                if(targetElem != null){
                    if(e.target.getAttribute("type")=="Mnemo" || e.target.getAttribute("type")=="pseudoMnemo"){
                        targetElem.value = e.target.innerHTML;
                        navigator.clipboard.writeText(targetElem.value);
                    }
                }
            }
        });
        this.filterOutput.addEventListener("mouseover",(e)=>{
            let targetElem;
            if(e.target instanceof HTMLElement){
                targetElem = document.getElementById("filterableDescription") as HTMLInputElement;
                if(targetElem != null){
                    if(e.target.getAttribute("type")=="Mnemo" || e.target.getAttribute("type")=="pseudoMnemo"){
                        descriptionLoader.loadDescription(e.target.innerHTML);
                        if(timeout!=null){
                            clearTimeout(timeout);
                        }
                        timeout = setTimeout(function(){
                            document.getElementById("filterableDescription")!.style.visibility="visible";
                        },1200);
                    }
                }
            }
        });
        this.filterOutput.addEventListener("mouseout",(e)=>{
            let targetElem;
            if(e.target instanceof HTMLElement){
                if(timeout!=null){
                    clearTimeout(timeout);
                    document.getElementById("filterableDescription")!.style.visibility="hidden";
                }
            }
        });
        document.getElementById("filtercopyInputValue")!.addEventListener("click",function(){
            var copyText = document.getElementById("filterInput") as HTMLInputElement;
            if(copyText!=null){
                navigator.clipboard.writeText(copyText.value);
            }
        })
    }
    public generateDummy = ():void=>{
        //this.preTranslateDefConst(this.InputTextAreaElement.value.split("\n"));
        // this.createCode(this.InputTextAreaElement.value.split("\n"))
        this.listInstructionLibrary();
    }
    private listInstructionLibrary = ():void =>{
        let consolestring:string= "";
        consolestring = this.inputcontrol.filterables().join("\n");
        console.log(consolestring);
    }
    private createCode = (s:string[])=>{
        let consolestring:string = "[\n";
        s.forEach(e =>{
            consolestring = consolestring +"\""+e.trim()+"\","+"\n";
        })
        consolestring = consolestring +"]";
        console.log(consolestring);
    }
} 
let bsp0:string[]=[]
const bsp1:string[]=[
    "_const1 EQU 3434h","Label1:Mov A,95h","Mov B,95h","Mov C,95h","Mov IX,1295h","Mov HL,1095h","Mov SP,2395h","Mov A,B",
    "Mov A,C","Mov B,A","Mov B,C","Mov C,A","Mov C,B","Mov A,Label1","Mov HL,Label1","Mov IX,Label1",
    "Mov Label1,A","Mov Label1,HL","Mov Label1,IX","MOV A,[HL]","MOV [HL],A","PUSH","POP","IN A, 67h",
    "OUT 46, A","INC A","DEC A","ADD A","SUB A","AND A","OR A","XOR A","SHL","SHR","RCL","ROL","RCR",
    "ROR","CP A","JP Label1","CALL Label1","RET","HALT","NOP","DB 45h","DW 45h","RS 3","ORG 2323h",
]
const bsp2:string[]=[
    "mov a,b",
    "org 10",
    "mov a,b",
    "org 2",
    "mov a,b",
    "mov sp, 1000h",
    "mov sp, 1000h",
    "mov sp, 1000h",
    "mov sp, 1000h"
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
const bsp4:string[]=[
    "_const equ 1343h",
    "_var equ 12",
    "",
    "mov a, _var",
    "in a,_var",
    "in a,_const",
    "label: mov hl,_var",
]