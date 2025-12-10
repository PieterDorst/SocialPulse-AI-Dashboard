
import React, { useState } from 'react';
import { generateCampaignIdeas } from '../services/geminiService';
import { Sparkles, Loader2, Copy, Check } from 'lucide-react';

export const AICreator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [ideas, setIdeas] = useState<{ title: string; caption: string; targetAudience: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const results = await generateCampaignIdeas(topic, platform);
      setIdeas(results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <Sparkles className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Campaign Generator</h2>
            <p className="text-slate-400">Describe your topic, and let Gemini craft the perfect campaign.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-slate-300 mb-2">Campaign Topic / Product</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Summer sale on sustainable sneakers..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option>Instagram</option>
              <option>LinkedIn</option>
              <option>X</option>
              <option>Facebook</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !topic}
          className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Ideas...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Campaign
            </>
          )}
        </button>
      </div>

      {ideas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ideas.map((idea, idx) => (
            <div key={idx} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col hover:border-purple-500/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-slate-700 text-xs font-semibold px-2 py-1 rounded text-slate-300">Option {idx + 1}</span>
                <button
                  onClick={() => handleCopy(idea.caption, idx)}
                  className="text-slate-400 hover:text-white transition-colors"
                  title="Copy Caption"
                >
                  {copiedIndex === idx ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                </button>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{idea.title}</h3>
              <p className="text-slate-300 text-sm mb-4 flex-grow italic">"{idea.caption}"</p>
              
              <div className="pt-4 border-t border-slate-700">
                <span className="text-xs text-slate-500 uppercase font-semibold">Target Audience</span>
                <p className="text-sm text-slate-400 mt-1">{idea.targetAudience}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};