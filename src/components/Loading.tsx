import React from 'react';
import { motion } from 'motion/react';

export const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-12 h-12 border-4 border-zinc-900 border-t-transparent rounded-full"
      />
      <p className="text-sm font-medium text-zinc-500 animate-pulse">Loading data...</p>
    </div>
  );
};
