import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useAnimationControls } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';
interface SliderPrecisionPuzzleProps {
  onComplete: (score: number) => void;
}
const HANDLE_WIDTH = 16; // Corresponds to w-4 class
export const SliderPrecisionPuzzle: React.FC<SliderPrecisionPuzzleProps> = ({ onComplete }) => {
  const [isFinished, setIsFinished] = useState(false);
  const targetPosition = useRef(Math.random() * 80 + 10); // % position
  const controls = useAnimationControls();
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  // We transform the pixel value of x into a percentage
  const sliderPercentage = useTransform(x, (latestX) => {
    const containerWidth = containerRef.current?.offsetWidth;
    if (!containerWidth) return 0;
    // The slider handle is 16px wide, so we need to account for that
    return (latestX / (containerWidth - HANDLE_WIDTH)) * 100;
  });
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const containerWidth = container.offsetWidth;
    const maxTravel = containerWidth - HANDLE_WIDTH;
    controls.start({
      x: [0, maxTravel, 0],
    }, {
      duration: 2,
      repeat: Infinity,
      repeatType: 'mirror',
      ease: 'linear',
    });
  }, [controls]);
  const handleStop = () => {
    if (isFinished) return;
    controls.stop();
    setIsFinished(true);
    const finalPercentage = sliderPercentage.get();
    const precision = Math.abs(finalPercentage - targetPosition.current);
    // Score is the difference, lower is better. Max score is 100 (worst) * 50 = 5000.
    const score = Math.round(precision * 50);
    onComplete(score);
  };
  return (
    <div className="w-full h-64 md:h-96 bg-muted rounded-2xl flex flex-col items-center justify-center text-center p-8 space-y-8">
      <h3 className="text-xl font-bold">Stop the slider on the target!</h3>
      <div className="w-full max-w-md relative h-12 flex items-center">
        {/* Track */}
        <div className="w-full h-2 bg-border rounded-full" />
        {/* Target */}
        <div
          className="absolute h-10 w-2 bg-green-500 rounded-full"
          style={{ left: `${targetPosition.current}%`, transform: 'translateX(-50%)' }}
        >
          <Target className="absolute -top-8 left-1/2 -translate-x-1/2 text-green-500" />
        </div>
        {/* Slider Handle Container */}
        <div ref={containerRef} className="absolute w-full h-4 top-1/2 -translate-y-1/2">
          <motion.div
            className="w-4 h-4 bg-primary-brand rounded-full"
            style={{ x }}
            animate={controls}
          />
        </div>
      </div>
      {!isFinished ? (
        <Button onClick={handleStop} size="lg" className="w-48">
          STOP
        </Button>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3 className="text-2xl font-bold text-green-500">Stopped!</h3>
          <p className="text-muted-foreground">Next puzzle loading...</p>
        </motion.div>
      )}
    </div>
  );
};