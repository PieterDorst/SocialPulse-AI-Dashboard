import React, { useState } from 'react';
import { generateStrategicPlan } from '../services/geminiService';
import { StrategyPlan } from '../types';
import { 
  Lightbulb, 
  Loader2, 
  Target, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Briefcase
} from 'lucide-react';

export const StrategyGenerator: React.FC = () => {
  const [formData, setFormData] = useState({
    brand: '',
    challenge: '',
    goal: '',
    timeline: 'Q4 2024'
  });
  const [plan, setPlan] = useState<StrategyPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!formData.brand || !formData.challenge || !formData.goal) return;
    
    setLoading(true);
    try {
      const result = await generateStrategicPlan(
        formData.brand,
        formData.challenge,
        formData.goal,
        formData.timeline
      );
      setPlan(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      
      {/* Input Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-emerald-500/20 rounded-xl">
            <Lightbulb className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Strategic Recommendation Engine</h2>
            <p className="text-slate-400">Define your constraints and let the AI architect a comprehensive roadmap.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Brand / Entity</label>
            <input
              type="text"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="e.g. Nike, Local Coffee Chain..."
              value={formData.brand}
              onChange={(e) => setFormData({...formData, brand: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Execution Timeline</label>
            <select
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              value={formData.timeline}
              onChange={(e) => setFormData({...formData, timeline: e.target.value})}
            >
              <option>Q4 2024</option>
              <option>FY 2025</option>
              <option>6 Month Sprint</option>
              <option>30 Day Launch</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Current Challenge</label>
            <textarea
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none h-24 resize-none"
              placeholder="e.g. Low engagement on Gen Z platforms, Declining sales in Europe..."
              value={formData.challenge}
              onChange={(e) => setFormData({...formData, challenge: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Primary Objective</label>
            <textarea
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none h-24 resize-none"
              placeholder="e.g. Increase brand awareness by 20%, Launch new product line..."
              value={formData.goal}
              onChange={(e) => setFormData({...formData, goal: e.target.value})}
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !formData.brand || !formData.challenge}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" /> Architecting Strategy...
            </>
          ) : (
            <>
              <Briefcase size={20} /> Generate Strategic Roadmap
            </>
          )}
        </button>
      </div>

      {/* Results Section */}
      {plan && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5">
               <Target size={150} />
             </div>
             <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
               Approved Strategy
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
      )}
    </div>
  );
};
