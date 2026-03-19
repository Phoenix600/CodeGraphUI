import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, Github, LayoutDashboard, Settings, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Code2, label: 'Problems', path: '/problems' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col fixed h-full z-10">
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 bg-zinc-900 rounded-lg text-white">
            <Code2 className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-zinc-900 tracking-tight">CodeGraph</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                location.pathname === item.path
                  ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-zinc-100">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <Github className="w-5 h-5" />
            GitHub Repo
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-20 flex items-center justify-between px-8">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>Home</span>
            {location.pathname !== '/' && (
              <>
                <span className="text-zinc-300">/</span>
                <span className="text-zinc-900 font-medium">
                  {location.pathname.split('/')[1].charAt(0).toUpperCase() + location.pathname.split('/')[1].slice(1)}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-200 border border-zinc-300" />
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
