import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { Chapter } from '../types';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

interface ChapterCardProps {
  chapter: Chapter;
  index: number;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Link
        to={`/chapter/${chapter.id}`}
        className={cn(
          "block p-6 bg-white border border-zinc-200 rounded-2xl",
          "hover:border-zinc-400 hover:shadow-lg transition-all duration-300",
          "flex items-center justify-between"
        )}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-zinc-100 rounded-xl group-hover:bg-zinc-900 group-hover:text-white transition-colors">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">{chapter.title}</h3>
            <p className="text-sm text-zinc-500 line-clamp-1">{chapter.description}</p>
            <span className="text-xs font-medium text-zinc-400 mt-1 inline-block">
              {chapter.problemCount} Problems
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
      </Link>
    </motion.div>
  );
};
