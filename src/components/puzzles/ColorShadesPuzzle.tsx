import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
interface ColorShadesPuzzleProps {
  onComplete: (score: number) => void;
}
export const ColorShadesPuzzle: React.FC<ColorShadesPuzzleProps> = ({ onComplete }) => {
  const [level, setLevel] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const { gridSize, baseColor, oddColor, oddIndex } = useMemo(() => {
    const size = Math.min(level + 1, 7); // Grid size from 2x2 up to 7x7
    const r = Math.floor(Math.random() * 200);
    const g = Math.floor(Math.random() * 200);
    const b = Math.floor(Math.random() * 200);
    const base = `rgb(${r}, ${g}, ${b})`;
    // Difficulty scales by making the color difference smaller
    const diff = Math.max(10, 50 - level * 4);
    const odd = `rgb(${r + diff}, ${g + diff}, ${b + diff})`;
    const index = Math.floor(Math.random() * size * size);
    return { gridSize: size, baseColor: base, oddColor: odd, oddIndex: index };
  }, [level]);
  useEffect(() => {
    setStartTime(Date.now());
  }, []);
  const handleClick = (isOddOne: boolean) => {
    if (isFinished) return;
    if (isOddOne) {
      if (level < 5) { // Play up to 5 levels
        setLevel(prev => prev + 1);
      } else {
        if (startTime) {
          const score = Date.now() - startTime;
          setIsFinished(true);
          onComplete(score);
        }
      }
    } else {
      // Penalty for wrong click
      if (startTime) {
        const score = (Date.now() - startTime) + 3000; // 3 second penalty
        setIsFinished(true);
        onComplete(score);
      }
    }
  };
  return (
    <div className="w-full h-auto md:h-96 bg-muted rounded-2xl flex flex-col items-center justify-center text-center p-4 space-y-4">
      <h3 className="text-xl font-bold">Find the different colored tile!</h3>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, i) => (
          <motion.div
            key={`${level}-${i}`}
            onClick={() => handleClick(i === oddIndex)}
            className="w-12 h-12 md:w-16 md:h-16 rounded-md cursor-pointer"
            style={{ backgroundColor: i === oddIndex ? oddColor : baseColor }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.01 }}
          />
        ))}
      </div>
      {isFinished && <p className="font-bold text-green-500">Done!</p>}
    </div>
  );
};