import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Game, Player } from '@shared/types';
import { PUZZLES_MAP } from '@/lib/puzzles';
interface GamePuzzlesProps {
  game: Game;
  player: Player;
}
export const GamePuzzles: React.FC<GamePuzzlesProps> = ({ game, player }) => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(player.scores.length);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const gamePuzzleSequence = useMemo(() => {
    const puzzleComponents = game.puzzleKeys.map(key => PUZZLES_MAP.get(key)).filter(Boolean);
    if (game.shufflePuzzles) {
      // Shuffle the selected puzzle keys to ensure a different order each game
      return [...puzzleComponents].sort(() => 0.5 - Math.random());
    }
    return puzzleComponents;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(game.puzzleKeys), game.shufflePuzzles]);
  const onPuzzleComplete = async (score: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await api(`/api/games/${game.id}/score`, {
        method: 'POST',
        body: JSON.stringify({ playerId: player.id, score }),
      });
      setTimeout(() => {
        if (currentPuzzleIndex < game.puzzleKeys.length - 1) {
          setCurrentPuzzleIndex(prev => prev + 1);
        }
        setIsSubmitting(false);
      }, game.interPuzzleDelay * 1000); // Use configurable delay
    } catch (error) {
      toast.error('Failed to submit score', { description: error instanceof Error ? error.message : 'Please check your connection.' });
      setIsSubmitting(false);
    }
  };
  const CurrentPuzzle = useMemo(() => {
    return gamePuzzleSequence[currentPuzzleIndex];
  }, [currentPuzzleIndex, gamePuzzleSequence]);
  const progressValue = ((currentPuzzleIndex + 1) / game.puzzleKeys.length) * 100;
  return (
    <motion.div
      key="puzzles"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto space-y-6"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold">Puzzle {currentPuzzleIndex + 1} of {game.puzzleKeys.length}</h2>
        <p className="text-muted-foreground">Get ready, {player.name}!</p>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPuzzleIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {CurrentPuzzle && <CurrentPuzzle onComplete={onPuzzleComplete} />}
        </motion.div>
      </AnimatePresence>
      <div className="space-y-2">
        <p className="text-sm font-medium text-center">Progress</p>
        <Progress value={progressValue} className="w-full h-4" />
      </div>
    </motion.div>
  );
};