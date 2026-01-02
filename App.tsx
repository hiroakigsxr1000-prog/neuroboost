import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ReflexGame } from './pages/ReflexGame';
import { MathGame } from './pages/MathGame';
import { MemoryGame } from './pages/MemoryGame';
import { RiddleGame } from './pages/RiddleGame';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reflex" element={<ReflexGame />} />
          <Route path="/calc" element={<MathGame />} />
          <Route path="/memory" element={<MemoryGame />} />
          <Route path="/riddle" element={<RiddleGame />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;