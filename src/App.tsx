import { useState } from "react";
import { useMicrophone } from "./hooks/useMicrophone";
import { useFFT } from "./hooks/useFFT";
import { Background } from "./components/Background";
import { TunerGauge } from "./components/TunerGauge";
import { StringSelector } from "./components/StringSelector";
import { FrequencyDisplay } from "./components/FrequencyDisplay";
import { MicStatus } from "./components/MicStatus";
import "./App.css";

const STRINGS = [
  { note: "E", freq: 82.41 },
  { note: "A", freq: 110.0 },
  { note: "D", freq: 146.83 },
  { note: "G", freq: 196.0 },
  { note: "B", freq: 246.94 },
  { note: "E", freq: 329.63 },
];

export default function App() {
  const [selected, setSelected] = useState(0);
  const { isListening, audioLevel, analyser, resume } = useMicrophone();

  const targetFrequency = STRINGS[selected].freq;
  const detectedFrequency = useFFT(analyser, targetFrequency);

  const cents =
    detectedFrequency > 0
      ? Math.floor(1200 * Math.log2(detectedFrequency / targetFrequency))
      : 0;

  const isInTune = detectedFrequency > 0 && Math.abs(cents) <= 5;

  const handleStringSelect = (index: number) => {
    setSelected(index);
    resume();
  };

  return (
    <>
      {/* Reactive ambient background */}
      <Background isInTune={isInTune} isListening={isListening} />

      <div className="min-h-screen flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        {/* Header */}
        <header className="mb-8 sm:mb-10 text-center">
          <h1 className="text-4xl sm:text-5xl font-display font-bold logo-shimmer">
            Chordly
          </h1>
          <p className="text-zinc-600 mt-1.5 tracking-[0.35em] text-[10px] sm:text-xs font-medium uppercase">
            Guitar Tuner
          </p>
        </header>

        {/* String Selector */}
        <section className="mb-8 sm:mb-10">
          <StringSelector
            strings={STRINGS}
            selected={selected}
            onSelect={handleStringSelect}
          />
        </section>

        {/* Main Tuner Card */}
        <section
          className={`
            w-full max-w-md glass-card rounded-3xl p-6 sm:p-8
            ${isInTune ? "card-in-tune" : ""}
          `}
        >
          {/* Gauge */}
          <div className="mb-2">
            <TunerGauge
              cents={cents}
              isInTune={isInTune}
              detectedFrequency={detectedFrequency}
            />
          </div>

          {/* Frequency Display */}
          <FrequencyDisplay
            targetNote={STRINGS[selected].note}
            targetFreq={STRINGS[selected].freq}
            detectedFrequency={detectedFrequency}
            cents={cents}
            isInTune={isInTune}
          />
        </section>

        {/* Mic Status Bar */}
        <section className="mt-6 sm:mt-8">
          <MicStatus isListening={isListening} audioLevel={audioLevel} />
        </section>

        {/* Footer */}
        <footer className="mt-auto pt-8">
          <p className="text-zinc-700 text-[10px] tracking-widest">
            BUILT WITH WEB AUDIO API
          </p>
        </footer>
      </div>
    </>
  );
}