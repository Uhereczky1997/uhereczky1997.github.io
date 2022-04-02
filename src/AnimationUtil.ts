import { inputText, outputText } from "./ProjectWindow";
import { getHtmlElement } from "./Tools";

export const sleepFor = (ms:number):Promise <any> => new Promise(resolve => setTimeout(resolve,ms));

let speedBTN = getHtmlElement("speed") as HTMLButtonElement;
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
    while(true){
        if(c<0){
            return true;
        }
        else{
            await sleepFor(10);
            c-=5*(aniControl.baseFrameTime/1000)*aniControl.speed*aniControl.speed;
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

    public speed:number;
    public baseFrameTime:number;
    public animationType:AnimationsTyp;
    public frames:number;

    constructor(){
        this.start=false;
        this.play=false;
        this.pause=false;
        this.stop=false;
        this.reset=false;
        this.end=false;
        this.baseFrameTime=1000;
        this.speed=1;
        this.animationType=AnimationsTyp.Typ2;
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
        this.animationType=AnimationsTyp.Typ2;
        this.speed=1;
        this.updateSpeedDisplay();
        this.changePlayButtonBKG();
    }
    setStart=()=>{
        this.start=true;
        this.setPlaying();
    }
    setPlaying=()=>{
        if(this.start && !this.stop){
            this.play = true;
            this.pause = false;
            this.reset = false;
            this.end=false;
            this.stop=false;
            this.changePlayButtonBKG();
        }
    }
    setStop=()=>{
        this.play = false;
        this.pause = false;
        this.reset = false;
        this.end=false;
        this.stop=true;
        this.changePlayButtonBKG();
    }

    setPaused=()=>{
        if(this.start &&!this.stop){
            this.play = false;
            this.pause = true;
            this.reset = false;
            this.end=false;
            this.changePlayButtonBKG();
        }
    }

    setReset=()=>{
        this.start=false;
        this.play = false;
        this.pause = false;
        this.reset = true;
        this.stop = false;
        this.end=false;
        this.changePlayButtonBKG();
    }

    setEnd=()=>{
        this.start=true;
        this.play = false;
        this.pause = false;
        this.reset = false;
        this.stop = false;
        this.end=true;
        this.changePlayButtonBKG();
    }

    toggle=()=>{
        this.play?this.setPaused():this.setPlaying();
    }
    changePlayButtonBKG(){
        let elem = getHtmlElement("play");
        if(this.end){
            inputText.classList.remove("scrollDisabled");
            outputText.classList.remove("scrollDisabled");
            elem.classList.remove("pausedBKG");
            elem.classList.add("playingBKG");
            return;
        }
        if(this.play){
            inputText.classList.add("scrollDisabled");
            outputText.classList.add("scrollDisabled");
            if(this.speed<=3){
                inputText.classList.add("scrollSmooth");
                outputText.classList.add("scrollSmooth");
            }   

            elem.classList.add("pausedBKG");
            elem.classList.remove("playingBKG");
            return;
        }
        if(this.pause || this.reset || this.stop){
            inputText.classList.remove("scrollDisabled");
            outputText.classList.remove("scrollDisabled");

            elem.classList.remove("pausedBKG");
            elem.classList.add("playingBKG");
        }
        

    }

    setSpeed=()=>{
        this.speed+=1;
        if(this.speed==5){
            this.speed=1;
        }
        this.updateSpeedDisplay();
    }
    updateSpeedDisplay(){
        speedBTN.innerText=(this.speed==1?"":this.speed+"x-")+"speed";
    }

    setFrames=(n:number)=>{
        this.frames=n;
    }
}

export const aniControl= new AnimationControl();