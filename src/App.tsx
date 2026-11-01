import { useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent,} from "react";
import { transmissions, BOOT_CLUE } from "./data/transmissions";
import { ambient } from "./data/stations";
import { getStrengthNearest, getNearestDistance, isSignalLocked, litCount, RANGE, SPAN, } from "./utils/signal";
import { encodeMorse } from "./utils/morse";
import { garble } from "./utils/text";
import { useLCD, type LCDDoc } from "./hooks/useLCD";
import { BOX, FRAME, FRAMES, SPRITES, HUB, DIAL_CENTER, REF_OPEN_AT, type Box } from "./radio/layout";
import Rotary from "./components/rotary";
import {Scope} from "./components/scope";
import RefPanel from "./components/RefPanel";

const RETUNE_MS = 1500;
const WARMUP_MS = 800;
const DEG_PER_ROW = 24; 
const DIAL_DEG = 270;   
const KEYS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "CLR", "9", "ENT"];

const STORY_REACH = 100;
const storyFreqs = transmissions.map((t) => t.frequency);
const ambientFreqs = ambient.map((a) => a.frequency);

const abs = (b: Box): CSSProperties => ({
  position: "absolute",
  left: b.x,
  top: b.y,
  width: b.w,
  height: b.h,
});
const noFocus = (e: ReactMouseEvent) => e.preventDefault();
const clampOff = (v: number) => Math.min(SPAN, Math.max(-SPAN, v));

const randomOffset = () => (Math.random() < 0.5 ? -1 : 1) * (30 + Math.random() * 50);

function useStageScale() {
  const [s, setS] = useState(1);
  useEffect(() => {
    const calc = () => {
      const r = Math.min(window.innerWidth / FRAME.w, window.innerHeight / FRAME.h);
      setS(r >= 1 ? Math.floor(r) : r); 
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);
  return s;
}

export default function App() {
  const scale = useStageScale();

  const [power, setPower] = useState<"off" | "warming" | "on">("off");
  const [view, setView] = useState<"live" | "log">("live");
  const [refOpen, setRefOpen] = useState(false);
  const [pressed, setPressed] = useState(false);

  const [entry, setEntry] = useState("");
  const [channel, setChannel] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [retuning, setRetuning] = useState(false);
  const [notice, setNotice] = useState("");

  const [curIdx, setCurIdx] = useState(0);
  const [ans, setAns] = useState("");
  const [error, setError] = useState("");
  const [solved, setSolved] = useState(false);
  const [seed, setSeed] = useState(0);
  const [spin, setSpin] = useState(0);

  const retuneTimer = useRef<number | undefined>(undefined);
  const warmTimer = useRef<number | undefined>(undefined);

  const on = power === "on";
  const transmission = transmissions[curIdx];
  const isLast = curIdx === transmissions.length - 1;

  const frequency = channel === null || retuning ? null : channel * 10 + offset;
  const visible = channel === null ? [] : [...storyFreqs.filter((f) => Math.abs(f - channel * 10) <= STORY_REACH), ...ambientFreqs]
  const live = on && frequency !== null;
  const strength = live ? getStrengthNearest(frequency, visible) : 0;
  const tunedFreq = live ? visible.find((f) => isSignalLocked(frequency, f)) ?? null : null;
  const lit = live ? litCount(getNearestDistance(frequency, visible), tunedFreq !== null) : 0;
  const onCurrent = tunedFreq !== null && tunedFreq === transmission.frequency;
  const ambientHere = tunedFreq !== null ? ambient.find((a) => a.frequency === tunedFreq) : undefined;


  const nearest = live ? visible.reduce((b, f) => (Math.abs(f - frequency) < Math.abs(b - frequency) ? f : b)) : null;
  const err = live && nearest !== null ? nearest - frequency : null;
  const needle = err === null || Math.abs(err) > RANGE ? -75 : (err / RANGE) * 60;

  let doc: LCDDoc;
  if (!on) {
    doc = { key: "off", body: "", instant: true };
  } 
  
  else if (view === "log") {
    const upto = solved ? curIdx + 1 : curIdx;
    const text = transmissions.slice(0, upto).map((t) => `LOG ${t.id}\n${t.message}\n`).join("\n") || "NO LOGS YET.";
    doc = { key: `log-${upto}`, body: text, instant: true };
  } 

  else if (retuning) {
    doc = { key: "retune", body: "RETUNING...", instant: true };
  } 
  
  else if (entry || notice) {
    doc = { key: "entry", body: notice || `CH ${entry}_`, instant: true };
  } 

  else if (channel === null) {
    doc = { key: curIdx === 0 ? "boot" : `idle-${curIdx}`, body: curIdx === 0 ? BOOT_CLUE : "ENTER CHANNEL" };
  } 
  
  else if (onCurrent && solved) {
    doc = {
      key: `msg-${transmission.id}`,
      body: transmission.message,
      live: isLast ? "[ENT] RESTART" : "[ENT] NEXT",
      signal: true,
    };
  } else if (onCurrent) {
    doc = {
      key: `id-${transmission.id}`,
      body: "STATION ID RECEIVED. ACKNOWLEDGE.",
      live: `${garble(encodeMorse(transmission.keyword), strength, seed)}\nACK: ${ans}_${error ? "\n" + error : ""}`,
      signal: true,
    };
  } else if (ambientHere) {
    doc = {
      key: `amb-${ambientHere.frequency}`,
      body: `${ambientHere.label}\n${ambientHere.lines.join("\n")}`,
      signal: true,
    };
  } 
  
  else if (tunedFreq !== null) {
    doc = { key: `faint-${tunedFreq}`, body: "FAINT CARRIER. NOTHING READABLE.", signal: true };
  } else {
    doc = { key: "search", body: "", instant: true };
  }

  const lcd = useLCD(doc, strength);

  function digit(d: string) {
    if (!on) return;
    setView("live");
    setNotice("");
    setEntry((e) => (e + d).slice(0, 4));
  }

  function letter(c: string) {
    if (!on || !onCurrent || solved) return;
    setView("live");
    setError("");
    setAns((a) => (a + c.toUpperCase()).slice(0, 8));
  }

  function backspace() {
    setNotice("");
    if (entry) setEntry((e) => e.slice(0, -1));
    else if (ans) setAns((a) => a.slice(0, -1));
  }

  function clear() {
    setEntry("");
    setAns("");
    setNotice("");
    setError("");
  }

  function tune() {
    const n = Number(entry);
    setEntry("");
    setView("live");
    if (n < 400 || n > 1200) {
      setNotice("OUT OF BAND");
      return;
    }

    setNotice("");
    setChannel(n);
    setOffset(randomOffset());
    setRetuning(true);

    window.clearTimeout(retuneTimer.current);
    retuneTimer.current = window.setTimeout(() => setRetuning(false), RETUNE_MS);
  }

  function submit() {
    if (!ans || solved) return;
    if (!onCurrent) {
      setNotice("NO LOCK");
      return;
    }

    if (ans.trim().toUpperCase() !== transmission.keyword) {
      setError("INCORRECT.");
      return;
    }
    
    setError("");
    setSolved(true);
  }

  function restart() {
    setCurIdx(0);
    setAns("");
    setError("");
    setSolved(false);
    setChannel(null);
    setEntry("");
    setOffset(0);
    lcd.reset();
  }

  function next() {
    if (isLast) return restart();
    setCurIdx((i) => i + 1);
    setAns("");
    setError("");
    setSolved(false);
    setChannel(null);
    setOffset(0);
  }

  function ok() {
    if (!on) return;
    if (entry) tune();
    else if (solved) next();
    else submit();
  }

  function togglePower() {
    window.clearTimeout(warmTimer.current);
    if (power === "off") {
      setPower("warming");
      warmTimer.current = window.setTimeout(() => setPower("on"), WARMUP_MS);
    } else {
      setPower("off");
      setRefOpen(false);
    }
  }

  useEffect(() => {
    [FRAMES.off, FRAMES.warm, ...FRAMES.lit, ...Object.values(SPRITES)].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    if (!on) return;
    const id = window.setInterval(() => setSeed((s) => s + 1), 300);
    return () => window.clearInterval(id);
  }, [on]);

  useEffect(() => {
    if (!on) return;
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        lcd.scrollBy(-1);
        setSpin((s) => s - DEG_PER_ROW);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        lcd.scrollBy(1);
        setSpin((s) => s + DEG_PER_ROW);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setOffset((o) => clampOff(o - (e.shiftKey ? 50 : 5)));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setOffset((o) => clampOff(o + (e.shiftKey ? 50 : 5)));
      } else if (/^[0-9]$/.test(e.key)) digit(e.key);
      else if (/^[a-zA-Z]$/.test(e.key)) letter(e.key);
      else if (e.key === "Backspace") backspace();
      else if (e.key === "Enter") ok();
      else if (e.key === "Escape") clear();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const frameSrc = power === "off" ? FRAMES.off : power === "warming" ? FRAMES.warm : FRAMES.lit[lit];
  const dcx = DIAL_CENTER.x - BOX.dial.x;
  const dcy = DIAL_CENTER.y - BOX.dial.y;

  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: FRAME.w * scale, height: FRAME.h * scale }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: FRAME.w,
            height: FRAME.h,
            transform: `scale(${scale})`,
            transformOrigin: "0 0",
            imageRendering: "pixelated",
            fontFamily: '"Press Start 2P", monospace',
          }}
        >
          <img
            src={frameSrc}
            width={FRAME.w}
            height={FRAME.h}
            alt=""
            draggable={false}
            style={{ display: "block", imageRendering: "pixelated" }}
          />

          {on && (
            <div
              onClick={lcd.skip}
              style={{
                ...abs(BOX.lcd),
                boxSizing: "border-box",
                padding: "4px 40px",
                fontSize: 8,
                lineHeight: "12px",
                color: "#0b2a12",
                whiteSpace: "pre",
                overflow: "hidden",
                cursor: "pointer",
              }}
            >
              {lcd.rows.map((r, i) => (
                <div key={i} style={{ height: 12 }}>
                  {r}
                </div>
              ))}
            </div>
          )}

          {on && (
            <svg
              width={FRAME.w}
              height={FRAME.h}
              shapeRendering="crispEdges"
              style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
            >
              <g transform={`rotate(${needle} ${HUB.x} ${HUB.y})`}>
                <line x1={HUB.x} y1={HUB.y} x2={HUB.x} y2={HUB.y - 38} stroke="#0b2a12" strokeWidth={2} />
              </g>
              <text
                x={HUB.x}
                y={BOX.meter.y + BOX.meter.h - 8}
                textAnchor="middle"
                fontFamily='"Press Start 2P", monospace'
                fontSize={8}
                fill="#0b2a12"
              >
                {frequency === null ? "---.-" : (frequency / 10).toFixed(1)}
              </text>
            </svg>
          )}

          <Scope box={BOX.scope} strength={strength} on={on} live={view === "live"} />

          <Rotary
            box={BOX.dial}
            value={offset}
            min={-SPAN}
            max={SPAN}
            perDeg={SPAN / DIAL_DEG}
            onChange={setOffset}
            label="Fine tuning"
            disabled={!on}
          >
            {(deg) =>
              on ? (
                <svg width={BOX.dial.w} height={BOX.dial.h} shapeRendering="crispEdges" style={{ display: "block" }}>
                  <g transform={`rotate(${deg} ${dcx} ${dcy})`}>
                    <line x1={dcx} y1={dcy - 12} x2={dcx} y2={dcy - 46} stroke="#d6a65d" strokeWidth={3} />
                  </g>
                </svg>
              ) : null
            }
          </Rotary>

          <Rotary
            box={BOX.knob}
            value={lcd.pos}
            min={0}
            max={lcd.maxScroll}
            perDeg={1 / DEG_PER_ROW}
            onChange={lcd.scrollTo}
            onTurn={(d) => setSpin((s) => s + d)}
            label="Scroll display"
            disabled={!on}
          >
            {(deg) =>
              on ? (
                <img
                  src={SPRITES.knob}
                  width={BOX.knob.w}
                  height={BOX.knob.h}
                  alt=""
                  draggable={false}
                  style={{
                    display: "block",
                    imageRendering: "pixelated",
                    transform: `rotate(${Math.round(spin / 15) * 15}deg)`,
                  }}
                />
              ) : null
            }
          </Rotary>

          {view === "log" && (
            <img
              src={SPRITES.toggleDown}
              alt=""
              style={{ position: "absolute", left: BOX.toggle.x, top: BOX.toggle.y, imageRendering: "pixelated", pointerEvents: "none" }}
            />
          )}
          {refOpen && (
            <img
              src={SPRITES.refOpen}
              alt=""
              style={{ position: "absolute", left: REF_OPEN_AT.x, top: REF_OPEN_AT.y, imageRendering: "pixelated", pointerEvents: "none" }}
            />
          )}
          {pressed && (
            <img
              src={SPRITES.redPressed}
              alt=""
              style={{ position: "absolute", left: BOX.red.x, top: BOX.red.y, imageRendering: "pixelated", pointerEvents: "none" }}
            />
          )}

          <button className="hit" aria-label="Power" onMouseDown={noFocus} onClick={togglePower} style={abs(BOX.power)} />
          <button
            className="hit"
            aria-label="Live / log"
            disabled={!on}
            onMouseDown={noFocus}
            onClick={() => setView((v) => (v === "live" ? "log" : "live"))}
            style={abs(BOX.toggle)}
          />
          <button
            className="hit"
            aria-label="Morse reference"
            disabled={!on}
            onMouseDown={noFocus}
            onClick={() => setRefOpen((o) => !o)}
            style={abs(BOX.ref)}
          />
          <button
            className="hit"
            aria-label="Acknowledge"
            disabled={!on}
            onMouseDown={noFocus}
            onPointerDown={() => setPressed(true)}
            onPointerUp={() => {
              setPressed(false);
              ok();
            }}
            onPointerLeave={() => setPressed(false)}
            style={abs(BOX.red)}
          />
          <div
            style={{
              ...abs(BOX.keypad),
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridTemplateRows: "repeat(4, 1fr)",
            }}
          >
            {KEYS.map((k) => (
              <button
                key={k}
                className="key"
                aria-label={k}
                disabled={!on}
                onMouseDown={noFocus}
                onClick={() => (k === "CLR" ? clear() : k === "ENT" ? ok() : digit(k))}
              />
            ))}
          </div>

          {on && refOpen && <RefPanel />}
        </div>
      </div>
    </div>
  );
}