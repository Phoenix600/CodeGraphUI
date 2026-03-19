import React from 'react';
import { motion } from 'motion/react';
import { ProblemDetail } from '../types';
import { cn } from '../lib/utils';
import { ArrowLeft, CheckCircle2, Circle, HelpCircle, Lightbulb, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProblemDetailViewProps {
  problem: ProblemDetail;
}

export const ProblemDetailView: React.FC<ProblemDetailViewProps> = ({ problem }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-emerald-500 bg-emerald-50';
      case 'Medium': return 'text-amber-500 bg-amber-50';
      case 'Hard': return 'text-rose-500 bg-rose-50';
      default: return 'text-zinc-500 bg-zinc-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Solved': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'Attempted': return <HelpCircle className="w-5 h-5 text-amber-500" />;
      default: return <Circle className="w-5 h-5 text-zinc-300" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6 space-y-8"
    >
      <div className="flex items-center justify-between">
        <Link
          to={`/chapter/${problem.chapterId}`}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Chapter
        </Link>
        <div className="flex items-center gap-2">
          {getStatusIcon(problem.status)}
          <span className="text-sm font-medium text-zinc-500">{problem.status}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-zinc-900">{problem.title}</h1>
          <span className={cn(
            "text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full",
            getDifficultyColor(problem.difficulty)
          )}>
            {problem.difficulty}
          </span>
        </div>
        <p className="text-zinc-600 leading-relaxed whitespace-pre-line">
          {problem.description}
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-zinc-400" />
          Examples
        </h2>
        <div className="grid gap-6">
          {problem.examples.map((example, i) => (
            <div key={i} className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Input</span>
                <code className="block text-sm font-mono text-zinc-800 bg-white p-2 rounded border border-zinc-100">
                  {example.input}
                </code>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Output</span>
                <code className="block text-sm font-mono text-zinc-800 bg-white p-2 rounded border border-zinc-100">
                  {example.output}
                </code>
              </div>
              {example.explanation && (
                <div className="space-y-1">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Explanation</span>
                  <p className="text-sm text-zinc-600">{example.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-zinc-900">Constraints</h2>
          <ul className="space-y-2">
            {problem.constraints.map((constraint, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-1.5 flex-shrink-0" />
                {constraint}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            Hints
          </h2>
          <div className="space-y-3">
            {problem.hints.map((hint, i) => (
              <details key={i} className="group bg-amber-50/50 border border-amber-100 rounded-lg overflow-hidden">
                <summary className="p-3 text-sm font-medium text-amber-900 cursor-pointer hover:bg-amber-50 transition-colors list-none flex items-center justify-between">
                  <span>Hint {i + 1}</span>
                  <span className="text-amber-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="p-3 pt-0 text-sm text-amber-800/80 leading-relaxed">
                  {hint}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
