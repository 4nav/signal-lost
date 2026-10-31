export const LOCK_WINDOW = 20;
export const RANGE = 120;
export const SPAN = 100; 

export function getSignalStrength(frequency: number, target: number): number{
    const diff = Math.abs(frequency - target);
    const t = Math.max(0,1 - diff/RANGE);
    return Math.round(100*t*t);
}

export function getStrengthNearest(frequency: number, targets: number[]): number{
    return Math.max(...targets.map((t) => getSignalStrength(frequency,t)));
}

export function getNearestDistance(frequency: number, targets: number[]): number{
    return Math.min(...targets.map((t) => Math.abs(frequency - t)));
}

export function isSignalLocked(frequency: number, target: number): boolean{
    return Math.abs(frequency - target) <= LOCK_WINDOW;
}

export function litCount(distance: number, locked: boolean): number{
    if(locked)return 5;
    if(distance > RANGE)return 0;
    const t= (RANGE - distance) / (RANGE - LOCK_WINDOW);
    return (1 + Math.floor(t * 3.999));
}


