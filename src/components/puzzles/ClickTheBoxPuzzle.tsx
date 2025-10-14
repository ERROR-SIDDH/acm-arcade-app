import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
interface ClickTheBoxPuzzleProps {
  onComplete: (score: number) => void;
}
export const ClickTheBoxPuzzle: React.FC<ClickTheBoxPuzzleProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'waiting' | 'ready' | 'clicked'>('waiting');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [position, setPosition] = useState({ top: '50%', left: '50%' });
  useEffect(() => {
    const delay = Math.random() * 2000 + 1000; // 1-3 second delay
    const timer = setTimeout(() => {
      const top = `${Math.random() * 80 + 10}%`;
      const left = `${Math.random() * 80 + 10}%`;
      setPosition({ top, left });
      setStage('ready');
      setStartTime(Date.now());
    }, delay);
    return () => clearTimeout(timer);
  }, []);
  const handleClick = () => {
    if (stage === 'ready' && startTime) {
      const endTime = Date.now();
      const score = endTime - startTime;
      setStage('clicked');
      onComplete(score);
    }
  };
  return (
    <div className="w-full h-64 md:h-96 bg-muted rounded-2xl relative overflow-hidden flex items-center justify-center text-center p-4">
      {stage === 'waiting' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3 className="text-2xl font-bold text-foreground">Get Ready...</h3>
          <p className="text-muted-foreground">Click the box as soon as it appears!</p>
        </motion.div>
      )}
      {stage === 'ready' && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="absolute w-24 h-24 bg-accent-brand rounded-lg cursor-pointer shadow-lg"
          style={{ top: position.top, left: position.left, transform: 'translate(-50%, -50%)' }}
          onClick={handleClick}
        />
      )}
      {stage === 'clicked' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3 className="text-2xl font-bold text-green-500">Great!</h3>
          <p className="text-muted-foreground">Next puzzle coming up...</p>
        </motion.div>
      )}
    </div>
  );
};