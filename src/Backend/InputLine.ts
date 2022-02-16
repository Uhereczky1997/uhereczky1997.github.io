import { InputLineType } from "./Enums";
import { Manipulator } from "./Manipulator";

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

        /* this.label=this.label.trim();
        this.commentary=this.commentary.trim(); */
        return addr.trim();
    }
    /* commandLineToCurrentLine=():string=>{
        if(this.valid){
            if(this.secondPart.toUpperCase()=="EQU"){
                this.secondPart = "EQU";
                return(`${this.firstPart} ${this.secondPart} ${this.thirdPart}`);
            }
            else{
                return (`${(this.firstPart==""?"":this.firstPart)} ${(this.secondPart==""?"":this.secondPart)}${(this.thirdPart==""?"":', '+this.thirdPart)}`);
            }
        }
        else{

        }
    } */
    getAll():string[]{
        return [this.label,this.firstPart,this.secondPart,this.thirdPart,this.error,this.rest];
    }
    getAllV():number[]{
        return [this.label!=""?1:0,this.firstPart!=""?1:0,this.secondPart!=""?1:0,this.thirdPart!=""?1:0,this.error!=""?1:0,this.rest!=""?1:0];
    }
    commandLinetoString=():string=>{
        if(this.valid==true){
            if(this.secondPart.toUpperCase()=="EQU"){
                this.secondPart = "EQU";
                return(`${this.firstPart} ${this.secondPart} ${this.thirdPart}`);
            }
            else{
                return (`${(this.firstPart==""?"":this.firstPart)} ${(this.secondPart==""?"":this.secondPart)}${(this.thirdPart==""?"":', '+this.thirdPart)}`);
            }
        }
        else{
            return this.commandLine;
        }
    }
    hasLabel=():boolean=>{
        return this.label !="";
    }
    inputLineToString=():string=>{
        if(this.hasLabel()){
            return ((this.label==""?"":this.label+':')+"\t"+this.commandLinetoString()+(this.commentary==""?"":';'+this.commentary));
        }
        else{
            return ("\t\t"+this.commandLinetoString()+(this.commentary==""?"":';'+this.commentary));
        }
        
    }

    testToString=()=>{
        return (`${this.label==""?"":this.label+'\n'}${(this.firstPart==""?"":this.firstPart)} ${(this.secondPart==""?"":this.secondPart)}${(this.thirdPart==""?"":','+this.thirdPart)}${this.commentary==""?"":'\n'+this.commentary}`);
    }

}