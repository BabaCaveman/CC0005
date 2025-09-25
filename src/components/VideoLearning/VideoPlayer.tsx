import React, { useRef, useEffect, useState } from 'react';
import { VideoPlayerState } from '../../types';

interface VideoPlayerProps {
  src: string;
  title: string;
  onStateChange?: (state: VideoPlayerState) => void;
  onTimeUpdate?: (currentTime: number) => void;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title,
  onStateChange,
  onTimeUpdate,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);

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
      updateState();
      onTimeUpdate?.(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setIsReady(true);
      updateState();
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', updateState);
    video.addEventListener('pause', updateState);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('volumechange', updateState);
    video.addEventListener('ratechange', updateState);
    video.addEventListener('fullscreenchange', updateState);
    video.addEventListener('progress', updateState);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', updateState);
      video.removeEventListener('pause', updateState);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('volumechange', updateState);
      video.removeEventListener('ratechange', updateState);
      video.removeEventListener('fullscreenchange', updateState);
      video.removeEventListener('progress', updateState);
    };
  }, [onStateChange, onTimeUpdate]);

  return (
    <div className={`video-player-container ${className}`}>
      <video
        ref={videoRef}
        src={src}
        controls
        controlsList="nodownload"
        className="senior-friendly-video"
        aria-label={`Video: ${title}`}
        style={{ width: '100%', height: 'auto', maxWidth: '100%' }}
      >
        <p>Your browser does not support the video tag.</p>
      </video>

      {!isReady && (
        <div className="loading-placeholder" aria-live="polite">
          Loading video...
        </div>
      )}

      <style jsx>{`
        .video-player-container {
          width: 100%;
          max-width: 100%;
          position: relative;
          background: #000;
          border-radius: 8px;
          overflow: hidden;
        }

        .senior-friendly-video {
          background: #000;
          border-radius: 8px;
        }

        .senior-friendly-video::-webkit-media-controls-panel {
          background-color: rgba(0, 0, 0, 0.9);
          height: 50px;
        }

        .senior-friendly-video::-webkit-media-controls-play-button,
        .senior-friendly-video::-webkit-media-controls-mute-button,
        .senior-friendly-video::-webkit-media-controls-fullscreen-button {
          width: 44px;
          height: 44px;
          margin: 3px;
        }

        .senior-friendly-video::-webkit-media-controls-timeline {
          height: 20px;
          margin: 0 10px;
        }

        .senior-friendly-video::-webkit-media-controls-current-time-display,
        .senior-friendly-video::-webkit-media-controls-time-remaining-display {
          font-size: 14px;
          font-weight: 500;
        }

        .loading-placeholder {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #fff;
          font-size: 1.2rem;
          background: rgba(0, 0, 0, 0.8);
          padding: 1rem 2rem;
          border-radius: 6px;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .senior-friendly-video::-webkit-media-controls-panel {
            background-color: #000;
            border-top: 2px solid #fff;
          }
        }

        /* Focus management */
        .senior-friendly-video:focus {
          outline: 3px solid var(--focus-color, #007acc);
          outline-offset: 3px;
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .senior-friendly-video::-webkit-media-controls-panel {
            height: 60px;
          }

          .senior-friendly-video::-webkit-media-controls-play-button,
          .senior-friendly-video::-webkit-media-controls-mute-button,
          .senior-friendly-video::-webkit-media-controls-fullscreen-button {
            width: 50px;
            height: 50px;
            margin: 5px;
          }

          .senior-friendly-video::-webkit-media-controls-current-time-display,
          .senior-friendly-video::-webkit-media-controls-time-remaining-display {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};