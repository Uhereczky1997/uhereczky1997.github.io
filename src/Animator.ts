import { aniControl, checkIfPaused, sleepFor } from "./AnimationUtil";
import { getHtmlElement } from "./Tools";

export const sleepUntilNextFrame=async(n:number):Promise <any>=>{
    await sleepFor(n);
    // await sleepFor(n/aniControl.speed);
}

export class Animator{

    currentLineElem:HTMLElement;
    descriptionLineElem:HTMLElement;
    descriptionTableBox:HTMLElement;
    frameSleepTime:number = 10;
    movingElementFlag:boolean;
    movableElem:HTMLDivElement;
    movableHelper:HTMLDivElement;
    outPutLinesElem:HTMLElement;
    outPutText:HTMLElement;
    inputText:HTMLElement;
    vorgangElem:HTMLElement;
    symbolTableElem:HTMLElement;
    symbolTableBox:HTMLElement;
    targetElemTop:number=0;
    targetElemLeft:number=0;
    turnSleepTime:number = 1000;
    addresszaehlerElem:HTMLElement;

    constructor(){
        this.movingElementFlag = false;
        this.movableElem = this.createMovable();
        this.movableHelper= this.createMovableHelper();
        this.inputText =getHtmlElement("InputText");
        this.currentLineElem = getHtmlElement("currentLine");
        this.descriptionLineElem= getHtmlElement("descriptionLines");
        this.vorgangElem = getHtmlElement("Description");
        this.symbolTableElem= getHtmlElement("symbolTableLines");
        this.symbolTableBox= getHtmlElement("SymbolTable");
        this.outPutLinesElem = getHtmlElement("OutputLines");
        this.descriptionTableBox= getHtmlElement("descriptionSymboltableBox");
        this.outPutText = getHtmlElement("OutputText");
        // this.addresszaehlerElem = getHtmlElement("translatedinfoDividerDiv");
        this.addresszaehlerElem = getHtmlElement("Addresszahler");
    }

    reset(){
        this.movingElementFlag=false;
        this.turnMovableHidden();
        this.turnMovableHelperHidden();
        this.frameSleepTime=10;
        this.turnSleepTime = 1000;
    }

    setMovableParameters(t:number,l:number,w:number,h:number){
        this.movableElem.style.top=t+"px";
        this.movableElem.style.left=l+"px";
        // this.movableElem.style.height=h+"px";
        // this.movableElem.style.width=w+"px";
    }

    private getPixeljump():number{
        return aniControl.speed+1;
    }

    async animationInputLineToCurrentLine(id:number,line:string){
        // this.setMovableParameters(startingTop,startingLeft,startingWidth,this.currentLineElem.offsetHeight/5*4);
        // this.setMovableParameters(startingTop,startingLeft,startingWidth,startingHeight);
        await this.setStartTopToInputLine(id);
        await this.formatLineString("h3",line);
        // this.targetElemTop=this.currentLineElem.offsetTop+this.currentLineElem.offsetHeight-startingHeight;
        this.targetElemTop=this.currentLineElem.offsetTop+this.currentLineElem.offsetHeight-this.movableElem.offsetHeight;
        this.targetElemLeft = this.currentLineElem.offsetLeft;
        this.turnMovableVisible();
        await sleepFor(this.turnSleepTime/this.getPixeljump());
        if(this.targetElemTop>this.movableElem.offsetTop){
            while(this.targetElemTop>this.movableElem.offsetTop){
                await this.moveSleepCheck(this.getPixeljump(),0);
                // await this.adjustHeightOfMovable(this.getPixeljump(),this.currentLineElem.offsetHeight/5*4);
            }
            this.movableElem.style.top=this.targetElemTop+"px";
        }
        else if(this.targetElemTop==this.movableElem.offsetTop){
        }
        else{
            while(this.targetElemTop<this.movableElem.offsetTop){
                await this.moveSleepCheck(-this.getPixeljump(),0);
                // await this.adjustHeightOfMovable(this.getPixeljump(),this.currentLineElem.offsetHeight/5*4);
            }
            this.movableElem.style.top=this.targetElemTop+"px";
        }
        await sleepFor(this.turnSleepTime/this.getPixeljump());
        while(this.targetElemLeft>this.movableElem.offsetLeft){
            await this.moveSleepCheck(0,this.getPixeljump());
        }
        this.movableElem.style.left=this.targetElemLeft+"px";
        await sleepFor(this.turnSleepTime/this.getPixeljump());
        this.turnMovableHidden();
    }
    async moveConstToSymbolTable(line:string){
        
        this.formatLineString("h4",line);
        this.setMovableParameters((this.descriptionLineElem.offsetTop+this.descriptionLineElem.offsetHeight-this.vorgangElem.offsetHeight),this.descriptionLineElem.offsetLeft,this.descriptionLineElem.offsetWidth,this.vorgangElem.offsetHeight);
        if(-this.symbolTableBox.offsetTop+this.symbolTableElem.offsetTop+this.symbolTableElem.scrollHeight>this.symbolTableBox.clientHeight){
            this.targetElemTop = this.symbolTableBox.offsetTop+this.symbolTableBox.clientHeight-this.movableElem.offsetHeight;
        }
        else{
            console.log(this.symbolTableElem.offsetTop+this.symbolTableElem.offsetHeight+"  "+(this.symbolTableElem.children.item(0)!.scrollHeight*1.5));
            this.targetElemTop=this.symbolTableElem.offsetTop+this.symbolTableElem.offsetHeight-(this.symbolTableElem.children.item(0)!.scrollHeight*1.5);
        }
        this.turnMovableVisible();
        await sleepFor(this.turnSleepTime/this.getPixeljump());
        while(this.targetElemTop>this.movableElem.offsetTop){
            await this.moveSleepCheck(this.getPixeljump(),0);
        }
        this.movableElem.style.top=this.targetElemTop+"px";
        await sleepFor(this.turnSleepTime/this.getPixeljump());
        this.turnMovableHidden();
    }

    async moveLabeltoSymboltable(line:string,hex:string){
        // console.log([this.descriptionLineElem.offsetTop,this.descriptionLineElem.offsetHeight,this.vorgangElem.offsetHeight])
        this.formatLineString("h4",line);
        this.setMovableParameters((this.descriptionLineElem.offsetTop+this.descriptionLineElem.offsetHeight-this.vorgangElem.offsetHeight),this.descriptionLineElem.offsetLeft,this.descriptionLineElem.offsetWidth,this.vorgangElem.offsetHeight);
        this.movableHelper.style.top=this.addresszaehlerElem.offsetTop+"px";
        this.movableHelper.style.left=this.addresszaehlerElem.offsetLeft+"px";
        this.movableHelper.innerHTML=`<h4 style="margin:0px 0px; padding: 5px 10px; font: bold;">${hex}</h4}>`;
        console.log(-this.symbolTableBox.offsetTop+this.symbolTableElem.offsetTop+this.symbolTableElem.scrollHeight+"   "+this.symbolTableBox.clientHeight)
        if(-this.symbolTableBox.offsetTop+this.symbolTableElem.offsetTop+this.symbolTableElem.scrollHeight>this.symbolTableBox.clientHeight){
            this.targetElemTop = this.symbolTableBox.offsetTop+this.symbolTableBox.clientHeight-this.movableElem.offsetHeight;
        }
        else{
            console.log(this.symbolTableElem.offsetTop+this.symbolTableElem.offsetHeight+"  "+(this.symbolTableElem.children.item(0)!.scrollHeight*1.5));
            this.targetElemTop=this.symbolTableElem.offsetTop+this.symbolTableElem.offsetHeight-(this.symbolTableElem.children.item(0)!.scrollHeight*1.5);
        }
        this.turnMovableVisible();
        await sleepFor(this.turnSleepTime/this.getPixeljump());
        while(this.addresszaehlerElem.offsetTop-2*this.movableElem.offsetHeight>this.movableElem.offsetTop){
            await this.moveSleepCheck(this.getPixeljump(),0);
        }
        this.turnMovableHelperVisible();
        await sleepFor(this.turnSleepTime/this.getPixeljump());
        while(this.movableElem.offsetLeft+this.movableElem.offsetWidth>this.movableHelper.offsetLeft){
            await this.updateMovingHelperElement(0,this.getPixeljump());
            await sleepUntilNextFrame(this.frameSleepTime);
            await checkIfPaused();
        }
        this.movableHelper.style.left=this.movableElem.offsetWidth+this.movableElem.offsetLeft+"px";
        await sleepFor(this.turnSleepTime/this.getPixeljump());
        while(this.movableElem.offsetTop<this.movableHelper.offsetTop){
            await this.updateMovingHelperElement(-this.getPixeljump(),0);
            await sleepUntilNextFrame(this.frameSleepTime);
            await checkIfPaused();
        }
        this.movableHelper.style.top=this.movableElem.offsetTop+"px";
        this.formatLineString("h4",line+hex);
        await sleepFor(this.turnSleepTime/this.getPixeljump());
        this.turnMovableHelperHidden();
        while(this.targetElemTop>this.movableElem.offsetTop){
            await this.moveSleepCheck(this.getPixeljump(),0);
        }
        this.movableElem.style.top=this.targetElemTop+"px";

        await sleepFor(this.turnSleepTime/this.getPixeljump());
        this.turnMovableHidden();
    }
    async moveLabeltoSymboltableALTMoveableHelper(hex:string){
        this.movableHelper.style.top=this.addresszaehlerElem.offsetTop+"px";
        this.movableHelper.style.left=this.addresszaehlerElem.offsetLeft+"px";
        this.movableHelper.innerHTML=`<h4 style="margin:0px 0px; padding: 5px 10px; font: bold;">${hex}</h4}>`;
        
        this.turnMovableHelperVisible();
        let placeholder:HTMLSpanElement = document.getElementById("labelValuePlaceholder") as HTMLSpanElement;
        if(placeholder==null){
            throw new Error("BRUV");
        }
        await sleepFor(this.turnSleepTime/this.getPixeljump());
        while(placeholder.offsetLeft>this.movableHelper.offsetLeft){
            await this.moveHelperSleepCheck(0,this.getPixeljump());
        }
        this.movableHelper.style.left=placeholder.offsetLeft+"px";
        await sleepFor(this.turnSleepTime/this.getPixeljump());
        await sleepFor(this.turnSleepTime/this.getPixeljump());
        await sleepFor(this.turnSleepTime/this.getPixeljump());
        while(placeholder.offsetTop+placeholder.offsetHeight*1/2>this.movableHelper.offsetTop+this.movableHelper.offsetHeight*1/2){
            await this.moveHelperSleepCheck(this.getPixeljump(),0);
        }
        // this.movableHelper.style.top=placeholder.offsetTop+"px";

        await sleepFor(this.turnSleepTime/this.getPixeljump());
        this.turnMovableHelperHidden();
    }
    async moveLabeltoSymboltableALTMoveable(line:string){
        // console.log([this.descriptionLineElem.offsetTop,this.descriptionLineElem.offsetHeight,this.vorgangElem.offsetHeight])
        this.formatLineString("h4",line);
        this.setMovableParameters((this.descriptionLineElem.offsetTop+this.descriptionLineElem.offsetHeight-this.vorgangElem.offsetHeight),this.descriptionLineElem.offsetLeft,this.descriptionLineElem.offsetWidth,this.vorgangElem.offsetHeight);
        if(-this.symbolTableBox.offsetTop+this.symbolTableElem.offsetTop+this.symbolTableElem.scrollHeight>this.symbolTableBox.clientHeight){
            this.targetElemTop = this.symbolTableBox.offsetTop+this.symbolTableBox.clientHeight-this.movableElem.offsetHeight;
        }
        else{
            console.log(this.symbolTableElem.offsetTop+this.symbolTableElem.offsetHeight+"  "+(this.symbolTableElem.children.item(0)!.scrollHeight*1.5));
            this.targetElemTop=this.symbolTableElem.offsetTop+this.symbolTableElem.offsetHeight-(this.symbolTableElem.children.item(0)!.scrollHeight*1.5);
        }
        this.turnMovableVisible();
        await sleepFor(this.turnSleepTime/this.getPixeljump());
        while(this.targetElemTop>this.movableElem.offsetTop){
            await this.moveSleepCheck(this.getPixeljump(),0);
        }
        this.movableElem.style.top=this.targetElemTop+"px";
        await sleepFor(this.turnSleepTime/this.getPixeljump());
        this.turnMovableHidden();
    }
    

    async exchangeLabelWithSymbolTable(toLine:string,returnLine:string){
        this.movableElem.innerHTML=`<h3 style="margin:0px 0px; padding: 5px 10px; font: bold; text-align: center;">${toLine}</h3>`;
        this.setMovableParameters((this.descriptionLineElem.offsetTop+this.descriptionLineElem.offsetHeight-this.vorgangElem.offsetHeight),this.descriptionLineElem.offsetLeft,this.descriptionLineElem.offsetWidth,this.vorgangElem.offsetHeight);
        this.targetElemTop=this.symbolTableElem.offsetTop;
        this.turnMovableVisible();
        await sleepFor(this.turnSleepTime/this.getPixeljump());
        while(this.targetElemTop>this.movableElem.offsetTop){
            await this.moveSleepCheck(this.getPixeljump(),0);
        }
        this.movableElem.style.top=this.targetElemTop+"px";

        await sleepFor(this.turnSleepTime/this.getPixeljump());
        this.movableElem.innerHTML=`<h3 style="margin:0px 0px; padding: 5px 10px; font: bold; text-align: center;">${returnLine}</h3>`;
        this.targetElemTop=this.descriptionLineElem.offsetTop+this.descriptionLineElem.offsetHeight-this.vorgangElem.offsetHeight;
        while(this.targetElemTop<this.movableElem.offsetTop){
            await this.moveSleepCheck(-this.getPixeljump(),0);
        }
        this.movableElem.style.top=this.targetElemTop+"px";

        await sleepFor(this.turnSleepTime/this.getPixeljump());
        this.turnMovableHidden();
    }

    async setStartTopToInputLine(id:number){
        let childElem=document.getElementById(`${(id+1)<10?"0"+(id+1):(id+1)}inputP`);
        if(childElem!=null){

            this.movableElem.style.top = childElem.offsetTop-this.inputText.scrollTop+"px";
            this.movableElem.style.left= childElem.offsetLeft+"px";

        }
    }
    
    async setTargetTopToSpeicherabbild(id:number){
        let childElem=document.getElementById(`${(id+1)<10?"0"+(id+1):(id+1)}outputP`);
        if(childElem!=null){

            this.targetElemTop = childElem.offsetTop-this.inputText.scrollTop;
        }
        /* if(id<0){
            if(this.outPutLinesElem.firstChild == null){
                this.targetElemTop=this.outPutLinesElem.offsetTop;
            }
            else{
                childElem=getHtmlElement("01outputP");
                // console.log(this.outPutLinesElem.childElementCount*childElem.offsetHeight);
                // console.log(this.outPutLinesElem.offsetHeight);
                // console.log(this.outPutLinesElem.offsetTop+this.outPutLinesElem.childElementCount*childElem.offsetHeight);
                if(this.outPutLinesElem.childElementCount*childElem.offsetHeight<this.outPutText.offsetHeight){
                    this.targetElemTop=this.outPutLinesElem.offsetTop+this.outPutLinesElem.childElementCount*childElem.offsetHeight;
                }
                else{
                    this.targetElemTop=this.outPutLinesElem.offsetTop+this.outPutText.offsetHeight-childElem.offsetHeight;
                }
            }
        }
        else{
        }
            
        */

    }
 
    async pushAufzulosendestoCurrentLine(i:number,line:string){
        let childelem = getHtmlElement(`${(i+1)<10?"0"+(i+1):(i+1)}outputP`);
        // this.setMovableParameters(childelem.offsetTop,this.outPutText.offsetLeft,this.outPutText.offsetWidth,childelem.offsetHeight);
        await this.setMovableParameters(childelem.offsetTop-this.outPutText.scrollTop,this.outPutText.offsetLeft,this.outPutText.offsetWidth,this.currentLineElem.offsetHeight/5*4);
        await this.formatLineString("h3",line);
        this.targetElemTop=this.currentLineElem.offsetTop+this.currentLineElem.offsetHeight-this.movableElem.offsetHeight;
        // this.targetElemTop=this.currentLineElem.offsetTop+this.currentLineElem.offsetHeight-childelem.offsetHeight;
        this.targetElemLeft = this.currentLineElem.offsetLeft;
        this.turnMovableVisible();
        if(this.targetElemTop>this.movableElem.offsetTop){
            while(this.targetElemTop>this.movableElem.offsetTop){
                await this.moveSleepCheck(this.getPixeljump(),0);
                // await this.adjustHeightOfMovable(this.getPixeljump(),this.currentLineElem.offsetHeight/5*4);
            }
            this.movableElem.style.top=this.targetElemTop+"px";
        }
        else if(this.targetElemTop==this.movableElem.offsetTop){
        }
        else{
            while(this.targetElemTop<this.movableElem.offsetTop){
                await this.moveSleepCheck(-this.getPixeljump(),0);
                // await this.adjustHeightOfMovable(this.getPixeljump(),this.currentLineElem.offsetHeight/5*4);
            }
            this.movableElem.style.top=this.targetElemTop+"px";
        }
        await sleepFor(this.turnSleepTime/this.getPixeljump());
        while(this.targetElemLeft<this.movableElem.offsetLeft){
            await this.moveSleepCheck(0,-this.getPixeljump());
        }
        this.movableElem.style.left=this.targetElemLeft+"px";
        await sleepFor(this.turnSleepTime/this.getPixeljump());
        this.turnMovableHidden();
    }

    async displayAddresserhoehung(i:number){
        this.setMovableParameters((this.descriptionTableBox.offsetTop+this.descriptionTableBox.offsetHeight-this.currentLineElem.offsetHeight/5*4),this.descriptionTableBox.offsetLeft,this.descriptionTableBox.offsetWidth,this.currentLineElem.offsetHeight/5*4);
        this.formatLineString("h2","Erhöhe Adresszähler um: "+i);
        this.movableHelper.style.top= this.addresszaehlerElem.offsetTop-5+"px";
        this.movableHelper.style.left= this.addresszaehlerElem.offsetLeft+this.addresszaehlerElem.offsetWidth-2+"px";
        // this.movableHelper.style.height = this.addresszaehlerElem.offsetHeight+10+"px";
        this.movableHelper.innerHTML=`<h2 style="margin:0px 0px; padding: 10px 10px; font: bold;">+${i}</h2>`
        this.turnMovableVisible();
        this.turnMovableHelperVisible();
        await sleepFor(4*this.turnSleepTime/this.getPixeljump());
        await checkIfPaused();
        this.turnMovableHidden();
        this.turnMovableHelperHidden();
    }

    async moveDetailToSpeicherabbild(line:string,id:number){
        // this.setMovableParameters((this.descriptionTableBox.offsetTop+this.descriptionTableBox.offsetHeight-this.currentLineElem.offsetHeight/5*4),this.descriptionTableBox.offsetLeft,this.descriptionTableBox.offsetWidth,this.currentLineElem.offsetHeight/5*4);
        this.setMovableParameters(this.addresszaehlerElem.offsetTop,this.descriptionTableBox.offsetLeft,this.descriptionTableBox.offsetWidth,this.currentLineElem.offsetHeight/5*4);
        this.formatLineString("h3",line);
        await this.setTargetTopToSpeicherabbild(id);       
        this.targetElemLeft=this.outPutText.offsetLeft;
        this.turnMovableVisible();
        await sleepFor(this.turnSleepTime/this.getPixeljump());
        await sleepFor(this.turnSleepTime/this.getPixeljump());
        while(this.targetElemLeft>this.movableElem.offsetLeft){
            await this.moveSleepCheck(0,this.getPixeljump());
            // await this.adjustWidthOfMovable(this.getPixeljump(),this.outPutText.offsetWidth);
        }
        this.movableElem.style.left=this.targetElemLeft+"px";
        // this.movableElem.style.width=this.outPutText.offsetWidth+"px";
        await sleepFor(this.turnSleepTime/this.getPixeljump());
        if(this.targetElemTop>this.movableElem.offsetTop){
            while(this.targetElemTop>this.movableElem.offsetTop){
                await this.moveSleepCheck(this.getPixeljump(),0);
            }
            this.movableElem.style.top=this.targetElemTop+"px";

        }
        else if(this.targetElemTop==this.movableElem.offsetTop){
        }
        else{
            while(this.targetElemTop<this.movableElem.offsetTop){
                await this.moveSleepCheck(-this.getPixeljump(),0);
            }
            this.movableElem.style.top=this.targetElemTop+"px";

        }
        await sleepFor(this.turnSleepTime/this.getPixeljump());
        this.turnMovableHidden();
    }

    private async moveSleepCheck(t:number,l:number){
        await this.updateMovingElement(t,l);
        await sleepUntilNextFrame(this.frameSleepTime);
        await checkIfPaused();
    }
    private async moveHelperSleepCheck(t:number,l:number){
        await this.updateMovingHelperElement(t,l);
        await sleepUntilNextFrame(this.frameSleepTime);
        await checkIfPaused();
    }

    private formatLineString(tag:string,line:string){
        this.movableElem.innerHTML=`<${tag} style="margin:0px 0px; padding: 5px 10px; font: bold;">${line}</${tag}>`;
    }

    async adjustWidthOfMovable(n:number,w:number){
        if(this.movableElem.offsetWidth+n>w && this.movableElem.offsetWidth-n<w){
            this.movableElem.style.width=this.movableElem.offsetWidth+"px";
        }
        else if(this.movableElem.offsetWidth>w){
            this.movableElem.style.width=(this.movableElem.offsetWidth-n)+"px";
        }
        else{
            this.movableElem.style.width=(this.movableElem.offsetWidth+n)+"px";
        }
    }

    async adjustHeightOfMovable(n:number,h:number){
        if(this.movableElem.offsetHeight+n>h && this.movableElem.offsetHeight-n<h){
            this.movableElem.style.height=this.movableElem.offsetHeight+"px";
        }
        else if(this.movableElem.offsetHeight>h){
            this.movableElem.style.height=(this.movableElem.offsetHeight-n)+"px";
        }
        else{
            this.movableElem.style.height=(this.movableElem.offsetHeight+n)+"px";
        }
    }

    private createMovable=():HTMLDivElement=>{
        let newElem:HTMLDivElement;
        newElem = document.createElement("div");
        newElem.id="Movable";
        newElem.style.top=`${0}`;
        newElem.style.left=`${0}`;
        // newElem.style.width=`${50}px`;
        // newElem.style.height=`${50}px`;
        newElem.classList.add("testElemStyle");
        newElem.style.visibility="hidden";
        newElem.style.zIndex="2";

        getHtmlElement("body").appendChild(newElem);
        return newElem;
    }

    private createMovableHelper=():HTMLDivElement=>{
        let newElem:HTMLDivElement;
        newElem = document.createElement("div");
        newElem.id="MovableHelper";
        newElem.style.top=`${0}`;
        newElem.style.left=`${0}`;
        // newElem.style.width=`${50}px`;
        // newElem.style.height=`${50}px`;
        newElem.classList.add("testElemStyle");
        newElem.style.visibility="hidden";
        newElem.style.zIndex="2";

        getHtmlElement("body").appendChild(newElem);
        return newElem;
    }
    async turnMovableHidden():Promise <any>{
        this.movableElem.style.visibility="hidden";
    }

    async turnMovableVisible():Promise <any>{
        this.movableElem.style.visibility="visible";
    }
    async turnMovableHelperHidden():Promise <any>{
        this.movableHelper.style.visibility="hidden";
    }

    async turnMovableHelperVisible():Promise <any>{
        this.movableHelper.style.visibility="visible";
    }
    
    async updateMovingElement(mTop:number,mLeft:number){
        this.movableElem.style.top = (this.movableElem.offsetTop+mTop)+"px";
        this.movableElem.style.left = (this.movableElem.offsetLeft+mLeft)+"px";
    }
    async updateMovingHelperElement(mTop:number,mLeft:number){
        this.movableHelper.style.top = (this.movableHelper.offsetTop+mTop)+"px";
        this.movableHelper.style.left = (this.movableHelper.offsetLeft+mLeft)+"px";
    }
}
// export let animator = new Animator();