export type Box = {x: number, y: number, w: number, h: number};

export const FRAME = {w: 1024, h: 640};

export const BOX = {
    lcd: { x: 352, y: 131, w: 320, h: 68 },
  meter: { x: 565, y: 268, w: 129, h: 83 },
  dial: { x: 320, y: 250, w: 107, h: 117 },
  knob: { x: 381, y: 457, w: 110, h: 110 },
  scope: { x: 520, y: 466, w: 90, h: 97 },
  keypad: { x: 672, y: 468, w: 62, h: 89 },
  ref: { x: 272, y: 540, w: 53, h: 20 },
  red: { x: 296, y: 455, w: 52, h: 53 },
  power: { x: 477, y: 260, w: 43, h: 90 },
  toggle: { x: 302, y: 409, w: 32, h: 38 },
} satisfies Record<string, Box>;

export const HUB = {x: 630, y: 316};
export const DIAL_CENTER = { x: 373.5, y: 308.5 };
export const REF_OPEN_AT = { x: 272, y: 540 };
export const REF_PANEL = { x: 790, y: 440 };

export const FRAMES = {
    off:  "/frames/off.png",
    warm: "/frames/warmup.png",
    lit: [0,1,2,3,4,5].map((n) => `/frames/lights${n}.png`),
}

export const SPRITES = {
    knob: "/sprites/knob.png",
    toggleDown: "/sprites/toggle_down_log.png",
    redPressed: "/sprites/red_button_pressed.png",
    refOpen: "/sprites/ref_open.png",
}

