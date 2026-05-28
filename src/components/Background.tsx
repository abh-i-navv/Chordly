import { motion } from "framer-motion";

interface BackgroundProps {
  isInTune: boolean;
  isListening: boolean;
}

export function Background({ isInTune, isListening }: BackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base dark gradient */}
      <div className="absolute inset-0 bg-[#07070a]" />

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundSize: "40px 40px",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
        }}
      />

      {/* Primary ambient glow — reacts to tune state */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: isInTune
            ? "radial-gradient(ellipse 60% 50% at 50% -5%, rgba(16,185,129,0.15) 0%, transparent 70%)"
            : isListening
              ? "radial-gradient(ellipse 60% 50% at 50% -5%, rgba(245,158,11,0.08) 0%, transparent 70%)"
              : "radial-gradient(ellipse 60% 50% at 50% -5%, rgba(255,255,255,0.03) 0%, transparent 70%)",
        }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />

      {/* Secondary side glows */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: isInTune ? 1 : 0,
        }}
        transition={{ duration: 1.5 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 80%, rgba(16,185,129,0.04) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(16,185,129,0.04) 0%, transparent 40%)",
          }}
        />
      </motion.div>

      {/* Noise/grain overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
