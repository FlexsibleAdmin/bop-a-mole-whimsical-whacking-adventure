import { create } from 'zustand';
import { sounds } from '@/lib/sounds';
export type MoleType = 'mole' | 'bunny' | 'bomb' | 'golden';
export type MoleStatus = 'hidden' | 'rising' | 'up' | 'hit';
export interface Mole {
  id: number;
  status: MoleStatus;
  type: MoleType;
  timeoutId?: number; // To clear timeouts if hit
}
interface GameState {
  score: number;
  highScore: number;
  timeLeft: number;
  gameState: 'idle' | 'playing' | 'finished';
  moles: Mole[];
  combo: number;
  // Actions
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  whackMole: (index: number) => number; // Returns points earned
  tick: (deltaMs: number) => void;
}
const GAME_DURATION = 60; // seconds
const SPAWN_RATE_BASE = 1000; // ms
const MIN_SPAWN_RATE = 400; // ms
// Helper to generate initial moles
const createMoles = (): Mole[] => 
  Array.from({ length: 9 }, (_, i) => ({
    id: i,
    status: 'hidden',
    type: 'mole'
  }));
export const useGameStore = create<GameState>((set, get) => ({
  score: 0,
  highScore: parseInt(localStorage.getItem('bop-high-score') || '0'),
  timeLeft: GAME_DURATION,
  gameState: 'idle',
  moles: createMoles(),
  combo: 0,
  startGame: () => {
    set({
      score: 0,
      timeLeft: GAME_DURATION,
      gameState: 'playing',
      moles: createMoles(),
      combo: 0
    });
    sounds.playPop();
  },
  endGame: () => {
    const { score, highScore } = get();
    const newHighScore = Math.max(score, highScore);
    localStorage.setItem('bop-high-score', newHighScore.toString());
    set({
      gameState: 'finished',
      highScore: newHighScore
    });
    sounds.playGameOver();
  },
  resetGame: () => {
    set({
      gameState: 'idle',
      score: 0,
      timeLeft: GAME_DURATION,
      moles: createMoles(),
      combo: 0
    });
  },
  whackMole: (index: number) => {
    const state = get();
    const moles = [...state.moles];
    const mole = moles[index];
    if (mole.status !== 'up' && mole.status !== 'rising') return 0;
    // Mark as hit
    mole.status = 'hit';
    moles[index] = mole;
    let points = 0;
    let combo = state.combo;
    if (mole.type === 'mole') {
      points = 10 + Math.min(combo, 5) * 2;
      combo += 1;
      sounds.playWhack();
    } else if (mole.type === 'golden') {
      points = 50 + Math.min(combo, 5) * 5;
      combo += 2;
      sounds.playBonus();
    } else if (mole.type === 'bunny') {
      points = -20;
      combo = 0;
      sounds.playMiss();
    } else if (mole.type === 'bomb') {
      points = -50;
      combo = 0;
      sounds.playMiss();
    }
    set({
      moles,
      score: Math.max(0, state.score + points),
      combo
    });
    // Hide mole after short delay (handled by UI animation usually, but we enforce state reset)
    setTimeout(() => {
      const currentMoles = [...get().moles];
      if (currentMoles[index].status === 'hit') {
        currentMoles[index].status = 'hidden';
        set({ moles: currentMoles });
      }
    }, 500);
    return points;
  },
  // Internal tick state
  _lastSpawn: 0,
  tick: (deltaMs: number) => {
    const state = get();
    if (state.gameState !== 'playing') return;
    // Update time
    const newTimeLeft = Math.max(0, state.timeLeft - (deltaMs / 1000));
    if (newTimeLeft <= 0) {
      state.endGame();
      return;
    }
    // Spawn logic
    // As time decreases, spawn rate increases
    const progress = 1 - (newTimeLeft / GAME_DURATION);
    const currentSpawnRate = SPAWN_RATE_BASE - (progress * (SPAWN_RATE_BASE - MIN_SPAWN_RATE));
    // We use a simple timestamp check for spawning
    // Note: In a real app we might store lastSpawn in state, but for perf we keep it in closure or ref if possible.
    // Since we are in a store, we can't easily use refs. We'll use a hidden property on the store object or just rely on probability per tick if tick is fixed.
    // Better: Random chance based on delta.
    // Probability to spawn per second = 1 / (currentSpawnRate / 1000)
    // Probability per tick = (deltaMs / currentSpawnRate)
    const spawnChance = deltaMs / currentSpawnRate;
    if (Math.random() < spawnChance) {
      const moles = [...state.moles];
      const hiddenIndices = moles
        .map((m, i) => m.status === 'hidden' ? i : -1)
        .filter(i => i !== -1);
      if (hiddenIndices.length > 0) {
        const randomIndex = hiddenIndices[Math.floor(Math.random() * hiddenIndices.length)];
        // Determine type
        const rand = Math.random();
        let type: MoleType = 'mole';
        if (rand > 0.95) type = 'golden';
        else if (rand > 0.85) type = 'bomb';
        else if (rand > 0.75) type = 'bunny';
        moles[randomIndex] = {
          ...moles[randomIndex],
          status: 'rising',
          type
        };
        // Auto hide after some time if not hit
        // We can't easily set timeouts in reducer-like pattern without cleanup.
        // Instead, we could add a 'spawnTime' to the mole and check it in tick.
        // For simplicity in this jam, we'll use setTimeout but it's slightly risky if game resets.
        // We'll accept the risk for Phase 1.
        const stayUpTime = Math.max(1000, 2000 - (progress * 1000)); // 2s down to 1s
        setTimeout(() => {
            // Check if still playing and mole is still rising/up (not hit)
            const currentStore = useGameStore.getState();
            if (currentStore.gameState !== 'playing') return;
            const currentMole = currentStore.moles[randomIndex];
            if (currentMole.status === 'rising' || currentMole.status === 'up') {
                const newMoles = [...currentStore.moles];
                newMoles[randomIndex].status = 'hidden';
                set({ moles: newMoles });
            }
        }, stayUpTime);
        // Immediately set to 'up' after animation delay (simulated)
        setTimeout(() => {
             const currentStore = useGameStore.getState();
             if (currentStore.gameState !== 'playing') return;
             const m = currentStore.moles[randomIndex];
             if (m.status === 'rising') {
                 const newMoles = [...currentStore.moles];
                 newMoles[randomIndex].status = 'up';
                 set({ moles: newMoles });
             }
        }, 100);
        set({ moles, timeLeft: newTimeLeft });
        sounds.playPop();
        return;
      }
    }
    set({ timeLeft: newTimeLeft });
  }
}));