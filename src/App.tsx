import { useState } from "react";
import { useMicrophone } from "./hooks/useMicrophone";
import { useFFT } from "./hooks/useFFT";

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

  const targetFrequency = STRINGS[selected].freq
  const detectedFrequency = useFFT(analyser, targetFrequency)

  const cents = detectedFrequency > 0 ?
    Math.floor(1200 * Math.log2(detectedFrequency / targetFrequency)) : 0


  const isInTune = Math.abs(cents) <= 5;

  const tunerColor = isInTune ? "text-green-400" :
    cents < 0 ? "text-red-400" : "text-orange-400";

  const tunerLabel = isInTune ? "IN TUNE" :
    cents < 0 ? "TOO LOW" : "TOO HIGH";

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex flex-col items-center px-6 py-10">

      {/* HEADER */}
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-bold">
          Chordly
        </h1>

        <p className="text-zinc-500 mt-2 tracking-[0.3em] text-sm">
          GUITAR TUNER
        </p>
      </header>

      {/* STRING SELECTOR */}
      <section className="flex gap-3 mb-12 flex-wrap justify-center">

        {STRINGS.map((string, index) => (
          <button
            key={index}
            onClick={() => {
              setSelected(index);
              resume();
            }}
            className={`
              w-14 h-14 rounded-full text-xl font-bold transition-all duration-200
              ${selected === index
                ? "bg-green-500 text-black"
                : "bg-zinc-800 hover:bg-zinc-700"
              }
            `}
          >
            {string.note}
          </button>
        ))}

      </section>

      {/* TUNER DISPLAY */}
      <section className="w-full max-w-md bg-zinc-900 rounded-3xl p-8 border border-zinc-800">

        {/* Current Note */}
        <div className="text-center mb-8">

          <p className="text-zinc-500 text-sm mb-2">
            TARGET NOTE
          </p>

          <h2 className="text-7xl font-bold text-green-400">
            {STRINGS[selected].note}
          </h2>

          <p className="text-zinc-400 mt-2">
            {STRINGS[selected].freq} Hz
          </p>

        </div>

        {/* Meter */}
        <div className="mb-8">

          <div className="flex justify-between text-sm text-zinc-500 mb-2">
            <span>FLAT</span>
            <span>SHARP</span>
          </div>

          <div className="relative h-4 bg-zinc-800 rounded-full overflow-hidden">

            {/* Center Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-white z-10 -translate-x-1/2" />

            {/* Needle */}
            <div
              className="absolute top-0 bottom-0 bg-green-400 transition-all duration-200"
              style={{
                left: `calc(50% + ${cents * 2}px)`,
                width: "4px",
              }}
            />

          </div>

        </div>

        {/* Frequency */}
        <div className="text-center">

          <p className="text-zinc-500 text-sm mb-2">
            DETECTED FREQUENCY
          </p>

          <h3 className="text-4xl font-bold">
            {detectedFrequency > 0 ? `${detectedFrequency} Hz` : "--"}
          </h3>

          <p
            className={`
              mt-4 text-2xl font-semibold
              ${tunerColor}
            `}
          >
            {cents > 0 ? "+" : ""}
            {cents} cents
          </p>

        </div>

      </section>
      <section className="mt-8 text-center">

        <p className="text-zinc-500 mb-2">
          Microphone Status
        </p>

        <p
          className={`font-semibold ${isListening ? "text-green-400" : "text-red-400"
            }`}
        >
          {isListening ? "Listening..." : "Not Connected"}
        </p>

        <div className="w-64 h-4 bg-zinc-800 rounded-full overflow-hidden mt-4">

          <div
            className="h-full bg-green-400 transition-all duration-75"
            style={{
              width: `${Math.min(audioLevel * 500, 100)}%`,
            }}
          />

        </div>

      </section>

    </div>
  );
}