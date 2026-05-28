import { motion } from "framer-motion";

interface MicStatusProps {
  isListening: boolean;
  audioLevel: number;
}

export function MicStatus({ isListening, audioLevel }: MicStatusProps) {
  // Generate 5 bars with varying heights based on audio level
  const barCount = 5;
  const normalizedLevel = Math.min(audioLevel * 500, 100) / 100;

  return (
    <div className="flex items-center justify-center gap-3">
      {/* Status indicator dot */}
      <div className="flex items-center gap-2">
        <motion.div
          className={`w-2 h-2 rounded-full ${
            isListening ? "bg-emerald-400" : "bg-red-400"
          }`}
          animate={
            isListening
              ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }
              : { scale: 1, opacity: 1 }
          }
          transition={
            isListening
              ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
              : {}
          }
        />
        <span
          className={`text-xs font-medium tracking-wider ${
            isListening ? "text-zinc-400" : "text-red-400/70"
          }`}
        >
          {isListening ? "LISTENING" : "NO MIC"}
        </span>
      </div>

      {/* Vertical separator */}
      <div className="w-px h-5 bg-zinc-700/50" />

      {/* Audio level bars */}
      <div className="flex items-end gap-[3px] h-5">
        {Array.from({ length: barCount }).map((_, i) => {
          // Each bar has a different threshold to create a staggered effect
          const barThreshold = (i + 1) / barCount;
          const barActive = normalizedLevel >= barThreshold * 0.5;
          const barHeight = barActive
            ? Math.max(4, Math.min(20, normalizedLevel * 20 * (1 + i * 0.3)))
            : 4;

          return (
            <motion.div
              key={i}
              className={`w-[3px] rounded-full ${
                barActive
                  ? i >= barCount - 1
                    ? "bg-red-400"
                    : i >= barCount - 2
                      ? "bg-amber-400"
                      : "bg-emerald-400"
                  : "bg-zinc-700"
              }`}
              animate={{
                height: barHeight,
                opacity: barActive ? 0.9 : 0.3,
              }}
              transition={{
                height: { duration: 0.08, ease: "easeOut" },
                opacity: { duration: 0.15 },
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
