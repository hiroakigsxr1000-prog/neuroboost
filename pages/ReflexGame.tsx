import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Zap, RotateCcw } from 'lucide-react';
import { GameType, GameResult } from '../types';

type GameState = 'IDLE' | 'WAITING' | 'READY' | 'CLICK' | 'RESULT' | 'TOO_EARLY';

export const ReflexGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);

  const MAX_ATTEMPTS = 5;

  const startGame = () => {
    setAttempts([]);
    nextRound();
  };

  const nextRound = () => {
    setGameState('WAITING');
    setReactionTime(null);
    
    // Random delay between 2 and 5 seconds
    const delay = Math.floor(Math.random() * 3000) + 2000;
    
    timeoutRef.current = window.setTimeout(() => {
      setGameState('CLICK');
      startTimeRef.current = performance.now();
    }, delay);
  };

  const handleClick = () => {
    if (gameState === 'WAITING') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setGameState('TOO_EARLY');
    } else if (gameState === 'CLICK') {
      const endTime = performance.now();
      const time = Math.round(endTime - startTimeRef.current);
      setReactionTime(time);
      const newAttempts = [...attempts, time];
      setAttempts(newAttempts);

      if (newAttempts.length >= MAX_ATTEMPTS) {
        finishGame(newAttempts);
      } else {
        setGameState('RESULT');
      }
    }
  };

  const finishGame = (finalAttempts: number[]) => {
    setGameState('IDLE');
    const avg = Math.round(finalAttempts.reduce((a, b) => a + b, 0) / finalAttempts.length);
    
    // Save Result
    const history = JSON.parse(localStorage.getItem('neuroboost_history') || '[]');
    const result: GameResult = {
      date: new Date().toISOString(),
      type: GameType.REFLEX,
      score: 1000 - avg > 0 ? 1000 - avg : 0, // Score logic
      details: `Avg: ${avg}ms`
    };
    localStorage.setItem('neuroboost_history', JSON.stringify([...history, result]));
  };

  const retryRound = () => {
    nextRound();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Zap className="text-yellow-400" />
          瞬発力テスト
        </h2>
        <div className="text-slate-400">
          Round: {attempts.length} / {MAX_ATTEMPTS}
        </div>
      </div>

      <Card className="h-96 flex flex-col items-center justify-center relative overflow-hidden">
        {gameState === 'IDLE' && (
          <div className="text-center space-y-6">
            <p className="text-slate-300 text-lg">
              画面が<span className="text-green-400 font-bold">緑色</span>になったら、<br/>
              できるだけ早くクリックしてください。
            </p>
            {attempts.length > 0 && (
              <div className="bg-slate-900/50 p-4 rounded-lg">
                <p className="text-xl font-bold text-white">
                  平均反応速度: <span className="text-yellow-400">{Math.round(attempts.reduce((a,b)=>a+b,0)/attempts.length)}ms</span>
                </p>
              </div>
            )}
            <Button onClick={startGame} size="lg">スタート</Button>
          </div>
        )}

        {gameState === 'WAITING' && (
          <div 
            className="absolute inset-0 bg-red-500 cursor-pointer flex items-center justify-center"
            onMouseDown={handleClick}
          >
            <p className="text-white text-3xl font-bold animate-pulse">待て...</p>
          </div>
        )}

        {gameState === 'CLICK' && (
          <div 
            className="absolute inset-0 bg-green-500 cursor-pointer flex items-center justify-center"
            onMouseDown={handleClick}
          >
            <p className="text-white text-4xl font-bold">クリック！</p>
          </div>
        )}

        {gameState === 'TOO_EARLY' && (
          <div className="text-center space-y-4">
            <p className="text-red-400 text-2xl font-bold">早すぎます！</p>
            <p className="text-slate-400">緑色になるまで待ってください。</p>
            <Button onClick={retryRound} variant="secondary">やり直す</Button>
          </div>
        )}

        {gameState === 'RESULT' && (
          <div className="text-center space-y-4">
             <p className="text-slate-300">反応時間</p>
             <p className="text-5xl font-bold text-white font-mono">{reactionTime}ms</p>
             <Button onClick={nextRound} className="mt-4">次へ</Button>
          </div>
        )}
      </Card>
      
      {attempts.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
            {attempts.map((t, i) => (
                <div key={i} className="bg-slate-800 p-2 rounded text-center text-sm border border-slate-700">
                    <div className="text-slate-500">#{i+1}</div>
                    <div className="text-white font-mono">{t}ms</div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};