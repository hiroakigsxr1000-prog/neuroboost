import React from 'react';
import { NavLink } from 'react-router-dom';
import { Brain, Zap, Calculator, Grid3X3, Lightbulb, BarChart2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navItems = [
    { to: '/', icon: <Brain size={20} />, label: 'ホーム' },
    { to: '/reflex', icon: <Zap size={20} />, label: '瞬発力' },
    { to: '/calc', icon: <Calculator size={20} />, label: '計算力' },
    { to: '/memory', icon: <Grid3X3 size={20} />, label: '記憶力' },
    { to: '/riddle', icon: <Lightbulb size={20} />, label: '論理力' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-800 p-4 flex items-center justify-between border-b border-slate-700 sticky top-0 z-50">
        <div className="flex items-center space-x-2 text-indigo-400">
          <Brain size={24} />
          <span className="font-bold text-lg text-white">NeuroBoost</span>
        </div>
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-800 border-r border-slate-700 h-screen sticky top-0">
        <div className="p-6 flex items-center space-x-3 text-indigo-400">
          <Brain size={32} />
          <span className="font-bold text-2xl text-white">NeuroBoost</span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Nav (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 flex justify-around p-2 z-50 pb-safe">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center p-2 rounded-lg ${
                isActive ? 'text-indigo-400' : 'text-slate-500'
              }`
            }
          >
            {item.icon}
            <span className="text-[10px] mt-1">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};