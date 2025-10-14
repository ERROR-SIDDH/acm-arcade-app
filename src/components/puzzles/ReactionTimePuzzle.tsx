import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
interface ReactionTimePuzzleProps {
  onComplete: (score: number) => void;
}
type Stage = 'waiting' | 'ready' | 'clicked' | 'tooSoon';
export const ReactionTimePuzzle: React.FC<ReactionTimePuzzleProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<Stage>('waiting');
  const startTime = useRef<number | null>(null);
  const timerId = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const delay = Math.random() * 3000 + 2000; // 2-5 second delay
    timerId.current = setTimeout(() => {
      setStage('ready');
      startTime.current = Date.now();
    }, delay);
    return () => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    };
  }, []);
  const handleClick = () => {
    if (stage === 'waiting') {
      if (timerId.current) clearTimeout(timerId.current);
      setStage('tooSoon');
      onComplete(5000); // Penalty score of 5000ms
    } else if (stage === 'ready' && startTime.current) {
      const endTime = Date.now();
      const score = endTime - startTime.current;
      setStage('clicked');
      onComplete(score);
    }
  };
  const getBackgroundColor = () => {
    switch (stage) {
      case 'waiting': return 'bg-red-500';
      case 'ready': return 'bg-green-500';
      case 'clicked': return 'bg-blue-500';
      case 'tooSoon': return 'bg-yellow-500';
      default: return 'bg-gray-800';
    }
  };
  const getMessage = () => {
    switch (stage) {
      case 'waiting': return { title: "Wait for Green", subtitle: "Click when the screen turns green." };
      case 'ready': return { title: "CLICK NOW!", subtitle: "Quick, click!" };
      case 'clicked': return { title: "Great!", subtitle: "Your reaction time was recorded." };
      case 'tooSoon': return { title: "Too Soon!", subtitle: "Penalty added! Next puzzle loading..." };
      default: return { title: "", subtitle: "" };
    }
  };
  const { title, subtitle } = getMessage();
  return (
    <div
      className={cn(
        "w-full h-64 md:h-96 rounded-2xl relative overflow-hidden flex items-center justify-center text-center p-4 cursor-pointer transition-colors duration-200",
        getBackgroundColor()
      )}
      onClick={handleClick}
    >
      <motion.div
        key={stage}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-white"
      >
        <h3 className="text-4xl font-bold">{title}</h3>
        <p className="text-lg opacity-80">{subtitle}</p>
      </motion.div>
    </div>
  );
};