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
    preemptiveValidation(){
        if(this.commandLine==""){
            this.valid=true;
            this.type=InputLineType.EMPTY;
        }
    }
    setError(s:string){
        this.error=s;
    }
    getError():string{
        return this.error;
    }
    setStartingAddr(addr:string){this.startingAddr=addr;}
    setLength(n:number|string){
        if(Manipulator.isHex(String(n))){
            this.length=Manipulator.hexToDec(String(n));
        }
        else this.length = Number(n);
    }
    setHCode(addr:string){
        this.hCode=addr;
    }
    setFirstPart(addr:string){this.firstPart=addr;}
    setSecondPart(addr:string){
        if(this.firstPart=="RS"){
            this.secondPart=addr;
        }
        if(Manipulator.isDat_8(addr)){
            this.secondPart=addr=Manipulator.formatHextoDat8(addr);
        }
        else if(Manipulator.isDat_16(addr)){
            this.secondPart=addr=Manipulator.formatHextoDat16(addr);
        }
        else{
            this.secondPart=addr=addr;
        }
    }
    getEndAddr():string{
        if(this.startingAddr!=""){
           return Manipulator.formatHextoDat16(String(Manipulator.hexToDec(this.startingAddr)+this.length));
        }
        if(this.firstPart=="ORG"){
            return Manipulator.formatHextoDat16(String(this.length));
        }
        else return "";
    }
    setThirdPart(addr:string){
        if(Manipulator.isDat_8(addr)){
            this.thirdPart=Manipulator.formatHextoDat8(addr);
        }
        else if(Manipulator.isDat_16(addr)){
            this.thirdPart=Manipulator.formatHextoDat16(addr);
        }
        else{
            this.thirdPart=addr;
        }
    }
    getRest():string{
        return this.rest;
    }
    setRest(s:string){
        this.rest=s;
    }
    
    setValid(b:boolean){this.valid=b;}
    setType(t:InputLineType){this.type=t;}
    saveDescriptionLine(addr:string){
        this.description.push(addr);
    }
    setDescriptionLine=(addr:string[])=>{
        this.description=addr;
    }
    setTranslation=(addr:string)=>{
        this.translation=addr;
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
    /* changeNumType(addr:string):string{
        if(Manipulator.isDec(addr)||Manipulator.isHex(addr)){
            return Manipulator.formatHex(addr);
        }
        else return addr;
    } */
    getLabel=()=>{
        return this.label;
    }
    getFirstPart=()=>{ return this.firstPart;}
    getSecondPart=()=>{return this.secondPart;}
    getThirdPart=()=>{return this.thirdPart;}
    getCommandLine=()=>{return this.commandLine;}
    getCommentary=()=>{
        return this.commentary;
    }
    getValid=()=>{return this.valid;}
    getType=()=>{return this.type;}
    setLabel=():string=>{
        if(this.initialLine.includes(':')){
            let addr:string= Manipulator.splitStringHalf(this.initialLine,':')[0]
            /* console.log(addr); */
            if(addr.length<0){
                return "";
            }
            else{
                return addr;
            }
        }
        else return "";
    }

    setCommentary=():string=>{
        if(this.initialLine.includes(';')){
            let addr:string= Manipulator.splitStringHalf(this.initialLine,';')[1];
            /* console.log(addr); */
            if(addr.length<0){
                return "";
            }
            else{
                return addr;
            }
        }
        else return "";
    }
    setComment=(s:string)=>{
        this.commentary =s;
    }
    setLabelTo=(s:string)=>{
        this.label =s;
    }
    setCommandLine=():string=>{
        let s=Manipulator.splitStringHalf(this.initialLine,":");
        let ss=Manipulator.splitStringHalf(this.initialLine,";");
        let addr:string = this.initialLine.replace(s[0]+':','').replace(';'+ss[1],'');
        if(ss[1]!=undefined){
            this.commentary=ss[1];
        }
        return addr.trim();
    }
    formatInputToDisplay(){
        if(this.valid){
            if(this.secondPart.toUpperCase()=="EQU"){
                this.secondPart=this.secondPart.toUpperCase();
            }
            else{
                this.firstPart=this.firstPart.toUpperCase();
                if(!SymbolL.isLabel(this.secondPart) && !SymbolL.isConst(this.secondPart) && !Manipulator.isDat_16(this.secondPart)){
                    this.secondPart=this.secondPart.toUpperCase();
                }else if(this.secondPart!=""){
                    if(Manipulator.isDat_8(this.secondPart)){
                        this.secondPart=Manipulator.formatHextoDat8(this.secondPart);
                    }
                    else if(Manipulator.isDat_16(this.secondPart)){
                        this.secondPart=Manipulator.formatHextoDat16(this.secondPart);
                    }
                }
                if(!SymbolL.isLabel(this.thirdPart) && !SymbolL.isConst(this.thirdPart) && !Manipulator.isDat_16(this.thirdPart)){
                    this.thirdPart=this.thirdPart.toUpperCase();
                }if(this.thirdPart!=""){

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

    getAll():string[]{
        return [this.label,this.firstPart,this.secondPart,this.thirdPart,this.error,this.rest];
    }
    getAllV():number[]{
        return [this.label!=""?1:0, this.firstPart!=""?1:0, this.secondPart!=""?1:0, this.thirdPart!=""?1:0, this.error!=""?1:0, this.rest!=""?1:0];
    }
    commandLinetoString=(b:boolean):string=>{
        let first:string=this.firstPart,second:string=this.secondPart,third:string=this.thirdPart;

        if(this.valid==true){
            if(b){
                if(second.toUpperCase()=="EQU"){
                    second=second.toUpperCase();
                }
                else{
                    first=first.toUpperCase();
                    if(!SymbolL.isLabel(second) && !SymbolL.isConst(second) && !Manipulator.isDat_16(second)){
                        second=second.toUpperCase();
                    }
                    else if(second !=""){
                        if(Manipulator.isDat_8(second)){
                            second=Manipulator.formatHextoDat8(second);
                        }
                        else if(Manipulator.isDat_16(second)){
                            second=Manipulator.formatHextoDat16(second);
                        }
                    }
                    if(!SymbolL.isLabel(third) && !SymbolL.isConst(third) && !Manipulator.isDat_16(third)){
                        third=third.toUpperCase();
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