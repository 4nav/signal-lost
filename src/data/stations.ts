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
            "This has been the coastal weather service. Repeating."
    ],
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
  { 
    frequency: 4365, 
    label: "LIGHTHOUSE KEEPER", 
    lines: [
    "The light is out again on the north rocks.",
    "The fuse blew in the storm. I'll climb up at dawn.",
    "Anyone reading me? Hello?" 
    ], 
  },
  { 
    frequency: 4765, 
    label: "FERRY NOTICE", 
    lines: [
      "Ferry service is suspended until further notice.",
      "The next sailing depends on the storm.",
      "Passengers are advised to stay ashore." 
    ], 
  },
  { 
    frequency: 5180, 
    label: "SHIPPING FORECAST", 
    lines: [
      "Northeast gale, rain, visibility poor.",
      "Occasionally very poor near the headland.",
      "Next bulletin at midnight." 
    ], 
  },
  { 
    frequency: 5610, 
    label: "CHURCH BELLS", 
    lines: [
      "(a bell, slow and far away)",
      "(the bell again, slightly flat)",
      "(then only wind)" 
    ],
  },
  { 
    frequency: 6020, 
    label: "FARM REPORT", 
    lines: [
      "Cattle prices are steady in the northern markets.",
      "Roads past the ridge remain closed.",
      "That concludes the evening farm report." 
    ], 
  },
  { 
    frequency: 6400, 
    label: "HAM CONTEST", 
    lines: [
      "CQ contest, CQ contest, this is November Seven Echo.",
      "Station copied, loud and clear. Over.",
      "Thanks, seventy-threes." 
    ], 
  },
  { 
    frequency: 7420, 
    label: "OLD RECORD", 
    lines: [
      "(a scratchy waltz, someone humming along)",
      "(the needle skips and repeats a bar)",
      "(the music fades into hiss)" 
    ], 
  },
  { frequency: 7830, 
    label: "TELETYPE", 
    lines: [
      "(a mechanical clatter, then a bell)",
      "STATION KESTREL. NO TRAFFIC. NO TRAFFIC.",
      "(the clatter stops)" 
    ], 
  },
  { 
    frequency: 8235, 
    label: "SCHOOL BROADCAST", 
    lines: [
      "Good evening, class. Please open your atlases.",
      "Tonight: how radio waves travel around the world.",
      "A signal can circle the earth and arrive back where it started." 
    ], 
  },
  { frequency: 8625, 
    label: "CHESS BY RADIO", 
    lines: [
      "Knight to f6.",
      "Bishop takes. Your move.",
      "You have been thinking for a long time." 
    ], 
  },
  { frequency: 9680, 
    label: "CARGO BEACON", 
    lines: [
      "(a steady beep, once a second)",
      "(a beep, then a pause that is too long)",
      "(the beeps resume, faster)" 
    ], 
  },
  { frequency: 10130, 
    label: "WEATHER FAX", 
    lines: [
      "(a rising screech, like a modem)",
      "(a rhythmic scanning sound)",
      "(it ends in the middle of a line)" 
    ],
  },
  { frequency: 10570, 
    label: "LONELY OPERATOR", 
    lines: [
      "This is relay four. Is anyone receiving me?",
      "I have been calling for many days.",
      "I will keep the lamp lit." 
    ], 
  },
  { frequency: 11020, 
    label: "ECHO TEST", 
    lines: [
      "Testing, one, two, three.",
      "Testing, one, two, three.",
      "Testing, one, two, three." 
    ], 
  },
]