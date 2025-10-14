import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
interface MathSprintPuzzleProps {
  onComplete: (score: number) => void;
}
export const MathSprintPuzzle: React.FC<MathSprintPuzzleProps> = ({ onComplete }) => {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const { num1, num2, operator, answer } = useMemo(() => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let ans;
    let finalN1 = n1, finalN2 = n2;
    switch (op) {
      case '+':
        ans = n1 + n2;
        break;
      case '-':
        // Ensure result is not negative
        finalN1 = Math.max(n1, n2);
        finalN2 = Math.min(n1, n2);
        ans = finalN1 - finalN2;
        break;
      case '*':
        ans = n1 * n2;
        break;
      default:
        ans = 0;
    }
    return { num1: finalN1, num2: finalN2, operator: op, answer: ans };
  }, []);
  useEffect(() => {
    setStartTime(Date.now());
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (parseInt(value, 10) === answer && startTime && !isCorrect) {
      const score = Date.now() - startTime;
      setIsCorrect(true);
      onComplete(score);
    }
  };
  return (
    <div className="w-full h-64 md:h-96 bg-muted rounded-2xl flex flex-col items-center justify-center text-center p-4 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-muted-foreground mb-2">Solve the equation!</p>
        <h3 className="text-6xl font-bold tracking-widest text-primary-brand font-mono">
          {num1} {operator} {num2} = ?
        </h3>
      </motion.div>
      {!isCorrect ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Input
            type="number"
            value={inputValue}
            onChange={handleChange}
            autoFocus
            className="h-14 w-48 text-center text-3xl font-mono tracking-widest rounded-full"
            autoComplete="off"
          />
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3 className="text-2xl font-bold text-green-500">Correct!</h3>
          <p className="text-muted-foreground">Next puzzle loading...</p>
        </motion.div>
      )}
    </div>
  );
};