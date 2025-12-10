import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { StatCard } from './components/StatCard';
import { PerformanceChart } from './components/PerformanceChart';
import { AICreator } from './components/AICreator';
import { StrategyResult } from './components/StrategyResult';
import { generateCampaignSpecificInsight, CampaignAnalysisResult, generateCampaignNextSteps } from './services/geminiService';
import { MOCK_CAMPAIGNS } from './constants';
import { ViewState, CampaignStatus, Campaign, DailyMetric, StrategyPlan } from './types';
import { 
  MousePointerClick, 
  DollarSign, 
  TrendingUp, 
  RefreshCw,
  Search,
  Filter,
  BrainCircuit,
  FileText,
  ExternalLink,
  Globe,
  ArrowLeft,
  Share2,
  Activity,
  PlayCircle,
  BookOpen,
  Lightbulb,
  MessageCircle,
  MoreHorizontal,
  ArrowRightLeft,
  X as CloseIcon,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Video,
  BarChart2,
  Briefcase,
  AlertCircle
} from 'lucide-react';

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const formatCurrency = (num: number): string => {
  if (num >= 1000000) return '$' + (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return '$' + (num / 1000).toFixed(0) + 'K';
  return '$' + num.toString();
};

const getPlatformIcon = (platform: string, size: number = 16) => {
  switch (platform) {
    case 'Instagram': return <Instagram size={size} className="text-pink-500" />;
    case 'Facebook': return <Facebook size={size} className="text-blue-500" />;
    case 'X': return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" fill="currentColor"/>
      </svg>
    );
    case 'YouTube': return <Youtube size={size} className="text-red-500" />;
    case 'LinkedIn': return <Linkedin size={size} className="text-blue-600" />;
    case 'TikTok': return <Video size={size} className="text-white" />; // Fallback since specific icon might vary
    default: return <Globe size={size} className="text-slate-400" />;
  }
};

// Helper to generate a realistic timeline based on campaign start date
// Generates 12 weeks of data
const generateCampaignTimeline = (campaign: Campaign): DailyMetric[] => {
  const data: DailyMetric[] = [];
  const startDate = new Date(campaign.startDate);
  const weeksToGenerate = 12;
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

  // Calculate rough weekly averages
  const weeklyImpressionsAvg = campaign.impressions / weeksToGenerate;
  const weeklyEngagementAvg = campaign.clicks / weeksToGenerate;

  for (let i = 0; i < weeksToGenerate; i++) {
    const currentDate = new Date(startDate.getTime() + (i * oneWeekMs));
    
    // Format date as "Oct 12"
    const dateStr = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Create organic looking variance using sine wave + random noise
    // This creates a trend that goes up and down rather than just random static
    const trend = Math.sin(i / 2) * 0.3; // Slow wave
    const noise = (Math.random() - 0.5) * 0.4; // Random jitter
    const variance = 1 + trend + noise;
    
    // Ensure we don't go below 0
    const impressions = Math.max(1000, Math.floor(weeklyImpressionsAvg * variance));
    // Engagement correlates with impressions but has its own variance
    const engagement = Math.max(100, Math.floor(weeklyEngagementAvg * variance * (0.9 + Math.random() * 0.2)));

    data.push({
      date: dateStr,
      impressions: impressions,
      engagement: engagement
    });
  }
  
  return data;
};

const CampaignDetailView: React.FC<{ 
  campaign: Campaign; 
  onBack: () => void;
}> = ({ campaign, onBack }) => {
  const [analysisResult, setAnalysisResult] = useState<CampaignAnalysisResult>({ 
    analysis: "Analyzing campaign data...", 
    recommendations: [] 
  });
  const [loading, setLoading] = useState(false);
  const [showImpressions, setShowImpressions] = useState(true);
  const [showEngagement, setShowEngagement] = useState(true);
  
  // Strategy Generator State
  const [strategyPlan, setStrategyPlan] = useState<StrategyPlan | null>(null);
  const [generatingStrategy, setGeneratingStrategy] = useState(false);
  
  // Comparison State
  const [compareId, setCompareId] = useState<string>('');
  const comparisonCampaign = MOCK_CAMPAIGNS.find(c => c.id === compareId);
  
  // Memoize chart data so it doesn't regenerate on every render
  const chartData = React.useMemo(() => generateCampaignTimeline(campaign), [campaign]);
  
  // Calculate Current Metrics
  const ctr = ((campaign.clicks / campaign.impressions) * 100).toFixed(2) + '%';
  const cpa = (campaign.spend / campaign.conversions).toFixed(2);

  // Calculate Comparison Metrics if valid
  const compCtr = comparisonCampaign ? ((comparisonCampaign.clicks / comparisonCampaign.impressions) * 100).toFixed(2) + '%' : undefined;
  const compCpa = comparisonCampaign ? (comparisonCampaign.spend / comparisonCampaign.conversions).toFixed(2) : undefined;

  useEffect(() => {
    // Reset strategy when campaign changes
    setStrategyPlan(null);
    
    const fetchInsight = async () => {
      setLoading(true);
      const result = await generateCampaignSpecificInsight(campaign);
      setAnalysisResult(result);
      setLoading(false);
    };
    fetchInsight();
  }, [campaign]);

  const handleGenerateStrategy = async () => {
    setGeneratingStrategy(true);
    const plan = await generateCampaignNextSteps(campaign);
    if (plan) {
      setStrategyPlan(plan);
    } else {
      alert("Unable to generate strategy. Please ensure your API Key is configured in the environment.");
    }
    setGeneratingStrategy(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center gap-4 mb-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors print:hidden"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              {campaign.name}
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                campaign.status === CampaignStatus.ACTIVE ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                campaign.status === CampaignStatus.PAUSED ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                'bg-slate-500/10 border-slate-500/20 text-slate-400'
              }`}>
                {campaign.status}
              </span>
            </h1>
            <div className="text-slate-400 text-sm flex items-center gap-2 mt-1">
              <span className="font-medium text-blue-400">{campaign.brand}</span> 
              <span>•</span>
              <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                {campaign.platforms.map(p => (
                  <span key={p} title={p}>{getPlatformIcon(p, 14)}</span>
                ))}
              </div>
              <span>•</span>
              <span>Started {campaign.startDate}</span>
            </div>
          </div>
        </div>
        
        <div className="ml-auto flex flex-wrap gap-2 items-center print:hidden">
          {/* Comparison Selector */}
          <div className="relative group">
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
              <ArrowRightLeft size={16} className="mr-2 text-slate-500" />
              <select 
                value={compareId}
                onChange={(e) => setCompareId(e.target.value)}
                className="bg-transparent border-none outline-none appearance-none text-slate-300 w-32 cursor-pointer"
              >
                <option value="">Compare with...</option>
                {MOCK_CAMPAIGNS.filter(c => c.id !== campaign.id).map(c => (
                  <option key={c.id} value={c.id} className="bg-slate-800">{c.brand}</option>
                ))}
              </select>
              {compareId && (
                <button 
                  onClick={() => setCompareId('')}
                  className="ml-2 p-0.5 hover:bg-slate-700 rounded-full text-slate-500 hover:text-white"
                  title="Clear comparison"
                >
                  <CloseIcon size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Impressions" 
          value={formatNumber(campaign.impressions)} 
          trend="+22.5%" 
          trendDirection="up" 
          icon={Globe} 
          colorClass="bg-blue-500 text-blue-500"
          comparisonValue={comparisonCampaign ? formatNumber(comparisonCampaign.impressions) : undefined}
          comparisonLabel={comparisonCampaign?.brand}
        />
        <StatCard 
          label="Click Through Rate" 
          value={ctr} 
          trend="-1.2%" 
          trendDirection="down" 
          icon={MousePointerClick} 
          colorClass="bg-purple-500 text-purple-500"
          comparisonValue={compCtr}
          comparisonLabel={comparisonCampaign?.brand}
        />
        <StatCard 
          label="Cost Per Conversion" 
          value={`$${cpa}`} 
          trend="-5.4%" 
          trendDirection="up" 
          icon={DollarSign} 
          colorClass="bg-orange-500 text-orange-500" 
          comparisonValue={compCpa ? `$${compCpa}` : undefined}
          comparisonLabel={comparisonCampaign?.brand}
        />
        <StatCard 
          label="Return on Ad Spend" 
          value={`${campaign.roi}x`} 
          trend="+8.3%" 
          trendDirection="up" 
          icon={TrendingUp} 
          colorClass="bg-green-500 text-green-500" 
          comparisonValue={comparisonCampaign ? `${comparisonCampaign.roi}x` : undefined}
          comparisonLabel={comparisonCampaign?.brand}
        />
      </div>

       {/* Comparison Detail Table (Visible only when comparing) */}
      {comparisonCampaign && (
         <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 overflow-hidden animate-fade-in">
           <div className="flex items-center justify-between mb-4">
             <h3 className="text-md font-semibold text-white flex items-center gap-2">
               <ArrowRightLeft size={18} className="text-blue-400" />
               Social Proof Comparison
             </h3>
             <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Side by Side</span>
           </div>
           
           <div className="grid grid-cols-3 gap-4 text-center">
              {/* Header */}
              <div className="col-span-1 text-left"></div>
              <div className="col-span-1 pb-2 border-b border-slate-700 font-bold text-white">{campaign.brand}</div>
              <div className="col-span-1 pb-2 border-b border-slate-700 font-bold text-slate-400">{comparisonCampaign.brand}</div>

              {/* Row 1: Shares */}
              <div className="col-span-1 text-left text-sm text-slate-400 py-2 flex items-center gap-2">
                <Share2 size={14} /> Shares
              </div>
              <div className="col-span-1 py-2 text-white font-medium">{formatNumber(campaign.shares)}</div>
              <div className="col-span-1 py-2 text-slate-300 font-medium">{formatNumber(comparisonCampaign.shares)}</div>

              {/* Row 2: Comments */}
              <div className="col-span-1 text-left text-sm text-slate-400 py-2 flex items-center gap-2">
                <MessageCircle size={14} /> Comments
              </div>
              <div className="col-span-1 py-2 text-white font-medium">{formatNumber(campaign.comments)}</div>
              <div className="col-span-1 py-2 text-slate-300 font-medium">{formatNumber(comparisonCampaign.comments)}</div>
              
               {/* Row 3: Spend */}
              <div className="col-span-1 text-left text-sm text-slate-400 py-2 flex items-center gap-2">
                <DollarSign size={14} /> Total Spend
              </div>
              <div className="col-span-1 py-2 text-white font-medium">{formatCurrency(campaign.spend)}</div>
              <div className="col-span-1 py-2 text-slate-300 font-medium">{formatCurrency(comparisonCampaign.spend)}</div>
           </div>
         </div>
      )}

      {/* Channel Breakdown Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
           <BarChart2 size={20} className="text-slate-400"/>
           Channel Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {campaign.channelBreakdown ? campaign.channelBreakdown.map((channel, idx) => (
             <div key={idx} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                   <div className="bg-slate-700/50 p-2 rounded-lg">
                      {getPlatformIcon(channel.platform, 20)}
                   </div>
                   <div>
                      <span className="block text-white font-medium">{channel.platform}</span>
                      <span className="text-xs text-slate-400">Targeting Active</span>
                   </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-400">Reach</span>
                     <span className="text-white font-medium">{formatNumber(channel.impressions)}</span>
                  </div>
                   <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-400">Clicks</span>
                     <span className="text-white font-medium">{formatNumber(channel.clicks)}</span>
                  </div>
                   <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-400">Conversions</span>
                     <span className="text-white font-medium">{formatNumber(channel.conversions)}</span>
                  </div>
                   <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-400">Spend</span>
                     <span className="text-white font-medium">{formatCurrency(channel.spend)}</span>
                  </div>
                   <div className="pt-3 mt-3 border-t border-slate-700 grid grid-cols-2 gap-4">
                     <div>
                       <span className="block text-slate-500 text-xs uppercase font-bold mb-0.5">CTR</span>
                       <span className="block text-blue-400 font-bold">
                         {((channel.clicks / channel.impressions) * 100).toFixed(2)}%
                       </span>
                     </div>
                     <div className="text-right">
                       <span className="block text-slate-500 text-xs uppercase font-bold mb-0.5">CPA</span>
                       <span className="block text-emerald-400 font-bold">
                         ${(channel.spend / (channel.conversions || 1)).toFixed(2)}
                       </span>
                     </div>
                  </div>
                </div>
             </div>
          )) : (
            <div className="col-span-3 text-center p-8 bg-slate-800 rounded-xl border border-slate-700 border-dashed text-slate-500">
               Channel breakdown data unavailable for this campaign.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">Performance Over Time</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowImpressions(!showImpressions)}
                className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                  showImpressions 
                    ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${showImpressions ? 'bg-blue-500' : 'bg-slate-600'}`}></div>
                Impressions
              </button>
              <button 
                onClick={() => setShowEngagement(!showEngagement)}
                className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                  showEngagement
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${showEngagement ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
                Engagement
              </button>
            </div>
          </div>
          <PerformanceChart 
            data={chartData} 
            showImpressions={showImpressions} 
            showEngagement={showEngagement} 
          />
        </div>

        {/* AI Insight & Details */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden flex flex-col h-full max-h-[440px]">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BrainCircuit size={100} />
            </div>
            
            <div className="flex items-center gap-2 mb-4 flex-shrink-0">
              <BrainCircuit className="text-indigo-400" size={24} />
              <h2 className="text-lg font-semibold text-white">Gemini Analysis</h2>
            </div>
            
            <div className="overflow-y-auto pr-2 custom-scrollbar flex-grow">
              <div className="text-slate-300 text-sm leading-relaxed mb-6">
                {loading ? (
                  <div className="flex items-center gap-2 text-indigo-300">
                    <RefreshCw className="animate-spin" size={16} />
                    Generating insights...
                  </div>
                ) : (
                  <p>{analysisResult.analysis}</p>
                )}
              </div>

              {/* Recommendations Section */}
              {!loading && analysisResult.recommendations.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-indigo-200 flex items-center gap-2">
                    <Lightbulb size={16} />
                    Key Recommendations
                  </h3>
                  <ul className="space-y-3">
                    {analysisResult.recommendations.map((rec, idx) => (
                      <li key={idx} className="bg-slate-900/50 rounded-lg p-3 border border-indigo-500/20 text-xs text-slate-300 flex gap-2 items-start">
                        <span className="bg-indigo-500/20 text-indigo-300 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 text-[10px] font-bold mt-0.5">
                          {idx + 1}
                        </span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Recommendation Section */}
      <div className="border-t border-slate-700 pt-8 mt-4">
        <div className="flex justify-between items-center mb-6">
           <h3 className="text-xl font-bold text-white flex items-center gap-2">
             <Briefcase className="text-emerald-400" size={24}/>
             Strategic Takeaway
           </h3>
           {!strategyPlan && (
             <button 
               onClick={handleGenerateStrategy}
               disabled={generatingStrategy}
               className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 print:hidden"
             >
               {generatingStrategy ? <RefreshCw className="animate-spin" size={18} /> : <BrainCircuit size={18} />}
               Generate Strategic Takeaway
             </button>
           )}
        </div>

        {strategyPlan && (
           <StrategyResult plan={strategyPlan} />
        )}
      </div>

      {/* Resources Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-semibold text-white">Campaign Resources</h3>
            <div className="flex items-center gap-2 text-xs text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20">
              <AlertCircle size={14} />
              <span>Restricted Access: Some links may require enterprise credentials.</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaign.resources.length > 0 ? campaign.resources.map((res, idx) => {
              let Icon = ExternalLink;
              let colorClass = 'bg-slate-500/20 text-slate-400';
              
              if (res.type === 'report') { Icon = FileText; colorClass = 'bg-blue-500/20 text-blue-400'; }
              if (res.type === 'video') { Icon = PlayCircle; colorClass = 'bg-red-500/20 text-red-400'; }
              if (res.type === 'case_study') { Icon = BookOpen; colorClass = 'bg-emerald-500/20 text-emerald-400'; }
              if (res.type === 'dataset') { Icon = Activity; colorClass = 'bg-purple-500/20 text-purple-400'; }

              return (
                <a 
                key={idx}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl hover:bg-slate-700 border border-slate-800 hover:border-slate-600 transition-all group"
                >
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate group-hover:text-blue-400 transition-colors">{res.title}</p>
                    <p className="text-xs text-slate-500 capitalize">{res.type.replace('_', ' ')}</p>
                  </div>
                  <ExternalLink size={14} className="text-slate-600 group-hover:text-slate-400" />
                </a>
              );
            }) : (
              <p className="text-sm text-slate-500 italic col-span-2">No resources linked.</p>
            )}
          </div>
      </div>
    </div>
  );
};

const CampaignsView: React.FC<{ onSelectCampaign: (c: Campaign) => void }> = ({ onSelectCampaign }) => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <h1 className="text-2xl font-bold text-white">Global Portfolio</h1>
      <div className="flex gap-2 w-full md:w-auto">
        <div className="relative flex-grow md:flex-grow-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search brand or campaign..." 
            className="w-full md:w-64 bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
          <Filter size={18} />
          <span className="hidden sm:inline">Filter</span>
        </button>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {MOCK_CAMPAIGNS.map((campaign) => (
        <div 
          key={campaign.id}
          onClick={() => onSelectCampaign(campaign)}
          className="bg-slate-800 border border-slate-700 rounded-2xl hover:border-blue-500 transition-all cursor-pointer group flex flex-col overflow-hidden"
        >
          {/* Card Header */}
          <div className="p-6 pb-4">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                campaign.status === CampaignStatus.ACTIVE ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                campaign.status === CampaignStatus.PAUSED ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                'bg-slate-500/10 border-slate-500/20 text-slate-400'
              }`}>
                {campaign.status}
              </span>
              <div className="bg-slate-700/50 p-1.5 rounded-lg text-slate-400">
                <MoreHorizontal size={16} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-1">{campaign.name}</h3>
            <p className="text-slate-400 text-sm font-medium">{campaign.brand}</p>
          </div>

          {/* Key Stats Row */}
          <div className="px-6 pb-6 flex justify-between items-center text-sm">
            <div className="flex flex-col">
              <span className="text-slate-500 text-xs uppercase font-semibold">Spend</span>
              <span className="text-slate-200 font-medium">{formatCurrency(campaign.spend)}</span>
            </div>
             <div className="flex flex-col text-right">
              <span className="text-slate-500 text-xs uppercase font-semibold">Reach</span>
              <span className="text-slate-200 font-medium">{formatNumber(campaign.impressions)}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-slate-500 text-xs uppercase font-semibold">ROI</span>
              <span className="text-green-400 font-bold">{campaign.roi}x</span>
            </div>
          </div>

          {/* Social Proof Section - Visually Distinct */}
          <div className="bg-slate-900/50 border-y border-slate-700 px-6 py-4 flex items-center justify-between">
             <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Social Impact</span>
             <div className="flex gap-4">
               <div className="flex items-center gap-1.5 text-blue-400" title="Shares/Retweets">
                 <Share2 size={16} />
                 <span className="text-sm font-bold">{formatNumber(campaign.shares)}</span>
               </div>
               <div className="flex items-center gap-1.5 text-pink-400" title="Comments">
                 <MessageCircle size={16} />
                 <span className="text-sm font-bold">{formatNumber(campaign.comments)}</span>
               </div>
             </div>
          </div>

          {/* Card Footer: Resources & Platforms */}
          <div className="p-4 bg-slate-800 flex items-center justify-between text-xs text-slate-500">
             <div className="flex items-center gap-2">
               {campaign.platforms.slice(0, 4).map(p => (
                 <div key={p} title={p} className="hover:opacity-80 transition-opacity">
                    {getPlatformIcon(p, 16)}
                 </div>
               ))}
               {campaign.platforms.length > 4 && <span className="text-slate-500">+{campaign.platforms.length - 4}</span>}
             </div>
             
             <div className="flex items-center gap-2">
                <span className="hidden sm:inline">{campaign.resources.length} resources</span>
                <div className="flex -space-x-1">
                   {campaign.resources.slice(0, 3).map((_, i) => (
                     <div key={i} className="w-2 h-2 rounded-full bg-slate-600 ring-2 ring-slate-800"></div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('campaigns');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const handleCampaignSelect = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setCurrentView('campaign_detail');
  };

  const handleBackToCampaigns = () => {
    setSelectedCampaign(null);
    setCurrentView('campaigns');
  };
  
  const handleCampaignUpdate = (updated: Campaign) => {
    setSelectedCampaign(updated);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex">
      <Sidebar currentView={currentView === 'campaign_detail' ? 'campaigns' : currentView} setView={setCurrentView} />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen print:ml-0 print:h-auto print:overflow-visible">
        {/* Header Area */}
        <header className="flex justify-between items-center mb-8 print:hidden">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {currentView === 'campaigns' && 'Global Campaigns'}
              {currentView === 'create' && 'New Strategy'}
              {currentView === 'campaign_detail' && 'Campaign Deep Dive'}
            </h1>
            <p className="text-slate-400 text-sm mt-1">Global Marketing Director View</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold border border-slate-600">
              MD
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        {currentView === 'campaigns' && <CampaignsView onSelectCampaign={handleCampaignSelect} />}
        {currentView === 'create' && <AICreator />}
        {currentView === 'campaign_detail' && selectedCampaign && (
          <CampaignDetailView 
            campaign={selectedCampaign} 
            onBack={handleBackToCampaigns}
          />
        )}
      </main>
    </div>
  );
};

export default App;