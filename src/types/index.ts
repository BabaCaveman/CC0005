export interface VideoLearningProps {
  videoUrl: string;
  title: string;
  description?: string;
  chapters?: Chapter[];
  quizzes?: Quiz[];
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

export interface Chapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  description?: string;
}

export interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  triggerTime: number;
  explanation?: string;
}

export interface UserPreferences {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  theme: 'light' | 'dark' | 'high-contrast';
  playbackSpeed: number;
  captionsEnabled: boolean;
  autoPlay: boolean;
}

export interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  playbackRate: number;
  buffered: TimeRanges | null;
}

export interface ProgressData {
  videoId: string;
  currentTime: number;
  totalTime: number;
  completedChapters: string[];
  quizScores: Record<string, number>;
  lastWatched: Date;
  completed: boolean;
}