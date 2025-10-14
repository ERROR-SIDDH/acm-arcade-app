import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
interface ColorMatchPuzzleProps {
  onComplete: (score: number) => void;
}
const COLORS = [
  { name: 'RED', class: 'text-red-500', bg: 'bg-red-500' },
  { name: 'BLUE', class: 'text-blue-500', bg: 'bg-blue-500' },
  { name: 'GREEN', class: 'text-green-500', bg: 'bg-green-500' },
  { name: 'YELLOW', class: 'text-yellow-500', bg: 'bg-yellow-500' },
];
type SelectionStatus = 'pending' | 'correct' | 'incorrect';
export const ColorMatchPuzzle: React.FC<ColorMatchPuzzleProps> = ({ onComplete }) => {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [selectionStatus, setSelectionStatus] = useState<SelectionStatus>('pending');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { word, color, options } = useMemo(() => {
    const shuffledColors = [...COLORS].sort(() => 0.5 - Math.random());
    const colorIndex = Math.floor(Math.random() * COLORS.length);
    let wordIndex = Math.floor(Math.random() * COLORS.length);
    while (wordIndex === colorIndex) {
      wordIndex = Math.floor(Math.random() * COLORS.length);
    }
    return {
      word: COLORS[wordIndex],
      color: COLORS[colorIndex],
      options: shuffledColors,
    };
  }, []);
  useEffect(() => {
    setStartTime(Date.now());
  }, []);
  const handleSelect = (selectedColorName: string) => {
    if (selectionStatus !== 'pending' || !startTime) return;
    setSelectedOption(selectedColorName);
    const endTime = Date.now();
    if (selectedColorName === color.name) {
      setSelectionStatus('correct');
      const score = endTime - startTime;
      setTimeout(() => onComplete(score), 1000);
    } else {
      setSelectionStatus('incorrect');
      const score = (endTime - startTime) + 3000; // 3 second penalty
      setTimeout(() => onComplete(score), 1500);
    }
  };
  const getButtonClass = (optionName: string) => {
    if (selectionStatus === 'pending') return '';
    if (optionName === color.name) return 'ring-4 ring-green-500';
    if (optionName === selectedOption) return 'ring-4 ring-red-500';
    return 'opacity-50';
  };
  return (
    <div className="w-full h-64 md:h-96 bg-muted rounded-2xl flex flex-col items-center justify-center text-center p-4 space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-muted-foreground mb-2">Click the button that matches the FONT COLOR.</p>
        <h3 className={cn("text-6xl font-bold tracking-widest", color.class)}>{word.name}</h3>
      </motion.div>
      {selectionStatus === 'pending' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          {options.map((option) => (
            <Button
              key={option.name}
              onClick={() => handleSelect(option.name)}
              className={cn("w-32 h-16 text-lg font-bold text-white hover:scale-105 active:scale-95 transition-all", option.bg)}
            >
              {option.name}
            </Button>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          {options.map((option) => (
            <Button
              key={option.name}
              disabled
              className={cn("w-32 h-16 text-lg font-bold text-white transition-all", option.bg, getButtonClass(option.name))}
            >
              {option.name}
            </Button>
          ))}
        </motion.div>
      )}
    </div>
  );
};