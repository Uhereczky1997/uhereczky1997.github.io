import { aniControl, AnimationType, checkIfPaused, sleepFor, sleepForFrame, sleepStaticAnimation, sleepStaticAnimationHalf, sleepStopStartTime, sleepUntilNextStep } from "./AnimationUtil";
import { Manipulator } from "./Backend/Manipulator";
import { root, rootVariables } from "./index";
import { p2LabelValuePlaceholder, symboladdress, targetlabelValuePlaceholder, targetSymbolTableLine } from "./ProjectWindow";
import { getHtmlElement, resizer, updateScrollOfIn_Out, updateScrollOfSymbolTable } from "./Tools";


const arrowHeadID:string="arrowHead";
const arrowVerticalID:string="arrowVertical";
const arrowJointID:string="arrowJoint";
const arrowHorizontalID:string="arrowHorizontal";
const arrowUp_DownCN:string="arrowUP_Down";
const arrowLeft_RightCN:string="arrowLeft_Right";
const arrowHorizontalID2:string="arrowHorizontal2";
const arrowJointID2:string="arrowJoint2";

const UP:string="up";
const DOWN:string="down";
const LEFT:string="left";
const RIGHT:string="right";
const JQ1:string ="jq1";
const JQ2:string ="jq2";
const JQ3:string ="jq3";
const JQ4:string ="jq4";
export const addressbyte:string="addressbyte";
const overlapdivider:number=50;
const aniTp2TimeAdjuster:number=8;

const bodyElem = getHtmlElement("body");

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
    arrowElems:HTMLDivElement[]=[];
    targetElemTop:number=0;
    targetElemLeft:number=0;
    turnSleepTime:number = 1000;
    addresszaehlerElem:HTMLElement;
    translatedinfoDividerDiv:HTMLElement;

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
        this.addresszaehlerElem = getHtmlElement("Addresszahler");
        this.translatedinfoDividerDiv=getHtmlElement("translatedinfoDividerDiv");
    }

    reset(){
        this.movingElementFlag=false;
        this.turnMovableHidden();
        this.turnMovableHelperHidden();
        this.turnArrowElemsHidden();
        this.frameSleepTime=10;
        this.turnSleepTime = 1000;
    }

    private roundArrowsUp(){
        let elem:HTMLElement;
        for(let i= 0;i<this.arrowElems.length;i++){
            elem = this.arrowElems[i];
            
            if(elem.id.startsWith("arrowHorizontal")){
                // elem.style.width=elem.offsetWidth.toFixed(1)+"px";
                elem.style.width=Math.ceil(elem.offsetWidth)+"px";
            }
            else if(elem.id.startsWith("arrowVertical")){
                // elem.style.height=elem.offsetHeight.toFixed(1)+"px";
                elem.style.height=Math.ceil(elem.offsetHeight)+"px";
                elem.style.left = Math.ceil(elem.offsetLeft)+"px";

            }
            else if(elem.id.startsWith("arrowJoint")){
                elem.style.top =Math.ceil(elem.offsetTop)+"px";
                elem.style.left = Math.ceil(elem.offsetLeft)+"px";
            }
            else{
                /* elem.style.top =elem.offsetTop.toFixed(1)+"px";
                elem.style.left = elem.offsetLeft.toFixed(1)+"px"; */
            }
        }
    }
    async moveLabeltoSymboltableALTMoveableHelper(hex:string){
        if(aniControl.isAni3()) return;

        this.movableHelper.style.top=this.addresszaehlerElem.offsetTop+"px";
        this.movableHelper.style.left=this.addresszaehlerElem.offsetLeft+"px";
        this.movableHelper.innerHTML=this.formatLineString("h3",hex);
        let placeholder:HTMLSpanElement = document.getElementById(targetlabelValuePlaceholder) as HTMLSpanElement;
        if(placeholder==null){
            throw new Error("BRUV");
        }
        let n = updateScrollOfSymbolTable(targetlabelValuePlaceholder);
        this.targetElemTop=placeholder.offsetTop-n+placeholder.offsetHeight*1/2-this.movableHelper.offsetHeight*1/2;
        this.targetElemLeft=placeholder.offsetLeft;
        
        if(aniControl.isAni1()){
            this.turnMovableHelperVisible();
            await sleepStopStartTime();
            while(placeholder.offsetLeft>this.movableHelper.offsetLeft){
                await this.moveHelperSleepCheck(0,this.getPixeljump());
            }
            this.movableHelper.style.left=placeholder.offsetLeft+"px";
            await sleepStopStartTime();
            while(this.targetElemTop>this.movableHelper.offsetTop){
                await this.moveHelperSleepCheck(this.getPixeljump(),0);
            }
            this.movableHelper.style.top=this.targetElemTop+"px";
    
            await sleepStopStartTime();
            this.turnMovableHelperHidden();
            return;

        }
        else{
            this.movableElem.innerHTML=this.formatLineString("h3",hex);
            this.movableElem.style.top=this.targetElemTop+"px";
            this.movableElem.style.left=this.targetElemLeft+"px";
            let temp = this.spanStaticArrows(
                this.movableHelper.offsetTop,
                this.movableHelper.offsetLeft,
                this.movableHelper.offsetWidth,
                this.movableHelper.offsetHeight,
                this.movableElem.offsetTop,
                this.movableElem.offsetLeft,
                this.movableElem.offsetWidth,
                this.movableElem.offsetHeight,"up");
          
            this.roundArrowsUp();
            this.turnMovableVisible();
            this.turnArrowElemVisible(temp);
            await this.turnMovableHelperVisible();
            await sleepStaticAnimation();
            await this.turnArrowElemsHidden();
            await this.turnMovableHelperHidden();
            await this.turnMovableHidden();
        }
    }

    async moveLabeltoSymboltableALTMoveable(line:string){
        if(aniControl.isAni3()) return;
        let targetElem = getHtmlElement(targetSymbolTableLine);

        this.movableElem.innerHTML=this.formatLineString("h3",line);
        this.setMovableParameters((this.descriptionLineElem.offsetTop+this.descriptionLineElem.offsetHeight-this.vorgangElem.offsetHeight),this.descriptionLineElem.offsetLeft);
        let n = updateScrollOfSymbolTable(targetSymbolTableLine);
        this.targetElemTop=targetElem.offsetTop-n+targetElem.offsetHeight/2-this.movableElem.offsetHeight/2;

        if(aniControl.isAni1()){
            this.turnMovableVisible();
            await sleepStopStartTime();
            while(this.targetElemTop>this.movableElem.offsetTop){
                await this.moveSleepCheck(this.getPixeljump(),0);
            }
            this.movableElem.style.top=this.targetElemTop+"px";
            await sleepStopStartTime();
            this.turnMovableHidden();
            return;
        }
        else{
            this.movableHelper.innerHTML=this.formatLineString("h3",line);
            this.movableHelper.style.top=this.targetElemTop+"px";
            this.movableHelper.style.left=this.targetElemLeft+"px";
            let arrowHead = this.getArrowElem(arrowHeadID);
            let arrowVertical = this.getArrowElem(arrowVerticalID);
            this.setClassOfHead(DOWN);
            this.toggleToUp(true);
            arrowHead.style.top=this.movableHelper.offsetTop-arrowHead.offsetHeight+"px";
            arrowHead.style.left=this.movableHelper.offsetLeft+this.movableHelper.offsetWidth/2-arrowHead.offsetWidth/2+"px";
            arrowVertical.style.top=this.movableElem.offsetTop+this.movableElem.offsetHeight-this.movableElem.offsetHeight/overlapdivider+"px";
            arrowVertical.style.left=arrowHead.offsetLeft+arrowHead.offsetWidth/2-arrowVertical.offsetWidth/2+"px";
            arrowVertical.style.height=arrowHead.offsetHeight/overlapdivider+this.movableElem.offsetHeight/overlapdivider+arrowHead.offsetTop-this.movableElem.offsetTop-this.movableElem.offsetHeight+"px";
            
            this.roundArrowsUp();
            this.turnMovableVisible();
            this.turnArrowElemVisible([arrowHeadID,arrowVerticalID]);
            await this.turnMovableHelperVisible();
            await sleepStaticAnimation();
            await this.turnArrowElemsHidden();
            await this.turnMovableHelperHidden();
            await this.turnMovableHidden();
        }
    }

    async exchangeLabelWithSymbolTable(toLine:string,returnLine:string,id:number){
        if(aniControl.isAni3()) return;
        let targetElem = getHtmlElement(`symbol${id}`);

        this.movableElem.innerHTML=this.formatLineString("h3",toLine);
        this.setMovableParameters((this.descriptionLineElem.offsetTop+this.descriptionLineElem.offsetHeight-this.movableElem.offsetHeight),this.descriptionLineElem.offsetLeft);

        if(targetElem!=null){
            let n= updateScrollOfSymbolTable(targetElem.id)
            this.targetElemTop=targetElem.offsetTop-(n>0?n:0)+targetElem.offsetHeight/2-this.movableElem.offsetHeight/2;
        }
        else{
            this.targetElemTop=this.symbolTableElem.offsetTop;
        }
        if(aniControl.isAni1()){
            this.turnMovableVisible();
            await sleepStopStartTime();
            while(this.targetElemTop>this.movableElem.offsetTop){
                await this.moveSleepCheck(this.getPixeljump(),0);
            }
            this.movableElem.style.top=this.targetElemTop+"px";
    
            await sleepStopStartTime();
            if(id<0){
                this.turnMovableHidden();
                return;
            }
            // await sleepStopStartTime();
            // this.movableElem.innerHTML=`<h3 class="moveableText">${returnLine}</h3>`;
            this.movableElem.innerHTML=this.formatLineString("h3",returnLine);
            this.targetElemTop=this.descriptionLineElem.offsetTop+this.descriptionLineElem.offsetHeight-this.vorgangElem.offsetHeight;
            while(this.targetElemTop<this.movableElem.offsetTop){
                await this.moveSleepCheck(-this.getPixeljump(),0);
            }
            this.movableElem.style.top=this.targetElemTop+"px";
    
            await sleepStopStartTime();
            this.turnMovableHidden();
            return;
        }
        else{
            this.movableHelper.innerHTML=this.formatLineString("h3",toLine);
            this.movableHelper.style.top=this.targetElemTop+"px";
            this.movableHelper.style.left=this.targetElemLeft+"px";
            let arrowHead = this.getArrowElem(arrowHeadID);
            let arrowVertical = this.getArrowElem(arrowVerticalID);
            this.setClassOfHead(DOWN);
            this.toggleToUp(true);
            arrowHead.style.top=this.movableHelper.offsetTop-arrowHead.offsetHeight+"px";
            arrowHead.style.left=this.movableHelper.offsetLeft+this.movableHelper.offsetWidth/2-arrowHead.offsetWidth/2+"px";
            arrowVertical.style.left=arrowHead.offsetLeft+arrowHead.offsetWidth/2-arrowVertical.offsetWidth/2+"px";
            arrowVertical.style.height=arrowHead.offsetHeight/overlapdivider+this.movableElem.offsetHeight/overlapdivider+arrowHead.offsetTop-this.movableElem.offsetTop-this.movableElem.offsetHeight+"px";
            arrowVertical.style.top=this.movableElem.offsetTop+this.movableElem.offsetHeight-this.movableElem.offsetHeight/overlapdivider+"px";
            this.roundArrowsUp();
            this.turnMovableVisible();
            this.turnArrowElemVisible([arrowHeadID,arrowVerticalID]);
            this.turnMovableHelperVisible();

            await sleepStaticAnimation();

            await this.turnArrowElemsHidden();
            await this.turnMovableHelperHidden();
            await this.turnMovableHidden();
            if(id<0){
                return;
            }

            this.movableHelper.innerHTML=this.formatLineString("h3",returnLine);
            this.movableElem.innerHTML=this.formatLineString("h3",returnLine);
            await sleepStopStartTime();

            this.setClassOfHead(UP);
            arrowHead.style.top=this.movableElem.offsetTop+this.movableElem.offsetHeight+"px";
            arrowHead.style.left=this.movableElem.offsetLeft+this.movableElem.offsetWidth/2-arrowHead.offsetWidth/2+"px";

            arrowVertical.style.top=arrowHead.offsetTop+arrowHead.offsetHeight-arrowHead.offsetHeight/overlapdivider+"px";
            arrowVertical.style.left=arrowHead.offsetLeft+arrowHead.offsetWidth/2-arrowVertical.offsetWidth/2+"px";
            arrowVertical.style.height=arrowHead.offsetHeight/overlapdivider+this.movableHelper.offsetHeight/overlapdivider-arrowHead.offsetTop-arrowHead.offsetHeight+this.movableHelper.offsetTop+"px";
            this.roundArrowsUp();
            this.turnMovableVisible();
            this.turnArrowElemVisible([arrowHeadID,arrowVerticalID]);
            this.turnMovableHelperVisible();

           await sleepStaticAnimation();

            await this.turnArrowElemsHidden();
            await this.turnMovableHelperHidden();
            await this.turnMovableHidden();
        }
    }
    async searchEntryInSymboltablephaseOne(idToSearch:string,entryName:string,idToFind:number){
        if(aniControl.isAni3()) return;
        let isSuccessful:boolean =false;
        let fromElem = document.getElementById(idToSearch);
        this.movableElem.innerHTML=this.formatLineString("h3",entryName);

        let arrowHead = this.getArrowElem(arrowHeadID);
        let arrowHorizontal = this.getArrowElem(arrowHorizontalID);
        let arrowJoint = this.getArrowElem(arrowJointID);
        let arrowVertical = this.getArrowElem(arrowVerticalID);

        this.setClassOfHead(DOWN);
        this.setClassOfJoint(1,JQ2);
        this.toggleToUp(true);
        //setup parameters
        let toElem:HTMLElement;
        toElem =this.symbolTableElem.firstChild as HTMLElement;
        let n =updateScrollOfSymbolTable(toElem.id);
        arrowHead.style.top=toElem.offsetTop-(n>0?n:0)-arrowHead.offsetHeight+"px";

        if(fromElem !=null){
            this.movableElem.style.left=fromElem.offsetLeft+fromElem.offsetWidth/2-this.movableElem.offsetWidth/2+"px";
            this.movableElem.style.top=fromElem.offsetTop-this.descriptionLineElem.scrollTop+fromElem.offsetHeight/2-this.movableElem.offsetHeight/2+"px";

            arrowHorizontal.style.top=this.movableElem.offsetTop+this.movableElem.offsetHeight/2-arrowHorizontal.offsetHeight/2+"px";
            arrowHead.style.left = this.descriptionTableBox.offsetLeft+this.descriptionTableBox.offsetWidth/100+"px";
            
            arrowJoint.style.top = arrowHorizontal.offsetTop+"px";
            arrowJoint.style.left= arrowHead.offsetLeft+arrowHead.offsetWidth/2-arrowJoint.offsetWidth/2+"px";
            
            arrowHorizontal.style.width=this.movableElem.offsetLeft-arrowJoint.offsetLeft+arrowJoint.offsetWidth/overlapdivider+this.movableElem.offsetWidth/overlapdivider+"px";
            arrowHorizontal.style.left = arrowJoint.offsetLeft+arrowJoint.offsetWidth-arrowJoint.offsetWidth/overlapdivider+"px";

            arrowVertical.style.left=arrowJoint.offsetLeft+"px";
            arrowVertical.style.top=arrowJoint.offsetTop+arrowJoint.offsetHeight-arrowJoint.offsetHeight/overlapdivider+"px";
            arrowVertical.style.height=arrowHead.offsetTop-arrowJoint.offsetTop+arrowHead.offsetHeight/overlapdivider+arrowJoint.offsetHeight/overlapdivider+"px";
            this.roundArrowsUp();
            this.turnArrowElemVisible([arrowHeadID,arrowVerticalID,arrowJointID,arrowHorizontalID]);

        }
        else{
            this.movableElem.style.left=this.descriptionTableBox.offsetLeft+"px";
            this.movableElem.style.top=this.descriptionTableBox.offsetTop+this.descriptionTableBox.offsetHeight-this.movableElem.offsetHeight+"px";

            arrowHead.style.left=this.movableElem.offsetLeft+this.movableElem.offsetWidth/2-arrowHead.offsetWidth/2+"px";
            arrowVertical.style.left = arrowHead.offsetLeft+arrowHead.offsetWidth/2-arrowVertical.offsetWidth/2+"px";
            arrowVertical.style.top= this.movableElem.offsetTop+this.movableElem.offsetHeight-this.movableElem.offsetHeight/overlapdivider+"px";
            arrowVertical.style.height=arrowHead.offsetTop-this.movableElem.offsetTop+arrowHead.offsetHeight/overlapdivider+this.movableElem.offsetHeight/overlapdivider+"px";
            this.roundArrowsUp();
            this.turnArrowElemVisible([arrowHeadID,arrowVerticalID]);
        }

        this.turnMovableVisible();

        if(idToFind>=0 && this.symbolTableElem.childElementCount-2>=idToFind){
            isSuccessful=true;
        }
        else{
            idToFind=this.symbolTableElem.childElementCount>1?this.symbolTableElem.childElementCount-2:0;
        }
        for(let i=0;i<=idToFind;i++){
            if(i==0){
                await sleepStaticAnimationHalf();
                continue;
            }
            if(this.symbolTableElem.childElementCount==i){
                //probably wont happen but just to make sure
                break;
            }
            toElem = this.symbolTableElem.children[i] as HTMLElement;
            n =updateScrollOfSymbolTable(toElem.id);
            //ArrowSetup
            arrowHead.style.top=toElem.offsetTop-(n>0?n:0)-arrowHead.offsetHeight+"px";
            if(fromElem !=null){
                arrowVertical.style.height=arrowHead.offsetTop-arrowJoint.offsetTop+arrowHead.offsetHeight/overlapdivider+arrowJoint.offsetHeight/overlapdivider+"px";
            }
            else{
                arrowVertical.style.height=arrowHead.offsetTop-this.movableElem.offsetTop+arrowHead.offsetHeight/overlapdivider+this.movableElem.offsetHeight/overlapdivider+"px";
            }
            // arrowVertical.style.height=arrowVertical.offsetHeight+toElem.offsetHeight+"px";
            //wait for a step
            await sleepStaticAnimationHalf();
            //next turn
        }
        //set everything invisible
        await this.turnArrowElemsHidden();
        // await this.turnMovableHelperHidden();
        await this.turnMovableHidden();


    }
    async searchEntryInSymboltablephaseTwo(fromId:number,valueToReturn:string){
        if(aniControl.isAni3()) return;
        let fromElem=getHtmlElement(symboladdress+(fromId));;
        let toElem = getHtmlElement(p2LabelValuePlaceholder);
        if(toElem==null){
            throw new Error("placeholder-div was not found");
        }
        //setup return value
        this.movableElem.innerHTML=this.formatLineString("h3",valueToReturn);
        this.movableHelper.innerHTML=this.formatLineString("h3",valueToReturn);

        
        let n =updateScrollOfSymbolTable(fromElem.id);

        this.movableElem.style.left=fromElem.offsetLeft+fromElem.offsetWidth/2-this.movableElem.offsetWidth/2+"px";
        this.movableElem.style.top=fromElem.offsetTop-(n>0?n:0)+fromElem.offsetHeight/2-this.movableElem.offsetHeight/2+"px";
        
        this.movableHelper.style.top=toElem.offsetTop-this.descriptionLineElem.scrollTop+toElem.offsetHeight/2-this.movableHelper.offsetHeight/2+"px";
        this.movableHelper.style.left=toElem.offsetLeft+toElem.offsetWidth/2-this.movableHelper.offsetWidth/2+"px";
        

        if(aniControl.isAni1()){
            this.turnMovableVisible();
            await sleepStopStartTime();
            while(this.movableElem.offsetLeft<this.movableHelper.offsetLeft){
                await this.moveSleepCheck(0,this.getPixeljump());
            }
            this.movableElem.style.left=this.movableHelper.offsetLeft+"px";
            await sleepStopStartTime();
            while(this.movableElem.offsetTop>this.movableHelper.offsetTop){
                await this.moveSleepCheck(-this.getPixeljump(),0);
            }
            this.movableElem.style.top=this.movableHelper.offsetTop+"px";
            await sleepStopStartTime();
            this.turnMovableHidden();
            return;
        }
        else{
            let temp = this.spanStaticArrows(
                this.movableElem.offsetTop,
                this.movableElem.offsetLeft,
                this.movableElem.offsetWidth,
                this.movableElem.offsetHeight,
                this.movableHelper.offsetTop,
                this.movableHelper.offsetLeft,
                this.movableHelper.offsetWidth,
                this.movableHelper.offsetHeight,"side");
            this.roundArrowsUp();
            this.turnMovableVisible();
            this.turnArrowElemVisible(temp);
            this.turnMovableHelperVisible();

            await sleepStaticAnimation();

            await this.turnArrowElemsHidden();
            await this.turnMovableHelperHidden();
            await this.turnMovableHidden();
            return;
        }
    }

    async pushAufzulosendestoCurrentLine(i:number,line:string){
        if(aniControl.isAni3()) return;
        let childelem = getHtmlElement(`${(i+1)<10?"0"+(i+1):(i+1)}outputP`);

        let n= updateScrollOfIn_Out(this.outPutText.id,childelem.id);
        // console.log(n);
        await this.setMovableParameters(childelem.offsetTop-n,this.outPutText.offsetLeft);
        this.movableElem.innerHTML=this.formatLineString("h3",line);
        this.targetElemTop=this.currentLineElem.offsetTop+this.currentLineElem.offsetHeight-this.movableElem.offsetHeight;
        this.targetElemLeft = this.currentLineElem.offsetLeft;
        if(aniControl.isAni1()){
            this.turnMovableVisible();
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
            await sleepStopStartTime();
            while(this.targetElemLeft<this.movableElem.offsetLeft){
                await this.moveSleepCheck(0,-this.getPixeljump());
            }
            this.movableElem.style.left=this.targetElemLeft+"px";
            await sleepStopStartTime();
            this.turnMovableHidden();
            return;
        }
        this.movableHelper.innerHTML=this.formatLineString("h3",line);
        this.movableHelper.style.top=this.targetElemTop+"px";
        this.movableHelper.style.left=this.targetElemLeft+"px";
        let arrowHead = this.getArrowElem(arrowHeadID);
        let arrowHorizontal = this.getArrowElem(arrowHorizontalID);
        let arrowJoint = this.getArrowElem(arrowJointID);
        let arrowVertical = this.getArrowElem(arrowVerticalID);

        this.setClassOfHead(LEFT);
        this.setClassOfJoint(1,JQ1);
        this.toggleToUp(false);
        

        arrowHead.style.top=this.movableHelper.offsetTop+this.movableHelper.offsetHeight/2-arrowHead.offsetHeight/2+"px";
        arrowHead.style.left=this.movableHelper.offsetLeft+this.movableHelper.offsetWidth+"px";

        arrowHorizontal.style.top=arrowHead.offsetTop+arrowHead.offsetHeight/2-arrowHorizontal.offsetHeight/2+"px";
        if(this.movableHelper.offsetTop+2*this.movableHelper.offsetHeight>=this.movableElem.offsetTop 
            && this.movableHelper.offsetTop+this.movableHelper.offsetHeight/2<=this.movableElem.offsetTop){
                let arrowHorizontal2 = this.getArrowElem(arrowHorizontalID2);
                let arrowJoint2 = this.getArrowElem(arrowJointID2);

                this.setClassOfJoint(2,JQ3);

                arrowHorizontal.style.width=arrowHead.offsetWidth/overlapdivider+arrowHead.offsetWidth+arrowJoint.offsetWidth/overlapdivider+"px";
                arrowHorizontal.style.left=arrowHead.offsetLeft-arrowHead.offsetWidth/overlapdivider+arrowHead.offsetWidth+"px";

                arrowHorizontal2.style.top=this.movableElem.offsetTop+this.movableElem.offsetHeight/2-arrowHorizontal2.offsetHeight/2+"px";

                arrowJoint.style.top= arrowHorizontal.offsetTop+"px";
                arrowJoint.style.left=arrowHorizontal.offsetLeft+arrowHorizontal.offsetWidth-arrowJoint.offsetWidth/overlapdivider+"px";

                arrowVertical.style.left=arrowJoint.offsetLeft+"px";
                
                arrowJoint2.style.left = arrowJoint.offsetLeft+"px";
                arrowJoint2.style.top = arrowHorizontal2.offsetTop+"px";

                arrowVertical.style.height = arrowJoint2.offsetTop-arrowJoint.offsetTop-arrowJoint.offsetHeight
                    +arrowJoint.offsetHeight/overlapdivider+arrowJoint2.offsetHeight/overlapdivider+"px";
                arrowVertical.style.top = arrowJoint.offsetTop+arrowJoint.offsetHeight-arrowJoint.offsetHeight/overlapdivider+"px";

                arrowHorizontal2.style.left= arrowJoint2.offsetLeft+arrowJoint2.offsetWidth-arrowJoint2.offsetWidth/overlapdivider+"px";

                arrowHorizontal2.style.width = -arrowJoint2.offsetLeft-arrowJoint2.offsetWidth/overlapdivider
                    +this.movableElem.offsetLeft-arrowJoint2.offsetWidth+this.movableElem.offsetWidth/overlapdivider+"px";

                this.roundArrowsUp();
                this.turnMovableVisible();
                this.turnArrowElemVisible([arrowHeadID,arrowVerticalID,arrowJointID,arrowHorizontalID,arrowHorizontalID2,arrowJointID2]);
                await this.turnMovableHelperVisible();
                await sleepStaticAnimation();
                await this.turnArrowElemsHidden();
                await this.turnMovableHelperHidden();
                await this.turnMovableHidden();
                return;
        }
        arrowVertical.style.left=this.movableElem.offsetLeft+this.movableElem.offsetWidth/2-arrowVertical.offsetWidth/2+"px";
        
        arrowJoint.style.top=arrowHorizontal.offsetTop+"px";
        arrowJoint.style.left=arrowVertical.offsetLeft+"px";
        
        arrowHorizontal.style.width=arrowHead.offsetWidth/overlapdivider+arrowJoint.offsetWidth/overlapdivider-arrowHead.offsetLeft-arrowHead.offsetWidth+arrowJoint.offsetLeft+"px";
        arrowHorizontal.style.left=arrowHead.offsetLeft+arrowHead.offsetWidth-arrowHead.offsetWidth/overlapdivider+"px";
        
        arrowVertical.style.height=arrowJoint.offsetHeight/overlapdivider+this.movableElem.offsetHeight/overlapdivider+this.movableElem.offsetTop-arrowJoint.offsetTop+"px";

        arrowVertical.style.top=arrowJoint.offsetTop+arrowJoint.offsetHeight-arrowJoint.offsetHeight/overlapdivider+"px";

        this.roundArrowsUp();
        this.turnMovableVisible();
        this.turnArrowElemVisible([arrowHeadID,arrowVerticalID,arrowJointID,arrowHorizontalID]);
        await this.turnMovableHelperVisible();
        await sleepStaticAnimation();
        await this.turnArrowElemsHidden();
        await this.turnMovableHelperHidden();
        await this.turnMovableHidden();

    }

    async animationInputLineToCurrentLine(id:number,line:string){
        if(aniControl.isAni3()){
            return;
        }
        this.movableElem.innerHTML=this.formatLineString("h3",line);

        await this.setStartTopToInputLine(id);
        this.targetElemTop= this.currentLineElem.offsetTop+this.currentLineElem.offsetHeight-this.movableElem.offsetHeight;
        this.targetElemLeft = this.currentLineElem.offsetLeft;
        this.turnMovableVisible();
        if(aniControl.isAni1()){

            await sleepStopStartTime();
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
            await sleepStopStartTime();
            while(this.targetElemLeft>this.movableElem.offsetLeft){
                await this.moveSleepCheck(0,this.getPixeljump());
            }
            this.movableElem.style.left=this.targetElemLeft+"px";
            await sleepStopStartTime();
            this.turnMovableHidden();
            return;
        }
        
        this.movableHelper.innerHTML=this.formatLineString("h3",line);
        this.movableHelper.style.top=this.targetElemTop+"px";
        this.movableHelper.style.left=this.targetElemLeft+"px";
        let temp = this.spanStaticArrows(
            this.movableElem.offsetTop,
            this.movableElem.offsetLeft,
            this.movableElem.offsetWidth,
            this.movableElem.offsetHeight,
            this.movableHelper.offsetTop,
            this.movableHelper.offsetLeft,
            this.movableHelper.offsetWidth,
            this.movableHelper.offsetHeight,"up");

        this.roundArrowsUp();
        this.turnMovableVisible();
        this.turnArrowElemVisible(temp);
        await this.turnMovableHelperVisible();
        await sleepStaticAnimation();
        await this.turnArrowElemsHidden();
        await this.turnMovableHelperHidden();
        await this.turnMovableHidden();
        
    }

    async moveDetailToSpeicherabbild(line:string,id:number){
        if(aniControl.isAni3()) return;
        this.setMovableParameters(this.translatedinfoDividerDiv.offsetTop,this.descriptionTableBox.offsetLeft);
        this.movableElem.innerHTML=this.formatLineString("h3",line);
        await this.setTargetTopToSpeicherabbild(id);       
        this.targetElemLeft=this.outPutText.offsetLeft;
        if(aniControl.isAni1()){

            this.turnMovableVisible();
            await sleepStopStartTime();
            // await sleepStopStartTime();
            while(this.targetElemLeft>this.movableElem.offsetLeft){
                await this.moveSleepCheck(0,this.getPixeljump());
                // await this.adjustWidthOfMovable(this.getPixeljump(),this.outPutText.offsetWidth);
            }
            this.movableElem.style.left=this.targetElemLeft+"px";
            // this.movableElem.style.width=this.outPutText.offsetWidth+"px";
            await sleepStopStartTime();
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
            await sleepStopStartTime();
            this.turnMovableHidden();
            return;
        }
        this.movableHelper.innerHTML=this.formatLineString("h3",line);
        this.movableHelper.style.top=this.targetElemTop+"px";
        this.movableHelper.style.left=this.targetElemLeft+"px";
        let temp = this.spanStaticArrows(
            this.movableElem.offsetTop,
            this.movableElem.offsetLeft,
            this.movableElem.offsetWidth,
            this.movableElem.offsetHeight,
            this.movableHelper.offsetTop,
            this.movableHelper.offsetLeft,
            this.movableHelper.offsetWidth,
            this.movableHelper.offsetHeight,"side");
        
        this.roundArrowsUp();
        this.turnMovableVisible();
        this.turnArrowElemVisible(temp);
        await this.turnMovableHelperVisible();
        await sleepStaticAnimation();
        await this.turnArrowElemsHidden();
        await this.turnMovableHelperHidden();
        await this.turnMovableHidden();
    }

    async displayAddresserhoehung(id:number,i:string,pre:string,hex:string){
        if(aniControl.isAni3()) return;
        console.log(addressbyte+id);
        let targetelem = document.getElementById(addressbyte+id);
        this.movableElem.innerHTML=this.formatLineString("h1",pre+i);
        let endaddr:string = this.addresszaehlerElem.innerHTML;
        console.log(i);
        /* if(Manipulator.isBin(i)){
            endaddr = Manipulator.formatHextoDat16(String(Manipulator.hexToDec(hex)-Manipulator.binToDec(i)));
        }
        else if(Manipulator.isHex(i)){
            endaddr = Manipulator.formatHextoDat16(String(Manipulator.hexToDec(hex)-Manipulator.hexToDec(i)));
        } 
        else endaddr = Manipulator.formatHextoDat16(String(Manipulator.hexToDec(hex)-Number(i)))
         */
        // let endaddr:string = String(Manipulator.hexToDec(hex)-i); // DecOrHex
        // console.log(endaddr);
        if(targetelem != null){
            this.movableElem.style.top= targetelem.offsetTop-this.descriptionLineElem.scrollTop+targetelem.offsetHeight/2-this.movableElem.offsetHeight/2+"px";
            this.movableElem.style.left= targetelem.offsetLeft+targetelem.offsetWidth/2-this.movableElem.offsetWidth/2+"px";
        }
        else{
            console.log("elem not found")
            this.movableElem.style.top= this.descriptionTableBox.offsetTop+this.descriptionTableBox.offsetHeight-this.movableElem.offsetHeight+"px";
            this.movableElem.style.left= this.descriptionTableBox.offsetLeft+this.descriptionTableBox.offsetWidth/2+"px";
        }
        this.targetElemLeft=this.addresszaehlerElem.offsetLeft+this.addresszaehlerElem.offsetWidth;
        this.targetElemTop =this.translatedinfoDividerDiv.offsetTop;

        if(aniControl.isAni1()){
            this.movableHelper.innerHTML=this.formatLineString("h1",endaddr);
            this.movableHelper.style.left = this.addresszaehlerElem.offsetLeft+this.addresszaehlerElem.offsetWidth/2-this.movableHelper.offsetWidth/2+"px";
            this.movableHelper.style.top = this.translatedinfoDividerDiv.offsetTop+"px";
            this.turnMovableVisible();
    
            await sleepStopStartTime();
    
            while(this.movableElem.offsetLeft>this.targetElemLeft){
                await this.moveSleepCheck(0,-this.getPixeljump());
            }
            await sleepStopStartTime();
    
            while(this.movableElem.offsetTop<this.targetElemTop){
                await this.moveSleepCheck(this.getPixeljump(),0);
            }
            this.movableElem.style.top=this.targetElemTop+"px";

            this.turnMovableHelperVisible();
    
            await sleepStopStartTime();
            await sleepStopStartTime();
            await sleepStopStartTime();
            while(this.movableElem.offsetLeft+this.movableElem.offsetWidth>this.movableHelper.offsetLeft+this.movableHelper.offsetWidth 
                &&this.movableElem.offsetLeft>this.movableHelper.offsetLeft){
                await this.moveSleepCheck(0,-this.getPixeljump());
            }

            this.turnMovableHidden();

            this.movableHelper.innerHTML=this.formatLineString("h1",Manipulator.formatHextoDat16(hex));
            await sleepStopStartTime();
            await sleepStopStartTime();

            this.turnMovableHelperHidden();
            return;
        }
        else{
            let arrowHead = this.getArrowElem(arrowHeadID);
            let arrowHorizontal = this.getArrowElem(arrowHorizontalID);
            let arrowJoint = this.getArrowElem(arrowJointID);
            let arrowVertical = this.getArrowElem(arrowVerticalID);

            this.setClassOfHead(DOWN);
            this.setClassOfJoint(1,JQ2);
            this.toggleToUp(true);
            this.movableHelper.innerHTML=this.formatLineString("h1","+"+i);
            this.movableHelper.style.left = this.targetElemLeft+"px";
            this.movableHelper.style.top = this.targetElemTop+"px";
            
            arrowHead.style.top=(this.movableHelper.offsetTop-arrowHead.offsetHeight)+"px";
            arrowHead.style.left=(this.movableHelper.offsetLeft+this.movableHelper.offsetWidth/2-arrowHead.offsetWidth/2)+"px";

            arrowVertical.style.left=(arrowHead.offsetLeft+arrowHead.offsetWidth/2-arrowVertical.offsetWidth/2)+"px";

            arrowHorizontal.style.top=(this.movableElem.offsetTop+this.movableElem.offsetHeight/2-arrowHorizontal.offsetHeight/2)+"px";

            arrowJoint.style.top=(arrowHorizontal.offsetTop)+"px";
            arrowJoint.style.left=(arrowVertical.offsetLeft)+"px";

            arrowHorizontal.style.width=(this.movableElem.offsetWidth/overlapdivider+arrowJoint.offsetWidth/overlapdivider+this.movableElem.offsetLeft-arrowJoint.offsetLeft-arrowJoint.offsetWidth)+"px";
            arrowHorizontal.style.left=(arrowJoint.offsetLeft+arrowJoint.offsetWidth-arrowJoint.offsetWidth/overlapdivider)+"px";
            
            arrowVertical.style.height=(arrowJoint.offsetHeight/overlapdivider+arrowHead.offsetHeight/overlapdivider+arrowHead.offsetTop-arrowJoint.offsetTop)+"px";
            arrowVertical.style.top=(arrowJoint.offsetTop+arrowJoint.offsetHeight-arrowJoint.offsetHeight/overlapdivider)+"px";
            
            this.roundArrowsUp();
            this.turnMovableVisible();
            this.turnArrowElemVisible([arrowHeadID,arrowVerticalID,arrowJointID,arrowHorizontalID]);
            await this.turnMovableHelperVisible();
            await sleepStaticAnimation();
            await this.turnArrowElemsHidden();
            await this.turnMovableHidden();


            this.movableElem.innerHTML=this.formatLineString("h1",endaddr);
            this.movableElem.style.left = this.addresszaehlerElem.offsetLeft+this.addresszaehlerElem.offsetWidth/2-this.movableElem.offsetWidth/2+"px";
            this.movableElem.style.top = this.translatedinfoDividerDiv.offsetTop+"px";

            await this.turnMovableVisible();
            await sleepStopStartTime();
            await sleepStopStartTime();
            await sleepStopStartTime();
            while(this.movableElem.offsetLeft+this.movableElem.offsetWidth>this.movableHelper.offsetLeft+this.movableHelper.offsetWidth){
                await this.moveSleepCheck(0,-this.getPixeljump());
            }
            this.turnMovableHelperHidden();
            this.movableElem.innerHTML=this.formatLineString("h1",Manipulator.formatHextoDat16(hex));
            await sleepStopStartTime();
            await sleepStopStartTime();
            this.turnMovableHidden();
            return;
        }
    }
    private spanStaticArrows(sTop:number,sLeft:number,sWidth:number,sHeight:number,tTop:number,tLeft:number,tWidth:number,tHeight:number,direction:string):string[]{
        // console.log(tTop,tHeight,sTop)
        if(sLeft>tLeft){
            console.log("ERROR BRUDI");
            return ["",""];
        }
        else if(sLeft<tLeft){
            if(tTop+tHeight*2<sTop){
                if(direction=="side"){
                    return this.arrowToLeftUp(sTop,sLeft,sWidth,sHeight,tTop,tLeft,tWidth,tHeight);
                }
                else{
                    return this.arrowToUpLeft(sTop,sLeft,sWidth,sHeight,tTop,tLeft,tWidth,tHeight);
                }
            }
            else if(tTop+2*tHeight>sTop 
            && tTop+tHeight/4<=sTop){
                return this.arrowToLeftUpLeft(sTop,sLeft,sWidth,sHeight,tTop,tLeft,tWidth,tHeight);
            }
            else if(tTop+tHeight/4>=sTop 
            && tTop-tHeight/4<=sTop){
                return this.arrowToLeft(sTop,sLeft,sWidth,sHeight,tTop,tLeft,tWidth,tHeight);
            }
            else if(tTop-2*tHeight<sTop 
            && tTop-tHeight/4>sTop){
                return this.arrowToLeftDownLeft(sTop,sLeft,sWidth,sHeight,tTop,tLeft,tWidth,tHeight);
            }
            else{
                return this.arrowToLeftDown(sTop,sLeft,sWidth,sHeight,tTop,tLeft,tWidth,tHeight);
            }
        }
        console.log("ERROR BRUDI lvl2");
        return ["",""];
    }
    private arrowToUpLeft(sTop:number,sLeft:number,sWidth:number,sHeight:number,tTop:number,tLeft:number,tWidth:number,tHeight:number):string[]{
        // console.log("arrowToUpLeft");
        
        let arrowHead = this.getArrowElem(arrowHeadID);
        let arrowHorizontal = this.getArrowElem(arrowHorizontalID);
        let arrowJoint = this.getArrowElem(arrowJointID);
        let arrowVertical = this.getArrowElem(arrowVerticalID);
        this.setClassOfHead(RIGHT);
        this.setClassOfJoint(1,JQ2);
        this.toggleToUp(false);
        arrowHead.style.top=tTop+tHeight/2-arrowHead.offsetHeight/2+"px";
        arrowHead.style.left=tLeft-arrowHead.offsetWidth+"px";

        arrowHorizontal.style.top=arrowHead.offsetTop+arrowHead.offsetHeight/2-arrowHorizontal.offsetHeight/2+"px";

        arrowVertical.style.left=sLeft+sWidth/2-arrowVertical.offsetWidth/2+"px";
        
        arrowJoint.style.top=arrowHorizontal.offsetTop+"px";
        console.log(arrowVertical.offsetLeft);
        arrowJoint.style.left=arrowVertical.offsetLeft+"px";
        console.log(arrowJoint.offsetLeft);
        arrowHorizontal.style.width=arrowHead.offsetWidth/overlapdivider+arrowJoint.offsetWidth/overlapdivider+arrowHead.offsetLeft-arrowJoint.offsetLeft-arrowJoint.offsetWidth+"px";
        
        arrowHorizontal.style.left=arrowJoint.offsetLeft+arrowJoint.offsetWidth-arrowJoint.offsetWidth/overlapdivider+"px";
        
        arrowVertical.style.height=arrowJoint.offsetHeight/overlapdivider+sHeight/overlapdivider+sTop-arrowJoint.offsetTop-arrowJoint.offsetHeight+"px";

        arrowVertical.style.top=arrowJoint.offsetTop+arrowJoint.offsetHeight-arrowJoint.offsetHeight/overlapdivider+"px";
        return [arrowHeadID,arrowVerticalID,arrowJointID,arrowHorizontalID];
    }
    private arrowToLeftUp(sTop:number,sLeft:number,sWidth:number,sHeight:number,tTop:number,tLeft:number,tWidth:number,tHeight:number):string[]{
        // console.log("arrowToLeftUp");
        
        let arrowHead = this.getArrowElem(arrowHeadID);
        let arrowHorizontal = this.getArrowElem(arrowHorizontalID);
        let arrowJoint = this.getArrowElem(arrowJointID);
        let arrowVertical = this.getArrowElem(arrowVerticalID);
        this.setClassOfHead(UP);
        this.setClassOfJoint(1,JQ4);
        this.toggleToUp(true);
        arrowHead.style.top=tTop+tHeight+"px";
        arrowHead.style.left=tLeft+tWidth/2-arrowHead.offsetWidth/2+"px";

        arrowVertical.style.left=arrowHead.offsetLeft+arrowHead.offsetWidth/2-arrowVertical.offsetWidth/2+"px";
        
        arrowHorizontal.style.top=sTop+sHeight/2-arrowHorizontal.offsetHeight/2+"px";
        
        arrowJoint.style.top=arrowHorizontal.offsetTop+"px";
        arrowJoint.style.left=arrowVertical.offsetLeft+"px";

        arrowHorizontal.style.width =sWidth/overlapdivider+arrowJoint.offsetWidth/overlapdivider+arrowJoint.offsetLeft-sLeft-sWidth+"px";
        arrowHorizontal.style.left  =sLeft+sWidth-sWidth/overlapdivider+"px";
        
        arrowVertical.style.height  =arrowJoint.offsetHeight/overlapdivider+arrowJoint.offsetHeight/overlapdivider-arrowHead.offsetTop-arrowHead.offsetHeight+arrowJoint.offsetTop+"px";
        arrowVertical.style.top     =arrowHead.offsetTop+arrowHead.offsetHeight-arrowHead.offsetHeight/overlapdivider+"px";
        return [arrowHeadID,arrowVerticalID,arrowJointID,arrowHorizontalID];
    }
    private arrowToLeftDown(sTop:number,sLeft:number,sWidth:number,sHeight:number,tTop:number,tLeft:number,tWidth:number,tHeight:number):string[]{
        // console.log("arrowToLeftDown");
        
        let arrowHead = this.getArrowElem(arrowHeadID);
        let arrowHorizontal = this.getArrowElem(arrowHorizontalID);
        let arrowJoint = this.getArrowElem(arrowJointID);
        let arrowVertical = this.getArrowElem(arrowVerticalID);
        this.setClassOfHead(DOWN);
        this.setClassOfJoint(1,JQ1);
        this.toggleToUp(true);

        arrowHead.style.top=tTop-arrowHead.offsetHeight+"px";
        arrowHead.style.left=tLeft+tWidth/2-arrowHead.offsetWidth/2+"px";

        arrowVertical.style.left=arrowHead.offsetLeft+arrowHead.offsetWidth/2-arrowVertical.offsetWidth/2+"px";

        arrowHorizontal.style.top=sTop+sHeight/2-arrowHorizontal.offsetHeight/2+"px";
        
        arrowJoint.style.top=arrowHorizontal.offsetTop+"px";
        arrowJoint.style.left=arrowVertical.offsetLeft+"px";
        
        arrowHorizontal.style.width=sWidth/overlapdivider+arrowJoint.offsetWidth/overlapdivider-sLeft+arrowJoint.offsetLeft-sWidth+"px";
        arrowHorizontal.style.left=sLeft+sWidth-sWidth/overlapdivider+"px";
        
        arrowVertical.style.height=arrowJoint.offsetHeight/overlapdivider+arrowHead.offsetHeight/overlapdivider+arrowHead.offsetTop-arrowJoint.offsetTop-arrowJoint.offsetHeight+"px";
        arrowVertical.style.top=arrowJoint.offsetTop+arrowJoint.offsetHeight-arrowJoint.offsetHeight/overlapdivider+"px";
        return [arrowHeadID,arrowVerticalID,arrowJointID,arrowHorizontalID];
    }
    private arrowToLeftUpLeft(sTop:number,sLeft:number,sWidth:number,sHeight:number,tTop:number,tLeft:number,tWidth:number,tHeight:number):string[]{
        // console.log("arrowToLeftUpLeft");
        
        let arrowHead = this.getArrowElem(arrowHeadID);
        let arrowHorizontal = this.getArrowElem(arrowHorizontalID);
        let arrowJoint = this.getArrowElem(arrowJointID);
        let arrowVertical = this.getArrowElem(arrowVerticalID);
        this.setClassOfJoint(1,JQ2);
        this.setClassOfHead(RIGHT);
        this.toggleToUp(false);
        arrowHead.style.top=tTop+tHeight/2-arrowHead.offsetHeight/2+"px";
        arrowHead.style.left=tLeft-arrowHead.offsetWidth+"px";

        arrowHorizontal.style.top=arrowHead.offsetTop+arrowHead.offsetHeight/2-arrowHorizontal.offsetHeight/2+"px";
        let arrowHorizontal2 = this.getArrowElem(arrowHorizontalID2);
        // console.log(arrowHorizontal2);
        let arrowJoint2 = this.getArrowElem(arrowJointID2);

        this.setClassOfJoint(2,JQ4);
        // console.log(arrowJoint2);

        arrowHorizontal.style.width=arrowHead.offsetWidth/overlapdivider+arrowHead.offsetWidth+arrowJoint.offsetWidth/overlapdivider+"px";
        arrowHorizontal.style.left=arrowHead.offsetLeft+arrowHead.offsetWidth/overlapdivider-arrowHorizontal.offsetWidth+"px";

        arrowHorizontal2.style.top=sTop+sHeight/2-arrowHorizontal2.offsetHeight/2+"px";

        arrowJoint.style.top= arrowHorizontal.offsetTop+"px";
        arrowJoint.style.left=arrowHorizontal.offsetLeft-arrowJoint.offsetWidth+arrowJoint.offsetWidth/overlapdivider+"px";

        arrowVertical.style.left=arrowJoint.offsetLeft+"px";
        
        arrowJoint2.style.left = arrowJoint.offsetLeft+"px";
        arrowJoint2.style.top = arrowHorizontal2.offsetTop+"px";

        arrowVertical.style.height = arrowJoint2.offsetTop-arrowJoint.offsetTop-arrowJoint.offsetHeight
            +arrowJoint.offsetHeight/overlapdivider+arrowJoint2.offsetHeight/overlapdivider+"px";
        arrowVertical.style.top = arrowJoint.offsetTop+arrowJoint.offsetHeight-arrowJoint.offsetHeight/overlapdivider+"px";

        arrowHorizontal2.style.left= sLeft+sWidth
            -sWidth/overlapdivider+"px";

        arrowHorizontal2.style.width = arrowJoint2.offsetLeft+arrowJoint2.offsetWidth/overlapdivider
            -sLeft-sWidth+sWidth/overlapdivider+"px";
        return [arrowHeadID,arrowVerticalID,arrowJointID,arrowHorizontalID,arrowHorizontalID2,arrowJointID2];
    }
    private arrowToLeftDownLeft(sTop:number,sLeft:number,sWidth:number,sHeight:number,tTop:number,tLeft:number,tWidth:number,tHeight:number):string[]{
        // console.log("arrowToLeftDownLeft");
        let arrowHead = this.getArrowElem(arrowHeadID);
        let arrowHorizontal = this.getArrowElem(arrowHorizontalID);
        let arrowJoint = this.getArrowElem(arrowJointID);
        let arrowVertical = this.getArrowElem(arrowVerticalID);
        this.setClassOfHead(RIGHT);
        this.setClassOfJoint(1,JQ3);
        this.toggleToUp(false);
        arrowHead.style.top=tTop+tHeight/2-arrowHead.offsetHeight/2+"px";
        arrowHead.style.left=tLeft-arrowHead.offsetWidth+"px";

        arrowHorizontal.style.top=arrowHead.offsetTop+arrowHead.offsetHeight/2-arrowHorizontal.offsetHeight/2+"px";
        let arrowHorizontal2 = this.getArrowElem(arrowHorizontalID2);
        let arrowJoint2 = this.getArrowElem(arrowJointID2);

        this.setClassOfJoint(2,JQ1);

        arrowHorizontal.style.width=arrowHead.offsetWidth/overlapdivider+arrowHead.offsetWidth+arrowJoint.offsetWidth/overlapdivider+"px";
        arrowHorizontal.style.left=arrowHead.offsetLeft+arrowHead.offsetWidth/overlapdivider-arrowHorizontal.offsetWidth+"px";

        arrowHorizontal2.style.top=sTop+sHeight/2-arrowHorizontal2.offsetHeight/2+"px";

        arrowJoint.style.top= arrowHorizontal.offsetTop+"px";
        arrowJoint.style.left=arrowHorizontal.offsetLeft-arrowJoint.offsetWidth+arrowJoint.offsetWidth/overlapdivider+"px";

        arrowVertical.style.left=arrowJoint.offsetLeft+"px";
        
        arrowJoint2.style.left = arrowJoint.offsetLeft+"px";
        arrowJoint2.style.top = arrowHorizontal2.offsetTop+"px";

        arrowVertical.style.height = -arrowJoint2.offsetTop+arrowJoint.offsetTop-arrowJoint2.offsetHeight
            +arrowJoint.offsetHeight/overlapdivider+arrowJoint2.offsetHeight/overlapdivider+"px";
        arrowVertical.style.top = arrowJoint2.offsetTop+arrowJoint2.offsetHeight-arrowJoint2.offsetHeight/overlapdivider+"px";

        arrowHorizontal2.style.left= sLeft+sWidth
            -sWidth/overlapdivider+"px";

        arrowHorizontal2.style.width = arrowJoint2.offsetLeft+arrowJoint2.offsetWidth/overlapdivider
            -sLeft-sWidth+sWidth/overlapdivider+"px";
            return [arrowHeadID,arrowVerticalID,arrowJointID,arrowHorizontalID,arrowHorizontalID2,arrowJointID2];
    }
    private arrowToLeft(sTop:number,sLeft:number,sWidth:number,sHeight:number,tTop:number,tLeft:number,tWidth:number,tHeight:number):string[]{
        // console.log("arrowToLeft");

        let arrowHead = this.getArrowElem(arrowHeadID);
        let arrowHorizontal = this.getArrowElem(arrowHorizontalID);
        this.setClassOfHead(RIGHT);
        this.toggleToUp(false);
        arrowHead.style.top=tTop+tHeight/2-arrowHead.offsetHeight/2+"px";
        arrowHead.style.left=tLeft-arrowHead.offsetWidth+"px";

        arrowHorizontal.style.top=arrowHead.offsetTop+arrowHead.offsetHeight/2-arrowHorizontal.offsetHeight/2+"px";
        arrowHorizontal.style.width = arrowHead.offsetLeft-sLeft-sWidth
            +arrowHead.offsetWidth/overlapdivider+sWidth/overlapdivider+"px";
        arrowHorizontal.style.left = arrowHead.offsetLeft+arrowHead.offsetWidth/overlapdivider-arrowHorizontal.offsetWidth+"px";
        return [arrowHeadID,arrowHorizontalID];
    }

    private async moveSleepCheck(t:number,l:number){
        await this.updateMovingElement(t,l);
        await sleepForFrame();
        await checkIfPaused();
    }

    private async moveHelperSleepCheck(t:number,l:number){
        await this.updateMovingHelperElement(t,l);
        await sleepForFrame();
        await checkIfPaused();
    }

    private formatLineString(tag:string,line:string):string{
        if(line.length>30){
            line = line.substring(0,25);
            return `<${tag} class="moveableText">${line}...</${tag}>`;
        }
        return `<${tag} class="moveableText">${line}</${tag}>`;
    }
    private getArrowElem(s:string):HTMLDivElement{
        for(let i=0;i<this.arrowElems.length;i++){
            if(this.arrowElems[i].id===s){
                return this.arrowElems[i];
            }
        }
        return this.createArrowBodyElem(s);
    }

    toggleToUp(b:boolean){
        let elem = this.getArrowElem(arrowHeadID);
        if(b ){
            elem.classList.add(arrowUp_DownCN);
            elem.classList.remove(arrowLeft_RightCN);
        }
        else{
            elem.classList.remove(arrowUp_DownCN);
            elem.classList.add(arrowLeft_RightCN);
        }
    }

    setMovableParameters(t:number,l:number){
        this.movableElem.style.top=t+"px";
        this.movableElem.style.left=l+"px";
        // this.movableElem.style.height=h+"px";
        // this.movableElem.style.width=w+"px";
    }

    private getPixeljump():number{
        return (aniControl.speed+1)*resizer.get1PXEquivalent();
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
        newElem.style.zIndex="3";

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
        newElem.style.zIndex="3";

        getHtmlElement("body").appendChild(newElem);
        return newElem;
    }

    private createArrowBodyElem(s:string):HTMLDivElement{
        let newElem:HTMLDivElement;
        newElem = document.createElement("div");
        newElem.id=s;
        newElem.style.top=`${0}`;
        newElem.style.left=`${0}`;
        newElem.style.visibility="hidden";
        newElem.style.zIndex="2";
        switch(s){
            case arrowHeadID:
                newElem.style.zIndex="3";
                newElem.classList.add("bgI_C_C");
                
                break;
            case arrowHorizontalID:
            case arrowHorizontalID2:
                newElem.classList.add("bgI_C_C","horizontalBody");
                
                break;
            case arrowJointID:
            case arrowJointID2:
                newElem.classList.add("bgI_C_C","jointBody");
                break;
            case arrowVerticalID:
                newElem.classList.add("bgI_C_C","verticalBody");
                break;
            default 
                :alert("someshit gone down");
                break;
        }
        getHtmlElement("body").appendChild(newElem);
        this.arrowElems.push(newElem);
        return newElem;
    }

    private setClassOfHead(s:string){
        let elem =this.getArrowElem(arrowHeadID);
        switch(s){
            case UP:
                elem.classList.add("arrowU");
                elem.classList.remove("arrowD");
                elem.classList.remove("arrowLeft");
                elem.classList.remove("arrowRight");
            break;
            case DOWN:
                elem.classList.remove("arrowU");
                elem.classList.add("arrowD");
                elem.classList.remove("arrowLeft");
                elem.classList.remove("arrowRight");
            break;
            case LEFT:
                elem.classList.remove("arrowU");
                elem.classList.remove("arrowD");
                elem.classList.add("arrowLeft");
                elem.classList.remove("arrowRight");
            break;
            case RIGHT:
                elem.classList.remove("arrowU");
                elem.classList.remove("arrowD");
                elem.classList.remove("arrowLeft");
                elem.classList.add("arrowRight");
            break;
        }
    }

    private setClassOfJoint(id:number,s:string){
        let elem =id==1?this.getArrowElem(arrowJointID):this.getArrowElem(arrowJointID2);
        
        switch(s){
            case JQ1:
                elem.classList.add("jointQ1");
                elem.classList.remove("jointQ2");
                elem.classList.remove("jointQ3");
                elem.classList.remove("jointQ4");

            break;
            case JQ2:
                elem.classList.remove("jointQ1");
                elem.classList.add("jointQ2");
                elem.classList.remove("jointQ3");
                elem.classList.remove("jointQ4");

            break;
            case JQ3:
                elem.classList.remove("jointQ1");
                elem.classList.remove("jointQ2");
                elem.classList.add("jointQ3");
                elem.classList.remove("jointQ4");

            break;
            case JQ4:
                elem.classList.remove("jointQ1");
                elem.classList.remove("jointQ2");
                elem.classList.remove("jointQ3");
                elem.classList.add("jointQ4");
                break;
            default:
                throw new Error("Error occured at JointSVG assigment");
        }
    }

    async setStartTopToInputLine(id:number){
        let childElem=document.getElementById(`${(id+1)<10?"0"+(id+1):(id+1)}inputP`);
        if(childElem!=null){
            let n= updateScrollOfIn_Out(this.outPutText.id,childElem.id);
            this.movableElem.style.top = childElem.offsetTop-n-1/2*this.movableElem.offsetHeight+1/2*childElem.offsetHeight+"px";
            if(this.movableElem.offsetTop<this.inputText.offsetTop){
                this.movableElem.style.top=this.inputText.offsetTop+"px";
            }
            this.movableElem.style.left= childElem.offsetLeft+"px";

        }
    }
    
    async setTargetTopToSpeicherabbild(id:number){
        let childElem=document.getElementById(`${(id+1)<10?"0"+(id+1):(id+1)}outputP`);
        if(childElem!=null){
            let n= updateScrollOfIn_Out(this.outPutText.id,childElem.id);
            console.log(n);
            this.targetElemTop = childElem.offsetTop-n-1/2*this.movableElem.offsetHeight+1/2*childElem.offsetHeight;
        }
    }

    public turnArrowElemVisible=async(s:string[])=>{
        // await this.turnArrowElemsHidden();
        console.log(s);
        for(let i= 0; i<this.arrowElems.length;i++){
            if(s.includes(this.arrowElems[i].id)){
                this.arrowElems[i].style.visibility="visible";
            }
        }
        /* this.arrowElems.forEach(e=>{
            if(s.includes(e.id)){
                e.style.visibility="visible";
            }
        }) */
        return;
    }

    async turnArrowElemsHidden(){
        this.arrowElems.forEach(e=>{
            if(e.id==arrowHorizontalID || e.id==arrowHorizontalID2){
                e.style.width=0+"px";
            }
            if(e.id==arrowVerticalID){
                e.style.height=0+"px";
            }
            e.style.visibility="hidden";
        })
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
        /* this.movableElem.style.top = (100*this.movableElem.offsetTop/bodyElem.offsetHeight+mTop/5)+"%";
        this.movableElem.style.left = (100*this.movableElem.offsetLeft/bodyElem.offsetWidth+mLeft/5)+"%"; */
    }

    async updateMovingHelperElement(mTop:number,mLeft:number){
        this.movableHelper.style.top = (this.movableHelper.offsetTop+mTop)+"px";
        this.movableHelper.style.left = (this.movableHelper.offsetLeft+mLeft)+"px";
        /* this.movableHelper.style.top = (100*this.movableHelper.offsetTop/bodyElem.offsetHeight+mTop/5)+"%";
        this.movableHelper.style.left = (100*this.movableHelper.offsetLeft/bodyElem.offsetWidth+mLeft/5)+"%"; */
    }
}