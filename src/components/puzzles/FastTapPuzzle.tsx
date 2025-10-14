import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Hand } from 'lucide-react';
interface FastTapPuzzleProps {
  onComplete: (score: number) => void;
}
const GAME_DURATION = 5; // in seconds
export const FastTapPuzzle: React.FC<FastTapPuzzleProps> = ({ onComplete }) => {
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsFinished(true);
          // Score is inversely related to taps. More taps = lower (better) score.
          // Max possible score is 5000. Each tap reduces the score.
          const score = Math.max(0, 5000 - (taps * 50));
          onComplete(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taps]); // We need to re-evaluate the score calculation with the latest tap count
  const handleTap = () => {
    if (!isFinished) {
      setTaps(prev => prev + 1);
    }
  };
  return (
    <div className="w-full h-64 md:h-96 bg-muted rounded-2xl flex flex-col items-center justify-center text-center p-4 space-y-6">
      {!isFinished ? (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
            <h3 className="text-2xl font-bold">Tap as fast as you can!</h3>
            <p className="text-6xl font-mono font-bold text-primary-brand my-4">{timeLeft}</p>
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Button
              onClick={handleTap}
              className="w-48 h-48 rounded-full bg-accent-brand text-white shadow-lg text-2xl font-bold flex-col"
            >
              <Hand className="w-12 h-12 mb-2" />
              TAP!
            </Button>
            <div className="absolute -top-5 -right-5 bg-secondary-brand text-white rounded-full w-16 h-16 flex items-center justify-center font-bold text-2xl">
              {taps}
            </div>
          </motion.div>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
          <h3 className="text-3xl font-bold text-green-500">Time's Up!</h3>
          <p className="text-xl text-muted-foreground">You tapped <span className="font-bold text-foreground">{taps}</span> times.</p>
        </motion.div>
      )}
    </div>
  );
};