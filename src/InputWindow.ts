import { InputLineControl } from "./Backend/InputLineControl";
import { Manipulator } from "./Backend/Manipulator";
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
    
    public displayError():string{
        let inputs:InputLine[] = this.inputcontrol.getInputLines();
        let ss:string[];
        let toReturn:string="";
        let anzahl= 0;
        inputs.forEach(e=>{
            ss=e.getDescriptionLine();
            if(ss.find(e=>{return e.includes("error")})!=undefined){                
                anzahl +=1;
            } 
        })
        if(anzahl!=0){
            toReturn += `<div class="backgroundError"><p class="bold">Anzahl der Syntaxfehler: ${anzahl}</p></div>`;
        }
        return toReturn;
    }
    public translate = ():void=>{
        try{
            let s:string[]=this.InputTextAreaElement.value.split("\n");
            // this.InputTextAreaElement.
            /* s=s.filter(e=>{
                e=Manipulator.removeExcessWhiteSpace(e);
                if(e.length>0){
                    return e;
                }
            }) */
            if(!(s.length<1)){
                this.pWindow.refreshInputStrings(s);
                this.inputcontrol.addInputLines(s);
            }
            else{
                throw new Error('No InputLines!');
            }
            //this.previewTranslation();
        }catch(e){
            console.log(e);
        }
    }
    
    public previewTranslation = async() =>{
        let s:string;
        this.translate();
        s = this.displayError();
        // console.log(s.length);
        errorDescriptionDiv.innerHTML=s;
        /* if(s.length>88){
        }
        else{
            errorDescriptionDiv.innerHTML= `<div class="backgroundNoError"><p>Keine syntaktische Fehler!</p></div>`
        } */
        /* 
        errorDescriptionDiv.innerHTML="";
        let inputs:InputLine[] = this.inputcontrol.getInputLines();
        for(let i=0;i<inputs.length;i++){
            previewType.checked?await this.pushPreview(inputs[i],10):this.displaySummary(inputs[i]);
            // await this.pushPreview(inputs[i],10);
            // this.displaySummary(inputs[i]);
        } 
        */
    }
    private pushPreview = async (e:InputLine,n:number) =>{
        await sleepFor(n);
        errorDescriptionDiv.innerHTML += `<p> ${e.getDescriptionLine().join("</p><p>")} </p>`;
        errorDescriptionDiv.innerHTML += `<p> ----------------------------------------- </p>`;
        updateScroll(errorDescriptionDiv.id);
        // console.log(e.getTranslation());
    }
    private addLinetoTextArea=(s:string[])=>{
        this.InputTextAreaElement.value="";
        s.forEach(e => {
            this.InputTextAreaElement.value+=e+"\n";
        });
    }

    public translateAndGo = async()=>{
        try{
            await this.translate();
            //if(!this.inputcontrol.hasInvalid()){
            await this.pushInputLines();
            await this.openEditWindow();
            //}
            //else window.alert(`Input has InvalidLines-> ${this.inputcontrol.getInvalidIDs()}`);
        }catch(e){
            console.log(e);
        }
        
    }
    public pushInputLines=async()=>{
        if(this.pWindow){
            await this.pWindow.reset()
            // this.pWindow.partialReset();
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
            // console.log(this);
        }catch(e){
            console.log(e);
        }
    }
    // private setAutoPreview()
    
    public createEventListeners=()=>{
        try {
            const inputTextArea:HTMLTextAreaElement=document.getElementById("InputTextArea") as HTMLTextAreaElement
            if(inputTextArea!=null){
                inputTextArea.addEventListener("blur",this.previewTranslation);
            }

        } catch (error) {  
            console.log(error);
        }
        try{
            
            const a= document.getElementById('EditWindowOpenButton');
                if(a!=null){
                a.addEventListener("click",this.openEditWindow);
            }
            else throw new Error("Element #EditWindowOpenButton is null!");
        
            /* const b= document.getElementById('Translate');
            if(b!=null){
                b.addEventListener("click",this.translate);
            }
            else throw new Error("Element #Translate is null!"); */
            
            const c=document.getElementById('Submit');
            if(c!=null){
                c.addEventListener("click",this.translateAndGo);
            }
            else throw new Error("Element #Submit is null!")
        }
        catch(e){
            console.log(e);
        }
        createClickListener('Preview',this.previewTranslation);
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
// export iWindow:InputWindow= new InputWindow()