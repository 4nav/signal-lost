import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import {TOUR} from "../radio/tour";

type Props = {step: number; onNext: () => void; onSkip: () => void};

const noFocus = (e: ReactMouseEvent) => e.preventDefault();

const btn: CSSProperties={
    flex: 1,
    background: "#456c4b",
    color: "#0a0f0b",
    border: "1px solid #456c4b",
    fontFamily: '"Press Start 2P", monospace',
    fontSize: 8,
    padding: "5px 0",
    cursor: "pointer",
};

export default function Tour({step, onNext, onSkip}: Props){
    const s = TOUR[step];
    const b = s.box;
    const last = step === TOUR.length - 1;

    return(
        <>
        <div style = {{position: "absolute", inset: 0, zIndex: 50}} />

        {b && (
            <div
            style={{
                position: "absolute",
                left: b.x - 3,
                top: b.y - 3,
                width: b.w + 6,
                height: b.h + 6,
                boxSizing: "border-box",
                border: "2px solid #d6a65d",
                animation: "tourPulse 0.9s ease-in-out infinite alternate",
                pointerEvents: "none",
                zIndex: 51,
            }}
            />
        )}
        
        <div
        style={{
            position: "absolute",
            left: 805,
            top: 290,
            width: 190,
            zIndex: 52,
            background: "#0a0f0b",
            color: "#8ee6a0",
            border: "2px solid #456c4b",
            padding: 8,
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 8,
            lineHeight: "14px",
        }}
        >

            <div
            style = {{color: "#d6a65d", marginBottom: 6}}>
                {s.title} ({step + 1}/{TOUR.length})
            </div>

            <p style = {{margin: "0 0 10px"}}> {s.text}</p>
            <div style = {{display: "flex", gap: 6}}>
                <button onMouseDown={noFocus} onClick={onNext} style={btn}>
                    {last ? "START": "NEXT"}
                </button>
            {!last && (
                <button
                onMouseDown={noFocus}
                onClick={onSkip}
                style={{...btn, background: "transparent", color:"#8ee6a0" }}>
                    SKIP
                </button>
            )}
            </div>
        </div>
        </>
    );
}