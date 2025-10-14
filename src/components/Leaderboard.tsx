import { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Game } from '@shared/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Crown, Award, Star } from 'lucide-react';
import { Confetti } from './Confetti';
import { useGameStore } from '@/lib/game-store';
import { playWinSound } from '@/lib/sounds';
interface LeaderboardProps {
  game: Game;
}
export const Leaderboard: React.FC<LeaderboardProps> = ({ game }) => {
  const currentPlayer = useGameStore(s => s.player);
  const rankedPlayers = useMemo(() => {
    return [...game.players]
      .map(player => ({
        ...player,
        totalScore: player.scores.reduce((acc, score) => acc + score, 0),
      }))
      .sort((a, b) => a.totalScore - b.totalScore);
  }, [game.players]);
  useEffect(() => {
    if (currentPlayer && rankedPlayers.length > 0 && rankedPlayers[0].id === currentPlayer.id) {
      playWinSound();
    }
  }, [currentPlayer, rankedPlayers]);
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 1: return <Award className="w-6 h-6 text-gray-400" />;
      case 2: return <Star className="w-6 h-6 text-yellow-600" />;
      default: return <span className="text-lg font-bold w-6 text-center">{rank + 1}</span>;
    }
  };
  return (
    <motion.div
      key="leaderboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto relative"
    >
      <Confetti />
      <Card className="shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="text-center bg-primary-brand text-primary-foreground rounded-t-2xl p-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
          >
            <Crown className="mx-auto h-12 w-12" />
          </motion.div>
          <CardTitle className="text-3xl font-bold mt-2">Race Finished!</CardTitle>
          <CardDescription className="text-primary-foreground/80">Here are the final results.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
          {rankedPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`flex items-center p-4 rounded-lg ${
                index === 0 ? 'bg-yellow-100 dark:bg-yellow-900/50' : 'bg-muted'
              }`}
            >
              <div className="flex-shrink-0 mr-4">{getRankIcon(index)}</div>
              <div className="flex items-center flex-grow">
                <span className="text-3xl mr-3 w-8 text-center">{player.avatar}</span>
                <p className="font-bold text-lg truncate">{player.name}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-lg font-semibold text-primary-brand">
                  {(player.totalScore / 1000).toFixed(2)}s
                </p>
                <p className="text-xs text-muted-foreground">Total Time</p>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};