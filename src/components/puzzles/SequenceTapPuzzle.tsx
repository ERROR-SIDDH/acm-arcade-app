import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
interface SequenceTapPuzzleProps {
  onComplete: (score: number) => void;
}
const SEQUENCE_LENGTH = 4;
const GRID_SIZE = 9; // 3x3 grid
export const SequenceTapPuzzle: React.FC<SequenceTapPuzzleProps> = ({ onComplete }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [stage, setStage] = useState<'showing' | 'playing' | 'finished' | 'error'>('showing');
  const [litButton, setLitButton] = useState<number | null>(null);
  const startTime = useRef<number | null>(null);
  useEffect(() => {
    const newSequence = Array.from({ length: SEQUENCE_LENGTH }, () => Math.floor(Math.random() * GRID_SIZE));
    setSequence(newSequence);
  }, []);
  useEffect(() => {
    if (stage === 'showing' && sequence.length > 0) {
      let i = 0;
      const interval = setInterval(() => {
        setLitButton(sequence[i]);
        setTimeout(() => setLitButton(null), 400);
        i++;
        if (i >= sequence.length) {
          clearInterval(interval);
          setTimeout(() => {
            setStage('playing');
            startTime.current = Date.now();
          }, 600);
        }
      }, 600);
    }
  }, [stage, sequence]);
  const handleTap = (index: number) => {
    if (stage !== 'playing') return;
    const newPlayerInput = [...playerInput, index];
    setPlayerInput(newPlayerInput);
    if (newPlayerInput[newPlayerInput.length - 1] !== sequence[newPlayerInput.length - 1]) {
      setStage('error');
      setTimeout(() => {
        setPlayerInput([]);
        setStage('showing'); // Restart sequence
      }, 1500);
      return;
    }
    if (newPlayerInput.length === sequence.length) {
      if (startTime.current) {
        const score = Date.now() - startTime.current;
        setStage('finished');
        onComplete(score);
      }
    }
  };
  const getMessage = () => {
    switch (stage) {
      case 'showing': return "Watch the sequence...";
      case 'playing': return "Your turn! Repeat the sequence.";
      case 'finished': return "Correct!";
      case 'error': return "Wrong sequence! Watch again.";
      default: return "";
    }
  };
  return (
    <div className="w-full h-auto md:h-96 bg-muted rounded-2xl flex flex-col items-center justify-center text-center p-4 space-y-4">
      <h3 className="text-xl font-bold">{getMessage()}</h3>
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {Array.from({ length: GRID_SIZE }).map((_, i) => (
          <motion.div
            key={i}
            onClick={() => handleTap(i)}
            className={cn(
              "w-16 h-16 md:w-20 md:h-20 rounded-lg cursor-pointer transition-colors",
              stage === 'playing' ? 'bg-border hover:bg-accent' : 'bg-border',
              litButton === i && 'bg-secondary-brand'
            )}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
};