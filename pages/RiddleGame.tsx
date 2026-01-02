import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Lightbulb, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { generateRiddle } from '../services/geminiService';
import { Riddle } from '../types';

export const RiddleGame: React.FC = () => {
  const [riddle, setRiddle] = useState<Riddle | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const loadNewRiddle = async () => {
    setLoading(true);
    setShowHint(false);
    setShowAnswer(false);
    const data = await generateRiddle();
    setRiddle(data);
    setLoading(false);
  };

  useEffect(() => {
    loadNewRiddle();
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Lightbulb className="text-yellow-400" />
          AI論理パズル
        </h2>
        <Button onClick={loadNewRiddle} variant="secondary" disabled={loading}>
            {loading ? '生成中...' : '次の問題'}
        </Button>
      </div>

      <Card className="min-h-[400px] flex flex-col relative">
        {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                <p className="text-slate-400">AIが問題を生成しています...</p>
            </div>
        ) : riddle ? (
            <div className="flex-1 space-y-8 p-4">
                <div className="space-y-4">
                    <h3 className="text-lg text-indigo-300 font-semibold flex items-center gap-2">
                        <HelpCircle size={20} /> 問題
                    </h3>
                    <p className="text-xl text-white leading-relaxed">
                        {riddle.question}
                    </p>
                </div>

                {showHint && (
                    <div className="bg-yellow-900/20 border border-yellow-700/50 p-4 rounded-lg">
                        <p className="text-yellow-200 text-sm"><span className="font-bold">ヒント:</span> {riddle.hint}</p>
                    </div>
                )}

                {showAnswer && (
                    <div className="bg-green-900/20 border border-green-700/50 p-6 rounded-lg animate-in fade-in slide-in-from-bottom-4">
                        <p className="text-green-400 text-sm font-bold mb-1">正解:</p>
                        <p className="text-2xl text-white font-bold">{riddle.answer}</p>
                    </div>
                )}
            </div>
        ) : (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-red-400">問題の読み込みに失敗しました。</p>
            </div>
        )}

        <div className="mt-auto border-t border-slate-700 pt-6 flex gap-4">
            <Button 
                variant="secondary" 
                className="flex-1"
                onClick={() => setShowHint(!showHint)}
                disabled={loading || showAnswer}
            >
                {showHint ? 'ヒントを隠す' : 'ヒントを見る'}
            </Button>
            <Button 
                variant="primary" 
                className="flex-1"
                onClick={() => setShowAnswer(!showAnswer)}
                disabled={loading}
            >
                {showAnswer ? <><EyeOff className="mr-2" size={18}/> 答えを隠す</> : <><Eye className="mr-2" size={18}/> 答えを見る</>}
            </Button>
        </div>
      </Card>
    </div>
  );
};