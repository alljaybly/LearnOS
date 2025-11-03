import React from 'react';
import type { View } from '../types';
import { BookOpenIcon, ChartBarIcon, HomeIcon, CameraIcon } from './icons';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const navItems: { name: string; view: View; icon: React.ReactElement }[] = [
    { name: 'Dashboard', view: 'dashboard', icon: <HomeIcon /> },
    { name: 'Photo Scan', view: 'ocr', icon: <CameraIcon /> },
    { name: 'Study Session', view: 'study', icon: <BookOpenIcon /> },
    { name: 'Progress', view: 'progress', icon: <ChartBarIcon /> },
  ];

  return (
    <header className="bg-surface shadow-md sticky top-0 z-10">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-primary font-bold text-2xl">
              LearnOS
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setView(item.view)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === item.view
                      ? 'bg-primary text-on-primary'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
       {/* Mobile navigation */}
       <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-200">
            <div className="flex justify-around">
                {navItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => setView(item.view)}
                        className={`flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs font-medium transition-colors ${
                            currentView === item.view
                                ? 'text-primary'
                                : 'text-gray-500'
                        }`}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </button>
                ))}
            </div>
        </div>
    </header>
  );
};