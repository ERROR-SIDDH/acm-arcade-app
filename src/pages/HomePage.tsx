import { useState, useCallback, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Users, Play, Crown, PartyPopper, RotateCcw, CheckCircle2, Settings, Dices } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Toaster, toast } from '@/components/ui/sonner';
import { api } from '@/lib/api-client';
import type { Game } from '@shared/types';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import { useInterval } from 'react-use';
import { playWinSound } from '@/lib/sounds';
import { PUZZLES } from '@/lib/puzzles';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
export function HomePage() {
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPuzzles, setSelectedPuzzles] = useState<Set<string>>(new Set(PUZZLES.map(p => p.key)));
  const [shufflePuzzles, setShufflePuzzles] = useState(true);
  const [interPuzzleDelay, setInterPuzzleDelay] = useState(1);
  const togglePuzzleSelection = (puzzleKey: string) => {
    setSelectedPuzzles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(puzzleKey)) {
        newSet.delete(puzzleKey);
      } else {
        newSet.add(puzzleKey);
      }
      return newSet;
    });
  };
  const randomizeAllSettings = () => {
    // 1. Randomize puzzle selection
    const shuffledPuzzles = [...PUZZLES].sort(() => 0.5 - Math.random());
    const minPuzzles = 3;
    const maxPuzzles = PUZZLES.length;
    const puzzleCount = Math.floor(Math.random() * (maxPuzzles - minPuzzles + 1)) + minPuzzles;
    const randomPuzzleKeys = new Set(shuffledPuzzles.slice(0, puzzleCount).map(p => p.key));
    setSelectedPuzzles(randomPuzzleKeys);
    // 2. Randomize shuffle setting
    setShufflePuzzles(Math.random() < 0.5);
    // 3. Randomize delay
    setInterPuzzleDelay(Math.floor(Math.random() * 6)); // 0 to 5 seconds
    toast.info('Game settings have been randomized!', {
      description: `Selected ${puzzleCount} puzzles.`,
    });
  };
  const createGame = async () => {
    if (selectedPuzzles.size === 0) {
      toast.error('No puzzles selected', { description: 'Please select at least one puzzle to start a game.' });
      return;
    }
    setIsLoading(true);
    try {
      const newGame = await api<Game>('/api/games', {
        method: 'POST',
        body: JSON.stringify({
          puzzleKeys: Array.from(selectedPuzzles),
          shufflePuzzles,
          interPuzzleDelay,
        }),
      });
      setGame(newGame);
      toast.success('New game created!', { description: 'Share the QR code to let players join.' });
    } catch (error) {
      toast.error('Failed to create game', { description: error instanceof Error ? error.message : 'An unknown error occurred.' });
    } finally {
      setIsLoading(false);
    }
  };
  const startGame = async () => {
    if (!game) return;
    setIsLoading(true);
    try {
      await api(`/api/games/${game.id}/start`, { method: 'POST', body: JSON.stringify({}) });
      toast.success('The race has begun!', { description: 'Players are now solving puzzles.' });
    } catch (error) {
      toast.error('Failed to start game', { description: error instanceof Error ? error.message : 'An unknown error occurred.' });
    } finally {
      setIsLoading(false);
    }
  };
  const pollGameData = useCallback(async () => {
    if (!game || game.status === 'finished') return;
    try {
      const updatedGame = await api<Game>(`/api/games/${game.id}`);
      setGame(updatedGame);
    } catch (error) {
      console.error("Failed to poll game data:", error);
    }
  }, [game]);
  useInterval(pollGameData, 2000);
  const winner = useMemo(() => {
    if (game?.status !== 'finished' || !game.players.length) return null;
    return [...game.players]
      .map(player => ({
        ...player,
        totalScore: player.scores.reduce((acc, score) => acc + score, 0),
      }))
      .sort((a, b) => a.totalScore - b.totalScore)[0];
  }, [game]);
  useEffect(() => {
    if (winner) {
      playWinSound();
    }
  }, [winner]);
  const joinUrl = game ? `${window.location.origin}/game/${game.id}` : '';
  const renderContent = () => {
    if (!game) {
      return (
        <motion.div
          key="create"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card className="w-full max-w-3xl mx-auto text-center shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Select Puzzles for the Race</CardTitle>
              <CardDescription>Choose which mini-games will be included in this session.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {PUZZLES.map(puzzle => (
                  <button
                    key={puzzle.key}
                    onClick={() => togglePuzzleSelection(puzzle.key)}
                    className={cn(
                      "relative p-4 border-2 rounded-lg text-left transition-all duration-200 h-full",
                      selectedPuzzles.has(puzzle.key)
                        ? "border-primary-brand bg-primary-brand/10"
                        : "border-border hover:border-primary-brand/50"
                    )}
                  >
                    {selectedPuzzles.has(puzzle.key) && (
                      <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-primary-brand" />
                    )}
                    <p className="font-bold">{puzzle.name}</p>
                    <p className="text-xs text-muted-foreground">{puzzle.description}</p>
                  </button>
                ))}
              </div>
              <Separator />
              <div className="space-y-4 text-left">
                <h3 className="text-lg font-semibold flex items-center"><Settings className="mr-2 h-5 w-5" /> Game Settings</h3>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <Label htmlFor="shuffle-puzzles" className="font-medium">Shuffle Puzzle Order</Label>
                  <Switch id="shuffle-puzzles" checked={shufflePuzzles} onCheckedChange={setShufflePuzzles} />
                </div>
                <div className="rounded-lg border p-3 space-y-2">
                  <Label htmlFor="puzzle-delay" className="font-medium">Delay Between Puzzles: <span className="text-primary-brand font-bold">{interPuzzleDelay}s</span></Label>
                  <Slider id="puzzle-delay" min={0} max={5} step={1} value={[interPuzzleDelay]} onValueChange={(v) => setInterPuzzleDelay(v[0])} />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={createGame}
                  disabled={isLoading || selectedPuzzles.size === 0}
                  className="w-full bg-primary-brand text-white hover:bg-primary-brand/90 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  <Play className="mr-2 h-5 w-5" />
                  {isLoading ? 'Creating...' : `Create Game (${selectedPuzzles.size} Puzzles)`}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={randomizeAllSettings}
                  disabled={isLoading}
                  className="w-full sm:w-auto rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  <Dices className="mr-2 h-5 w-5" />
                  Randomize
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      );
    }
    if (game.status === 'finished') {
      return (
        <motion.div
          key="finished"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <Card className="w-full max-w-md mx-auto text-center shadow-lg rounded-2xl overflow-hidden">
            <CardHeader className="bg-secondary-brand/20 p-6">
              <PartyPopper className="mx-auto h-12 w-12 text-secondary-brand" />
              <CardTitle className="text-3xl font-bold mt-2">Race Complete!</CardTitle>
              <CardDescription>And the winner is...</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              {winner ? (
                <>
                  <span className="text-8xl">{winner.avatar}</span>
                  <h3 className="text-4xl font-bold font-display text-primary-brand">{winner.name}</h3>
                  <p className="text-lg text-muted-foreground">
                    Total Time: <span className="font-bold font-mono text-foreground">{(winner.totalScore / 1000).toFixed(2)}s</span>
                  </p>
                </>
              ) : (
                <p className="text-muted-foreground">Calculating winner...</p>
              )}
              <Button
                size="lg"
                onClick={() => setGame(null)}
                className="w-full bg-primary-brand text-white hover:bg-primary-brand/90 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 mt-6"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Create New Game
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      );
    }
    return (
      <motion.div
        key="lobby"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-8"
      >
        <Card className="shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-muted p-6">
            <CardTitle className="text-2xl font-bold">Game Lobby</CardTitle>
            <CardDescription>Share the QR code or link to let players join. This game has {game.puzzleKeys.length} puzzles.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <QRCodeDisplay url={joinUrl} size={200} />
              <p className="text-sm text-muted-foreground text-center">
                Game ID: <span className="font-mono bg-muted p-1 rounded">{game.id}</span>
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary-brand" />
                Players Joined ({game.players.length})
              </h3>
              <div className="h-48 bg-muted rounded-lg p-4 overflow-y-auto space-y-2">
                {game.players.length > 0 ? (
                  <AnimatePresence>
                    {game.players.map((player, index) => (
                      <motion.div
                        key={player.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center bg-card p-2 rounded-md shadow-sm"
                      >
                        <span className="text-2xl mr-3 w-8 text-center">{player.avatar}</span>
                        <span className="font-medium truncate">{player.name}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Waiting for players...
                  </div>
                )}
              </div>
              <Button
                size="lg"
                onClick={startGame}
                disabled={isLoading || game.players.length === 0 || game.status === 'playing'}
                className="w-full bg-green-500 text-white hover:bg-green-600 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:bg-gray-400"
              >
                <Crown className="mr-2 h-5 w-5" />
                {game.status === 'playing' ? 'Race in Progress...' : (isLoading ? 'Starting...' : 'Start Race')}
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="text-center">
          <Button variant="link" onClick={() => setGame(null)}>Create a different game</Button>
        </div>
      </motion.div>
    );
  };
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center space-y-4 mb-12">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="inline-block"
          >
            <img
              src="https://vitchennai.hosting.acm.org/genAI/wp-content/uploads/2025/10/acm_logo_latest_transparant-removebg-preview-edited-1.png.webp"
              alt="ACM Logo"
              className="w-32 h-32 object-contain"
            />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold font-display text-foreground">
            ACM ARCADE <span className="text-primary-brand">Admin</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create a new reaction race, watch players join in real-time, and launch the competition!
          </p>
        </div>
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>
      <footer className="text-center py-8 text-muted-foreground/80">
        <p>Built with ❤️ at ACM</p>
      </footer>
      <Toaster richColors closeButton />
    </div>
  );
}
