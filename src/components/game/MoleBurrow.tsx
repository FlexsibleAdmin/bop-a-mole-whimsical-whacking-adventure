import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore, MoleType } from '@/store/gameStore';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
interface MoleBurrowProps {
  index: number;
}
const moleVariants = {
  hidden: { y: '100%', scale: 0.5, opacity: 0 },
  rising: { y: '20%', scale: 0.9, opacity: 1 },
  up: { 
    y: '0%', 
    scale: 1, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 15 } 
  },
  hit: { 
    y: '40%', 
    scale: 0.8, 
    opacity: 0.8,
    rotate: [0, -10, 10, 0],
    transition: { duration: 0.2 }
  }
};
const MoleVisual = ({ type }: { type: MoleType }) => {
  switch (type) {
    case 'golden':
      return (
        <div className="w-20 h-20 md:w-24 md:h-24 bg-yellow-400 rounded-full border-4 border-black relative flex items-center justify-center shadow-inner">
          <div className="absolute top-4 w-16 h-8 bg-yellow-300 rounded-full opacity-50" />
          {/* Eyes */}
          <div className="flex gap-4 mb-2">
            <div className="w-3 h-3 bg-black rounded-full animate-blink" />
            <div className="w-3 h-3 bg-black rounded-full animate-blink" />
          </div>
          {/* Nose */}
          <div className="w-4 h-3 bg-pink-400 rounded-full absolute top-12" />
          {/* Crown */}
          <div className="absolute -top-6 text-2xl animate-bounce">👑</div>
        </div>
      );
    case 'bomb':
      return (
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-800 rounded-full border-4 border-black relative flex items-center justify-center">
          <div className="text-4xl">💣</div>
          <div className="absolute top-2 right-4 w-2 h-2 bg-red-500 rounded-full animate-ping" />
        </div>
      );
    case 'bunny':
      return (
        <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full border-4 border-black relative flex items-center justify-center">
           {/* Ears */}
           <div className="absolute -top-6 left-2 w-4 h-10 bg-white border-2 border-black rounded-full rotate-[-15deg]" />
           <div className="absolute -top-6 right-2 w-4 h-10 bg-white border-2 border-black rounded-full rotate-[15deg]" />
           <div className="text-3xl z-10">🐰</div>
        </div>
      );
    case 'mole':
    default:
      return (
        <div className="w-20 h-20 md:w-24 md:h-24 bg-amber-700 rounded-full border-4 border-black relative flex items-center justify-center shadow-inner">
          <div className="absolute top-4 w-16 h-8 bg-amber-600 rounded-full opacity-50" />
          {/* Eyes */}
          <div className="flex gap-4 mb-2">
            <div className="w-3 h-3 bg-black rounded-full" />
            <div className="w-3 h-3 bg-black rounded-full" />
          </div>
          {/* Nose */}
          <div className="w-6 h-4 bg-pink-300 rounded-full absolute top-12 border-2 border-black/10" />
          {/* Whiskers */}
          <div className="absolute top-12 left-2 w-4 h-0.5 bg-black/20 rotate-12" />
          <div className="absolute top-12 right-2 w-4 h-0.5 bg-black/20 -rotate-12" />
        </div>
      );
  }
};
export function MoleBurrow({ index }: MoleBurrowProps) {
  const mole = useGameStore(s => s.moles[index]);
  const whackMole = useGameStore(s => s.whackMole);
  const [scorePopup, setScorePopup] = useState<{ text: string, color: string } | null>(null);
  const handleClick = (e: React.MouseEvent) => {
    if (mole.status !== 'up' && mole.status !== 'rising') return;
    const points = whackMole(index);
    // Visual feedback
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    if (points > 0) {
      setScorePopup({ text: `+${points}`, color: 'text-green-500' });
      confetti({
        particleCount: 15,
        spread: 40,
        origin: { x, y },
        colors: ['#FFD700', '#4ECDC4'],
        disableForReducedMotion: true,
        zIndex: 100
      });
    } else {
      setScorePopup({ text: `${points}`, color: 'text-red-500' });
    }
    setTimeout(() => setScorePopup(null), 800);
  };
  return (
    <div className="relative flex justify-center items-end h-32 md:h-40">
      {/* The Hole (Background) */}
      <div className="absolute bottom-0 w-24 h-8 md:w-32 md:h-10 bg-black/20 rounded-[50%] scale-x-110 translate-y-2 blur-sm" />
      <div className="absolute bottom-0 w-24 h-8 md:w-32 md:h-10 bg-amber-900/40 rounded-[50%] border-b-4 border-black/10" />
      {/* Mask Container for Mole */}
      <div className="relative w-28 h-28 md:w-36 md:h-36 overflow-hidden rounded-b-3xl flex items-end justify-center pb-2">
        <AnimatePresence>
          {mole.status !== 'hidden' && (
            <motion.div
              key="mole"
              variants={moleVariants}
              initial="hidden"
              animate={mole.status}
              exit="hidden"
              className="cursor-pointer touch-manipulation"
              onPointerDown={handleClick}
            >
              <MoleVisual type={mole.type} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Foreground Dirt Lip */}
      <div className="absolute bottom-0 w-28 h-4 md:w-36 md:h-5 bg-amber-800 rounded-full border-2 border-black/20 z-10" />
      {/* Score Popup */}
      <AnimatePresence>
        {scorePopup && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: 1, y: -50, scale: 1.2 }}
            exit={{ opacity: 0 }}
            className={cn("absolute top-0 font-black text-2xl z-50 pointer-events-none shadow-sm", scorePopup.color)}
            style={{ textShadow: '2px 2px 0px white' }}
          >
            {scorePopup.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}