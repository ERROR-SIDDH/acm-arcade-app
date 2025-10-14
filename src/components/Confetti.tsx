import { motion } from 'framer-motion';
import { useMemo } from 'react';
const ConfettiPiece = ({ x, y, rotation, color }: { x: number; y: number; rotation: number; color: string }) => {
  const duration = useMemo(() => Math.random() * 2 + 3, []); // 3-5 seconds fall time
  const delay = useMemo(() => Math.random() * 2, []); // Staggered start
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        backgroundColor: color,
        width: '8px',
        height: '16px',
        opacity: 0,
        rotate: rotation,
      }}
      animate={{
        top: '110%',
        x: `${Math.random() * 200 - 100}px`, // Horizontal drift
        rotate: rotation + (Math.random() > 0.5 ? 1 : -1) * 360 * 2,
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration,
        delay,
        ease: 'linear',
      }}
    />
  );
};
export const Confetti = () => {
  const colors = useMemo(() => ['#4F46E5', '#FBBF24', '#F472B6', '#34D399', '#60A5FA'], []);
  const numPieces = 100;
  const pieces = useMemo(() => {
    return Array.from({ length: numPieces }).map((_, index) => ({
      id: index,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20, // Start above the screen
      rotation: Math.random() * 360,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, [colors]);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map(({ id, x, y, rotation, color }) => (
        <ConfettiPiece key={id} x={x} y={y} rotation={rotation} color={color} />
      ))}
    </div>
  );
};