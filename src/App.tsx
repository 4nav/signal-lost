import { useState } from "react";
import { transmissions } from "./data/transmissions";
import { getSignalStrength, isSignalLocked } from "./utils/signal";
import Knob from "./components/knob";

export default function App() {
  const [frequency, setFrequency] = useState(8000);
  const [curIdx] = useState(0);

  const transmission = transmissions[curIdx];
  const strength = getSignalStrength(frequency, transmission.frequency);
  const locked = isSignalLocked(frequency, transmission.frequency);

  return (
    <div>
      <h1>SIGNAL LOST</h1>
      <p>Hint: {transmission.hint}</p>

      <Knob frequency={frequency} onChange={setFrequency} />

      <p>{frequency.toLocaleString()} kHz</p>
      <p>Signal: {strength}%</p>
      <p>{locked ? "LOCKED" : "SEARCHING..."}</p>
    </div>
  );
}