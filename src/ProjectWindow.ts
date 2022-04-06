

import { Manipulator } from "./Backend/Manipulator";
import { SymbolList } from "./Backend/SymbolList";
import { DataType,InputLineType } from "./Backend/Enums";
import { Label } from "./Backend/Label";
import { Constant } from "./Backend/Constant";
import { InputLineControl } from "./Backend/InputLineControl";
import { InputLine } from "./Backend/InputLine";
import { InputWindow } from "./InputWindow";
import { getHtmlElement, createClickListener, updateScroll, updateScrollOfIn_Out } from "./Tools";
import { aniControl, AnimationsTyp, checkIfPaused, playButton, resetButton, sleepFor, sleepStaticAnimation, sleepUntilNextStep } from "./AnimationUtil";
import { Animator } from "./Animator";



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
let skipped:boolean=false;

export const removeClassOfAll=(s:string)=>{
    let elements = Array.from(document.querySelectorAll("."+s+""));
    for(let elem of elements){
        elem.classList.remove(s);
    }
}
export const addClassTo=(id:string,cls:string)=>{
    let elem = getHtmlElement(id);
    if(elem !=null || elem != undefined){
        elem.classList.add(cls);
    }
}
export const getIDOfSelected=(s:string):string=>{
    return s[0]+s[1];
}

const updateScrollOfDescriptionLines=(id:string,targetID:string)=>{
    var elem = getHtmlElement(id);
    var targetElem = getHtmlElement(targetID);
    targetElem.scrollTop=elem.offsetTop-targetElem.offsetTop;
}

export class ProjectWindow{
    private inputLineControl:InputLineControl=InputLineControl.getInstance();
    private symbolList=SymbolList.getInstance();
    private iWindow:InputWindow = new InputWindow(this);
    private anim:Animator;
    private linkerAuflosungB:boolean=false;
    private nextParseID:number=0;
    private inputLines:InputLine[]=[];
    private inputstrings:string[] =[];
    private symbols:Array<Label|Constant>=[]
    constructor(){
        this.anim = new Animator();
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
    
    public partialReset =async () =>{
        this.inputLines=[];
        await this.clearMachinenbefehlandCurrentLine();
        symbolTableLines.innerHTML=`<h4 id="${targetSymbolTableLine}"> &nbsp; </h4>`;
        descriptionLines.innerHTML="";
        addresszahler.innerHTML="0000h";
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
    }

    public nextInverted=async (n:number[])=>{
        if(!skipped){
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

    public refreshInputListItems=()=>{
        InputID.innerHTML="";
        InputLines.innerHTML="";
        OutputAddresses.innerHTML="";
        OutputLines.innerHTML="";
        let ss:string[]=[];
        let e:InputLine;
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
                InputID.innerHTML+=`<p id="${(i+1)<10?"0"+(i+1):(i+1)}inputLineId" class="gray">${(i+1)<10?"0"+(i+1):(i+1)}:</p>`;
                InputLines.innerHTML+=`<p id="${(i+1)<10?"0"+(i+1):(i+1)}inputP"  class="overflowElipsis">${this.inputstrings[i]}&nbsp;</p>`;
                OutputAddresses.innerHTML+=`<p id="${(i+1)<10?"0"+(i+1):(i+1)}oAddress" class="gray">&nbsp;</p>`;
                OutputLines.innerHTML+=`<p id="${(i+1)<10?"0"+(i+1):(i+1)}outputP" class="overflowElipsis">&nbsp;</p>`;
            }
        }
        console.log("items refreshed");
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
                }
                else inputLineHTML.innerHTML=`${Manipulator.formatLabelandBefehlDisplay(e.getLabel(),e.getFirstPart(),e.commandLinetoString(true))}${e.getCommentary()==""?"":";"+e.getCommentary()}`;
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

    private rePushSymbols=()=>{
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
                        symbolTableLines.innerHTML+=`<h4 id="${idString}"><span class="gray">L:</span> ${Manipulator.formatLabelDisplaytoSymbolTable(n)} = ${this.inputLineControl.fHD16(p)} (${this.inputLineControl.getLittleEndianOf(p)})</h4>`;
                    }
                    if(s instanceof Constant){
                        n=s.getName();
                        p=s.getValue();
                        if(Manipulator.isDat_8(p)){
                            symbolTableLines.innerHTML+=`<h4 id="${idString}"><span class="gray">K:</span> ${Manipulator.formatLabelDisplaytoSymbolTable(n)} = &nbsp;&nbsp;${this.inputLineControl.fHD8(p)}</h4>`
                        }
                        else{
                            symbolTableLines.innerHTML+=`<h4 id="${idString}"><span class="gray">K:</span> ${Manipulator.formatLabelDisplaytoSymbolTable(n)} = ${this.inputLineControl.fHD16(p)}</h4>`
                        }
                    }
                }
            }
            symbolTableLines.innerHTML+=`<h4 id="${targetSymbolTableLine}"> &nbsp;</h4>`;
        }
        updateScroll("symbolTableLines");
    }

    private rePushLastSymbolEmpty(){
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
                            symbolTableLines.innerHTML+=`<h4><span class="gray">L:</span> ${Manipulator.formatLabelDisplaytoSymbolTable(n)} =&nbsp;&nbsp;<span id="${targetlabelValuePlaceholder}"> </span></h4>`;
                        }
                        break;
                    }
                    if(s instanceof Label){
                        n=s.getName();
                        p=s.getPosition()!;
                        symbolTableLines.innerHTML+=`<h4><span class="gray">L:</span> ${Manipulator.formatLabelDisplaytoSymbolTable(n)} = ${this.inputLineControl.fHD16(p)} (${this.inputLineControl.getLittleEndianOf(p)})</h4>`;
                    }
                    if(s instanceof Constant){
                        n=s.getName();
                        p=s.getValue();
                        if(Manipulator.isDat_8(p)){
                            symbolTableLines.innerHTML+=`<h4><span class="gray">K:</span> ${Manipulator.formatLabelDisplaytoSymbolTable(n)} = &nbsp;&nbsp;${this.inputLineControl.fHD8(p)}</h4>`
                        }
                        else{
                            symbolTableLines.innerHTML+=`<h4><span class="gray">K:</span> ${Manipulator.formatLabelDisplaytoSymbolTable(n)} = ${this.inputLineControl.fHD16(p)}</h4>`
                        }
                    }
                }
            }
            symbolTableLines.innerHTML+=`<h4> &nbsp;<span id="${targetSymbolTableLine}"></span> </h4>`;
        }
        updateScroll("symbolTableLines");
    }
    private getLabelIfUnknown(i:number,b:boolean):string{
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
    
    public checkInputLine=async(e:InputLine)=>{
        let s:string="";
        let n:string="";
        let k:Label|undefined;
        if(e.getType()!=InputLineType.TRANSLATED){
            return;
        }
        if(e.getTranslation().includes("????") || e.hasOffsetLabel()){

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
            if(!skipped) await checkIfPaused();
            await updateScrollOfIn_Out("OutputText",`${(e.getId()+1)<10?"0"+(e.getId()+1):(e.getId()+1)}outputP`);
            if(!skipped){

                await this.anim.pushAufzulosendestoCurrentLine(e.getId(),this.getLinkerAufloesungLine(e.getId(),false));
            }
            currentLineLine.innerHTML=`${e.getStartingAddr()}: ${this.inputLineControl.getDisplayableSpeicherabbild(e,false)} <span>${this.getLabelIfUnknown(e.getId(),false)}</span>`
            addresszahler.innerHTML= `${e.getStartingAddr()}`;
            machinenbefehl.innerHTML= `${this.inputLineControl.getDisplayableSpeicherabbild(e,false)}`;
            if(!skipped){
                await sleepUntilNextStep();
            }
            descriptionLines.innerHTML += `<p>Suche Label '<span class="labelBlue">${k.getName()}</span>' in SymbolTabelle</p>`;
            currentLineLine.innerHTML=`${e.getStartingAddr()}: ${this.inputLineControl.getDisplayableSpeicherabbild(e,false)} <span class="crInvert">${this.getLabelIfUnknown(e.getId(),false)}</span>`

            if(!skipped){
                updateScroll(descriptionLines.id);
                await sleepUntilNextStep();
            }
            if(k.getPosition()=="????"){
                if(!skipped){
                    await this.anim.exchangeLabelWithSymbolTable("Label '"+k.getName()+"'?","",this.symbols.indexOf(k));
                }
                currentLineLine.innerHTML=`${e.getStartingAddr()}: ${this.inputLineControl.getDisplayableSpeicherabbild(e,false)} <span class="crInvert bkError">${this.getLabelIfUnknown(e.getId(),false)}</span>`
                descriptionLines.innerHTML += `<p><span class="errorRed eingeruckt">Label '<span class="labelBlue">${k.getName()}</span>' konnte nicht aufgelöst werden!</span></p>`;
                updateScroll(descriptionLines.id);
                await sleepFor(10);
                aniControl.setStop();
                throw Error('Stop pressed');
            }
            else{
                s=this.inputLineControl.getDisplayableSpeicherabbild(e,false);
                this.inputLineControl.retranslate(e);
                n=this.inputLineControl.getDisplayableSpeicherabbild(e,true);
                if(!skipped){
                    await this.anim.exchangeLabelWithSymbolTable("Label '"+k.getName()+"'?","Label '"+k.getName()+"' = "+Manipulator.hexToDec(k.getPosition()!)+" ("+k.getPosition()!+")",this.symbols.indexOf(k));
                }

                descriptionLines.innerHTML += `<p class="eingeruckt">Label '<span class="labelBlue">${k.getName()}</span>' in Symboltabelle gefunden, Wert: ${Manipulator.hexToDec(k.getPosition()!)+" ("+k.getPosition()!+")"}</p>`;
                if(!skipped){
                    updateScroll(descriptionLines.id);
                    await sleepUntilNextStep();
                }
                
                descriptionLines.innerHTML += `<p class="eingeruckt">Ersetzung im Speicherabbild: ${s}-->${n}</p>`;
                if(!skipped){
                    updateScroll(descriptionLines.id);
                    await sleepUntilNextStep();
                }
                
                this.repushTranslations();
                machinenbefehl.innerHTML= `${n}`;
                if(!skipped){
                    await this.anim.moveDetailToSpeicherabbild(this.getLinkerAufloesungLine(e.getId(),true),e.getId());
                }
                this.repushSpeicherabbildOf(e.getId(),true);
                descriptionLines.innerHTML += `<p>&nbsp;&nbsp;&nbsp;</p>`;
                if(!skipped){
                    updateScroll(descriptionLines.id);
                }
            }
            updateScroll(descriptionLines.id);
            if(!skipped){
                await sleepUntilNextStep();
            }
        }
    }
    private displaySecondPhase=async()=>{
        let sleeptime = 400;
        if(!skipped) await sleepFor(1000);

        descriptionLines.innerHTML += `<p>&nbsp;&nbsp;&nbsp;</p>`;
        updateScroll(descriptionLines.id);

        if(!skipped) await sleepFor(sleeptime);
        descriptionLines.innerHTML += `<p>&nbsp;&nbsp;&nbsp;</p>`;
        updateScroll(descriptionLines.id);

        if(!skipped) await sleepFor(sleeptime);

        descriptionLines.innerHTML += `<p>************************</p>`;
        updateScroll(descriptionLines.id);

        if(!skipped) await sleepFor(sleeptime*2);

        descriptionLines.innerHTML += `<p>2.Phase LinkerAuflösung</p>`;
        updateScroll(descriptionLines.id);

        if(!skipped) await sleepFor(sleeptime*2);

        descriptionLines.innerHTML += `<p>************************</p>`;
        updateScroll(descriptionLines.id);

        if(!skipped) await sleepFor(sleeptime*2);

        descriptionLines.innerHTML += `<p>&nbsp;&nbsp;&nbsp;</p>`;
        updateScroll(descriptionLines.id);

        if(!skipped) await sleepFor(sleeptime);

        descriptionLines.innerHTML += `<p>&nbsp;&nbsp;&nbsp;</p>`;
        updateScroll(descriptionLines.id);

        if(!skipped) await sleepFor(sleeptime);
    }
    public linkerAuflosung=async ()=>{
        this.repushTranslations();
        if(this.linkerAuflosungB){
            await this.displaySecondPhase();
            for(let i=0;i<this.inputLines.length;i++){
                console.log(1);
                await this.checkInputLine(this.inputLines[i]);
                await this.clearMachinenbefehlandCurrentLine();
            }
        }
    }
    private clearMachinenbefehlandCurrentLine(){
        machinenbefehl.innerHTML="&nbsp;";
        currentLineLine.innerHTML="&nbsp;";
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
    
    private translateInputStringOfId=(n:number):boolean=>{
        if(n<this.inputstrings.length){
            this.inputLineControl.addInputLine(this.inputstrings[n]);
            this.refreshInputLines();
            return true;
        }
        return false;
    }

    private pushLines=async(isSkipped:boolean)=>{
        let input:InputLine;
        let iP:HTMLElement;
        skipped=isSkipped;
        if(this.inputstrings.length>0){
            for(let i=0;i<this.inputstrings.length;i++){
                this.translateInputStringOfId(i);
                
                if(this.inputLines.length>i){
                    input = this.inputLines[i];
                    if(!skipped) await this.clearMachinenbefehlandCurrentLine();
                    iP= getHtmlElement(`${(i+1)<10?"0"+(i+1):(i+1)}inputP`);
                    await updateScrollOfIn_Out("InputText",`${(i+1)<10?"0"+(i+1):(i+1)}inputP`);

                    if(input.getType()==InputLineType.EMPTY){
                        if(!skipped)await checkIfPaused();
                        continue;
                    }
                    else{
                        if(aniControl.start && aniControl.speed<3 && aniControl.animationType!=AnimationsTyp.Typ3) await sleepFor(1200-(aniControl.speed)*200);
                        if(!skipped){
                            await this.anim.animationInputLineToCurrentLine(i,this.inputstrings[i].split(";")[0]);
                        }
                        this.nextParseID=0;
                        currentLineLine.innerHTML=`${input.getCommandLineToCurrentLine()}`;
                        await this.pushDescriptionLinesOf(i);
                    }
                    await this.repushTranslationOf(i);
                    
                }
                if(aniControl.singleStepFlag) await this.pause();
                if(!skipped)await checkIfPaused();
            }
            
            descriptionLines.innerHTML += `<p style=" white-space: nowrap; overflow: hidden;"> -------------------------------------------------------- </p>`;

            this.linkerAuflosungB=this.aufzulosendeLabel();
            await this.linkerAuflosung();

            console.log("finished");
            await sleepFor(100);
            await updateScroll(descriptionLines.id);
            aniControl.setEnd();
        }
    }

    private pushDescriptionLinesOf=async(i:number)=>{
        let e:string;
        let ss:string[];
        let l:InputLine;
        let newElem:HTMLDivElement;
        newElem = document.createElement("div");
        newElem.id=`${(i+1)<10?"0"+(i+1):(i+1)}DescriptionDiv`;
        newElem.classList.add("noMP");
        descriptionLines.appendChild(newElem);
        if(this.inputLines.length>i){
            l=this.inputLines[i];
            ss=l.getDescriptionLine();
            newElem.innerHTML += `<p style=" white-space: nowrap; overflow: hidden;"> ----<span class="bold"><${(i+1)<10?"0"+(i+1):(i+1)}></span>------------------------------------------------ </p>`;
            for(let j=0;j<ss.length;j++){
                e=ss[j]
                if(!skipped){
                    await sleepUntilNextStep();
                }
                if(e.includes("parse")){
                    await this.nextInverted(l.getAllV());
                }
                if(e.includes('error')){
                    console.log("error has been found");
                    await this.nextInverted(l.getAllV());
                    aniControl.setStop();
                    
                    newElem.innerHTML += `<p>${e}</p>`;
                    addClassTo("crError","bkError");
                    updateScroll(descriptionLines.id);
                    throw Error('Stop pressed');
                }else{
                    
                    newElem.innerHTML += `<p>${e}</p>`;
                    updateScroll(descriptionLines.id);
                }
                if(e.includes("gefunden: Doppelpunkt")){
                    
                    if(!skipped){
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
                            machinenbefehl.innerHTML= `${this.inputLineControl.getDisplayableSpeicherabbild(l,false)}`;
                            
                            if(!skipped){
                                await sleepUntilNextStep();
                                await this.anim.moveDetailToSpeicherabbild(this.getLinkerAufloesungLine(i,false),i);
                            }
                            // this.pushTranslationOf(i);
                            this.repushSpeicherabbildOf(i,false);
                        }
                    }
                }
            }
            if(this.symbolList.isConst(l.getFirstPart())){
                if(!skipped){
                    await sleepUntilNextStep();
                    await this.anim.moveConstToSymbolTable(this.symbolList.getSpecificConstantByName(l.getFirstPart())!.toStringtoMovable());
                }
                this.rePushSymbols();
                this.repushSpeicherabbildOf(i,false);
            }
            else if(l.getType()==InputLineType.PSEUDOTRANSLATED){
                this.repushSpeicherabbildOf(i,false);
            }
            else{
                if(!skipped){
                    await sleepUntilNextStep();
                    await this.anim.displayAddresserhoehung(l.getLength(),l.getEndAddr());
                }
                addresszahler.innerHTML= `${l.getEndAddr()}`;
            }

            if(!skipped){
                await sleepUntilNextStep();
            }

            removeClassOfAll("crInvert");

            l.formatInputToDisplay();
            this.refreshInputListItem(i);
            updateScroll(descriptionLines.id);
            getHtmlElement(`${(i+1)<10?"0"+(i+1):(i+1)}inputP`).onclick=((e:MouseEvent)=>{
                if(!aniControl.play){
                    updateScrollOfDescriptionLines(`${(i+1)<10?"0"+(i+1):(i+1)}DescriptionDiv`,descriptionLines.id);
                }

            })
        }
    }

    private aufzulosendeLabel=():boolean=>{
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
    
    public toggleStop=async()=>{
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
    }

    public startPlaying=async()=>{
        if(aniControl.stop || aniControl.reset || aniControl.end) throw new Error("Reset was presser recently!");
        if(this.inputstrings.length>0){
            await this.pushLines(false);
            await this.clearMachinenbefehlandCurrentLine();
        }
        else{
            console.log("no Input");
        }
    }

    public skipToFinish=async()=>{
        if(this.inputstrings.length>0){
            await this.reset();
            try {
                await this.pushLines(true);
                await this.clearMachinenbefehlandCurrentLine();
            } catch (e) {
                console.log(e);
                skipped=false;
                return;
            }
            await aniControl.setEnd();
            skipped=false;
            
        }
        else{
            console.log("no Input");
        }
        // console.log(this.iWindow);
    }

    public pause=()=>{
        aniControl.setPaused();
    }

    public speed=()=>{
        aniControl.consoleFlags();
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

    public createListeners=()=>{
        try{
            this.iWindow.createEventListeners();
            // createClickListener('testButton',this.testCycling);
            createClickListener('CloseOutputWindow',this.openOutputWindow);
            createClickListener('TranslateWindow',this.openOutputWindow);
            createClickListener('play',this.toggleStop);
            // createClickListener('stop',this.pause);
            createClickListener('speed',sleepStaticAnimation);
            createClickListener('skip',this.skipToFinish);
            createClickListener('reset',this.reset);
            aniControl.createEventListeners();
            // createClickListener(InputID.id,setScrollbarOfDescriptionLine);
        }catch(e){
            console.log(e);
        }
    } 

}