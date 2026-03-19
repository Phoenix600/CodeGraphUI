import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Problem, Chapter } from '../types';
import { apiService } from '../services/api';
import { ProblemRow } from '../components/ProblemRow';
import { Loading } from '../components/Loading';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

export const ProblemListPage: React.FC = () => {
  const { chapterId } = useParams<{ chapterId: string }>();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!chapterId) return;
      try {
        const [problemsData, chaptersData] = await Promise.all([
          apiService.getProblemsByChapter(chapterId),
          apiService.getChapters(),
        ]);
        setProblems(problemsData);
        setChapter(chaptersData.find(c => c.id === chapterId) || null);
      } catch (error) {
        console.error('Failed to fetch problems:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [chapterId]);

  if (loading) return <Loading />;
  if (!chapter) return <div className="text-center p-12 text-zinc-500">Chapter not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="space-y-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Chapters
        </Link>

        <div className="flex items-start gap-6">
          <div className="p-4 bg-zinc-900 text-white rounded-2xl">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-zinc-900 tracking-tight">{chapter.title}</h1>
            <p className="text-zinc-500 text-lg max-w-2xl">{chapter.description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-4">
          <h2 className="text-lg font-bold text-zinc-900">Problems</h2>
          <span className="text-sm font-medium text-zinc-400">{problems.length} total</span>
        </div>
        <div className="grid gap-3">
          {problems.map((problem, index) => (
            <ProblemRow key={problem.id} problem={problem} index={index} />
          ))}
          {problems.length === 0 && (
            <div className="text-center p-12 bg-white border border-dashed border-zinc-200 rounded-2xl text-zinc-400">
              No problems found for this chapter yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
