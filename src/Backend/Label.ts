export class Label{
    private name:string="";
    private position:string|undefined=undefined;

    constructor(n:string,p:string){
        this.name = n;
        this.position=p;
    }
    getName(){
        return this.name;
    }
    getPosition(){
        return this.position;
    }
    setPosition(addr:string){
        this.position=addr;
    }
    toString():string{
        return `<span class="gray">Label:</span> &nbsp;&nbsp;&nbsp;&nbsp; Label Wert:0000h (little endian:0000h)`;
    }
}