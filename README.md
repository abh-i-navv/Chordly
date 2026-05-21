# 🎸 Chordly - Web Guitar Tuner

Chordly is a highly accurate, real-time, browser-based guitar tuner built with React and the Web Audio API.

## Features

- **Real-Time Pitch Detection:** Uses a mathematically robust True Autocorrelation algorithm (YIN-like) to track the exact fundamental frequency of your guitar strings.
- **Sub-Cent Accuracy:** Employs parabolic interpolation to detect pitches that fall between discrete sample bins.
- **Noise Gate:** Automatically ignores background hum and room noise with a built-in RMS threshold, keeping the tuner UI rock-steady.
- **Octave & Harmonic Rejection:** Intelligently ignores overtones and harmonics that typically trick simple FFT-based tuners.
- **Responsive UI:** Built with Tailwind CSS for a smooth, premium hardware-like feel.

## The Engineering Story

Building a web-based tuner is a complex Digital Signal Processing (DSP) challenge. Our initial implementation used a Fast Fourier Transform (FFT) approach, which suffered from poor low-frequency resolution (bad for the Low E string) and constantly locked onto incorrect harmonics or background noise.

To solve this, we completely ripped out the FFT logic and moved to a **Time-Domain Autocorrelation** algorithm. This maps the raw waveform of your guitar over time and measures its periodicity to find the true pitch, ignoring noise entirely.

## Getting Started

To run Chordly locally:

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
3. **Open in browser:** Navigate to `http://localhost:5173`
4. **Allow Microphone Access:** When prompted, allow the browser to use your microphone. Pluck a string and get tuning!

## Tech Stack

- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Audio Processing:** Native Web Audio API (`AudioContext`, `AnalyserNode`)

## License

MIT
