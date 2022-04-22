export const erlaubteLängeL_C:number= 8;
export const erlaubteLängeMNEMO:number=4;
export const speicherabbildL:number = 16;


export class Manipulator {
    constructor(){}
    static binToHex = (addr:string):string  =>{
        addr=addr.replace(/b$/g,"");
        return parseInt(addr,2).toString(16).toUpperCase()+"h";
    }
    static decToHex= (addr:string):string =>{
        return parseInt(addr,10).toString(16).toUpperCase()+"h";
    }
    static binToDec=(addr:string):number=>{
        addr=addr.replace(/b$/g,"");
        return Number(parseInt(addr,2).toString(10));
    }
    static hexToDec=(addr:string):number =>{
        addr=addr.replace(/h$/g,"");
        return Number(parseInt(addr,16).toString(10));
    }
    static sliceString(s1:string,s2:string):string[]{
        let n:number,p:number;
        n=s1.indexOf(s2);
        p=s2.length;
        return [s1.substring(0,n),s1.substring(n+p)];
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
    static splitStringHalfUnfiltered(s:string,ch:string):string[]{
        let reString:string[]=[];
        let p:number =s.indexOf(ch);
        if(p!=-1 && p!=undefined){ 
            reString[0] = s.slice(0,p).trim();
            reString[1] = s.slice(p+1);
            if(reString[1].trim()!=" "||reString[1].trim()!=""){
                reString[1]=reString[1].trim();
            }
        }
        else reString[0]=s;
        return reString;
    }
    static isBin(s:string){
        if(s.endsWith("b")||s.endsWith("B")){
            s=s.replace(/b$/i,"");
            // addr =addr.replace(/^0{1,}/,'0');
            if(s==""){
                return false;
            }
            if(!/[^0-1]/.test(s)){
                return true;
            }
            else return false;
        }
        else return false;
    }
    static isHex(addr:string):boolean{    
        if(addr.endsWith("h")||addr.endsWith("H")){
            addr=addr.replace(/h$/i,"");
            // addr =addr.replace(/^0{1,}/,'0');
            if(addr==""){
                return false;
            }
            if(!/[^0-9A-F]/i.test(addr)){
                return true;
            }
            else return false;
        }
        else return false;
    }
    static isDec(addr:string):boolean{
        if(addr==""){
            return false;
        }
        if(!/[^0-9]/.test(addr)){
            return true;
        }
        else return false;
    }
    static isDat_8(addr:string):boolean{
        // addr =addr.replace(/^0+/,'');
        addr =addr.replace(/^0{1,}/,'0');
        if(addr==""){
            return false;
        }
        if(this.isBin(addr)){
            if(this.binToHex(addr).length<=3){
                return true;
            }
            else return false;
        }
        else if(this.isDec(addr)){
            if(this.decToHex(addr).length<=3){
                return true;
            }
            else return false;
        }
        else if(this.isHex(addr)){
            while(addr.startsWith('0') && addr.length>3){
                addr= addr.replace(/^0/,'')
            }
            if(addr.length<=3){
                return true;
            }
            else return false;
        }
        else return false;
    }
    static isDat_16(addr:string):boolean{
        addr =addr.replace(/^0{1,}/,'0');
        if(addr==""){
            return false;
        }
        if(this.isBin(addr)){
            if(this.binToHex(addr).length<=5){
                return true;
            }
            else return false;
        }
        if(this.isDec(addr)){
            if(this.decToHex(addr).length<=5){
                return true;
            }
            else return false;
        }
        else if(this.isHex(addr)){
            while(addr.startsWith('0') && addr.length>5){
                addr= addr.replace(/^0/,'')
            }
            if(addr.length<=5){
                return true;
            }
            else return false;
        }
        else return false;
    }
    static formatHextoDat8(addr:string):string{
        addr=addr.replace(/^0{1,}/,'0');

        if(this.isDat_8(addr)){
            if(this.isBin(addr)){
                addr=this.binToHex(addr)
            }
            else if(this.isDec(addr)){
                addr=this.decToHex(addr);
            }
            while(addr.startsWith('0') && addr.length>3){
                addr= addr.replace(/^0/,'')
            }
            if(addr.length==2){
                addr='0'+addr;
            }
        }
        else{
            throw new Error("Expected was Dat8 but got instead "+addr);
        }
        return addr;
    }
    static formatHextoDat8WithoutH(addr:string):string{
        addr=addr.replace(/^0{1,}/,'0');

        if(this.isDat_8(addr)){
            if(this.isBin(addr)){
                addr=this.binToHex(addr)
            }
            else if(this.isDec(addr)){
                addr=this.decToHex(addr);
            }
            while(addr.startsWith('0') && addr.length>3){
                addr= addr.replace(/^0/,'')
            }
            if(addr.length==2){
                addr='0'+addr;
            }
        }
        else{
            throw new Error("Expected was Dat8 but got instead "+addr);
        }
        return addr.replace(/h$/,"");
    }
    static formatHextoDat16(addr:string):string{
        addr=addr.replace(/^0{1,}/,'0');

        if(this.isDat_16(addr)){
            if(this.isBin(addr)){
                addr=this.binToHex(addr)
            }
            else if(this.isDec(addr)){
                addr=this.decToHex(addr);
            }
            while(addr.startsWith('0') && addr.length>5){
                addr= addr.replace(/^0/,'')
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
        else{
            throw new Error("Expected was Dat16 but got instead "+addr);
        }
        return addr;
    }
    static formatHextoDat16WithoutH(addr:string):string{
        addr=addr.replace(/^0{1,}/,'0');

        if(this.isDat_16(addr)){
            if(this.isBin(addr)){
                addr=this.binToHex(addr)
            }
            else if(this.isDec(addr)){
                addr=this.decToHex(addr);
            }
            while(addr.startsWith('0') && addr.length>5){
                addr= addr.replace(/^0/,'')
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
        else{
            throw new Error("Expected was Dat16 but got instead "+addr);
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
        while(s.length<erlaubteLängeL_C+2){
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
    static formatConstantDisplay(s:string,b:boolean):string{
        let ss="";
        let toReturn="";
        if(s.length<1){
            return "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        }
        s=s.concat("  ");
        while(s.length<erlaubteLängeL_C+2){
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
    static formatLabelDisplaytoSymbolTable(s:string):string{
        let ss="";
        while(s.length<erlaubteLängeL_C+1){
            s=s.concat(" ");
        }
        ss= s;
        while(ss.includes(" ")){
            ss = ss.replace(" ","&nbsp;");
        }
        // console.log(ss+" --> "+ss.length);
        return ss;
    }
    static formatBefehlDisplay(s1:string,s2:string,b:boolean):string{
        let ss="";
        let toReturn=s1;
        while(toReturn.length<erlaubteLängeMNEMO){
            toReturn=toReturn.concat(" ");
        }
        // s2=s2.replace(s1,toReturn);
        s2=toReturn+s2.split(s1)[1];
        while(s2.length<16){
            s2=s2.concat(" ");
        }
        ss= s2;
        while(ss.includes(" ")){
            ss = ss.replace(" ","&nbsp;");
        }
        toReturn = b? s2:ss
        return toReturn;
    }
    static formatLabelandBefehlDisplay(s1:string,s2:string,s3:string):string{
        let ss ="";
        if(s1.length<erlaubteLängeL_C){
            return this.formatLabelDisplay(s1,false).concat(this.formatBefehlDisplay(s2,s3,false));
        }
        s2= this.formatBefehlDisplay(s2,s3,true);
        s1= this.formatLabelDisplay(s1,true);
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
    static formatConstandBefehlDisplay(s1:string,s2:string,s3:string):string{
        let ss ="";
        if(s1.length<erlaubteLängeL_C){
            return this.formatConstantDisplay(s1,false).concat(this.formatBefehlDisplay(s2,s3,false));
        }
        s2= this.formatBefehlDisplay(s2,s3,true);
        s1= this.formatConstantDisplay(s1,true);
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
    static formatSpeicherabbildandLabel(s1:string,s2:string):string{
        if(s1.length>=speicherabbildL){
            return s1+s2;
        }

        while(s1.length<speicherabbildL){
            s1 = s1+" ";
        }

        while(s1.includes(" ")){
            s1 = s1.replace(" ","&nbsp;")
        }
        return s1+s2;
        
    }
}