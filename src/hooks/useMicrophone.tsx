import { useEffect, useRef, useState } from "react";

export function useMicrophone() {
    const [isListening, setIsListening] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);

    const audioCtxRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);

    useEffect(() => {
        async function init() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                const audioCtx = new AudioContext();

                const source = audioCtx.createMediaStreamSource(stream);
                const analyser = audioCtx.createAnalyser();

                analyser.fftSize = 2048;
                source.connect(analyser)

                analyserRef.current = analyser;
                audioCtxRef.current = audioCtx;

                setIsListening(true);

                const dataArray = new Uint8Array(analyser.frequencyBinCount)

                function update() {
                    analyser.getByteTimeDomainData(dataArray)

                    let sum = 0;
                    for (let i = 0; i < dataArray.length; i++) {
                        const normalized = (dataArray[i] - 128) / 128;
                        sum += normalized * normalized;
                    }
                    const rms = Math.sqrt(sum / dataArray.length)

                    setAudioLevel(rms)

                    requestAnimationFrame(update)
                }
                update();
            }
            catch (error) {
                console.log("Access denied", error)
            }
        }

        init();

    }, [])
    return {
        isListening,
        audioLevel,
        analyser: analyserRef.current
    }
}