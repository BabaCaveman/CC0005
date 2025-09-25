import React, { useRef, useEffect, useState } from 'react';
import { VideoPlayerState } from '../../types';

interface EnhancedVideoPlayerProps {
  src: string;
  title: string;
  onStateChange?: (state: VideoPlayerState) => void;
  onTimeUpdate?: (currentTime: number) => void;
  className?: string;
}

export const EnhancedVideoPlayer: React.FC<EnhancedVideoPlayerProps> = ({
  src,
  title,
  onStateChange,
  onTimeUpdate,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateState = () => {
      const state: VideoPlayerState = {
        isPlaying: !video.paused,
        currentTime: video.currentTime || 0,
        duration: video.duration || 0,
        volume: video.volume,
        isMuted: video.muted,
        isFullscreen: !!document.fullscreenElement,
        playbackRate: video.playbackRate,
        buffered: video.buffered
      };
      onStateChange?.(state);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      updateState();
      onTimeUpdate?.(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setIsReady(true);
      setDuration(video.duration);
      updateState();
    };

    const handlePlay = () => {
      setIsPlaying(true);
      updateState();
    };

    const handlePause = () => {
      setIsPlaying(false);
      updateState();
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('volumechange', updateState);

    // Enable captions by default
    if (video.textTracks.length > 0) {
      video.textTracks[0].mode = 'showing';
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('volumechange', updateState);
    };
  }, [onStateChange, onTimeUpdate]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value) / 100;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleSpeedChange = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`enhanced-video-player ${className}`}>
      <div className="video-container">
        <video
          ref={videoRef}
          src={src}
          className="video-element"
          aria-label={`Video: ${title}`}
        >
          <track kind="captions" src="" label="English" default />
          <p>Your browser does not support the video tag.</p>
        </video>

        {!isReady && (
          <div className="loading-placeholder" aria-live="polite">
            <div className="loading-spinner"></div>
            <span>Loading video...</span>
          </div>
        )}

        <div className="custom-controls">
          <div className="main-controls">
            <button
              className="control-button play-pause-button"
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              <span className="button-icon">
                {isPlaying ? '⏸️' : '▶️'}
              </span>
              <span className="button-text">
                {isPlaying ? 'Pause' : 'Play'}
              </span>
            </button>

            <div className="time-display">
              <span className="current-time">{formatTime(currentTime)}</span>
              <span className="time-separator"> / </span>
              <span className="total-time">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="progress-section">
            <label htmlFor="progress-slider" className="sr-only">Video progress</label>
            <input
              id="progress-slider"
              type="range"
              min="0"
              max="100"
              value={progressPercentage}
              onChange={handleSeek}
              className="progress-slider"
              aria-label={`Video progress: ${Math.round(progressPercentage)}% complete`}
            />
            <div className="progress-text">
              {Math.round(progressPercentage)}% complete
            </div>
          </div>

          <div className="secondary-controls">
            <div className="volume-controls">
              <button
                className="control-button volume-button"
                onClick={toggleMute}
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              >
                <span className="button-icon">
                  {isMuted ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
                </span>
                <span className="button-text">Volume</span>
              </button>

              {showVolumeSlider && (
                <div
                  className="volume-slider-container"
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <label htmlFor="volume-slider" className="sr-only">Volume control</label>
                  <input
                    id="volume-slider"
                    type="range"
                    min="0"
                    max="100"
                    value={volume * 100}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                    aria-label={`Volume: ${Math.round(volume * 100)}%`}
                  />
                </div>
              )}
            </div>

            <div className="speed-controls">
              <label htmlFor="speed-select" className="control-label">Speed:</label>
              <select
                id="speed-select"
                value={playbackSpeed}
                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                className="speed-select"
                aria-label="Playback speed"
              >
                <option value={1}>Normal</option>
                <option value={0.75}>Slower</option>
              </select>
            </div>

            <button
              className="control-button fullscreen-button"
              onClick={toggleFullscreen}
              aria-label="Toggle fullscreen"
            >
              <span className="button-icon">⛶</span>
              <span className="button-text">Fullscreen</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .enhanced-video-player {
          background: #000;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
        }

        .video-container {
          position: relative;
          width: 100%;
        }

        .video-element {
          width: 100%;
          height: auto;
          display: block;
          background: #000;
        }

        .loading-placeholder {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #fff;
          font-size: 1.4rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #333;
          border-top: 4px solid #fff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .custom-controls {
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%);
          color: white;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .main-controls {
          display: flex;
          align-items: center;
          gap: 2rem;
          justify-content: center;
        }

        .control-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          padding: 1rem;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 80px;
          min-height: 80px;
        }

        .control-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.6);
          transform: scale(1.05);
        }

        .control-button:focus {
          outline: 3px solid #ffff00;
          outline-offset: 2px;
        }

        .play-pause-button {
          min-width: 120px;
          min-height: 120px;
          background: var(--accent-color);
          border-color: var(--accent-color);
        }

        .play-pause-button:hover {
          background: #0056b3;
          border-color: #0056b3;
        }

        .button-icon {
          font-size: 2rem;
        }

        .play-pause-button .button-icon {
          font-size: 3rem;
        }

        .button-text {
          font-size: 1rem;
          font-weight: 600;
        }

        .time-display {
          background: rgba(0, 0, 0, 0.7);
          padding: 1rem 1.5rem;
          border-radius: 8px;
          font-size: 1.5rem;
          font-weight: bold;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .current-time {
          color: var(--accent-color);
        }

        .time-separator {
          color: #ccc;
        }

        .total-time {
          color: #ccc;
        }

        .progress-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
        }

        .progress-slider {
          width: 100%;
          height: 20px;
          -webkit-appearance: none;
          appearance: none;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          cursor: pointer;
        }

        .progress-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 30px;
          height: 30px;
          background: var(--accent-color);
          border-radius: 50%;
          cursor: pointer;
        }

        .progress-slider::-moz-range-thumb {
          width: 30px;
          height: 30px;
          background: var(--accent-color);
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }

        .progress-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: #ccc;
        }

        .secondary-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .volume-controls {
          position: relative;
        }

        .volume-slider-container {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.9);
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 0.5rem;
        }

        .volume-slider {
          width: 100px;
          height: 10px;
          -webkit-appearance: none;
          appearance: none;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 5px;
          cursor: pointer;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: var(--accent-color);
          border-radius: 50%;
          cursor: pointer;
        }

        .speed-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .control-label {
          font-size: 1rem;
          font-weight: 600;
        }

        .speed-select {
          background: rgba(0, 0, 0, 0.7);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          color: white;
          padding: 0.5rem 1rem;
          font-size: 1rem;
          cursor: pointer;
        }

        .speed-select:focus {
          outline: 2px solid #ffff00;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .custom-controls {
            padding: 1rem;
            gap: 1rem;
          }

          .main-controls {
            flex-direction: column;
            gap: 1rem;
          }

          .control-button {
            min-width: 60px;
            min-height: 60px;
            padding: 0.8rem;
          }

          .play-pause-button {
            min-width: 100px;
            min-height: 100px;
          }

          .button-icon {
            font-size: 1.5rem;
          }

          .play-pause-button .button-icon {
            font-size: 2.5rem;
          }

          .time-display {
            font-size: 1.2rem;
            padding: 0.8rem 1rem;
          }

          .secondary-controls {
            gap: 1rem;
            justify-content: space-around;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .control-button,
          .loading-spinner {
            transition: none;
            animation: none;
          }

          .control-button:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};