import { checkIfPaused, sleepFor } from "./AnimationUtil";
import { getHtmlElement } from "./Tools";

export const sleepUntilNextFrame=async(n:number):Promise <any>=>{
    await sleepFor(3*n)
}

export class Animator{

    movingElementFlag:boolean;
    movableElem:HTMLDivElement;
    currentLineElem:HTMLElement;
    descriptionLineElem:HTMLElement;
    descriptionTableBox:HTMLElement;
    outPutLinesElem:HTMLElement;
    outPutText:HTMLElement;
    vorgangElem:HTMLElement;
    symbolTableElem:HTMLElement;
    symbolTableBox:HTMLElement;
    targetElemTop:number=0;
    targetElemLeft:number=0;
    frameSleepTime:number = 5;
    constructor(){
        this.movingElementFlag = false;
        this.movableElem = this.createMovable();
        this.currentLineElem = getHtmlElement("currentLine");
        this.descriptionLineElem= getHtmlElement("descriptionLines");
        this.vorgangElem = getHtmlElement("Description");
        this.symbolTableElem= getHtmlElement("symbolTableLines");
        this.symbolTableBox= getHtmlElement("SymbolTable");
        this.outPutLinesElem = getHtmlElement("OutputLines");
        this.descriptionTableBox= getHtmlElement("descriptionSymboltableBox");
        this.outPutText = getHtmlElement("OutputText");
    }
    reset(){
        this.movingElementFlag=false;
        this.turnMovableHidden();
        this.frameSleepTime=3;
    }
    isCurrentlyInAnimation(){
        return this.movingElementFlag;
    }
    setMovableParameters(t:number,l:number,w:number,h:number){
        this.movableElem.style.top=t+"px";
        this.movableElem.style.left=l+"px";
        this.movableElem.style.height=h+"px";
        this.movableElem.style.width=w+"px";
    }


    async animationInputLineToCurrentLine(startingTop:number,startingLeft:number,startingWidth:number,startingHeight:number,line:string){
        this.setMovableParameters(startingTop,startingLeft,startingWidth,startingHeight);
        this.targetElemTop=this.currentLineElem.offsetTop;
        this.targetElemLeft = this.currentLineElem.offsetLeft;
        /* console.log("offsetLeft /TestElem/ -> "+this.movableElem.offsetLeft);
        console.log("offsetTop /TestElem/ -> "+this.movableElem.offsetTop);
        console.log("offsetTop /CurrentLineElem/ -> "+this.currentLineElem.offsetTop);
        console.log("offsetLeft /CurrentLineElem/ -> "+this.currentLineElem.offsetLeft); */
        this.turnMovableVisible();
        if(this.targetElemTop>this.movableElem.offsetTop){
            while(this.targetElemTop>this.movableElem.offsetTop){
                await this.moveSleepCheck(5,0);
            }
        }
        else if(this.targetElemTop==this.movableElem.offsetTop){
        }
        else{
            while(this.targetElemTop<this.movableElem.offsetTop){
                await this.moveSleepCheck(-5,0);
            }
        }
        await sleepFor(500);
        while(this.targetElemLeft>this.movableElem.offsetLeft){
            await this.moveSleepCheck(0,5);
        }
        await sleepFor(200);
        this.turnMovableHidden();
    }


    async moveLabeltoSymboltable(line:string){
        console.log([this.descriptionLineElem.offsetTop,this.descriptionLineElem.offsetHeight,this.vorgangElem.offsetHeight])
        this.setMovableParameters((this.descriptionLineElem.offsetTop+this.descriptionLineElem.offsetHeight-this.vorgangElem.offsetHeight),this.descriptionLineElem.offsetLeft,this.descriptionLineElem.offsetWidth,this.vorgangElem.offsetHeight);
        this.targetElemTop=this.symbolTableElem.offsetTop;
        this.turnMovableVisible();
        await sleepFor(500);
        while(this.targetElemTop>this.movableElem.offsetTop){
            await this.moveSleepCheck(5,0);
        }
        await sleepFor(500);
        this.turnMovableHidden();
    }
    async adjustWidthOfMovable(n:number,w:number){
        if(this.movableElem.offsetWidth>w){
            this.movableElem.style.width=(this.movableElem.offsetWidth-n)+"px";
        }
        else{
            this.movableElem.style.width=(this.movableElem.offsetWidth+n)+"px";
        }
    }
    async setTargetTopToSpeicherabbild(){
        let childElem:HTMLElement;
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
    async moveDetailToSpeicherabbild(line:string){
        
        this.setMovableParameters((this.descriptionLineElem.offsetTop+this.descriptionLineElem.offsetHeight-this.vorgangElem.offsetHeight),this.descriptionLineElem.offsetLeft,this.descriptionLineElem.offsetWidth,this.vorgangElem.offsetHeight);
        this.targetElemTop=this.symbolTableBox.offsetTop+this.symbolTableBox.offsetHeight;
        this.targetElemLeft=this.outPutText.offsetLeft;
        this.turnMovableVisible();
        await sleepFor(500);
        console.log(this.targetElemTop);

        while(this.targetElemTop>this.movableElem.offsetTop){
            await this.moveSleepCheck(5,0);
        }
        await sleepFor(200);
        while(this.targetElemLeft>this.movableElem.offsetLeft){
            await this.moveSleepCheck(0,3);
            await this.adjustWidthOfMovable(3,this.outPutText.offsetWidth);
        }
        // console.log(this.outPutLinesElem.firstChild);
        // console.log(this.outPutLinesElem.childElementCount);
        await this.setTargetTopToSpeicherabbild();
        // this.targetElemTop=this.symbolTableBox.offsetTop+this.symbolTableBox.offsetHeight;
        await sleepFor(200);
        console.log(this.targetElemTop);
        if(this.targetElemTop>this.movableElem.offsetTop){
            while(this.targetElemTop>this.movableElem.offsetTop){
                await this.moveSleepCheck(5,0);
            }
        }
        else if(this.targetElemTop==this.movableElem.offsetTop){
        }
        else{
            while(this.targetElemTop<this.movableElem.offsetTop){
                await this.moveSleepCheck(-5,0);
            }
        }
        await sleepFor(500);
        this.turnMovableHidden();
    }


    private async moveSleepCheck(t:number,l:number){
        await this.updateMovingElement(t,l);
        await sleepUntilNextFrame(this.frameSleepTime);
        await checkIfPaused();
    }


    createMovable=():HTMLDivElement=>{
        let newElem:HTMLDivElement;
        newElem = document.createElement("div");
        newElem.id="Movable";
        newElem.classList.add("testElemStyle");
        newElem.style.top=`${0}`;
        newElem.style.left=`${0}`;
        newElem.style.width=`${50}px`;
        newElem.style.height=`${50}px`;
        newElem.style.visibility="hidden";
        newElem.style.zIndex="5";

        getHtmlElement("body").appendChild(newElem);
        return newElem;
    }


    async turnMovableHidden():Promise <any>{
        getHtmlElement("Movable").style.visibility="hidden";
    }


    async turnMovableVisible():Promise <any>{
        getHtmlElement("Movable").style.visibility="visible";
    }

    
    async updateMovingElement(mTop:number,mLeft:number){
        this.movableElem.style.top = (this.movableElem.offsetTop+mTop)+"px";
        this.movableElem.style.left = (this.movableElem.offsetLeft+mLeft)+"px";
    }
}
// export let animator = new Animator();