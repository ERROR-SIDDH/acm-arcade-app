import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Lightbulb, LightbulbOff } from 'lucide-react';
interface BinarySwitchPuzzleProps {
  onComplete: (score: number) => void;
}
const GRID_SIZE = 3; // 3x3 grid
const toggleLights = (currentLights: boolean[], index: number): boolean[] => {
  const newLights = [...currentLights];
  const row = Math.floor(index / GRID_SIZE);
  const col = index % GRID_SIZE;
  const indicesToToggle = [index]; // The light itself
  if (row > 0) indicesToToggle.push(index - GRID_SIZE); // Top
  if (row < GRID_SIZE - 1) indicesToToggle.push(index + GRID_SIZE); // Bottom
  if (col > 0) indicesToToggle.push(index - 1); // Left
  if (col < GRID_SIZE - 1) indicesToToggle.push(index + 1); // Right
  indicesToToggle.forEach(i => {
    newLights[i] = !newLights[i];
  });
  return newLights;
};
export const BinarySwitchPuzzle: React.FC<BinarySwitchPuzzleProps> = ({ onComplete }) => {
  const [lights, setLights] = useState<boolean[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const initialLights = useMemo(() => {
    // Create a solvable but non-trivial start state
    let board = Array(GRID_SIZE * GRID_SIZE).fill(false);
    const presses = Math.floor(Math.random() * 5) + 3; // 3-7 random presses
    for (let i = 0; i < presses; i++) {
      const randIndex = Math.floor(Math.random() * board.length);
      board = toggleLights(board, randIndex);
    }
    // Ensure it's not already solved
    if (board.every(l => l)) {
        board = toggleLights(board, 0);
    }
    return board;
  }, []);
  useEffect(() => {
    setLights(initialLights);
    setStartTime(Date.now());
  }, [initialLights]);
  const handleSwitchClick = (index: number) => {
    const newLights = toggleLights(lights, index);
    setLights(newLights);
    if (newLights.every(light => light) && startTime) {
      const score = Date.now() - startTime;
      onComplete(score);
    }
  };
  const isSolved = lights.every(light => light);
  return (
    <div className="w-full h-auto md:h-96 bg-muted rounded-2xl flex flex-col items-center justify-center text-center p-4 space-y-4">
      <h3 className="text-xl font-bold">Turn On All The Lights!</h3>
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {lights.map((isOn, i) => (
          <motion.button
            key={i}
            onClick={() => handleSwitchClick(i)}
            disabled={isSolved}
            className={cn(
              "w-16 h-16 md:w-20 md:h-20 rounded-lg flex items-center justify-center transition-colors",
              isOn ? "bg-yellow-400" : "bg-border"
            )}
            whileTap={{ scale: 0.9 }}
          >
            {isOn ? <Lightbulb className="w-10 h-10 text-white" /> : <LightbulbOff className="w-10 h-10 text-gray-500" />}
          </motion.button>
        ))}
      </div>
      {isSolved && <p className="font-bold text-green-500">Solved!</p>}
    </div>
  );
};