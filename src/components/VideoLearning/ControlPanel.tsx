import React from 'react';
import { UserPreferences } from '../../types';

interface ControlPanelProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: Partial<UserPreferences>) => void;
  className?: string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  preferences,
  onPreferencesChange,
  className = ''
}) => {
  const fontSizeOptions = [
    { value: 'small', label: 'Small (16px)' },
    { value: 'medium', label: 'Medium (18px)' },
    { value: 'large', label: 'Large (20px)' },
    { value: 'extra-large', label: 'Extra Large (24px)' }
  ] as const;

  const themeOptions = [
    { value: 'light', label: 'Light Theme' },
    { value: 'dark', label: 'Dark Theme' },
    { value: 'high-contrast', label: 'High Contrast' }
  ] as const;

  const speedOptions = [
    { value: 0.5, label: 'Slow (0.5x)' },
    { value: 1, label: 'Normal (1x)' },
    { value: 1.25, label: 'Fast (1.25x)' },
    { value: 1.5, label: 'Faster (1.5x)' }
  ];

  return (
    <div className={`control-panel ${className}`} role="region" aria-label="Video Settings">
      <h3 className="control-panel-title">Video Settings</h3>

      <div className="control-group">
        <label htmlFor="font-size-select" className="control-label">
          Text Size
        </label>
        <select
          id="font-size-select"
          value={preferences.fontSize}
          onChange={(e) => onPreferencesChange({
            fontSize: e.target.value as UserPreferences['fontSize']
          })}
          className="control-select"
          aria-describedby="font-size-help"
        >
          {fontSizeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div id="font-size-help" className="control-help">
          Choose a comfortable text size for reading
        </div>
      </div>

      <div className="control-group">
        <label htmlFor="theme-select" className="control-label">
          Display Theme
        </label>
        <select
          id="theme-select"
          value={preferences.theme}
          onChange={(e) => onPreferencesChange({
            theme: e.target.value as UserPreferences['theme']
          })}
          className="control-select"
          aria-describedby="theme-help"
        >
          {themeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div id="theme-help" className="control-help">
          Select a theme that's easy on your eyes
        </div>
      </div>

      <div className="control-group">
        <label htmlFor="speed-select" className="control-label">
          Video Speed
        </label>
        <select
          id="speed-select"
          value={preferences.playbackSpeed}
          onChange={(e) => onPreferencesChange({
            playbackSpeed: parseFloat(e.target.value)
          })}
          className="control-select"
          aria-describedby="speed-help"
        >
          {speedOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div id="speed-help" className="control-help">
          Adjust how fast the video plays
        </div>
      </div>

      <div className="control-group">
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="captions-toggle"
            checked={preferences.captionsEnabled}
            onChange={(e) => onPreferencesChange({
              captionsEnabled: e.target.checked
            })}
            className="control-checkbox"
          />
          <label htmlFor="captions-toggle" className="checkbox-label">
            Show Captions
          </label>
        </div>
        <div className="control-help">
          Display text captions for spoken content
        </div>
      </div>

      <div className="control-group">
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="autoplay-toggle"
            checked={preferences.autoPlay}
            onChange={(e) => onPreferencesChange({
              autoPlay: e.target.checked
            })}
            className="control-checkbox"
          />
          <label htmlFor="autoplay-toggle" className="checkbox-label">
            Auto-play Next Video
          </label>
        </div>
        <div className="control-help">
          Automatically start the next video when this one ends
        </div>
      </div>

      <style jsx>{`
        .control-panel {
          background: var(--bg-secondary, #f8f9fa);
          border: 2px solid var(--border-color, #dee2e6);
          border-radius: 8px;
          padding: 24px;
          margin: 16px 0;
        }

        .control-panel-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0 0 20px 0;
          color: var(--text-primary, #212529);
        }

        .control-group {
          margin-bottom: 20px;
        }

        .control-label {
          display: block;
          font-size: 1.1rem;
          font-weight: 500;
          margin-bottom: 8px;
          color: var(--text-primary, #212529);
        }

        .control-select {
          width: 100%;
          padding: 12px 16px;
          font-size: 1rem;
          border: 2px solid var(--border-color, #ced4da);
          border-radius: 6px;
          background: var(--bg-primary, #ffffff);
          color: var(--text-primary, #212529);
          cursor: pointer;
          min-height: 44px;
        }

        .control-select:focus {
          outline: none;
          border-color: var(--focus-color, #007acc);
          box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.25);
        }

        .control-select:hover {
          border-color: var(--hover-border, #adb5bd);
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .control-checkbox {
          width: 20px;
          height: 20px;
          cursor: pointer;
          accent-color: var(--accent-color, #007acc);
        }

        .checkbox-label {
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--text-primary, #212529);
          cursor: pointer;
          margin: 0;
        }

        .control-help {
          font-size: 0.95rem;
          color: var(--text-secondary, #6c757d);
          margin-top: 6px;
          line-height: 1.4;
        }

        /* High contrast theme */
        .control-panel[data-theme="high-contrast"] {
          --bg-primary: #000000;
          --bg-secondary: #1a1a1a;
          --text-primary: #ffffff;
          --text-secondary: #cccccc;
          --border-color: #ffffff;
          --focus-color: #ffff00;
          --hover-border: #cccccc;
          --accent-color: #ffff00;
        }

        /* Dark theme */
        .control-panel[data-theme="dark"] {
          --bg-primary: #2d3748;
          --bg-secondary: #4a5568;
          --text-primary: #f7fafc;
          --text-secondary: #e2e8f0;
          --border-color: #718096;
          --focus-color: #63b3ed;
          --hover-border: #a0aec0;
          --accent-color: #63b3ed;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .control-panel {
            padding: 16px;
          }

          .control-panel-title {
            font-size: 1.3rem;
          }

          .control-label {
            font-size: 1rem;
          }

          .checkbox-label {
            font-size: 1rem;
          }
        }

        /* Focus management for better keyboard navigation */
        .control-select:focus,
        .control-checkbox:focus {
          outline: 3px solid var(--focus-color, #007acc);
          outline-offset: 2px;
        }

        /* Ensure text remains readable in all themes */
        @media (prefers-contrast: high) {
          .control-panel {
            border-width: 3px;
          }

          .control-select,
          .control-checkbox {
            border-width: 3px;
          }
        }
      `}</style>
    </div>
  );
};