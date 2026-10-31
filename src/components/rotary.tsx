import { useRef, type PointerEvent as PEvent, type ReactNode } from "react";
import type { Box } from "../radio/layout";

type Props = {
    box: Box;
    value: number;
    min: number;
    max: number;
    perDeg: number;
    onChange: (v: number) => void;
    label: string;
    disabled?: boolean;
    children: (angleDeg: number) => ReactNode;
    onTurn?: (deg: number) => void;
};

export default function Rotary({box, value, min, max, perDeg, onChange, label, disabled, children, onTurn}: Props){
    const ref = useRef<HTMLDivElement>(null);
    const last = useRef(0);
    const cur = useRef(value);
    cur.current = value;

    function angle(e: PEvent){
        const r= ref.current!.getBoundingClientRect();
        const dx =  e.clientX - (r.left + r.width / 2);
        const dy =  e.clientY - (r.top + r.height / 2);
        return (Math.atan2(dx, -dy) * 180 / Math.PI);
    }

    function down(e: PEvent){
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        last.current = angle(e);
    }

    function move(e:PEvent){
        if(!e.currentTarget.hasPointerCapture(e.pointerId))return;
        const a = angle(e);
        let d = a - last.current;
        if(d > 180) d-=360;
        if(d < -180)d+=360;
        last.current = a;
        onTurn?.(d);
        const next = Math.min(max, Math.max(min, cur.current + d*perDeg));
        cur.current = next;
        onChange(next);
    }
    
    return(
        <div
            ref={ref}
            role="slider"
            aria-label={label}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={Math.round(value*10)/10}
            onPointerDown={down}
            onPointerMove={move}
            style = {{
                position: "absolute",
                left: box.x,
                top: box.y,
                width: box.w,
                height: box.h,  
                touchAction: "none",
                cursor: disabled ? "default" : "grab",
                pointerEvents: disabled ? "none" : "auto",
            }}
        >
            {children(value/perDeg)}
        </div>
    );
}

