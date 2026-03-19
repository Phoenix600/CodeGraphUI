export interface Chapter {
  id: string;
  title: string;
  description: string;
  problemCount: number;
}

export interface Problem {
  id: string;
  chapterId: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'Solved' | 'Unsolved' | 'Attempted';
}

export interface ProblemDetail extends Problem {
  description: string;
  examples: Example[];
  constraints: string[];
  hints: string[];
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}
