import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '@/lib/game-store';
import { api } from '@/lib/api-client';
import type { Game, Player } from '@shared/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Toaster, toast } from '@/components/ui/sonner';
import { Users, LogIn, Hourglass } from 'lucide-react';
import { useInterval } from 'react-use';
import { useShallow } from 'zustand/react/shallow';
import { GamePuzzles } from '@/components/GamePuzzles';
import { Leaderboard } from '@/components/Leaderboard';
import { AvatarPicker } from '@/components/AvatarPicker';
import { AVATARS } from '@/lib/constants';
type PageState = 'joining' | 'lobby' | 'playing' | 'finished' | 'loading';
const GamePage = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { game, player, setGame, setPlayer } = useGameStore(
    useShallow((s) => ({ game: s.game, player: s.player, setGame: s.setGame, setPlayer: s.setPlayer }))
  );
  const [pageState, setPageState] = useState<PageState>('loading');
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const fetchGame = useCallback(async () => {
    if (!gameId) {
      toast.error("No game ID provided.");
      navigate('/');
      return;
    }
    try {
      const fetchedGame = await api<Game>(`/api/games/${gameId}`);
      setGame(fetchedGame);
    } catch (error) {
      toast.error("Game not found or an error occurred.", { description: "You're being redirected to the homepage." });
      setTimeout(() => navigate('/'), 3000);
    }
  }, [gameId, navigate, setGame]);
  useEffect(() => {
    fetchGame();
  }, [fetchGame]);
  useInterval(() => {
    if (game && (game.status === 'lobby' || game.status === 'playing' || game.status === 'finished')) {
      fetchGame();
    }
  }, 2000);
  useEffect(() => {
    if (game) {
      if (game.status === 'playing') setPageState('playing');
      else if (game.status === 'finished') setPageState('finished');
      else if (game.status === 'lobby' && player) setPageState('lobby');
      else setPageState('joining');
    }
  }, [game, player]);
  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !gameId) return;
    setIsLoading(true);
    try {
      const { game: updatedGame, player: newPlayer } = await api<{ game: Game; player: Player }>(`/api/games/${gameId}/players`, {
        method: 'POST',
        body: JSON.stringify({ name, avatar: selectedAvatar }),
      });
      setGame(updatedGame);
      setPlayer(newPlayer);
      setPageState('lobby');
      toast.success(`Welcome, ${name}!`, { description: "Waiting for the admin to start the game." });
    } catch (error) {
      toast.error('Failed to join game', { description: error instanceof Error ? error.message : 'Please try another name.' });
    } finally {
      setIsLoading(false);
    }
  };
  const renderContent = () => {
    switch (pageState) {
      case 'loading':
        return (
          <motion.div key="loading" className="text-center">
            <Hourglass className="mx-auto h-12 w-12 animate-spin text-primary-brand" />
            <p className="mt-4 text-lg text-muted-foreground">Loading Game...</p>
          </motion.div>
        );
      case 'joining':
        return (
          <motion.div key="joining" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="w-full max-w-md mx-auto shadow-lg rounded-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Join the Race!</CardTitle>
                <CardDescription>Enter your name and pick an avatar.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleJoin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="font-medium">Your Avatar</label>
                    <AvatarPicker selectedAvatar={selectedAvatar} onSelectAvatar={setSelectedAvatar} />
                  </div>
                  <Input
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 text-lg rounded-full px-6"
                    required
                  />
                  <Button type="submit" size="lg" disabled={isLoading} className="w-full bg-primary-brand text-white hover:bg-primary-brand/90 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95">
                    <LogIn className="mr-2 h-5 w-5" />
                    {isLoading ? 'Joining...' : 'Join Lobby'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        );
      case 'lobby':
        return (
          <motion.div key="lobby" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="w-full max-w-2xl mx-auto shadow-lg rounded-2xl">
              <CardHeader className="text-center">
                <Hourglass className="mx-auto h-12 w-12 text-secondary-brand animate-spin" />
                <CardTitle className="text-3xl font-bold mt-4">Welcome, {player?.name}!</CardTitle>
                <CardDescription>You're in the lobby. The game will start soon.</CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="text-lg font-semibold flex items-center justify-center mb-4">
                  <Users className="mr-2 h-5 w-5 text-primary-brand" />
                  Players in Lobby ({game?.players.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {game?.players.map(p => (
                    <div key={p.id} className="flex flex-col items-center p-3 bg-muted rounded-lg">
                      <span className="text-4xl mb-1">{p.avatar}</span>
                      <span className="font-medium text-center truncate w-full">{p.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      case 'playing':
        if (!game || !player) return null;
        return <GamePuzzles game={game} player={player} />;
      case 'finished':
        if (!game) return null;
        return <Leaderboard game={game} />;
      default:
        return <div>Unknown game state.</div>;
    }
  };
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4 mb-12">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
            className="inline-block"
          >
            <img
              src="https://vitchennai.hosting.acm.org/genAI/wp-content/uploads/2025/10/acm_logo_latest_transparant-removebg-preview-edited-1.png.webp"
              alt="ACM Logo"
              className="w-24 h-24 object-contain"
            />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold font-display text-foreground">
            ACM ARCADE
          </h1>
        </div>
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>
      <footer className="text-center py-8 text-muted-foreground/80">
        <p>Built with ❤️ at Cloudflare</p>
      </footer>
      <Toaster richColors closeButton />
    </div>
  );
};
export default GamePage;