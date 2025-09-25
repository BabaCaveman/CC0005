import React from 'react';
import { Chapter } from '../../types';

interface ProgressTrackerProps {
  progress: number;
  chapters: Chapter[];
  currentTime: number;
  duration: number;
  completedChapters: string[];
  onSeek?: (time: number) => void;
  className?: string;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  progress,
  chapters,
  currentTime,
  duration,
  completedChapters,
  onSeek,
  className = ''
}) => {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleChapterClick = (chapter: Chapter) => {
    if (onSeek) {
      onSeek(chapter.startTime);
    }
  };

  const getChapterProgress = (chapter: Chapter): number => {
    if (currentTime < chapter.startTime) return 0;
    if (currentTime > chapter.endTime) return 100;

    const chapterDuration = chapter.endTime - chapter.startTime;
    const chapterProgress = currentTime - chapter.startTime;
    return (chapterProgress / chapterDuration) * 100;
  };

  return (
    <div className={`progress-tracker ${className}`} role="region" aria-label="Video Progress">
      <div className="progress-header">
        <h3 className="progress-title">Learning Progress</h3>
        <div className="time-display">
          <span className="current-time" aria-label={`Current time: ${formatTime(currentTime)}`}>
            {formatTime(currentTime)}
          </span>
          <span className="time-separator"> / </span>
          <span className="total-time" aria-label={`Total duration: ${formatTime(duration)}`}>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="progress-fill"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
          <div className="progress-text" aria-live="polite">
            {Math.round(progress)}% Complete
          </div>
        </div>
      </div>

      {chapters.length > 0 && (
        <div className="chapters-section">
          <h4 className="chapters-title">Course Chapters</h4>
          <div className="chapters-list" role="list">
            {chapters.map((chapter, index) => {
              const isCompleted = completedChapters.includes(chapter.id);
              const isCurrent = currentTime >= chapter.startTime && currentTime <= chapter.endTime;
              const chapterProgress = getChapterProgress(chapter);

              return (
                <div
                  key={chapter.id}
                  className={`chapter-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                  role="listitem"
                >
                  <button
                    className="chapter-button"
                    onClick={() => handleChapterClick(chapter)}
                    aria-label={`Jump to ${chapter.title} at ${formatTime(chapter.startTime)}`}
                    disabled={!onSeek}
                  >
                    <div className="chapter-number">
                      <span className="chapter-index">{index + 1}</span>
                      {isCompleted && (
                        <span className="completion-indicator" aria-label="Completed">
                          ✓
                        </span>
                      )}
                    </div>

                    <div className="chapter-content">
                      <h5 className="chapter-title">{chapter.title}</h5>
                      {chapter.description && (
                        <p className="chapter-description">{chapter.description}</p>
                      )}
                      <div className="chapter-time">
                        {formatTime(chapter.startTime)} - {formatTime(chapter.endTime)}
                      </div>

                      {isCurrent && (
                        <div className="chapter-progress-bar">
                          <div
                            className="chapter-progress-fill"
                            style={{ width: `${chapterProgress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .progress-tracker {
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          border-radius: 8px;
          padding: 1.5rem;
          margin: 1rem 0;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .progress-title {
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }

        .time-display {
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .current-time {
          color: var(--accent-color);
          font-weight: 600;
        }

        .time-separator {
          color: var(--text-secondary);
        }

        .total-time {
          color: var(--text-secondary);
        }

        .progress-bar-container {
          margin-bottom: 2rem;
        }

        .progress-bar {
          position: relative;
          height: 40px;
          background: var(--bg-primary);
          border: 2px solid var(--border-color);
          border-radius: 20px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-color) 0%, var(--success-color) 100%);
          transition: width 0.3s ease;
          border-radius: 18px;
        }

        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-weight: 600;
          color: var(--text-primary);
          font-size: 1rem;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .chapters-section {
          margin-top: 2rem;
        }

        .chapters-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 1rem 0;
        }

        .chapters-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .chapter-item {
          border: 2px solid var(--border-color);
          border-radius: 6px;
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .chapter-item.current {
          border-color: var(--accent-color);
          background: rgba(0, 122, 204, 0.1);
        }

        .chapter-item.completed {
          border-color: var(--success-color);
          background: rgba(40, 167, 69, 0.1);
        }

        .chapter-button {
          width: 100%;
          padding: 1rem;
          background: transparent;
          border: none;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          transition: background-color 0.2s ease;
        }

        .chapter-button:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .chapter-button:focus {
          outline: 3px solid var(--focus-color);
          outline-offset: -3px;
          background: rgba(0, 122, 204, 0.1);
        }

        .chapter-button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .chapter-number {
          position: relative;
          width: 40px;
          height: 40px;
          border: 2px solid var(--border-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1rem;
          color: var(--text-primary);
          flex-shrink: 0;
        }

        .chapter-item.completed .chapter-number {
          background: var(--success-color);
          border-color: var(--success-color);
          color: white;
        }

        .chapter-item.current .chapter-number {
          background: var(--accent-color);
          border-color: var(--accent-color);
          color: white;
        }

        .completion-indicator {
          position: absolute;
          top: -5px;
          right: -5px;
          background: var(--success-color);
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
        }

        .chapter-content {
          flex: 1;
        }

        .chapter-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
        }

        .chapter-description {
          font-size: 0.95rem;
          color: var(--text-secondary);
          margin: 0 0 0.5rem 0;
          line-height: 1.4;
        }

        .chapter-time {
          font-size: 0.9rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .chapter-progress-bar {
          margin-top: 0.5rem;
          height: 4px;
          background: var(--bg-primary);
          border-radius: 2px;
          overflow: hidden;
        }

        .chapter-progress-fill {
          height: 100%;
          background: var(--accent-color);
          transition: width 0.3s ease;
        }

        /* High contrast theme adjustments */
        .progress-tracker[data-theme="high-contrast"] {
          border-width: 3px;
        }

        .progress-tracker[data-theme="high-contrast"] .progress-bar,
        .progress-tracker[data-theme="high-contrast"] .chapter-item {
          border-width: 3px;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .progress-tracker {
            padding: 1rem;
          }

          .progress-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .progress-title {
            font-size: 1.2rem;
          }

          .time-display {
            font-size: 1rem;
          }

          .chapter-button {
            padding: 0.8rem;
            gap: 0.8rem;
          }

          .chapter-number {
            width: 35px;
            height: 35px;
          }

          .chapter-title {
            font-size: 1rem;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .progress-fill,
          .chapter-progress-fill,
          .chapter-item,
          .chapter-button {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};