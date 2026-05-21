import { useEffect, useState } from "react";

export function useFFT(
    analyser: AnalyserNode | null,
    targetFrequency: number
) {
    const [detectedFrequency, setDetectedFrequency] = useState(0);

    useEffect(() => {
        if (!analyser) return;

        analyser.fftSize = 4096;

        const bufferLength = analyser.fftSize;
        const dataArray = new Float32Array(bufferLength);
        const sampleRate = analyser.context.sampleRate;

        let previousFrequency = 0;
        let animationFrameId: number;

        function autoCorrelate(buf: Float32Array, sampleRate: number) {
            let SIZE = buf.length;
            let rms = 0;

            for (let i = 0; i < SIZE; i++) {
                rms += buf[i] * buf[i];
            }
            rms = Math.sqrt(rms / SIZE);
            
            // Noise gate
            if (rms < 0.01) return -1; 

            let MAX_SAMPLES = Math.floor(SIZE / 2);
            let correlations = new Float32Array(MAX_SAMPLES);
            
            for (let offset = 0; offset < MAX_SAMPLES; offset++) {
                let sum = 0;
                for (let i = 0; i < MAX_SAMPLES; i++) {
                    sum += buf[i] * buf[i + offset];
                }
                correlations[offset] = sum;
            }

            // Find first zero crossing
            let d = 0;
            while (d < MAX_SAMPLES && correlations[d] > 0) {
                d++;
            }

            if (d === MAX_SAMPLES) return -1;

            // Find absolute maximum
            let maxval = -1;
            let maxpos = -1;
            for (let i = d; i < MAX_SAMPLES; i++) {
                if (correlations[i] > maxval) {
                    maxval = correlations[i];
                    maxpos = i;
                }
            }

            let T0 = maxpos;

            // Prevent octave errors by checking for earlier peaks
            for (let i = d; i < maxpos; i++) {
                if (correlations[i] > 0.9 * maxval && 
                    correlations[i] > correlations[i-1] && 
                    correlations[i] > correlations[i+1]) {
                    T0 = i;
                    break;
                }
            }

            // Parabolic interpolation
            if (T0 > 0 && T0 < MAX_SAMPLES - 1) {
                let x1 = correlations[T0 - 1];
                let x2 = correlations[T0];
                let x3 = correlations[T0 + 1];
                
                let a = (x1 + x3) - 2 * x2;
                let b = (x3 - x1) / 2;
                if (a !== 0) T0 = T0 - b / (2 * a);
            }

            return sampleRate / T0;
        }

        function update() {
            analyser!.getFloatTimeDomainData(dataArray);

            const freq = autoCorrelate(dataArray, sampleRate);

            if (freq !== -1) {
                // If it's a realistic guitar frequency
                if (freq > 60 && freq < 1000) {
                    const smoothed = previousFrequency === 0 
                        ? freq 
                        : previousFrequency * 0.8 + freq * 0.2;
                    previousFrequency = smoothed;
                    setDetectedFrequency(Number(smoothed.toFixed(2)));
                }
            } else {
                previousFrequency = 0;
            }

            animationFrameId = requestAnimationFrame(update);
        }

        update();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [analyser, targetFrequency]);

    return detectedFrequency;
}