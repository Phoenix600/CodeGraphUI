import Sidebar from './components/Sidebar';
import ContentArea from './components/ContentArea';
import EditorArea from './components/EditorArea';
import ProfileView from './components/ProfileView';
import ProfileDashboard from './components/ProfileDashboard';
import { Trophy, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import React from 'react';

import { DUMMY_USER } from './constants';

export default function App() {
  const [isSidebarVisible, setIsSidebarVisible] = React.useState(true);
  const [currentView, setCurrentView] = React.useState<'main' | 'profile' | 'profile-dashboard'>('main');
  const [userProfile, setUserProfile] = React.useState(DUMMY_USER);

  React.useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarVisible(false);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setIsSidebarVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (currentView === 'profile-dashboard') {
    return (
      <ProfileDashboard 
        user={userProfile}
        onBack={() => setCurrentView('main')} 
        onEdit={() => setCurrentView('profile')} 
      />
    );
  }

  if (currentView === 'profile') {
    return (
      <ProfileView 
        user={userProfile}
        onSave={(updatedUser) => {
          setUserProfile(updatedUser);
          setCurrentView('profile-dashboard');
        }}
        onBack={() => setCurrentView('profile-dashboard')} 
      />
    );
  }

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-zinc-300 font-sans overflow-hidden">
      <Sidebar 
        isVisible={isSidebarVisible} 
        onToggle={() => setIsSidebarVisible(!isSidebarVisible)} 
        onProfileClick={() => setCurrentView('profile-dashboard')}
      />
      
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-12 border-b border-zinc-800 flex items-center justify-between px-6 bg-[#0A0A0A] shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarVisible(!isSidebarVisible)}
              className="p-1.5 text-zinc-500 hover:text-zinc-200 transition-colors rounded-md hover:bg-zinc-800"
              title={isSidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
            >
              {isSidebarVisible ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Progress</span>
              <div className="w-48 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-orange-600"></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-500">
              <Trophy size={16} />
              Day {DUMMY_USER.streak}/45
            </div>
            <div className="flex items-center gap-3">
              <button className="p-1.5 text-zinc-500 hover:text-zinc-200 transition-colors">
                <div className="w-5 h-5 rounded-full border-2 border-zinc-700 flex items-center justify-center text-[10px]">?</div>
              </button>
              <button className="p-1.5 text-zinc-500 hover:text-zinc-200 transition-colors">
                <div className="w-5 h-5 rounded-full border-2 border-zinc-700 flex items-center justify-center text-[10px]">⚡</div>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Split */}
        <div className="flex-1 flex overflow-hidden">
          <ContentArea />
          <EditorArea />
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
    </div>
  );
}
