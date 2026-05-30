# 🎸 Chordly - Web Guitar Tuner

Chordly is a highly accurate, real-time, browser-based guitar tuner built with React and the Web Audio API.

## Features

- **Real-Time Pitch Detection:** Employs a mathematically robust time-domain **YIN Pitch Detection Algorithm** to track the exact fundamental frequency of your guitar strings.
- **Sub-Cent Accuracy:** Employs parabolic interpolation to estimate the true pitch period between discrete time-sample bins.
- **Noise Gate:** Automatically ignores background hum and room noise with a built-in root-mean-square (RMS) energy threshold, keeping the tuner UI rock-steady.
- **Octave & Harmonic Rejection:** Intelligently rejects overtones and harmonics (via YIN's cumulative mean normalized difference and absolute thresholding) that typically trick simple FFT-based tuners.
- **Responsive UI:** Built with Tailwind CSS and Framer Motion for a smooth, premium hardware-like feel.

## The Engineering Story & YIN Algorithm

Building a web-based tuner is a complex Digital Signal Processing (DSP) challenge. Our initial implementation used a standard Fast Fourier Transform (FFT) approach, which suffered from poor low-frequency resolution (which is especially bad for the Low E string, at ~82.41 Hz) and frequently locked onto incorrect harmonics or background room noise.

To solve this, we implemented a full **YIN Pitch Detection Algorithm** (developed by Alain de Cheveigné and Hideki Kawahara), which operates in the time-domain. Rather than calculating frequency bins, YIN tracks the periodicity of the audio signal using a highly robust autocorrelation derivative.

Our implementation executes the following core steps:

1. **RMS Noise Gate:** First, the root-mean-square (RMS) energy of the buffer is computed. If it falls below a threshold ($0.01$), the algorithm early-returns to avoid trying to detect pitch in silence or background noise.
2. **Difference Function:** We calculate the difference function $d_t(\tau)$ for a range of time-lags ($\tau$) corresponding to guitar frequencies ($60\text{ Hz}$ to $1000\text{ Hz}$):
   $$d_t(\tau) = \sum_{i=1}^{W/2} (x_i - x_{i+\tau})^2$$
3. **Cumulative Mean Normalized Difference Function:** To prevent the algorithm from constantly locking onto the first formant or higher harmonics, we normalize the difference function:
   $$d'_t(\tau) = \begin{cases} 1 & \text{if } \tau = 0 \\ \frac{d_t(\tau)}{\frac{1}{\tau} \sum_{j=1}^{\tau} d_t(j)} & \text{otherwise} \end{cases}$$
4. **Absolute Thresholding:** We search for the first local minimum that dips below an absolute threshold of $0.1$. This avoids choosing a deeper sub-harmonic minimum at double the true period (preventing octave-halving errors).
5. **Parabolic Interpolation:** Because the discrete time-domain samples limit frequency resolution, we fit a parabola over the three samples surrounding the selected local minimum. This gives us sub-sample accuracy, enabling sub-cent tuning precision.

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
- **Styling:** Tailwind CSS v4, Framer Motion, clsx, tailwind-merge
- **Icons:** Lucide React
- **Audio Processing:** Native Web Audio API (`AudioContext`, `AnalyserNode`)

## License

MIT
