import { BOX, type Box} from "./layout";

export type TourStep = {
    box: Box | null;
    title: string;
    text: string
};

export const TOUR: TourStep[] = [
    {box: BOX.power, title: "POWER", text: "THE LEVER SWITCHES THE RADIO ON AND OFF."},
    {box: BOX.lcd, title: "DISPLAY", text: "WHAT YOU RECEIVE PRINTS HERE. CLICK IT TO SKIP THE TYPING."},
    {box: BOX.keypad, title: "KEYPAD", text: "TYPE A CHANNEL, THEN HIT ENT. CLR CLEARS IT. YOUR KEYBOARD WORKS TOO."},
    {box: BOX.dial, title: "FINE TUNING", text: "TURN IT TO CHASE A STATION. LEFT AND RIGHT ARROWS NUDGE IT. SHIFT NUDGES BIG." },
    {box: BOX.meter, title: "NEEDLE", text: "IT LEANS TOWARDS THE CLOSEST STATION. RIGHT: TURN CLOCKWISE. LEFT: TURN BACK."},
    {box: BOX.lights, title: "LIGHTS", text: "MORE LIGHT MEANS CLOSER. ALL FIVE MEANS LOCKED."},
    {box: BOX.scope, title: "SCOPE", text: "A SMOOTH WAVE IS A STRONG SIGNAL. NOISE MEANS YOU HAVE DRIFTED OFF OF IT."},
    {box: BOX.knob, title: "SCROLL KNOB", text: "SCROLLS THE DISPLAY. UP AND DOWN ARROWS DO THE SAME."},
    {box: BOX.toggle, title: "LIVE/LOG", text: "LOG SHOWS EVERY MESSAGE YOU HAVE SOLVED. YOU WILL NEED IT. FLIP IT BACK TO TUNE."},
    {box: BOX.red, title: "SEND", text: "SENDS YOUR ANSWER. ENTER DOES THE SAME."},
    {box: BOX.ref, title: "REF", text: "MORSE CHART, AND HELP IF YOU GET STUCK. HELP IS COUNTED." },
    {box: null, title: "READY", text: "TUNE CH 417 TO BEGIN. TYPE 417, THEN ENT." },

]