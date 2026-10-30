import { useEffect, useState, type SyntheticEvent } from "react";
import { transmissions, BOOT_CLUE } from "./data/transmissions";
import { ambient } from "./data/stations";
import { getStrengthNearest, isSignalLocked } from "./utils/signal";
import { encodeMorse } from "./utils/morse";
import Knob from "./components/knob";
import Notebook from "./components/notebook";

const START_FREQ = 8000;
const allFreqs = [
  ...transmissions.map((t) => t.frequency),
  ...ambient.map((a) => a.frequency),
];

export default function App() {
  const [frequency, setFrequency] = useState(8000);
  const [curIdx, setCurIdx] = useState(0);
  const [ans, setAns] = useState("");
  const [error, setError] = useState("");
  const [solved, setSolved] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2500);
    return () => clearInterval(id);
  }, []);

  const transmission = transmissions[curIdx];
  const isLast = curIdx === transmissions.length - 1;

  const strength = getStrengthNearest(frequency, allFreqs);
  const tunedFreq = allFreqs.find((f) => isSignalLocked(frequency, f)) ?? null;
  const stable = tunedFreq !== null;
  const status = stable ? "LOCKED" : "SEARCHING...";
  const onCurrent = stable && tunedFreq === transmission.frequency;
  const ambientHere = stable ? ambient.find((a) => a.frequency === tunedFreq) : undefined;

  function submit(e: SyntheticEvent){
    e.preventDefault();
    if(!onCurrent)return setError("Signal not Locked");
    if(ans.trim().toUpperCase() !== transmission.keyword){
      return setError("Incorrect. Try Again");
    }
    setError("");
    setSolved(true);
  }

  function next(){
    setCurIdx(curIdx + 1);
    setAns("");
    setError("");
    setSolved(false);
  }

  function restart() {
    setCurIdx(0);
    setAns("");
    setError("");
    setSolved(false);
    setFrequency(START_FREQ);
  }


  return (
    <div>
      <h1>SIGNAL LOST</h1>
      {curIdx === 0 && <p>{BOOT_CLUE}</p>}

      <div>
        {transmissions.slice(0,curIdx).map((t) => (
          <p key={t.id}>
            <strong>LOG {t.id}:</strong> {t.message}
          </p>
        ))}
      </div>

      <Knob frequency={frequency} onChange={setFrequency} />

      <p>CH {Math.round(frequency/10)}</p>
      <p>Signal: {strength}%</p>
      <p>{status}</p>

      {solved ? (
        <div>
          <p>
            <strong>LOG {transmission.id}:</strong> {transmission.message}
          </p>
          {isLast ? (
            <button onClick={restart}> RESTART </button>
          ) : (
            <button onClick={next}>NEXT TRANSMISSION</button>
          )}
        </div>
      ): onCurrent? (
        <>
          <p>STATION ID RECEIVED. ACKNOWLEDGE.</p>
          <p>{encodeMorse(transmission.keyword)}</p>
          <form onSubmit={submit}>
            <input
              value = {ans}
              onChange={(e) => {
                setAns(e.target.value);
                setError("")
              }}
              placeholder="Your Answer.."
            />
            <button type="submit">DECODE</button>
            {error && <p>{error}</p>}
          </form>
        </>
      ): ambientHere?(
        <p>
          <strong>{ambientHere.label}:</strong>{" "}
          {ambientHere.lines[tick % ambientHere.lines.length]}
        </p>
      ): stable ?(
          <p>FAINT CARRIER. NOTHING READABLE.</p>
      ): null}
      <Notebook/>
    </div>
  );
}