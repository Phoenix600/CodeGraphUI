import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ChapterListPage } from './pages/ChapterListPage';
import { ProblemListPage } from './pages/ProblemListPage';
import { ProblemDetailPage } from './pages/ProblemDetailPage';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ChapterListPage />} />
          <Route path="/chapter/:chapterId" element={<ProblemListPage />} />
          <Route path="/problem/:problemId" element={<ProblemDetailPage />} />
          {/* Fallback routes */}
          <Route path="/problems" element={<Navigate to="/" replace />} />
          <Route path="/profile" element={<div className="p-12 text-center text-zinc-500">Profile page coming soon.</div>} />
          <Route path="/settings" element={<div className="p-12 text-center text-zinc-500">Settings page coming soon.</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
