import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { Trophy, Clock, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
export function ScoreBoard() {
  const score = useGameStore(s => s.score);
  const highScore = useGameStore(s => s.highScore);
  const timeLeft = useGameStore(s => s.timeLeft);
  const combo = useGameStore(s => s.combo);
  const isLowTime = timeLeft <= 10;
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      {/* Header Stats */}
      <div className="flex items-center justify-between bg-white border-4 border-black rounded-3xl p-4 shadow-cartoon relative overflow-hidden">
        {/* Score */}
        <div className="flex flex-col items-start z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Score</span>
          <span className="text-4xl font-display font-black text-kid-blue drop-shadow-sm">
            {score.toLocaleString()}
          </span>
        </div>
        {/* Timer */}
        <div className={cn(
          "flex flex-col items-center z-10 transition-colors duration-300",
          isLowTime ? "text-kid-red animate-pulse" : "text-black"
        )}>
          <Clock className={cn("w-6 h-6 mb-1", isLowTime && "animate-bounce")} />
          <span className="text-3xl font-display font-bold tabular-nums">
            {Math.ceil(timeLeft)}s
          </span>
        </div>
        {/* High Score */}
        <div className="flex flex-col items-end z-10">
          <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-gray-500">
            <Trophy className="w-3 h-3 text-kid-yellow" /> Best
          </div>
          <span className="text-2xl font-display font-bold text-gray-700">
            {highScore.toLocaleString()}
          </span>
        </div>
        {/* Combo Meter Background */}
        {combo > 1 && (
          <div className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-300"
               style={{ width: `${Math.min(combo * 10, 100)}%` }} />
        )}
      </div>
      {/* Combo Badge */}
      {combo > 2 && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 animate-scale-in">
          <div className="bg-orange-500 text-white px-4 py-1 rounded-full border-2 border-black shadow-cartoon-sm flex items-center gap-2 font-bold rotate-[-5deg]">
            <Flame className="w-4 h-4 fill-yellow-300 text-yellow-300 animate-pulse" />
            {combo}x COMBO!
          </div>
        </div>
      )}
    </div>
  );
}