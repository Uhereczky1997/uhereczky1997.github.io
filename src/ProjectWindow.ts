

import { Manipulator } from "./Backend/Manipulator";
import { SymbolList } from "./Backend/SymbolList";
import { DataType,InputLineType } from "./Backend/Enums";
import { Label } from "./Backend/Label";
import { Constant } from "./Backend/Constant";
import { InputLineControl } from "./Backend/InputLineControl";
import { InputLine } from "./Backend/InputLine";
import { InputWindow } from "./InputWindow";
import { getHtmlElement, createClickListener, updateScroll, updateScrollOfIn_Out } from "./Tools";
import { aniControl, AnimationsTyp, checkIfPaused, sleepFor, sleepUntilNextStep } from "./AnimationUtil";
import { Animator } from "./Animator";



export let descriptionLines:HTMLElement = getHtmlElement('descriptionLines');
export let symbolTableLines:HTMLElement = getHtmlElement('symbolTableLines');
export let currentLine:HTMLElement = getHtmlElement('currentLine');
export let outputText:HTMLElement = getHtmlElement('OutputText');
export let inputText:HTMLElement= getHtmlElement('InputText');
export let addresszahler:HTMLElement = getHtmlElement('Addresszahler');
export let machinenbefehl:HTMLElement = getHtmlElement('Machinenbefehl');
export let outputwindowContainer:HTMLElement = getHtmlElement('OutputWindowContainer');
export let OutputTextAreaElement:HTMLTextAreaElement =getHtmlElement('OutputTextArea')as HTMLTextAreaElement;
export let InputID:HTMLElement=getHtmlElement('InputID');
export let InputLines:HTMLElement=getHtmlElement('InputLines');
export let OutputAddresses:HTMLElement=getHtmlElement('OutputAddresses');
export let OutputLines:HTMLElement=getHtmlElement('OutputLines');
export let currentLineLine =getHtmlElement("currentLineLine");

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
        // currentLine.innerHTML="";
        await this.clearMachinenbefehlandCurrentLine();
        symbolTableLines.innerHTML=`<h4> &nbsp; </h4>`;
        descriptionLines.innerHTML="";
        addresszahler.innerHTML="0000h";
        this.nextParseID=0;
        // machinenbefehl.innerHTML="";
        OutputAddresses.innerHTML="";
        OutputLines.innerHTML="";
        OutputTextAreaElement.innerHTML="";
        await this.inputLineControl.reset();
        await this.anim.reset();
        await aniControl.resetFlags();
        getHtmlElement("InputText").scrollTop=0;
    }

    public nextInverted=async (n:number[])=>{
        if(aniControl.start){
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
        // removeClassOfAll("crInvert");
        // console.log(n);
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
                //addClassTo("crRest","crInvert");
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
        //inputTextDiv.innerHTML="";
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
                OutputAddresses.innerHTML+=`<p id="${(i+1)<10?"0"+(i+1):(i+1)}oAddress">&nbsp;</p>`;
                OutputLines.innerHTML+=`<p id="${(i+1)<10?"0"+(i+1):(i+1)}outputP" class="overflowElipsis">&nbsp;</p>`;
            }
            else{
                InputID.innerHTML+=`<p id="${(i+1)<10?"0"+(i+1):(i+1)}inputLineId" class="gray">${(i+1)<10?"0"+(i+1):(i+1)}:</p>`;
                InputLines.innerHTML+=`<p id="${(i+1)<10?"0"+(i+1):(i+1)}inputP"  class="overflowElipsis">${this.inputstrings[i]}&nbsp;</p>`;
                OutputAddresses.innerHTML+=`<p id="${(i+1)<10?"0"+(i+1):(i+1)}oAddress">&nbsp;</p>`;
                OutputLines.innerHTML+=`<p id="${(i+1)<10?"0"+(i+1):(i+1)}outputP" class="overflowElipsis">&nbsp;</p>`;
            }
        }
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
                console.log(b);
                if(!b){
                    getHtmlElement(`${(i+1)<10?"0"+(i+1):(i+1)}oAddress`).innerHTML=`<span class="gray">${Manipulator.formatHextoDat16(e.getStartingAddr())+":"}</span>`;
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
        symbolTableLines.innerHTML="";
        if(this.symbols.length!=0){
            for(let i=0;i<this.symbols.length;i++){

                if(this.symbols[i]!=null){
                    s=this.symbols[i];
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
            symbolTableLines.innerHTML+=`<h4> &nbsp; </h4>`;
        }
        updateScroll("symbolTableLines");
    }

    private rePushLastSymbolEmpty(){
        this.symbols=this.symbolList.getSequence();
        let s:Constant|Label;
        let n,p;
        symbolTableLines.innerHTML="";
        
        if(this.symbols.length!=0){
            for(let i=0;i<this.symbols.length;i++){
                if(this.symbols[i]!=null){
                    if(i==this.symbols.length-1){
                        s=this.symbols[this.symbols.length-1];
                        if(s instanceof Label){
                            n=s.getName();
                            p=s.getPosition()!;
                            symbolTableLines.innerHTML+=`<h4><span class="gray">L:</span> ${Manipulator.formatLabelDisplaytoSymbolTable(n)} =&nbsp;&nbsp;<span id="labelValuePlaceholder"> </span></h4>`;
                        }
                        break;
                    }
                    s=this.symbols[i];
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
            symbolTableLines.innerHTML+=`<h4> &nbsp; </h4>`;
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
        if(e.getType()==InputLineType.TRANSLATED){
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
                if(aniControl.start) await checkIfPaused();
                await updateScrollOfIn_Out("OutputText",`${(e.getId()+1)<10?"0"+(e.getId()+1):(e.getId()+1)}outputP`);
                if(aniControl.start){

                    await this.anim.pushAufzulosendestoCurrentLine(e.getId(),this.getLinkerAufloesungLine(e.getId(),false));
                }
                // currentLine.innerHTML=`<h2 style="align-self: end;" class=" noMargin p5px">${this.getLinkerAufloesungLine(e.getId(),false)}</h2>`
                // currentLineLine.innerHTML=`${this.getLinkerAufloesungLine(e.getId(),false)}`
                currentLineLine.innerHTML=`${e.getStartingAddr()}: ${this.inputLineControl.getDisplayableSpeicherabbild(e,false)} <span>${this.getLabelIfUnknown(e.getId(),false)}</span>`
                addresszahler.innerHTML= `${e.getStartingAddr()}`;
                machinenbefehl.innerHTML= `${this.inputLineControl.getDisplayableSpeicherabbild(e,false)}`;
                if(aniControl.start){
                    await sleepUntilNextStep();
                }
                descriptionLines.innerHTML += `<p>Suche Label '<span class="labelBlue">${k.getName()}</span>' in SymbolTabelle</p>`;
                currentLineLine.innerHTML=`${e.getStartingAddr()}: ${this.inputLineControl.getDisplayableSpeicherabbild(e,false)} <span class="crInvert">${this.getLabelIfUnknown(e.getId(),false)}</span>`

                if(aniControl.start){
                    updateScroll(descriptionLines.id);
                    await sleepUntilNextStep();
                }
                if(k.getPosition()=="????"){
                    if(aniControl.start){
                        await this.anim.exchangeLabelWithSymbolTable("Label '"+k.getName()+"'?","",true);
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
                    if(aniControl.start){
                        await this.anim.exchangeLabelWithSymbolTable("Label '"+k.getName()+"'?","Label '"+k.getName()+"' = "+Manipulator.hexToDec(k.getPosition()!)+" ("+k.getPosition()!+")",false);
                    }

                    descriptionLines.innerHTML += `<p class="eingeruckt">Label '<span class="labelBlue">${k.getName()}</span>' in Symboltabelle gefunden, Wert: ${Manipulator.hexToDec(k.getPosition()!)+" ("+k.getPosition()!+")"}</p>`;
                    if(aniControl.start){
                        updateScroll(descriptionLines.id);
                        await sleepUntilNextStep();
                    }
                    
                    descriptionLines.innerHTML += `<p class="eingeruckt">Ersetzung im Speicherabbild: ${s}-->${n}</p>`;
                    if(aniControl.start){
                        updateScroll(descriptionLines.id);
                        await sleepUntilNextStep();
                    }
                    
                    this.repushTranslations();
                    machinenbefehl.innerHTML= `${n}`;
                    if(aniControl.start){
                        await this.anim.moveDetailToSpeicherabbild(this.getLinkerAufloesungLine(e.getId(),true),e.getId());
                    }
                    this.repushSpeicherabbildOf(e.getId(),true);
                    descriptionLines.innerHTML += `<p>&nbsp;&nbsp;&nbsp;</p>`;
                    if(aniControl.start){
                        updateScroll(descriptionLines.id);
                    }
                    
                }
            }
        }
        updateScroll(descriptionLines.id);

    }
    private displaySecondPhase=async()=>{
        let sleeptime = 100;
        descriptionLines.innerHTML += `<p>&nbsp;&nbsp;&nbsp;</p>`;
        await sleepFor(sleeptime);
        descriptionLines.innerHTML += `<p>&nbsp;&nbsp;&nbsp;</p>`;
        await sleepFor(sleeptime);

        descriptionLines.innerHTML += `<p>************************</p>`;
        await sleepFor(sleeptime*2);

        descriptionLines.innerHTML += `<p>2.Phase LinkerAuflösung</p>`;
        await sleepFor(sleeptime*2);

        descriptionLines.innerHTML += `<p>************************</p>`;
        await sleepFor(sleeptime*2);

        descriptionLines.innerHTML += `<p>&nbsp;&nbsp;&nbsp;</p>`;
        await sleepFor(sleeptime);

        descriptionLines.innerHTML += `<p>&nbsp;&nbsp;&nbsp;</p>`;
        await sleepFor(sleeptime);

        updateScroll(descriptionLines.id);
    }
    public linkerAuflosung=async ()=>{
        this.repushTranslations();
        if(this.linkerAuflosungB){
            await this.displaySecondPhase();
            for(let i=0;i<this.inputLines.length;i++){
                console.log(1);
                await this.checkInputLine(this.inputLines[i]);
                await this.clearMachinenbefehlandCurrentLine();
                if(aniControl.start){
                    await sleepUntilNextStep();
                }
            }
        }
    }
    private clearMachinenbefehlandCurrentLine(){
        machinenbefehl.innerHTML="&nbsp;";
        currentLineLine.innerHTML="&nbsp;";
    }
    public repushTranslations=async()=>{
        OutputTextAreaElement.innerHTML="";
        let i;
        for(let j=0;j<=this.inputLines.length;j++){
            i=this.inputLines[j];
            if(i!=undefined){
                if(i.getType() == InputLineType.TRANSLATED){
                    OutputTextAreaElement.innerHTML+=":"+i.getTranslation()+"\n";
                }
            }else{
                OutputTextAreaElement.innerHTML+=":00000001FF";
            }
        }
    }

    public repushTranslationOf=async(i:number)=>{
        let e:InputLine;
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
        // console.log(n+" corresponds to -> "+this.inputstrings[n]);
        if(n<this.inputstrings.length){
            this.inputLineControl.addInputLine(this.inputstrings[n]);
            this.refreshInputLines();
            return true;
        }
        return false;
    }

    private pushLines=async()=>{
        let input:InputLine;
        let iP:HTMLElement;
        if(this.inputstrings.length>0){
            for(let i=0;i<this.inputstrings.length;i++){
                this.translateInputStringOfId(i);
                
                if(this.inputLines.length>i){
                    input = this.inputLines[i];
                    if(aniControl.start) await this.clearMachinenbefehlandCurrentLine();
                    iP= getHtmlElement(`${(i+1)<10?"0"+(i+1):(i+1)}inputP`);
                    await updateScrollOfIn_Out("InputText",`${(i+1)<10?"0"+(i+1):(i+1)}inputP`);

                    if(input.getType()==InputLineType.EMPTY){
                        if(aniControl.start)await checkIfPaused();
                        continue;
                    }
                    else{
                        if(aniControl.start && aniControl.speed<=3 && aniControl.animationType!=AnimationsTyp.Typ3) await sleepFor(1000-(aniControl.speed-1)*200);
                        if(aniControl.start){
                            await this.anim.animationInputLineToCurrentLine(i,this.inputstrings[i].split(";")[0]);
                        }
                        this.nextParseID=0;
                        currentLineLine.innerHTML=`${input.getCommandLineToCurrentLine()}`;
                        await this.pushDescriptionLinesOf(i);
                    }
                    await this.repushTranslationOf(i);
                    
                }
                if(aniControl.singleStepFlag) await this.pause();
                if(aniControl.start)await checkIfPaused();
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
                if(aniControl.start){
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
                    
                    if(aniControl.start){
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
                            
                            if(aniControl.start){
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
                if(aniControl.start){
                    await sleepUntilNextStep();
                    await this.anim.moveConstToSymbolTable(this.symbolList.getSpecificConstantByName(l.getFirstPart())!.toStringtoMovable());
                }
                this.rePushSymbols();
                // this.pushTranslationOf(i);
                this.repushSpeicherabbildOf(i,false);
            }
            else if(l.getType()==InputLineType.PSEUDOTRANSLATED){
                // this.pushTranslationOf(i);
                this.repushSpeicherabbildOf(i,false);
            }
            else{
                if(aniControl.start){
                    await sleepUntilNextStep();
                    await this.anim.displayAddresserhoehung(l.getLength());
                }
                addresszahler.innerHTML= `${l.getEndAddr()}`;
            }

            if(aniControl.start){
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
            try {
                if(aniControl.end || aniControl.stop){
                    throw new Error("Stop has been pressed or animation Finished!");
                    return;
                }
                if(!aniControl.start){
                    aniControl.setStart();
                    await this.startPlaying();
                }
                else{
                    if(aniControl.play){
                        aniControl.setPaused();
                    }
                    else{
                        aniControl.setPlaying();
                    }
                }
            } catch (e) {
                console.log(e);
                // await this.reset();
            }
        }else{
            console.log("no Input");
        }
    }

    public startPlaying=async()=>{
        if(this.inputstrings.length>0){
            try {
                await this.pushLines();
                await this.clearMachinenbefehlandCurrentLine();
            } catch (e) {
                console.log(e);
            }
        }
        else{
            console.log("no Input");
        }
    }

    public skipToFinish=async()=>{
        if(this.inputstrings.length>0){
            await this.reset();
            try {
                await this.pushLines();
                await this.clearMachinenbefehlandCurrentLine();
            } catch (e) {
                console.log(e);
                return;
            }
            await aniControl.setEnd();
            
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
        await aniControl.setReset();
        await sleepFor(100);
        await this.partialReset();
        await sleepFor(100);
        await this.refreshInputListItems();
        // console.log(this);
    }

    public displayInputLines=async()=>{        
        await this.partialReset();
        await this.refreshInputListItems();
        // console.log(this);
    }

    setInputStrings(s:string[]){
        this.inputstrings=s;
    }

    refreshInputStrings(s:string[]){
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
            createClickListener('speed',this.speed);
            createClickListener('skip',this.skipToFinish);
            createClickListener('reset',this.reset);
            aniControl.createEventListeners();
            // createClickListener(InputID.id,setScrollbarOfDescriptionLine);
        }catch(e){
            console.log(e);
        }
    } 

}