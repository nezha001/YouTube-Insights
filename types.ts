export interface VideoStat {
  title: string;
  views: number;
}

export interface ChannelData {
  channelName: string;
  subscribers: string;
  subscriberCount: number; // Numeric approximation for charts
  totalViews: string;
  videoCount: string;
  description: string;
  recentVideos: VideoStat[];
  avatarUrl?: string; // We might not get a real URL from text search, so we'll use a placeholder
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface SearchResult {
  data: ChannelData | null;
  sources: GroundingSource[];
  rawText: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}