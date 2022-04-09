import { InputLine } from "./InputLine";
import { SymbolList } from "./SymbolList";
import { CommandMap, saveInput } from "./CommandMap";
import { InputLineType, DataType } from "./Enums";
import { Manipulator } from "./Manipulator";
import { Constant } from "./Constant";
import { Label } from "./Label";

export class InputLineControl{
    private static instance:InputLineControl;
    private inputstrings:string[] =[];
    private inputlines:InputLine[]=[];
    private symbolliste:SymbolList=SymbolList.getInstance();
    private map:CommandMap= CommandMap.getInstance();
    private IDcounter:number =0;
    private translatedIDs:number[]=[];
    private invalidIDs:number[]=[];
    private startingAddrOfTranslated:number=0;
    private constructor(){}

    public static getInstance(){
        if(!InputLineControl.instance){
            InputLineControl.instance = new InputLineControl();
        }
        return InputLineControl.instance;
    }
    hasInvalid=():boolean=>{
        if(this.invalidIDs.length==0){
            return false;
        }
        else return true;
    }

    getInvalidIDs=():number[]=>{
        return this.invalidIDs;
    }

    getInvalidInputLines=():InputLine[]=>{
        let invalidInputllines:InputLine[]=[];
        this.inputlines.forEach(e=>{
            if(this.invalidIDs.includes(e.getId())){
                invalidInputllines.push(e);
            }
        })
        return invalidInputllines;
    }

    reset=():void=>{
        this.IDcounter=0;
        this.startingAddrOfTranslated=0;
        this.inputlines=[];
        this.translatedIDs=[];
        this.invalidIDs=[];
        this.symbolliste.empty();
    }

    setInputStrings(s:string[]){
        this.inputstrings=s;
    }

    getInputStrings():string[]{
        return this.inputstrings;
    }

    addInputLines=(inputStrings:string[]):void=>{
        this.reset();
        inputStrings.forEach(e=>{
            this.addInputLine(e);
        });
    }

    addInputLine=(inputString:string):void=>{
        let i:InputLine= new InputLine(inputString,this.IDcounter);
        if(i.getType()==InputLineType.EMPTY){
            this.inputlines.push(i);
            this.IDcounter=this.IDcounter +1;
            return;
        }
        else if(i.getType()==InputLineType.PSEUDOTRANSLATED){
            this.map.mapInputLineByCase(i);
            this.inputlines.push(i);
            if(i.getValid()){ // UPDATE FOR ORG?????
                // console.log(this.fHD16(String(this.startingAddrOfTranslated)));
                i.setStartingAddr(this.fHD16(String(this.startingAddrOfTranslated)));
                /* if(this.startingAddrOfTranslated==0){
                    i.setStartingAddr('0000h');
                }
                else{
                } */
                // i.setStartingAddr(this.fHD16(String(this.startingAddrOfTranslated)));
                this.symbolliste.updateLabel(i.getLabel(),i.getStartingAddr());
            }
            else{
                if(i.getLabel()!=""){
                    this.symbolliste.removeLabel(i.getLabel());
                }
                this.invalidIDs.push(this.IDcounter);
            }
            this.IDcounter=this.IDcounter +1;
            return;
        }
        this.map.mapInputLineByCase(i);
        this.createSummary(i);
        this.inputlines.push(i);
        console.log(i);
        if(i.getValid()){
            this.calculateStartingAddr(i);
            this.calculateTranslation(i,false);
            if(i.hasLabel()){
                this.symbolliste.updateLabel(i.getLabel(),i.getStartingAddr());
            }
        }
        else{
            /* if(i.getLabel()!=""){
                this.symbolliste.removeLabel(i.getLabel());
            } */
            this.calculateStartingAddr(i);
            if(i.hasLabel()){
                this.symbolliste.updateLabel(i.getLabel(),i.getStartingAddr());
            }
            this.invalidIDs.push(this.IDcounter);
        }
        this.IDcounter=this.IDcounter +1;
        // console.log(i);
    }

    getLittleEndianOf(h:string):string{
        return Manipulator.splitDat16InDat8(h).join("");
    }

    checkTranslationForUnknownLabel(i:InputLine){
        if(i.getType()==InputLineType.TRANSLATED){
            if(i.getTranslation().includes("????")){
                return true;
            }
        }
        return false;
    }

    fHD16(h:string){
        return Manipulator.formatHextoDat16(h);
    }

    fHD16WH(h:string){
        return Manipulator.formatHextoDat16WithoutH(h);
    }

    fHD8(h:string){
        return Manipulator.formatHextoDat8(h);
    }

    fHD8WH(h:string){
        return Manipulator.formatHextoDat8WithoutH(h);
    }

    retranslate(i:InputLine){
        this.calculateTranslation(i,true);
    }

    getDisplayableSpeicherabbild(i:InputLine,flag:boolean):string{
        let s:string =this.getSpeicherAbbild(i,flag);
        if(i.getFirstPart().toUpperCase() == "RS"){
            return s;
        }
        let toReturn:string="";
        for(let j = 0; j<s.length;j++){
            if(j!=0 && (j % 2) == 0){
                toReturn =toReturn.concat(" ");
            }
            toReturn = toReturn.concat(s[j]);
        }
        return toReturn;
    }

    getSpeicherAbbild(i:InputLine,flag:boolean):string{
        let s = i.commandLinetoString(true);
        let h = i.getHCode();
        let l:string|undefined = "";
        // console.log(i.getCommandLine()+" ... "+i.getLength()+" ... "+i.getHCode());
        if(i.getFirstPart().toUpperCase()=="RS"){
            // return "00 ... ("+i.getLength()+"x)";
            return (h.length>4?"00 ... ("+i.getLength()+"x)":h);
        }
        else if(i.getFirstPart().toUpperCase()=="ORG"){
            return "";
        }
        else if(i.getFirstPart().toUpperCase()=='DB'){
            h=i.getSecondPart();
            return `${this.fHD8WH(h)}`;
        }
        else if(i.getFirstPart().toUpperCase()=='DW'){
            if(i.hasOffsetLabel()){
                return ((this.symbolliste.getPositionOfSpecificLabel(i.getLabelOfOffset())==undefined ||!flag)?"????":this.getLittleEndianOf(this.symbolliste.getPositionOfSpecificLabel(i.getLabelOfOffset())!));
            }  
            else h=i.getSecondPart();
            return this.getLittleEndianOf(h);
        }
        else{
            switch(i.getLength()){
                case 1:
                    return this.fHD8WH(h);
                    break;
                case 2:
                    if(Manipulator.isDat_8(i.getSecondPart())){
                        return this.fHD8WH(h)+this.fHD8WH(i.getSecondPart());
                    }
                    else if(this.symbolliste.isConst(i.getSecondPart())){
                        l = this.symbolliste.getSpecificConstantByName(i.getSecondPart())!.getValue();
                        return this.fHD8WH(h)+this.fHD8WH(l);
                    }
                    else if(Manipulator.isDat_8(i.getThirdPart())){
                        return this.fHD8WH(h)+this.fHD8WH(i.getThirdPart());
                    }
                    else if(this.symbolliste.isConst(i.getThirdPart())){
                        l = this.symbolliste.getSpecificConstantByName(i.getThirdPart())!.getValue();
                        return this.fHD8WH(h)+this.fHD8WH(l);
                    }
                    else{
                        return this.fHD16WH(h);
                    }
                    break;
                case 3:
                    if(this.symbolliste.isLabel(i.getSecondPart())){
                        l = this.symbolliste.getPositionOfSpecificLabel(i.getSecondPart());
                        return this.fHD8WH(h)+(l!=undefined&&flag?this.getLittleEndianOf(l):"????");
                    }
                    else if(this.symbolliste.isLabel(i.getThirdPart())){
                        l = this.symbolliste.getPositionOfSpecificLabel(i.getThirdPart());
                        return this.fHD8WH(h)+(l!=undefined&&flag?this.getLittleEndianOf(l):"????");
                    }
                    else if(this.symbolliste.isConst(i.getThirdPart())){
                        l= this.symbolliste.getSpecificConstantByName(i.getThirdPart())?.getValue();
                        return this.fHD8WH(h)+(l!=undefined?this.getLittleEndianOf(l):l);
                    }
                    else if(i.hasOffsetLabel()){
                        l = this.symbolliste.getPositionOfSpecificLabel(i.getLabelOfOffset());
                        return this.fHD8WH(h)+(l!=undefined&&flag?this.getLittleEndianOf(l):"????");
                    }
                    else {
                        return this.fHD8WH(h)+this.getLittleEndianOf(i.getThirdPart());
                    }
                    break;
                case 4:
                    if(this.symbolliste.isConst(i.getThirdPart())){
                        l= this.symbolliste.getSpecificConstantByName(i.getThirdPart())?.getValue();
                        return this.fHD16WH(h)+(l!=undefined?this.getLittleEndianOf(l):l);
                    }
                    else if(this.symbolliste.isLabel(i.getSecondPart())){
                        l = this.symbolliste.getPositionOfSpecificLabel(i.getSecondPart());
                        return this.fHD16WH(h)+(l!=undefined&&flag?this.getLittleEndianOf(l):"????");
                    }
                    else if(this.symbolliste.isLabel(i.getThirdPart())){
                        l = this.symbolliste.getPositionOfSpecificLabel(i.getThirdPart());
                        return this.fHD16WH(h)+(l!=undefined&&flag?this.getLittleEndianOf(l):"????");
                    }
                    else if(i.hasOffsetLabel()){
                        l = this.symbolliste.getPositionOfSpecificLabel(i.getLabelOfOffset());
                        return this.fHD16WH(h)+(l!=undefined&&flag?this.getLittleEndianOf(l):"????");
                    }
                    else {
                        return this.fHD16WH(h)+this.getLittleEndianOf(i.getThirdPart());
                    }
                default:
                    break;
            }
            return "";
        }
    }

    createSummary(i:InputLine){
        let s = i.commandLinetoString(true);
        let h = i.getHCode()
        let l:string|undefined = "";
        let c:Constant;
        if(i.getFirstPart().toUpperCase()=="ORG"){
            saveInput(i,5);
            i.saveDescriptionLine(`<span class="eingeruckt">"Addresszähler = <span id="addressbyte${i.getId()}">`+this.fHD16WH(String(i.getLength()))+`</span></span>`);
        }
        else if(i.getType()==InputLineType.TRANSLATED){
            saveInput(i,5);
            if(i.getFirstPart().toUpperCase()=="RS"){
                i.saveDescriptionLine(`<span class="eingeruckt">`+s+" -> "+(h.length>4?"00 ("+i.getLength()+"x)":h)+`</span>`);
                i.saveDescriptionLine(`<span class="eingeruckt">Anzahl der Bytes: <span id="addressbyte${i.getId()}">`+i.getLength()+`</span></span>`);
                i.saveDescriptionLine(`<span class="eingeruckt">Erhöhe Adresszähler</span>`);
            }
            else
            {
                i.saveDescriptionLine(`<span class="eingeruckt">`+s+" -> "+this.getDisplayableSpeicherabbild(i,false)+`</span>`);
                i.saveDescriptionLine(`<span class="eingeruckt">Anzahl der Bytes: <span id="addressbyte${i.getId()}">`+i.getLength()+`</span></span>`);
                i.saveDescriptionLine(`<span class="eingeruckt">Erhöhe Adresszähler</span>`);

            }
        }
    }

    calculateStartingAddr=(i:InputLine):void=>{
        let e= (i!=null?i:this.inputlines[this.IDcounter]);
        if(e.getValid()!=true){
            e.setStartingAddr(this.fHD16(String(this.startingAddrOfTranslated)));
            return;
        }
        
        if(e.getType()==InputLineType.TRANSLATED){  
            e.setStartingAddr(this.fHD16(String(this.startingAddrOfTranslated)));
            
            this.translatedIDs.push(this.IDcounter);
            this.startingAddrOfTranslated= this.startingAddrOfTranslated+e.getLength();
            return;
        }
        if(e.getFirstPart().toUpperCase()=='ORG'){
            e.setStartingAddr(this.fHD16(String(this.startingAddrOfTranslated)));
            this.startingAddrOfTranslated=e.getLength();
            return;
        }
       
    }

    calculateRest=(...addr:string[]):string=>{
        let n=0;
        let rest:string[];
        let newS=addr;
        addr.forEach(e=>{
            if(e=="????"||undefined||""){
            }
            else if(Manipulator.isHex(e)){
                if(Manipulator.isDat_8(e)){
                    n=n-Manipulator.hexToDec(e);
                }
                else{
                    rest=Manipulator.splitDat16InDat8(e);
                    n=n-Manipulator.hexToDec(rest[0]);
                    n=n-Manipulator.hexToDec(rest[1]);
                }
            }
            else{
                n=n-Number(e);
            }
        });
        while(n<0){
            n=n+256;
        }
        return  String(n);
    }

    calculateTranslation=(i:InputLine,flag:boolean):void=>{
        let e= (i!=null?i:this.inputlines[this.IDcounter]);
        if(e.getType()!=InputLineType.TRANSLATED){
            return;
        }
        let rest:string="";
        let addr:string=this.fHD16(e.getStartingAddr());
        let h:string|undefined="";
        let hex:string=e.getHCode();
/*         if(e.getStartingAddr()=='0000h'){
            addr='0000h'
        }
        else{
            addr=this.fHD16(e.getStartingAddr());
        } */
        if(e.getFirstPart().toUpperCase()=='RS'){
            rest=this.fHD8(this.calculateRest(String(e.getLength()),(hex),addr));
            e.setTranslation(`${this.fHD8WH(String(e.getLength()))}${this.fHD16WH(addr)}00${hex}${this.fHD8WH(rest)}`);
        }
        else if(e.getFirstPart().toUpperCase()=='DB'){
            h=e.getSecondPart();
            rest=this.fHD8(this.calculateRest(String(e.getLength()),(hex),addr,h));
            e.setTranslation(`${this.fHD8WH(String(e.getLength()))}${this.fHD16WH(addr)}00${this.fHD8WH(h)}${this.fHD8WH(rest)}`);
        }
        else if(e.getFirstPart().toUpperCase()=='DW'){
            if(e.hasOffsetLabel()){
                h= (this.symbolliste.getPositionOfSpecificLabel(i.getLabelOfOffset())==undefined?"????":this.symbolliste.getPositionOfSpecificLabel(i.getLabelOfOffset()));
                h= flag?"????":h;
            }  
            else h=e.getSecondPart(); 
            rest=this.fHD8(this.calculateRest(String(e.getLength()),(hex),addr,h!));
            e.setTranslation(`${this.fHD8WH(String(e.getLength()))}${this.fHD16WH(addr)}00${this.getSpeicherAbbild(e,flag)}${this.fHD8WH(rest)}`);
        }
        else{
            switch(e.getLength()){
                case 1:
                    if(Manipulator.isDat_8(hex)){
                        rest=this.fHD8(this.calculateRest(String(e.getLength()),(hex),addr))
                        e.setTranslation(`${this.fHD8WH(String(e.getLength()))}${this.fHD16WH(addr)}00${this.fHD8WH(hex)}${this.fHD8WH(rest)}`);
                    }
                    else{
                        console.log(`${e.getId()} cannot be translated! ${hex} is no dat_8`);
                    }
                    break;
                case 2:
                    if(Manipulator.isDat_8(hex)){
                        /* let type= this.map.getDataType(e.getSecondPart()); */
                        if(Manipulator.isDat_8(e.getSecondPart())){
                            h=e.getSecondPart();
                            rest=this.fHD8(this.calculateRest(String(e.getLength()),(hex),addr,h));
                            e.setTranslation(`${this.fHD8WH(String(e.getLength()))}${this.fHD16WH(addr)}00${this.fHD8WH(hex)}${this.fHD8WH(h)}${this.fHD8WH(rest)}`);
                        }
                        else if(Manipulator.isDat_8(e.getThirdPart())){
                            h=e.getThirdPart();
                            rest=this.fHD8(this.calculateRest(String(e.getLength()),(hex),addr,e.getThirdPart()));
                            e.setTranslation(`${this.fHD8WH(String(e.getLength()))}${this.fHD16WH(addr)}00${this.fHD8WH(hex)}${this.fHD8WH(h)}${this.fHD8WH(rest)}`);
                        }
                        else if(this.symbolliste.isConst(e.getSecondPart())){
                            h=this.symbolliste.getSpecificConstantByName(e.getSecondPart())!.getValue();
                            rest=this.fHD8(this.calculateRest(String(e.getLength()),(hex),addr,h));
                            e.setTranslation(`${this.fHD8WH(String(e.getLength()))}${this.fHD16WH(addr)}00${this.fHD8WH(hex)}${this.fHD8WH(h)}${this.fHD8WH(rest)}`);
                        }
                        else if(this.symbolliste.isConst(e.getThirdPart())){
                            h=this.symbolliste.getSpecificConstantByName(e.getThirdPart())!.getValue();
                            rest=this.fHD8(this.calculateRest(String(e.getLength()),(hex),addr,h));
                            e.setTranslation(`${this.fHD8WH(String(e.getLength()))}${this.fHD16WH(addr)}00${this.fHD8WH(hex)}${this.fHD8WH(h)}${this.fHD8WH(rest)}`);
                        }
                        else{
                            console.log(`${e.getId()} cannot be translated! Case2 failed!`);
                        }
                    }
                    else if(Manipulator.isDat_16(hex)){
                        rest=this.fHD8(this.calculateRest(String(e.getLength()),hex,addr));
                        e.setTranslation(`${this.fHD8WH(String(e.getLength()))}${this.fHD16WH(addr)}00${this.fHD16WH(hex)}${this.fHD8WH(rest)}`);
                    }
                    else{
                        console.log(`${e.getId()} cannot be translated! ${hex} is no dat_8 or dat_16`);
                    }
                    break;
                case 3:
                    if(Manipulator.isDat_8(hex)){
                        if(this.symbolliste.isLabel(e.getSecondPart())){
                            h=this.symbolliste.getPositionOfSpecificLabel(e.getSecondPart());
                            h=(h==undefined?"????":h);
                            rest=this.fHD8(this.calculateRest(String(e.getLength()),(hex),addr,h));
                            // e.setTranslation(`${this.fHD8WH(String(e.getLength()))}${this.fHD16WH(addr)}00${this.fHD8WH(hex)}${flag?this.getLittleEndianOf(h.replace(/h$/,"")):"????"}${this.fHD8WH(rest)}`);
                            e.setTranslation(`${this.fHD8WH(String(e.getLength()))}${this.fHD16WH(addr)}00${this.getSpeicherAbbild(e,flag)}${this.fHD8WH(rest)}`);
                        } 
                        else if(this.symbolliste.isLabel(e.getThirdPart())){
                            h=this.symbolliste.getPositionOfSpecificLabel(e.getThirdPart());
                            h=(h==undefined?"????":h);
                            rest=this.fHD8(this.calculateRest(String(e.getLength()),(hex),addr,h));
                            // e.setTranslation(`${this.fHD8WH(String(e.getLength()))}${this.fHD16WH(addr)}00${this.fHD8WH(hex)}${flag?this.getLittleEndianOf(h.replace(/h$/,"")):"????"}${this.fHD8WH(rest)}`);
                            e.setTranslation(`${this.fHD8WH(String(e.getLength()))}${this.fHD16WH(addr)}00${this.getSpeicherAbbild(e,flag)}${this.fHD8WH(rest)}`);
                        }
                        else if(Manipulator.isDat_16(e.getThirdPart())){
                            h=e.getThirdPart();
                            console.log(h);
                            rest=this.fHD8(this.calculateRest(String(e.getLength()),(hex),addr,h));
                            e.setTranslation(`${this.fHD8WH(String(e.getLength()))}${this.fHD16WH(addr)}00${this.fHD8WH(hex)}${this.getLittleEndianOf(h)}${this.fHD8WH(rest)}`);
                        }
                        else if(this.symbolliste.isConst(e.getThirdPart())){
                            h=this.symbolliste.getSpecificConstantByName(e.getThirdPart())!.getValue();
                            console.log(h);
                            rest=this.fHD8(this.calculateRest(String(e.getLength()),(hex),addr,h));
                            e.setTranslation(`${this.fHD8WH(String(e.getLength()))}${this.fHD16WH(addr)}00${this.fHD8WH(hex)}${this.getLittleEndianOf(h)}${this.fHD8WH(rest)}`);
                        }
                        else if(e.hasOffsetLabel()){
                            h=this.symbolliste.getPositionOfSpecificLabel(e.getLabelOfOffset());
                            h=(h==undefined?"????":h);
                            rest=this.fHD8(this.calculateRest(String(e.getLength()),(hex),addr,h));
                            e.setTranslation(`${this.fHD8WH(String(e.getLength()))}${this.fHD16WH(addr)}00${this.getSpeicherAbbild(e,flag)}${this.fHD8WH(rest)}`);
                        }
                        else{
                            console.log(`${e.getId()} cannot be translated! Case3 failed!`);
                        }
                    }
                    else{
                        console.log(`${e.getId()} cannot be translated! ${hex} is no dat_8`);
                    }
                    break;
                case 4:
                    if(Manipulator.isDat_16(hex)){
                        if(this.symbolliste.isLabel(e.getSecondPart())){
                            h=this.symbolliste.getPositionOfSpecificLabel(e.getSecondPart());
                            h=(h==undefined?"????":h);
                            rest=this.fHD8(this.calculateRest(String(e.getLength()),(hex),addr,h));
                            // e.setTranslation(`${this.fHD8WH(String(e.getLength()))}${this.fHD16WH(addr)}00${this.fHD16WH(hex)}${flag?h.replace(/h$/,""):"????"}${this.fHD8WH(rest)}`);
                            e.setTranslation(`${this.fHD8WH(String(e.getLength()))}${this.fHD16WH(addr)}00${this.getSpeicherAbbild(e,flag)}${this.fHD8WH(rest)}`);
                        } 
                        else if(this.symbolliste.isLabel(e.getThirdPart())){
                            h=this.symbolliste.getPositionOfSpecificLabel(e.getThirdPart());
                            h=(h==undefined?"????":h);
                            rest=this.fHD8(this.calculateRest(String(e.getLength()),(hex),addr,h));
                            // e.setTranslation(`${this.fHD8WH(String(e.getLength()))}${this.fHD16WH(addr)}00${this.fHD16WH(hex)}${flag?h.replace(/h$/,""):"????"}${this.fHD8WH(rest)}`);
                            e.setTranslation(`${this.fHD8WH(String(e.getLength()))}${this.fHD16WH(addr)}00${this.getSpeicherAbbild(e,flag)}${this.fHD8WH(rest)}`);
                        }
                        else if(Manipulator.isDat_16(e.getThirdPart())){
                            h=e.getThirdPart();
                            rest=this.fHD8(this.calculateRest(String(e.getLength()),(hex),addr,h));
                            // e.setTranslation(`${this.fHD8WH(String(e.getLength()))}${this.fHD16WH(addr)}00${this.fHD8WH(hex)}${this.getLittleEndianOf(h)}${this.fHD8WH(rest)}`);
                            e.setTranslation(`${this.fHD8WH(String(e.getLength()))}${this.fHD16WH(addr)}00${this.fHD16WH(hex)}${this.getLittleEndianOf(h)}${this.fHD8WH(rest)}`);
                        }
                        else if(this.symbolliste.isConst(e.getThirdPart())){
                            h=this.symbolliste.getSpecificConstantByName(e.getThirdPart())!.getValue();
                            rest=this.fHD8(this.calculateRest(String(e.getLength()),(hex),addr,h));
                            // e.setTranslation(`${this.fHD8WH(String(e.getLength()))}${this.fHD16WH(addr)}00${this.fHD8WH(hex)}${this.getLittleEndianOf(h)}${this.fHD8WH(rest)}`);
                            e.setTranslation(`${this.fHD8WH(String(e.getLength()))}${this.fHD16WH(addr)}00${this.fHD16WH(hex)}${this.getLittleEndianOf(h)}${this.fHD8WH(rest)}`);
                        }
                        else if(e.hasOffsetLabel()){
                            h=this.symbolliste.getPositionOfSpecificLabel(e.getLabelOfOffset());
                            h=(h==undefined?"????":h);
                            rest=this.fHD8(this.calculateRest(String(e.getLength()),(hex),addr,h));
                            e.setTranslation(`${this.fHD8WH(String(e.getLength()))}${this.fHD16WH(addr)}00${this.getSpeicherAbbild(e,flag)}${this.fHD8WH(rest)}`);
                        }
                        else{
                            console.log(`${e.getId()} cannot be translated! Case4 failed!`);
                        }
                    }
                    else{
                        console.log(`${e.getId()} cannot be translated! ${hex} is not dat_16`);
                    }
                    break;    
               /*  default:
                    rest=this.fHD8(this.calculateRest(String(e.getLength()),(hex),addr));
                    e.setTranslation(`${this.fHD8WH(String(e.getLength()))}${this.fHD16WH(addr)}00${hex}${this.fHD8WH(rest)}`);
                    break;
             */
            }
        }
    }
    
    getInputLines=()=>{
        return this.inputlines;
    }
    getTranslatedIDs=():number[]=>{
        return this.translatedIDs;
    }

}