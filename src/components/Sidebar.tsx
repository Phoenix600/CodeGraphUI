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
import { cn } from '../lib/utils';

interface SidebarItemProps {
  icon?: React.ReactNode;
  label: string;
  active?: boolean;
  count?: string;
  subItems?: { label: string; completed?: boolean; active?: boolean }[];
  isOpen?: boolean;
  onToggle?: () => void;
}

const SidebarItem = ({ icon, label, active, count, subItems, isOpen, onToggle }: SidebarItemProps) => {
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
          <span className="text-zinc-600">
            {icon || <ChevronRight size={14} strokeWidth={3} />}
          </span>
          <span className="text-[15px] font-bold tracking-tight">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {count && <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-zinc-400 font-bold">{count}</span>}
          {subItems && (
            <span className="text-zinc-600">
              {isOpen ? <ChevronDown size={14} strokeWidth={3} /> : <ChevronRight size={14} strokeWidth={3} />}
            </span>
          )}
        </div>
      </button>
      
      {subItems && isOpen && (
        <div className="ml-9 mt-1 space-y-1">
          {subItems.map((item, idx) => (
            <button
              key={idx}
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
      )}
    </div>
  );
};

export default function Sidebar() {
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({ 'Sorting': true });

  const toggleSection = (label: string) => {
    setOpenSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside className="w-64 bg-[#0A0A0A] border-r border-zinc-800 flex flex-col h-screen sticky top-0">
      <div className="p-4 flex items-center gap-2">
        <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white font-bold italic">F</div>
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md py-1.5 pl-8 pr-3 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700"
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
          subItems={[
            { label: 'Selection Sort', completed: true },
            { label: 'Bubble Sort', completed: true, active: true },
            { label: 'Insertion Sort', completed: false },
            { label: 'Merge Sorting', completed: false },
            { label: 'Quick Sorting', completed: false },
          ]}
        />
        <SidebarItem label="Arrays" />
        <SidebarItem label="Hashing" />
        <SidebarItem label="Binary Search" />
        <SidebarItem label="Recursion" />
        <SidebarItem label="Linked-List" />
        <SidebarItem label="Bit Manipulation" />
        <SidebarItem label="Greedy Algorithms" />
        <SidebarItem label="Sliding Window" />
        <SidebarItem label="Stack / Queues" />
      </div>

      <div className="p-4 border-t border-zinc-800 space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition-colors">
          <Trophy size={16} />
          <span>Track</span>
        </button>
        <div className="flex items-center gap-3 px-3 py-2 mt-2">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
            <User size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-zinc-200 truncate">Pranay Ashok Ramteke</p>
          </div>
          <ChevronRight size={14} className="text-zinc-600" />
        </div>
      </div>
    </aside>
  );
}
