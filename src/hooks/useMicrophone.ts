import { useEffect, useRef, useState } from "react";

export function useMicrophone() {
    const [isListening, setIsListening] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

    const audioCtxRef = useRef<AudioContext | null>(null);

    const resume = async () => {
        if (audioCtxRef.current) {
            if (audioCtxRef.current.state === "suspended") {
                await audioCtxRef.current.resume();
                console.log("[useMicrophone] AudioContext resumed successfully.");
            }
        }
    };

    useEffect(() => {
        async function init() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                const audioCtx = new AudioContext();

                const source = audioCtx.createMediaStreamSource(stream);
                const analyserNode = audioCtx.createAnalyser();

                analyserNode.fftSize = 2048;
                source.connect(analyserNode);

                audioCtxRef.current = audioCtx;
                setAnalyser(analyserNode);
                setIsListening(true);

                const dataArray = new Uint8Array(analyserNode.frequencyBinCount);

                function update() {
                    if (!analyserNode) return;
                    analyserNode.getByteTimeDomainData(dataArray);

                    let sum = 0;
                    for (let i = 0; i < dataArray.length; i++) {
                        const normalized = (dataArray[i] - 128) / 128;
                        sum += normalized * normalized;
                    }
                    const rms = Math.sqrt(sum / dataArray.length);

                    setAudioLevel(rms);

                    requestAnimationFrame(update);
                }
                update();
            }
            catch (error) {
                console.error("[useMicrophone] Access denied or error during initialization", error);
            }
        }

        init();

        return () => {
            if (audioCtxRef.current) {
                audioCtxRef.current.close();
            }
        };
    }, []);

    return {
        isListening,
        audioLevel,
        analyser,
        resume
    };
}