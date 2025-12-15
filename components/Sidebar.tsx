import React from 'react';
import { Trash2, LayoutDashboard } from 'lucide-react';

interface SidebarProps {
  channels: string[];
  currentChannelName: string | null;
  onSelect: (channel: string) => void;
  onRemove: (channel: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ channels, currentChannelName, onSelect, onRemove }) => {
  return (
    <div className="w-full md:w-64 bg-slate-900/50 md:border-r border-b md:border-b-0 border-slate-800 flex-shrink-0 md:min-h-[calc(100vh-4rem)]">
      <div className="p-4">
        <h2 className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-4">
          <LayoutDashboard className="w-4 h-4" />
          关注列表
        </h2>
        <div className="space-y-1">
          {channels.map((channel) => (
            <div 
              key={channel}
              className={`group flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all ${
                currentChannelName?.toLowerCase() === channel.toLowerCase() 
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-sm' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
              }`}
              onClick={() => onSelect(channel)}
            >
              <div className="flex items-center gap-3 truncate">
                <div className={`w-1.5 h-1.5 rounded-full ${currentChannelName?.toLowerCase() === channel.toLowerCase() ? 'bg-red-500' : 'bg-slate-600'}`}></div>
                <span className="truncate text-sm font-medium">{channel}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(channel);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-md transition-all focus:opacity-100"
                title="移除关注"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {channels.length === 0 && (
            <div className="p-4 text-center border-2 border-dashed border-slate-800 rounded-lg">
              <p className="text-xs text-slate-500">暂无关注频道</p>
              <p className="text-[10px] text-slate-600 mt-1">搜索并点击星号即可收藏</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};