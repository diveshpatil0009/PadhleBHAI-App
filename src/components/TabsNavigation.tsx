import React from 'react';
import { 
  LayoutDashboard, 
  Library, 
  CalendarDays, 
  BookMarked, 
  Trophy,
  Layers,
  BarChart3
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'insights' | 'resources' | 'flashcards' | 'planner' | 'notebook' | 'achievements';

interface TabsNavigationProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  savedResourcesCount: number;
}

export const TabsNavigation: React.FC<TabsNavigationProps> = ({
  activeTab,
  onChangeTab,
  savedResourcesCount
}) => {
  const tabs = [
    { id: 'dashboard', label: "Today's Session", shortLabel: 'Session', icon: LayoutDashboard },
    { id: 'insights', label: 'Study Insights', shortLabel: 'Insights', icon: BarChart3 },
    { id: 'resources', label: 'NCERT Feeds', shortLabel: 'Feeds', icon: Library },
    { id: 'flashcards', label: 'Formula Cards', shortLabel: 'Cards', icon: Layers },
    { id: 'planner', label: 'Timetable', shortLabel: 'Planner', icon: CalendarDays },
    { id: 'notebook', label: 'Notebook', shortLabel: 'Notes', icon: BookMarked },
    { id: 'achievements', label: 'Achievements', shortLabel: 'Progress', icon: Trophy }
  ] as const;

  return (
    <>
      {/* Desktop & Tablet Top Tab Bar */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-transparent hidden sm:block">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap rounded-lg ${
                  isActive
                    ? 'text-zinc-900 dark:text-white font-semibold'
                    : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>
                {tab.id === 'resources' && savedResourcesCount > 0 && (
                  <span className="text-[10px] font-mono text-zinc-400">
                    ({savedResourcesCount})
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-indigo-600 dark:bg-indigo-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Sticky Bottom Navigation Bar (Android WebView / PWA standard) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 border-t border-zinc-200 dark:border-zinc-800 backdrop-blur-md px-1 py-1 flex items-center justify-around shadow-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-0.5 relative transition-colors ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {tab.id === 'resources' && savedResourcesCount > 0 && (
                  <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-indigo-600 text-white rounded-full text-[9px] flex items-center justify-center font-mono">
                    {savedResourcesCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 font-medium leading-none">
                {tab.shortLabel}
              </span>
              {isActive && (
                <span className="absolute bottom-0.5 w-5 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
};
