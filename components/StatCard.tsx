import React from 'react';
import { Divide, TrendingUp } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, colorClass }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-slate-700/50 transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{label}</h3>
        <div className={`p-2 rounded-lg bg-opacity-20 ${colorClass.replace('text-', 'bg-')} ${colorClass} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-white">{value}</span>
      </div>
    </div>
  );
};

export default StatCard;