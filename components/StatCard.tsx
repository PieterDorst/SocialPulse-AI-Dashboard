import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down';
  icon: LucideIcon;
  colorClass: string;
  comparisonValue?: string;
  comparisonLabel?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  trend, 
  trendDirection, 
  icon: Icon, 
  colorClass,
  comparisonValue,
  comparisonLabel
}) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-colors h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-xl ${colorClass} bg-opacity-20`}>
            <Icon className={`w-6 h-6 ${colorClass.replace('bg-', 'text-')}`} />
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${trendDirection === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {trendDirection === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {trend}
          </div>
        </div>
        <h3 className="text-slate-400 text-sm font-medium mb-1">{label}</h3>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>

      {comparisonValue && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 truncate max-w-[100px]" title={comparisonLabel}>
              vs {comparisonLabel}
            </span>
            <span className="font-semibold text-slate-300">{comparisonValue}</span>
          </div>
        </div>
      )}
    </div>
  );
};