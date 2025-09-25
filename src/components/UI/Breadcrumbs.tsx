import React from 'react';

interface BreadcrumbsProps {
  currentLesson: number;
  totalLessons: number;
  lessonTitle: string;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  currentLesson,
  totalLessons,
  lessonTitle,
  className = ''
}) => {
  return (
    <nav className={`breadcrumbs ${className}`} aria-label="Course progress navigation">
      <div className="breadcrumb-container">
        <div className="course-info">
          <h2 className="course-title">Metabolic Disease Management</h2>
          <div className="lesson-info">
            <span className="lesson-number">Lesson {currentLesson} of {totalLessons}</span>
            <h3 className="lesson-title">{lessonTitle}</h3>
          </div>
        </div>

        <div className="progress-visual">
          <div className="progress-circles">
            {Array.from({ length: totalLessons }, (_, index) => {
              const lessonNum = index + 1;
              const isCompleted = lessonNum < currentLesson;
              const isCurrent = lessonNum === currentLesson;

              return (
                <div
                  key={lessonNum}
                  className={`progress-circle ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                  aria-label={`Lesson ${lessonNum} ${isCompleted ? 'completed' : isCurrent ? 'current' : 'upcoming'}`}
                >
                  {isCompleted ? '✓' : lessonNum}
                </div>
              );
            })}
          </div>
          <div className="progress-text">
            Progress: {currentLesson - 1} of {totalLessons} lessons completed
          </div>
        </div>
      </div>

      <style jsx>{`
        .breadcrumbs {
          background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
          border-bottom: 3px solid var(--medical-blue);
          padding: 2.5rem 1rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 12px rgba(44, 82, 130, 0.1);
        }

        .breadcrumb-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .course-info {
          text-align: center;
        }

        .course-title {
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--medical-blue);
          margin: 0 0 1rem 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          letter-spacing: -0.02em;
        }

        .lesson-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .lesson-number {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--medical-blue);
          background: linear-gradient(135deg, var(--accent-light) 0%, rgba(255, 255, 255, 0.9) 100%);
          padding: 0.8rem 1.5rem;
          border-radius: 30px;
          border: 2px solid var(--medical-blue);
          box-shadow: 0 4px 8px rgba(44, 82, 130, 0.15);
          backdrop-filter: blur(10px);
        }

        .lesson-title {
          font-size: 1.8rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
          text-align: center;
        }

        .progress-visual {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .progress-circles {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .progress-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          font-weight: bold;
          border: 3px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-secondary);
          transition: all 0.3s ease;
        }

        .progress-circle.completed {
          background: linear-gradient(135deg, var(--success-color) 0%, #48bb78 100%);
          border-color: var(--success-color);
          color: white;
          box-shadow: 0 4px 12px rgba(56, 161, 105, 0.3);
        }

        .progress-circle.current {
          background: linear-gradient(135deg, var(--medical-blue) 0%, var(--accent-color) 100%);
          border-color: var(--medical-blue);
          color: white;
          box-shadow: 0 0 20px rgba(44, 82, 130, 0.4);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 10px rgba(0, 122, 204, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(0, 122, 204, 0.8);
          }
          100% {
            box-shadow: 0 0 10px rgba(0, 122, 204, 0.5);
          }
        }

        .progress-text {
          font-size: 1.3rem;
          font-weight: 500;
          color: var(--text-secondary);
          text-align: center;
        }

        /* High contrast theme */
        .breadcrumbs[data-theme="high-contrast"] {
          border-width: 4px;
        }

        .breadcrumbs[data-theme="high-contrast"] .progress-circle {
          border-width: 4px;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .breadcrumbs {
            padding: 1.5rem 0.5rem;
          }

          .course-title {
            font-size: 1.6rem;
          }

          .lesson-number {
            font-size: 1.2rem;
            padding: 0.4rem 0.8rem;
          }

          .lesson-title {
            font-size: 1.4rem;
          }

          .progress-circle {
            width: 50px;
            height: 50px;
            font-size: 1rem;
          }

          .progress-circles {
            gap: 0.8rem;
          }

          .progress-text {
            font-size: 1.1rem;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .progress-circle.current {
            animation: none;
          }
        }
      `}</style>
    </nav>
  );
};