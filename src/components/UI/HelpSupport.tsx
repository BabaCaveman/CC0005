import React, { useState } from 'react';

interface HelpSupportProps {
  className?: string;
}

export const HelpSupport: React.FC<HelpSupportProps> = ({ className = '' }) => {
  const [showHelp, setShowHelp] = useState(false);
  const [showStuckDialog, setShowStuckDialog] = useState(false);

  const handleHelpClick = () => {
    setShowHelp(true);
  };

  const handleStuckClick = () => {
    setShowStuckDialog(true);
  };

  const handleRestart = () => {
    if (window.confirm('Are you sure you want to restart this lesson? Your progress in this lesson will be lost.')) {
      window.location.reload();
    }
  };

  return (
    <>
      <div className={`help-support ${className}`}>
        <div className="help-buttons">
          <button
            className="help-button main-help"
            onClick={handleHelpClick}
            aria-label="Get help with using this lesson"
          >
            <span className="help-icon">?</span>
            <span className="help-text">Help</span>
          </button>

          <button
            className="help-button stuck-button"
            onClick={handleStuckClick}
            aria-label="I'm stuck and need assistance"
          >
            <span className="stuck-icon">🆘</span>
            <span className="stuck-text">I'm Stuck</span>
          </button>

          <button
            className="help-button restart-button"
            onClick={handleRestart}
            aria-label="Restart this lesson from the beginning"
          >
            <span className="restart-icon">🔄</span>
            <span className="restart-text">Restart Lesson</span>
          </button>
        </div>

        <div className="contact-info">
          <div className="phone-support">
            <span className="phone-icon">🏥</span>
            <span className="phone-text">Need help? Call: 1-800-DIABETES</span>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="modal-overlay" onClick={() => setShowHelp(false)}>
          <div className="modal-content help-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowHelp(false)}
              aria-label="Close help"
            >
              ×
            </button>

            <h2>How to Use This Lesson</h2>

            <div className="help-sections">
              <div className="help-section">
                <h3>🎥 Watching Videos</h3>
                <ul>
                  <li>Click the large ▶ button to start the video</li>
                  <li>Click ⏸ to pause the video</li>
                  <li>Use the volume buttons 🔊 to adjust sound</li>
                  <li>The progress bar shows how much you've watched</li>
                </ul>
              </div>

              <div className="help-section">
                <h3>⚙️ Changing Settings</h3>
                <ul>
                  <li>Click "Show Settings" to customize your experience</li>
                  <li>Make text larger for easier reading</li>
                  <li>Change to high contrast for better visibility</li>
                  <li>Adjust video speed if it's too fast</li>
                </ul>
              </div>

              <div className="help-section">
                <h3>🔄 Navigation</h3>
                <ul>
                  <li>Complete the video to unlock the next lesson</li>
                  <li>Use "Previous Lesson" to go back</li>
                  <li>Use "Next Lesson" when you're ready to continue</li>
                  <li>Your progress is saved automatically</li>
                </ul>
              </div>

              <div className="help-section">
                <h3>❓ Getting Help</h3>
                <ul>
                  <li>Click "I'm Stuck" if you need immediate help</li>
                  <li>Call 1-800-TECH-HELP to speak with someone</li>
                  <li>Use "Restart Lesson" to start over if confused</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stuck Dialog */}
      {showStuckDialog && (
        <div className="modal-overlay" onClick={() => setShowStuckDialog(false)}>
          <div className="modal-content stuck-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowStuckDialog(false)}
              aria-label="Close help request"
            >
              ×
            </button>

            <h2>We're Here to Help!</h2>

            <div className="stuck-content">
              <p>Don't worry, everyone gets stuck sometimes. Here are your options:</p>

              <div className="help-options">
                <div className="help-option">
                  <h3>🏥 Call for Health Support</h3>
                  <p>Speak with a diabetes educator who can help with any questions.</p>
                  <div className="phone-number">1-800-DIABETES</div>
                  <p><small>Available Monday-Friday, 8am-8pm</small></p>
                </div>

                <div className="help-option">
                  <h3>🔄 Start This Lesson Over</h3>
                  <p>Sometimes starting fresh helps. This will restart the current lesson.</p>
                  <button
                    className="action-button restart"
                    onClick={handleRestart}
                  >
                    Restart This Lesson
                  </button>
                </div>

                <div className="help-option">
                  <h3>⏪ Go Back a Lesson</h3>
                  <p>Review the previous lesson to refresh your memory.</p>
                  <button
                    className="action-button back"
                    onClick={() => {
                      setShowStuckDialog(false);
                      // This would trigger the previous lesson function
                    }}
                  >
                    Previous Lesson
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .help-support {
          position: fixed;
          top: 20px;
          right: 20px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          z-index: 100;
        }

        .help-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .help-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 1rem;
          font-size: 1rem;
          font-weight: 600;
          border: 2px solid;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 140px;
          text-align: left;
        }

        .main-help {
          background: var(--accent-color);
          border-color: var(--accent-color);
          color: white;
        }

        .main-help:hover {
          background: transparent;
          color: var(--accent-color);
        }

        .stuck-button {
          background: var(--error-color);
          border-color: var(--error-color);
          color: white;
        }

        .stuck-button:hover {
          background: transparent;
          color: var(--error-color);
        }

        .restart-button {
          background: var(--warning-color);
          border-color: var(--warning-color);
          color: #000;
        }

        .restart-button:hover {
          background: transparent;
          color: var(--warning-color);
        }

        .help-button:focus {
          outline: 3px solid var(--focus-color);
          outline-offset: 2px;
        }

        .contact-info {
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
        }

        .phone-support {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .phone-icon {
          font-size: 1.2rem;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: var(--bg-primary);
          border: 3px solid var(--border-color);
          border-radius: 12px;
          padding: 2rem;
          max-width: 700px;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: var(--error-color);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 1.5rem;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-close:hover {
          background: #c82333;
        }

        .modal-content h2 {
          color: var(--text-primary);
          margin: 0 0 2rem 0;
          font-size: 2rem;
          text-align: center;
        }

        .help-sections {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .help-section {
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          border-radius: 8px;
          padding: 1.5rem;
        }

        .help-section h3 {
          color: var(--text-primary);
          margin: 0 0 1rem 0;
          font-size: 1.3rem;
        }

        .help-section ul {
          margin: 0;
          padding-left: 1.5rem;
          color: var(--text-primary);
        }

        .help-section li {
          font-size: 1.1rem;
          line-height: 1.5;
          margin-bottom: 0.5rem;
        }

        .stuck-content {
          text-align: center;
        }

        .stuck-content > p {
          font-size: 1.2rem;
          color: var(--text-primary);
          margin-bottom: 2rem;
        }

        .help-options {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .help-option {
          background: var(--bg-secondary);
          border: 2px solid var(--border-color);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
        }

        .help-option h3 {
          color: var(--text-primary);
          margin: 0 0 1rem 0;
          font-size: 1.3rem;
        }

        .help-option p {
          color: var(--text-primary);
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        .phone-number {
          font-size: 2rem;
          font-weight: bold;
          color: var(--accent-color);
          margin: 1rem 0;
          background: rgba(0, 122, 204, 0.1);
          padding: 0.8rem;
          border-radius: 8px;
          border: 2px solid var(--accent-color);
        }

        .action-button {
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
          border: 2px solid;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 180px;
        }

        .action-button.restart {
          background: var(--warning-color);
          border-color: var(--warning-color);
          color: #000;
        }

        .action-button.restart:hover {
          background: transparent;
          color: var(--warning-color);
        }

        .action-button.back {
          background: var(--accent-color);
          border-color: var(--accent-color);
          color: white;
        }

        .action-button.back:hover {
          background: transparent;
          color: var(--accent-color);
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .help-support {
            top: 10px;
            right: 10px;
          }

          .help-button {
            padding: 0.6rem 0.8rem;
            font-size: 0.9rem;
            min-width: 120px;
          }

          .contact-info {
            padding: 0.8rem;
          }

          .phone-support {
            font-size: 0.9rem;
            flex-direction: column;
            gap: 0.3rem;
          }

          .modal-content {
            margin: 1rem;
            padding: 1.5rem;
            max-height: 90vh;
          }

          .phone-number {
            font-size: 1.5rem;
          }

          .help-options {
            gap: 1.5rem;
          }
        }

        /* High contrast theme adjustments */
        .help-support[data-theme="high-contrast"] .help-button,
        .help-support[data-theme="high-contrast"] .contact-info,
        .help-support[data-theme="high-contrast"] .modal-content {
          border-width: 3px;
        }
      `}</style>
    </>
  );
};