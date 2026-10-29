import { useRef } from "react";

const MIN = 4000;
const MAX = 12000;
const STEP = 10;

type DialProps = {
    frequency: number;
    onChange: (frequency: number) => void;
}

export default function Dial({frequency, onChange}: DialProps){
    const svgRef = useRef<SVGSVGElement>(null);

    const t= (frequency - MIN)/ (MAX - MIN);
    const angle = Math.PI * (1 - t);
    const needleX = 100 + 70*Math.cos(angle);
    const needleY = 100 - 70 * Math.sin(angle);

    function update(e: React.PointerEvent){
        const rect = svgRef.current!.getBoundingClientRect();
        const cx = rect.left + rect.width /2;
        const cy = rect.top + rect.height * (100 / 110);
        let a = Math.atan2(cy - e.clientY, e.clientX - cx);

    }
}