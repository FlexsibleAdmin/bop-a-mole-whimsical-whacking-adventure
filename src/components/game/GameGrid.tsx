import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { MoleBurrow } from './MoleBurrow';
export function GameGrid() {
  const moles = useGameStore(s => s.moles);
  return (
    <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto p-4 bg-amber-100/50 rounded-3xl border-4 border-amber-200/50">
      {moles.map((mole) => (
        <MoleBurrow key={mole.id} index={mole.id} />
      ))}
    </div>
  );
}