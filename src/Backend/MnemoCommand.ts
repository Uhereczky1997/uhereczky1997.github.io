import { Manipulator } from "./Manipulator";

export class MnemoCommand {
    private mCode:string ="";
    private destination:string ="";
    private source:string ="";
    private binaryCode:string ="";
    private hexCode:string="";
    private size:number = 0;
    
    constructor(c:string,d:string,addr:string,bC:string,l:number){
        this.mCode=c.toUpperCase();
        this.destination=d;
        this.source=addr;
        this.binaryCode=bC.replace(/\s/g,"");
        this.hexCode=Manipulator.binToHex(bC.replace(/\s/g,""));
        this.size=l;
    }
    getMCode():string{
        return this.mCode;
    }
    getDestination():string{
        return this.destination;
    }
    getSource():string{
        return this.source;
    }
    getHexCode():string{
        return this.hexCode;
    }
    getLength():number{
        let i:number=1;
        if(this.destination !=""){
            i++;
        }
        if(this.source !=""){
            i++
        }
        return i;
    }
    getSize():number{
        return this.size;
    }
}