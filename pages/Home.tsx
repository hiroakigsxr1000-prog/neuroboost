import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Trophy, Play, BrainCircuit } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { GameResult } from '../types';
import { analyzePerformance } from '../services/geminiService';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const Home: React.FC = () => {
  const [history, setHistory] = useState<GameResult[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('neuroboost_history');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const handleAnalysis = async () => {
    setLoadingAnalysis(true);
    const result = await analyzePerformance(history);
    setAnalysis(result);
    setLoadingAnalysis(false);
  };

  const chartData = history.slice(-10).map((h, i) => ({
    name: i.toString(),
    score: h.score,
    type: h.type
  }));

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">ようこそ、脳トレへ</h1>
          <p className="text-slate-400 mt-2">今日のトレーニングを始めましょう。</p>
        </div>
        <Button onClick={handleAnalysis} disabled={loadingAnalysis || history.length === 0} className="w-full md:w-auto">
          {loadingAnalysis ? 'AI分析中...' : 'AIアドバイスを受け取る'}
        </Button>
      </div>

      {analysis && (
        <Card className="border-indigo-500/50 bg-indigo-900/20">
          <div className="flex items-start space-x-4">
            <BrainCircuit className="text-indigo-400 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-indigo-300 mb-2">AIトレーナーからのアドバイス</h3>
              <p className="text-slate-200 leading-relaxed">{analysis}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="最近のスコア推移">
           <div className="h-64 w-full">
            {history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="name" hide />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
                    itemStyle={{ color: '#818cf8' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                データがありません
              </div>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          <Link to="/reflex" className="group">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 relative overflow-hidden transition-transform group-hover:scale-[1.02]">
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-1">瞬発力トレーニング</h3>
                <p className="text-orange-100 text-sm">反応速度を限界まで高める</p>
              </div>
              <Activity className="absolute right-4 bottom-4 text-white/20" size={64} />
            </div>
          </Link>
          
          <Link to="/calc" className="group">
             <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 relative overflow-hidden transition-transform group-hover:scale-[1.02]">
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-1">計算力トレーニング</h3>
                <p className="text-blue-100 text-sm">高速演算で脳を活性化</p>
              </div>
              <Activity className="absolute right-4 bottom-4 text-white/20" size={64} />
            </div>
          </Link>

          <Link to="/memory" className="group">
             <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-6 relative overflow-hidden transition-transform group-hover:scale-[1.02]">
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-1">記憶力トレーニング</h3>
                <p className="text-emerald-100 text-sm">短期記憶の容量を拡張する</p>
              </div>
              <Activity className="absolute right-4 bottom-4 text-white/20" size={64} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};