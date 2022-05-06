import { MnemoCommand } from "./MnemoCommand";
import { erlaubteLängeL_C, Manipulator } from "./Manipulator";
import { SymbolList } from "./SymbolList";
import { InputLine } from "./InputLine";
import { InputLineType, DataType } from "./Enums";
import { StringConstructor } from "./StringConstructor";


const parse1:string = `<span class="gray">parse Labelfeld/Befehlsfeld:</span>`;
const parse2:string = `<span class="gray">parse Befehlsfeld:</span>`;
const parse3:string = `<span class="gray">parse Operandenfeld (1):</span>`;
const parse4:string = `<span class="gray">parse Operandenfeld (2):</span>`;
const parse5:string = `<span class="gray">gesamter Befehl:</span>`;

export const saveInput=(I:InputLine,n:number)=>{
    switch(n){
        case 1:
            I.saveDescriptionLine(parse1);
            break;
        case 2:
            I.saveDescriptionLine(parse2);
            break;
        case 3:
            I.saveDescriptionLine(parse3);
            break;
        case 4:
            I.saveDescriptionLine(parse4);
            break;
        case 5:
            I.saveDescriptionLine(parse5);
            break;
    }
}

const save2 =(i:InputLine) =>{
    saveInput(i,2);
}
const save3 =(i:InputLine) =>{
    saveInput(i,3);
}
const save4 =(i:InputLine) =>{
    saveInput(i,4);
}
const registerAdressierung:string = "Registeradressierung"
const indirekteRegAdressierung:string = "indirekte Registeradressierung"
const immediateAdressierung:string = "Immediateadressierung"
const absoluteAdressierung:string = "Absolutadressierung"
const stackBefehl:string = "Stackbefehl"
const ioAdressierung:string = "IO Adressierung"


export class CommandMap{

    private static instance:CommandMap;
    
    public mnemoCommands:MnemoCommand[]=[
            //TRANSPORTBEFEHLE
        //Immediate laden
        new MnemoCommand("MOV","A","dat_8","00 111 110",2),
        new MnemoCommand("MOV","B","dat_8","00 000 110",2),
        new MnemoCommand("MOV","C","dat_8","00 001 110",2),
        new MnemoCommand("MOV","IX","dat_16","11 011 10100 100 001",4),
        new MnemoCommand("MOV","HL","dat_16","00 100 001",3),
        new MnemoCommand("MOV","SP","dat_16","00 110 001",3),

        //Direkte Adressierung Register<>Register
        new MnemoCommand("MOV","A","B","01 111 000",1),
        new MnemoCommand("MOV","A","C","01 111 001",1),
        new MnemoCommand("MOV","B","A","01 000 111",1),
        new MnemoCommand("MOV","B","C","01 000 001",1),
        new MnemoCommand("MOV","C","A","01 001 111",1),
        new MnemoCommand("MOV","C","B","01 001 000",1),

        //Direkte Adressierung Register<>Speicher
        new MnemoCommand("MOV","A","label","00 111 010",3),
        new MnemoCommand("MOV","label","A","00 110 010",3),
        new MnemoCommand("MOV","HL","label","00 101 010",3),
        new MnemoCommand("MOV","label","HL","00 100 010",3),
        new MnemoCommand("MOV","IX","label","11 011 10100 101 010",4),
        new MnemoCommand("MOV","label","IX","11 011 10100 100 010",4),

        //Registerindirekte Adressierung
        new MnemoCommand("MOV","A","[HL]","01 111 110",1),
        new MnemoCommand("MOV","[HL]","A","01 110 111",1),

        //Stackbefehle
        new MnemoCommand("PUSH","","","11 110 101",1),
        new MnemoCommand("POP","","","11 110 001",1),

        //Ein-Ausgabebefehle
        new MnemoCommand("IN","A","port","11 011 011",2),
        new MnemoCommand("OUT","port","A","11 010 011",2),

            //BEFEHLE ZUR DATENBEARBEITUNG
        //Inkrement- und Dekrementbefehle
        new MnemoCommand("INC","A","","00 111 100",1),
        new MnemoCommand("INC","B","","00 000 100",1),
        new MnemoCommand("INC","C","","00 001 100",1),
        new MnemoCommand("INC","HL","","00 100 011",1),
        new MnemoCommand("INC","IX","","11 011 10100 100 011",2),

        new MnemoCommand("DEC","A","","00 111 101",1),
        new MnemoCommand("DEC","B","","00 000 101",1),
        new MnemoCommand("DEC","C","","00 001 101",1),
        new MnemoCommand("DEC","HL","","00 101 011",1),
        new MnemoCommand("DEC","IX","","11 011 10100 101 011",2),

        //Arithmetische Operationen
        new MnemoCommand("ADD","A","","10 000 111",1),
        new MnemoCommand("ADD","B","","10 000 000",1),
        new MnemoCommand("ADD","C","","10 000 001",1),
        new MnemoCommand("ADD","dat_8","","11 000 110",2),

        new MnemoCommand("SUB","A","","10 010 111",1),
        new MnemoCommand("SUB","B","","10 010 000",1),
        new MnemoCommand("SUB","C","","10 010 001",1),
        new MnemoCommand("SUB","dat_8","","11 010 110",2),

        //Logische Operationen
        new MnemoCommand("AND","A","","10 100 111",1),
        new MnemoCommand("AND","B","","10 100 000",1),
        new MnemoCommand("AND","C","","10 100 001",1),
        new MnemoCommand("AND","dat_8","","11 100 110",2),

        new MnemoCommand("OR","A","","10 110 111",1),
        new MnemoCommand("OR","B","","10 110 000",1),
        new MnemoCommand("OR","C","","10 110 001",1),
        new MnemoCommand("OR","dat_8","","11 110 110",2),

        new MnemoCommand("XOR","A","","10 101 111",1),
        new MnemoCommand("XOR","B","","10 101 000",1),
        new MnemoCommand("XOR","C","","10 101 001",1),
        new MnemoCommand("XOR","dat_8","","11 101 110",2),

        //Schiebebefehle
        new MnemoCommand("SHL","","","11 001 01100 100 111",2),
        new MnemoCommand("SHR","","","11 001 01100 111 111",2),

        //Rotierbefehle
        new MnemoCommand("RCL","","","00 010 111",1),
        new MnemoCommand("ROL","","","00 000 111",1),
        new MnemoCommand("RCR","","","00 011 111",1),
        new MnemoCommand("ROR","","","00 001 111",1),

        //Vergleichsoperationen
        new MnemoCommand("CP","A","","10 111 111",1),
        new MnemoCommand("CP","B","","10 111 000",1),
        new MnemoCommand("CP","C","","10 111 001",1),
        new MnemoCommand("CP","dat_8","","11 111 110",2),


            //BEFEHLE FÜR VERZWEIGUNGEN
        //Bedingte Sprünge
        new MnemoCommand("JPNZ","label","","11 000 010",3),
        new MnemoCommand("JPZ","label","","11 001 010",3),
        new MnemoCommand("JPNC","label","","11 010 010",3),
        new MnemoCommand("JPC","label","","11 011 010",3),
        new MnemoCommand("JPNO","label","","11 100 010",3),
        new MnemoCommand("JPO","label","","11 101 010",3),
        new MnemoCommand("JPNS","label","","11 110 010",3),
        new MnemoCommand("JPS","label","","11 111 010",3),

        //Unbedingter Sprung
        new MnemoCommand("JP","label","","11 000 011",3),

        //Registerinderkter Sprung
        new MnemoCommand("JP","[IX]","","11 011 10111 101 001",2),


        //Unterprogrammbefehle
        new MnemoCommand("CALL","label","","11 001 101",3),
        new MnemoCommand("RET","","","11 001 001",1),

            //CPU-STEUERBEFEHLE
        //Leerbefehl
        new MnemoCommand("NOP","","","00 000 000",1),

        //Haltbefehl
        new MnemoCommand("HALT","","","01 110 110",1),
    ];

    private symbollist:SymbolList=SymbolList.getInstance();
    
    public mCodes:string[]=["MOV", "PUSH", "POP", "IN", "OUT", "INC", "DEC", "ADD", "SUB", "AND", "OR", "XOR", "SHL", "SHR", "RCL", "ROL", "RCR", "ROR", "CP", "JPNZ", "JPZ", "JPNC", "JPC", "JPNO", "JPO", "JPNS", "JPS", "JP", "CALL", "RET", "NOP", "HALT"];

    public pseudoMCodes:string[]=["DB","DW","RS","ORG","EXT","ENT"];

    public Regs:string[] = ["A", "B", "C", "IX", "HL", "SP", "[HL]", "[IX]"];

    private constDefFlag:boolean=true;

    private constructor(){
    }

    public static getInstance(){
        if(!CommandMap.instance){
            CommandMap.instance= new CommandMap();
        }
        return CommandMap.instance;
    }
    public filterableString=():string[]=>{
        let toReturn:string[]=[];
        let toSort:string[]=[];
        toReturn.push("Mnemocodes");
        this.mnemoCommands.forEach(e=>{
            toSort.push(e.toFilterableString());
        });
        toSort.sort().forEach(e=>{
            toReturn.push(e);
        });
        toReturn.push("PSEUDO-Mnemocodes");
        toReturn.push("const EQU dat_16");
        toReturn.push("DB dat_8");
        toReturn.push("DW dat_16");
        toReturn.push("ORG dat_16");
        toReturn.push("RS dat_8");
        return toReturn;
    }

    formatGefunden(s1:string,s2:string):string{
        return `<span class="eingeruckt">gefunden: ${s1!=""?s1+' ':""} -> <span class="bold">${s2}</span></span>`;
    }
    
    formatErwartet(s1:string):string{
        // return 'erwarte: '+s1;
        s1 = s1.replace("dat_8","8-bit Wert").replace("dat_16","16-bit Wert").replace("label","Label");
        return `<span class="eingeruckt">erwarte&nbsp;: ${s1}</span>`;
    }
    formatErkannt(s1:string):string{
        return `<span class="eingeruckt"> (${s1})</span>`;
    }
    formatErrorMassage(s1:string):string{
        return `<span class="errorRed">error: ${s1}</span>`;
    }
    filterForEmtpyStrings(s:string[]):string[]{
        return s.filter(e=>{ if(!/^[\s+]/g.test(e) && e!=""){return e;}});
    }
    resetConstDefFlag(){
        this.constDefFlag=true;
    }

    mapInputLineByCase(i:InputLine):boolean{
        let strings:string[] = Manipulator.splitStringHalf(i.getInitialLine(),';');
        let commandLine = strings[0].trim();
        // let commandLine = i.getCommandline();
        // console.log(i.getCommandline());
        if(strings.length>1){
            i.setComment(strings[1].trim());
        }
        saveInput(i,1);
        this.constDefFlag
            ?i.saveDescriptionLine(this.formatErwartet(`Labeldef., Mnemocode oder Konstante (+EQU)`))
            :i.saveDescriptionLine(this.formatErwartet(`Labeldef. oder Mnemocode`));

        //Auflösung von lebel wenn : gefunden
        if(commandLine.includes(":")){
            strings=Manipulator.splitStringHalf(commandLine,":");
            i.setLabelTo("");
            //Darf nicht bereits definiert label sein die in Symboltabelle ist
            if(this.symbollist.isConst(strings[0])){
                i.saveDescriptionLine(StringConstructor.nameTakenForConst(strings[0])); 
                    i.setError(strings[0]);
                    i.setRest(": "+strings[1]);
                    i.setValid(false);

                    return false;
            }
            else if(this.symbollist.isLabel(strings[0])){
                if(this.symbollist.getPositionOfSpecificLabel(strings[0])!=undefined){
                    // i.saveDescriptionLine(this.formatErrorMassage(`Label ${strings[0]} ist schon bereits besetzt`)); 
                    i.saveDescriptionLine(StringConstructor.errLabelDef(strings[0])); 
                    i.setError(strings[0]);
                    i.setRest(": "+strings[1]);
                    i.setValid(false);
                    return false;
                }
            }
            if(!this.symbollist.isEligible(strings[0])){
                i.saveDescriptionLine(StringConstructor.invalidLabel(strings[0]));  
                i.setError(strings[0]);
                i.setRest(": "+strings[1]);
                i.setValid(false);
                return false;
            }
            else{
                i.saveDescriptionLine(this.formatGefunden("Doppelpunkt ",`Label '${strings[0]}'`)); // ??
                i.setLabelTo(strings[0]);
                //Wenn zu lang, Warnung gesetzt
                if(strings[0].length>erlaubteLängeL_C){
                    i.saveDescriptionLine(StringConstructor.warLabelZuLang(strings[0]));
                }
                else if(strings[0].match(/^[A-Fa-f0-9]{1,4}h$/)!=null){
                    i.saveDescriptionLine(StringConstructor.warLabelND(strings[0]));
                }
                this.symbollist.setLabelWithoutPosition(strings[0]);
                saveInput(i,2);
                i.saveDescriptionLine(this.formatErwartet("(Pseudo-)Mnemocode"));
                if(strings[1]==""){
                    i.saveDescriptionLine(`<span class="eingeruckt">gefunden: Ende der Codezeile</span>`); // ??
                    i.setType(InputLineType.PSEUDOTRANSLATED);
                    i.setValid(true);
                    return true;
                }
                commandLine=strings[1];
            }
        }
        strings = Manipulator.splitStringHalfUnfiltered(commandLine," ");
        strings = this.filterForEmtpyStrings(strings);
        //erster Term MnemoCode
        if(this.mCodes.includes(strings[0].toUpperCase())){
            i.setFirstPart(strings[0]);
            strings[0] = strings[0].toUpperCase();

            return this.parseToMnemoCode(i,strings);
        }//erster Term PseudoMnemoCode - mögliche ConstantenName
        else if(this.pseudoMCodes.includes(strings[0].toUpperCase()) || this.symbollist.isEligible_Const(strings[0])){
            return this.parsetoPseudoMnemoCode(i,strings);
        }
        else {
            i.saveDescriptionLine(StringConstructor.invalidCmd(strings[0]));
            i.setError(strings[0]);
            if(strings[1]!=undefined){
                i.setRest(strings[1]);
            }
            i.setValid(false);
            return false;
        }        
    }

    parseToMnemoCode(i:InputLine,strings:string[]):boolean{
        let consoletostring="";
        let matches:MnemoCommand[]=[];
        let toSave:string="";
        this.constDefFlag=false;

        //Behandlung aller Fälle wo der 1. Term mit einem MnemoCode anfangt
        switch(strings[0]){
            case 'MOV':
                i.saveDescriptionLine(this.formatGefunden("Mnemocode "+strings[0],strings[0]+" ..."))

                save3(i);
                matches=this.mnemoCommands.filter(e=>{return e.getMCode()=='MOV'}); //Alle treffer auf MOV Codes filtriert
                consoletostring=this.getDests(matches).join(", ");
                i.saveDescriptionLine(this.formatErwartet(consoletostring));        //Ausgabe von erwartetten Befehlen
                
                if(strings.length<2){
                    i.saveDescriptionLine(StringConstructor.toofewCmd()); //ERROR
                    i.setError("");
                    return false;
                }
                strings=Manipulator.splitStringHalfUnfiltered(strings[1],",");
                // strings = this.filterForEmtpyStrings(strings);
                // 2. Term Register
                if(this.getDests(matches).includes(strings[0].toUpperCase())
                    &&this.Regs.includes(strings[0].toUpperCase())){ // A || B || C || IX || HL || SP

                    toSave=strings[0];
                    i.setSecondPart(toSave);
                    strings[0] = strings[0].toUpperCase();
                    i.saveDescriptionLine(this.formatGefunden("Register "+strings[0],i.getFirstPart().toUpperCase()+" "+strings[0]+" ..."));
                    
                    matches=matches.filter(e=>{                                     //Alle treffer auf zutreffende Register filtriert
                        if(e.getDestination() ==strings[0]){
                            return e;
                        }
                    });
                    consoletostring=this.getScources(matches).join(", ");
                    save4(i);
                    i.saveDescriptionLine(this.formatErwartet(consoletostring));    //Ausgabe von erwartetten Befehlen
                    if(strings.length<2){
                        i.saveDescriptionLine(StringConstructor.toofewCmd()); //ERROR
                        i.setError("");
                        return false;
                    }
                    // 3. Term Register
                    if(this.getScources(matches).includes(strings[1].toUpperCase())&&this.Regs.includes(strings[1].toUpperCase())){ // A || B || C || [HL]

                        toSave=strings[1];
                        strings[1] = strings[1].toUpperCase();
                        i.saveDescriptionLine(this.formatGefunden("Register "+strings[1],i.getFirstPart().toUpperCase()+" "+i.getSecondPart().toUpperCase()+", "+strings[1]));
                        
                        matches=matches.filter(e=>{                                     //Alle treffer auf zutreffende Register filtriert
                            if(e.getSource() ==strings[1]){
                                return e;
                            }
                        });
                        if(matches.length==1){
                            i.setThirdPart(toSave);
                            if(strings[0] == "[HL]" || strings[1]=="[HL]"){
                                i.saveDescriptionLine(this.formatErkannt(indirekteRegAdressierung));
                            }
                            else{
                                i.saveDescriptionLine(this.formatErkannt(registerAdressierung));
                            }
                            i.setType(InputLineType.TRANSLATED);
                            i.setLength(matches[0].getSize());
                            i.setHCode(matches[0].getHexCode());
                            i.setValid(true);
                            return true;
                        }
                        else{
                            //Bug aufgetrenten oder unbeachtetter fall
                            i.saveDescriptionLine(StringConstructor.bugNoCommand());
                            return false;
                        }
                    }
                    else{
                        // 3. Term nicht Register -> OFFSET Label || dat || const || label
                        // console.log(strings[1]+" "+this.getDataType(strings[1]))
                        if(this.getDataType(strings[1]) != DataType.NONE){
                            let type:DataType=this.getDataType(strings[1]);
                            switch(type){

                                case DataType.dat_8:
                                    if(consoletostring.includes("dat_8")){
                                        //i.saveDescriptionLine(`Gefunden -> 'dat_8'`);
                                        // i.saveDescriptionLine(StringConstructor.infoIsDat8());
                                        this.saveExtraInfo(i,consoletostring,strings[1]);
                                        // i.saveDescriptionLine(this.formatGefunden("8-bit Wert "+Manipulator.formatHextoDat8(strings[1]),"MOV "+strings[0]+", "+Manipulator.formatHextoDat8(strings[1])));
                                        i.saveDescriptionLine(this.formatGefunden("8-bit Wert "+strings[1],"MOV "+strings[0]+", "+strings[1])); // DecOrHex
    
                                        matches=matches.filter(e=>{
                                            if(e.getSource()=="dat_8"){
                                                return e;
                                            }
                                        });
                                        // Änderung
                                        // i.setThirdPart(Manipulator.formatHextoDat8(strings[1]));
                                        i.saveDescriptionLine(this.formatErkannt(immediateAdressierung));
                                        i.setThirdPart((strings[1]));
                                        break;
                                    }else if(consoletostring.includes("dat_16")){
                                        //i.saveDescriptionLine(`Gefunden -> 'dat_16'`);
                                        // i.saveDescriptionLine(StringConstructor.infoIsDat16());
                                        this.saveExtraInfo(i,consoletostring,strings[1]);
                                        i.saveDescriptionLine(this.formatGefunden("16-bit Wert "+strings[1],"MOV "+strings[0]+", "+strings[1])); // DecOrHex
                                        // i.saveDescriptionLine(this.formatGefunden("16-bit Wert "+Manipulator.formatHextoDat16(strings[1]),"MOV "+strings[0]+", "+Manipulator.formatHextoDat16(strings[1])));
                                        matches=matches.filter(e=>{
                                            if(e.getSource()=="dat_16"){
                                                return e;
                                            }
                                        });
                                        // Änderung
                                        i.setThirdPart((strings[1]));
                                        i.saveDescriptionLine(this.formatErkannt(immediateAdressierung));
                                        break;
                                    }else{
                                        this.saveExtraInfo(i,consoletostring,strings[1]);
                                        i.saveDescriptionLine(StringConstructor.invalidCmd(strings[1])); //can only be [HL]
                                        i.setError(strings[1]);
                                        i.setValid(false);
                                        return false;
                                    }
                                case DataType.dat_16:
                                    if(consoletostring.includes("dat_16") && ['HL','SP','IX'].includes(strings[0])){
                                        this.saveExtraInfo(i,consoletostring,strings[1]);
                                        // i.saveDescriptionLine(this.formatGefunden("16-bit Wert "+Manipulator.formatHextoDat16(strings[1]),"MOV "+strings[0]+", "+Manipulator.formatHextoDat16(strings[1])));
                                        i.saveDescriptionLine(this.formatGefunden("16-bit Wert "+strings[1],"MOV "+strings[0]+", "+strings[1])); // DecOrHex
                                        matches=matches.filter(e=>{
                                            if(e.getSource()=="dat_16"){
                                                return e;
                                            }
                                        });
                                        i.setThirdPart((strings[1]));
                                        i.saveDescriptionLine(this.formatErkannt(immediateAdressierung));

                                        break;
                                    }
                                    else if(consoletostring.includes("dat_8")){
                                        // i.saveDescriptionLine(StringConstructor.infoNotDat8());
                                        // i.saveDescriptionLine(StringConstructor.infoNoConst(strings[1]));
                                        // i.saveDescriptionLine(StringConstructor.infoNoLabel(strings[1]));
                                        // i.saveDescriptionLine(StringConstructor.expectedDat8Plus(strings[1]));
                                        this.saveExtraInfo(i,consoletostring,strings[1]);

                                        i.saveDescriptionLine(StringConstructor.expectedDat8ConstToBig(strings[1]));
                                        i.setError(strings[1]);
                                        i.setValid(false);
                                        return false;
                                    }
                                    else{
                                        this.saveExtraInfo(i,consoletostring,strings[1]);

                                        i.saveDescriptionLine(StringConstructor.invalidCmd(strings[1])); //can only be [HL]
                                        i.setError(strings[1]);
                                        i.setValid(false);
                                        return false;
                                    }
                                    break;
                                case DataType.CONSTANT:
    
                                    let value = this.symbollist.getSpecificConstantByName(strings[1])?.getValue();
                                    if(value==undefined){ //bug Aufgetreten oder Konstante nicht angelegt
                                        i.saveDescriptionLine(StringConstructor.bugNoValueForConst(strings[1]));
                                        i.setError(strings[1]);
                                        return false;
                                    }
                                    type = this.getDataType(value);
                                    if(consoletostring.includes("dat_8") && type==DataType.dat_8){ //Konstante hat Datentyp 'dat_8' und ist erwartet
                                        matches=matches.filter(e=>{
                                            if(e.getSource()=="dat_8"){
                                                return e;
                                            }
                                        });
                                        // i.saveDescriptionLine(StringConstructor.infoNotDat8());
                                        // i.saveDescriptionLine(StringConstructor.infoIsDat8Const(strings[1])); //CONST ANIMATION????
                                        this.saveExtraInfo(i,consoletostring,strings[1]);

                                        i.saveDescriptionLine(this.formatGefunden("Konstante "+`<span class="labelBlue">${strings[1]}</span>`+" mit dem Wert "+value,i.getFirstPart().toUpperCase()+" "+strings[0]+", "+strings[1]));

                                        i.saveDescriptionLine(this.formatErkannt(immediateAdressierung));
                                        break;
                                    }
                                    else if(consoletostring.includes("dat_16")){ //Konstante hat Datentyp 'dat_16' und ist erwartet
                                        matches=matches.filter(e=>{
                                        if(e.getSource()=="dat_16"){
                                            return e;
                                        }
                                        });
                                        // i.saveDescriptionLine(StringConstructor.infoNotDat16());
                                        // i.saveDescriptionLine(StringConstructor.infoIsDat16Const(strings[1])); //CONST ANIMATION????
                                        this.saveExtraInfo(i,consoletostring,strings[1]);

                                        i.saveDescriptionLine(this.formatGefunden("Konstante "+`<span class="labelBlue">${strings[1]}</span>`+" mit dem Wert "+value,i.getFirstPart().toUpperCase()+" "+strings[0]+", "+strings[1]));

                                        i.saveDescriptionLine(this.formatErkannt(immediateAdressierung));

                                        break;
                                    }
                                    else if(consoletostring.includes("dat_8")){

                                        // i.saveDescriptionLine(StringConstructor.infoNotDat8());
                                        // i.saveDescriptionLine(StringConstructor.infoNotDat8Const(strings[1]));
                                        // if(consoletostring.includes("label")){
                                        //     i.saveDescriptionLine(StringConstructor.notValidLabelSinceItsConst(strings[1]));
                                        // }
                                        this.saveExtraInfo(i,consoletostring,strings[1]);

                                        // i.saveDescriptionLine(StringConstructor.expectedDat8Plus(strings[1])); //KONSTANTE ZU GROß?
                                        i.saveDescriptionLine(StringConstructor.expectedDat8ConstToBig(strings[1]));

                                        i.setError(strings[1]);
                                        i.setValid(false);
                                        return false;
                                    }
                                    else{
                                        // if(consoletostring.includes("label")){
                                        //     i.saveDescriptionLine(StringConstructor.notValidLabelSinceItsConst(strings[1]));
                                        // }
                                        this.saveExtraInfo(i,consoletostring,strings[1]);

                                        i.saveDescriptionLine(StringConstructor.invalidCmd(strings[1]));
                                        i.setError(strings[1]);
                                        return false;
                                    }
                                    break;
                                case DataType.LABEL:
                                    if(!consoletostring.includes("label")){
                                        this.saveExtraInfo(i,consoletostring,strings[1]);
                                        i.saveDescriptionLine(StringConstructor.invalidCmd(strings[1]));
                                        i.setError(strings[1]);
                                        i.setValid(false);
                                        return false;
                                    }

                                    let value1 = this.symbollist.getSpecificLabelByName(strings[1]);
                                    this.saveExtraInfo(i,consoletostring,strings[1]);

                                    i.saveDescriptionLine(this.formatGefunden(`Label '<span class="labelBlue">${value1?.getName()}</span>'`,i.getFirstPart().toUpperCase()+" "+i.getSecondPart().toUpperCase()+", "+value1?.getName()));
                                    // WARNING EINSETZEN?
                                    i.setThirdPart(strings[1]);
                                    matches=matches.filter(e=>{
                                        if(e.getSource()=="label"){
                                            return e;
                                        }
                                    })
                                    i.saveDescriptionLine(this.formatErkannt(absoluteAdressierung));

                                    break;
                                case DataType.ELLIGIBLE:
                                    if(!consoletostring.includes("label")){
                                        this.saveExtraInfo(i,consoletostring,strings[1]);

                                        i.saveDescriptionLine(StringConstructor.invalidCmd(strings[1]));
                                        i.setError(strings[1]);
                                        i.setValid(false);
                                        return false;
                                    }

                                    this.symbollist.setLabelWithoutPosition(strings[1]);
                                    this.saveExtraInfo(i,consoletostring,strings[1]);

                                    i.saveDescriptionLine(this.formatGefunden(`Label '<span class="labelBlue">${strings[1]}</span>'`,i.getFirstPart().toUpperCase()+" "+i.getSecondPart().toUpperCase()+", "+strings[1]));
                                    i.setThirdPart(strings[1]);
                                    matches=matches.filter(e=>{
                                        if(e.getSource()=="label"){
                                            return e;
                                        }
                                    })
                                    i.saveDescriptionLine(this.formatErkannt(absoluteAdressierung));
    
                                    break;
                                default: 
                                    i.saveDescriptionLine(StringConstructor.bugSwitchDefault());
                                    return false;
                            }
                            if(matches.length==1){
                                i.setThirdPart(strings[1]);
                                i.setType(InputLineType.TRANSLATED);
                                i.setLength(matches[0].getSize());
                                i.setHCode(matches[0].getHexCode());
                                i.setValid(true);
                                return true;
                            }
                            else{
                                i.saveDescriptionLine(StringConstructor.bugNoCommand());
                                return false;
                            }
                        } //möglicher weise OFFSET Label
                        else if(strings[1].toUpperCase().startsWith("OFFSET")){
                            let temp:string[]=Manipulator.splitStringHalf(strings[1]," ");
                            if(temp.length<2){
                                i.saveDescriptionLine(StringConstructor.invalidCmd(strings[1]));
                                i.setError(strings[1]);
                                return false;
                            }
                            if(this.getDataType(temp[1]) == DataType.LABEL){
                                if(!consoletostring.includes("dat_16")){
                                    i.saveDescriptionLine(StringConstructor.invalidCmd(strings[1]));
                                    i.setError(strings[1]);
                                    i.setValid(false);
                                    return false;
                                }
                                i.saveDescriptionLine(this.formatGefunden(`OFFSET`,i.getFirstPart().toUpperCase()+" "+i.getSecondPart().toUpperCase()+", OFFSET "+temp[1]));
                                matches=matches.filter(e=>{
                                    if(e.getSource()=="dat_16"){
                                        return e;
                                    }
                                })
                            }
                            else if(this.getDataType(temp[1]) == DataType.ELLIGIBLE){
                                if(!consoletostring.includes("dat_16")){
                                    i.saveDescriptionLine(StringConstructor.invalidCmd(strings[1]));
                                    i.setError(strings[1]);
                                    i.setValid(false);
                                    return false;
                                }
                                this.symbollist.setLabelWithoutPosition(temp[1]);
                                i.saveDescriptionLine(this.formatGefunden(`OFFSET`,i.getFirstPart().toUpperCase()+" "+i.getSecondPart().toUpperCase()+", OFFSET "+temp[1]));
                                if(temp[1].length>erlaubteLängeL_C){
                                    i.saveDescriptionLine(StringConstructor.warLabelZuLang(temp[1]));
                                }
                                matches=matches.filter(e=>{
                                    if(e.getSource()=="dat_16"){
                                        return e;
                                    }
                                })
                            }
                            else{
                                i.saveDescriptionLine(StringConstructor.noValidLabelAfterOffset());
                                i.setError(strings[1]);
                                return false;
                            }
                            if(matches.length==1){
                                i.saveDescriptionLine(this.formatErkannt(immediateAdressierung));

                                i.setThirdPart(strings[1]);
                                i.setType(InputLineType.TRANSLATED);
                                i.setLength(matches[0].getSize());
                                i.setHCode(matches[0].getHexCode());
                                i.setOffsetLabel(true);
                                i.setValid(true);
                                return true;
                            }
                            else{
                                i.saveDescriptionLine(StringConstructor.invalidCmd(strings[1]));
                                i.setError(strings[1]);
                                return false;
                            }
                        }
                        else{
                            if(strings[1].trim()=="" || strings[1].trim()==" "){
                                i.saveDescriptionLine(StringConstructor.toofewCmd());
                            }
                            else{
                                this.saveExtraInfo(i,consoletostring,strings[1]);
                                i.saveDescriptionLine(StringConstructor.invalidCmd(strings[1]));
                            }
                            i.setError(strings[1]);
                            return false;
                        }
                    } 
                }
                else if(this.symbollist.isLabel(strings[0]) || this.symbollist.isEligible(strings[0])){ // MUSS label sein
                    this.saveExtraInfo(i,consoletostring,strings[0]);

                    i.saveDescriptionLine(this.formatGefunden(`Label '<span class="labelBlue">${strings[0]}</span>'`,i.getFirstPart().toUpperCase()+" "+strings[0]+" ..."))
                    // WARNING EINSETZEN?
                    matches=matches.filter(e=>{                                     //Alle treffer auf zutreffende Register filtriert
                        if(e.getDestination() =="label"){
                            return e;
                        }
                    });
                    i.setSecondPart(strings[0]);
                    if(!this.symbollist.isLabel(strings[0])){ //Wenn label unbekannt dann neue Ansetzen
                        this.symbollist.setLabelWithoutPosition(strings[0]);

                    }
                    save4(i);
                    consoletostring=this.getScources(matches).join(", ");
                    i.saveDescriptionLine(this.formatErwartet(consoletostring));    //Ausgabe von erwartetten Befehlen
                    if(strings.length<2){
                        i.saveDescriptionLine(StringConstructor.toofewCmd());
                        i.setError("");
                        return false;
                    }
                    if(this.getScources(matches).includes(strings[1].toUpperCase())){
                        toSave=strings[1];
                        strings[1] = strings[1].toUpperCase();
                        this.saveExtraInfo(i,consoletostring,strings[1]);

                        i.saveDescriptionLine(this.formatGefunden("Register "+strings[1],i.getFirstPart().toUpperCase()+" "+i.getSecondPart()+","+strings[1]))
                        matches=matches.filter(e=>{                                     //Alle treffer auf zutreffende Register filtriert
                            if(e.getSource() ==strings[1]){
                                return e;
                            }
                        });
                        if(matches.length==1){
                            i.setThirdPart(toSave);
                            i.saveDescriptionLine(this.formatErkannt(absoluteAdressierung));
                            i.setType(InputLineType.TRANSLATED);
                            i.setLength(matches[0].getSize());
                            i.setHCode(matches[0].getHexCode());
                            i.setValid(true);
                            return true;
                        }
                        else{
                            i.saveDescriptionLine(StringConstructor.bugNoCommand());
                            return false;
                        }
                    }
                    else{
                        this.saveExtraInfo(i,consoletostring,strings[1]);

                        i.saveDescriptionLine(StringConstructor.invalidCmd(strings[1]));
                        i.setError(strings[1]);
                        return false;
                    }
                }
                else{
                    this.saveExtraInfo(i,consoletostring,strings[0]);

                    i.saveDescriptionLine(StringConstructor.invalidCmd(strings[0]));
                    i.setError(strings[0]);
                    if(strings[1]!=undefined){
                        i.setRest(","+strings[1]);
                    }
                    return false;
                }
                break;
            case 'POP':case 'PUSH':
                i.saveDescriptionLine(this.formatGefunden("Mnemocode "+strings[0],strings[0]))

                // matches=this.mnemoCommands.filter(e=>{return e.getMCode()=='PUSH'});
                matches=this.mnemoCommands.filter(e=>{return e.getMCode()==strings[0]});
                if(strings.length>1){
                    i.saveDescriptionLine(StringConstructor.tooManyCmd());
                    i.setError(strings[1]);
                    return false;
                }
                else{
                    // i.saveDescriptionLine(this.formatErkannt(stackBefehl));

                    i.setType(InputLineType.TRANSLATED);
                    i.setLength(matches[0].getSize());
                    i.setHCode(matches[0].getHexCode());
                    i.setValid(true);
                    return true;
                    }
                break;
            
            case 'IN':
                i.saveDescriptionLine(this.formatGefunden("Mnemocode "+strings[0],strings[0]+" ..."))

                save3(i);
                matches=this.mnemoCommands.filter(e=>{return e.getMCode()=='IN'});
                consoletostring=this.getDests(matches).join(", ");
                i.saveDescriptionLine(this.formatErwartet("A"));
                if(strings.length<2){
                    i.saveDescriptionLine(StringConstructor.toofewCmd());
                    i.setError("");
                    return false;
                }
                strings = Manipulator.splitStringHalf(strings[1],",");
                strings = this.filterForEmtpyStrings(strings);
                if(strings[0].toUpperCase() =="A"){

                    i.saveDescriptionLine(this.formatGefunden("Register A","IN A ..."));
                    i.setSecondPart(strings[0]);
                    save4(i);
                    i.saveDescriptionLine(this.formatErwartet("dat_8"));
                    consoletostring="dat_8"
                    if(strings.length<2){
                        i.saveDescriptionLine(StringConstructor.toofewCmd());
                        i.setError("");
                        return false;
                    }
                    if(this.symbollist.isConst(strings[1])){
                        if(!Manipulator.isDat_8(this.symbollist.getSpecificConstantByName(strings[1])!.getValue())){
                            this.saveExtraInfo(i,consoletostring,strings[1]);
                            // ??
                            // i.saveDescriptionLine(StringConstructor.expectedDat8ConstToBig(strings[1]));
                            i.saveDescriptionLine(StringConstructor.expectedDat8ConstToBig(strings[1]))
                            i.setError(strings[1]);
                            return false;
                        }
                        this.saveExtraInfo(i,consoletostring,strings[1]);

                        i.saveDescriptionLine(this.formatGefunden("Konstante "+strings[1],"IN A, "+strings[1]));
                        i.saveDescriptionLine(this.formatErkannt(ioAdressierung));

                        // WARNING EINSETZEN?
                        i.setThirdPart(strings[1]);
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        return true;
                    }
                    else if(Manipulator.isDat_8(strings[1])){
                        this.saveExtraInfo(i,consoletostring,strings[1]);

                        i.saveDescriptionLine(this.formatGefunden("8-bit Wert "+strings[1],"IN A, "+strings[1])); // DecOrHex
                        // i.saveDescriptionLine(this.formatGefunden("8-bit Wert "+Manipulator.formatHextoDat8(strings[1]),"IN A, "+Manipulator.formatHextoDat8(strings[1])));
                        i.saveDescriptionLine(this.formatErkannt(ioAdressierung));
                        
                        i.setThirdPart((strings[1]));
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        return true;
                    }
                    else{
                        this.saveExtraInfo(i,consoletostring,strings[1]);

                        i.saveDescriptionLine(StringConstructor.invalidCmd(strings[1]));
                        i.setError(strings[1]);
                        return false;
                    }
                }
                else{
                    this.saveExtraInfo(i,consoletostring,strings[0]);

                    i.saveDescriptionLine(StringConstructor.invalidCmd(strings[0]));
                    i.setError(strings[0]);
                    if(strings[1]!=undefined){
                        i.setRest(", "+strings[1]);
                    }
                    return false;
                }
                break;
            case 'OUT':
                i.saveDescriptionLine(this.formatGefunden("Mnemocode "+strings[0],strings[0]+" ..."))

                save3(i);
                matches=this.mnemoCommands.filter(e=>{return e.getMCode()=='OUT'});
                consoletostring="dat_8"
                
                i.saveDescriptionLine(this.formatErwartet("dat_8"));
                
                if(strings.length<2){
                    i.saveDescriptionLine(StringConstructor.toofewCmd());
                    i.setError("");
                    return false;
                }
                strings = Manipulator.splitStringHalf(strings[1],",");
                strings = this.filterForEmtpyStrings(strings);
                this.saveExtraInfo(i,consoletostring,strings[0]);
                if(this.symbollist.isConst(strings[0])){
                    if(!Manipulator.isDat_8(this.symbollist.getSpecificConstantByName(strings[0])!.getValue())){
                        // ??
                        // this.saveExtraInfo(i,consoletostring,strings[0]);
                        i.saveDescriptionLine(StringConstructor.expectedDat8ConstToBig(strings[0]));
                        // i.saveDescriptionLine(StringConstructor.expectedDat8ConstToBig(strings[0]));
                        i.setError(strings[0]);
                        return false;
                    }
                    i.saveDescriptionLine(this.formatGefunden("Konstante "+strings[0],i.getFirstPart().toUpperCase()+" "+strings[0]+" ..."))
                    // WARNING EINSETZEN?
                    i.setSecondPart(strings[0]);
                    save4(i);
                    i.saveDescriptionLine(this.formatErwartet("A"));
                    if(strings.length<2){
                        i.saveDescriptionLine(StringConstructor.toofewCmd());
                        i.setError("");
                        return false;
                    }
                    if(strings[1].toUpperCase() =="A"){
                        i.saveDescriptionLine(this.formatGefunden("Register A",i.getFirstPart().toUpperCase()+" "+strings[0]+", A"));
                        i.saveDescriptionLine(this.formatErkannt(ioAdressierung));

                        //ÄNDERUNG
                        i.setThirdPart(strings[1])
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        return true;
                    }
                    else{
                        // need?
                        // this.saveExtraInfo(i,consoletostring,strings[1]);
                        i.saveDescriptionLine(StringConstructor.invalidCmd(strings[1]));
                        i.setError(strings[1]);
                        return false;
                    }
                }
                else if(Manipulator.isDat_8(strings[0])){
                    // this.saveExtraInfo(i,consoletostring,strings[0]);
                    i.saveDescriptionLine(this.formatGefunden("8-bit Wert "+strings[0],i.getFirstPart().toUpperCase()+" "+strings[0]+" ...")); // DecOrHex
                    // i.saveDescriptionLine(this.formatGefunden("8-bit Wert "+Manipulator.formatHextoDat8(strings[0]),i.getFirstPart().toUpperCase()+" "+Manipulator.formatHextoDat8(strings[0])+" ..."));
                    
                    i.setSecondPart((strings[0]));
                    save4(i);
                    i.saveDescriptionLine(this.formatErwartet("A"));
                    if(strings.length<2){
                        i.saveDescriptionLine(StringConstructor.toofewCmd());
                        i.setError("");
                        return false;
                    }
                    if(strings[1].toUpperCase() =="A"){
                        // i.saveDescriptionLine(this.formatGefunden("Register A",i.getFirstPart().toUpperCase()+" "+Manipulator.formatHextoDat8(strings[0])+", A"));
                        i.saveDescriptionLine(this.formatGefunden("Register A",i.getFirstPart().toUpperCase()+" "+strings[0]+", A")); // DecOrHex
                        i.saveDescriptionLine(this.formatErkannt(ioAdressierung));

                        i.setThirdPart(strings[1])
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(StringConstructor.invalidCmd(strings[1]));
                        i.setError(strings[1]);
                        return false;
                    }
                }
                else{
                    // this.saveExtraInfo(i,consoletostring,strings[0]);
                    i.saveDescriptionLine(StringConstructor.invalidCmd(strings[0]));
                    i.setError(strings[0]);
                    return false;
                }
                break;
            case 'INC':case'DEC':
                i.saveDescriptionLine(this.formatGefunden("Mnemocode "+strings[0],strings[0]+" ..."))

                save3(i);
                matches=this.mnemoCommands.filter(e=>{return e.getMCode()==strings[0]});

                consoletostring = this.getDests(matches).join(", ");
                i.saveDescriptionLine(this.formatErwartet(consoletostring));
                if(strings.length<2){
                    i.saveDescriptionLine(StringConstructor.toofewCmd());
                    i.setError("");
                    return false;
                }
                toSave=strings[1];
                strings[1] = strings[1].toUpperCase();
                if(this.getDests(matches).includes(strings[1])){
                    i.saveDescriptionLine(this.formatGefunden("Register "+strings[1],strings[0]+" "+strings[1]));
                    matches =matches=matches.filter(e=>{                                     //Alle treffer auf zutreffende Register filtriert
                        if(e.getDestination() ==strings[1]){
                            return e;
                        }
                    });
                    if(matches.length==1){
                        // i.saveDescriptionLine(this.formatErkannt(registerAdressierung));

                        //ÄNDERUNG
                        i.setSecondPart(toSave);
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        //console.log(matches[0].toString());
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(StringConstructor.bugNoCommand());
                        return false;
                    }
                }
                else{
                    i.saveDescriptionLine(StringConstructor.invalidCmd(strings[1]));
                    i.setError(strings[1]);
                    return false;
                }
                break;
            case 'ADD':case'SUB':case'AND':case 'OR':case'XOR':case'CP':
                i.saveDescriptionLine(this.formatGefunden("Mnemocode "+strings[0],strings[0]+" ..."))

                save3(i);
                //ÄNDERUNG
                matches=this.mnemoCommands.filter(e=>{return e.getMCode()==strings[0]});
                consoletostring = this.getDests(matches).join(", ");
                i.saveDescriptionLine(this.formatErwartet(consoletostring));
                if(strings.length<2){
                    i.saveDescriptionLine(StringConstructor.toofewCmd());
                    i.setError("");
                    return false;
                }
                if(this.getDests(matches).includes(strings[1].toUpperCase())){
                    //ÄNDERUNG
                    toSave=strings[1];
                    strings[1]=strings[1].toUpperCase()
                    i.saveDescriptionLine(this.formatGefunden("Register "+strings[1],strings[0]+" "+strings[1]));
                    matches =matches=matches.filter(e=>{                                     //Alle treffer auf zutreffende Register filtriert
                        if(e.getDestination() ==strings[1].toUpperCase()){
                            return e;
                        }
                    });
                    if(matches.length==1){
                        i.saveDescriptionLine(this.formatErkannt(registerAdressierung));

                        //ÄNDERUNG
                        i.setSecondPart(toSave);
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        //console.log(matches[0].toString());
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(StringConstructor.bugNoCommand());
                        return false;
                    }
                }
                else if(this.symbollist.isConst(strings[1])){
                    this.saveExtraInfo(i,consoletostring,strings[1]);
                    if(!Manipulator.isDat_8(this.symbollist.getSpecificConstantByName(strings[1])!.getValue())){
                        // ??
                        // this.saveExtraInfo(i,consoletostring,strings[1]);
                        i.saveDescriptionLine(StringConstructor.expectedDat8ConstToBig(strings[1]));
                        // i.saveDescriptionLine(StringConstructor.expectedDat8ConstToBig(strings[1]));
                        i.setError(strings[1]);
                        return false;
                    }
                    i.saveDescriptionLine(this.formatGefunden("Konstante "+strings[1],strings[0]+" "+strings[1]));
                    matches =matches=matches.filter(e=>{                                     //Alle treffer auf zutreffende Register filtriert
                        if(e.getDestination() =="dat_8"){
                            return e;
                        }
                    });
                    if(matches.length==1){
                        i.saveDescriptionLine(this.formatErkannt(immediateAdressierung));

                        i.setSecondPart(strings[1]);
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        //console.log(matches[0].toString());
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(StringConstructor.bugNoCommand());
                        return false;
                    }
                }
                else if(Manipulator.isDat_8(strings[1])){
                    this.saveExtraInfo(i,consoletostring,strings[1]);

                    // i.saveDescriptionLine(this.formatGefunden("8-bit Wert "+Manipulator.formatHextoDat8(strings[1]),strings[0]+" "+Manipulator.formatHextoDat8(strings[1])));
                    i.saveDescriptionLine(this.formatGefunden("8-bit Wert "+strings[1],strings[0]+" "+strings[1])); // DecOrHex
                    matches =matches=matches.filter(e=>{                                     //Alle treffer auf zutreffende Register filtriert
                        if(e.getDestination() =="dat_8"){
                            return e;
                        }
                    });
                    if(matches.length==1){
                        i.saveDescriptionLine(this.formatErkannt(immediateAdressierung));

                        i.setSecondPart((strings[1]));
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(StringConstructor.bugNoCommand());
                        return false;
                    }
                }
                else{
                    this.saveExtraInfo(i,consoletostring,strings[1]);
                    i.saveDescriptionLine(StringConstructor.invalidCmd(strings[1]));
                    i.setError(strings[1]);
                    return true;
                }
                break;

            case 'SHL':case'SHR':case 'RCL':case'ROL':case'RCR':case'ROR':
                i.saveDescriptionLine(this.formatGefunden("Mnemocode "+strings[0],strings[0]))

                matches=this.mnemoCommands.filter(e=>{return e.getMCode()==strings[0]});
                if(strings.length>1){
                    i.saveDescriptionLine(StringConstructor.tooManyCmd());
                    i.setError(strings[1]);
                    return false;
                }
                if(matches.length==1){
                    i.saveDescriptionLine(this.formatErkannt(registerAdressierung));

                    i.setType(InputLineType.TRANSLATED);
                    i.setLength(matches[0].getSize());
                    i.setHCode(matches[0].getHexCode());
                    i.setValid(true);
                    return true;
                }
                else{
                    i.saveDescriptionLine(StringConstructor.bugNoCommand());
                    return false;
                }
                break;
            case 'JPNZ':case'JPZ':case'JPNC':case'JPC':case'JPNO':case'JPO':case'JPNS':case'JPS':
                i.saveDescriptionLine(this.formatGefunden("Mnemocode "+strings[0],strings[0]+" ..."))

                save3(i);
                matches=this.mnemoCommands.filter(e=>{return e.getMCode()==strings[0]});
                consoletostring = "label";
                i.saveDescriptionLine(this.formatErwartet(consoletostring));
                if(strings.length<2){
                    i.saveDescriptionLine(StringConstructor.toofewCmd());
                    i.setError("");
                    return false;
                }
                this.saveExtraInfo(i,consoletostring,strings[1]);
                if(this.symbollist.isLabel(strings[1]) || (this.symbollist.isEligible(strings[1]) && !this.symbollist.isConst(strings[1]))){ // MUSS label sein
                    // WARNING EINSETZEN?
                    i.saveDescriptionLine(this.formatGefunden(`Label '<span class="labelBlue">${strings[0]}</span>'`,strings[0]+" "+strings[1]));
                    matches=matches.filter(e=>{                                     //Alle treffer auf zutreffende Register filtriert
                        if(e.getDestination() =="label"){
                            return e;
                        }
                    });
                    if(!this.symbollist.isLabel(strings[1])){
                        this.symbollist.setLabelWithoutPosition(strings[1]);
                        // if(strings[1].length>erlaubteLängeL_C){
                        //     i.saveDescriptionLine(StringConstructor.warLabelZuLang(strings[1]));
                        // }
                    }
                    if(matches.length==1){
                        // i.saveDescriptionLine(this.formatErkannt(absoluteAdressierung));

                        i.setSecondPart(strings[1]);
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        return true;

                    }
                    else{
                        i.saveDescriptionLine(StringConstructor.bugNoCommand());
                        return false;
                    }
                }
                else{
                    i.saveDescriptionLine(StringConstructor.invalidCmd(strings[1]));
                    i.setError(strings[1]);
                    return false;
                }
                break;
            case 'JP':
                i.saveDescriptionLine(this.formatGefunden("Mnemocode "+strings[0],strings[0]+" ..."))

                save3(i);
                matches=this.mnemoCommands.filter(e=>{return e.getMCode()=="JP"});
                consoletostring = this.getDests(matches).join(", ");
                i.saveDescriptionLine(this.formatErwartet(consoletostring));
                if(strings.length<2){
                    i.saveDescriptionLine(StringConstructor.toofewCmd());
                    i.setError("");
                    return false;
                }
                this.saveExtraInfo(i,consoletostring,strings[1]);
                if(this.symbollist.isLabel(strings[1]) || (this.symbollist.isEligible(strings[1]) && !this.symbollist.isConst(strings[1]))){ // MUSS label sein
                    // WARNING EINSETZEN?
                    i.saveDescriptionLine(this.formatGefunden(`Label '<span class="labelBlue">${strings[1]}</span>'`,strings[0]+" "+strings[1]));
                    matches=matches.filter(e=>{                                     //Alle treffer auf zutreffende Register filtriert
                        if(e.getDestination() =="label"){
                            return e;
                        }
                    });
                    if(!this.symbollist.isLabel(strings[1])){
                        this.symbollist.setLabelWithoutPosition(strings[1]);
                        // if(strings[1].length>erlaubteLängeL_C){
                        //     i.saveDescriptionLine(StringConstructor.warLabelZuLang(strings[1]));
                        // }
                    }
                    if(matches.length==1){
                        i.saveDescriptionLine(this.formatErkannt(absoluteAdressierung));

                        i.setSecondPart(strings[1]);
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(StringConstructor.bugNoCommand());
                        return false;
                    }
                }
                else if(strings[1].toUpperCase()=="[IX]"){
                    matches=matches.filter(e=>{                                     //Alle treffer auf zutreffende Register filtriert
                        if(e.getDestination() =="[IX]"){
                            return e;
                        }
                    });
                    if(matches.length==1){
                        i.saveDescriptionLine(this.formatGefunden(`Register [IX]`,"JP [IX]"));
                        i.saveDescriptionLine(this.formatErkannt(indirekteRegAdressierung));
                        i.setSecondPart(strings[1]);
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(StringConstructor.bugNoCommand());
                        i.setError(strings[1]);
                        return false;
                    }
                }
                else{
                    i.saveDescriptionLine(StringConstructor.invalidCmd(strings[1]));
                    i.setError(strings[1]);
                    return false;
                }
                break;
            case 'CALL':
                i.saveDescriptionLine(this.formatGefunden("Mnemocode "+strings[0],strings[0]+" ..."))

                save3(i);
                matches=this.mnemoCommands.filter(e=>{return e.getMCode()=="CALL"});
                consoletostring = "label"
                i.saveDescriptionLine(this.formatErwartet(consoletostring));
                if(strings.length<2){
                    i.saveDescriptionLine(StringConstructor.toofewCmd());
                    i.setError("");
                    return false;
                }
                this.saveExtraInfo(i,consoletostring,strings[1]);
                if(this.symbollist.isLabel(strings[1]) || (this.symbollist.isEligible(strings[1]) && !this.symbollist.isConst(strings[1]))){ // MUSS label sein
                    // WARNING EINSETZEN?
                    i.saveDescriptionLine(this.formatGefunden(`Label '<span class="labelBlue">${strings[1]}</span>'`,strings[0]+" "+strings[1]));
                    matches=matches.filter(e=>{                                     //Alle treffer auf zutreffende Register filtriert
                        if(e.getDestination() =="label"){
                            return e;
                        }
                    });
                    if(!this.symbollist.isLabel(strings[1])){
                        this.symbollist.setLabelWithoutPosition(strings[1]);
                        // if(strings[1].length>erlaubteLängeL_C){
                        //     i.saveDescriptionLine(StringConstructor.warLabelZuLang(strings[1]));
                        // }
                    }
                    if(matches.length==1){
                        // i.saveDescriptionLine(this.formatErkannt(absoluteAdressierung));
                        i.setSecondPart(strings[1]);
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(StringConstructor.bugNoCommand());
                        return false;
                    }
                }
                else{
                    i.saveDescriptionLine(StringConstructor.invalidCmd(strings[1]));
                    i.setError(strings[1]);
                    return false;
                }
                break;
            case 'HALT':case 'NOP':
                i.saveDescriptionLine(this.formatGefunden("Mnemocode "+strings[0],strings[0]))

                matches=this.mnemoCommands.filter(e=>{return e.getMCode()==strings[0]});
                if(strings.length>1){
                    i.saveDescriptionLine(StringConstructor.tooManyCmd());
                    i.setError(strings[1]);
                    return false;
                }
                if(matches.length==1){
                    i.setType(InputLineType.TRANSLATED);
                    i.setLength(matches[0].getSize());
                    i.setHCode(matches[0].getHexCode());
                    i.setValid(true);
                    return true;
                }
                else{
                    i.saveDescriptionLine(StringConstructor.bugNoCommand());
                    return false;
                }
                break;
            case 'RET':
                i.saveDescriptionLine(this.formatGefunden("Mnemocode "+strings[0],strings[0]))

                matches=this.mnemoCommands.filter(e=>{return e.getMCode()=="RET"});
                if(strings.length>1){
                    i.saveDescriptionLine(StringConstructor.tooManyCmd());
                    i.setError(strings[1]);
                    return false;
                }
                if(matches.length==1){
                    i.saveDescriptionLine(this.formatErkannt(stackBefehl));

                    i.setType(InputLineType.TRANSLATED);
                    i.setLength(matches[0].getSize());
                    i.setHCode(matches[0].getHexCode());
                    i.setValid(true);
                    return true;
                }
                else{
                    i.saveDescriptionLine(StringConstructor.bugNoCommand());
                    return false;
                }
                break;
                
            default: //BUG
                i.saveDescriptionLine(StringConstructor.bugSwitchDefault());
                return false;
        }
    }

    parsetoPseudoMnemoCode(i:InputLine,strings:string[]):boolean{
        let temp: string[];
        let consoletostring;

        if(this.pseudoMCodes.includes(strings[0].toUpperCase())){ //gefunden Pseudo-MnemoCode
            this.constDefFlag=false;
            i.setFirstPart(strings[0]);
            strings[0]=strings[0].toUpperCase();
            i.saveDescriptionLine(this.formatGefunden(`Pseudo-Mnemocode ${strings[0]}`,strings[0]+" ..."));
            if(strings.length<2){
                i.saveDescriptionLine(StringConstructor.toofewCmd());
                i.setError("");
                return false;
            }
            switch(strings[0]){
                case 'RS':
                    i.saveDescriptionLine(this.formatErwartet("dat_8"));
                    save3(i);
                    consoletostring="dat_8"
                    this.saveExtraInfo(i,consoletostring,strings[1]);
                    if(Manipulator.isDat_8(strings[1])){
                        // i.saveDescriptionLine(this.formatGefunden(`8-bit Wert`,strings[0]+" "+Manipulator.formatHextoDat8(strings[1])));
                        i.saveDescriptionLine(this.formatGefunden(`8-bit Wert `+strings[1],strings[0]+" "+strings[1])); // DecOrHex
                        i.setSecondPart((strings[1]));
                        i.setLength(strings[1]); // DecOrHex ??
                        i.setType(InputLineType.TRANSLATED);
                        let Hcode="";
                        for(let i=0;i<Manipulator.hexToDec(Manipulator.formatHextoDat8(strings[1]));i++){
                            Hcode+='00';
                        }
                        i.setHCode(Hcode);
                        i.setValid(true);
                        return true;
                    }
                    else if(this.symbollist.isConst(strings[1])){
                        if(!Manipulator.isDat_8(this.symbollist.getSpecificConstantByName(strings[1])!.getValue())){
                            // ??
                            i.saveDescriptionLine(StringConstructor.expectedDat8ConstToBig(strings[1]));
                            // i.saveDescriptionLine(StringConstructor.expectedDat8ConstToBig(strings[1]));
                            i.setError(strings[1]);
                            return false;
                        }
                        i.saveDescriptionLine(this.formatGefunden("Konstante "+strings[1],strings[0]+" "+strings[1]));
                        i.setSecondPart((strings[1])); //KONST ??
                        i.setLength(Manipulator.formatHextoDat8(this.symbollist.getSpecificConstantByName(strings[1])!.getValue()));
                        i.setType(InputLineType.TRANSLATED);
                        let Hcode="";
                        for(let i=0;i<Manipulator.hexToDec(this.symbollist.getSpecificConstantByName(strings[1])!.getValue());i++){
                            Hcode+='00';
                        }
                        i.setHCode(Hcode);
                        i.setValid(true);
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(StringConstructor.invalidCmd(strings[1]));
                        // i.saveDescriptionLine(StringConstructor.expectedDat8());
                        i.setError(strings[1]);
                        return false;
                    }
                    break;

                case 'DW':
                    save3(i);
                    i.saveDescriptionLine(this.formatErwartet("dat_16"));
                    consoletostring="dat_16"
                    this.saveExtraInfo(i,consoletostring,strings[1]);
                    if(Manipulator.isDat_16(strings[1])){
                        i.saveDescriptionLine(this.formatGefunden(`16-bit Wert `+strings[1],strings[0]+" "+strings[1])); // DecOrHex
                        // i.saveDescriptionLine(this.formatGefunden(`16-bit Wert`,strings[0]+" "+Manipulator.formatHextoDat16(strings[1])));
                        i.setLength(2);
                        i.setSecondPart((strings[1]));
                        i.setType(InputLineType.TRANSLATED);
                        i.setValid(true);
                        return true;
                    }
                    else if(this.symbollist.isConst(strings[1])){
                        i.saveDescriptionLine(this.formatGefunden("Konstante "+strings[1],strings[0]+" "+strings[1]));
                        i.setLength(2);
                        i.setSecondPart((strings[1]));
                        i.setType(InputLineType.TRANSLATED);
                        i.setValid(true);
                        return true;
                    }
                    else if(strings[1].toUpperCase().startsWith("OFFSET")){
                            temp=Manipulator.splitStringHalf(strings[1]," ");
                            if(temp.length<2){
                                i.saveDescriptionLine(StringConstructor.invalidCmd(strings[1]));
                                i.setError(strings[1]);
                                return false;
                            }
                            if(this.symbollist.isLabel(temp[1])){ this.symbollist.isEligible(temp[1])
                                i.saveDescriptionLine(this.formatGefunden(`OFFSET`,"DW OFFSET "+temp[1]));
                            }
                            else if(this.symbollist.isEligible(temp[1])){
                                this.symbollist.setLabelWithoutPosition(temp[1]);
                                // if(strings[1].length>erlaubteLängeL_C){
                                //     i.saveDescriptionLine(StringConstructor.warLabelZuLang(temp[1]));
                                // }
                                i.saveDescriptionLine(this.formatGefunden(`OFFSET`,"DW OFFSET "+temp[1]));
                            }
                            else{
                                i.saveDescriptionLine(StringConstructor.noValidLabelAfterOffset());
                                i.setError(strings[1]);
                                return false;
                            }
                            i.setType(InputLineType.TRANSLATED);
                            i.setLength(2);
                            i.setSecondPart((strings[1]));
                            i.setOffsetLabel(true);
                            i.setValid(true);
                            return true;
                    }
                    else{
                        i.saveDescriptionLine(StringConstructor.invalidCmd(strings[1]));
                        // i.saveDescriptionLine(StringConstructor.expectedDat16Plus(strings[1]));
                        i.setError(strings[1]);
                        return false;
                    }
                    break;

                case 'DB':
                    save3(i);
                    i.saveDescriptionLine(this.formatErwartet("dat_8"));
                    consoletostring="dat_8"
                    this.saveExtraInfo(i,consoletostring,strings[1]);
                    if(Manipulator.isDat_8(strings[1])){
                        // i.saveDescriptionLine(this.formatGefunden(`8-bit Wert`,strings[0]+" "+Manipulator.formatHextoDat8(strings[1])));
                        i.saveDescriptionLine(this.formatGefunden(`8-bit Wert `+strings[1],strings[0]+" "+strings[1])); // DecOrHex
                        i.setLength(1);
                        i.setSecondPart((strings[1]));
                        i.setType(InputLineType.TRANSLATED);
                        i.setValid(true);
                        return true;
                    }
                    else if(this.symbollist.isConst(strings[1])){
                        if(!Manipulator.isDat_8(this.symbollist.getSpecificConstantByName(strings[1])!.getValue())){
                            i.saveDescriptionLine(StringConstructor.expectedDat8ConstToBig(strings[1]));
                            // i.saveDescriptionLine(StringConstructor.expectedDat8ConstToBig(strings[1]));
                            i.setError(strings[1]);
                            return false;
                        }
                        i.saveDescriptionLine(this.formatGefunden("Konstante "+strings[1],strings[0]+" "+strings[1]));
                        i.setLength(1);
                        i.setSecondPart(strings[1]);
                        i.setType(InputLineType.TRANSLATED);
                        i.setValid(true);
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(StringConstructor.invalidCmd(strings[1]));
                        // i.saveDescriptionLine(StringConstructor.expectedDat8Plus(strings[1]));
                        i.setError(strings[1]);
                        return false;
                    }
                    break;

                case 'ORG':
                    save3(i);
                    i.saveDescriptionLine(this.formatErwartet("dat_16"));
                    consoletostring="dat_16"
                    this.saveExtraInfo(i,consoletostring,strings[1]);
                    // console.log(strings[1]);
                    // console.log(Manipulator.isDat_16(strings[1]));
                    // console.log(this.symbollist.isConst(strings[1]));
                    if(Manipulator.isDat_16(strings[1])){
                        // i.saveDescriptionLine(this.formatGefunden(`16-bit Wert`,strings[0]+" "+Manipulator.formatHextoDat16(strings[1]))); 
                        i.saveDescriptionLine(this.formatGefunden(`16-bit Wert `+strings[1],strings[0]+" "+strings[1]));  // DecOrHex
                        i.setLength(Manipulator.hexToDec(Manipulator.formatHextoDat16(strings[1])));
                        i.setSecondPart(strings[1]);
                        i.setValid(true);
                        return true;
                    }
                    else if(this.symbollist.isConst(strings[1])){
                        i.saveDescriptionLine(this.formatGefunden("Konstante "+strings[1],strings[0]+" "+strings[1]));
                        i.setLength(Manipulator.hexToDec(this.symbollist.getSpecificConstantByName(strings[1])!.getValue()));
                        i.setSecondPart(strings[1]);
                        i.setValid(true);
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(StringConstructor.invalidCmd(strings[1]));
                        // i.saveDescriptionLine(StringConstructor.expectedDat16Plus(strings[1]));
                        i.setError(strings[1]);
                        return false;
                    }
                    break;

                case 'EXT':case 'ENT':
                    i.saveDescriptionLine(this.formatErrorMassage(`Pseudo-Mnemocode '${strings[0].toUpperCase()}' ist nicht unterstützt!`));
                    i.setFirstPart(strings[0].toUpperCase());
                    i.setError(strings[0])
                    return false;
                    break;
                
                default: 
                    i.saveDescriptionLine(StringConstructor.bugSwitchDefault());
                    i.setError(strings[1]);
                    return false;
                    break;
            }
            
        }
        else if(!this.constDefFlag){
            i.saveDescriptionLine(StringConstructor.noConstDefAllowed());
            i.setError(strings[0]);
            return false;
        }
        else if(this.symbollist.isEligible_Const(strings[0])&&!this.symbollist.isConst(strings[0])&&!this.symbollist.isLabel(strings[0]) && i.getLabel() =="" ){
            i.saveDescriptionLine(this.formatGefunden(`Konstante ${strings[0]}`,strings[0]+" ..."));
            save2(i);
            i.saveDescriptionLine(this.formatErwartet(`EQU`));
            if(strings.length<2){
                i.saveDescriptionLine(StringConstructor.toofewCmd());
                i.setError("");
                // i.setError(strings[0]);
                return false;
            }
            let new_commands=Manipulator.splitStringHalf(strings[1]," ");
            new_commands=this.filterForEmtpyStrings(new_commands);

            i.setFirstPart(strings[0]);
            if(new_commands[0].toUpperCase()=="EQU"){
                i.saveDescriptionLine(this.formatGefunden("EQU",i.getFirstPart()+" EQU"+" ..."));
                i.saveDescriptionLine(`<span class="gray">parse Operandenfeld:</span>`);
                i.saveDescriptionLine(this.formatErwartet(`dat_16`));
                i.setSecondPart(new_commands[0]);

                if(new_commands.length>1){
                    if(Manipulator.isDat_8(new_commands[1])){
                        i.saveDescriptionLine(this.formatGefunden(`8-bit Wert ${new_commands[1]}`,i.getFirstPart()+" "+new_commands[0]+" "+new_commands[1])); // DecOrHex
                        // i.saveDescriptionLine(this.formatGefunden(`8-bit Wert ${Manipulator.formatHextoDat8(new_commands[1])}`,i.getFirstPart()+" "+new_commands[0]+" "+Manipulator.formatHextoDat8(new_commands[1]))); 
                        i.setThirdPart((new_commands[1]));
                        i.setValid(true);
                        this.symbollist.setConst(strings[0],new_commands[1]);
                        return true;
                    }
                    else if(Manipulator.isDat_16(new_commands[1])){
                        // i.saveDescriptionLine(this.formatGefunden(`16-bit Wert ${Manipulator.formatHextoDat16(new_commands[1])}`,i.getFirstPart()+" "+new_commands[0]+" "+Manipulator.formatHextoDat16(new_commands[1])));
                        i.saveDescriptionLine(this.formatGefunden(`16-bit Wert ${new_commands[1]}`,i.getFirstPart()+" "+new_commands[0]+" "+new_commands[1])); // DecOrHex
                        i.setThirdPart((new_commands[1]));
                        i.setValid(true);
                        this.symbollist.setConst(strings[0],new_commands[1]);
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(StringConstructor.invalidCmd(new_commands[1]));
                        i.setError(new_commands[1]);
                        return false;
                    }
                }else{
                    i.saveDescriptionLine(StringConstructor.toofewCmd());
                    i.setError("");
                    return false;
                }
            }
            else{
                i.saveDescriptionLine(StringConstructor.invalidCmd(new_commands[0]));
                i.setError(new_commands[0]);
                i.setRest(new_commands[1]);
                return false;
            }
        }
        else if(this.symbollist.isConst(strings[0])){
            i.saveDescriptionLine(StringConstructor.errConstDef(strings[0]));
            i.setError(strings[0]);
            if(strings[1]!=undefined){
                i.setRest(" "+strings[1]);
            }
            return false;
        }
        else if(this.symbollist.isLabel(strings[0])){
            if((this.symbollist.getPositionOfSpecificLabel(strings[0])=="????")){
                i.saveDescriptionLine(StringConstructor.invalidCmd(strings[0]));
                i.setError(strings[0]);
                return false;
            }
            i.saveDescriptionLine(StringConstructor.nameTakenForLabel(strings[0]));
            i.setError(strings[0]);
            if(strings[1]!=undefined){
                i.setRest(" "+strings[1]);
            }
            return false;
        }
        else if(!this.symbollist.isEligible_Const(strings[0])){
            i.saveDescriptionLine(StringConstructor.noValidConstOrOperand(strings[0]));
            i.setError(strings[0]);
            if(strings[1]!=undefined){
                i.setRest(" "+strings[1]);
            }
            return false;
        }
        else if(i.getLabel() !=""){
            i.saveDescriptionLine(StringConstructor.noConstafterLabelDef());
            i.setError(strings[0]);
            if(strings[1]!=undefined){
                i.setRest(" "+strings[1]);
            }
            return false;
        }
        else{
            i.saveDescriptionLine(StringConstructor.invalidCmd(strings[0]));
            i.setError(strings[0]);
            return false;
        }
    }

    getDataType(addr:string):DataType{
        if(this.Regs.includes(addr)||this.pseudoMCodes.includes(addr)||this.mCodes.includes(addr)){
            return DataType.NONE;
        }
        if(addr.trim()==" " ||addr.trim()==""){
            return DataType.NONE;
        }
        if(Manipulator.isDat_8(addr)){
            return DataType.dat_8;
        }
        else if(Manipulator.isDat_16(addr)){
            return DataType.dat_16;
        }
        else if(this.symbollist.isConst(addr)){
            return DataType.CONSTANT;
        }
        else if(this.symbollist.isLabel(addr)){
            return DataType.LABEL;
        }
        else if(this.symbollist.isEligible(addr)){
            return DataType.ELLIGIBLE;
        }
        else return DataType.NONE;
    }

    saveExtraInfo(i:InputLine,consoleString:string,s:string){
        let typeData= this.getDataType(s);
        if(this.Regs.includes(s) || this.mCodes.includes(s) || this.pseudoMCodes.includes(s)){
            return;
        }
        if(consoleString.includes("dat_8")){
            switch(typeData){
                case DataType.dat_8:
                    i.saveDescriptionLine(StringConstructor.infoIsDat8());
                    return;
                
                case DataType.CONSTANT:
                    i.saveDescriptionLine(StringConstructor.infoNotDat8());
                    i.saveDescriptionLine(StringConstructor.infoIsConst(s));
                    // i.saveDescriptionLine(StringConstructor.notValidLabelSinceItsConst(s));
                    return;
                    break;
                case DataType.LABEL:
                case DataType.ELLIGIBLE:
                    i.saveDescriptionLine(StringConstructor.infoNotDat8());
                    if(this.symbollist.isEligible_Const(s)){
                        i.saveDescriptionLine(StringConstructor.infoNotConst(s));
                    }
                    else i.saveDescriptionLine(StringConstructor.infoInvalidConst(s));
                    break;
                default:
                    i.saveDescriptionLine(StringConstructor.infoNotDat8());
                    i.saveDescriptionLine(StringConstructor.infoInvalidConst(s));
                    // i.saveDescriptionLine(StringConstructor.infoNotDat8());
                    break;
            }
        }
        else if(consoleString.includes("dat_16")){
            switch(typeData){
                case DataType.dat_8:
                case DataType.dat_16:
                    i.saveDescriptionLine(StringConstructor.infoIsDat16());
                    return;
                case DataType.CONSTANT:
                    i.saveDescriptionLine(StringConstructor.infoNotDat16());
                    i.saveDescriptionLine(StringConstructor.infoIsConst(s));
                    return;
                    // i.saveDescriptionLine(StringConstructor.notValidLabelSinceItsConst(s));
                    // return;
                    break;
                case DataType.LABEL:
                case DataType.ELLIGIBLE:
                    i.saveDescriptionLine(StringConstructor.infoNotDat16());
                    if(this.symbollist.isEligible_Const(s)){
                        i.saveDescriptionLine(StringConstructor.infoNotConst(s));
                    }
                    else i.saveDescriptionLine(StringConstructor.infoInvalidConst(s));
                    break;
                default:
                    i.saveDescriptionLine(StringConstructor.infoNotDat16());
                    i.saveDescriptionLine(StringConstructor.infoInvalidConst(s));
                    // i.saveDescriptionLine(StringConstructor.infoNotDat8());
                    break;
            }
        }
        if(consoleString.includes("label")){
            switch(typeData){
                case DataType.CONSTANT:
                    i.saveDescriptionLine(StringConstructor.notValidLabelSinceItsConst(s));
                    break;
                case DataType.ELLIGIBLE:
                case DataType.LABEL:
                    // i.saveDescriptionLine(StringConstructor.infoIsLabel(s));
                    return;
                default:
                    i.saveDescriptionLine(StringConstructor.infoInvalidLabel(s));
                    break;
            }
        }
        return;
    }

    getMaxLen(m:MnemoCommand[]):number{
        let n:number[]=[];
        m.forEach(e=>{
            if(!n.includes(e.getLength())){
                n.push(e.getLength())
            }
        });
        return Math.max(...n); 
    }

    getCommands=():MnemoCommand[]=>{
        return this.mnemoCommands;
    }

    getMCodes():string[]{
        let addr:string[]=[];
        this.mnemoCommands.forEach(element=>{
            if(!addr.includes(element.getMCode())){
                addr.push(element.getMCode());
            }
        })
        return addr;
    }

    getDests(commands:MnemoCommand[]):string[]{
        let addr:string[]=[];
        commands.forEach(element=>{
            if(!addr.includes(element.getDestination())&&element.getDestination()!=""){
                addr.push(element.getDestination());
            }
        })
        return addr;
    }

    getScources(commands:MnemoCommand[]):string[]{
        let addr:string[]=[];
        commands.forEach(element=>{
            if(!addr.includes(element.getSource())&&element.getSource()!=""){
                addr.push(element.getSource());
            }
        })
        return addr;
    }
    
}