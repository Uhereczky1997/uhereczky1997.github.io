

import { Manipulator } from "./Backend/Manipulator";
import { SymbolList } from "./Backend/SymbolList";
import { DataType,InputLineType } from "./Backend/Enums";
import { Label } from "./Backend/Label";
import { Constant } from "./Backend/Constant";
import { InputLineControl } from "./Backend/InputLineControl";
import { InputLine } from "./Backend/InputLine";
import { InputWindow } from "./InputWindow";
import { getHtmlElement, createClickListener, updateScroll } from "./Tools";
import { aniControl, sleepFor, sleepUntilNextStep } from "./AnimationUtil";



let descriptionLines:HTMLElement = getHtmlElement('descriptionLines');
let symbolTableLines:HTMLElement = getHtmlElement('symbolTableLines');
let currentLine:HTMLElement = getHtmlElement('currentLine');
let outputText:HTMLElement = getHtmlElement('OutputText');
let inputTextDiv:HTMLElement= getHtmlElement('InputText');
let addresszahler:HTMLElement = getHtmlElement('Addresszahler');
let machinenbefehl:HTMLElement = getHtmlElement('Machinenbefehl');
let outputwindowContainer:HTMLElement = getHtmlElement('OutputWindowContainer');
let OutputTextAreaElement:HTMLTextAreaElement =getHtmlElement('OutputTextArea')as HTMLTextAreaElement;
let InputID:HTMLElement=getHtmlElement('InputID');
let InputLines:HTMLElement=getHtmlElement('InputLines');
let OutputAddresses:HTMLElement=getHtmlElement('OutputAddresses');
let OutputLines:HTMLElement=getHtmlElement('OutputLines');

export class ProjectWindow{
    private inputLineControl:InputLineControl=InputLineControl.getInstance();
    private symbolList=SymbolList.getInstance();
    private iWindow:InputWindow = new InputWindow(this);
    private elementDisplayed:number=-1;
    private descriptionLinesOfCurrentDisplayedElement:string[]=[];
    private elementOfElementDisplayed = -1;
    private translationOfElementDisplayed =-1;
    private idOfDisplayedConstANDLabel =-1;
    private linkerAuflosungB:boolean=false;
    private inputLines:InputLine[]=[];
    private inputstrings:string[] =[];
    private symbols:Array<Label|Constant>=[]
    constructor(){
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

    public pushTranslation(){
        let i:InputLine;
        if(this.inputLines.length>0){
            if(this.inputLines.length>this.translationOfElementDisplayed+1){
                this.translationOfElementDisplayed+=1;
                i =this.inputLines[this.translationOfElementDisplayed];
                if(i.getType() == InputLineType.TRANSLATED){
                    OutputAddresses.innerHTML+=`<p><span class="gray">${Manipulator.formatHextoDat16(i.getStartingAddr())}: </span></p>`;
                    OutputLines.innerHTML+=`<p>${this.inputLineControl.getSpeicherAbbild(i,false)}</p>`;
                    
                    // outputText.innerHTML+= `<p><span class="gray">${Manipulator.formatHextoDat16(i.getStartingAddr())}: </span>  |${this.inputLineControl.getSpeicherAbbild(i)}</p>`;
                    OutputTextAreaElement.innerHTML+=":"+i.getTranslation()+"\n";
                }
                else{
                    OutputAddresses.innerHTML+=`<p><span class="gray">&nbsp;</span></p>`;
                    OutputLines.innerHTML+=`<p>&nbsp;&nbsp;&nbsp;</p>`;
                    //outputText.innerHTML+= `<p>&nbsp;&nbsp;&nbsp;</p>`;
                }
            }
            else if(this.inputstrings.length==this.translationOfElementDisplayed+1){ //+1
                this.translationOfElementDisplayed+=1;
                OutputTextAreaElement.innerHTML+=":00000001FF";
            }
            else{

            }
        }
    }
    public partialReset = () =>{
        this.inputLines=[];
        currentLine.innerHTML="";
        symbolTableLines.innerHTML="";
        descriptionLines.innerHTML="";
        addresszahler.innerHTML="0000h";
        machinenbefehl.innerHTML="";
        OutputAddresses.innerHTML="";
        OutputLines.innerHTML="";
        this.elementDisplayed = -1;
        this.idOfDisplayedConstANDLabel =-1;
        this.elementOfElementDisplayed = -1;
        this.translationOfElementDisplayed =-1;
        OutputTextAreaElement.innerHTML="";
        this.inputLineControl.reset();
    }
    private setInOutEmpty(){
        InputID.innerHTML="";
        InputLines.innerHTML="";
        OutputAddresses.innerHTML="";
        OutputLines.innerHTML="";

    }
    public refreshInputListItems=()=>{
        InputID.innerHTML="";
        InputLines.innerHTML="";
        //inputTextDiv.innerHTML="";
        let e:InputLine;
        for(let i=0;i<this.inputstrings.length;i++){
            e=this.inputLines[i];
            if(e !=null){
                InputID.innerHTML+=`<p><span class="gray">${(i+1)<10?"0"+(i+1):(i+1)}: </span></p>`;
                // InputLines.innerHTML+=`<p><span class="hoverable maxwidth">${e.inputLineToString()}</span></p>`;
                InputLines.innerHTML+=`<p class="overflowElipsis"><span>${(e.getLabel()==""?"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;":e.getLabel()+":")} ${e.commandLinetoString()}${e.getCommentary()==""?"":";"+e.getCommentary()}</span></p>`;
                // InputLines.innerHTML+=`<p><span class="overflowText">${(e.getLabel()==""?"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;":e.getLabel()+":")} ${e.commandLinetoString()}${e.getCommentary()==""?"":";"+e.getCommentary()}</span><span class="tooltip">${e.getCommentary()}</span></p>`;
                // inputTextDiv.innerHTML+=`<p><span class="gray">${(i+1)<10?"0"+(i+1):(i+1)}: </span>  |<span class="hoverable maxwidth">${e.inputLineToString()}</span></p>`;
            }
            else{
                InputID.innerHTML+=`<p><span class="gray">${(i+1)<10?"0"+(i+1):(i+1)}: </span></p>`;
                // InputLines.innerHTML+=`<p><span class="overflowText">${this.inputstrings[i]}</span><span class="tooltip">${this.inputstrings[i]}</span></p>`;
                InputLines.innerHTML+=`<p class="overflowElipsis"><span>${this.inputstrings[i]}</span></p>`;
                // inputTextDiv.innerHTML+=`<p><span class="gray">${(i+1)<10?"0"+(i+1):(i+1)}: </span>  |<span class="hoverable maxwidth">${this.inputstrings[i]}</span></p>`;
            }
        }

        /* inputTextDiv.innerHTML="<p>";
        this.inputLines.forEach(e=>{
            inputTextDiv.innerHTML+=`<span class="gray">${e.getId()<10?"0"+e.getId():e.getId()}: </span>  |  <span class="hoverable maxwidth">${e.inputLineToString()}</span><br>`;
        })
        inputTextDiv.innerHTML+="</p>" */
    }
    private pushNewSymbol=():boolean=>{
        this.symbols=this.symbolList.getSequence();
        let s:Constant|Label;
        let n,p;
        if(this.symbols.length!=0){
            if(this.symbols[this.idOfDisplayedConstANDLabel+1]!=null){
                s=this.symbols[this.idOfDisplayedConstANDLabel+1];
                this.idOfDisplayedConstANDLabel+=1;
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
                updateScroll(symbolTableLines.id);
                return true;
            }
        }
        return false;

    }
    /* pushToCurrentLine(s:string){
        let ss:string[]=[];
        let temp=s;
        if(s.includes(":")){
            ss[0]=`<span id="currentLineLabel">${Manipulator.splitStringHalf(temp,":")[0]}</span>`;
            temp=Manipulator.splitStringHalf(temp,":")[1];
        }
        else{
            ss[0]="";
        }
        ss[1]=Manipulator.
    } */
    public checkInputLine=async(e:InputLine)=>{
        let s:string="";
        let n:string="";
        let ss:string[]=[];
        let l:Label|undefined;
        if(e.getType()==InputLineType.TRANSLATED){
            if(e.getTranslation().includes("????")){
                
                l=this.symbolList.getLabels().find(i=>{
                    if(i.getName()==e.getSecondPart() || i.getName()== e.getThirdPart()){
                        return i;
                    }
                })!;
                descriptionLines.innerHTML += `<p>Suche Label ${l.getName()} in SymbolTabelle</p>`;
                if(aniControl.start){
                    await sleepUntilNextStep();
                    updateScroll(descriptionLines.id);
                }
                if(l.getPosition()=="????"){
                    descriptionLines.innerHTML += `<p><span class="errorRed">Label '${l.getName()}' konnte nicht aufgelöst werden!</span></p>`;
                    updateScroll(descriptionLines.id);
                    await sleepFor(10);
                    aniControl.setStop();
                    throw Error('Stop pressed');
                }
                else{
                    descriptionLines.innerHTML += `<p>Label '${l.getName()}' in Symboltabelle gefunden, Wert: ${Manipulator.hexToDec(l.getPosition()!)+" ("+l.getPosition()!+")"}</p>`;
                    if(aniControl.start){
                        await sleepUntilNextStep();
                        updateScroll(descriptionLines.id);
                    }
                    s=this.inputLineControl.getSpeicherAbbild(e,false);
                    this.inputLineControl.retranslate(e);
                    n=this.inputLineControl.getSpeicherAbbild(e,true);
                    descriptionLines.innerHTML += `<p>Ersetzung im Speicherabbild: ${s}-->${n}</p>`;
                    if(aniControl.start){
                        await sleepUntilNextStep();
                        updateScroll(descriptionLines.id);
                    }
                    descriptionLines.innerHTML += `<p>&nbsp;&nbsp;&nbsp;</p>`;
                    if(aniControl.start){
                        await sleepUntilNextStep();
                        updateScroll(descriptionLines.id);
                    }
                    this.repushTranslations();
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
            for(let i=0;this.inputLines.length;i++){
                await this.checkInputLine(this.inputLines[i]);
                if(aniControl.start){
                    await sleepUntilNextStep();
                }
            }
        }
    }
    public repushTranslations=async()=>{
        OutputAddresses.innerHTML="";
        OutputLines.innerHTML="";
        OutputTextAreaElement.innerHTML="";
        let i;
        for(let j=0;j<=this.inputLines.length;j++){
            i=this.inputLines[j];
            console.log(i);
            if(i!=undefined){
                if(i.getType() == InputLineType.TRANSLATED){
                    OutputAddresses.innerHTML+=`<p><span class="gray">${Manipulator.formatHextoDat16(i.getStartingAddr())}: </span></p>`;
                    if(i.getTranslation().includes("????")){
                        OutputLines.innerHTML+=`<p>${this.inputLineControl.getSpeicherAbbild(i,false)}</p>`;
                    }
                    else{
                        OutputLines.innerHTML+=`<p>${this.inputLineControl.getSpeicherAbbild(i,true)}</p>`;
                    }
                    // outputText.innerHTML+= `<p><span class="gray">${Manipulator.formatHextoDat16(i.getStartingAddr())}: </span>  |${this.inputLineControl.getSpeicherAbbild(i)}</p>`;
                    OutputTextAreaElement.innerHTML+=":"+i.getTranslation()+"\n";
                }
                else{
                    OutputAddresses.innerHTML+=`<p><span class="gray">&nbsp;</span></p>`;
                    OutputLines.innerHTML+=`<p>&nbsp;&nbsp;&nbsp;</p>`;
                    //outputText.innerHTML+= `<p>&nbsp;&nbsp;&nbsp;</p>`;
                }
            }else{
                OutputTextAreaElement.innerHTML+=":00000001FF";
            }
        }
    }
    public  testCycling =async() => {
        let e:string;
        if(this.inputstrings.length>0){
            if(this.elementOfElementDisplayed ==-1 && this.elementDisplayed == -1){
                await this.testPushing();
            }
            else if(this.elementOfElementDisplayed+1<this.descriptionLinesOfCurrentDisplayedElement.length){
                this.elementOfElementDisplayed+=1;
                e=this.descriptionLinesOfCurrentDisplayedElement[this.elementOfElementDisplayed];
                if(e.includes('error')){
                    console.log("error has been found");
                    aniControl.setStop();
                    descriptionLines.innerHTML += `<p>${this.descriptionLinesOfCurrentDisplayedElement[this.elementOfElementDisplayed]}</p>`;
                    updateScroll(descriptionLines.id);
                    throw Error('Stop pressed');
                }else{
                    descriptionLines.innerHTML += `<p>${this.descriptionLinesOfCurrentDisplayedElement[this.elementOfElementDisplayed]}</p>`;
                    updateScroll(descriptionLines.id);
                }
                if(e.includes("gefunden: Doppelpunkte")){
                    if(aniControl.start){
                        await sleepUntilNextStep();
                    }
                    this.pushNewSymbol(); 
                }
            }
            else if(this.elementOfElementDisplayed+1==this.descriptionLinesOfCurrentDisplayedElement.length){
                this.elementOfElementDisplayed+=1;
                let i = this.inputLines[this.elementDisplayed];
                if(i!=undefined &&i!=null){
                    if(this.inputLines[this.elementDisplayed].getEndAddr()!=""){
                        addresszahler.innerHTML= `${this.inputLines[this.elementDisplayed].getEndAddr()}`;
                        machinenbefehl.innerHTML= `${this.inputLineControl.getSpeicherAbbild(this.inputLines[this.elementDisplayed],false)}`;
                    }
                    
                    this.pushTranslation();
                    
                }
                descriptionLines.innerHTML += `<p> --------------------------------------------------------- </p>`;
                this.refreshInputListItems();
                updateScroll(descriptionLines.id);
            }
            else{
                await this.testPushing();
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

    public testPushing =async  () => {
        if(this.inputstrings.length>0){
            this.elementDisplayed+=1;
            this.translateInputString();
            
            if(this.inputLines.length>this.elementDisplayed){
                this.elementOfElementDisplayed =-1;
                currentLine.innerHTML=`<h2 style="align-self: end;" class=" noMargin p5px">${this.inputLines[this.elementDisplayed].commandLinetoString()}</h2>`;
                machinenbefehl.innerHTML="";
                this.descriptionLinesOfCurrentDisplayedElement=this.inputLines[this.elementDisplayed].getDescriptionLine();
            }
            else if(this.inputLines.length==this.elementDisplayed){
                if(aniControl.start){
                    this.toggleStop();
                }
                this.linkerAuflosungB=this.aufzulosendeLabel();
                await this.linkerAuflosung();
            }
            else{
                aniControl.setEnd();
                //this.elementDisplayed=-1;
                //this.testPushing();
            }
        }
    }
    public translateInputString=()=>{
        if(this.inputstrings.length>this.elementDisplayed){
            this.inputLineControl.addInputLine(this.inputstrings[this.elementDisplayed]);
            this.refreshInputLines();
        }
        console.log(this);
        console.log(aniControl);
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
            while(!aniControl.end){
                try{
                    await this.testCycling();
                    await sleepUntilNextStep();
                }
                catch(e){
                    console.log(e);
                    break;
                }
            }
        }
        else{
            console.log("no Input");
        }
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
    public skipToFinish=async()=>{
        if(this.inputstrings.length>0){
            await this.reset();
            while(this.inputLines.length>=this.elementDisplayed){
                try{
                    await this.testCycling();
                }
                catch(e){
                    console.log(e);
                    return;
                }
            }
            aniControl.setEnd();
        }
        else{
            console.log("no Input");
        }
        // console.log(this.iWindow);
    }


    public displayInputLines=()=>{        
        this.partialReset();
        this.refreshInputListItems();
        console.log(this);
    }
    setInputStrings(s:string[]){
        this.inputstrings=s;
    }
    getInputStrings():string[]{
        return this.inputstrings;
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