
import React from 'react';
import { Clock, Scissors, FileText, Zap } from 'lucide-react';

interface StatsProps {
  stats: {
    originalWords: number;
    summaryWords: number;
    reduction: number;
    readingTime: number;
  };
}

const StatsPanel: React.FC<StatsProps> = ({ stats }) => {
  const cards = [
    { 
      label: 'Original Length', 
      value: `${stats.originalWords} words`, 
      icon: <FileText size={18} className="text-slate-400" />
    },
    { 
      label: 'Summary Length', 
      value: `${stats.summaryWords} words`, 
      icon: <Scissors size={18} className="text-indigo-400" />
    },
    { 
      label: 'Reduction', 
      value: `${stats.reduction}%`, 
      icon: <Zap size={18} className="text-yellow-500" />
    },
    { 
      label: 'Reading Time', 
      value: `~${stats.readingTime} min`, 
      icon: <Clock size={18} className="text-emerald-400" />
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div 
          key={i} 
          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/50 flex flex-col gap-3 shadow-sm"
        >
          <div className="flex items-center justify-between">
            {card.icon}
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Metric</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-xs text-slate-500">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsPanel;
