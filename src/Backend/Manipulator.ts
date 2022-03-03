export class Manipulator {
    constructor(){}
    static binToHex = (addr:string):string  =>{
        return parseInt(addr,2).toString(16).toUpperCase()+"h";
    }
    static decToHex= (addr:string):string =>{
            return parseInt(addr,10).toString(16).toUpperCase()+"h";
    }
    static hexToDec=(addr:string):number =>{
       /*  if(addr.indexOf("h")!=-1){ */
            addr=addr.replace(/h/g,"");
            return Number(parseInt(addr,16).toString(10));
/*         }
        else return Number(addr); */
    }
    static splitStringHalf(addr:string,ch:string):string[]{
        let reString:string[]=[];
        let p:number =addr.indexOf(ch);
        if(p!=-1 && p!=undefined){ 
            reString[0] = addr.slice(0,p).trim();
            reString[1] = addr.slice(p+1).trim();
        }
        else reString[0]=addr;
        return reString;
    }
    static removeExcessWhiteSpace(addr:string):string{
        return addr.replace(/\s+/g,' ').trim();
    }
    static isHex(addr:string):boolean{
        let newS:string=addr.replace(/^0+/,'');
        if(addr.endsWith("h")||addr.endsWith("H")){
            newS=addr.replace(/h$/i,"");
            if(!/[^0-9A-F]/i.test(newS)){
                return true;
            }
            else return false;
        }
        /* else if(!/[^0-9A-F]/i.test(newS)){
            return true;
        } */
        else return false;
    }
    static isDec(addr:string):boolean{
        if(!/[^0-9]/.test(addr)){
            return true;
        }
        else return false;
    }
    static isDat_8(addr:string):boolean{
        addr =addr.replace(/^0+/,'');
        if(this.isDec(addr)){
            if(this.decToHex(addr).length<=3){
                return true;
            }
            else return false;
        }
        else if(this.isHex(addr)){
            if(addr.length<=3){
                return true;
            }
            else return false;
        }
        else return false;
    }
    static isDat_16(addr:string):boolean{
        if(this.isDec(addr)){
            if(this.decToHex(addr).length<=5){
                return true;
            }
            else return false;
        }
        else if(this.isHex(addr)){
            if(addr.length<=5){
                return true;
            }
            else return false;
        }
        else return false;
    }
    static formatHex(addr:string):string{
        addr=addr.replace(/^0+/,'');
        //addr=addr.replace(/^0/,'');
        if(Manipulator.isDat_8(addr)){
            if(this.isDec(addr)){
                addr=Manipulator.decToHex(addr);
            }

            if(addr.length==2){
                addr='0'+addr;
            }
        }
        else if(Manipulator.isDat_16(addr)){
            if(this.isDec(addr)){
                addr = Manipulator.decToHex(addr);
            }

            if(addr.length==4){
                addr='0'+addr;
            }
        }
        return addr;
    }

    static formatHextoDat8(addr:string):string{
        addr=addr.replace(/^0+/,'');
        //addr=addr.replace(/^0/,'');
        if(Manipulator.isDat_8(addr)){
            if(this.isDec(addr)){
                addr=Manipulator.decToHex(addr);
            }

            if(addr.length==2){
                addr='0'+addr;
            }
        }
        return addr;
    }
    static formatHextoDat8WithoutH(addr:string):string{
        addr=addr.replace(/^0+/,'');
        //addr=addr.replace(/^0/,'');
        if(Manipulator.isDat_8(addr)){
            if(this.isDec(addr)){
                addr=Manipulator.decToHex(addr);
            }

            if(addr.length==2){
                addr='0'+addr;
            }
        }
        return addr.replace(/h$/,"");
    }
    static formatHextoDat16(addr:string):string{
        addr=addr.replace(/^0+/,'');
        if(this.isDat_16(addr)){
            if(this.isDec(addr)){
                addr=this.decToHex(addr);
            }
            switch(addr.length){
                case 1:
                    addr="0000"+addr;
                    break;
                case 2: addr='000'+addr;
                    break;
                case 3: addr='00'+addr;
                    break;
                case 4: addr='0'+addr;
                    break;
            }
        }
        return addr;
    }
    static formatHextoDat16WithoutH(addr:string):string{
        addr=addr.replace(/^0+/,'');
        if(this.isDat_16(addr)){
            if(this.isDec(addr)){
                addr=this.decToHex(addr);
            }
            switch(addr.length){
                case 1:
                    addr="0000"+addr;
                    break;
                case 2: addr='000'+addr;
                    break;
                case 3: addr='00'+addr;
                    break;
                case 4: addr='0'+addr;
                    break;
            }
        }
        return addr.replace(/h$/g,"");
    }
    static splitDat16InDat8(addr:string):string[]{
        let r:string[]=[];
        if(this.isDat_16(addr)){
            addr=this.formatHextoDat16(addr);
            r[0]=addr[2]+addr[3];
            r[1]=addr[0]+addr[1];
        }
        return r;
    }
    static formatLabelDisplay(s:string,b:boolean):string{
        let ss="";
        let toReturn="";
        if(s.length<1){
            return "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        }
        s=s.concat(": ");
        while(s.length<10){
            s=s.concat(" ");
        }
        ss= s;
        while(ss.includes(" ")){
            ss = ss.replace(" ","&nbsp;");
        }
        // console.log(ss+" --> "+ss.length);
        toReturn = b? s:ss
        return toReturn;
    }
    static formatBefehlDisplay(s:string,b:boolean):string{
        let ss="";
        let toReturn="";
        while(s.length<16){
            s=s.concat(" ");
        }
        ss= s;
        while(ss.includes(" ")){
            ss = ss.replace(" ","&nbsp;");
        }
        toReturn = b? s:ss
        return toReturn;
    }
    static formatLabelandBefehlDisplay(s1:string,s2:string):string{
        let ss ="";
        if(s1.length<8){
            return this.formatLabelDisplay(s1,false).concat(this.formatBefehlDisplay(s2,false));
        }
        s1= this.formatLabelDisplay(s1,true);
        s2= this.formatBefehlDisplay(s2,true);
        ss= (s1.concat(s2)).trim();
        if(ss.length<26){
            while(ss.length<26){
                ss=ss.concat(" ");
            }
        }
        console.log(ss);
        while(ss.includes(" ")){
            ss = ss.replace(" ","&nbsp;");
        }
        console.log(ss);
        return ss;
    }
}