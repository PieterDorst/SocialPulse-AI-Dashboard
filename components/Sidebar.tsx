import React from 'react';
import { Megaphone, PlusCircle, Settings, LogOut, Activity } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'create', label: 'New Campaign', icon: PlusCircle },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full fixed left-0 top-0 z-10 print:hidden">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">SocialPulse</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors">
          <Settings size={20} />
          <span>Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors mt-1">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};