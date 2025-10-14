import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
interface TypeTheWordPuzzleProps {
  onComplete: (score: number) => void;
}
const WORDS = ['ZAP', 'DASH', 'QUICK', 'REACT', 'SPEED', 'LIGHT', 'FAST', 'RACE'];
export const TypeTheWordPuzzle: React.FC<TypeTheWordPuzzleProps> = ({ onComplete }) => {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const targetWord = useMemo(() => WORDS[Math.floor(Math.random() * WORDS.length)], []);
  useEffect(() => {
    setStartTime(Date.now());
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setInputValue(value);
    if (value === targetWord && startTime) {
      const endTime = Date.now();
      const score = endTime - startTime;
      onComplete(score);
    }
  };
  return (
    <div className="w-full h-64 md:h-96 bg-muted rounded-2xl flex flex-col items-center justify-center text-center p-4 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-muted-foreground mb-2">Type the word below!</p>
        <h3 className="text-5xl font-bold tracking-widest text-secondary-brand font-mono">{targetWord}</h3>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Input
          value={inputValue}
          onChange={handleChange}
          autoFocus
          className="h-14 w-64 text-center text-3xl font-mono tracking-widest rounded-full"
          maxLength={targetWord.length}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
      </motion.div>
    </div>
  );
};