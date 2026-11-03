import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`flex items-center gap-1 p-1 bg-navy-950/80 border border-navy-border rounded-control ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            role="tab"
            aria-selected={isActive}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded text-xs font-medium transition-all ${
              isActive
                ? 'bg-navy-800 text-cyan-light border border-navy-border shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900/50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

