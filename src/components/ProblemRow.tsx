import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, HelpCircle, ChevronRight } from 'lucide-react';
import { Problem } from '../types';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

interface ProblemRowProps {
  problem: Problem;
  index: number;
}

export const ProblemRow: React.FC<ProblemRowProps> = ({ problem, index }) => {
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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={`/problem/${problem.id}`}
        className={cn(
          "flex items-center justify-between p-4 bg-white border border-zinc-100 rounded-xl",
          "hover:border-zinc-300 hover:shadow-sm transition-all duration-200 group"
        )}
      >
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">{getStatusIcon(problem.status)}</div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 group-hover:text-zinc-700 transition-colors">
              {problem.title}
            </h4>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 inline-block",
              getDifficultyColor(problem.difficulty)
            )}>
              {problem.difficulty}
            </span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
      </Link>
    </motion.div>
  );
};
