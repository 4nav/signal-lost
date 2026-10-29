export type Transmission = {
    id: number;
    frequency: number;
    keyword: string;
    hint: string;
    message: string;
    drift: number;
}

export const transmissions: Transmission[] = [
    {
        id: 1,
        frequency: 4170,
        keyword: "START",
        hint: "The first signals under 5000 hertz",
        message: "Station log, October 14, 1987. The receiver is online. If anyone finds this recording, the station is still operational.",
        drift: 0
    },
];