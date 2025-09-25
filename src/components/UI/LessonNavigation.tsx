import React from 'react';

interface LessonNavigationProps {
  currentLesson: number;
  totalLessons: number;
  onPreviousLesson: () => void;
  onNextLesson: () => void;
  isVideoCompleted: boolean;
  className?: string;
}

export const LessonNavigation: React.FC<LessonNavigationProps> = ({
  currentLesson,
  totalLessons,
  onPreviousLesson,
  onNextLesson,
  isVideoCompleted,
  className = ''
}) => {
  const hasPrevious = currentLesson > 1;
  const hasNext = currentLesson < totalLessons;
  const canProceedNext = isVideoCompleted || currentLesson < totalLessons;

  return (
    <div className={`lesson-navigation ${className}`}>
      <div className="navigation-container">
        <button
          className={`nav-button prev-button ${!hasPrevious ? 'disabled' : ''}`}
          onClick={onPreviousLesson}
          disabled={!hasPrevious}
          aria-label="Go to previous lesson"
        >
          <span className="button-icon">←</span>
          <div className="button-content">
            <div className="button-main-text">Previous Lesson</div>
            {hasPrevious && (
              <div className="button-sub-text">Lesson {currentLesson - 1}</div>
            )}
          </div>
        </button>

        <div className="current-lesson-info">
          <div className="completion-status">
            {isVideoCompleted ? (
              <div className="completed-indicator">
                <span className="check-icon">✓</span>
                <span>Lesson Completed!</span>
              </div>
            ) : (
              <div className="in-progress-indicator">
                <span className="progress-icon">▶</span>
                <span>Lesson in Progress</span>
              </div>
            )}
          </div>
        </div>

        <button
          className={`nav-button next-button ${!hasNext || !canProceedNext ? 'disabled' : ''}`}
          onClick={onNextLesson}
          disabled={!hasNext || !canProceedNext}
          aria-label="Go to next lesson"
        >
          <div className="button-content">
            <div className="button-main-text">
              {hasNext ? 'Next Lesson' : 'Course Complete'}
            </div>
            {hasNext && (
              <div className="button-sub-text">Lesson {currentLesson + 1}</div>
            )}
          </div>
          <span className="button-icon">→</span>
        </button>
      </div>

      {!canProceedNext && hasNext && (
        <div className="completion-reminder">
          <p>Please complete this lesson to proceed to the next one.</p>
        </div>
      )}

      <style jsx>{`
        .lesson-navigation {
          background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
          border: 2px solid var(--medical-blue);
          border-radius: 16px;
          padding: 2.5rem;
          margin: 2rem 0;
          box-shadow: 0 8px 24px rgba(44, 82, 130, 0.12);
        }

        .navigation-container {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .nav-button {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.8rem 2.5rem;
          font-size: 1.2rem;
          font-weight: 600;
          border: 3px solid var(--medical-blue);
          border-radius: 16px;
          background: linear-gradient(135deg, var(--medical-blue) 0%, var(--accent-color) 100%);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          min-height: 90px;
          text-align: center;
          box-shadow: 0 6px 16px rgba(44, 82, 130, 0.2);
        }

        .nav-button:hover:not(.disabled) {
          background: transparent;
          color: var(--accent-color);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 122, 204, 0.3);
        }

        .nav-button:focus {
          outline: 3px solid var(--focus-color);
          outline-offset: 3px;
        }

        .nav-button.disabled {
          background: var(--text-secondary);
          border-color: var(--text-secondary);
          cursor: not-allowed;
          opacity: 0.6;
        }

        .prev-button {
          justify-self: start;
        }

        .next-button {
          justify-self: end;
        }

        .button-icon {
          font-size: 2rem;
          font-weight: bold;
        }

        .button-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .button-main-text {
          font-size: 1.2rem;
          font-weight: 700;
        }

        .button-sub-text {
          font-size: 1rem;
          opacity: 0.8;
        }

        .current-lesson-info {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .completion-status {
          text-align: center;
        }

        .completed-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--success-color);
          background: linear-gradient(135deg, var(--success-light) 0%, rgba(255, 255, 255, 0.9) 100%);
          padding: 1.2rem 2rem;
          border-radius: 30px;
          border: 2px solid var(--success-color);
          box-shadow: 0 4px 12px rgba(56, 161, 105, 0.2);
        }

        .in-progress-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--medical-blue);
          background: linear-gradient(135deg, var(--accent-light) 0%, rgba(255, 255, 255, 0.9) 100%);
          padding: 1.2rem 2rem;
          border-radius: 30px;
          border: 2px solid var(--medical-blue);
          box-shadow: 0 4px 12px rgba(44, 82, 130, 0.2);
        }

        .check-icon {
          font-size: 1.5rem;
          background: var(--success-color);
          color: white;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .progress-icon {
          font-size: 1.2rem;
        }

        .completion-reminder {
          margin-top: 1.5rem;
          text-align: center;
          background: linear-gradient(135deg, var(--warning-light) 0%, rgba(255, 255, 255, 0.9) 100%);
          border: 2px solid var(--warning-color);
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(221, 107, 32, 0.2);
        }

        .completion-reminder p {
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--warning-color);
          margin: 0;
        }

        /* High contrast theme */
        .lesson-navigation[data-theme="high-contrast"] {
          border-width: 4px;
        }

        .lesson-navigation[data-theme="high-contrast"] .nav-button {
          border-width: 4px;
        }

        /* Mobile responsive */
        @media (max-width: 968px) {
          .navigation-container {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            text-align: center;
          }

          .nav-button {
            justify-self: center;
            min-width: 250px;
            padding: 1.2rem 1.5rem;
          }

          .current-lesson-info {
            order: -1;
          }
        }

        @media (max-width: 768px) {
          .lesson-navigation {
            padding: 1.5rem 1rem;
          }

          .nav-button {
            min-width: 200px;
            padding: 1rem 1.2rem;
            font-size: 1.1rem;
            min-height: 70px;
          }

          .button-main-text {
            font-size: 1.1rem;
          }

          .button-sub-text {
            font-size: 0.9rem;
          }

          .button-icon {
            font-size: 1.5rem;
          }

          .completed-indicator,
          .in-progress-indicator {
            font-size: 1.1rem;
            padding: 0.8rem 1.2rem;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .nav-button {
            transition: none;
          }

          .nav-button:hover:not(.disabled) {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};