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
};

export default function Rotary({box, value, min, max, perDeg, onChange, label, disabled, children}: Props){
    const ref = useRef<HTMLDivElement>(null);
    const last = useRef(0);
    const cur = useRef(value);
    cur.current = value;

    function angle(e: PEvent){
        const r= ref.current!.getBoundingClientRect();
        const dx =  e.clientX - (r.left + r.width / 2);
        const dy =  e.clientX - (r.top + r.height / 2);
        return (Math.atan2(dx, -dy) * 180 / Math.PI);
    }

    function down(e: PEvent){
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
    }
}

