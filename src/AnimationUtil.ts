import { descriptionLines, inputText, outputText } from "./ProjectWindow";
import { createClickListener, getHtmlElement } from "./Tools";

export const sleepFor = (ms:number):Promise <any> => new Promise(resolve => setTimeout(resolve,ms));

export const speedBTN = getHtmlElement("speed") as HTMLButtonElement;
export const speedSlider = getHtmlElement("speedSlider") as HTMLInputElement;
export const singleStepBTN = getHtmlElement("singleStep") as HTMLButtonElement;
export const animationTyp1BTN= getHtmlElement("animationsTyp1") as HTMLButtonElement;
export const animationTyp2BTN= getHtmlElement("animationsTyp2") as HTMLButtonElement;
export const animationTyp3BTN= getHtmlElement("animationsTyp3") as HTMLButtonElement;


export const checkIfPaused= async():Promise <any> => {
    while (true) {
        if (aniControl.play){
            return true;
        }
        if (aniControl.reset){
            throw Error('Reset pressed');
        }
        if(aniControl.stop){
            throw Error('Stop pressed');
        }
        await sleepFor(100);
    }
}
export const sleepUntilNextStep=async():Promise <any>=>{
    let c=aniControl.baseFrameTime;
    if(aniControl.animationType==AnimationsTyp.Typ3){
        await sleepFor(5);
        await checkIfPaused();
        return;
    }
    while(true){
        if(c<0){
            return true;
        }
        else{
            await sleepFor(10);
            c-=10*aniControl.speed;
            await checkIfPaused();
        }
    }
}
export enum AnimationsTyp{
    Typ1="Typ1",
    Typ2="Typ2",
    Typ3="Typ3"
}
export class AnimationControl{
    public start:boolean;
    public play:boolean;
    public pause:boolean;
    public stop:boolean;
    public end:boolean;
    public reset:boolean;
    public singleStepFlag:boolean;

    public speed:number;
    public baseFrameTime:number;
    public animationType:AnimationsTyp=AnimationsTyp.Typ1;
    public frames:number;

    constructor(){
        this.start=false;
        this.play=false;
        this.pause=false;
        this.stop=false;
        this.reset=false;
        this.singleStepFlag=false;
        this.end=false;
        this.baseFrameTime=1000;
        this.speed=speedSlider.valueAsNumber;
        this.frames=60;
    }
    resetFlags=()=>{
        this.start=false;
        this.play=false;
        this.pause=false;
        this.stop=false;
        this.reset=false;
        this.end=false;
        this.baseFrameTime=1000;
        this.changePlayButtonBKG();
    }
    private resetStaticInputValues(){
        this.speed=this.setSpeedTo(3);
        singleStepBTN.classList.remove("selected");

    }
    setStart=()=>{
        this.start=true;
        this.setPlaying();
    }
    setSinglestep=()=>{
        if(this.singleStepFlag) this.singleStepFlag=false;
        else this.singleStepFlag=true;
        console.log(this.singleStepFlag);
        this.singleStepFlag?singleStepBTN.classList.add("selected"):singleStepBTN.classList.remove("selected");
        console.log(this.singleStepFlag);

    }
    setSpeedTo=(n:number)=>{
        if(n<1){
            speedSlider.value=`${1}`;
            return 7;
        }
        else if(n>6){
            speedSlider.value=`${(6)}`;
            return 6;
        }
        else{
            speedSlider.value=`${(n)}`;
            return n;
        }
        
    }
    increaseSpeed=()=>{
        this.speed=this.setSpeedTo(speedSlider.valueAsNumber+1);
    }
    decreaseSpeed=()=>{
        this.speed=this.setSpeedTo(speedSlider.valueAsNumber-1);
    }
    setAnimationTyp1=()=>{
        this.animationType=AnimationsTyp.Typ1;
        this.setSmoothIfNecessery();
        
        try{
            descriptionLines.classList.add("scrollSmooth");
            animationTyp1BTN.classList.add("selected");
            animationTyp2BTN.classList.remove("selected");
            animationTyp3BTN.classList.remove("selected");
        }
        catch(e){
            console.log(e);
        }
    }
    setAnimationTyp2=()=>{
        this.animationType=AnimationsTyp.Typ2;
        this.setSmoothIfNecessery();
        try{
            descriptionLines.classList.add("scrollSmooth");
            animationTyp1BTN.classList.remove("selected");
            animationTyp2BTN.classList.add("selected");
            animationTyp3BTN.classList.remove("selected");
        }
        catch(e){
            console.log(e);
        }
    }
    setAnimationTyp3=()=>{
        this.animationType=AnimationsTyp.Typ3;
        this.removeSmoothScroll();
        
        try{
            animationTyp1BTN.classList.remove("selected");
            animationTyp2BTN.classList.remove("selected");
            animationTyp3BTN.classList.add("selected");
        }
        catch(e){
            console.log(e);
        }
    }
    setPlaying=()=>{
        if(this.start && !this.stop){
            this.play   = true;
            this.pause  = false;
            this.reset  = false;
            this.end    = false;
            this.stop   = false;
            this.changePlayButtonBKG();
        }
    }
    setStop=()=>{
        this.play   = false;
        this.pause  = false;
        this.reset  = false;
        this.end    = false;
        this.stop   = true;
        this.changePlayButtonBKG();
    }
    consoleFlags=()=>{
        console.log("AniControlFlags:");
        console.log("this.play : "+this.play);
        console.log("this.pause : "+this.pause);
        console.log("this.reset : "+this.reset);
        console.log("this.end : "+this.end);
        console.log("this.stop : "+this.stop);
        console.log("this.singleStep : "+this.singleStepFlag);
    }
    setPaused=()=>{
        if(this.start &&!this.stop){
            this.play   = false;
            this.pause  = true;
            this.reset  = false;
            this.end    = false;
            this.changePlayButtonBKG();
        }
    }

    setReset=()=>{
        this.start  = false;
        this.play   = false;
        this.pause  = false;
        this.reset  = true;
        this.stop   = false;
        this.end    = false;
        this.changePlayButtonBKG();
    }

    setEnd=()=>{
        this.start  = true;
        this.play   = false;
        this.pause  = false;
        this.reset  = false;
        this.stop   = false;
        this.end    = true;
        this.changePlayButtonBKG();
    }
    setSmoothIfNecessery(){
        if(this.play && this.animationType!=AnimationsTyp.Typ3 && this.speed<=3){
            inputText.classList.add("scrollSmooth");
            outputText.classList.add("scrollSmooth");
        }
    }
    removeSmoothScroll(){
        inputText.classList.remove("scrollSmooth");
        outputText.classList.remove("scrollSmooth");
    }

    toggle=()=>{
        this.play?this.setPaused():this.setPlaying();
    }
    isAni1=()=>{
        return this.animationType==AnimationsTyp.Typ1;
    }
    isAni2=()=>{
        return this.animationType==AnimationsTyp.Typ2;
    }
    isAni3=()=>{
        return this.animationType==AnimationsTyp.Typ3;
    }
    changePlayButtonBKG=()=>{
        let elem = getHtmlElement("play");
        if(this.end){
            this.removeSmoothScroll();
            inputText.classList.remove("scrollDisabled");
            outputText.classList.remove("scrollDisabled");
            descriptionLines.classList.remove("scrollDisabled");

            elem.classList.remove("pausedBKG");
            elem.classList.add("playingBKG");
            return;
        }
        else if(this.play){
            inputText.classList.add("scrollDisabled");
            outputText.classList.add("scrollDisabled");
            if(this.isAni3()) descriptionLines.classList.remove("scrollSmooth");

            descriptionLines.classList.add("scrollDisabled");

            if(this.speed<=3 && this.animationType!=AnimationsTyp.Typ3){
                inputText.classList.add("scrollSmooth");
                outputText.classList.add("scrollSmooth");
            }   

            elem.classList.add("pausedBKG");
            elem.classList.remove("playingBKG");
            return;
        }
        else if(this.pause || this.reset || this.stop){
            this.removeSmoothScroll();
            inputText.classList.remove("scrollDisabled");
            outputText.classList.remove("scrollDisabled");
            descriptionLines.classList.remove("scrollDisabled");


            elem.classList.remove("pausedBKG");
            elem.classList.add("playingBKG");
        }
    }

    setFrames=(n:number)=>{
        this.frames=n;
    }
    public createEventListeners=()=>{
        this.setAnimationTyp1();
        createClickListener("animationsTyp1",this.setAnimationTyp1);
        createClickListener("animationsTyp2",this.setAnimationTyp2);
        createClickListener("animationsTyp3",this.setAnimationTyp3);
        createClickListener("speedDecrease",this.decreaseSpeed);
        createClickListener("speedIncrease",this.increaseSpeed);
        createClickListener("singleStep", this.setSinglestep);
        try {
            speedSlider.addEventListener("change",()=>{
                this.speed = speedSlider.valueAsNumber;
            })
            speedSlider.addEventListener("input", ()=>{
                this.speed = speedSlider.valueAsNumber;
            })
            
        } catch (error) {
            console.log(error)
        }
    }
}

export const aniControl= new AnimationControl();