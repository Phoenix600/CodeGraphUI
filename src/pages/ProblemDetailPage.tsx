import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProblemDetail } from '../types';
import { apiService } from '../services/api';
import { ProblemDetailView } from '../components/ProblemDetailView';
import { Loading } from '../components/Loading';

export const ProblemDetailPage: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblemDetail = async () => {
      if (!problemId) return;
      try {
        const data = await apiService.getProblemDetail(problemId);
        setProblem(data);
      } catch (error) {
        console.error('Failed to fetch problem detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblemDetail();
  }, [problemId]);

  if (loading) return <Loading />;
  if (!problem) return <div className="text-center p-12 text-zinc-500">Problem not found.</div>;

  return <ProblemDetailView problem={problem} />;
};
