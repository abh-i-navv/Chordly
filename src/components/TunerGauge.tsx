import { motion } from "framer-motion";
import { useMemo } from "react";

interface TunerGaugeProps {
  cents: number;
  isInTune: boolean;
  detectedFrequency: number;
}

export function TunerGauge({ cents, isInTune, detectedFrequency }: TunerGaugeProps) {
  const clampedCents = Math.max(-50, Math.min(50, cents));

  // Map cents (-50 to 50) to angle (-90 to 90 degrees)
  const needleAngle = (clampedCents / 50) * 90;

  // Dynamic color based on deviation
  const getColor = () => {
    const absCents = Math.abs(clampedCents);
    if (absCents <= 5) return { main: "#10b981", glow: "rgba(16,185,129,0.6)" };
    if (absCents <= 15) return { main: "#34d399", glow: "rgba(52,211,153,0.4)" };
    if (absCents <= 30) return { main: "#f59e0b", glow: "rgba(245,158,11,0.4)" };
    return { main: "#ef4444", glow: "rgba(239,68,68,0.4)" };
  };

  const color = getColor();

  // Generate tick marks
  const ticks = useMemo(() => {
    const result = [];
    for (let i = -50; i <= 50; i += 5) {
      const angle = (i / 50) * 90;
      const isMajor = i % 25 === 0;
      const isCenter = i === 0;
      const radians = ((angle - 90) * Math.PI) / 180;

      const innerR = isCenter ? 100 : isMajor ? 105 : 110;
      const outerR = 120;

      const x1 = 150 + innerR * Math.cos(radians);
      const y1 = 150 + innerR * Math.sin(radians);
      const x2 = 150 + outerR * Math.cos(radians);
      const y2 = 150 + outerR * Math.sin(radians);

      result.push({
        key: i,
        x1, y1, x2, y2,
        isMajor,
        isCenter,
        strokeWidth: isCenter ? 2.5 : isMajor ? 1.8 : 0.8,
        opacity: isCenter ? 1 : isMajor ? 0.6 : 0.25,
      });
    }
    return result;
  }, []);

  // Arc path for the gauge track
  const arcPath = useMemo(() => {
    const r = 115;
    const startAngle = -180;
    const endAngle = 0;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = 150 + r * Math.cos(startRad);
    const y1 = 150 + r * Math.sin(startRad);
    const x2 = 150 + r * Math.cos(endRad);
    const y2 = 150 + r * Math.sin(endRad);
    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
  }, []);

  // Tick labels
  const labels = useMemo(() => {
    return [-50, -25, 0, 25, 50].map((val) => {
      const angle = (val / 50) * 90;
      const radians = ((angle - 90) * Math.PI) / 180;
      const r = 132;
      return {
        val,
        x: 150 + r * Math.cos(radians),
        y: 150 + r * Math.sin(radians),
      };
    });
  }, []);

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <svg viewBox="0 0 300 185" className="w-full drop-shadow-2xl">
        <defs>
          {/* Glow filter for the needle */}
          <filter id="needleGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradient for the arc track */}
          <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
            <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.5" />
            <stop offset="65%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.3" />
          </linearGradient>

          {/* In-tune glow */}
          <filter id="inTuneGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background arc track */}
        <path
          d={arcPath}
          fill="none"
          stroke="url(#arcGradient)"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Subtle inner arc */}
        <path
          d={arcPath}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="24"
          strokeLinecap="round"
        />

        {/* Tick marks */}
        {ticks.map((tick) => (
          <line
            key={tick.key}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={tick.isCenter ? "#ffffff" : "rgba(255,255,255,0.5)"}
            strokeWidth={tick.strokeWidth}
            opacity={tick.opacity}
            strokeLinecap="round"
          />
        ))}

        {/* Tick labels */}
        {labels.map((label) => (
          <text
            key={label.val}
            x={label.x}
            y={label.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="rgba(255,255,255,0.3)"
            fontSize="8"
            fontFamily="Inter, sans-serif"
          >
            {label.val === 0 ? "0" : label.val > 0 ? `+${label.val}` : label.val}
          </text>
        ))}

        {/* FLAT / SHARP labels */}
        <text
          x="28"
          y="155"
          textAnchor="middle"
          fill="rgba(255,255,255,0.2)"
          fontSize="8"
          fontFamily="Inter, sans-serif"
          letterSpacing="1.5"
        >
          FLAT
        </text>
        <text
          x="272"
          y="155"
          textAnchor="middle"
          fill="rgba(255,255,255,0.2)"
          fontSize="8"
          fontFamily="Inter, sans-serif"
          letterSpacing="1.5"
        >
          SHARP
        </text>

        {/* Center pivot dot */}
        <circle
          cx="150"
          cy="150"
          r="6"
          fill="#18181c"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
        />

        {/* In-tune glow ring */}
        {isInTune && detectedFrequency > 0 && (
          <motion.circle
            cx="150"
            cy="150"
            r="8"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            filter="url(#inTuneGlow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Needle */}
        <motion.g
          filter="url(#needleGlow)"
          animate={{ rotate: needleAngle }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 14,
            mass: 0.8,
          }}
          style={{ originX: "150px", originY: "150px" }}
        >
          {/* Needle shadow */}
          <line
            x1="150"
            y1="150"
            x2="150"
            y2="38"
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Needle body */}
          <line
            x1="150"
            y1="148"
            x2="150"
            y2="40"
            stroke={color.main}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Needle tip glow */}
          <circle
            cx="150"
            cy="40"
            r="3"
            fill={color.main}
            opacity="0.8"
          />
        </motion.g>

        {/* Center cap */}
        <circle
          cx="150"
          cy="150"
          r="4"
          fill={color.main}
        />
      </svg>
    </div>
  );
}
