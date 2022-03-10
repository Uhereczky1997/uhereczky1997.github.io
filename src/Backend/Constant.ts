export class Constant{
    private name:string="";

    private value:string="";

    constructor(n:string,v:string){
        this.name=n;
        this.value=v;
    }

    getName(){
        return this.name;
    }
    getValue(){
        return this.value;
    }
    setValue(addr:string){
        this.value=addr;
    }
    toStringtoMovable():string{
        return `${this.name} Wert:${this.value}`;
    }
    toString():string{
        return `<span class="gray">Konst.:</span> ;&nbsp;&nbsp;&nbsp; ${this.name} Wert:${this.value}`;
    }
}