import React from 'react';
import { StrategyPlan } from '../types';
import { Target, Clock, ArrowRight, TrendingUp } from 'lucide-react';

interface StrategyResultProps {
  plan: StrategyPlan;
}

export const StrategyResult: React.FC<StrategyResultProps> = ({ plan }) => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <Target size={150} />
        </div>
        <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
          Strategic Takeaway
        </span>
        <h1 className="text-3xl font-bold text-white mb-2">{plan.title}</h1>
        <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">{plan.executiveSummary}</p>
        
        <div className="mt-6 pt-6 border-t border-slate-700 flex gap-6 text-sm">
          <div>
            <span className="block text-slate-500 font-medium mb-1">Market Context</span>
            <span className="text-slate-300">{plan.marketContext}</span>
          </div>
        </div>
      </div>

      {/* Phase Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plan.phases.map((phase, idx) => (
          <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl p-6 relative">
            <div className="absolute -top-3 left-6 bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-xs font-bold text-emerald-400 uppercase">
              Phase {idx + 1}
            </div>
            <div className="flex justify-between items-start mb-4 mt-2">
              <h3 className="text-xl font-bold text-white">{phase.phaseName}</h3>
              <div className="flex items-center gap-1 text-slate-400 text-xs">
                <Clock size={12} /> {phase.duration}
              </div>
            </div>
            <ul className="space-y-3">
              {phase.keyActions.map((action, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <ArrowRight size={14} className="mt-1 text-emerald-500 shrink-0" />
                  {action}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Metrics & Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="text-blue-400" size={20} /> Success Metrics (KPIs)
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {plan.successMetrics.map((metric, idx) => (
              <div key={idx} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 text-sm text-slate-200">
                {metric}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Target className="text-purple-400" size={20} /> Channel Focus
          </h3>
          <div className="flex flex-wrap gap-2">
            {plan.recommendedChannels.map((channel, idx) => (
              <span key={idx} className="px-4 py-2 bg-slate-700 rounded-full text-sm text-white font-medium hover:bg-slate-600 transition-colors cursor-default">
                {channel}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
