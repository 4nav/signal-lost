import { useState } from "react";
import { morse } from "../utils/morse";

const entries = Object.entries(morse).map(([code, letter]) => [letter, code] as const).sort(([a], [b]) => a.localeCompare(b));

export default function Notebook() {
    const [hover, setHover] = useState(false);
    const [pinned, setPinned] = useState(false);
    const open = hover || pinned;

    return(
        <div 
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{ position: "fixed", right: 16, bottom: 16, zIndex: 10 }}
        >
            {open ? (
                <div 
                    onClick={() => setPinned(!pinned)}
                    style={{
                        background: "#e8e0c8",
                        color: "#2b2b2b",
                        fontFamily: "monospace",
                        padding: "12px, 16px",
                        borderRadius: 4,
                        boxShadow: "0 4px 14px rgba(0,0,0,0.5)",
                        cursor: "pointer",
                    }}
                >
                <div style= {{fontWeight: 700, marginBottom: 8}}> MORSE NOTES </div>
                <div 
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, auto)",
                        columnGap: 18,
                        rowGap: 4,
                    }}
                > {entries.map(([letter, code]) => (
                    <span key={letter}>
                        <strong>{letter}</strong> {code}
                    </span>
                ))}
                    </div>
                </div>
            ): (
                <button
                    onClick={() => setPinned(true)}
                    aria-expanded = {false}
                    style={{
                        background: "#e8e0c8",
                        color: "#2b2b2b",
                        border: "none",
                        borderRadius: 4,
                        padding: "10px 14px",
                        fontFamily: "monospace",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.5)",
                    }}
                > NOTES </button>
                )} 
        </div>
    );
}
