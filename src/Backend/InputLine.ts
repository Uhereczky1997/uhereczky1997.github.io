import { InputLineType } from "./Enums";
import { erlaubteLängeL_C, Manipulator } from "./Manipulator";
import { SymbolL } from "./SymbolList";

export class InputLine{
    private startingAddr:string="";
    private length:number=-1;
    private id:number=-1;
    private hCode:string="";

    private initialLine:string="";
    private commandLine:string="";
    private firstPart:string="";
    private secondPart:string="";
    private thirdPart:string="";
    private error:string="";
    private rest:string="";
    private commentary:string="";
    private label:string="";
    private offsetLabel:boolean=false;
    private errorBool:boolean=false;
    private translation:string="";
    private description:string[]=[];

    private valid:boolean=false;
    private type:InputLineType=InputLineType.NOTTRANSLATED;

    constructor(init:string,id:number){
        this.initialLine=init.replace(/\s{3,}/g,' ');
        this.id=id;
        this.commandLine=this.setCommandLine();
        this.preemptiveValidation();
    }
    getCommandline():string{
        return this.commandLine;
    }
    preemptiveValidation(){
        if(this.commandLine=="" && this.label==""){
            this.valid=true;
            this.type=InputLineType.EMPTY;
        }
        else if(this.commandLine==""&& this.label!=""){
            this.type=InputLineType.PSEUDOTRANSLATED;
        }
    }
    setError(s:string){
        this.errorBool=true;
        this.error=s;
    }
    hasOffsetLabel():boolean{
        return this.offsetLabel;
    }
    setOffsetLabel(b:boolean){
        this.offsetLabel=b
    }
    setStartingAddr(s:string){this.startingAddr=s;}
    setLength(n:number|string){
        if(Manipulator.isHex(String(n))){
            this.length=Manipulator.hexToDec(String(n));
        }
        else if(Manipulator.isBin(String(n))){
            this.length =Manipulator.binToDec(String(n));
        }
        else this.length = Number(n);
    }
    setHCode(s:string){
        this.hCode=s;
    }
    setFirstPart(s:string){this.firstPart=s;}
    setSecondPart(s:string){
        this.secondPart=s;
    }
    getEndAddr():string{
        if(this.firstPart.toUpperCase()=="ORG"){
            return Manipulator.formatHextoDat16(String(this.length)); // DecOrHex
            // return String(this.length);
        }
        if(this.startingAddr!=""){
           return String(Manipulator.hexToDec(this.startingAddr)+this.length);
        }
        else return "";
    }
    setThirdPart(s:string){
        this.thirdPart=s;
    }
    setRest(s:string){
        this.rest=s;
    }
    getLabelorUndefined():string|undefined{
        if(this.label != "" && this.label.length > erlaubteLängeL_C ){
            return this.label;
        }
        if(this.offsetLabel && this.getLabelOfOffset().length > erlaubteLängeL_C){
            return this.getLabelOfOffset();
        }
        if(SymbolL.isLabel(this.firstPart) && this.firstPart.length > erlaubteLängeL_C ){
            return this.firstPart;
        }
        if(SymbolL.isLabel(this.secondPart) && this.secondPart.length > erlaubteLängeL_C){
            return this.secondPart;
        }
        if(SymbolL.isLabel(this.thirdPart) && this.thirdPart.length > erlaubteLängeL_C){
            return this.thirdPart;
        }
        return undefined;
    }
    getConstorUndefined():string|undefined{
        if(SymbolL.isConst(this.firstPart) && this.firstPart.length > erlaubteLängeL_C){
            return this.firstPart;
        }
        if(SymbolL.isConst(this.secondPart) && this.secondPart.length > erlaubteLängeL_C){
            return this.secondPart;
        }
        if(SymbolL.isConst(this.thirdPart) && this.thirdPart.length > erlaubteLängeL_C){
            return this.thirdPart;
        }
        return undefined;
    }
    getError():string{
        return this.error;
    }
    getErrorLine():string{
        let toReturn:string|undefined = this.description.find(e => e.includes("error:"))
        return toReturn!=undefined?toReturn:"";
    }
    setValid(b:boolean){this.valid=b;}
    setType(t:InputLineType){this.type=t;}
    saveDescriptionLine(s:string){
        this.description.push(s);
    }
    setTranslation=(s:string)=>{
        this.translation=s;
    }
    getTranslation=():string=>{
        return this.translation;
    }
    getInitialLine():string{
        return this.initialLine;
    }
    getDescriptionLine=():string[]=>{
        return this.description;
    }
    getStartingAddr=()=>{return this.startingAddr;}
    getLength=()=>{return this.length;}
    getHCode=():string=>{
        return this.hCode;
    }
    getId=()=>{return this.id;}
    getLabel=()=>{
        return this.label;
    }
    getFirstPart=()=>{ return this.firstPart;}
    getSecondPart=()=>{return this.secondPart;}
    getThirdPart=()=>{return this.thirdPart;}
    getCommentary=()=>{
        return this.commentary;
    }
    getValid=()=>{return this.valid;}
    getType=()=>{return this.type;}
    setComment=(s:string)=>{
        this.commentary =s;
    }
    setLabelTo=(s:string)=>{
        this.label =s;
    }
    setCommandLine=():string=>{
        if(this.initialLine.trim()=="" || this.initialLine.trim()==" "){
            return "";
        }
        let ss=Manipulator.splitStringHalf(this.initialLine,";");
        let s1:string = this.initialLine.replace(';'+ss[1],'');
        if(ss[1]!=undefined){
            this.commentary=ss[1];
        }
        let s=Manipulator.splitStringHalf(s1,":");
        if(s.length>1){
            this.label=s[0];
        }
        s1 = s1.replace(s[0]+":","");
        return s1.trim();
    }
    getLabelOfOffset():string{
        if(this.offsetLabel){
            if(this.secondPart.toUpperCase().startsWith("OFFSET")){
                return Manipulator.splitStringHalf(this.secondPart," ")[1];
            }
            if(this.thirdPart.toUpperCase().startsWith("OFFSET")){
                return Manipulator.splitStringHalf(this.thirdPart," ")[1];
            }
        }
        return "";
    }
    formatInputToDisplay(){
        let temp:string[];
        if(this.valid){
            temp = this.formatpartsToDisplay(this.firstPart,this.secondPart,this.thirdPart)
            this.firstPart=temp[0];
            this.secondPart=temp[1];
            this.thirdPart=temp[2];
        }
    }
    getCommandLineToCurrentLine(){
    
        let dsrl=this.initialLine.split(";")[0];
        let ss = [];
        let temp:string[]=[];
        if(this.label!=""){
            // temp =dsrl.split(this.label);
            temp =Manipulator.sliceString(dsrl,this.label);
            ss.push(temp[0]);
            ss.push(`<span id="crLabel">${this.label}</span>`);
            dsrl =temp[1];
        }
        if(this.firstPart!=""){
            // temp =dsrl.split(this.firstPart)
            temp =Manipulator.sliceString(dsrl,this.firstPart)
            ss.push(temp[0]);
            ss.push(`<span id="crFirst">${this.firstPart}</span>`);
            dsrl =temp[1];
        }
        if(this.secondPart!=""){
            // console.log("dsrl : "+dsrl);
            // temp =dsrl.split(this.secondPart,2)
            temp =Manipulator.sliceString(dsrl,this.secondPart)
            // console.log("SECOND:")
            // console.log(Manipulator.sliceString(dsrl,this.secondPart));
            ss.push(temp[0]);
            ss.push(`<span id="crSecond">${this.secondPart}</span>`);
            dsrl =temp[1];
        }
        if(this.thirdPart!=""){
            // temp =dsrl.split(this.thirdPart)
            temp =Manipulator.sliceString(dsrl,this.thirdPart)
            ss.push(dsrl.split(this.thirdPart)[0]);
            // console.log("THIRD:")
            // console.log(Manipulator.sliceString(dsrl,this.thirdPart));

            ss.push(`<span id="crThird">${this.thirdPart}</span>`);
            dsrl =temp[1];
        }
        if(this.error!=""){
            // temp =dsrl.split(this.error)
            temp =Manipulator.sliceString(dsrl,this.error)
            ss.push(dsrl.split(this.error)[0]);
            ss.push(`<span id="crError">${this.error}</span>`);
            dsrl =temp[1];
        }
        ss.push(dsrl);
        /* if(this.rest!=""){
            dsrl+=`<span id="crRest">${this.rest}</span>`;
        } */
        // console.log(ss);
        return ss.join("");
    }

    getAllV():number[]{
        return [this.label!=""?1:0, this.firstPart!=""?1:0, this.secondPart!=""?1:0, this.thirdPart!=""?1:0, (this.error!=""||this.errorBool)?1:0, this.rest!=""?1:0];
    }

    commandLinetoString=(b:boolean):string=>{
        let first:string=this.firstPart,second:string=this.secondPart,third:string=this.thirdPart;
        let temp:string[];

        if(this.valid==true){
            if(b){
                temp = this.formatpartsToDisplay(first,second,third);
                first = temp[0];
                second = temp[1];
                third = temp[2];
            }
            if(second.toUpperCase()=="EQU"){
                // this.secondPart = "EQU";
                return(`${first} ${second} ${third}`);
            }
            else{
                return (`${first} ${second}${(third==""?"":','+third)}`);
            }
        }
        else{
            return this.commandLine;
        }
    }
    hasLabel=():boolean=>{
        return this.label !="";
    }

    formatpartsToDisplay(first:string,second:string,third:string):string[]{
        let temp:string[];
        if(second.toUpperCase()=="EQU"){
            second=second.toUpperCase();
        }
        /* else if(["DW","ORG"].includes(first.toUpperCase())){
            if(SymbolL
            second = Manipulator.formatHextoDat16(second);
        } */
        else{
            first=first.toUpperCase();
            temp = Manipulator.splitStringHalf(second," ");
            if(!SymbolL.isLabel(second) && !SymbolL.isConst(second) && !Manipulator.isDat_16(second) &&!(temp[0].toUpperCase()=="OFFSET" )){
                second=second.toUpperCase();
            }
            if(this.hasOffsetLabel()){
                second="OFFSET "+this.getLabelOfOffset();
            }
            else if(second !=""){
                if(Manipulator.isDat_8(second)){
                    second=second; // DecOrHex
                    // second=Manipulator.formatHextoDat8(second); 
                }
                else if(Manipulator.isDat_16(second)){
                    second=second;// DecOrHex
                    // second=Manipulator.formatHextoDat16(second);
                }
            }
            temp = Manipulator.splitStringHalf(third," ");
            if(!SymbolL.isLabel(third) && !SymbolL.isConst(third) && !Manipulator.isDat_16(third) &&!(temp[0].toUpperCase()=="OFFSET")){
                third=third.toUpperCase();
            }
            else if(this.hasOffsetLabel()){
                third="OFFSET "+this.getLabelOfOffset();
            }
            else if(third !=""){
                if(Manipulator.isDat_8(third)&&this.length<3){
                    // third=Manipulator.formatHextoDat8(third); 
                    third=third; // DecOrHex
                }
                else if(Manipulator.isDat_16(third)){
                    // third=Manipulator.formatHextoDat16(third);
                    third=third; // DecOrHex
                }
            }
            
        }
        
        return [first,second,third];
    }
    
}