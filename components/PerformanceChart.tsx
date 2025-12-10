import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { DailyMetric } from '../types';

interface PerformanceChartProps {
  data: DailyMetric[];
  showImpressions?: boolean;
  showEngagement?: boolean;
}

const formatYAxis = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num.toString();
};

export const PerformanceChart: React.FC<PerformanceChartProps> = ({ 
  data, 
  showImpressions = true, 
  showEngagement = true 
}) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
            tickFormatter={formatYAxis}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9' }}
            itemStyle={{ color: '#e2e8f0' }}
            formatter={(value: number) => [new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(value), '']}
          />
          {showImpressions && (
            <Area 
              type="monotone" 
              dataKey="impressions" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorImpressions)" 
              strokeWidth={2}
              name="Impressions"
              animationDuration={1000}
            />
          )}
          {showEngagement && (
            <Area 
              type="monotone" 
              dataKey="engagement" 
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#colorEngagement)" 
              strokeWidth={2}
              name="Engagement"
              animationDuration={1000}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};