import React, { useRef } from "react";

const MIN = 4000;
const MAX = 12000;
const TURNS = 3;
const KHZ_PER_DEG = (MAX - MIN) / (360 * TURNS);

type KnobProps = {
    frequency: number;
    onChange: (frequency: number) => void;
}

const clamp = (v:number) => Math.min(MAX, Math.max(MIN, v));

export default function Dial({frequency, onChange}: KnobProps){
    const knobRef = useRef<HTMLDivElement>(null);
    const lastAngle = useRef(0);
    const freqRef = useRef(frequency);
    freqRef.current = frequency;

    function pointerAngle(e: React.PointerEvent){
        const rect = knobRef.current!.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        return (Math.atan2(dx ,-dy) * 180) / Math.PI;
    }

    function onPointerDown(e: React.PointerEvent){
        e.currentTarget.setPointerCapture(e.pointerId);
        lastAngle.current = pointerAngle(e);
    }

    function onPointerMove(e: React.PointerEvent){
        if(!e.currentTarget.hasPointerCapture(e.pointerId))return;
        const angle  = pointerAngle(e);
        let delta = angle - lastAngle.current;

        if(delta > 180) delta -=360;
        if (delta < -180) delta += 360;
        lastAngle.current = angle;

        const nxt = clamp(Math.round(freqRef.current + delta * KHZ_PER_DEG));
        freqRef.current = nxt;
        onChange(nxt);
    }

    function onKeyDown(e: React.KeyboardEvent){
        if (e.key === "ArrowLeft" || e.key === "ArrowDown") onChange(clamp(frequency - 10));
        if (e.key === "ArrowRight" || e.key === "ArrowUp") onChange(clamp(frequency + 10));
    }

    const rot = (frequency - MIN)/KHZ_PER_DEG;

    return (
        <div
            ref={knobRef}
            tabIndex={0}
            role="slider"
            aria-label="Radio Frequency"
            aria-valuemax={MAX}
            aria-valuemin={MIN}
            aria-valuenow={frequency}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            style={{
                width: 160,
                height: 160,
                borderRadius: "50%",
                background: "radial-gradient(circle at 35% 30%, #ddd, #666 70%, #333)",
                border: "4px solid #222",
                position: "relative",
                cursor: "grab",
                touchAction: "none",
                userSelect: "none", 
                transform: `rotate(${rot}deg)`,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: 8,
                    left: "50%",
                    width: 6,
                    height: 36,
                    marginLeft: -3,
                    borderRadius: 3,
                    background: "#d6a65d",
                }}
            />
        </div>
    );
}