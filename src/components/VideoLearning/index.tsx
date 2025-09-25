import React, { useState, useCallback } from 'react';
import { EnhancedVideoPlayer } from './EnhancedVideoPlayer';
import { ControlPanel } from './ControlPanel';
import { ProgressTracker } from './ProgressTracker';
import { VideoLearningProps, UserPreferences, VideoPlayerState, ProgressData } from '../../types';

interface VideoLearningModuleProps extends VideoLearningProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: Partial<UserPreferences>) => void;
}

export const VideoLearningModule: React.FC<VideoLearningModuleProps> = ({
  videoUrl,
  title,
  description,
  chapters = [],
  quizzes = [],
  preferences,
  onPreferencesChange,
  onProgress,
  onComplete
}) => {
  const [videoState, setVideoState] = useState<VideoPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    isFullscreen: false,
    playbackRate: 1,
    buffered: null
  });

  const [progressData, setProgressData] = useState<ProgressData>({
    videoId: 'current-video',
    currentTime: 0,
    totalTime: 0,
    completedChapters: [],
    quizScores: {},
    lastWatched: new Date(),
    completed: false
  });

  const [showSettings, setShowSettings] = useState(false);

  const handleVideoStateChange = useCallback((newState: VideoPlayerState) => {
    setVideoState(newState);

    // Update progress data
    setProgressData(prev => ({
      ...prev,
      currentTime: newState.currentTime,
      totalTime: newState.duration,
      lastWatched: new Date()
    }));

    // Call onProgress callback
    if (newState.duration > 0) {
      const progress = (newState.currentTime / newState.duration) * 100;
      onProgress?.(progress);

      // Check if video is completed (95% threshold)
      if (progress >= 95 && !progressData.completed) {
        setProgressData(prev => ({ ...prev, completed: true }));
        onComplete?.();
      }
    }
  }, [onProgress, onComplete, progressData.completed]);

  const handleTimeUpdate = useCallback((currentTime: number) => {
    // Check for quiz triggers
    const activeQuiz = quizzes.find(quiz =>
      Math.abs(quiz.triggerTime - currentTime) < 1 &&
      !progressData.quizScores[quiz.id]
    );

    if (activeQuiz) {
      // TODO: Show quiz modal
      console.log('Quiz triggered:', activeQuiz);
    }

    // Update chapter completion
    const currentChapter = chapters.find(chapter =>
      currentTime >= chapter.startTime && currentTime <= chapter.endTime
    );

    if (currentChapter && !progressData.completedChapters.includes(currentChapter.id)) {
      setProgressData(prev => ({
        ...prev,
        completedChapters: [...prev.completedChapters, currentChapter.id]
      }));
    }
  }, [quizzes, chapters, progressData]);

  const progressPercentage = videoState.duration > 0
    ? (videoState.currentTime / videoState.duration) * 100
    : 0;

  return (
    <div
      className="video-learning-module"
      data-theme={preferences.theme}
      role="main"
      aria-label={`Video lesson: ${title}`}
    >
      <div className="video-content">
        <div className="video-header">
          <h2 className="video-title">{title}</h2>
          {description && (
            <p className="video-description">{description}</p>
          )}
        </div>

        <div className="video-player-section">
          <EnhancedVideoPlayer
            src={videoUrl}
            title={title}
            onStateChange={handleVideoStateChange}
            onTimeUpdate={handleTimeUpdate}
            className="main-video-player"
          />
        </div>

        <div className="video-controls">
          <ProgressTracker
            progress={progressPercentage}
            chapters={chapters}
            currentTime={videoState.currentTime}
            duration={videoState.duration}
            completedChapters={progressData.completedChapters}
          />

          <div className="control-buttons">
            <button
              className="btn settings-toggle"
              onClick={() => setShowSettings(!showSettings)}
              aria-expanded={showSettings}
              aria-controls="video-settings"
            >
              {showSettings ? 'Hide Settings' : 'Show Settings'}
            </button>
          </div>
        </div>

        {showSettings && (
          <div id="video-settings" className="settings-panel">
            <ControlPanel
              preferences={preferences}
              onPreferencesChange={onPreferencesChange}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        .video-learning-module {
          max-width: 100%;
          margin: 0 auto;
          padding: 1rem;
        }

        .video-content {
          background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
          border: 2px solid var(--medical-blue);
          border-radius: 20px;
          padding: 2.5rem;
          box-shadow: 0 12px 32px rgba(44, 82, 130, 0.15);
        }

        .video-header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .video-title {
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--medical-blue);
          margin-bottom: 1rem;
          line-height: 1.3;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .video-description {
          font-size: 1.2rem;
          color: var(--text-secondary);
          line-height: 1.5;
          max-width: 800px;
          margin: 0 auto;
        }

        .video-player-section {
          margin-bottom: 2rem;
          background: #000;
          border-radius: 8px;
          overflow: hidden;
        }

        .video-controls {
          margin-bottom: 2rem;
        }

        .control-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 1rem;
        }

        .settings-toggle {
          background: linear-gradient(135deg, var(--medical-blue) 0%, var(--accent-color) 100%);
          color: white;
          border: 2px solid var(--medical-blue);
          border-radius: 12px;
          padding: 14px 28px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-height: 50px;
          box-shadow: 0 4px 12px rgba(44, 82, 130, 0.2);
        }

        .settings-toggle:hover {
          background: transparent;
          color: var(--accent-color);
        }

        .settings-toggle:focus {
          outline: 3px solid var(--focus-color);
          outline-offset: 2px;
        }

        .settings-panel {
          margin-top: 2rem;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* High contrast theme adjustments */
        .video-learning-module[data-theme="high-contrast"] .video-content {
          border-width: 3px;
        }

        .video-learning-module[data-theme="high-contrast"] .settings-toggle {
          border-width: 3px;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .video-learning-module {
            padding: 0.5rem;
          }

          .video-content {
            padding: 1rem;
          }

          .video-title {
            font-size: 1.6rem;
          }

          .video-description {
            font-size: 1rem;
          }

          .control-buttons {
            flex-direction: column;
            align-items: center;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .settings-panel {
            animation: none;
          }
        }

        /* Print styles */
        @media print {
          .video-player-section,
          .control-buttons,
          .settings-panel {
            display: none;
          }

          .video-content {
            box-shadow: none;
            border: 1px solid black;
          }
        }
      `}</style>
    </div>
  );
};