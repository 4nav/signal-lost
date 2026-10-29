export const LOCK_WINDOW = 30;
const RANGE = 800;

export function getSignalStrength(frequency: number, target: number): number{
    const diff = Math.abs(frequency - target);
    const t = Math.max(0,1 - diff/RANGE);
    return Math.round(100*t*t);
}

export function isSignalLocked(frequency: number, target: number): boolean{
    return Math.abs(frequency - target) <= LOCK_WINDOW;
}


