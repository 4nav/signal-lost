import { useEffect, useState } from "react";

const LINES = [
    "OCTOBER 1987.",
    "RELAY STATION KESTREL.",
    "WENT SILENT AFTER A STORM",
    "THE OPERATOR WAS NEVER FOUND",
    "BUT IT IS STILL TRANSMITTING",
    "YOU HAVE A RECEIVER. LISTEN"
];

const FIRST_MS = 900;
const STEP_MS = 1500;

export default function Intro({onDone} : {onDone: () => void}){
    const [shown, setShown] = useState(0);
    const [leaving, setLeaving] = useState(false);
    const all = shown >= LINES.length;

    useEffect(() => {
        if(all)return;
        const id = window.setTimeout(() => setShown((n) => n + 1), shown === 0? FIRST_MS: STEP_MS);
        return() => window.clearTimeout(id);
    }, [shown, all]);

    function advance() {
        if(leaving)return;
        if(!all){
            setShown(LINES.length);
            return;
        }
        setLeaving(true);
        window.setTimeout(onDone, 900);
    }

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if(e.metaKey || e.ctrlKey || e.altKey)return;
            if(e.key === "Enter" || e.key === " " || e.key === "Escape"){
                e.preventDefault();
                advance();
            }
        };
        window.addEventListener("keydown", onKey);
    });

    return(
        <div
        onClick={advance}
        style = {{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "#000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 5vw",
            textAlign: "center",
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 16,
            lineHeight: 2.4,
            cursor: "pointer",
            userSelect: "none",
            opacity: leaving ? 0 : 1,
            transition: "opacity 0.9s ease",
        }}>
            {LINES.map((line,i) => (
                <div
                key={i}
                style={{
                    color: i === 0 ?  "#d6a65d" : "#8ee6a0",
                    opacity: i < shown ? 1: 0,
                    transition: "opacity 1.2s ease",
                }}>
                    {line}
                </div>
            ))}
        <div 
            style={{
                marginTop: 36,
                fontSize: 8,
                color: "#456c4b",
                opacity: all ? 1: 0,
                animation: all ? "introBlink 1.4s ease-in-out infinite": "none",
                transition: "opacity 1s ease"
            }}
        >
            [ CLICK OR PRESS ENTER ]
        </div>
        </div>
    );
}