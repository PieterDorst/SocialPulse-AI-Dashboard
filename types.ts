
export enum CampaignStatus {
  ACTIVE = 'Active',
  PAUSED = 'Paused',
  COMPLETED = 'Completed',
  DRAFT = 'Draft'
}

export type Platform = 'X' | 'LinkedIn' | 'Instagram' | 'Facebook' | 'YouTube' | 'TikTok';

export interface Resource {
  title: string;
  url: string;
  type: 'report' | 'article' | 'dataset' | 'video' | 'case_study';
}

export interface ChannelStats {
  platform: Platform;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
}

export interface Campaign {
  id: string;
  name: string;
  brand: string;
  platforms: Platform[];
  status: CampaignStatus;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  roi: number;
  startDate: string;
  shares: number;
  comments: number;
  resources: Resource[];
  channelBreakdown: ChannelStats[];
}

export interface DailyMetric {
  date: string;
  impressions: number;
  engagement: number;
}

export interface AIInsight {
  type: 'positive' | 'warning' | 'neutral';
  message: string;
}

export interface StrategyPhase {
  phaseName: string;
  duration: string;
  keyActions: string[];
}

export interface StrategyPlan {
  title: string;
  executiveSummary: string;
  marketContext: string;
  phases: StrategyPhase[];
  recommendedChannels: string[];
  successMetrics: string[];
}

export type ViewState = 'campaigns' | 'create' | 'campaign_detail';