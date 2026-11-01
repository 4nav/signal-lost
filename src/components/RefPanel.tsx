import { morse } from "../utils/morse";
import { REF_PANEL } from "../radio/layout";
import { useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from "react";

const entries = Object.entries(morse).map(([code, letter]) => [letter, code] as const).sort(([a], [b]) => a.localeCompare(b));

type Props = {
    hints: string[];
    canReveal: boolean;
    onReveal: () => void;
};

const noFocus = (e: ReactMouseEvent) => e.preventDefault();

const tabBtn = (active: boolean): CSSProperties => ({
    flex: 1,
    background: active? "#456c4b" : "transparent", 
    color: active? "#0a0f0b" : "#8ee6a0",
    border: "1px solid #456c4b",
    fontFamily: ' "Press Start 2P", monospace',
    fontSize: 8,
    padding: "4px 0",
    cursor: "pointer",
});


export default function refPanel({ hints, canReveal, onReveal }: Props) {
    const [tab, setTab] = useState<"morse" | "hint">("morse");
    const label = hints.length === 0 ? "GET A HINT" : hints.length === 1? "BIGGER HINT": "SHOW CHANNEL";

    return (
        <div
            style = {{
                position: "absolute",
                left: REF_PANEL.x,
                top: REF_PANEL.y,
                width: 190,
                background: "#0a0f0b",
                color: "#8ee6a0",
                border: "2px solid #456c4b",
                padding: "8px 10px",
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 8,
                lineHeight: "14px",
            }}
        >
            <div style = {{display: "flex", gap: 4, marginBottom: 8}}>
                <button onMouseDown={noFocus} onClick={() => setTab("morse")}style={tabBtn(tab === "morse")}>MORSE</button>
                <button onMouseDown={noFocus} onClick={() => setTab("hint")} style={tabBtn(tab === "hint")}>{label}</button>
            </div>
            {tab === "morse" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, auto)", columnGap: 14 }}>
                {entries.map(([letter, code]) => (
                    <span key={letter}>
                    <span style={{ color: "#d6a65d" }}>{letter}</span> {code}
                    </span>
                ))}
                </div>
            ): (
                <div>
                    {hints.length === 0 && <p style = {{margin: "0 0 8px"}}> STUCK? ASK FOR A NUDGE.</p>}
                    {hints.map((h,i) => (
                        <p key={i} style={{margin: "0 0 8px", color: i === 2?"#d6a65d" : "#8ee6a0"}}>
                            {i + 1}. {h}
                        </p> 
                    ))}
                    {canReveal && (
                        <button onMouseDown={noFocus} onClick={onReveal} style = {{...tabBtn(true), width: "100%", flex: "none"}}>
                            {label}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}