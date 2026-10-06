import { createContext, useContext, useRef, useState, useCallback, type ReactNode } from 'react';

interface MusicState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  hasAudio: boolean;
  audioError: string | null;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  registerAudio: (src: string | null) => void;
}

const MusicContext = createContext<MusicState | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSrcRef = useRef<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [hasAudio, setHasAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const registerAudio = useCallback((src: string | null) => {
    if (!src) {
      setHasAudio(false);
      setAudioError(null);
      return;
    }

    if (currentSrcRef.current === src && audioRef.current) return;
    currentSrcRef.current = src;

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = false;
      audioRef.current.volume = volume;
      audioRef.current.crossOrigin = 'anonymous';

      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime ?? 0);
      });
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration ?? 0);
        setAudioError(null);
      });
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
      });
      audioRef.current.addEventListener('play', () => setIsPlaying(true));
      audioRef.current.addEventListener('pause', () => setIsPlaying(false));
      audioRef.current.addEventListener('error', () => {
        setAudioError('Could not load audio file');
        setHasAudio(false);
      });
      audioRef.current.addEventListener('canplay', () => {
        setAudioError(null);
      });
    }

    audioRef.current.src = src;
    audioRef.current.load();
    setHasAudio(true);
    setAudioError(null);
  }, [volume]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !hasAudio) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        setAudioError(err?.message ?? 'Could not play audio');
      });
    }
  }, [hasAudio, isPlaying]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  return (
    <MusicContext.Provider
      value={{ isPlaying, currentTime, duration, volume, hasAudio, audioError, togglePlay, seek, setVolume, registerAudio }}
    >
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic(): MusicState {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within MusicProvider');
  return ctx;
}
