export type Transmission = {
    id: number;
    frequency: number;
    keyword: string;
    message: string;
    drift: number;
}

export const BOOT_CLUE = "UNIDENTIFIED CARRIER. LOW CHANNELS. BELOW CH 450.";

export const transmissions: Transmission[] = [
    {
        id: 1,
        frequency: 4170,
        keyword: "START",
        message:  "Station log, October 14, 1987. This is Relay Station Kestrel, calling any receiver that can hear me. Power has been unstable since the storm, so I'm recording everything while the generator holds. The line isn't safe, so I'll say things carefully, and I measure my words, because each one costs power. Every station of mine opens with its call sign, in code. Answer it, so I know it's you on the line and no one else. If you're listening, you found the right channel. Next I'll be at the northern relay, channel four ninety-six. I won't be able to repeat myself.",
        drift: 0,
    },

    {
        id: 2,
        frequency: 4960,
        keyword: "NORTH",
        message: "The northern relay answered once this morning, then went silent. I can hear its carrier tone, but nobody picks up. Either the cable between us was cut, or the relay is running with no one inside. I'm walking up at first light. Every word costs me power, so I'll keep the last line short. Quiet listener, you.",
        drift: 0,
    },

    {
        id: 3,
        frequency: 5830,
        keyword: "SOS",
        message: "SOS. The relay was empty, and nobody had cut the cable. The main transmitter is dead now too, and I can hear footsteps in the corridor, but the station is empty when I look. I scratched three lines into the wall by the door, so that someone would know I was here. Nobody else has walked these corridors. Someone unplugged it by hand. I will wait for you where the road ends.",
        drift: 6,
    },

    {
        id: 4,
        frequency: 6590,
        keyword: "RELAY",
        message: "Good news first: the repeater still runs on its own battery, and I'm reading the logbooks by lamplight. Bad news: the handwriting is mine, but I never wrote these pages, and every entry is dated for tomorrow. At school they made us recite the alphabet before we learned our numbers, and tonight, with the lamp failing, I keep going back to those lessons.",
        drift: 8,
    },

    {
        id: 5,
        frequency: 7210,
        keyword: "LOGS", 
        message: "I've read every page. The entries are accurate, down to the minute, until tonight. Then they describe an hour that hasn't happened yet. All of them end the same way: a transmission, and then nothing. I've started hearing numbers hiding inside ordinary words, which I suppose is what the weight of so many sleepless hours does. The meters have all zeroed out. It's the fourth night without sleep.",
        drift: 10,
    },

    {
        id: 6,
        frequency: 8040,
        keyword: "SEVEN",
        message: "It's seven o'clock. The receiver woke up on its own. A strong carrier from our own antenna, and the date stamp on the tape says tomorrow. I got it on reel. I think I got it. I haven't slept in days, and I keep needing something to hold on to. There's a spider on the console. I counted every leg. The only meat the supply drop has left us in weeks is octopus, and eating all the arms is a luxury. Then I caught myself in the glass of the dial and counted my own eyes. I counted them again. It comes out the same every time.",
        drift: 13,
    },

    {
        id: 7,
        frequency: 8820,
        keyword: "VOICE",
        message: "I played the tape. It's a man's voice, reading the logbook aloud, a few seconds ahead of where I am in the pages. It took me until the last reel to recognize him. It's me. Same cough, same humming under his breath when nobody's listening. Who is sending it? Who is listening? I keep asking the room the same question, and I keep lifting the telephone by the door to spell it out on the buttons.",
        drift: 16,
    },

    {
        id: 8,
        frequency: 9460,
        keyword: "LOOP",
        message: "I think I understand. The signal isn't coming from outside, it's looping through the station, out of the antenna tonight and back in tomorrow. Someone has to send it for tonight to happen at all, and the only person who can is me. If I don't transmit, the loop breaks, and nobody ever finds Kestrel. The wall clock stopped when the power failed, frozen at twenty-five to eleven, and I haven't dared touch it. It's the only honest thing in this room.",
        drift: 19,
    },

    {
        id: 9,
        frequency: 10350,
        keyword: "ECHO",
        message: "The footsteps in the corridor were mine. So was the breaker, and the unplugged cable, and every cold spot I walked through. They're echoes, left behind by a version of me who already lived through tomorrow, trying to leave a trail for me to follow. I keep coming back to the day I arrived at Kestrel, the twenty-fourth of November, the snow up to the door, and the date I wrote on the first form at the desk.",
        drift: 22,
    },

    {
        id: 10,
        frequency: 11240,
        keyword: "HOME",
        message: "If this reaches you, you're sitting where I'm sitting, and everything I told you, you're about to live. You'll walk to the relay and flip the breaker. At seven you'll record the voice, and the voice will be yours. Don't turn the receiver off. Keep it running and the signal never ends. Turn it off, and I'm gone. Please. Bring me home.",
        drift: 25,
    }
];