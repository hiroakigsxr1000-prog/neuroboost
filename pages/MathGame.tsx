import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Calculator, Timer, CheckCircle, XCircle } from 'lucide-react';
import { GameType, GameResult } from '../types';

export const MathGame: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [problem, setProblem] = useState("");
  const [answer, setAnswer] = useState<number | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const generateProblem = () => {
    const operators = ['+', '-', '*'];
    const op = operators[Math.floor(Math.random() * operators.length)];
    let a = Math.floor(Math.random() * 20) + 1;
    let b = Math.floor(Math.random() * 20) + 1;

    // Simplify logic to avoid negative or too complex
    if (op === '-') {
      if (a < b) [a, b] = [b, a]; // Ensure positive
    } else if (op === '*') {
      a = Math.floor(Math.random() * 12) + 1; // Smaller numbers for multiplication
      b = Math.floor(Math.random() * 12) + 1;
    }

    setProblem(`${a} ${op} ${b}`);
    // eslint-disable-next-line no-eval
    setAnswer(eval(`${a} ${op} ${b}`));
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    generateProblem();
    setTimeout(() => {
        if(inputRef.current) inputRef.current.focus();
    }, 100);
  };

  const endGame = () => {
    setIsPlaying(false);
    
    const history = JSON.parse(localStorage.getItem('neuroboost_history') || '[]');
    const result: GameResult = {
      date: new Date().toISOString(),
      type: GameType.CALCULATION,
      score: score * 10,
      details: `${score}問正解`
    };
    localStorage.setItem('neuroboost_history', JSON.stringify([...history, result]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(userAnswer);
    if (isNaN(val)) return;

    if (val === answer) {
      setScore(s => s + 1);
      setFeedback('correct');
      generateProblem();
    } else {
      setFeedback('wrong');
    }
    setUserAnswer("");
    setTimeout(() => setFeedback(null), 500);
  };

  useEffect(() => {
    let timer: number | undefined;
    if (isPlaying && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      endGame();
    }
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, timeLeft]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Calculator className="text-blue-400" />
          計算スピードラン
        </h2>
        <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-slate-300">
                <Timer size={18} />
                <span className={`font-mono text-xl ${timeLeft <= 5 ? 'text-red-500' : 'text-white'}`}>{timeLeft}s</span>
             </div>
             <div className="bg-slate-800 px-3 py-1 rounded border border-slate-700">
                Score: <span className="font-bold text-blue-400">{score}</span>
             </div>
        </div>
      </div>

      <Card className="h-80 flex flex-col items-center justify-center">
        {!isPlaying && timeLeft === 30 && (
          <div className="text-center space-y-6">
            <p className="text-slate-300">30秒間でできるだけ多くの問題を解いてください。</p>
            <Button onClick={startGame} size="lg">スタート</Button>
          </div>
        )}

        {!isPlaying && timeLeft === 0 && (
          <div className="text-center space-y-6">
             <h3 className="text-3xl font-bold text-white">Time Up!</h3>
             <p className="text-xl text-blue-300">正解数: {score}</p>
             <Button onClick={startGame} size="lg">もう一度</Button>
          </div>
        )}

        {isPlaying && (
          <div className="w-full max-w-sm space-y-8 relative">
             {feedback && (
                <div className={`absolute -top-16 left-1/2 transform -translate-x-1/2 text-6xl animate-bounce`}>
                    {feedback === 'correct' ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
                </div>
             )}
             
             <div className="text-6xl font-bold text-white text-center font-mono">
                {problem}
             </div>

             <form onSubmit={handleSubmit} className="flex gap-2">
                <input 
                    ref={inputRef}
                    type="number" 
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="flex-1 bg-slate-900 border-2 border-slate-700 rounded-lg px-4 py-3 text-2xl text-center text-white focus:border-blue-500 focus:outline-none"
                    placeholder="?"
                    autoFocus
                />
                <Button type="submit" className="w-24">回答</Button>
             </form>
          </div>
        )}
      </Card>
    </div>
  );
};