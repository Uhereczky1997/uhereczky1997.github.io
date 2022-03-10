import { MnemoCommand } from "./MnemoCommand";
import { Manipulator } from "./Manipulator";
import { SymbolList } from "./SymbolList";
import { InputLine } from "./InputLine";
import { InputLineType, DataType } from "./Enums";


const parse1:string = `<span class="gray">parse Labelfeld/Befehlsfeld ...</span>`;
const parse2:string = `<span class="gray">parse Befehlsfeld ...</span>`;
const parse3:string = `<span class="gray">parse Operandenfeld (1) ...</span>`;
const parse4:string = `<span class="gray">parse Operandenfeld (2) ...</span>`;
const parse5:string = `<span class="gray">gesamter Befehl:</span>`;

const addressierungDirekt:string = `erkannt Direkte Adressierung`;
const addressierungIndirekt:string = `erkannt Indirekte Adressierung`;
const addressierungEinAusgabe:string = ``;
const addressierungImmediate:string = `erkannt Immediate Adressierung`;


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

    private constructor(){
    }
    public static getInstance(){
        if(!CommandMap.instance){
            CommandMap.instance= new CommandMap();
        }
        return CommandMap.instance;
    }

    formatGefunden(s1:string,s2:string):string{
        // return 'gefunden: '+(s1!=""?s1+' ':"")+'-> '+s2;
        return `<span class="eingeruckt">gefunden: ${s1!=""?s1+' ':""} -> ${s2}</span>`;
    }
    
    formatErwartet(s1:string):string{
        // return 'erwarte: '+s1;
        return `<span class="eingeruckt">erwarte: ${s1}</span>`;
    }
    formatErrorMassage(s1:string):string{
        return `<span class="errorRed">error: ${s1}</span>`;
    }
    filterForEmtpyStrings(s:string[]):string[]{
        return s.filter(e=>{ if(!/^[\s+]/g.test(e) && e!=""){return e;}});
    }

    mapInputLineByCase(i:InputLine):boolean{
        let strings:string[] = Manipulator.splitStringHalf(i.getInitialLine(),';');
        let commandLine = strings[0];
        if(strings.length>1){
        i.setComment(strings[1].trim());}
        saveInput(i,1);
        i.saveDescriptionLine(this.formatErwartet(`Labeldefinition, Mnemocode oder Konstante (+EQU)`));
        if(commandLine.includes(":")){
            strings=Manipulator.splitStringHalf(commandLine,":");
            if(this.symbollist.isLabel(strings[0])){
                if(this.symbollist.getPositionOfSpecificLabel(strings[0])!=undefined){
                    i.saveDescriptionLine(this.formatErrorMassage(`Label ${strings[0]} ist schon bereits besetzt`))
                    i.setError(strings[0]);
                    i.setRest(": "+strings[1]);
                    return false;
                }
            }
            if(!this.symbollist.isEligible(strings[0])){
                i.saveDescriptionLine(this.formatErrorMassage(`${strings[0]} kein gülitger Label`))
                i.setError(strings[0]);
                i.setRest(": "+strings[1]);
                return false;
            }
            else{
                i.saveDescriptionLine(this.formatGefunden("Doppelpunkte ","Label '"+strings[0]+"'"));
                i.setLabelTo(strings[0]);
                this.symbollist.setLabelWithoutPosition(strings[0]);
                saveInput(i,2);
                i.saveDescriptionLine(this.formatErwartet("(Pseudo-)Mnemocode"));
                commandLine=strings[1];
            }
        }
        strings = Manipulator.splitStringHalf(commandLine," ");
        strings = this.filterForEmtpyStrings(strings);
        if(this.mCodes.includes(strings[0].toUpperCase())){
            strings[0] = strings[0].toUpperCase();
            i.saveDescriptionLine(this.formatGefunden("Mnemocode "+strings[0],strings[0]))
            i.setFirstPart(strings[0]);
           return this.parseToMnemoCode(i,strings);
        }
        else if(this.pseudoMCodes.includes(strings[0].toUpperCase()) || this.symbollist.isEligible(strings[0])){
            return this.parsetoPseudoMnemoCode(i,strings);
        }
        else {
            i.saveDescriptionLine(this.formatErrorMassage(`${strings[0]} ist kein gültiger (Pseudo-)Mnemocode oder Label/Konstante`));
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
        strings[0]=strings[0].toUpperCase();
        switch(strings[0]){
            case 'MOV':
                save3(i);
                matches=this.mnemoCommands.filter(e=>{return e.getMCode()=='MOV'}); //Alle treffer auf MOV Codes filtriert
                consoletostring=this.getDests(matches).join(", ");
                i.saveDescriptionLine(this.formatErwartet(consoletostring));        //Ausgabe von erwartetten Befehlen
                if(strings.length<2){
                    i.saveDescriptionLine(this.formatErrorMassage("fehlende Operand!")); //ERROR
                    return false;
                }
                strings=Manipulator.splitStringHalf(strings[1],",");
                strings = this.filterForEmtpyStrings(strings);
                if(this.getDests(matches).includes(strings[0].toUpperCase())&&this.Regs.includes(strings[0].toUpperCase())){ // A || B || C || IX || HL || SP
                    strings[0] = strings[0].toUpperCase();
                    i.saveDescriptionLine(this.formatGefunden("Register "+strings[0],i.getFirstPart()+" "+strings[0]));
                    i.setSecondPart(strings[0]);
                    matches=matches.filter(e=>{                                     //Alle treffer auf zutreffende Register filtriert
                        if(e.getDestination() ==strings[0]){
                            return e;
                        }
                    });
                    consoletostring=this.getScources(matches).join(", ");
                    save4(i);
                    i.saveDescriptionLine(this.formatErwartet(consoletostring.replace("dat_8","Wert/Konstante (8-bit)").replace("dat_16","Wert/Konstante (16-bit)")));    //Ausgabe von erwartetten Befehlen
                    if(strings.length<2){
                        i.saveDescriptionLine(this.formatErrorMassage("zu wenig Operanden Spezifiziert!")); //ERROR
                        return false;
                    }

                    if(this.getScources(matches).includes(strings[1].toUpperCase())&&this.Regs.includes(strings[1].toUpperCase())){ // A || B || C || [HL]
                        strings[1] = strings[1].toUpperCase();
                        i.saveDescriptionLine(this.formatGefunden("Register "+strings[1],i.getFirstPart()+" "+i.getSecondPart()+", "+strings[1]));
                        
                        matches=matches.filter(e=>{                                     //Alle treffer auf zutreffende Register filtriert
                            if(e.getSource() ==strings[1]){
                                return e;
                            }
                        });
                        //console.log(matches);
                        if(matches.length==1){
                            i.setThirdPart(strings[1]);
                            i.setType(InputLineType.TRANSLATED);
                            i.setLength(matches[0].getSize());
                            i.setHCode(matches[0].getHexCode());
                            i.setValid(true);
                            //console.log(matches[0].toString());
                            return true;
                        }
                        else{
                            i.saveDescriptionLine(this.formatErrorMassage("keine passende Befehl gefunden!"));
                            return false;
                        }
                    }
                    else if(this.getDataType(strings[1]) != DataType.NONE){
                        let type:DataType=this.getDataType(strings[1]);
                        switch(type){

                            case DataType.dat_8:
                                if(consoletostring.includes("dat_8")){
                                    //i.saveDescriptionLine(`Gefunden -> 'dat_8'`);
                                    i.saveDescriptionLine(this.formatGefunden("Wert/Konstante (8-bit) "+Manipulator.formatHextoDat8(strings[1]),i.getFirstPart()+" "+i.getSecondPart()+", "+Manipulator.formatHextoDat8(strings[1])));

                                    matches=matches.filter(e=>{
                                        if(e.getSource()=="dat_8"){
                                            return e;
                                        }
                                        });
                                    i.setThirdPart(Manipulator.formatHextoDat8(strings[1]));
                                    break;
                                }else if(consoletostring.includes("dat_16")){
                                    //i.saveDescriptionLine(`Gefunden -> 'dat_16'`);
                                    i.saveDescriptionLine(this.formatGefunden("Wert/Konstante (16-bit) "+Manipulator.formatHextoDat16(strings[1]),i.getFirstPart()+" "+i.getSecondPart()+", "+Manipulator.formatHextoDat16(strings[1])));
                                    matches=matches.filter(e=>{
                                        if(e.getSource()=="dat_16"){
                                            return e;
                                        }
                                        });
                                    i.setThirdPart(Manipulator.formatHextoDat16(strings[1]));
                                    break;
                                }
                                else if(consoletostring.includes("dat_8")){
                                    i.saveDescriptionLine(this.formatErrorMassage(`erwartet war Wert/Konstante (8-bit), ${strings[1]} ist kein gültiger Operand`));
                                    i.setError(strings[1]);
                                    i.setValid(false);
                                    return false;
                                }
                                else{
                                    i.saveDescriptionLine(this.formatErrorMassage(`${strings[1]} ist kein gültiger Operand`));
                                    i.setError(strings[1]);
                                    i.setValid(false);
                                    return false;
                                }
                            case DataType.dat_16:
                                if(consoletostring.includes("dat_16") && ['HL','SP','IX'].includes(strings[0])){
                                    //i.saveDescriptionLine(`Gefunden -> 'dat_16'`);
                                    i.saveDescriptionLine(this.formatGefunden("Wert/Konstante (16-bit) "+Manipulator.formatHextoDat16(strings[1]),i.getFirstPart()+" "+i.getSecondPart()+", "+Manipulator.formatHextoDat16(strings[1])));
                                    matches=matches.filter(e=>{
                                        if(e.getSource()=="dat_16"){
                                            return e;
                                        }
                                        });
                                    i.setThirdPart(Manipulator.formatHextoDat16(strings[1]));
                                    break;
                                }
                                else{
                                    i.saveDescriptionLine(this.formatErrorMassage(`${strings[1]} ist ein ungültiger Operand!`));
                                    i.setError(strings[1]);
                                    i.setValid(false);
                                    return false;
                                }
                                break;
                            case DataType.CONSTANT:

                                if(!consoletostring.includes("dat_8")||!consoletostring.includes("dat_16")){
                                    i.saveDescriptionLine(this.formatErrorMassage(`${strings[1]} ist ein ungülitger Operand!`));
                                    i.setError(strings[1]);
                                    i.setValid(false);
                                    return false;
                                }
                                let value = this.symbollist.getSpecificConstantByName(strings[1])?.getValue()
                                //i.saveDescriptionLine(`Gefunden Constante mit dem Wert ${value}`);
                                if(value==undefined){
                                    i.saveDescriptionLine(this.formatErrorMassage(`Wert für Konstante ${strings[1]} nicht gefunden!`));
                                    i.setError(strings[1]);
                                    return false;
                                }
                                i.saveDescriptionLine(this.formatGefunden("Konstante"+strings[1]+" mit dem Wert "+value,i.getFirstPart()+" "+i.getSecondPart()+", "+strings[1]));
                                type = this.getDataType(value)
                                if(consoletostring.includes("dat_8")&&type==DataType.dat_8){ //Konstante hat Datentyp 'dat_8'
                                    //i.saveDescriptionLine(`Größe von ${strings[1]} ist 'dat_8'`);
                                    matches=matches.filter(e=>{
                                        if(e.getSource()=="dat_8"){
                                            return e;
                                        }
                                    });
                                    //i.setThirdPart(Manipulator.formatHextoDat8(commands[1]));
                                    break;
                                }
                                else if(consoletostring.includes("dat_16")){ //Konstante hat Datentyp 'dat_16'
                                    //i.saveDescriptionLine(`Größe von ${strings[1]} ist 'dat_16'`);
                                    matches=matches.filter(e=>{
                                    if(e.getSource()=="dat_16"){
                                        return e;
                                    }
                                    });
                                    //i.setThirdPart(Manipulator.formatHextoDat16(commands[1]));
                                    break;
                                }
                                else if(consoletostring.includes("dat_8")){
                                    i.saveDescriptionLine(this.formatErrorMassage(`erwartet war Wert/Konstante (8-bit), ${strings[1]} ist ein ungültiger Operand`));
                                    i.setError(strings[1]);
                                    i.setValid(false);
                                    return false;
                                }
                                else{
                                    i.saveDescriptionLine(this.formatErrorMassage(`${strings[1]} ist ein ungültiger Operand!`));
                                    i.setError(strings[1]);
                                    return false;
                                }
                                break;
                            case DataType.LABEL:
                                if(!consoletostring.includes("label")){
                                    i.saveDescriptionLine(this.formatErrorMassage(`${strings[1]} ist ein ungültiger Operand!`));
                                    i.setError(strings[1]);
                                    i.setValid(false);
                                    return false;
                                }
                                //i.saveDescriptionLine(`Gefunden 'label'\n ${commands[1]} ist ein bereits existierender 'label'`);
                                let value1 = this.symbollist.getSpecificLabelByName(strings[1]);
                                i.saveDescriptionLine(this.formatGefunden("Label "+`'${value1?.getName()}'`,i.getFirstPart()+" "+i.getSecondPart()+", "+value1?.getName()));
                                i.setThirdPart(strings[1]);
                                matches=matches.filter(e=>{
                                    if(e.getSource()=="label"){
                                        return e;
                                    }
                                })
                                break;
                            case DataType.ELLIGIBLE:
                                if(!consoletostring.includes("label")){
                                    i.saveDescriptionLine(this.formatErrorMassage(`${strings[1]} ist ein ungültiger Operand!`));
                                    i.setError(strings[1]);
                                    i.setValid(false);
                                    return false;
                                }
                                //i.saveDescriptionLine(`Gefunden 'label'\n ${strings[1]} als neue 'label' definiert`);
                                this.symbollist.setLabelWithoutPosition(strings[1]);
                                i.saveDescriptionLine(this.formatGefunden("Label "+`'${strings[1]}'`,i.getFirstPart()+" "+i.getSecondPart()+", "+strings[1]));
                                i.setThirdPart(strings[1]);
                                matches=matches.filter(e=>{
                                    if(e.getSource()=="label"){
                                        return e;
                                    }
                                })

                                break;
                            default: 
                                i.saveDescriptionLine(this.formatErrorMassage("Something went wrong!"));
                                return false;
                        }
                        if(matches.length==1){
                            i.setThirdPart(strings[1]);
                            i.setType(InputLineType.TRANSLATED);
                            i.setLength(matches[0].getSize());
                            i.setHCode(matches[0].getHexCode());
                            i.setValid(true);
                            //console.log(matches[0].toString());
                            return true;
                        }
                        else{
                            i.saveDescriptionLine(this.formatErrorMassage("keine passende Befehl gefunden!"));
                            return false;
                        }
                    }
                    else{
                        i.saveDescriptionLine(this.formatErrorMassage(`${strings[1]} kein gültiger Operand`));
                        i.setError(strings[1]);
                        return false;
                    }
                }
                else if(this.symbollist.isLabel(strings[0]) || this.symbollist.isEligible(strings[0])){ // MUSS label sein
                    i.saveDescriptionLine(this.formatGefunden("Label '"+strings[0]+"'",i.getFirstPart()+" "+strings[0]))
                    matches=matches.filter(e=>{                                     //Alle treffer auf zutreffende Register filtriert
                        if(e.getDestination() =="label"){
                            return e;
                        }
                    });
                    i.setSecondPart(strings[0]);
                    if(!this.symbollist.isLabel(strings[0])){
                        this.symbollist.setLabelWithoutPosition(strings[0]);
                        // i.saveDescriptionLine(`Neue Label angesetzt!`);
                    }
                    save4(i);
                    consoletostring=this.getScources(matches).join(", ");
                    i.saveDescriptionLine(this.formatErwartet(consoletostring));    //Ausgabe von erwartetten Befehlen
                    if(strings.length<2){
                        i.saveDescriptionLine(this.formatErrorMassage("fehlender Operand!"));
                        return false;
                    }
                    if(this.getScources(matches).includes(strings[1].toUpperCase())){
                        strings[1] = strings[1].toUpperCase();
                        i.saveDescriptionLine(this.formatGefunden("Register "+strings[1],i.getFirstPart()+" "+i.getFirstPart()+strings[1]))
                        matches=matches.filter(e=>{                                     //Alle treffer auf zutreffende Register filtriert
                            if(e.getSource() ==strings[1]){
                                return e;
                            }
                        });
                        if(matches.length==1){
                            i.setThirdPart(strings[1]);
                            i.setType(InputLineType.TRANSLATED);
                            i.setLength(matches[0].getSize());
                            i.setHCode(matches[0].getHexCode());
                            i.setValid(true);
                            //console.log(matches[0].toString());
                            return true;
                        }
                        else{
                            i.saveDescriptionLine(this.formatErrorMassage("keine passende Befehl gefunden!"));
                            return false;
                        }
                    }
                    else{
                        i.saveDescriptionLine(this.formatErrorMassage(`${strings[1]} ist kein gültiger Operand!`));
                        i.setError(strings[1]);
                        return false;
                    }
                }
                else{
                    i.saveDescriptionLine(this.formatErrorMassage(`${strings[0]} kein gültiger Operand!`));
                    i.setError(strings[0]);
                    if(strings[1]!=undefined){
                        i.setRest(", "+strings[1]);
                    }
                    return false;
                }
                break;
            case 'PUSH':
                matches=this.mnemoCommands.filter(e=>{return e.getMCode()=='PUSH'});
                if(strings.length>1){
                    i.saveDescriptionLine(this.formatErrorMassage("zu viele Operanden!"));
                    i.setError(strings[1]);
                    return false;
                }
                else{
                    i.setType(InputLineType.TRANSLATED);
                    i.setLength(matches[0].getSize());
                    i.setHCode(matches[0].getHexCode());
                    i.setValid(true);
                    return true;
                    }
                break;
            case 'POP':
                matches=this.mnemoCommands.filter(e=>{return e.getMCode()=='POP'});
                if(strings.length>1){
                    i.saveDescriptionLine(this.formatErrorMassage("zu viele Operanden!"));
                    i.setError(strings[1]);
                    return false;
                }
                else{
                    i.setType(InputLineType.TRANSLATED);
                    i.setLength(matches[0].getSize());
                    i.setHCode(matches[0].getHexCode());
                    i.setValid(true);
                    return true;
                    }
                break;
            case 'IN':
                save3(i);
                matches=this.mnemoCommands.filter(e=>{return e.getMCode()=='IN'});
                i.saveDescriptionLine(this.formatErwartet("A"));
                if(strings.length<2){
                    i.saveDescriptionLine(this.formatErrorMassage("fehlender Operand!"));
                    return false;
                }
                strings = Manipulator.splitStringHalf(strings[1],",");
                strings = this.filterForEmtpyStrings(strings);
                if(strings[0] =="A"){
                    i.saveDescriptionLine(this.formatGefunden("Register A",i.getFirstPart()+" "+strings[0]));
                    i.setSecondPart(strings[0]);
                    save4(i);
                    i.saveDescriptionLine(this.formatErwartet("Wert/Konstante (8-bit)"));
                    if(strings.length<2){
                        i.saveDescriptionLine(this.formatErrorMassage("fehlender Operand!"));
                        return false;
                    }
                    if(this.symbollist.isConst(strings[1])){
                        i.saveDescriptionLine(this.formatGefunden("Konstante "+strings[1],i.getFirstPart()+" "+i.getSecondPart()+", "+strings[1]))
                        i.setThirdPart(strings[1]);
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        return true;
                    }
                    else if(Manipulator.isDat_8(strings[1])){
                        i.saveDescriptionLine(this.formatGefunden("Wert (8-bit) "+Manipulator.formatHextoDat8(strings[1]),i.getFirstPart()+" "+i.getSecondPart()+", "+Manipulator.formatHextoDat8(strings[1])));
                        i.setThirdPart(Manipulator.formatHextoDat8(strings[1]));
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(this.formatErrorMassage(`${strings[1]} kein gültiger Operand!`));
                        i.setError(strings[1]);
                        return false;
                    }
                }
                else{
                    i.saveDescriptionLine(this.formatErrorMassage(`${strings[0]} kein gültiger Operand!`));
                    i.setError(strings[0]);
                    if(strings[1]!=undefined){
                        i.setRest(", "+strings[1]);
                    }
                    return false;
                }
                break;
            case 'OUT':
                save3(i);
                matches=this.mnemoCommands.filter(e=>{return e.getMCode()=='OUT'});
                i.saveDescriptionLine(this.formatErwartet("Wert/Konstante (8-bit)"));
                
                if(strings.length<2){
                    i.saveDescriptionLine(this.formatErrorMassage("fehlender Operand!"));
                    return false;
                }
                strings = Manipulator.splitStringHalf(strings[1],",");
                strings = this.filterForEmtpyStrings(strings);
                if(this.symbollist.isConst(strings[0])){
                    i.saveDescriptionLine(this.formatGefunden("Konstante "+strings[0],i.getFirstPart()+" "+strings[0]))
                    i.setSecondPart(strings[0]);
                    save4(i);
                    i.saveDescriptionLine(this.formatErwartet("A"));
                    if(strings.length<2){
                        i.saveDescriptionLine(this.formatErrorMassage("fehlender Operand!"));
                        return false;
                    }
                    if(strings[1].toUpperCase() =="A"){
                        i.saveDescriptionLine(this.formatGefunden("Register A",i.getFirstPart()+" "+i.getSecondPart()+", A"));
                        i.setThirdPart(strings[1].toUpperCase())
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(this.formatErrorMassage(strings[1]+" ist kein gültiger Operand!"));
                        i.setError(strings[1]);
                        return false;
                    }
                }
                else if(Manipulator.isDat_8(strings[0])){
                    i.saveDescriptionLine(this.formatGefunden("Wert (8-bit) "+Manipulator.formatHextoDat8(strings[0]),i.getFirstPart()+" "+Manipulator.formatHextoDat8(strings[0])));
                    i.setSecondPart(Manipulator.formatHextoDat8(strings[0]));
                    save4(i);
                    i.saveDescriptionLine(this.formatErwartet("A"));
                    if(strings.length<2){
                        i.saveDescriptionLine(this.formatErrorMassage("fehlender Operand!"));
                        return false;
                    }
                    if(strings[1].toUpperCase() =="A"){
                        i.saveDescriptionLine(this.formatGefunden("Register A",i.getFirstPart()+" "+i.getSecondPart()+", A"));
                        i.setThirdPart(strings[1].toUpperCase())
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(this.formatErrorMassage(strings[1]+" ist kein gültiger Operand!"));
                        i.setError(strings[1]);
                        return false;
                    }
                }
                else{
                    i.saveDescriptionLine(this.formatErrorMassage(`${strings[0]} kein gültiger Operand!`));
                    i.setError(strings[0]);
                    return false;
                }
                break;
            case 'INC':case'DEC':
                save3(i);
                matches=this.mnemoCommands.filter(e=>{return e.getMCode()==i.getFirstPart()});
                consoletostring = this.getDests(matches).join(", ");
                i.saveDescriptionLine(this.formatErwartet(consoletostring));
                if(strings.length<2){
                    i.saveDescriptionLine(this.formatErrorMassage("fehlender Operand!"));
                    return false;
                }
                strings[1] = strings[1].toUpperCase();
                if(this.getDests(matches).includes(strings[1])){
                    i.saveDescriptionLine(this.formatGefunden("Register "+strings[1],i.getFirstPart()+" "+strings[1]));
                    matches =matches=matches.filter(e=>{                                     //Alle treffer auf zutreffende Register filtriert
                        if(e.getDestination() ==strings[1]){
                            return e;
                        }
                    });
                    if(matches.length==1){
                        i.setSecondPart(strings[1]);
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        //console.log(matches[0].toString());
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(this.formatErrorMassage("keine passende Befehl gefunden!"));
                        return false;
                    }
                }
                else{
                    i.saveDescriptionLine(this.formatErrorMassage(strings[1]+" ist kein gültiger Operand!"));
                    i.setError(strings[1]);
                    return true;
                }
                break;
            case 'ADD':case'SUB':case'AND':
                save3(i);
                matches=this.mnemoCommands.filter(e=>{return e.getMCode()==i.getFirstPart()});
                consoletostring = this.getDests(matches).join(", ");
                i.saveDescriptionLine(this.formatErwartet(consoletostring));
                if(strings.length<2){
                    i.saveDescriptionLine(this.formatErrorMassage("fehlender Operand!"));
                    return false;
                }
                if(this.getDests(matches).includes(strings[1].toUpperCase())){
                    strings[1]=strings[1].toUpperCase()
                    i.saveDescriptionLine(this.formatGefunden("Register "+strings[1],i.getFirstPart()+" "+strings[1]));
                    matches =matches=matches.filter(e=>{                                     //Alle treffer auf zutreffende Register filtriert
                        if(e.getDestination() ==strings[1].toUpperCase()){
                            return e;
                        }
                    });
                    if(matches.length==1){
                        i.setSecondPart(strings[1]);
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        //console.log(matches[0].toString());
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(this.formatErrorMassage("keine passende Befehl gefunden!"));
                        return false;
                    }
                }
                else if(this.symbollist.isConst(strings[1])){
                    
                    i.saveDescriptionLine(this.formatGefunden("Konstante "+strings[1],i.getFirstPart()+" "+strings[1]));
                    matches =matches=matches.filter(e=>{                                     //Alle treffer auf zutreffende Register filtriert
                        if(e.getDestination() =="dat_8"){
                            return e;
                        }
                    });
                    if(matches.length==1){
                        i.setSecondPart(strings[1]);
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        //console.log(matches[0].toString());
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(this.formatErrorMassage("keine passende Befehl gefunden!"));
                        return false;
                    }
                }
                else if(Manipulator.isDat_8(strings[1])){
                    i.saveDescriptionLine(this.formatGefunden("Wert (8-bit) "+Manipulator.formatHextoDat8(strings[1]),i.getFirstPart()+" "+Manipulator.formatHextoDat8(strings[1])));
                    matches =matches=matches.filter(e=>{                                     //Alle treffer auf zutreffende Register filtriert
                        if(e.getDestination() =="dat_8"){
                            return e;
                        }
                    });
                    if(matches.length==1){
                        i.setSecondPart(Manipulator.formatHextoDat8(strings[1]));
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        //console.log(matches[0].toString());
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(this.formatErrorMassage("keine passende Befehl gefunden!"));
                        return false;
                    }
                }
                else{
                    i.saveDescriptionLine(this.formatErrorMassage(strings[1]+" ist kein gültiger Operand!"));
                    i.setError(strings[1]);
                    return true;
                }
                break;
            case 'OR':case'XOR':case'CP':
                save3(i);
                matches=this.mnemoCommands.filter(e=>{return e.getMCode()==i.getFirstPart()});
                consoletostring = this.getDests(matches).join(", ");
                i.saveDescriptionLine(this.formatErwartet(consoletostring));
                if(strings.length<2){
                    i.saveDescriptionLine(this.formatErrorMassage("fehlender Operand!"));
                    return false;
                }
                if(this.getDests(matches).includes(strings[1].toUpperCase())){
                    strings[1]=strings[1].toUpperCase()
                    i.saveDescriptionLine(this.formatGefunden("Register "+strings[1],i.getFirstPart()+" "+strings[1]));
                    matches =matches=matches.filter(e=>{                                     //Alle treffer auf zutreffende Register filtriert
                        if(e.getDestination() ==strings[1].toUpperCase()){
                            return e;
                        }
                    });
                    if(matches.length==1){
                        i.setSecondPart(strings[1]);
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        //console.log(matches[0].toString());
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(this.formatErrorMassage("keine passende Befehl gefunden!"));
                        return false;
                    }
                }
                else if(this.symbollist.isConst(strings[1])){
                    
                    i.saveDescriptionLine(this.formatGefunden("Konstante "+strings[1],i.getFirstPart()+" "+strings[1]));
                    matches =matches=matches.filter(e=>{                                     //Alle treffer auf zutreffende Register filtriert
                        if(e.getDestination() =="dat_8"){
                            return e;
                        }
                    });
                    if(matches.length==1){
                        i.setSecondPart(strings[1]);
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        //console.log(matches[0].toString());
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(this.formatErrorMassage("keine passende Befehl gefunden!"));
                        return false;
                    }
                }
                else if(Manipulator.isDat_8(strings[1])){
                    i.saveDescriptionLine(this.formatGefunden("Wert (8-bit) "+Manipulator.formatHextoDat8(strings[1]),i.getFirstPart()+" "+Manipulator.formatHextoDat8(strings[1])));
                    matches =matches=matches.filter(e=>{                                     //Alle treffer auf zutreffende Register filtriert
                        if(e.getDestination() =="dat_8"){
                            return e;
                        }
                    });
                    if(matches.length==1){
                        i.setSecondPart(Manipulator.formatHextoDat8(strings[1]));
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        //console.log(matches[0].toString());
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(this.formatErrorMassage("keine passende Befehl gefunden!"));
                        return false;
                    }
                }
                else{
                    i.saveDescriptionLine(this.formatErrorMassage(strings[1]+" ist kein gültiger Operand!"));
                    i.setError(strings[1]);
                    return true;
                }
                break;
            case 'SHL':case'SHR':
                matches=this.mnemoCommands.filter(e=>{return e.getMCode()==i.getFirstPart()});
                if(strings.length>1){
                    i.saveDescriptionLine(this.formatErrorMassage("zu viel Operanden!"));
                    i.setError(strings[1]);
                    return false;
                }
                if(matches.length==1){
                    i.setType(InputLineType.TRANSLATED);
                    i.setLength(matches[0].getSize());
                    i.setHCode(matches[0].getHexCode());
                    i.setValid(true);
                    //console.log(matches[0].toString());
                    return true;
                }
                else{
                    i.saveDescriptionLine(this.formatErrorMassage("keine passende Befehl gefunden!"));
                    return false;
                }
            case 'RCL':case'ROL':case'RCR':case'ROR':
                matches=this.mnemoCommands.filter(e=>{return e.getMCode()==i.getFirstPart()});
                if(strings.length>1){
                    i.saveDescriptionLine(this.formatErrorMassage("zu viel Operanden!"));
                    i.setError(strings[1]);
                    return false;
                }
                if(matches.length==1){
                    i.setType(InputLineType.TRANSLATED);
                    i.setLength(matches[0].getSize());
                    i.setHCode(matches[0].getHexCode());
                    i.setValid(true);
                    //console.log(matches[0].toString());
                    return true;
                }
                else{
                    i.saveDescriptionLine(this.formatErrorMassage("keine passende Befehl gefunden!"));
                    return false;
                }
            case 'JPNZ':case'JPZ':case'JPNC':case'JPC':case'JPNO':case'JPO':case'JPNS':case'JPS':
                save3(i);
                matches=this.mnemoCommands.filter(e=>{return e.getMCode()==i.getFirstPart()});
                consoletostring = this.getDests(matches).join(", ");
                i.saveDescriptionLine(this.formatErwartet(consoletostring));
                if(strings.length<2){
                    i.saveDescriptionLine(this.formatErrorMassage("fehlende Operanden!"));
                    return false;
                }
                if(this.symbollist.isLabel(strings[1]) || this.symbollist.isEligible(strings[1])){ // MUSS label sein
                    i.saveDescriptionLine(this.formatGefunden("Label '"+strings[1]+"'",i.getFirstPart()+" "+strings[1]));
                    matches=matches.filter(e=>{                                     //Alle treffer auf zutreffende Register filtriert
                        if(e.getDestination() =="label"){
                            return e;
                        }
                    });
                    if(!this.symbollist.isLabel(strings[1])){
                        this.symbollist.setLabelWithoutPosition(strings[1]);
                        // i.saveDescriptionLine(`Neue Label angesetzt!`);
                    }
                    if(matches.length==1){
                        i.setSecondPart(strings[1]);
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        //console.log(matches[0].toString());
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(this.formatErrorMassage("keine passende Befehl gefunden!"));
                        return false;
                    }
                }
                else{
                    i.saveDescriptionLine(this.formatErrorMassage(strings[1]+" ist kein gültiger Operand!"));
                    i.setError(strings[1]);
                    return false;
                }
                break;
            case 'JP':
                save3(i);
                matches=this.mnemoCommands.filter(e=>{return e.getMCode()=="JP"});
                consoletostring = this.getDests(matches).join(", ");
                i.saveDescriptionLine(this.formatErwartet(consoletostring));
                if(strings.length<2){
                    i.saveDescriptionLine(this.formatErrorMassage("fehlende Operanden!"));
                    return false;
                }
                if(this.symbollist.isLabel(strings[1]) || this.symbollist.isEligible(strings[1])){ // MUSS label sein
                    i.saveDescriptionLine(this.formatGefunden("Label '"+strings[1]+"'",i.getFirstPart()+" "+strings[1]));
                    matches=matches.filter(e=>{                                     //Alle treffer auf zutreffende Register filtriert
                        if(e.getDestination() =="label"){
                            return e;
                        }
                    });
                    if(!this.symbollist.isLabel(strings[1])){
                        this.symbollist.setLabelWithoutPosition(strings[1]);
                        // i.saveDescriptionLine(`Neue Label angesetzt!`);
                    }
                    if(matches.length==1){
                        i.setSecondPart(strings[1]);
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        //console.log(matches[0].toString());
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(this.formatErrorMassage("keine passende Befehl gefunden!"));
                        return false;
                    }
                }
                else{
                    i.saveDescriptionLine(this.formatErrorMassage(strings[1]+" ist kein gültiger Operand!"));
                    i.setError(strings[1]);
                    return false;
                }
                break;
                
            case 'CALL':
                save3(i);
                matches=this.mnemoCommands.filter(e=>{return e.getMCode()=="CALL"});
                consoletostring = this.getDests(matches).join(", ");
                i.saveDescriptionLine(this.formatErwartet(consoletostring));
                if(strings.length<2){
                    i.saveDescriptionLine(this.formatErrorMassage("fehlende Operanden!"));
                    return false;
                }
                if(strings[1]=="[IX]"){
                    matches=this.mnemoCommands.filter(e=>{return e.getDestination()=="[IX]"});
                    if(matches.length==1){
                        i.setSecondPart(strings[1]);
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        //console.log(matches[0].toString());
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(this.formatErrorMassage("keine passende Befehl gefunden!"));
                        return false;
                    }
                }
                else if(this.symbollist.isLabel(strings[1]) || this.symbollist.isEligible(strings[1])){ // MUSS label sein
                    i.saveDescriptionLine(this.formatGefunden("Label '"+strings[1]+"'",i.getFirstPart()+" "+strings[1]));
                    matches=matches.filter(e=>{                                     //Alle treffer auf zutreffende Register filtriert
                        if(e.getDestination() =="label"){
                            return e;
                        }
                    });
                    if(!this.symbollist.isLabel(strings[1])){
                        this.symbollist.setLabelWithoutPosition(strings[1]);
                        // i.saveDescriptionLine(`Neue Label angesetzt!`);
                    }
                    if(matches.length==1){
                        i.setSecondPart(strings[1]);
                        i.setType(InputLineType.TRANSLATED);
                        i.setLength(matches[0].getSize());
                        i.setHCode(matches[0].getHexCode());
                        i.setValid(true);
                        //console.log(matches[0].toString());
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(this.formatErrorMassage("keine passende Befehl gefunden!"));
                        return false;
                    }
                }
                else{
                    i.saveDescriptionLine(this.formatErrorMassage(strings[1]+" ist kein gültiger Operand!"));
                    i.setError(strings[1]);
                    return false;
                }
                break;
            case 'RET':case 'HALT':
                matches=this.mnemoCommands.filter(e=>{return e.getMCode()==i.getFirstPart()});
                if(strings.length>1){
                    i.saveDescriptionLine(this.formatErrorMassage("zu viel Operanden!"));
                    i.setError(strings[1]);
                    return false;
                }
                if(matches.length==1){
                    i.setType(InputLineType.TRANSLATED);
                    i.setLength(matches[0].getSize());
                    i.setHCode(matches[0].getHexCode());
                    i.setValid(true);
                    //console.log(matches[0].toString());
                    return true;
                }
                else{
                    i.saveDescriptionLine(this.formatErrorMassage("keine passende Befehl gefunden!"));
                    return false;
                }
                break;
            case 'NOP':
                matches=this.mnemoCommands.filter(e=>{return e.getMCode()=="NOP"});
                if(strings.length>1){
                    i.saveDescriptionLine(this.formatErrorMassage("zu viel Operanden!"));
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
                    i.saveDescriptionLine(this.formatErrorMassage("keine passende Befehl gefunden!"));
                    return false;
                }
                break;
                
            default:
                i.saveDescriptionLine(this.formatErrorMassage(" unknown error occured"));
                return false;
        }
    }
    parsetoPseudoMnemoCode(i:InputLine,strings:string[]):boolean{
        if(this.pseudoMCodes.includes(strings[0].toUpperCase())){
            strings[0]=strings[0].toUpperCase();
            i.setFirstPart(strings[0]);
            i.saveDescriptionLine(this.formatGefunden(`Pseudo-Mnemocode ${strings[0]}`,strings[0]));
            if(strings.length<2){
                i.saveDescriptionLine(this.formatErrorMassage("fehlende Operanden"));
                return false;
            }
            switch(strings[0]){
                case 'RS':
                    i.saveDescriptionLine(this.formatErwartet("Wert/Konstante (8-bit)"));
                    save3(i);
                    if(Manipulator.isDat_8(strings[1])){
                        i.setSecondPart(Manipulator.formatHextoDat8(strings[1]));
                        i.setLength(Manipulator.formatHextoDat8(strings[1]));
                        i.setType(InputLineType.TRANSLATED);
                        let Hcode="";
                        for(let i=0;i<Manipulator.hexToDec(strings[1]);i++){
                            Hcode+='00';
                        }
                        i.setHCode(Hcode);
                        i.setValid(true);
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(this.formatErrorMassage(`${strings[1]} ist kein Wert/Konstante (8-bit)!`));
                        i.setError(strings[1]);
                        return false;
                    }
                    break;

                case 'DW':
                    // i.saveDescriptionLine(this.formatErwartet("Wert/Konstante (16-bit) oder OFFSET Label"));
                    i.saveDescriptionLine(this.formatErwartet("Wert/Konstante (8/16-bit)"));
                    save3(i);
                    if(Manipulator.isDat_16(strings[1])){
                        i.saveDescriptionLine(this.formatGefunden(`Wert/Konstante (16-bit)`,i.getFirstPart()+" "+Manipulator.formatHextoDat16(strings[1])))
                        i.setLength(2);
                        i.setSecondPart(Manipulator.formatHextoDat16(strings[1]));
                        i.setType(InputLineType.TRANSLATED);
                        i.setValid(true);
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(this.formatErrorMassage(`${strings[1]} is keine Konstante (16-bit)!`));
                        i.setError(strings[1]);
                        return false;
                    }
                    break;

                case 'DB':
                    // i.saveDescriptionLine(this.formatErwartet("Wert(en)/Konstante(n) (8-bit)"));
                    i.saveDescriptionLine(this.formatErwartet("Konstante (8-bit)"));
                    save3(i);
                    if(Manipulator.isDat_8(strings[1])){
                        i.saveDescriptionLine(this.formatGefunden(`Wert/Konstante (8-bit)`,i.getFirstPart()+" "+Manipulator.formatHextoDat8(strings[1])))
                        i.setLength(1);
                        i.setSecondPart(Manipulator.formatHextoDat8(strings[1]));
                        i.setType(InputLineType.TRANSLATED);
                        i.setValid(true);
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(this.formatErrorMassage(`${strings[1]} is keine Konstante (8-bit)!`));
                        i.setError(strings[1]);
                        return false;
                    }
                    break;

                case 'ORG':
                    i.saveDescriptionLine(this.formatErwartet("Wert/Konstante (8/16-bit)"));
                    save3(i);
                    if(Manipulator.isDat_16(strings[1])){
                        i.saveDescriptionLine(this.formatGefunden(`Wert/Konstante (16-bit)`,i.getFirstPart()+" "+Manipulator.formatHextoDat16(strings[1])))
                        i.setLength(Manipulator.hexToDec(strings[1]));
                        i.setSecondPart(Manipulator.formatHextoDat16(strings[1]));
                        i.setValid(true);
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(this.formatErrorMassage(`${strings[1]} is kein Wert/Konstante (16-bit)!`));
                        i.setError(strings[1]);
                        return false;
                    }
                    break;

                case 'EXT':
                    i.saveDescriptionLine(this.formatErrorMassage(`Command 'EXT' is not defined yet!`));
                    i.setFirstPart('EXT');
                    return false;
                    break;

                case 'ENT':
                    i.saveDescriptionLine(this.formatErrorMassage(`Command 'ENT' is not defined yet!`));
                    i.setFirstPart('ENT');
                    return false;
                    break;

                default: 
                    i.saveDescriptionLine(this.formatErrorMassage("unkown error"));
                    i.setError(strings[1]);
                    return false;
                    break;
            }
            
        }
        else if(this.symbollist.isEligible(strings[0])&&!this.symbollist.isConst(strings[0])&&!this.symbollist.isLabel(strings[0]) && i.getLabel() ==""){
            i.saveDescriptionLine(this.formatGefunden(`Konstante ${strings[0]}`,strings[0]));
            save2(i);
            i.saveDescriptionLine(this.formatErwartet(`EQU`));
            if(strings.length<2){
                i.saveDescriptionLine(this.formatErrorMassage(`fehlender Operand!`));
                i.setError(strings[0]);
                return false;
            }
            let new_commands=Manipulator.splitStringHalf(strings[1]," ");
            new_commands=this.filterForEmtpyStrings(new_commands);

            i.setFirstPart(strings[0]);
            if(new_commands[0].toUpperCase()=="EQU"){
                i.saveDescriptionLine(this.formatGefunden("EQU",i.getFirstPart()+" EQU"));
                i.saveDescriptionLine(`<span class="gray">parse Operandenfeld</span>`);
                i.saveDescriptionLine(this.formatErwartet(`Wert/Konstante (16-bit)`));
                i.setSecondPart("EQU");

                if(new_commands.length>1){
                    let type=this.getDataType(new_commands[1]);
                    if(type ==DataType.dat_8){
                        i.saveDescriptionLine(this.formatGefunden(` Wert (8-bit) ${Manipulator.formatHextoDat8(new_commands[1])}`,i.getFirstPart()+" "+i.getSecondPart()+" "+Manipulator.formatHextoDat8(new_commands[1])));
                        i.setSecondPart(new_commands[0]);
                        i.setThirdPart(Manipulator.formatHextoDat8(new_commands[1]));
                        i.setValid(true);
                        this.symbollist.setConst(strings[0],new_commands[1]);
                        return true;
                    }
                    else if(type ==DataType.dat_16){
                        i.saveDescriptionLine(this.formatGefunden(` Wert (16-bit) ${Manipulator.formatHextoDat16(new_commands[1])}`,i.getFirstPart()+" "+i.getSecondPart()+" "+Manipulator.formatHextoDat16(new_commands[1])));
                        i.setSecondPart(new_commands[0]);
                        i.setThirdPart(Manipulator.formatHextoDat16(new_commands[1]));
                        i.setValid(true);
                        this.symbollist.setConst(strings[0],new_commands[1]);
                        return true;
                    }
                    else{
                        i.saveDescriptionLine(this.formatErrorMassage(`${new_commands[1]} ist kein gültiger Wert/Konstante (8 oder 16-bit)`));
                        i.setError(new_commands[1]);
                        return false;
                    }
                }else{
                    // i.saveDescriptionLine(this.formatErrorMassage(`kein Wert/Konstante (8 oder 16-bit) gefunden!`));
                    i.saveDescriptionLine(this.formatErrorMassage(`fehlender Operand!`));
                    return false;
                }
            }
            else{
                i.saveDescriptionLine(this.formatErrorMassage(`${new_commands[0]} ist kein gültiger Operand!`));
                i.setError(new_commands[0]);
                i.setRest(new_commands[1]);
                return false;
            }
        }
        else if(this.symbollist.isConst(strings[0]) || this.symbollist.isLabel(strings[0])){
            i.saveDescriptionLine(this.formatErrorMassage("es gibt bereits eine Konstante/Label mit dem Namen "+strings[0]));
            i.setError(strings[0]);
            if(strings[1]!=undefined){
                i.setRest(" "+strings[1]);
            }
            return false;
        }
        else if(!this.symbollist.isEligible(strings[1])){
            i.saveDescriptionLine(this.formatErrorMassage(`${strings[0]} ist keine gültige Konstante`));
            i.setError(strings[0]);
            if(strings[1]!=undefined){
                i.setRest(" "+strings[1]);
            }
            return false;
        }
        else if(i.getLabel() !=""){
            i.saveDescriptionLine(this.formatErrorMassage("keine Konstantendefinition nach einem Labeldefinition erlaubt"));
            i.setError(strings[0]);
            if(strings[1]!=undefined){
                i.setRest(" "+strings[1]);
            }
            return false;
        }
        else{
            i.saveDescriptionLine(this.formatErrorMassage(`unkown error`));
            i.setError(strings[0]);
            
            return false;
        }
    }


    getDataType(addr:string):DataType{
        if(this.Regs.includes(addr)||this.pseudoMCodes.includes(addr)||this.mCodes.includes(addr)){
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