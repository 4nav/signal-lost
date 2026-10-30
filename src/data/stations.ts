export type BackgroundStation = {
    frequency: number;
    label: string;
    lines: string[];
}

export const ambient: BackgroundStation[] = [
    {
        frequency: 4565,
        label: "WEATHER LOOP",
        lines: ["Coastal forecast: winds from the northeast, visibility poor.",
                "Barometer falling. Storm expected by evening.",
                "This has been the coastal weather service. Repeating."],
    },
    {
    frequency: 5395,
    label: "NUMBERS STATION",
    lines: [
      "...seven... three... nine... one...",
      "...four... four... zero... eight...",
      "Message ends. Message ends.",
    ],
  },
  {
    frequency: 6210,
    label: "LOST HAM",
    lines: [
      "CQ, CQ, anyone out there? Lonely ham on the ridge.",
      "Band's been dead all week. Hello? Hello?",
      "Well. Back to the crossword.",
    ],
  },
  {
    frequency: 6900,
    label: "DEAD AIR",
    lines: ["(a low hum)", "(a faint click, then nothing)", "(the hum again)"],
  },
  {
    frequency: 7625,
    label: "MARINE BULLETIN",
    lines: [
      "Trawler lanes: fog, moderate to poor.",
      "Lighthouse reports a light failure on the northern rocks.",
      "That concludes the marine bulletin.",
    ],
  },
  {
    frequency: 8430,
    label: "EVENING SERVICE",
    lines: [
      "A hymn, somewhere very far away.",
      "The congregation fades into static.",
    ],
  },
  {
    frequency: 9140,
    label: "RADIO TAXI",
    lines: [
      "Dispatch to cab: the north road is closed. Over.",
      "Cab copies. Heading back to the depot.",
    ],
  },
  {
    frequency: 9905,
    label: "JAMMER",
    lines: [
      "A rising whine, then a pulsing buzz.",
      "Someone is trying to keep this band quiet.",
      "The buzz stops, as if listening.",
    ],
  },
  {
    frequency: 10795,
    label: "TIME SIGNAL",
    lines: [
      "A tone. A pause. A tone.",
      "The time signal has not been correct since the storm.",
    ],
  },
  {
    frequency: 11620,
    label: "UNKNOWN",
    lines: [
      "Someone is breathing close to the microphone.",
      "A man clears his throat.",
      "Then nothing.",
    ],
  },
]