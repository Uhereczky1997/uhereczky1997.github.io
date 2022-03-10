

import { Manipulator } from "./Backend/Manipulator";
import { SymbolList } from "./Backend/SymbolList";
import { DataType,InputLineType } from "./Backend/Enums";
import { Label } from "./Backend/Label";
import { Constant } from "./Backend/Constant";
import { InputLineControl } from "./Backend/InputLineControl";
import { InputLine } from "./Backend/InputLine";
import { InputWindow } from "./InputWindow";
import { getHtmlElement, createClickListener, updateScroll, updateScrollOfIn_Out } from "./Tools";
import { aniControl, sleepFor, sleepUntilNextStep } from "./AnimationUtil";
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

export class ProjectWindow{
    private inputLineControl:InputLineControl=InputLineControl.getInstance();
    private symbolList=SymbolList.getInstance();
    private iWindow:InputWindow = new InputWindow(this);
    private elementDisplayed:number=-1;
    private descriptionLinesOfCurrentDisplayedElement:string[]=[];
 /*   private elementOfElementDisplayed = -1;
    private translationOfElementDisplayed =-1; */
    private anim:Animator;
    private idOfDisplayedConstANDLabel =-1;
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
    
    public partialReset = () =>{
        this.inputLines=[];
        currentLine.innerHTML="";
        symbolTableLines.innerHTML="";
        descriptionLines.innerHTML="";
        addresszahler.innerHTML="0000h";
        this.nextParseID=0;
        machinenbefehl.innerHTML="";
        OutputAddresses.innerHTML="";
        OutputLines.innerHTML="";
        this.elementDisplayed = -1;
        this.idOfDisplayedConstANDLabel =-1;
        /* this.elementOfElementDisplayed = -1;
        this.translationOfElementDisplayed =-1; */
        OutputTextAreaElement.innerHTML="";
        this.inputLineControl.reset();
        this.anim.reset();
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
        let ss:string[]=[];
        //inputTextDiv.innerHTML="";
        let e:InputLine;
        for(let i=0;i<this.inputstrings.length;i++){
            e=this.inputLines[i];
            if(e !=null){
                if(e.getType()==InputLineType.EMPTY){
                    InputID.innerHTML+=`<p  class="gray">${(i+1)<10?"0"+(i+1):(i+1)}:</p>`;
                    InputLines.innerHTML+=`<p id="${(i+1)<10?"0"+(i+1):(i+1)}inputP" class="overflowElipsis">${e.getCommentary()==""?"":";"+e.getCommentary()}</p>`;
                }else{
                    InputID.innerHTML+=`<p  class="gray">${(i+1)<10?"0"+(i+1):(i+1)}:</p>`;
                    InputLines.innerHTML+=`<p id="${(i+1)<10?"0"+(i+1):(i+1)}inputP" class="overflowElipsis">${Manipulator.formatLabelandBefehlDisplay(e.getLabel(),e.commandLinetoString())}${e.getCommentary()==""?"":";"+e.getCommentary()}</p>`;
                }
            }
            else{
                InputID.innerHTML+=`<p class="gray">${(i+1)<10?"0"+(i+1):(i+1)}:</p>`;
                InputLines.innerHTML+=`<p id="${(i+1)<10?"0"+(i+1):(i+1)}inputP"  class="overflowElipsis">${this.inputstrings[i]}&nbsp;</p>`;
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
            }else{
                inputLineHTML.innerHTML=`${Manipulator.formatLabelandBefehlDisplay(e.getLabel(),e.commandLinetoString())}${e.getCommentary()==""?"":";"+e.getCommentary()}`;
            }
            
        }
    }

    public repushSpeicherabbildOf=(i:number)=>{

        if(i<this.inputLines.length){
            let e:InputLine=this.inputLines[i];
            let idString = `${(i+1)<10?"0"+(i+1):(i+1)}outputP`;
            let outputLineHTML:HTMLElement = getHtmlElement(idString);
            console.log(outputLineHTML);
            if(e.getType() == InputLineType.TRANSLATED){
                if(e.getTranslation().includes("????")){
                    outputLineHTML.innerHTML=`${this.inputLineControl.getSpeicherAbbild(e,false)}`;
                }
                else{
                    outputLineHTML.innerHTML=`${this.inputLineControl.getSpeicherAbbild(e,true)}`;
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
            for(let i=this.symbols.length-1;i>=0;i--){

                if(this.symbols[i]!=null){
                    s=this.symbols[i];
                    if(s instanceof Label){
                        n=s.getName();
                        p=s.getPosition()!;
                        symbolTableLines.innerHTML+=`<h4><span class="gray">Label:</span> &nbsp;&nbsp;&nbsp; ${n} Wert:${this.inputLineControl.fHD16(p)} (little endian:${this.inputLineControl.getLittleEndianOf(p)})</h4>`;
                    }
                    if(s instanceof Constant){
                        n=s.getName();
                        p=s.getValue();
                        symbolTableLines.innerHTML+=`<h4><span class="gray">Konst.:</span> &nbsp;&nbsp; ${n} Wert:${this.inputLineControl.fHD16(p)} (little endian:${this.inputLineControl.getLittleEndianOf(p)})</h4>`
                    }
                }
            }
        }
    }

    public getLinkerAufloesungLine(i:number,b:boolean):string{
        let e:InputLine;
        let addr:string,spa:string,l:string="";
        if(i<this.inputLines.length){
            e = this.inputLines[i];
            addr = e.getStartingAddr();
            spa = this.inputLineControl.getSpeicherAbbild(e,b);
            if(spa.includes("??")){
                if(this.symbolList.isLabel(e.getSecondPart())){
                    l = "("+e.getSecondPart()+")";
                }
                if(this.symbolList.isLabel(e.getThirdPart())){
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
            if(e.getTranslation().includes("????")){

                k=this.symbolList.getLabels().find(i=>{
                    if(i.getName().toLowerCase()==e.getSecondPart().toLowerCase() || i.getName().toLowerCase()== e.getThirdPart().toLowerCase()){
                        return i;
                    }
                })!;
                // console.log(this.getLinkerAufloesungLine(e.getId()));
                await this.anim.pushAufzulosendestoCurrentLine(e.getId(),this.getLinkerAufloesungLine(e.getId(),false));
                currentLine.innerHTML=`<h2 style="align-self: end;" class=" noMargin p5px">${this.getLinkerAufloesungLine(e.getId(),false)}</h2>`
                addresszahler.innerHTML= `${e.getStartingAddr()}`;
                machinenbefehl.innerHTML= `${this.inputLineControl.getSpeicherAbbild(e,false)}`;

                descriptionLines.innerHTML += `<p>Suche Label ${k.getName()} in SymbolTabelle</p>`;
                if(aniControl.start){
                    await sleepUntilNextStep();
                    updateScroll(descriptionLines.id);
                }
                if(k.getPosition()=="????"){
                    descriptionLines.innerHTML += `<p><span class="errorRed">Label '${k.getName()}' konnte nicht aufgelöst werden!</span></p>`;
                    updateScroll(descriptionLines.id);
                    await sleepFor(10);
                    aniControl.setStop();
                    throw Error('Stop pressed');
                }
                else{
                    s=this.inputLineControl.getSpeicherAbbild(e,false);
                    this.inputLineControl.retranslate(e);
                    n=this.inputLineControl.getSpeicherAbbild(e,true);

                    await this.anim.exchangeLabelWithSymbolTable("Label '"+k.getName()+"'?","Label '"+k.getName()+"' Wert:"+Manipulator.hexToDec(k.getPosition()!)+" ("+k.getPosition()!+")");

                    descriptionLines.innerHTML += `<p>Label '${k.getName()}' in Symboltabelle gefunden, Wert: ${Manipulator.hexToDec(k.getPosition()!)+" ("+k.getPosition()!+")"}</p>`;
                    if(aniControl.start){
                        await sleepUntilNextStep();
                        updateScroll(descriptionLines.id);
                    }
                    
                    descriptionLines.innerHTML += `<p>Ersetzung im Speicherabbild: ${s}-->${n}</p>`;
                    if(aniControl.start){
                        await sleepUntilNextStep();
                        updateScroll(descriptionLines.id);
                    }
                    
                    this.repushTranslations();
                    machinenbefehl.innerHTML= `${n}`;
                    if(aniControl.start){
                        await sleepUntilNextStep();
                        await this.anim.moveDetailToSpeicherabbild(this.getLinkerAufloesungLine(e.getId(),true),e.getId());
                    }
                    this.repushSpeicherabbildOf(e.getId());
                    descriptionLines.innerHTML += `<p>&nbsp;&nbsp;&nbsp;</p>`;
                    if(aniControl.start){
                        await sleepUntilNextStep();
                        updateScroll(descriptionLines.id);
                    }
                    
                }
            }
        }
        updateScroll(descriptionLines.id);

    }
    
    public linkerAuflosung=async ()=>{
        this.repushTranslations();
        if(this.linkerAuflosungB){
            descriptionLines.innerHTML += `<p>&nbsp;&nbsp;&nbsp;</p>`;
            descriptionLines.innerHTML += `<p>&nbsp;&nbsp;&nbsp;</p>`;
            descriptionLines.innerHTML += `<p>************************</p>`;
            descriptionLines.innerHTML += `<p>2.Phase LinkerAuflösung</p>`;
            descriptionLines.innerHTML += `<p>************************</p>`;
            descriptionLines.innerHTML += `<p>&nbsp;&nbsp;&nbsp;</p>`;
            descriptionLines.innerHTML += `<p>&nbsp;&nbsp;&nbsp;</p>`;
            updateScroll(descriptionLines.id);
            for(let i=0;i<this.inputLines.length;i++){
                await this.checkInputLine(this.inputLines[i]);
                if(aniControl.start){
                    await sleepUntilNextStep();
                }
            }
        }
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
                this.elementDisplayed =i;
                if(this.inputLines.length>i){
                    input = this.inputLines[i];
                    iP= getHtmlElement(`${(i+1)<10?"0"+(i+1):(i+1)}inputP`);
                    await updateScrollOfIn_Out("InputText",`${(i+1)<10?"0"+(i+1):(i+1)}inputP`,i+1);
                    // await this.anim.animationInputLineToCurrentLine(iP.offsetTop,iP.offsetLeft,iP.offsetWidth,iP.offsetHeight,"");
                    // console.log(i+" corresponds to -> "+input.getType()+" :: "+input.getInitialLine());
                    if(input.getType()==InputLineType.EMPTY){
                        OutputAddresses.innerHTML+=`<p><span class="gray">&nbsp;</span></p>`;
                        OutputLines.innerHTML+=`<p id="${(input.getId()+1)<10?"0"+(input.getId()+1):(input.getId()+1)}outputP">&nbsp;&nbsp;&nbsp;</p>`;
                    }
                    else{
                        if(aniControl.start){
                            await this.anim.animationInputLineToCurrentLine(iP.offsetTop,iP.offsetLeft,iP.offsetWidth,iP.offsetHeight,this.inputstrings[i]);
                        }
                            
                        currentLine.innerHTML=this.pushCurrentLine(input.getAll());
                        machinenbefehl.innerHTML="";
                        this.descriptionLinesOfCurrentDisplayedElement=input.getDescriptionLine();
                        await this.pushDescriptionLinesOf(i);
                    }
                }
            }
            if(aniControl.start){
                this.toggleStop();
            }
            this.linkerAuflosungB=this.aufzulosendeLabel();
            await this.linkerAuflosung();
            aniControl.setEnd();
        }
    }

    private pushDescriptionLinesOf=async(i:number)=>{
        let e:string;
        let ss:string[];
        if(this.inputLines.length>i){
            ss=this.inputLines[i].getDescriptionLine()
            for(let j=0;j<ss.length;j++){
                e=ss[j]
                if(aniControl.start){
                    await sleepUntilNextStep();
                }
                if(e.includes("parse")){
                    await this.nextInverted(this.inputLines[this.elementDisplayed].getAllV());
                }
                if(e.includes('error')){
                    console.log("error has been found");
                    await this.nextInverted(this.inputLines[this.elementDisplayed].getAllV());
                    aniControl.setStop();
                    
                    descriptionLines.innerHTML += `<p>${e}</p>`;
                    updateScroll(descriptionLines.id);
                    throw Error('Stop pressed');
                }else{
                    
                    descriptionLines.innerHTML += `<p>${e}</p>`;
                    updateScroll(descriptionLines.id);
                }
                if(e.includes("gefunden: Doppelpunkte")){
                    if(aniControl.start){
                        await sleepUntilNextStep();
                        await this.anim.moveLabeltoSymboltable("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+this.inputLines[i].getLabel()+" Wert:"+this.symbolList.getPositionOfSpecificLabel(this.inputLines[i].getLabel()));
                    }
                    this.rePushSymbols(); 
                }
                if(j-1>0){
                    if(ss[j-1].includes("gesamter")){
                        if(this.inputLines[i].getEndAddr()!=""){
                            machinenbefehl.innerHTML= `${this.inputLineControl.getSpeicherAbbild(this.inputLines[this.elementDisplayed],false)}`;
            
                            if(aniControl.start){
                                await sleepUntilNextStep();
                                await this.anim.moveDetailToSpeicherabbild(this.getLinkerAufloesungLine(i,false),-1);
                            }
                            this.pushTranslationOf(i);
                        }
                    }
                }
                if(e.includes("Anzahl")){
                    addresszahler.innerHTML= `${this.inputLines[this.elementDisplayed].getEndAddr()}`;
                }
            }
            descriptionLines.innerHTML += `<p style=" white-space: nowrap; overflow: hidden;"> --------------------------------------------------------- </p>`;

            if(aniControl.start){
                await sleepUntilNextStep();
            }
            /* if(this.inputLines[i].getEndAddr()!=""){
                machinenbefehl.innerHTML= `${this.inputLineControl.getSpeicherAbbild(this.inputLines[this.elementDisplayed],false)}`;

                if(aniControl.start){
                    await this.anim.moveDetailToSpeicherabbild(this.getLinkerAufloesungLine(i,false),-1);
                }

                addresszahler.innerHTML= `${this.inputLines[this.elementDisplayed].getEndAddr()}`;

            } */
            // this.pushTranslationOf(i);
            // this.refreshInputListItems();
            this.refreshInputListItem(i);
            updateScroll(descriptionLines.id);
        }
    }

    private pushTranslationOf=async(e:number)=>{
        let i:InputLine;
        if(this.inputLines.length>e){
            i =this.inputLines[e];
            if(i.getType() == InputLineType.TRANSLATED){
                OutputAddresses.innerHTML+=`<p><span class="gray">${Manipulator.formatHextoDat16(i.getStartingAddr())}: </span></p>`;
                OutputLines.innerHTML+=`<p id="${(i.getId()+1)<10?"0"+(i.getId()+1):(i.getId()+1)}outputP">${this.inputLineControl.getSpeicherAbbild(i,false)}</p>`;
                OutputTextAreaElement.innerHTML+=":"+i.getTranslation()+"\n";
            }
            else{
                OutputAddresses.innerHTML+=`<p><span class="gray">&nbsp;</span></p>`;
                OutputLines.innerHTML+=`<p id="${(i.getId()+1)<10?"0"+(i.getId()+1):(i.getId()+1)}outputP">&nbsp;&nbsp;&nbsp;</p>`;
                
            }
        }
    }
    
    private aufzulosendeLabel=():boolean=>{
        let b=false;
        this.inputLines.forEach(e=>{
            if(e.getTranslation().includes("????")){
                b=true;
            }
        });
        return b;
    }
    
    private pushCurrentLine=(ss:string[])=>{
        this.nextParseID=0;
        let dsrl=`<h2 style="align-self: end;" class=" noMargin p5px">`;
        if(ss[0]!=""){
            dsrl+=`<span id="crLabel">${ss[0]}</span>: `;
        }
        if(ss[1]!=""){
            dsrl+=`<span id="crFirst">${ss[1]}</span> `;
        }
        if(ss[2]!="" && this.inputLines[this.elementDisplayed].getSecondPart()=="EQU"){
            dsrl+=`<span id="crSecond">${ss[2]}</span> `;
        }
        else if(ss[2]!="" && this.inputLines[this.elementDisplayed].getSecondPart()!="EQU" && this.inputLines[this.elementDisplayed].getThirdPart()==""){
            dsrl+=`<span id="crSecond">${ss[2]}</span> `;
        }
        else if(ss[2]!=""){
            dsrl+=`<span id="crSecond">${ss[2]}</span>,`;
        }
        if(ss[3]!=""){
            dsrl+=`<span id="crThird">${ss[3]}</span>`;
        }
        if(ss[4]!=""){
            dsrl+=`<span id="crError">${ss[4]}</span>`;
        }
        if(ss[5]!=""){
            dsrl+=`<span id="crRest">${ss[5]}</span>`;
        }
        dsrl+=`</h2>`;
        return dsrl;
    }
    
    public toggleStop=async()=>{
        if(this.inputstrings.length>0){
            try {
                if(!aniControl.start){
                    aniControl.setStart();
                    await this.play();
                }
                else{
                    aniControl.setPlaying();
                }
            } catch (e) {
                console.log(e);
                await this.reset();
            }
        }else{
            console.log("no Input");
        }
    }

    public play=async()=>{
        if(this.inputstrings.length>0){
            try {
                await this.pushLines();
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
            } catch (e) {
                console.log(e);
            }
            aniControl.setEnd();
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
        aniControl.setSpeed();
    }

    public reset=async()=>{
        if(this.inputstrings.length>0){
            aniControl.setReset();
            await sleepFor(10);
            this.partialReset();
            this.refreshInputListItems();
        }
        else{
            console.log("no Input");
        }
    }

    public displayInputLines=()=>{        
        this.partialReset();
        this.refreshInputListItems();
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
            createClickListener('stop',this.pause);
            createClickListener('speed',this.speed);
            createClickListener('skip',this.skipToFinish);
            createClickListener('reset',this.reset);
        }catch(e){
            console.log(e);
        }
    } 

}