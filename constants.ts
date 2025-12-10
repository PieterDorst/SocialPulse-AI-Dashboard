
import { Campaign, CampaignStatus, DailyMetric } from './types';

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'c-apple-15',
    name: 'Shot on iPhone 15',
    brand: 'Apple',
    platforms: ['Instagram', 'YouTube', 'X'],
    status: CampaignStatus.ACTIVE,
    impressions: 45000000,
    clicks: 1250000,
    conversions: 85000,
    spend: 450000,
    roi: 6.2,
    startDate: '2023-09-22',
    shares: 450000,
    comments: 28000,
    resources: [
      { title: 'Fiscal Year 2023 Annual Report', url: 'https://investor.apple.com/', type: 'report' },
      { title: 'Newsroom: iPhone 15 Launch Details', url: 'https://www.apple.com/newsroom/', type: 'case_study' },
      { title: 'Official Titanium Commercial', url: 'https://www.youtube.com/user/Apple', type: 'video' },
      { title: 'TechCrunch: Market Impact Analysis', url: 'https://techcrunch.com/tag/apple/', type: 'article' }
    ],
    channelBreakdown: [
      { platform: 'Instagram', impressions: 20000000, clicks: 600000, conversions: 45000, spend: 180000 },
      { platform: 'YouTube', impressions: 15000000, clicks: 450000, conversions: 30000, spend: 220000 },
      { platform: 'X', impressions: 10000000, clicks: 200000, conversions: 10000, spend: 50000 }
    ]
  },
  {
    id: 'c-coke-magic',
    name: 'Real Magic Christmas',
    brand: 'Coca-Cola',
    platforms: ['YouTube', 'Facebook', 'Instagram', 'TikTok'],
    status: CampaignStatus.ACTIVE,
    impressions: 89000000,
    clicks: 340000,
    conversions: 12000,
    spend: 850000,
    roi: 3.5,
    startDate: '2023-11-01',
    shares: 890000,
    comments: 42000,
    resources: [
      { title: 'Coca-Cola Investors & Sustainability', url: 'https://investors.coca-colacompany.com/', type: 'report' },
      { title: 'Ad: "The World Needs More Santa"', url: 'https://www.youtube.com/user/cocacola', type: 'video' },
      { title: 'Marketing Week: Strategy Review', url: 'https://www.marketingweek.com/', type: 'article' },
      { title: 'Statista: Global Beverage Market Data', url: 'https://www.statista.com/', type: 'dataset' }
    ],
    channelBreakdown: [
      { platform: 'YouTube', impressions: 40000000, clicks: 100000, conversions: 2000, spend: 400000 },
      { platform: 'Facebook', impressions: 25000000, clicks: 120000, conversions: 5000, spend: 200000 },
      { platform: 'Instagram', impressions: 14000000, clicks: 80000, conversions: 3000, spend: 150000 },
      { platform: 'TikTok', impressions: 10000000, clicks: 40000, conversions: 2000, spend: 100000 }
    ]
  },
  {
    id: 'c-nike-run',
    name: 'Don\'t Stop Winning',
    brand: 'Nike',
    platforms: ['TikTok', 'Instagram', 'YouTube'],
    status: CampaignStatus.PAUSED,
    impressions: 32000000,
    clicks: 890000,
    conversions: 45000,
    spend: 220000,
    roi: 5.1,
    startDate: '2023-08-15',
    shares: 215000,
    comments: 15400,
    resources: [
      { title: 'NIKE, Inc. Investors', url: 'https://investors.nike.com/', type: 'report' },
      { title: 'Vogue Business: Gen Z Strategy', url: 'https://www.voguebusiness.com/', type: 'article' },
      { title: 'Campaign Anthem Reel', url: 'https://www.youtube.com/user/nike', type: 'video' }
    ],
    channelBreakdown: [
      { platform: 'TikTok', impressions: 15000000, clicks: 450000, conversions: 20000, spend: 80000 },
      { platform: 'Instagram', impressions: 12000000, clicks: 340000, conversions: 20000, spend: 90000 },
      { platform: 'YouTube', impressions: 5000000, clicks: 100000, conversions: 5000, spend: 50000 }
    ]
  },
  {
    id: 'c-spotify-wrapped',
    name: '#SpotifyWrapped 2023',
    brand: 'Spotify',
    platforms: ['X', 'Instagram', 'TikTok'],
    status: CampaignStatus.COMPLETED,
    impressions: 150000000,
    clicks: 5600000,
    conversions: 1200000, // Premium signups
    spend: 600000,
    roi: 12.4,
    startDate: '2023-11-29',
    shares: 12500000,
    comments: 3400000,
    resources: [
      { title: 'Spotify Ads: Culture Trends', url: 'https://ads.spotify.com/en-US/news-and-insights/', type: 'dataset' },
      { title: 'Newsroom: Wrapped Campaign', url: 'https://newsroom.spotify.com/', type: 'case_study' },
      { title: 'Spotify Investors', url: 'https://investors.spotify.com/', type: 'report' },
      { title: 'The Verge: Tech News', url: 'https://www.theverge.com/', type: 'article' }
    ],
    channelBreakdown: [
      { platform: 'X', impressions: 50000000, clicks: 2000000, conversions: 300000, spend: 100000 },
      { platform: 'Instagram', impressions: 60000000, clicks: 2500000, conversions: 600000, spend: 300000 },
      { platform: 'TikTok', impressions: 40000000, clicks: 1100000, conversions: 300000, spend: 200000 }
    ]
  },
  {
    id: 'c-airbnb-live',
    name: 'Live Anywhere',
    brand: 'Airbnb',
    platforms: ['Instagram', 'Facebook', 'YouTube'],
    status: CampaignStatus.ACTIVE,
    impressions: 12000000,
    clicks: 340000,
    conversions: 15000,
    spend: 180000,
    roi: 4.8,
    startDate: '2023-05-10',
    shares: 85000,
    comments: 4200,
    resources: [
      { title: 'Airbnb Investor Relations', url: 'https://investors.airbnb.com/', type: 'report' },
      { title: 'Airbnb Design', url: 'https://airbnb.design/', type: 'case_study' },
      { title: 'Launch Event: Live Anywhere', url: 'https://www.youtube.com/user/airbnb', type: 'video' }
    ],
    channelBreakdown: [
      { platform: 'Instagram', impressions: 6000000, clicks: 180000, conversions: 8000, spend: 90000 },
      { platform: 'Facebook', impressions: 4000000, clicks: 120000, conversions: 5000, spend: 50000 },
      { platform: 'YouTube', impressions: 2000000, clicks: 40000, conversions: 2000, spend: 40000 }
    ]
  }
];

// Scaled up metrics for the chart to match millions of impressions
export const MOCK_CHART_DATA: DailyMetric[] = [
  { date: 'Mon', impressions: 2400000, engagement: 140000 },
  { date: 'Tue', impressions: 3100000, engagement: 189000 },
  { date: 'Wed', impressions: 2800000, engagement: 210000 },
  { date: 'Thu', impressions: 4500000, engagement: 390000 },
  { date: 'Fri', impressions: 3900000, engagement: 310000 },
  { date: 'Sat', impressions: 5200000, engagement: 450000 },
  { date: 'Sun', impressions: 6100000, engagement: 580000 },
];
