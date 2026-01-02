import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Grid3X3, Play } from 'lucide-react';
import { GameType, GameResult } from '../types';

type GridState = 'IDLE' | 'SHOWING' | 'INPUT' | 'GAME_OVER';

export const MemoryGame: React.FC = () => {
  const [gridSize] = useState(3); // 3x3 grid
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [gameState, setGameState] = useState<GridState>('IDLE');
  const [activeCell, setActiveCell] = useState<number | null>(null);
  const [level, setLevel] = useState(1);

  const startGame = () => {
    setSequence([]);
    setUserSequence([]);
    setLevel(1);
    setGameState('IDLE');
    setTimeout(() => nextLevel([]), 500);
  };

  const nextLevel = (currentSeq: number[]) => {
    const nextItem = Math.floor(Math.random() * (gridSize * gridSize));
    const newSeq = [...currentSeq, nextItem];
    setSequence(newSeq);
    setUserSequence([]);
    setGameState('SHOWING');
    playSequence(newSeq);
  };

  const playSequence = async (seq: number[]) => {
    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 500));
      setActiveCell(seq[i]);
      await new Promise(r => setTimeout(r, 500));
      setActiveCell(null);
    }
    setGameState('INPUT');
  };

  const handleCellClick = (index: number) => {
    if (gameState !== 'INPUT') return;

    // Flash click effect
    setActiveCell(index);
    setTimeout(() => setActiveCell(null), 200);

    const nextIndex = userSequence.length;
    if (index === sequence[nextIndex]) {
      const newUserSeq = [...userSequence, index];
      setUserSequence(newUserSeq);

      if (newUserSeq.length === sequence.length) {
        // Level complete
        setLevel(l => l + 1);
        setGameState('IDLE');
        setTimeout(() => nextLevel(sequence), 1000);
      }
    } else {
      // Wrong
      setGameState('GAME_OVER');
      saveScore();
    }
  };

  const saveScore = () => {
    const history = JSON.parse(localStorage.getItem('neuroboost_history') || '[]');
    const result: GameResult = {
      date: new Date().toISOString(),
      type: GameType.MEMORY,
      score: (level - 1) * 100,
      details: `Level ${level}`
    };
    localStorage.setItem('neuroboost_history', JSON.stringify([...history, result]));
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Grid3X3 className="text-emerald-400" />
          パターン記憶
        </h2>
        <div className="bg-slate-800 px-4 py-1 rounded-full text-emerald-400 font-bold border border-emerald-900">
            Level {level}
        </div>
      </div>

      <Card className="flex flex-col items-center justify-center p-8">
        {gameState === 'IDLE' && level === 1 && (
            <div className="text-center py-10">
                <p className="text-slate-300 mb-6">光るタイルの順番を覚えて、<br/>同じ順番でタップしてください。</p>
                <Button onClick={startGame} size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                    <Play className="mr-2" size={20} /> スタート
                </Button>
            </div>
        )}

        {gameState === 'GAME_OVER' && (
            <div className="text-center py-10">
                <h3 className="text-3xl font-bold text-red-500 mb-2">Game Over</h3>
                <p className="text-slate-400 mb-6">到達レベル: {level}</p>
                <Button onClick={startGame} size="lg">もう一度挑戦</Button>
            </div>
        )}

        {(gameState === 'SHOWING' || gameState === 'INPUT' || (gameState === 'IDLE' && level > 1)) && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-slate-900 rounded-xl shadow-inner">
            {Array.from({ length: gridSize * gridSize }).map((_, i) => (
              <button
                key={i}
                disabled={gameState !== 'INPUT'}
                onClick={() => handleCellClick(i)}
                className={`
                  w-20 h-20 rounded-lg transition-all duration-100 border-2
                  ${activeCell === i 
                    ? 'bg-emerald-400 border-emerald-200 shadow-[0_0_15px_rgba(52,211,153,0.8)] scale-95' 
                    : 'bg-slate-700 border-slate-600 hover:border-emerald-500/50'}
                `}
              />
            ))}
          </div>
        )}
        
        <div className="h-8 mt-4">
             {gameState === 'SHOWING' && <p className="text-emerald-400 animate-pulse">パターンを記憶してください...</p>}
             {gameState === 'INPUT' && <p className="text-white">あなたの番です</p>}
        </div>
      </Card>
    </div>
  );
};