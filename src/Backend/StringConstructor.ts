import { filterableDescription } from "../InputWindow";
import { erlaubteLängeL_C } from "./Manipulator";

const warningClass = "warning";
const errClass = "errorRed";
const labelClass = "labelBlue";

export class StringConstructor{

    constructor(){
    }
    static info(s:string):string{
        return `<span class="eingeruckt">${s}<span>`;
    }
    static warning(s:string):string{
        return `<span class="${warningClass} eingeruckt">Warnung : ${s}<span>`;
    }
    static error(s:string):string{
        return `<span class="${errClass} ">error: ${s}</span>`;
    }
    static plusError(s:string):string{
        return `<span class="pluserrRed eingeruckt">${s}</span>`;
    }
    

/*     static errLabelDef(s:string):string{
        return this.error(`Label '<span class="${labelClass}">${s}</span>' ist bereits definiert`); 
    } */
/*     static errConstDef(s:string):string{
        return this.error(`Konstante ${s} ist bereits definiert`); 
    } */
    
    //Bug definitions 
    static bugNoCommand():string{
        return this.error("keine passende Befehl gefunden!");
    }
    static bugSwitchDefault():string{
        return this.error("unbekannter Fehler ist aufgetreten");
    }
    static bugNoValueForConst(s:string){
        return this.error(`Wert für Konstante ${s} nicht gefunden!`);
    }

    // Warning definitons
    static warLabelZuLang(s:string):string{
        return this.warning(`Label '<span class="${labelClass}">${s}</span>' >${erlaubteLängeL_C} Zeichen`);
    }
    static warConstZuLang(s:string):string{
        return this.warning(`Konstante '${s}' > ${erlaubteLängeL_C} Zeichen`);
    }
    static warLabelND(s:string):string{
        return this.warning(`Label '<span class="${labelClass}">${s}</span>' mit Hex-Zahl verwechselbar`);
    }
    static warAddrOverwriten():string{
        return this.warning(`Adresse von aufgelösten Befehl ist bereits besetzt!`);
    }

    // Error definitons
    static errUnknownMnc(s:string):string{
        return this.error(`'${s}' unbekannter Mnemocode`); //ungültiger Befehl
    }
    static errInvalidCmd(s:string):string{
        return this.error(`'${s}' ungültiger Operand`); //ungültiger Befehl
    }
    static errTooFewCmd():string{
        return this.error(`fehlender Operand`); //zu wenige Operanden
    }
    static errTooManyCmd():string{
        return this.error(`zu viele Operanden`);
    }
    
    static errExpectedDat8ConstToBig(s:string):string{
        return this.error(`erwartet war 8-bit Wert, Konstante '${s}' ist zu groß`);
    }
    static errNameTakenForLabel(s:string):string{
        return this.error(`Symbolbezeichnung '${s}' bereits als Label definiert`);
    }
    static errNameTakenForConst(s:string):string{
        return this.error(`Symbolbezeichnung '${s}' bereits als Konstante definiert`);
    }
    static errNoConstafterLabelDef():string{
        return this.error(` keine Konstantendefinition direkt nach einer Labeldefinition erlaubt`);
    }
    static errInvalidLabel(s:string):string{
        return this.error(`'${s}' ist kein gültiges Label`); // ungültiger Label
    }
    static errInvalidConstOrMnc(s:string){
        return this.error(`'${s}' unbekannter Mnemocode oder ungültiger Konstantendefinition`);
    }
    static errNoConstDefAllowed(){
        return this.error(`Konstantendefinition nur am Anfang erlaubt`);
    }
    static errLabelNotRes(s:string){
        return this.error(`Label '<span class="labelBlue">${s}</span>' konnte nicht aufgelöst werden!`);
    }
    
    //Informations def.
    static infoIsDat8():string{
        return this.info("überprüfe auf 8-Bit Wert ... gefunden");
    }
    static infoNotDat8():string{
        return this.info("überprüfe auf 8-Bit Wert ... nicht gefunden");
    }
    static infoIsDat16():string{
        return this.info("überprüfe auf 16-Bit Wert ... gefunden");
    }
    static infoNotDat16():string{
        return this.info("überprüfe auf 16-Bit Wert ... nicht gefunden");
    }
    static infoInvalidConst(s:string):string{
        return this.info(`'${s}' ist kein gültiger Konstantenname`);
    }
    static infoNotConst(s:string):string{
        return this.info(`suche Konstante '<span class="${labelClass}">${s}<span>' ... nicht gefunden`);
    }
    static infoIsConst(s:string):string{
        return this.info(`suche Konstante '<span class="${labelClass}">${s}<span>' ... gefunden`);
    }
    static infoInvalidLabel(s:string):string{
        return this.info(`'${s}' ist kein gültiges Label`);
    }
}

export class DescriptionLoader{

    public loadDescription = (s:string)=>{
        if(this.magicWand[s]){
            this.magicWand[s](s);
        }
        else console.log("Method with name "+s+" is not implemented");
    }

    private mov_reg_reg = (s:string) =>{
        filterableDescription.innerHTML = 
        `
        <h2>${s}:</h2>
        <p>MOV Reg <-> Reg<p>
        `;
    }
    private mov_reg_dat = (s:string) =>{
        filterableDescription.innerHTML = 
        `
        <h2>${s}:</h2>
        <p>MOV Reg <-> dat<p>
        `;
    }
    private mov_a_b = ()=>{
        filterableDescription.innerHTML = 
        `
        <h2>MOV A,B:</h2>
        <p>some text<p>
        `;
    }

    private magicWand: { [K:string]:Function}={
        "MOV A,B"       : this.mov_reg_reg,
        "MOV B,A"       : this.mov_reg_reg,
        "MOV A,C"       : this.mov_reg_reg,
        "MOV C,A"       : this.mov_reg_reg,
        "MOV B,C"       : this.mov_reg_reg,
        "MOV C,B"       : this.mov_reg_reg,
        "MOV A,dat_8"   : this.mov_reg_dat,
        "MOV B,dat_8"   : this.mov_reg_dat,
        "MOV C,dat_8"   : this.mov_reg_dat,
        "MOV IX,dat_16" : this.mov_reg_dat,
        "MOV SP,dat_16" : this.mov_reg_dat,
        "MOV HL,dat_16" : this.mov_reg_dat,
    }
}
export const descriptionLoader = new DescriptionLoader();