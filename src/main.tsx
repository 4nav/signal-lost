import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
  import { transmissions } from "./data/transmissions";
import { encodeMorse, decodeMorse } from "./utils/morse";
import { getSignalStrength } from "./utils/signal";

console.log(transmissions);

transmissions.forEach((t) => {
  const morse = encodeMorse(t.keyword);
  console.log(t.keyword, morse, decodeMorse(morse) === t.keyword);
});

[0, 30, 100, 300, 600, 1000].forEach((d) => console.log(`${d} kHz away`, getSignalStrength(4170 + d, 4170)));
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
