import React from 'react';
import { 
  BarChart3, 
  Code2, 
  BookOpen, 
  MessageSquare, 
  ChevronRight, 
  ChevronDown, 
  Search,
  LayoutGrid,
  Trophy,
  Settings,
  LogOut,
  User,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

import { DUMMY_USER } from '../constants';

interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  count?: string;
  subItems?: { label: string; completed?: boolean; active?: boolean }[];
  isOpen?: boolean;
  onToggle?: () => void;
  onItemClick?: () => void;
}

const SidebarItem = ({ icon, label, active, count, subItems, isOpen, onToggle, onItemClick }: SidebarItemProps) => {
  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 rounded-md transition-all duration-200",
          active ? "bg-zinc-800/50 text-white" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/30"
        )}
      >
        <div className="flex items-center gap-4">
          <motion.span 
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="text-zinc-600 flex items-center justify-center"
          >
            {icon || <ChevronRight size={14} strokeWidth={3} />}
          </motion.span>
          <span className="text-[15px] font-bold tracking-tight">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {count && <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-bold">{count}</span>}
        </div>
      </button>
      
      <AnimatePresence>
        {subItems && isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="ml-9 mt-1 space-y-1 pb-2">
              {subItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={onItemClick}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors",
                    item.active ? "text-orange-500 bg-orange-500/10" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {item.completed ? (
                      <CheckCircle2 size={12} className="text-orange-500" />
                    ) : (
                      <Circle size={12} className="text-zinc-600" />
                    )}
                    <span>{item.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface SidebarProps {
  isVisible: boolean;
  onToggle: () => void;
  onProfileClick?: () => void;
}

export default function Sidebar({ isVisible, onToggle, onProfileClick }: SidebarProps) {
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({ 'Sorting': true });

  const toggleSection = (label: string) => {
    setOpenSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.aside 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 256, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-[#0A0A0A] border-r border-zinc-800 flex flex-col h-screen sticky top-0 overflow-hidden whitespace-nowrap"
        >
          <div className="w-64 flex flex-col h-full">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-600 rounded flex items-center justify-center text-white shadow-lg shadow-orange-900/20">
                  <Code2 size={18} strokeWidth={2.5} />
                </div>
                <span className="font-bold text-lg tracking-tight text-zinc-100">Code Graph</span>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
                <input 
                  type="text" 
                  placeholder="Search chapters..." 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-md py-1.5 pl-8 pr-3 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700 transition-colors"
                />
              </div>
            </div>

      <div className="flex gap-1 px-4 mb-4">
        <button className="flex-1 py-1 text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-400 rounded">Basic</button>
        <button className="flex-1 py-1 text-[10px] font-bold uppercase tracking-wider bg-zinc-700 text-white rounded border border-zinc-600">Advanced</button>
        <div className="flex items-center px-2 text-[10px] text-zinc-500 font-mono">81/435</div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 custom-scrollbar py-2">
        <SidebarItem 
          label="Sorting" 
          isOpen={openSections['Sorting']}
          onToggle={() => toggleSection('Sorting')}
          onItemClick={onToggle}
          subItems={[
            { label: 'Selection Sort', completed: true },
            { label: 'Bubble Sort', completed: true, active: true },
            { label: 'Insertion Sort', completed: false },
            { label: 'Merge Sorting', completed: false },
            { label: 'Quick Sorting', completed: false },
          ]}
        />
        <SidebarItem 
          label="Arrays" 
          isOpen={openSections['Arrays']}
          onToggle={() => toggleSection('Arrays')}
          onItemClick={onToggle}
          subItems={[{ label: 'Two Sum', completed: false }]}
        />
        <SidebarItem 
          label="Hashing" 
          isOpen={openSections['Hashing']}
          onToggle={() => toggleSection('Hashing')}
          onItemClick={onToggle}
          subItems={[{ label: 'Contains Duplicate', completed: false }]}
        />
        <SidebarItem 
          label="Binary Search" 
          isOpen={openSections['Binary Search']}
          onToggle={() => toggleSection('Binary Search')}
          onItemClick={onToggle}
          subItems={[{ label: 'Binary Search', completed: false }]}
        />
        <SidebarItem 
          label="Recursion" 
          isOpen={openSections['Recursion']}
          onToggle={() => toggleSection('Recursion')}
          onItemClick={onToggle}
          subItems={[{ label: 'Fibonacci Number', completed: false }]}
        />
        <SidebarItem 
          label="Linked-List" 
          isOpen={openSections['Linked-List']}
          onToggle={() => toggleSection('Linked-List')}
          onItemClick={onToggle}
          subItems={[{ label: 'Reverse Linked List', completed: false }]}
        />
        <SidebarItem 
          label="Bit Manipulation" 
          isOpen={openSections['Bit Manipulation']}
          onToggle={() => toggleSection('Bit Manipulation')}
          onItemClick={onToggle}
          subItems={[{ label: 'Number of 1 Bits', completed: false }]}
        />
        <SidebarItem 
          label="Greedy Algorithms" 
          isOpen={openSections['Greedy Algorithms']}
          onToggle={() => toggleSection('Greedy Algorithms')}
          onItemClick={onToggle}
          subItems={[{ label: 'Assign Cookies', completed: false }]}
        />
        <SidebarItem 
          label="Sliding Window" 
          isOpen={openSections['Sliding Window']}
          onToggle={() => toggleSection('Sliding Window')}
          onItemClick={onToggle}
          subItems={[{ label: 'Longest Substring Without Repeating Characters', completed: false }]}
        />
        <SidebarItem 
          label="Stack / Queues" 
          isOpen={openSections['Stack / Queues']}
          onToggle={() => toggleSection('Stack / Queues')}
          onItemClick={onToggle}
          subItems={[{ label: 'Valid Parentheses', completed: false }]}
        />
      </div>

      <div className="p-4 border-t border-zinc-800 space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors">
          <Trophy size={16} />
          <span>Track</span>
        </button>
        <div 
          onClick={onProfileClick}
          className="flex items-center gap-3 px-3 py-2 mt-2 cursor-pointer hover:bg-zinc-800/50 rounded-lg transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-zinc-200 transition-colors overflow-hidden">
            <img 
              src={DUMMY_USER.avatarUrl} 
              alt="avatar" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-200 truncate">{DUMMY_USER.name}</p>
          </div>
          <ChevronRight size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
        </div>
      </div>
    </div>
  </motion.aside>
)}
</AnimatePresence>
);
}
