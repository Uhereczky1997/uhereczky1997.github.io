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
    static achtung(s:string):string{
        return `<span class="${warningClass} eingeruckt">Achtung : ${s}<span>`;
    }
    static error(s:string):string{
        return `<span class="errorRed">error: ${s}</span>`;
    }
    static warLabelZuLang(s:string):string{
        return this.achtung(`Label '<span class="${labelClass}">${s}</span>' >${erlaubteLängeL_C} Zeichen`);
    }
    static warConstZuLang(s:string):string{
        return this.achtung(`Konstante ${s} >${erlaubteLängeL_C} Zeichen`);
    }

    static errLabelDef(s:string):string{
        return this.error(`Label '<span class="${labelClass}">${s}</span>' ist bereits definiert`); 
    }
    static errConstDef(s:string):string{
        return this.error(`Konstante ${s} ist bereits definiert`); 
    }
    static invalidLabel(s:string):string{
        return this.error(`${s} kein gülitger Label`); // ungültiger Label
    }
    static invalidCmd(s:string):string{
        return this.error(`${s} ungültiger Operand`); //ungültiger Befehl
    }
    static toofewCmd():string{
        return this.error(`fehlender Operand`); //zu wenige Operanden
    }
    static tooManyCmd():string{
        return this.error(`zu viele Operanden`);
    }
    static noValidLabelAfterOffset(){
        return this.error(`gefunden wurde OFFSET aber kein gültiger label!`);
    }
    static bugNoCommand():string{
        return this.error("keine passende Befehl gefunden!");
    }
    static bugSwitchDefault():string{
        return this.error("unbekannter Fehler ist aufgetreten");
    }
    static bugNoValueForConst(s:string){
        return this.error(`Wert für Konstante ${s} nicht gefunden!`);
    }
    static expectedDat8():string{
        return this.error("erwartet war 8-bit Wert");
    }
    static expectedDat8ConstToBig(s:string):string{
        return this.error(`erwartet war 8-bit Wert, Konstante ${s} ist zu groß`);
    }
    static expectedDat8Plus(s:string):string{
        return this.error(`erwartet war 8-bit Wert, ${s} ist kein gültiger Operand`);
    }
    static expectedDat16():string{
        return this.error("erwartet war 16-bit Wert");
    }
    static expectedDat16Plus(s:string):string{
        return this.error(`erwartet war 16-bit Wert, ${s} ist kein gültiger Operand`);
    }
    static nameTakenForLabel(s:string):string{
        return this.error(`Symbolbezeichnung ${s} bereits als Label definiert`);
    }
    static nameTakenForConst(s:string):string{
        return this.error(`Symbolbezeichnung ${s} bereits als Konstante definiert`);
    }
    static noConstafterLabelDef():string{
        return this.error(`keine Konstantendefinition nach einer Labeldefinition erlaubt`);
    }
    static noValidConstOrOperand(s:string){
        return this.error(`${s} ungültiger Befehl oder Konstantendefinition`);
    }

    
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
    static infoNoConst(s:string):string{
        return this.info(`'${s}' ist kein gültiger Konstantenname`);
    }
    static infoIsConst(s:string):string{
        return this.info(`suche 16-Bit Konstante <span class="${labelClass}">${s}<span> ... gefunden`);
    }
    static infoNoLabel(s:string):string{
        return this.info(`'${s}' ist kein gültiges Label`);
    }
    static infoIsLabel(s:string):string{
        return this.info(`suche Label <span class="${labelClass}">${s}<span> ... gefunden`);
    }
}