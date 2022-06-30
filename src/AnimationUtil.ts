import { contentloaded } from "./index";
import { currentLineLine, descriptionLines, inputText, outputText, setTranslatingDivHidden, setTranslatingDivVisible, symbolTableLines } from "./ProjectWindow";
import { createClickListener, getHtmlElement, removeClassOfAll } from "./Tools";

export const sleepFor = (ms:number):Promise <any> => new Promise(resolve => setTimeout(resolve,ms));

export const speedBTN = getHtmlElement("speed") as HTMLButtonElement;
export const speedSlider = getHtmlElement("speedSlider") as HTMLInputElement;
export const singleStepBTN = getHtmlElement("singleStep") as HTMLButtonElement;
export const animationTyp1BTN= getHtmlElement("animationsTyp1") as HTMLButtonElement;
export const animationTyp2BTN= getHtmlElement("animationsTyp2") as HTMLButtonElement;
export const animationTyp3BTN= getHtmlElement("animationsTyp3") as HTMLButtonElement;
export const playButton = getHtmlElement("play") as HTMLButtonElement;
export const resetButton = getHtmlElement("reset") as HTMLButtonElement;
var timeout_settingsBTN:NodeJS.Timeout;

export const setCurrentLineHidden=()=>{
    if(aniControl.speed>=3 && aniControl.isAni3() &&  aniControl.play){
        currentLineLine.style.visibility="hidden";
    }
    
}
export const setCurrentLineVisible=()=>{
    currentLineLine.style.visibility="visible";
}

export const checkIfPaused= async():Promise <any> => {
    if (aniControl.play){
        return true;
    }
    while (true) {
        if (aniControl.reset){
            throw Error('Reset pressed');
        }
        if(aniControl.stop){
            throw Error('Stop pressed');
        }
        if (aniControl.play){
            return true;
        }
        await sleepFor(100);
    }
}
export const sleepUntilNextStep=async():Promise <any>=>{
    let c=aniControl.baseFrameTime;
    if(aniControl.isAni3()){
        if(aniControl.speed==1){
            await sleepFor(10);
            await checkIfPaused();
            return;
        }
        await sleepFor(3);
        await checkIfPaused();
        return;
    }
    while(true){
        if(c<0){
            return true;
        }
        else{
            await sleepFor(10);
            c-=10;
            await checkIfPaused();
        }
    }
}
export const sleepStaticAnimation= async():Promise <any> =>{
    let b=2*aniControl.baseFrameTime;
    let n=10*aniControl.speed;
    while(b>0){
        await sleepFor(n/(aniControl.speed));
        await checkIfPaused();
        b=b-10;
    }
}
export const sleepStaticAnimationHalf= async():Promise <any> =>{
    let b=aniControl.baseFrameTime;
    let n=10*aniControl.speed;
    while(b>0){
        await sleepFor(n/(aniControl.speed));
        await checkIfPaused();
        b=b-10;
    }
}

export const sleepStopStartTime= async():Promise <any> =>{
    let b=aniControl.baseFrameTime/2;
    while(b>0){
        await sleepFor(10);
        await checkIfPaused();
        b=b-10;
    }
}
export const sleepForFrame = async():Promise<any>=>{
    // let b=aniControl.baseFrameTime/aniControl.frames;
    let b=aniControl.baseFrameTime/120/2;
    while(b>0){
        await sleepFor(1);
        b=b-1;
        await checkIfPaused();
    }
}
export enum AnimationType{
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
    public loaded:boolean;

    public speed:number;
    public baseFrameTime:number;
    public animationType:AnimationType=AnimationType.Typ1;
    public frames:number;

    constructor(){
        this.start=false;
        this.play=false;
        this.pause=false;
        this.stop=false;
        this.reset=false;
        this.singleStepFlag=false;
        this.end=false;
        this.loaded=false;
        this.speed=1;
        this.baseFrameTime=800;
        this.setSpeed(speedSlider.valueAsNumber);
        this.frames=60;
    }
    setLoaded(b:boolean){
        this.loaded=b;
    }
    resetFlags=()=>{
        while(!aniControl.reset){

        };
        this.start=false;
        this.play=false;
        this.pause=false;
        this.stop=false;
        this.end=false;
        this.changePlayButtonBKG();
    }
    setStart=()=>{
        this.start=true;
        this.setPlaying();
    }
    setSinglestep=()=>{
        if(this.singleStepFlag) this.singleStepFlag=false;
        else this.singleStepFlag=true;
        this.singleStepFlag?singleStepBTN.classList.add("selected"):singleStepBTN.classList.remove("selected");

    }
    setSpeedTo=(n:number)=>{
        if(n<1){
            speedSlider.value=`${1}`;
            return 1;
        }
        else if(n>4){
            speedSlider.value=`${(4)}`;
            return 4;
        }
        else{
            speedSlider.value=`${(n)}`;
            return n;
        }
    }
    increaseSpeed=()=>{
        this.setSpeed(this.setSpeedTo(speedSlider.valueAsNumber+1));
    }
    decreaseSpeed=()=>{
        this.setSpeed(this.setSpeedTo(speedSlider.valueAsNumber-1));
    }
    setAnimationTyp1=()=>{
        if(this.isAni3() && this.speed>=3){
            removeClassOfAll("hiddenDescriptionDiv");
            setTranslatingDivHidden();
            setCurrentLineVisible();
        }
        this.animationType=AnimationType.Typ1;
        this.setSmoothIfNecessery();
        
        try{
            animationTyp1BTN.classList.add("selected");
            animationTyp2BTN.classList.remove("selected");
            animationTyp3BTN.classList.remove("selected");
        }
        catch(e){
            console.log(e);
        }
    }
    setAnimationTyp2=()=>{
        if(this.isAni3() && this.speed>=3){
            setTranslatingDivHidden();
            setCurrentLineVisible();
            removeClassOfAll("hiddenDescriptionDiv");
        }
        this.animationType=AnimationType.Typ2;
        this.setSmoothIfNecessery();

        try{
            animationTyp1BTN.classList.remove("selected");
            animationTyp2BTN.classList.add("selected");
            animationTyp3BTN.classList.remove("selected");
        }
        catch(e){
            console.log(e);
        }
    }
    setAnimationTyp3=()=>{
        this.animationType=AnimationType.Typ3;
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
        if(this.start && !this.stop && !this.end){
            this.play   = true;
            this.pause  = false;
            this.end    = false;
            this.stop   = false;
            this.changePlayButtonBKG();
        }
    }
    setStop=()=>{
        this.play   = false;
        this.pause  = false;
        this.end    = false;
        this.stop   = true;
        this.changePlayButtonBKG();
    }
    setPaused=()=>{
        if(this.start &&!this.stop && !this.reset){
            this.play   = false;
            this.pause  = true;
            this.end    = false;
            this.changePlayButtonBKG();
        }
    }
    
    setReset= async()=>{
        if(this.reset) return;
        this.reset  = true;
        setTimeout(function(){
            aniControl.reset=false;
        },200);
        this.changePlayButtonBKG();
    }

    setEnd=()=>{
        // console.log(" END ");
        this.start  = true;
        this.play   = false;
        this.pause  = false;
        this.end    = true;
        this.changePlayButtonBKG();
    }
    setSmoothIfNecessery(){
        if(this.play && this.animationType!=AnimationType.Typ3 && this.speed<3){
            inputText.classList.add("scrollSmooth");
            outputText.classList.add("scrollSmooth");
            descriptionLines.classList.add("scrollSmooth");
        }
        if(this.play && this.animationType!=AnimationType.Typ3 && this.speed==4){
            descriptionLines.classList.remove("scrollSmooth");
        }
        else{
            descriptionLines.classList.add("scrollSmooth");
        }

    }
    removeSmoothScroll(){
        inputText.classList.remove("scrollSmooth");
        outputText.classList.remove("scrollSmooth");
    }
    isAni1=()=>{
        return this.animationType==AnimationType.Typ1;
    }
    isAni2=()=>{
        return this.animationType==AnimationType.Typ2;
    }
    isAni3=()=>{
        return this.animationType==AnimationType.Typ3;
    }
    changePlayButtonBKG=()=>{
        let elem = getHtmlElement("play");
        if(this.end || this.pause || this.reset || this.stop){
            setTranslatingDivHidden();
            setCurrentLineVisible();
            this.removeSmoothScroll();
            removeClassOfAll("hiddenDescriptionDiv");

            inputText.classList.remove("scrollDisabled");
            outputText.classList.remove("scrollDisabled");
            descriptionLines.classList.remove("scrollDisabled");
            symbolTableLines.classList.remove("scrollDisabled");
            descriptionLines.classList.add("scrollSmooth");


            elem.classList.remove("pausedBKG");
            elem.classList.add("playingBKG");
            return;
        }
        else if(this.play){
            setTranslatingDivVisible();
            setCurrentLineHidden();

            inputText.classList.add("scrollDisabled");
            outputText.classList.add("scrollDisabled");
            
            descriptionLines.classList.add("scrollDisabled");
            symbolTableLines.classList.add("scrollDisabled");
            
            if(this.speed<3 && this.animationType!=AnimationType.Typ3){
                inputText.classList.add("scrollSmooth");
                outputText.classList.add("scrollSmooth");
                descriptionLines.classList.add("scrollSmooth");
            }  
            if(this.speed==4){
                descriptionLines.classList.remove("scrollSmooth");
            }
            else{
                descriptionLines.classList.add("scrollSmooth");
            }
            if(this.isAni3()) descriptionLines.classList.remove("scrollSmooth");

            elem.classList.add("pausedBKG");
            elem.classList.remove("playingBKG");
            return;
        }
    }
    setSpeed=(n:number)=>{
        this.speed=n;
        this.baseFrameTime=1000-this.speed*240;
        if(!this.loaded) return;
        this.setSmoothIfNecessery();
        if(n>=3){
            setTranslatingDivVisible();
            setCurrentLineHidden();
        }
        else{
            setTranslatingDivHidden();
            setCurrentLineVisible();
        }
        if(n!=4){
            removeClassOfAll("hiddenDescriptionDiv");
            setTranslatingDivHidden();
        }
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
                this.setSpeed(speedSlider.valueAsNumber);
            })
            speedSlider.addEventListener("input", ()=>{
                this.setSpeed(speedSlider.valueAsNumber);
            })
            
        } catch (error) {
            console.log(error)
        }
        document.getElementById("settingsButtonContainer")!.addEventListener("mouseleave",(e)=>{
            setting_btn_timout();
        });
        document.getElementById("settingsButtonContainer")!.addEventListener("mouseenter",(e)=>{
            clearTimeout(timeout_settingsBTN);
        });
        document.getElementById("settings")!.addEventListener("click", (e) => {
            let s = document.getElementById("settings")!.getAttribute("expand");
            console.log(s);
            if(s=="off"){
                expand_On();
            }
            if(s=="on"){
                expand_Off();
            }
        })
        document.getElementById("settings")!.addEventListener("mouseleave", (e) => {
            setting_btn_timout();
        })
        document.getElementById("settings")!.addEventListener("mouseenter", (e) => {
            clearTimeout(timeout_settingsBTN);
        })
    }
}
const expand_On = () => {
    document.getElementById("settingsButtonContainer")!.setAttribute("expand","on");
    document.getElementById("settings")!.setAttribute("expand","on");
}
const expand_Off = () => {
    document.getElementById("settingsButtonContainer")!.setAttribute("expand","off");
    document.getElementById("settings")!.setAttribute("expand","off");
}
const setting_btn_timout = () =>{
    if(timeout_settingsBTN!=null){
        clearTimeout(timeout_settingsBTN);
    }
    timeout_settingsBTN = setTimeout(function(){
        expand_Off();
    },2000);
}
export const aniControl= new AnimationControl();