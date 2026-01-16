import React, { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useGameStore } from '@/store/gameStore';
import { ScoreBoard } from '@/components/game/ScoreBoard';
import { GameGrid } from '@/components/game/GameGrid';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Trophy } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { sounds } from '@/lib/sounds';
export function HomePage() {
  const gameState = useGameStore(s => s.gameState);
  const score = useGameStore(s => s.score);
  const highScore = useGameStore(s => s.highScore);
  const startGame = useGameStore(s => s.startGame);
  const resetGame = useGameStore(s => s.resetGame);
  const tick = useGameStore(s => s.tick);
  // Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;
    let lastTime = performance.now();
    let rafId: number;
    const loop = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      tick(delta);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [gameState, tick]);
  // Enable audio on first interaction
  useEffect(() => {
    const enableAudio = () => sounds.setEnabled(true);
    window.addEventListener('click', enableAudio, { once: true });
    return () => window.removeEventListener('click', enableAudio);
  }, []);
  return (
    <AppLayout container contentClassName="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden">
      <ThemeToggle className="absolute top-4 right-4" />
      {/* Background Decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-kid-yellow rounded-full opacity-20 blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-kid-blue rounded-full opacity-20 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>
      {/* Main Game Area */}
      <div className="w-full max-w-3xl relative">
        <div className="text-center mb-6">
          <h1 className="text-5xl md:text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-kid-blue via-kid-yellow to-kid-red drop-shadow-sm tracking-tight rotate-[-2deg]">
            Bop-a-Mole
          </h1>
          <p className="text-muted-foreground font-medium mt-2">Whack the moles, avoid the bunnies!</p>
        </div>
        <ScoreBoard />
        <GameGrid />
      </div>
      {/* Overlays */}
      <AnimatePresence>
        {gameState === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-3xl"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white p-8 rounded-[2rem] border-4 border-black shadow-cartoon text-center max-w-sm mx-4"
            >
              <div className="w-20 h-20 bg-kid-yellow rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-black">
                <Play className="w-10 h-10 ml-1" />
              </div>
              <h2 className="text-3xl font-black mb-2">Ready to Bop?</h2>
              <p className="text-gray-500 mb-6">Score points by hitting moles. Watch out for bombs and bunnies!</p>
              <Button 
                onClick={startGame}
                className="btn-primary-bop w-full py-6 text-xl"
              >
                Start Game
              </Button>
            </motion.div>
          </motion.div>
        )}
        {gameState === 'finished' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-3xl"
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-white p-8 rounded-[2rem] border-4 border-black shadow-cartoon text-center max-w-sm mx-4"
            >
              <div className="mb-2 text-6xl animate-bounce">
                {score > highScore ? '🏆' : '⏰'}
              </div>
              <h2 className="text-4xl font-black mb-2 text-kid-blue">Time's Up!</h2>
              <div className="bg-gray-100 rounded-xl p-4 mb-6 border-2 border-gray-200">
                <div className="text-sm text-gray-500 uppercase font-bold">Final Score</div>
                <div className="text-5xl font-black text-black">{score}</div>
                {score >= highScore && score > 0 && (
                  <div className="text-kid-yellow font-bold mt-1 animate-pulse">New High Score!</div>
                )}
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={startGame}
                  className="btn-primary-bop flex-1 py-6"
                >
                  Play Again
                </Button>
                <Button 
                  onClick={resetGame}
                  className="btn-bop bg-gray-200 hover:bg-gray-300 text-black px-4"
                >
                  <RotateCcw className="w-6 h-6" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>Built with ❤️ by Aurelia | Your AI Co-founder</p>
      </footer>
    </AppLayout>
  );
}