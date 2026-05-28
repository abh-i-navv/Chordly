import { motion } from "framer-motion";

interface StringData {
  note: string;
  freq: number;
}

interface StringSelectorProps {
  strings: StringData[];
  selected: number;
  onSelect: (index: number) => void;
}

export function StringSelector({ strings, selected, onSelect }: StringSelectorProps) {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4">
      {strings.map((string, index) => {
        const isActive = selected === index;
        const stringNumber = strings.length - index;

        return (
          <motion.button
            key={index}
            onClick={() => onSelect(index)}
            className="relative flex flex-col items-center gap-1.5 group"
            whileTap={{ scale: 0.9 }}
          >
            {/* Outer glow ring */}
            <motion.div
              className="absolute -inset-1.5 rounded-full"
              animate={{
                boxShadow: isActive
                  ? "0 0 20px rgba(16,185,129,0.4), 0 0 40px rgba(16,185,129,0.15)"
                  : "0 0 0px rgba(16,185,129,0)",
                scale: isActive ? 1 : 0.85,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />

            {/* Button circle */}
            <motion.div
              className={`
                relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center
                font-display text-lg sm:text-xl font-bold
                border-2 cursor-pointer
                transition-colors duration-300
                ${isActive
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                  : "bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:border-white/[0.18] hover:bg-white/[0.06] hover:text-zinc-200"
                }
              `}
              animate={{
                scale: isActive ? 1.1 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {string.note}

              {/* Active inner ring pulse */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-emerald-400/30"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.div>

            {/* String number label */}
            <span
              className={`
                text-[10px] font-medium tracking-wider transition-colors duration-300
                ${isActive ? "text-emerald-400/70" : "text-zinc-600"}
              `}
            >
              {stringNumber}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
