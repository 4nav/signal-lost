import { useEffect, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent,} from "react";
import { transmissions, BOOT_CLUE } from "./data/transmissions";
import { ambient } from "./data/stations";
import { getStrengthNearest, getNearestDistance, isSignalLocked, litCount, driftOffset, LOCK_RELEASE, RANGE, SPAN } from "./utils/signal";
import { encodeMorse } from "./utils/morse";
import { garble } from "./utils/text";
import { useLCD, type LCDDoc } from "./hooks/useLCD";
import { BOX, FRAME, FRAMES, SPRITES, HUB, DIAL_CENTER, REF_OPEN_AT, type Box } from "./radio/layout";
import Rotary from "./components/rotary";
import {Scope} from "./components/scope";
import RefPanel from "./components/RefPanel";
import { hints } from "./data/hints";
import Tour from "./components/Tour";
import { TOUR } from "./radio/tour";
import Intro from "./components/Intro";

const RETUNE_MS = 1500;
const WARMUP_MS = 800;
const DEG_PER_ROW = 24; 
const DIAL_DEG = 270;   
const KEYS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "CLR", "9", "ENT"];

const STORY_REACH = 100;
const LOCKOUT_MS = 6000;
const MIN_VERIFY = 70;
const WAIT_MS = 15000;

type Station = { base: number; freq: number };

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
const randomBias = () => (Math.random() * 2 - 1)* 280;
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

const mmss = (ms: number) => {
  const s= Math.floor(ms / 1000);
  return `${String(Math.floor(s/60)).padStart(2, "0")}: ${String(s%60).padStart(2, "0")}`;
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
  const [bias, setBias] = useState(0);

  const [lockout, setLockout] = useState(false);
  const [strikes, setStrikes] = useState(0);
  const lockTimer = useRef<number | undefined>(undefined);

  const [clock, setClock] = useState(0);
  const [drift0, setDrift0] = useState(0);
  const [phase, setPhase] = useState(0);
  const [held, setHeld] = useState<number | null>(null);

  const [hintLevel, setHintLevel] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  const retuneTimer = useRef<number | undefined>(undefined);
  const warmTimer = useRef<number | undefined>(undefined);

  const [endPhase, setEndPhase] = useState<null | "wait" | "replay" | "card" | "off">(null);
  const [startedAt,setStartedAt] = useState<number | null>(null);
  const [playMs, setPlayMs] = useState(0);
  const [tour, setTour] = useState<number | null>(null);
  const [intro, setIntro] = useState(true);

  const on = power === "on";
  const transmission = transmissions[curIdx];
  const isLast = curIdx === transmissions.length - 1;
  const finale = solved && isLast;
  const shownHints = hints[transmission.id].slice(0, hintLevel);

  const frequency = channel === null || retuning ? null : channel * 10 + offset + bias;
  const driftNow = driftOffset(transmission.drift, (clock - drift0) / 1000, phase);
  const visible: Station[] = channel === null ? [] : [...transmissions.filter((t) => Math.abs(t.frequency - channel * 10) <= STORY_REACH).map((t) => ({ 
    base: t.frequency,
    freq: t.id === transmission.id ? t.frequency + driftNow : t.frequency,
  })), ...ambient.map((a) => ({ base: a.frequency, freq: a.frequency })),];
  const freqs = visible.map((v) => v.freq);

  const live = on && frequency !== null;
  const strength = live ? getStrengthNearest(frequency, freqs) : 0;
  
  const hit = live? visible.find((v) => isSignalLocked(frequency, v.freq)): undefined;
  const stuck = live && held !== null?visible.find((v)=> v.base === held && Math.abs(frequency - v.freq) <= LOCK_RELEASE):undefined;
  const tunedBase = (stuck ?? hit)?.base ?? null;

  const lit = live ? litCount(getNearestDistance(frequency, freqs), tunedBase !== null) : 0;
  const litShown = finale ? 5 : lit;
  const onCurrent = tunedBase !== null && tunedBase === transmission.frequency;
  const ambientHere = tunedBase !== null ? ambient.find((a) => a.frequency === tunedBase) : undefined;


  const nearest = live ? visible.reduce((b, f) => (Math.abs(f.freq - frequency) < Math.abs(b.freq - frequency) ? f : b)) : null;
  const err = live && nearest !== null ? nearest.freq - frequency : null;
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

  else if(lockout) {
    doc = {
      key: `lockout-${strikes}`,
      body: "INTRUDER DETECTED.\nCHANNEL CLOSED.\nTRANSMISSION FAILED.",
      instant: true,
    };
  }

  else if (retuning) {
    doc = { 
      key: "retune", 
      body: "RETUNING...", 
      instant: true 
    };
  } 
  
  else if(endPhase === "replay" || endPhase === "card"){
    doc = {
      key: "loop-1",
      body: transmissions[0].message
    }
  }
  
  else if (entry || notice) {
    doc = { 
      key: "entry", 
      body: notice || `CH ${entry}_`, 
      instant: true 
    };
  } 
  
  else if(solved){
    doc ={
      key: `msg-${transmission.id}`,
      body: transmission.message,
      live: isLast? undefined : "[ENT] NEXT",
    }
  }

  else if (channel === null) {
    doc = { 
      key: curIdx === 0 ? "boot" : `idle-${curIdx}`, 
      body: curIdx === 0 ? BOOT_CLUE : "ENTER CHANNEL" 
    };
  } 
  
   else if (onCurrent) {
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
  
  else if (tunedBase !== null) {
    doc = { key: `faint-${tunedBase}`, body: "FAINT CARRIER. NOTHING READABLE.", signal: true };
  } else {
    doc = { key: "search", body: "", instant: true };
  }

  const lcd = useLCD(doc, strength);

  function digit(d: string) {
    if (!on || lockout || endPhase) return;
    setView("live");
    setNotice("");
    setEntry((e) => (e + d).slice(0, 4));
  }

  function revealHint(){
    if(hintLevel >= 3 || solved)return;
    setHintLevel((h) => h + 1);
    setHintsUsed((h) => h + 1);
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
    const b = randomBias();
    setBias(b);
    const now = performance.now();
    setClock(now);
    setDrift0(now);
    setPhase(Math.random() * Math.PI * 2);
    setHeld(null);
    setOffset(randomOffset() - b);
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
      if(strength < MIN_VERIFY){
        setError("SIGNAL TOO WEAK");
        return;
      } 
      setStrikes((s) => s + 1);
      setLockout(true);
      setChannel(null);
      setOffset(0);
      setBias(0);
      setAns("");
      setError("");
      window.clearTimeout(lockTimer.current);
      lockTimer.current = window.setTimeout(() => setLockout(false), LOCKOUT_MS);
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
    setBias(0);
    setHeld(null);
    setLockout(false);
    setStrikes(0);
    setHintLevel(0);
    setHintsUsed(0);
    setEndPhase(null);
    setStartedAt(null);
    setPlayMs(0);
    setView("live");
    setRefOpen(false);
    setPower("off");
    setTour(null);
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
    setHintLevel(0);
  }

  function ok() {
    if (!on || lockout) return;
    if (endPhase === "card") return restart();
    if(endPhase)return;
    if (entry) tune();
    else if (solved) next();
    else submit();
  }

  function endTour() {
    setTour(null);
    try{
      localStorage.setItem("sl-tour", "1");
    } catch{

    }
  }

  function nextTour(){
    if(tour === null)return;
    if(tour >= TOUR.length - 1)endTour();
    else setTour(tour + 1);
  }

  function togglePower() {
    window.clearTimeout(warmTimer.current);
    if (power === "off") {
      if (endPhase) return;
      if(startedAt === null)setStartedAt(Date.now());
      setPower("warming");
      warmTimer.current = window.setTimeout(() => setPower("on"), WARMUP_MS);
    } else {
      if(finale && (endPhase === null || endPhase === "wait" || endPhase === "replay")){
        setEndPhase("off");
      }
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
    setHeld(tunedBase);
  }, [tunedBase]);

  useEffect(() => {
    if(!on || channel === null || retuning || transmission.drift === 0)return;
    const id = window.setInterval(() => setClock(performance.now()), 33);
    return () => window.clearInterval(id);
  }, [on, channel, retuning, transmission.drift]);

  useEffect(() => {
    if(!finale || !lcd.done || endPhase !== null)return;
    setEndPhase("wait");
    if(startedAt !== null)setPlayMs(Date.now() - startedAt);
  }, [finale, lcd.done, endPhase, startedAt]);

  useEffect(() => {
    if(endPhase !== "wait")return;
    const id = window.setTimeout(() => {
      setView("live");
      setEndPhase("replay");
      setChannel(417);
      setOffset(0);
      setBias(0);
      setHeld(null);
      setRetuning(true);
      window.clearTimeout(retuneTimer.current);
      retuneTimer.current= window.setTimeout(() => setRetuning(false), RETUNE_MS);
    }, WAIT_MS);
    return () => window.clearTimeout(id);
  }, [endPhase]);

  useEffect(() => {
    if(endPhase !== "replay" || retuning || !lcd.done)return;
    const id = window.setTimeout(() => setEndPhase("card"), 3000);
    return () => window.clearTimeout(id);
  }, [endPhase, retuning, lcd.done]);

  useEffect(() => {
    if(endPhase !== "off")return;
    const onKey = (e:KeyboardEvent) => {
      if(e.key === "Enter")restart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if(power !== "on")return;
    try{
      if(localStorage.getItem("sl-tour") === "1")return;
    } catch{

    }
    setTour(0);
  }, [power]);

  useEffect(() => {
    if (!on) return;

    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if(tour !== null){
        if(e.key === "Enter" || e.key === "ArrowRight"){
          e.preventDefault();
          nextTour();
        }
        else if(e.key === "Escape"){
          e.preventDefault();
          endTour();
        }
        return;
      }

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

  const frameSrc = power === "off" ? FRAMES.off : power === "warming" ? FRAMES.warm : FRAMES.lit[litShown];
  const dcx = DIAL_CENTER.x - BOX.dial.x;
  const dcy = DIAL_CENTER.y - BOX.dial.y;

  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {intro && <Intro onDone={() => setIntro(false)} />}
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
              <g transform={`rotate(${finale? 0:needle} ${HUB.x} ${HUB.y})`}>
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

          <Scope box={BOX.scope} strength={finale? 100: strength} on={on} live={view === "live" && !lockout} />

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
            {() =>
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

          {on && refOpen && (
            <RefPanel hints={shownHints} canReveal={hintLevel < 3 && !solved} onReveal={revealHint} onTour={() => {setRefOpen(false);setTour(0);}}/>
          )}

          {(endPhase === "card" || endPhase === "off") && (
            <div
              style = {{
                position: "absolute",
                inset: 0,
                background: "#000",
                display: "flex",
                flexDirection: "column",
                alignItems: "center", 
                justifyContent: "center",
                gap: 20,
                color: "#8ee6a0",
                opacity: 0,
                animation: `endFade 2.5s ease ${endPhase === "off" ? "1.2s" : "0s"} forwards`,
              }}
              >
                <div style = {{fontSize: 16}}>
                  {endPhase === "card" ? "THE LAST BROADCAST" : "SIGNAL LOST."}
                </div>
                <div style = {{fontSize: 8, color: "#456c4b"}}>
                  {endPhase === "card" ? `TUNED IN ${mmss(playMs)}. WRONG ANSWERS: ${strikes}. HINTS: ${hintsUsed}.`: "SOMEWHERE, A VOICE IS STILL CALLING."}
                </div>

                <button
                  onClick={restart}
                  style={{
                    background: "none",
                    border: "1px solid #456c4b",
                    color: "#8ee6a0",
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: 8,
                    padding: "6px, 100px",
                    cursor: "pointer",
                  }}
                >
                  [ENT] {endPhase === "card" ? "PLAY AGAIN" : "TRY AGAIN"}
                </button>
              </div>
           )}
           {on && tour !== null && (
            <Tour step={tour} onNext={nextTour} onSkip={endTour}/>
           )}
        </div>
      </div>
    </div>
  );
}