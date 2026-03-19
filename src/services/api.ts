import { Chapter, Problem, ProblemDetail } from '../types';

// Mock data
const CHAPTERS: Chapter[] = [
  { id: '1', title: 'Arrays & Hashing', description: 'Master the fundamentals of data structures with arrays and hash maps.', problemCount: 12 },
  { id: '2', title: 'Two Pointers', description: 'Learn how to traverse linear data structures with multiple pointers.', problemCount: 8 },
  { id: '3', title: 'Sliding Window', description: 'Optimize your algorithms using the sliding window technique.', problemCount: 6 },
  { id: '4', title: 'Stack', description: 'Understand the LIFO principle and its applications in problem solving.', problemCount: 10 },
];

const PROBLEMS: Record<string, Problem[]> = {
  '1': [
    { id: '101', chapterId: '1', title: 'Two Sum', difficulty: 'Easy', status: 'Solved' },
    { id: '102', chapterId: '1', title: 'Contains Duplicate', difficulty: 'Easy', status: 'Solved' },
    { id: '103', chapterId: '1', title: 'Valid Anagram', difficulty: 'Easy', status: 'Unsolved' },
    { id: '104', chapterId: '1', title: 'Group Anagrams', difficulty: 'Medium', status: 'Attempted' },
  ],
  '2': [
    { id: '201', chapterId: '2', title: 'Valid Palindrome', difficulty: 'Easy', status: 'Solved' },
    { id: '202', chapterId: '2', title: 'Two Sum II', difficulty: 'Medium', status: 'Unsolved' },
    { id: '203', chapterId: '2', title: '3Sum', difficulty: 'Medium', status: 'Attempted' },
  ],
};

const PROBLEM_DETAILS: Record<string, ProblemDetail> = {
  '101': {
    id: '101',
    chapterId: '1',
    title: 'Two Sum',
    difficulty: 'Easy',
    status: 'Solved',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    hints: [
      'A brute force solution would be O(n^2). Can we do better?',
      'Try using a hash map to store the complement of each number.',
    ],
  },
};

// API Service
export const apiService = {
  getChapters: async (): Promise<Chapter[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return CHAPTERS;
  },

  getProblemsByChapter: async (chapterId: string): Promise<Problem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return PROBLEMS[chapterId] || [];
  },

  getProblemDetail: async (problemId: string): Promise<ProblemDetail | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return PROBLEM_DETAILS[problemId] || null;
  },
};
