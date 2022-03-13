import { InputLineType } from "./Enums";
import { Manipulator } from "./Manipulator";
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
    private translation:string="";
    private description:string[]=[];

    private valid:boolean=false;
    private type:InputLineType=InputLineType.NOTTRANSLATED;

    constructor(init:string,id:number){
        this.initialLine=init.replace(/\s+/g,' ').trim();
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
        else this.length = Number(n);
    }
    setHCode(s:string){
        this.hCode=s;
    }
    setFirstPart(s:string){this.firstPart=s;}
    setSecondPart(s:string){
        /* if(this.firstPart=="RS"){
            this.secondPart=s;
        }
        if(Manipulator.isDat_8(s)){
            this.secondPart=s=Manipulator.formatHextoDat8(s);
        }
        else if(Manipulator.isDat_16(s)){
            this.secondPart=s=Manipulator.formatHextoDat16(s);
        }
        else{
            this.secondPart=s;
        } */
        this.secondPart=s;
    }
    getEndAddr():string{
        if(this.firstPart.toUpperCase()=="ORG"){
            return Manipulator.formatHextoDat16(String(this.length));
        }
        if(this.startingAddr!=""){
           return Manipulator.formatHextoDat16(String(Manipulator.hexToDec(this.startingAddr)+this.length));
        }
        else return "";
    }
    setThirdPart(s:string){
        /* if(Manipulator.isDat_8(s)){
            this.thirdPart=Manipulator.formatHextoDat8(s);
        }
        else if(Manipulator.isDat_16(s)){
            this.thirdPart=Manipulator.formatHextoDat16(s);
        }
        else{
            this.thirdPart=s;
        } */
        this.thirdPart=s;
    }
    setRest(s:string){
        this.rest=s;
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
        let s=Manipulator.splitStringHalf(this.initialLine,":");
        if(s.length>1){
            this.label=s[0];
        }
        let ss=Manipulator.splitStringHalf(this.initialLine,";");
        let addr:string = this.initialLine.replace(s[0]+':','').replace(';'+ss[1],'');
        if(ss[1]!=undefined){
            this.commentary=ss[1];
        }
        return addr.trim();
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
            if(this.secondPart.toUpperCase()=="EQU"){
                this.secondPart=this.secondPart.toUpperCase();
            }
            else{
                temp = Manipulator.splitStringHalf(this.secondPart," ");
                this.firstPart=this.firstPart.toUpperCase();
                if(!SymbolL.isLabel(this.secondPart) && !SymbolL.isConst(this.secondPart) && !Manipulator.isDat_16(this.secondPart)&&!(temp[0].toUpperCase()=="OFFSET")){
                    this.secondPart=this.secondPart.toUpperCase();
                }else if(this.hasOffsetLabel()){
                    if(temp[0].toUpperCase()=="OFFSET"){
                        this.secondPart="OFFSET "+temp[1];
                    }
                }
                else if(this.secondPart!=""){
                    if(Manipulator.isDat_8(this.secondPart)){
                        this.secondPart=Manipulator.formatHextoDat8(this.secondPart);
                    }
                    else if(Manipulator.isDat_16(this.secondPart)){
                        this.secondPart=Manipulator.formatHextoDat16(this.secondPart);
                    }
                }
                temp = Manipulator.splitStringHalf(this.thirdPart," ");
                if(!SymbolL.isLabel(this.thirdPart) && !SymbolL.isConst(this.thirdPart) && !Manipulator.isDat_16(this.thirdPart) &&!(temp[0].toUpperCase()=="OFFSET")){
                    this.thirdPart=this.thirdPart.toUpperCase();
                }
                else if(this.hasOffsetLabel()){
                    if(temp[0].toUpperCase()=="OFFSET"){
                        this.thirdPart="OFFSET "+temp[1];
                    }
                }
                else if(this.thirdPart!=""){

                    if(Manipulator.isDat_8(this.thirdPart)){
                        this.thirdPart=Manipulator.formatHextoDat8(this.thirdPart);
                    }
                    else if(Manipulator.isDat_16(this.thirdPart)){
                        this.thirdPart=Manipulator.formatHextoDat16(this.thirdPart);
                    }
                }
            }
        }
    }
    getCommandLineToCurrentLine(){
        let dsrl="";
        if(this.label!=""){
            dsrl+=`<span id="crLabel">${this.label}</span>: `;
        }
        if(this.firstPart!=""){
            dsrl+=`<span id="crFirst">${this.firstPart}</span> `;
        }
        if(this.secondPart!="" && this.secondPart.toUpperCase()=="EQU"){
            dsrl+=`<span id="crSecond">${this.secondPart}</span> `;
        }
        else if(this.secondPart!="" && this.secondPart.toUpperCase()!="EQU" && this.thirdPart==""){
            dsrl+=`<span id="crSecond">${this.secondPart}</span> `;
        }
        else if(this.secondPart!=""){
            dsrl+=`<span id="crSecond">${this.secondPart}</span>,`;
        }
        if(this.thirdPart!=""){
            dsrl+=`<span id="crThird">${this.thirdPart}</span>`;
        }
        if(this.error!=""){
            dsrl+=`<span id="crError">${this.error}</span>`;
        }
        if(this.rest!=""){
            dsrl+=`<span id="crRest">${this.rest}</span>`;
        }
        return dsrl;
    }

    getAllV():number[]{
        return [this.label!=""?1:0, this.firstPart!=""?1:0, this.secondPart!=""?1:0, this.thirdPart!=""?1:0, this.error!=""?1:0, this.rest!=""?1:0];
    }
    commandLinetoString=(b:boolean):string=>{
        let first:string=this.firstPart,second:string=this.secondPart,third:string=this.thirdPart;
        let temp:string[];

        if(this.valid==true){
            if(b){
                if(second.toUpperCase()=="EQU"){
                    second=second.toUpperCase();
                }
                else{
                    first=first.toUpperCase();
                    temp = Manipulator.splitStringHalf(second," ");
                    if(!SymbolL.isLabel(second) && !SymbolL.isConst(second) && !Manipulator.isDat_16(second) &&!(temp[0].toUpperCase()=="OFFSET")){
                        second=second.toUpperCase();
                    }
                    if(this.hasOffsetLabel()){
                        if(temp[0].toUpperCase()=="OFFSET"){
                            second="OFFSET "+temp[1];
                        }
                    }
                    else if(second !=""){
                        if(Manipulator.isDat_8(second)){
                            second=Manipulator.formatHextoDat8(second);
                        }
                        else if(Manipulator.isDat_16(second)){
                            second=Manipulator.formatHextoDat16(second);
                        }
                    }
                    temp = Manipulator.splitStringHalf(third," ");
                    if(!SymbolL.isLabel(third) && !SymbolL.isConst(third) && !Manipulator.isDat_16(third) &&!(temp[0].toUpperCase()=="OFFSET")){
                        third=third.toUpperCase();
                    }
                    else if(this.hasOffsetLabel()){
                        if(temp[0].toUpperCase()=="OFFSET"){
                            third="OFFSET "+temp[1];
                        }
                    }
                    else if(third !=""){
                        if(Manipulator.isDat_8(third)){
                            third=Manipulator.formatHextoDat8(third);
                        }
                        else if(Manipulator.isDat_16(third)){
                            third=Manipulator.formatHextoDat16(third);
                        }
                    }
                }
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
}