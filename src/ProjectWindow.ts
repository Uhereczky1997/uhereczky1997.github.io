

import { Manipulator } from "./Backend/Manipulator";
import { SymbolList } from "./Backend/SymbolList";
import { DataType,InputLineType } from "./Backend/Enums";
import { Label } from "./Backend/Label";
import { Constant } from "./Backend/Constant";
import { InputLineControl } from "./Backend/InputLineControl";
import { InputLine } from "./Backend/InputLine";
import { InputWindow } from "./InputWindow";
import { getHtmlElement, createClickListener, updateScroll, updateScrollOfIn_Out, removeClassOfAll, addClassTo, updateScrollOfDescriptionLines, removeClassOf } from "./Tools";
import { aniControl, AnimationType, checkIfPaused, playButton, resetButton, sleepFor, sleepStaticAnimation, sleepUntilNextStep } from "./AnimationUtil";
import { Animator } from "./Animator";
import { StringConstructor } from "./Backend/StringConstructor";



export const descriptionLines:HTMLElement = getHtmlElement('descriptionLines');
export const symbolTableLines:HTMLElement = getHtmlElement('symbolTableLines');
export const currentLine:HTMLElement = getHtmlElement('currentLine');
export const outputText:HTMLElement = getHtmlElement('OutputText');
export const inputText:HTMLElement= getHtmlElement('InputText');
export const addresszahler:HTMLElement = getHtmlElement('Addresszahler');
export const machinenbefehl:HTMLElement = getHtmlElement('Machinenbefehl');
export const outputwindowContainer:HTMLElement = getHtmlElement('OutputWindowContainer');
export const OutputTextAreaElement:HTMLTextAreaElement =getHtmlElement('OutputTextArea')as HTMLTextAreaElement;
export const InputID:HTMLElement=getHtmlElement('InputID');
export const InputLines:HTMLElement=getHtmlElement('InputLines');
export const OutputAddresses:HTMLElement=getHtmlElement('OutputAddresses');
export const OutputLines:HTMLElement=getHtmlElement('OutputLines');
export const currentLineLine:HTMLElement =getHtmlElement("currentLineLine");
export const windowOutputAddresses:HTMLElement = getHtmlElement("OutputWindowAddresses");
export const windowOutputLines:HTMLElement = getHtmlElement("OutputWindowLines");
export const OutputWindowMachineCode:HTMLElement = getHtmlElement("OutputWindowMachineCode");
export const targetSymbolTableLine:string="bufferTargetSymbolTable";
export const targetlabelValuePlaceholder:string="labelValuePlaceholder"
export const p2LabelValuePlaceholder:string="p2LabelValuePlaceholder";


export const searchEntryLabel:string="searchEntryLabel";
export const symboladdress:string="symboladdress";
export const translating:HTMLElement=getHtmlElement("translatingContainer");
export const translatingInfo:HTMLSpanElement= getHtmlElement("translatingInfo") as HTMLSpanElement;
export const setTranslatingDivHidden=()=>{
    translating.style.visibility="hidden";
}
export const  setTranslatingDivVisible=()=>{
    if(aniControl.isAni3() && aniControl.speed==4 && aniControl.play && translating.getAttribute("displayable")=="true"){
        // console.log("set");
        translating.style.visibility="visible";
    }
}
const setWarningSign=(b:boolean)=>{
    document.getElementById("warningSign")!.setAttribute("selected",b.toString());
}
export const selectTranslatingLine = (id:string) =>{
    removeClassOfAll("currentlyTranslated");
    addClassTo(id,"currentlyTranslated");
}

export class ProjectWindow{

    private inputLineControl:InputLineControl=InputLineControl.getInstance();
    private symbolList:SymbolList=SymbolList.getInstance();
    private iWindow:InputWindow = new InputWindow(this);
    private anim:Animator;
    private linkerAuflosungB:boolean=false;
    private nextParseID:number=0;
    private inputLines:InputLine[]=[];
    private inputstrings:string[] =[];
    private potentialConsts:string[] = [];
    private symbols:Array<Label|Constant>=[];

    constructor(){
        this.anim = new Animator();
    }
    
    public partialReset =async () =>{
        this.inputLines=[];
        await this.clearMachinenbefehlandCurrentLine();
        symbolTableLines.innerHTML=`<h4 id="${targetSymbolTableLine}"> &nbsp; </h4>`;
        descriptionLines.innerHTML="";
        addresszahler.innerHTML="0000h";
        translating.setAttribute("displayable","true");
        this.nextParseID=0;
        OutputAddresses.innerHTML="";
        OutputLines.innerHTML="";
        OutputTextAreaElement.innerHTML="";
        windowOutputAddresses.innerHTML="";
        windowOutputLines.innerHTML="";
        await this.inputLineControl.reset();
        await this.anim.reset();
        await aniControl.resetFlags();
        getHtmlElement("InputText").scrollTop=0;
        setWarningSign(false);
    }
    public setPotentialConsts(s:string[]){
        this.potentialConsts = s;
    }

    public refreshInputListItems=()=>{
        InputID.innerHTML="";
        InputLines.innerHTML="";
        OutputAddresses.innerHTML="";
        OutputLines.innerHTML="";
        let ss:string[]=[];
        let e:InputLine;
        var inputstring:string;
        for(let i=0;i<this.inputstrings.length;i++){
            e=this.inputLines[i];
            if(e !=null){
                if(e.getType()==InputLineType.EMPTY){
                    InputID.innerHTML+=`<p id="${(i+1)<10?"0"+(i+1):(i+1)}inputLineId" class="gray">${(i+1)<10?"0"+(i+1):(i+1)}:</p>`;
                    InputLines.innerHTML+=`<p id="${(i+1)<10?"0"+(i+1):(i+1)}inputP" class="overflowElipsis">${e.getCommentary()==""?"":";"+e.getCommentary()}</p>`;
                }else{
                    InputID.innerHTML+=`<p  class="gray">${(i+1)<10?"0"+(i+1):(i+1)}:</p>`;
                    InputLines.innerHTML+=`<p id="${(i+1)<10?"0"+(i+1):(i+1)}inputP" class="overflowElipsis">${Manipulator.formatLabelandBefehlDisplay(e.getLabel(),e.getFirstPart(),e.commandLinetoString(false))}${e.getCommentary()==""?"":";"+e.getCommentary()}</p>`;
                }
                OutputAddresses.innerHTML+=`<p id="${(i+1)<10?"0"+(i+1):(i+1)}oAddress" class="gray">&nbsp;</p>`;
                OutputLines.innerHTML+=`<p id="${(i+1)<10?"0"+(i+1):(i+1)}outputP" class="overflowElipsis">&nbsp;</p>`;
            }
            else{
                inputstring = this.inputstrings[i];
                
                this.potentialConsts.forEach(e=>{
                    // var var1:RegExp = new RegExp('.*,(\s*|\s+)'+e+'.*');
                    var var1:RegExp = new RegExp("\\s+"+e+"\\s*,","ig");
                    var var2:RegExp = new RegExp(",\\s*"+e+"(\\s*$|\\s+)","ig");
                    var var3:RegExp = new RegExp("(\\s+|^\\s*)"+e+"(\\s+|\\s*$)","ig");
                    // var var4:RegExp = new RegExp("(\\s+|\\s*)"+e+"\\s+","i");
                    if(inputstring.match(var1)!=null){
                        // inputstring = inputstring.replace(e,`<span class="purple">${e}</span>`);
                        inputstring = inputstring.replace(var1,` <span class="purple">${e}</span>,`);
                    }
                    if(inputstring.match(var2)!=null){
                        inputstring = inputstring.replace(var2,`,<span class="purple">${e}</span> `);
                    }
                    if(inputstring.match(var3)!=null){
                        inputstring = inputstring.replace(var3,` <span class="purple">${e}</span> `);
                        
                    }
                })
               
                InputID.innerHTML+=`<p id="${(i+1)<10?"0"+(i+1):(i+1)}inputLineId" class="gray">${(i+1)<10?"0"+(i+1):(i+1)}:</p>`;
                InputLines.innerHTML+=`<p id="${(i+1)<10?"0"+(i+1):(i+1)}inputP"  class="overflowElipsis">${inputstring} &nbsp;</p>`;
                OutputAddresses.innerHTML+=`<p id="${(i+1)<10?"0"+(i+1):(i+1)}oAddress" class="gray">&nbsp;</p>`;
                OutputLines.innerHTML+=`<p id="${(i+1)<10?"0"+(i+1):(i+1)}outputP" class="overflowElipsis">&nbsp;</p>`;
            }
        }
        // console.log("items refreshed");
    }

    public refreshInputListItem=(i:number)=>{
        if(i<this.inputLines.length){
            let e:InputLine=this.inputLines[i];
            let idString = `${(i+1)<10?"0"+(i+1):(i+1)}inputP`;
            let inputLineHTML:HTMLElement = getHtmlElement(idString);
            // console.log(inputLineHTML);
            if(e.getType()==InputLineType.EMPTY){
                inputLineHTML.innerHTML=`${e.getCommentary()==""?"":";"+e.getCommentary()}`;
            }
            else if(e.getType()==InputLineType.PSEUDOTRANSLATED){
                inputLineHTML.innerHTML=`${Manipulator.formatLabelDisplay(e.getLabel(),true)}${e.getCommentary()==""?"":";"+e.getCommentary()}`;
            }
            else{
                if(this.symbolList.isConst(e.getFirstPart())){
                    inputLineHTML.innerHTML=`${Manipulator.formatConstandBefehlDisplay(e.getFirstPart(),e.getSecondPart(),e.commandLinetoString(true))}${e.getCommentary()==""?"":";"+e.getCommentary()}`;
                    inputLineHTML.innerHTML = inputLineHTML.innerHTML.replace(e.getFirstPart(),`<span class="purple">${e.getFirstPart()}</span>`)
                }
                else {
                    inputLineHTML.innerHTML=`${Manipulator.formatLabelandBefehlDisplay(e.getLabel(),e.getFirstPart(),e.commandLinetoString(true))}${e.getCommentary()==""?"":";"+e.getCommentary()}`;
                    if(this.symbolList.isConst(e.getSecondPart())){
                        // console.log(e.getSecondPart()+" found!")
                        inputLineHTML.innerHTML = inputLineHTML.innerHTML.replace(e.getSecondPart()+",",`<span class="purple">${e.getSecondPart()}</span>,`)
                    }
                    else if(this.symbolList.isConst(e.getThirdPart())){
                        // console.log(e.getThirdPart()+" found!")
                        inputLineHTML.innerHTML = inputLineHTML.innerHTML.replace(","+e.getThirdPart(),`,<span class="purple">${e.getThirdPart()}</span>&nbsp;`)
                    }
                }
            }
            
        }
    }

    public repushSpeicherabbildOf=(i:number,b:boolean)=>{

        if(i<this.inputLines.length){
            let e:InputLine=this.inputLines[i];
            let idString = `${(i+1)<10?"0"+(i+1):(i+1)}outputP`;
            let outputLineHTML:HTMLElement = getHtmlElement(idString);
            if(e.getType() == InputLineType.TRANSLATED){
                // console.log(b);
                if(!b){
                    getHtmlElement(`${(i+1)<10?"0"+(i+1):(i+1)}oAddress`).innerHTML=`${Manipulator.formatHextoDat16(e.getStartingAddr())+":"}`;
                }
                if(e.getTranslation().includes("????")){
                    // outputLineHTML.innerHTML=`${this.inputLineControl.getDisplayableSpeicherabbild(e,false)}&nbsp;${this.getLabelIfUnknown(i,b)}`;
                    outputLineHTML.innerHTML=`${Manipulator.formatSpeicherabbildandLabel(this.inputLineControl.getDisplayableSpeicherabbild(e,false),this.getLabelIfUnknown(i,b))}`;
                }
                else{
                    outputLineHTML.innerHTML=`${this.inputLineControl.getDisplayableSpeicherabbild(e,true)}&nbsp;`;
                }
            }
            else{
                outputLineHTML.innerHTML=`&nbsp;`;
            }  
        }
    }

    public rePushSymbols=()=>{
        this.symbols=this.symbolList.getSequence();
        let s:Constant|Label;
        let n,p;
        let idString:String="";
        symbolTableLines.innerHTML="";
        if(this.symbols.length!=0){
            for(let i=0;i<this.symbols.length;i++){
                idString=`symbol${i}`
                if(this.symbols[i]!=null){
                    s=this.symbols[i];
                    if(s instanceof Label){
                        n=s.getName();
                        p=s.getPosition()!;
                        symbolTableLines.innerHTML+=`<h4 id="${idString}"><span id="${i+"SymbolTID"}" class="gray extraP">L:</span> ${Manipulator.formatLabelDisplaytoSymbolTable(n)} = <span id="${symboladdress}${i}">${this.inputLineControl.fHD16(p)}</span> (${this.inputLineControl.getLittleEndianOf(p)})</h4>`;
                    }
                    if(s instanceof Constant){
                        n=s.getName();
                        p=s.getValue();
                        if(Manipulator.isDat_8(p)){
                            symbolTableLines.innerHTML+=`<h4 id="${idString}"><span id="${i+"SymbolTID"}" class="gray extraP">K:</span> <span class="purple">${Manipulator.formatLabelDisplaytoSymbolTable(n)}</span> = <span id="${symboladdress}${i}">&nbsp;&nbsp;${this.inputLineControl.fHD8(p)}</span></h4>`
                        }
                        else{
                            symbolTableLines.innerHTML+=`<h4 id="${idString}"><span id="${i+"SymbolTID"}" class="gray extraP">K:</span> <span class="purple">${Manipulator.formatLabelDisplaytoSymbolTable(n)}</span> = <span id="${symboladdress}${i}">${this.inputLineControl.fHD16(p)}</span></h4>`
                        }
                    }
                }
            }
            symbolTableLines.innerHTML+=`<h4 id="${targetSymbolTableLine}"> &nbsp;</h4>`;
        }
        updateScroll("symbolTableLines");
    }

    public rePushLastSymbolEmpty(){
        this.symbols=this.symbolList.getSequence();
        let s:Constant|Label;
        let n,p;
        let idString:String="";
        symbolTableLines.innerHTML="";
        
        if(this.symbols.length!=0){
            for(let i=0;i<this.symbols.length;i++){
                if(this.symbols[i]!=null){
                    s=this.symbols[i];
                    if(i==this.symbols.length-1){
                        if(s instanceof Label){
                            n=s.getName();
                            p=s.getPosition()!;
                            symbolTableLines.innerHTML+=`<h4><span id="${i+"SymbolTID"}" class="gray extraP">L:</span> ${Manipulator.formatLabelDisplaytoSymbolTable(n)} =&nbsp;&nbsp;<span id="${targetlabelValuePlaceholder}"> </span></h4>`;
                        }
                        break;
                    }
                    if(s instanceof Label){
                        n=s.getName();
                        p=s.getPosition()!;
                        symbolTableLines.innerHTML+=`<h4><span id="${i+"SymbolTID"}" class="gray extraP">L:</span> ${Manipulator.formatLabelDisplaytoSymbolTable(n)} = ${this.inputLineControl.fHD16(p)} (${this.inputLineControl.getLittleEndianOf(p)})</h4>`;
                    }
                    if(s instanceof Constant){
                        n=s.getName();
                        p=s.getValue();
                        if(Manipulator.isDat_8(p)){
                            symbolTableLines.innerHTML+=`<h4><span id="${i+"SymbolTID"}" class="gray extraP">K:</span> <span class="purple">${Manipulator.formatLabelDisplaytoSymbolTable(n)}</span> = &nbsp;&nbsp;${this.inputLineControl.fHD8(p)}</h4>`
                        }
                        else{
                            symbolTableLines.innerHTML+=`<h4><span id="${i+"SymbolTID"}" class="gray extraP">K:</span> <span class="purple">${Manipulator.formatLabelDisplaytoSymbolTable(n)}</span> = ${this.inputLineControl.fHD16(p)}</h4>`
                        }
                    }
                }
            }
            symbolTableLines.innerHTML+=`<h4> &nbsp;<span id="${targetSymbolTableLine}"></span> </h4>`;
        }
        updateScroll("symbolTableLines");
    }

    public repushTranslations=async()=>{
        OutputTextAreaElement.innerHTML="";
        windowOutputLines.innerHTML="";
        windowOutputAddresses.innerHTML="";
        let i;
        for(let j=0;j<=this.inputLines.length;j++){
            i=this.inputLines[j];
            if(i!=undefined){
                if(i.getType() != InputLineType.TRANSLATED){
                    continue;
                }
                if(i.getTranslation().includes("??")){
                    windowOutputLines.innerHTML+=`<p class="overflowElipsis">
                    ${Manipulator.formatSpeicherabbildandLabel(this.inputLineControl.getDisplayableSpeicherabbild(i,false),
                        this.getLabelIfUnknown(i.getId(),false))}</p>`
                }
                else{
                windowOutputLines.innerHTML+=`<p class="overflowElipsis">
                    ${this.inputLineControl.getDisplayableSpeicherabbild(i,true)}&nbsp;</p>`
                }
                windowOutputAddresses.innerHTML+=`<p class="gray">${i.getStartingAddr()}</p>`;
                OutputTextAreaElement.innerHTML+=":"+i.getTranslation()+"\n";
            }else{
                windowOutputAddresses.innerHTML+=`<p class="gray">&nbsp;</p>`;
                windowOutputLines.innerHTML+=`<p class="overflowElipsis">&nbsp;</p>`;
                OutputTextAreaElement.innerHTML+=":00000001FF";
            }
        }
    }

    public repushTranslationOf=async(i:number)=>{
        let e:InputLine;
        windowOutputAddresses.innerHTML="";
        windowOutputLines.innerHTML="";
        if(this.inputLines.length==this.inputstrings.length){
            e=this.inputLines[i];
            if(i==this.inputLines.length-1){
                if(e.getType()==InputLineType.TRANSLATED){
                    OutputTextAreaElement.innerHTML+=":"+e.getTranslation()+"\n";
                }

                OutputTextAreaElement.innerHTML+=":00000001FF";
            }
        }
        if(i<this.inputLines.length){
            e=this.inputLines[i];
            if(e.getType()==InputLineType.TRANSLATED){
                OutputTextAreaElement.innerHTML+=":"+e.getTranslation()+"\n";
            }
        }
    }
    
    public linkerAuflosung=async ()=>{
        this.repushTranslations();
        
        if(this.linkerAuflosungB){
            await this.displaySecondPhase();
            // this.toggleStop();

            for(let i=0;i<this.inputLines.length;i++){
                await this.checkInputLine(this.inputLines[i]);
                await this.clearMachinenbefehlandCurrentLine();
            }
        }
        removeClassOfAll("currentlyTranslated");
    }

    public displaySecondPhase=async()=>{
        let sleeptime = 400;
        let newElem:HTMLDivElement;
        let lineBuffer:string[]=[];
        let blockAnimation:boolean=this.checkForNoAniStep();
        
        newElem = document.createElement("div");
        newElem.id = "linkerTitelDiv"
        newElem.classList.add("noMP");
        if(!this.checkForSkip()){
            newElem.classList.add("hiddenDescriptionDiv");
        }
        descriptionLines.appendChild(newElem);
        for(let i =0;i<7;i++){
            if(i<2 || i>4){
                lineBuffer.push(`<p>&nbsp;</p>`);
                if(blockAnimation){
                    await sleepUntilNextStep();
                    newElem.innerHTML += `<p>&nbsp;</p>`;
                    updateScroll(descriptionLines.id);
                }
            }
            if(i==2 || i==4){
                lineBuffer.push(`<p>************************</p>`);
                if(blockAnimation){
                    await sleepUntilNextStep();
                    newElem.innerHTML += `<p>************************</p>`;
                    updateScroll(descriptionLines.id);
                }
            }
            if(i==3){
                lineBuffer.push(`<p>2.Phase ... Labelauflösung</p>`);
                if(blockAnimation){
                    await sleepUntilNextStep();
                    newElem.innerHTML +=`<p>2.Phase ... Labelauflösung</p>`;
                    updateScroll(descriptionLines.id);
                }
            }
        }
        if(!blockAnimation){
            lineBuffer.forEach(e=>{
                newElem.innerHTML+=e;
            })
        }
        
    }

    public checkInputLine=async(e:InputLine)=>{
        let s:string="";
        let n:string="";
        let k:Label|undefined;

        if(e.getType()!=InputLineType.TRANSLATED){
            return;
        }
        let newElem:HTMLDivElement;
        let lineBuffer:string[]=[];
        let blockAnimation:boolean=this.checkForNoAniStep();
        
        newElem = document.createElement("div");
        newElem.id=`${e.getId()}LinkerDiv`;
        newElem.classList.add("noMP");
        if(!this.checkForSkip()){
            newElem.classList.add("hiddenDescriptionDiv");
        }
        descriptionLines.appendChild(newElem);
        if(e.getTranslation().includes("????") || e.hasOffsetLabel()){
            selectTranslatingLine((e.getId()+1)<10?"0"+(e.getId()+1):(e.getId()+1)+"oAddress")
            k=this.symbolList.getLabels().find(i=>{
                if(e.hasOffsetLabel()){
                    if(i.getName().toLowerCase()==e.getLabelOfOffset().toLowerCase()){
                        return i;
                    }
                }
                if(i.getName().toLowerCase()==e.getSecondPart().toLowerCase() || i.getName().toLowerCase()== e.getThirdPart().toLowerCase()){
                    return i;
                }
            })!;
            // console.log(this.getLinkerAufloesungLine(e.getId()));
            if(aniControl.singleStepFlag) await aniControl.setPaused();
            if(blockAnimation) await checkIfPaused();
            await updateScrollOfIn_Out("OutputText",`${(e.getId()+1)<10?"0"+(e.getId()+1):(e.getId()+1)}outputP`);
            if(blockAnimation){
                await this.anim.pushAufzulosendestoCurrentLine(e.getId(),this.getLinkerAufloesungLine(e.getId(),false));
            }
            currentLineLine.innerHTML=`${e.getStartingAddr()}: ${this.inputLineControl.getDisplayableSpeicherabbild(e,false)} <span>${this.getLabelIfUnknown(e.getId(),false)}</span>`
            addresszahler.innerHTML= `${e.getStartingAddr()}`;
            machinenbefehl.innerHTML= `${this.inputLineControl.getDisplayableSpeicherabbild(e,false)}`;
            if(blockAnimation){
                await sleepUntilNextStep();
            }
            //  id="${e.getId()}LD+${}
            lineBuffer.push(`<p>Suche Label '<span id="${searchEntryLabel}${e.getId()}" class="labelBlue">${k.getName()}</span>' in SymbolTabelle</p>`)
            if(blockAnimation){
                await sleepUntilNextStep();
                newElem.innerHTML +=`<p>Suche Label '<span id="${searchEntryLabel}${e.getId()}" class="labelBlue">${k.getName()}</span>' in SymbolTabelle</p>`;
                updateScroll(descriptionLines.id);
            }
            currentLineLine.innerHTML=`${e.getStartingAddr()}: ${this.inputLineControl.getDisplayableSpeicherabbild(e,false)} <span class="crInvert">${this.getLabelIfUnknown(e.getId(),false)}</span>`

            if(blockAnimation){
                await sleepUntilNextStep();
            }
            if(k.getPosition()=="????"){
                if(blockAnimation){
                    await this.anim.searchEntryInSymboltablephaseOne(`${searchEntryLabel}${e.getId()}`,k.getName(),this.symbols.indexOf(k));
                }
                currentLineLine.innerHTML=`${e.getStartingAddr()}: ${this.inputLineControl.getDisplayableSpeicherabbild(e,false)} <span class="crInvert bkError">${this.getLabelIfUnknown(e.getId(),false)}</span>`
                lineBuffer.push(`<p>${StringConstructor.errLabelNotRes(k.getName())}</p>`)
                if(blockAnimation){
                    await sleepUntilNextStep();
                    newElem.innerHTML +=`<p>${StringConstructor.errLabelNotRes(k.getName())}</p>`;
                    updateScroll(descriptionLines.id);
                }
                if(!blockAnimation){
                    lineBuffer.forEach(e=>{
                        newElem.innerHTML+=e;
                    })
                }
                await sleepFor(10);
                aniControl.setStop();
                throw Error('Stop pressed');
            }
            else{
                s=this.inputLineControl.getDisplayableSpeicherabbild(e,false);
                this.inputLineControl.retranslate(e);
                n=this.inputLineControl.getDisplayableSpeicherabbild(e,true);
                /* if(blockAnimation){
                    await this.anim.exchangeLabelWithSymbolTable("Label '"+k.getName()+"'?","Label '"+k.getName()+"' = "+Manipulator.hexToDec(k.getPosition()!)+" ("+k.getPosition()!+")",this.symbols.indexOf(k));
                } */
                if(blockAnimation){
                    await this.anim.searchEntryInSymboltablephaseOne(`${searchEntryLabel}${e.getId()}`,k.getName(),this.symbols.indexOf(k));
                }
                lineBuffer.push(`<p class="eingeruckt">Label '<span class="labelBlue">${k.getName()}</span>' in Symboltabelle gefunden &nbsp;&nbsp;&nbsp; <span id="${p2LabelValuePlaceholder}"><span></p>`)
                if(blockAnimation){
                    newElem.innerHTML +=`<p class="eingeruckt">Label '<span class="labelBlue">${k.getName()}</span>' in Symboltabelle gefunden &nbsp;&nbsp;&nbsp; <span id="${p2LabelValuePlaceholder}"><span></p>`;
                    updateScroll(descriptionLines.id);
                    await sleepUntilNextStep();
                }
                addClassTo(this.symbols.indexOf(k)+"SymbolTID","currentlyTranslated");
                if(blockAnimation){
                    await this.anim.searchEntryInSymboltablephaseTwo(this.symbols.indexOf(k),k.getPosition()!);
                }
                removeClassOf(this.symbols.indexOf(k)+"SymbolTID","currentlyTranslated")
                lineBuffer.pop();
                lineBuffer.push(`<p class="eingeruckt">Label '<span class="labelBlue">${k.getName()}</span>' in Symboltabelle gefunden, Wert: ${Manipulator.hexToDec(k.getPosition()!)+" ("+k.getPosition()!+")"}</p>`)
                if(blockAnimation){
                    newElem.innerHTML="";
                    lineBuffer.forEach(e=>{
                        newElem.innerHTML+=e;
                    })
                    updateScroll(descriptionLines.id);
                    await sleepUntilNextStep();
                }

                lineBuffer.push(`<p class="eingeruckt">Ersetzung im Speicherabbild: ${s}-->${n}</p>`)
                if(blockAnimation){
                    await sleepUntilNextStep();
                    newElem.innerHTML +=`<p class="eingeruckt">Ersetzung im Speicherabbild: ${s}-->${n}</p>`;
                    updateScroll(descriptionLines.id);
                }
                
                this.repushTranslations();
                machinenbefehl.innerHTML= `${n}`;
                if(blockAnimation){
                    await this.anim.moveDetailToSpeicherabbild(this.getLinkerAufloesungLine(e.getId(),true),e.getId());
                }
                this.repushSpeicherabbildOf(e.getId(),true);
                lineBuffer.push(`<p>&nbsp;</p>`)
                if(blockAnimation){
                    await sleepUntilNextStep();
                    newElem.innerHTML +=`<p>&nbsp;</p>`;
                    updateScroll(descriptionLines.id);
                }
                if(!blockAnimation){
                    lineBuffer.forEach(e=>{
                        newElem.innerHTML+=e;
                    })
                }
            }
            updateScroll(descriptionLines.id);
            if(blockAnimation){
                await sleepUntilNextStep();
            }
            if(this.checkForSkip()){ //bufferZeit für AnimationType3 mit speed==3
                await sleepFor(40);
            }
        }
        
    }

    public pushLines=async()=>{
        let input:InputLine;
        let iP:HTMLElement;
        // skipped=isSkipped;
        if(this.inputstrings.length>0){
            for(let i=0;i<this.inputstrings.length;i++){
                this.translateInputStringOfId(i);
                translatingInfo.innerHTML=`${i+1}/${this.inputstrings.length}`;
                if(this.inputLines.length>i){
                    input = this.inputLines[i];
                    iP= getHtmlElement(`${(i+1)<10?"0"+(i+1):(i+1)}inputP`);
                    await updateScrollOfIn_Out("InputText",`${(i+1)<10?"0"+(i+1):(i+1)}inputP`);
                    selectTranslatingLine(`${(i+1)<10?"0"+(i+1):(i+1)}inputLineId`);

                    if(input.getType()==InputLineType.EMPTY){
                        if(this.checkForNoAniStep())await checkIfPaused();
                        continue;
                    }
                    else{
                        if(aniControl.start && aniControl.speed<3 && aniControl.animationType!=AnimationType.Typ3) await sleepFor(1200-(aniControl.speed)*200);
                        if(this.checkForNoAniStep()){
                            await this.anim.animationInputLineToCurrentLine(i,this.inputstrings[i].split(";")[0]);
                        }
                        this.nextParseID=0;
                        currentLineLine.innerHTML=`${input.getCommandLineToCurrentLine()}`;
                        for(let i = 0;i<this.potentialConsts.length;i++){
                            let s = this.potentialConsts[i]
                            if(currentLineLine.innerHTML.includes(s)){
                                var regex1 = new RegExp('(>)'+s+'(<)');
                                var regex2 = new RegExp('(\\s|>|,)'+s+'(<|,|\\s|\\b)');
                                let match:RegExpMatchArray|null;
                                // console.log("regex1:")
                                match = currentLineLine.innerHTML.match(regex1);
                                // console.log(match);
                                if(match!=null){
                                    currentLineLine.innerHTML = currentLineLine.innerHTML.replace(match[1]+s+match[2],match[1]+`<span class="purple">${s}</span>`+match[2]);
                                    break;
                                }
                                // console.log("regex2:")
                               
                                match=currentLineLine.innerHTML.match(regex2);
                                if(match!=null){
                                    currentLineLine.innerHTML = currentLineLine.innerHTML.replace(match[1]+s+match[2],match[1]+`<span class="purple">${s}</span>`+match[2]);
                                    break;
                                }
                                // console.log(match);
                                break;
                            }
                        }
                        await this.pushDescriptionLinesOf(i);
                    }
                    await this.repushTranslationOf(i);
                    
                }
                if(aniControl.singleStepFlag) await this.pause();
                await checkIfPaused();
                if(!this.checkForSkip()){
                    await sleepFor(1);
                }
            }
            descriptionLines.innerHTML += `<p style=" white-space: nowrap; overflow: hidden;"> -------------------------------------------------------- </p>`;
            removeClassOfAll("currentlyTranslated");

            this.linkerAuflosungB=this.aufzulosendeLabel();
            await this.linkerAuflosung();
            await updateScroll(descriptionLines.id);
            // aniControl.setEnd();
        }
    }

    public pushDescriptionLinesOf=async(i:number)=>{
        let e:string;
        let ss:string[];
        let l:InputLine;
        let newElem:HTMLDivElement;
        let lineBuffer:string[]=[];
        let blockAnimation:boolean=this.checkForNoAniStep();
        if(this.inputLines.length<=i){
            throw new Error("Expected was an ID of an Inputline smaller than "+this.inputLines.length+" but got "+i);
        }
        newElem = document.createElement("div");
        newElem.id=`${(i+1)<10?"0"+(i+1):(i+1)}DescriptionDiv`;
        newElem.classList.add("noMP");
        if(!this.checkForSkip()){
            newElem.classList.add("hiddenDescriptionDiv");
        }
        descriptionLines.appendChild(newElem);
        l=this.inputLines[i];
        ss=l.getDescriptionLine();
        lineBuffer.push(`<p style=" white-space: nowrap; overflow: hidden;"> ----<span class="bold"><${(i+1)<10?"0"+(i+1):(i+1)}></span>------------------------------------------------ </p>`);
        // newElem.innerHTML += `<p style=" white-space: nowrap; overflow: hidden;"> ----<span class="bold"><${(i+1)<10?"0"+(i+1):(i+1)}></span>------------------------------------------------ </p>`;
        if(blockAnimation){
            newElem.innerHTML += `<p style=" white-space: nowrap; overflow: hidden;"> ----<span class="bold"><${(i+1)<10?"0"+(i+1):(i+1)}></span>------------------------------------------------ </p>`;
        }
        
        for(let j=0;j<ss.length;j++){
            e=ss[j]
            if(blockAnimation){
                await sleepUntilNextStep();
            }
            if(e.includes("parse")){
                await this.nextInverted(l.getAllV());
            }
            if(e.includes('error')){
                console.log("error has been found");
                await this.nextInverted(l.getAllV());
                aniControl.setStop();
                lineBuffer.push(`<p>${e}</p>`);
                if(blockAnimation){
                    newElem.innerHTML += `<p>${e}</p>`;
                }
                else{
                    lineBuffer.forEach(e=>{
                        newElem.innerHTML +=e;
                    });
                }
                addClassTo("crError","bkError");
                updateScroll(descriptionLines.id);
                throw Error('Stop pressed');
            }else{
                lineBuffer.push(`<p>${e}</p>`);

                if(blockAnimation){

                    newElem.innerHTML += `<p>${e}</p>`;
                }
                updateScroll(descriptionLines.id);
            }
            if(e.includes("gefunden: Doppelpunkt")){
                
                if(blockAnimation){
                    await sleepUntilNextStep();
                    await this.anim.moveLabeltoSymboltableALTMoveable(l.getLabel());
                    await this.rePushLastSymbolEmpty();
                    await sleepUntilNextStep();
                    await this.anim.moveLabeltoSymboltableALTMoveableHelper(this.symbolList.getPositionOfSpecificLabel(l.getLabel())!);
                }
                
                this.rePushSymbols(); 
            }
            if(j-1>0){
                if(ss[j-1].includes("gesamter")){
                    if(l.getFirstPart().toUpperCase()=="ORG"){
                        // this.pushTranslationOf(i);
                        this.repushSpeicherabbildOf(i,false);
                    }
                    else if(l.getEndAddr()!=""){
                        // machinenbefehl.innerHTML= `${this.inputLineControl.getDisplayableSpeicherabbild(l,false)}`;
                        machinenbefehl.innerHTML= `${Manipulator.formatSpeicherabbildandLabel(this.inputLineControl.getDisplayableSpeicherabbild(l,false),this.getLabelIfUnknown(l.getId(),false))}`;
                        //console.log(this.inputLineControl.isFreeAddr(l.getStartingAddr(),l.getEndAddr()));
                        if(!this.inputLineControl.isFreeAddr(l.getStartingAddr(),l.getEndAddr())){
                            lineBuffer.push(`<p>${StringConstructor.warAddrOverwriten()}</p>`);

                            if(blockAnimation){
                                newElem.innerHTML += `<p>${StringConstructor.warAddrOverwriten()}</p>`;
                            }
                        }
                        if(blockAnimation){
                            await sleepUntilNextStep();
                            await this.anim.moveDetailToSpeicherabbild(this.getLinkerAufloesungLine(i,false),i);
                        }
                        // this.pushTranslationOf(i);
                        this.repushSpeicherabbildOf(i,false);
                    }
                }
            }
        }
        if(!blockAnimation){
            lineBuffer.forEach(e=>{
                newElem.innerHTML +=e;
            });
        }
        if(this.symbolList.isConst(l.getFirstPart())){
            if(blockAnimation){
                await sleepUntilNextStep();
                await this.anim.moveLabeltoSymboltableALTMoveable(this.symbolList.getSpecificConstantByName(l.getFirstPart())!.toStringtoMovable());
            }
            this.rePushSymbols();
            this.repushSpeicherabbildOf(i,false);
        }
        else if(l.getType()==InputLineType.PSEUDOTRANSLATED){
            this.repushSpeicherabbildOf(i,false);
        }
        else{
            if(blockAnimation){
                await sleepUntilNextStep();
                if(l.getFirstPart().toUpperCase()=="ORG"){
                    // console.log("yes");
                    let m = l.getSecondPart();
                    if(this.symbolList.isConst(l.getSecondPart())){
                        m = this.symbolList.getSpecificConstantByName(l.getSecondPart())!.getValue();
                    }
                    await this.anim.displayAddresserhoehung(l.getId(),m,"=",l.getEndAddr());
                }
                else await this.anim.displayAddresserhoehung(l.getId(),String(l.getLength()),"+",l.getEndAddr());
                
            }
            addresszahler.innerHTML= `${Manipulator.formatHextoDat16(l.getEndAddr())}`;
        }
        if(this.checkForSkip()){ //bufferZeit für AnimationType3 mit speed==3
            await sleepFor(30);
        }

        if(blockAnimation){
            await sleepUntilNextStep();
        }
        if(newElem.innerHTML.includes("Achtung")){
            setWarningSign(true);
        }
        removeClassOfAll("crInvert");

        l.formatInputToDisplay();
        this.refreshInputListItem(i);
        await this.clearMachinenbefehlandCurrentLine();

        updateScroll(descriptionLines.id);
        getHtmlElement(`${(i+1)<10?"0"+(i+1):(i+1)}inputP`).onclick=((e:MouseEvent)=>{
            if(!aniControl.play){
                updateScrollOfDescriptionLines(`${(i+1)<10?"0"+(i+1):(i+1)}DescriptionDiv`,descriptionLines.id);
            }
        })
    }

    public getLabelIfUnknown(i:number,b:boolean):string{
        let e:InputLine;

        let addr:string,spa:string,l:string="";
        if(i<this.inputLines.length){
            e = this.inputLines[i];
            spa = this.inputLineControl.getDisplayableSpeicherabbild(e,b);
            if(spa.includes("??")){
                if(e.hasOffsetLabel()){
                    l = "("+e.getLabelOfOffset()+")";
                }
                else if(this.symbolList.isLabel(e.getSecondPart())){
                    l = "("+e.getSecondPart()+")";
                }
                else if(this.symbolList.isLabel(e.getThirdPart())){
                    l = "("+e.getThirdPart()+")";
                }
            }
        }
        return l;
    
    }

    public getLinkerAufloesungLine(i:number,b:boolean):string{
        let e:InputLine;
        let addr:string,spa:string,l:string="";
        if(i<this.inputLines.length){
            e = this.inputLines[i];
            addr = e.getStartingAddr();
            spa = this.inputLineControl.getDisplayableSpeicherabbild(e,b);
            if(spa.includes("??")){
                if(e.hasOffsetLabel()){
                    l = "("+e.getLabelOfOffset()+")";
                }
                else if(this.symbolList.isLabel(e.getSecondPart())){
                    l = "("+e.getSecondPart()+")";
                }
                else if(this.symbolList.isLabel(e.getThirdPart())){
                    l = "("+e.getThirdPart()+")";
                }
            }
            return addr+": "+spa+" "+l;
        }
        return "";
    }

    public aufzulosendeLabel=():boolean=>{
        let b=false;
        this.inputLines.forEach(e=>{
            if(e.getTranslation().includes("????")){
                b=true;
            }
            if(e.hasOffsetLabel()){
                b=true;
            }
        });
        return b;
    }

    public translateInputStringOfId=(n:number):boolean=>{
        if(n<this.inputstrings.length){
            this.inputLineControl.addInputLine(this.inputstrings[n]);
            this.refreshInputLines();
            return true;
        }
        return false;
    }

    public nextInverted=async (n:number[])=>{
        if(this.checkForNoAniStep()){
            await sleepFor(30);
        }
        for(this.nextParseID;this.nextParseID<n.length;this.nextParseID++){
            if(n[this.nextParseID]==1){
                this.switchInvertedTo(this.nextParseID)
                this.nextParseID+=1;
                break;
            }
        }
    }

    public switchInvertedTo=(n:number)=>{
       switch(n){
            case 0:
                removeClassOfAll("crInvert");
                addClassTo("crLabel","crInvert");
                break;
            case 1:
                removeClassOfAll("crInvert");
                addClassTo("crFirst","crInvert");
                break;

            case 2:
                removeClassOfAll("crInvert");
                addClassTo("crSecond","crInvert");
                break;
            case 3:
                removeClassOfAll("crInvert");
                addClassTo("crThird","crInvert");
                break;
            case 4:
                removeClassOfAll("crInvert");
                addClassTo("crError","crInvert");
                break;
            case 5:
                break;
            default:
                break;
        }
    }

    public checkForSkip():boolean{
        // if(skipped)return false;
        
        return !(aniControl.speed==4 && aniControl.isAni3())
    }

    public checkForNoAniStep():boolean{
        // if(skipped)return false;
        
        return !(aniControl.speed>=3 && aniControl.isAni3())
    }
    
    public clearMachinenbefehlandCurrentLine(){
        machinenbefehl.innerHTML="&nbsp;";
        currentLineLine.innerHTML="&nbsp;";
    }

    public startPlaying=async()=>{
        if(aniControl.stop || aniControl.reset || aniControl.end) throw new Error("Reset was pressed recently!");
        if(this.inputstrings.length>0){
            let date = Date.now();
            await this.pushLines();
            await this.clearMachinenbefehlandCurrentLine();
            aniControl.setEnd();
            console.log(Date.now()-date);
        }
        else{
            console.log("no Input");
        }
    }

    public toggleStop=async()=>{
        try{
            if(this.inputstrings.length>0){
            
                if(aniControl.end || aniControl.stop){
                    throw new Error("Stop has been pressed or animation Finished!");
                    return;
                }
                if(aniControl.reset){
                    throw new Error("Waiting until reset is finished!");
                    return;
                }
                if(!aniControl.start){
                    await aniControl.setStart();
                    await this.startPlaying();
                }
                else{
                    if(aniControl.play){
                        await aniControl.setPaused();
                    }
                    else{
                        await aniControl.setPlaying();
                    }
                }
            }else{
                console.log("no Input");
            }
        }catch(e){
            console.log(e);
        }
        
    }

    public pause=()=>{
        aniControl.setPaused();
    }

    public reset=async()=>{
        if(!aniControl.reset){
            aniControl.setReset();
            await this.partialReset();
            await this.refreshInputListItems();
        }
    }

    public displayInputLines=async()=>{        
        await this.partialReset();
        await this.refreshInputListItems();
    }

    setInputStrings=(s:string[])=>{
        this.inputstrings=s;
    }

    refreshInputStrings=(s:string[])=>{
        this.inputstrings=s;
    }

    public refreshInputLines=()=>{
        this.inputLines=this.inputLineControl.getInputLines();
    }

    public openOutputWindow =()=>{
        try{
            aniControl.setPaused();
            let b =window.getComputedStyle(outputwindowContainer);
            if(b.getPropertyValue('visibility')=="hidden"){
                outputwindowContainer.style.visibility="visible";
            }
            else{
                outputwindowContainer.style.visibility="hidden";
            }
        }catch(e){
            console.log(e);
        }
    }

    public createListeners=()=>{
        try{
            this.iWindow.createEventListeners();
            createClickListener('CloseOutputWindow',this.openOutputWindow);
            createClickListener('TranslateWindow',this.openOutputWindow);
            createClickListener('play',this.toggleStop);
            createClickListener('reset',this.reset);
            createClickListener('credits',this.inputLineControl.displayAddressTable);
            aniControl.createEventListeners();
        }catch(e){
            console.log(e);
        }
    }
}