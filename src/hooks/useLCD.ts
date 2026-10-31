import { use, useEffect, useReducer, useRef, useState } from "react";
import { wrap } from "../utils/text";

export const COLS = 30;
export const ROWS = 5;

export type LCDDoc = {
    key: string; //typewriter starts when ts changes
    body: string; 
    live?: string;
    instant?: boolean;
    signal?: boolean;
}

export function useLCD(doc: LCDDoc, strength: number){
    const saved = useRef<Record<string, number>>({});
    const [,force] = useReducer((n: number)=> n+1,0);
    const [scroll, setScroll] = useState(0);
    const [follow, setFollow] = useState(true);
    const strengthRef = useRef(strength);
    strengthRef.current = strength;

    const flat = wrap(doc.body, COLS).join('\n');
    const typed = doc.instant ? flat.length : Math.min(saved.current[doc.key] ?? 0, flat.length);
    const done = typed >= flat.length;

    useEffect(() => {
        setFollow(true);
        setScroll(0);
    }, [doc.key]);

    useEffect(() => {
        if(doc.instant)return;
        const len = flat.length;
        let acc = 0;
        let last = performance.now();
        const id = window.setInterval(() => {
            const now = performance.now();
            const dt = (now - last)/100;
            last = now;
            const rate = doc.signal ? 40 * Math.min(1, strengthRef.current / 85) : 40; //chars/sec
            acc += rate * dt;
            const n = Math.floor(acc);
            if( n < 1)return;
            acc -= n;
            const cur = saved.current[doc.key] ?? 0;
            if(cur >= len) return;
            saved.current[doc.key] = Math.min(len, cur + n);
            force()
        }, 50);
        return () => window.clearInterval(id);
    }, [doc.key, doc.instant, doc.signal, flat.length]);

    const bodyRows = flat? flat.slice(0, typed).split('\n') : [];
    const liveRows = done && doc.live ? wrap(doc.live, COLS) : [];
    const all = [...bodyRows, ...liveRows];
    const maxScroll = Math.max(0, all.length - ROWS);
    const pos = follow?maxScroll:Math.min(scroll, maxScroll);
    const row0 = Math.round(pos);

    return{
        rows: all.slice(row0, row0 + ROWS),
        pos, maxScroll, scrollTo: (v: number)=>{
            setFollow(v >= maxScroll);
            setScroll(v);
        },
        scrollBy: (d: number) => {
            const v = Math.min(maxScroll, Math.max(0, row0 + d));
            setFollow(v >= maxScroll);
            setScroll(v);
        },
        skip: () => {
            saved.current[doc.key] = flat.length;
            force();
        },
        reset: () => {
            saved.current = {};
            force();
        },
    };
}