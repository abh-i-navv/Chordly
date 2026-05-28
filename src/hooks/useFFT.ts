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

        function yin(buf: Float32Array, sampleRate: number) {
            const SIZE = buf.length;
            const halfBufferSize = Math.floor(SIZE / 2);

            let rms = 0;
            for (let i = 0; i < SIZE; i++) {
                rms += buf[i] * buf[i];
            }
            rms = Math.sqrt(rms / SIZE);

            // Noise gate
            if (rms < 0.01) return -1;

            // Pitch constraints for guitar
            const MIN_FREQ = 60;
            const MAX_FREQ = 1000;

            const MIN_PERIOD = Math.floor(sampleRate / MAX_FREQ);
            const MAX_PERIOD = Math.floor(sampleRate / MIN_FREQ);

            // 1. Difference function
            const difference = new Float32Array(MAX_PERIOD);
            for (let tau = 0; tau < MAX_PERIOD; tau++) {
                let sum = 0;
                for (let i = 0; i < halfBufferSize; i++) {
                    const delta = buf[i] - buf[i + tau];
                    sum += delta * delta;
                }
                difference[tau] = sum;
            }

            // 2. Cumulative mean normalized difference function
            const normalized = new Float32Array(MAX_PERIOD);
            normalized[0] = 1;
            let runningSum = 0;
            for (let tau = 1; tau < MAX_PERIOD; tau++) {
                runningSum += difference[tau];
                normalized[tau] = runningSum === 0 ? 1 : (difference[tau] * tau) / runningSum;
            }

            // 3. Absolute thresholding
            const THRESHOLD = 0.07;
            let tauEstimate = -1;

            for (let tau = MIN_PERIOD; tau < MAX_PERIOD; tau++) {
                if (normalized[tau] < THRESHOLD) {
                    while (tau + 1 < MAX_PERIOD && normalized[tau + 1] < normalized[tau]) {
                        tau++;
                    }
                    tauEstimate = tau;
                    break;
                }
            }

            if (tauEstimate === -1) {
                return -1
            }

            // 4. Parabolic interpolation
            let betterTau = tauEstimate;
            if (tauEstimate > 0 && tauEstimate < MAX_PERIOD - 1) {
                const x0 = normalized[tauEstimate - 1];
                const x1 = normalized[tauEstimate];
                const x2 = normalized[tauEstimate + 1];

                const a = (x0 + x2 - 2 * x1);
                const b = (x2 - x0) / 2;

                if (a !== 0) {
                    betterTau = tauEstimate - b / (2 * a);
                }
            }

            return sampleRate / betterTau;
        }

        function update() {
            analyser!.getFloatTimeDomainData(dataArray);

            const min = targetFrequency * 0.8
            const max = targetFrequency * 1.2
            const freq = yin(dataArray, sampleRate);

            // if (freq < min || freq > max) {
            //     return -1
            // }

            if (freq !== -1) {
                // realistic guitar frequency
                if (freq > 60 && freq < 1000) {
                    const smoothed = previousFrequency === 0
                        ? freq
                        : previousFrequency * 0.75 + freq * 0.25;
                    previousFrequency = smoothed;
                    setDetectedFrequency(Number(smoothed.toFixed(2)));
                }
            } else {
                previousFrequency = previousFrequency * 0.95;
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