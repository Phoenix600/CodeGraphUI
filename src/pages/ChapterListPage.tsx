import React, { useEffect, useState } from 'react';
import { Chapter } from '../types';
import { apiService } from '../services/api';
import { ChapterCard } from '../components/ChapterCard';
import { Loading } from '../components/Loading';
import { motion } from 'motion/react';

export const ChapterListPage: React.FC = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const data = await apiService.getChapters();
        setChapters(data);
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChapters();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-zinc-900 tracking-tight">Chapters</h1>
        <p className="text-zinc-500 text-lg">Select a chapter to start solving problems.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.map((chapter, index) => (
          <ChapterCard key={chapter.id} chapter={chapter} index={index} />
        ))}
      </div>
    </div>
  );
};
