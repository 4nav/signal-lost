import { useEffect, useRef } from "react";
import type {Box} from "../radio/layout";

export function Scope({box, strength, on}: {box: Box; strength: number; on: boolean}){
    const ref = useRef<HTMLCanvasElement>(null);
    const s = useRef(strength);
    s.current = strength;

    useEffect(() => {
        if(!on)return;
        const ctx = ref.current!.getContext("2d")!;
        let raf = 0;
        function frame(t: number){
            ctx.clearRect(0,0,box.w, box.h);
            const q = s.current/100;
            const amp = box.h * 0.28 * (0.35 + 0.65*q);
            ctx.strokeStyle = "#d6a65d";
            ctx.lineWidth = 2;
            ctx.beginPath();
            for(let x = 0; x < box.w; x+=2){
                const noise = (Math.random() - 0.5) * (1 - q) * box.h * 0.7;
                const y = box.h / 2 + Math.sin(x * 0.18 - t * 0.006) * amp + noise;
                if(x === 0)ctx.moveTo(x,y);
                else ctx.lineTo(x,y);
            }
            ctx.stroke();
            raf = requestAnimationFrame(frame);
        }
        raf = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(raf);
    }, [on, box.w, box.h]);

    return(
        <canvas 
            ref={ref}
            width={box.w}
            height={box.h}
            style={{
                position: "absolute",
                left: box.x,
                top: box.y,
                imageRendering: "pixelated",
                pointerEvents: "none",
            }}
        />
    );
}