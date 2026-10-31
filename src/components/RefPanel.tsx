import { morse } from "../utils/morse";
import { REF_PANEL } from "../radio/layout";

const entries = Object.entries(morse).map(([code, letter]) => [letter, code] as const).sort(([a], [b]) => a.localeCompare(b));

export default function refPanel() {
    return (
        <div
            style = {{
                position: "absolute",
                left: REF_PANEL.x,
                top: REF_PANEL.y,
                background: "#0a0f0b",
                color: "#8ee6a0",
                border: "2px solid #456c4b",
                padding: "8px 10px",
                fontFamily: '"Press Start 2P", monospace',
                fontSize: 8,
                lineHeight: "14px",
                display: "grid",
                gridTemplateColumns: "repeat(3, auto)",
                columnGap: 14,
            }}
        >
            {entries.map(([letter, code]) => (
                <span key={letter}>
                    <span style={{ color: "#d6a65d" }}>{letter}</span> {code}
                </span>
            ))}
        </div>
    );
}