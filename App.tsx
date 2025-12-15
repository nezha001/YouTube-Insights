import React, { useState, useCallback, useEffect } from 'react';
import { Search, Youtube, Users, Eye, Video, Loader2, ExternalLink, AlertCircle, Star, StarOff } from 'lucide-react';
import { fetchChannelStats } from './services/geminiService';
import { ChannelData, GroundingSource, LoadingState } from './types';
import StatCard from './components/StatCard';
import { VideoPerformanceChart } from './components/Charts';
import { Sidebar } from './components/Sidebar';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [data, setData] = useState<ChannelData | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Persistent Watchlist State
  const [savedChannels, setSavedChannels] = useState<string[]>(() => {
    const saved = localStorage.getItem('yt_insight_channels');
    // Default channels if none saved (updated to include mixed content)
    return saved ? JSON.parse(saved) : ['李子柒 Liziqi', 'MrBeast', 'MKBHD'];
  });

  useEffect(() => {
    localStorage.setItem('yt_insight_channels', JSON.stringify(savedChannels));
  }, [savedChannels]);

  // Core search logic
  const performSearch = useCallback(async (channelName: string) => {
    if (!channelName.trim()) return;

    setLoadingState(LoadingState.LOADING);
    setErrorMsg('');
    setData(null);
    setSources([]);

    try {
      const result = await fetchChannelStats(channelName);
      if (result.data) {
        setData(result.data);
        setSources(result.sources);
        setLoadingState(LoadingState.SUCCESS);
      } else {
        setErrorMsg("无法提取结构化数据，请尝试搜索其他频道名称。");
        setLoadingState(LoadingState.ERROR);
      }
    } catch (err) {
      setErrorMsg("连接 Gemini API 失败，请稍后重试。");
      setLoadingState(LoadingState.ERROR);
    }
  }, []);

  const handleSearchForm = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const handleSidebarSelect = (channelName: string) => {
    setQuery(channelName);
    performSearch(channelName);
  };

  const togglePin = () => {
    if (!data) return;
    const name = data.channelName;
    
    // Check if exists (case insensitive check for better UX)
    const exists = savedChannels.some(c => c.toLowerCase() === name.toLowerCase());

    if (exists) {
      setSavedChannels(prev => prev.filter(c => c.toLowerCase() !== name.toLowerCase()));
    } else {
      setSavedChannels(prev => [...prev, name]);
    }
  };

  const removeChannel = (channel: string) => {
    setSavedChannels(prev => prev.filter(c => c !== channel));
  };

  const isPinned = data ? savedChannels.some(c => c.toLowerCase() === data.channelName.toLowerCase()) : false;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-red-500 selection:text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex-shrink-0">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 p-1.5 rounded-lg">
              <Youtube className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">YouTube 洞察</span>
          </div>

          <form onSubmit={handleSearchForm} className="flex-1 max-w-xl mx-4 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索频道 (例如: 李子柒)..."
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder-slate-500"
            />
            <Search className="absolute left-3.5 top-2.5 w-5 h-5 text-slate-400" />
          </form>

          <div className="w-8" />
        </div>
      </header>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        
        <Sidebar 
          channels={savedChannels} 
          currentChannelName={data?.channelName || null}
          onSelect={handleSidebarSelect}
          onRemove={removeChannel}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth">
          {/* Intro State */}
          {loadingState === LoadingState.IDLE && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 ring-4 ring-slate-800 shadow-2xl">
                <Youtube className="w-10 h-10 text-red-500" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                选择一个频道
              </h1>
              <p className="text-slate-400 max-w-md">
                从左侧的关注列表中选择，或者在上方搜索新的频道进行实时分析。
              </p>
            </div>
          )}

          {/* Loading State */}
          {loadingState === LoadingState.LOADING && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
              <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
              <p className="text-slate-400 animate-pulse">正在扫描 YouTube 数据...</p>
            </div>
          )}

          {/* Error State */}
          {loadingState === LoadingState.ERROR && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 opacity-80" />
              <h3 className="text-xl font-semibold text-white">分析失败</h3>
              <p className="text-slate-400 max-w-md">{errorMsg}</p>
              <button 
                onClick={() => performSearch(query)}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-medium transition-colors border border-slate-700 mt-4"
              >
                重试
              </button>
            </div>
          )}

          {/* Success / Dashboard State */}
          {loadingState === LoadingState.SUCCESS && data && (
            <div className="space-y-8 animate-fade-in pb-10">
              {/* Channel Header */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border-4 border-slate-800 shadow-2xl shrink-0">
                  <img 
                    src={data.avatarUrl || `https://picsum.photos/seed/${data.channelName.replace(' ', '')}/200`} 
                    alt="Channel Avatar" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 text-center md:text-left z-10 w-full">
                  <div className="flex items-center justify-center md:justify-between mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">{data.channelName}</h1>
                    <button 
                      onClick={togglePin}
                      className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                        isPinned 
                          ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20' 
                          : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {isPinned ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                      <span className="text-sm font-medium">{isPinned ? '取消收藏' : '收藏频道'}</span>
                    </button>
                  </div>
                  
                  <p className="text-slate-400 mb-6 max-w-2xl leading-relaxed mx-auto md:mx-0">{data.description}</p>
                  
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <button 
                      onClick={togglePin}
                      className={`md:hidden flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        isPinned 
                          ? 'bg-red-500/10 border-red-500/30 text-red-400' 
                          : 'bg-slate-700 border-slate-600 text-slate-200'
                      }`}
                    >
                      {isPinned ? <Star className="w-3 h-3 fill-current" /> : <StarOff className="w-3 h-3" />}
                      {isPinned ? '已收藏' : '收藏'}
                    </button>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600">
                      实时数据
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                  label="订阅人数" 
                  value={data.subscribers} 
                  icon={<Users className="w-6 h-6" />}
                  colorClass="text-red-500"
                />
                <StatCard 
                  label="总播放量" 
                  value={data.totalViews} 
                  icon={<Eye className="w-6 h-6" />}
                  colorClass="text-blue-500"
                />
                <StatCard 
                  label="视频总数" 
                  value={data.videoCount} 
                  icon={<Video className="w-6 h-6" />}
                  colorClass="text-emerald-500"
                />
              </div>

              {/* Charts & Details Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                   <VideoPerformanceChart videos={data.recentVideos} />
                </div>

                {/* Sources / About Panel */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg flex flex-col h-full">
                  <h3 className="text-slate-200 font-semibold mb-4 flex items-center gap-2">
                    <Search className="w-4 h-4 text-slate-400" />
                    数据来源
                  </h3>
                  <div className="flex-1 overflow-y-auto max-h-60 space-y-2 pr-2 custom-scrollbar">
                    {sources.map((source, idx) => (
                      <a 
                        key={idx}
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors border border-transparent hover:border-slate-600 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-300 truncate w-10/12 block">
                            {source.title}
                          </span>
                          <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;