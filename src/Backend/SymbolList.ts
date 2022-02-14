import { Label } from "./Label";
import { Constant } from "./Constant";
import { Manipulator } from "./Manipulator";
export class SymbolList{

    public Labels:Label[]=[];
    public Consts:Constant[]=[];
    private sequence:Array<Label|Constant>=[]

    private static instance:SymbolList;
    private constructor(){}

    public static getInstance():SymbolList{
        if(!SymbolList.instance){
            SymbolList.instance= new SymbolList();
        }
        return SymbolList.instance;
    }

    empty():void{
        this.Labels=[];
        this.Consts=[];

        this.sequence=[];
    }
    pushValidLabelConst(s:Constant|Label){
        if(this.sequence.find(e=>{e==s})==undefined){
            this.sequence.push(s);
        }
    }
    isEligible(addr:string):boolean{
        if(!/^[\W_]/.test(addr)){
            return true;
        }
        else return false;


    }
    updateLabel(s:string,addr:string):boolean{
        let l:Label|undefined = this.getSpecificLabelByName(s);
        if(l!=undefined && Manipulator.isDat_16(addr)){
            l.setPosition(Manipulator.formatHextoDat16(addr));
            this.pushValidLabelConst(l);
            return true;
        }
        else return false;
    }
    isLabel(addr:string):boolean{
        if(this.Labels.find(element => element.getName()==addr) !=undefined){
            return true;
        }
        else return false;

    }
    setLabel(s:string,p:string){
        let l;
        if(!this.isLabel(s) && Manipulator.isDat_16(p)){
            l=new Label(s,Manipulator.formatHextoDat16(p))
            this.Labels.push(l);
            this.pushValidLabelConst(l);
        }
    }
    setLabelWithoutPosition(addr:string):boolean{
        if(!this.isLabel(addr)){
            this.Labels.push(new Label(addr,"????"));
            return true;
        }
        else if(this.getPositionOfSpecificLabel(addr)==undefined){
            return true;
        }
        else return false;
    }
    isConst(s:string):boolean{
        if(this.Consts.find(element => element.getName()==s) !=undefined){
            return true;
        }
        return false;
    }
    getSequence():Array<Constant|Label>{
        return this.sequence;
    }
    setConst(s:string,v:string){
        let l;
        if(!this.isConst(s)){
            l=new Constant(s,v);
            this.Consts.push(new Constant(s,v));
            this.pushValidLabelConst(l);
        }
    }
    getLabels():Label[]{
        return this.Labels;
    }
    getConsts():Constant[]{
        return this.Consts;
    }
    getSpecificConstantByName(addr:string):Constant|undefined{
        return this.Consts.find(e=>e.getName()==addr);
    }
    getSpecificLabelByName(addr:string):Label|undefined{
        return this.Labels.find(e=>e.getName()==addr);
    }
    getPositionOfSpecificLabel(addr:string):string|undefined{
        let r=this.getSpecificLabelByName(addr);
        if(r==undefined){
            this.setLabelWithoutPosition(addr);
            return undefined;
        }
        else{
            if(r.getPosition()=="????"){
                return undefined;
            }
            else return r.getPosition();
        }
    }

}