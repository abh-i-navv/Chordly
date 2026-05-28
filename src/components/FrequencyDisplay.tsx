import { motion, AnimatePresence } from "framer-motion";

interface FrequencyDisplayProps {
  targetNote: string;
  targetFreq: number;
  detectedFrequency: number;
  cents: number;
  isInTune: boolean;
}

export function FrequencyDisplay({
  targetNote,
  targetFreq,
  detectedFrequency,
  cents,
  isInTune,
}: FrequencyDisplayProps) {
  const getStatusConfig = () => {
    if (detectedFrequency <= 0) {
      return {
        label: "PLAY A NOTE",
        color: "text-zinc-500",
        bgColor: "bg-zinc-800/50",
        borderColor: "border-zinc-700/30",
        glowColor: "",
      };
    }
    if (isInTune) {
      return {
        label: "IN TUNE",
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
        glowColor: "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
      };
    }
    if (cents < 0) {
      return {
        label: "TOO LOW",
        color: "text-amber-400",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20",
        glowColor: "",
      };
    }
    return {
      label: "TOO HIGH",
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
      glowColor: "",
    };
  };

  const status = getStatusConfig();

  return (
    <div className="text-center space-y-5">
      {/* Target note display */}
      <div>
        <p className="text-[10px] font-medium tracking-[0.25em] text-zinc-500 uppercase mb-2">
          Target
        </p>
        <div className="flex items-baseline justify-center gap-3">
          <motion.span
            className="text-5xl sm:text-6xl font-display font-bold text-white"
            key={targetNote}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {targetNote}
          </motion.span>
          <span className="text-lg text-zinc-500 font-light">
            {targetFreq} Hz
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 px-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-700/50 to-transparent" />
      </div>

      {/* Detected frequency */}
      <div>
        <p className="text-[10px] font-medium tracking-[0.25em] text-zinc-500 uppercase mb-2">
          Detected
        </p>
        <motion.p
          className="text-3xl sm:text-4xl font-display font-semibold text-zinc-200 tabular-nums"
          key={detectedFrequency}
          initial={false}
          animate={{ opacity: 1 }}
        >
          {detectedFrequency > 0 ? (
            <>
              {detectedFrequency}
              <span className="text-lg text-zinc-500 ml-1.5 font-light">Hz</span>
            </>
          ) : (
            <span className="text-zinc-600">— —</span>
          )}
        </motion.p>
      </div>

      {/* Cents offset */}
      {detectedFrequency > 0 && (
        <motion.p
          className={`text-lg font-semibold tabular-nums ${
            isInTune ? "text-emerald-400" : cents < 0 ? "text-amber-400" : "text-red-400"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {cents > 0 ? "+" : ""}
          {cents}
          <span className="text-sm font-normal ml-1 opacity-60">cents</span>
        </motion.p>
      )}

      {/* Status badge */}
      <AnimatePresence mode="wait">
        <motion.div
          key={status.label}
          initial={{ opacity: 0, scale: 0.9, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -5 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`
            inline-flex items-center gap-2 px-5 py-2 rounded-full
            text-xs font-bold tracking-[0.2em] uppercase
            border ${status.bgColor} ${status.borderColor} ${status.color} ${status.glowColor}
          `}
        >
          {isInTune && detectedFrequency > 0 && (
            <motion.span
              className="w-2 h-2 rounded-full bg-emerald-400"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
          {status.label}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
