import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { VideoStat } from '../types';

interface VideoPerformanceChartProps {
  videos: VideoStat[];
}

export const VideoPerformanceChart: React.FC<VideoPerformanceChartProps> = ({ videos }) => {
  if (!videos || videos.length === 0) return null;

  // Truncate titles for axis
  const data = videos.map(v => ({
    name: v.title.length > 15 ? v.title.substring(0, 15) + '...' : v.title,
    fullTitle: v.title,
    views: v.views
  }));

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg h-96">
      <h3 className="text-slate-200 font-semibold mb-6 flex items-center gap-2">
        热门视频表现
        <span className="text-xs text-slate-500 font-normal ml-2">(预估播放量)</span>
      </h3>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
            <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact" }).format(value)} />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={100} />
            <Tooltip
              cursor={{ fill: '#334155', opacity: 0.4 }}
              contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
              itemStyle={{ color: '#f8fafc' }}
              labelStyle={{ color: '#94a3b8', marginBottom: '0.5rem' }}
              formatter={(value: number) => [new Intl.NumberFormat().format(value), '播放量']}
            />
            <Bar dataKey="views" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#f87171' : '#60a5fa'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};