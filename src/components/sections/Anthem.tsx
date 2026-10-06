import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music, AlertCircle, Download, FileText } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SectionDivider } from '@/components/SectionDivider';
import { SmokeLayer } from '@/components/SmokeLayer';
import { useMusic } from '@/context/MusicContext';
import { ANTHEM_FALLBACK, RAP_FALLBACK } from '@/data/content';
import { fetchSiteSettings, getSetting, fetchSongLyrics } from '@/lib/queries';
import type { SiteSettings } from '@/lib/queries';

function formatTime(s: number): string {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export function Anthem() {
  const { isPlaying, currentTime, duration, volume, hasAudio, audioError, togglePlay, seek, setVolume, registerAudio } = useMusic();
  const [settings, setSettings] = useState<SiteSettings>({});
  const [lyrics, setLyrics] = useState<string[]>(RAP_FALLBACK);

  useEffect(() => {
    fetchSiteSettings().then(setSettings).catch(() => {});
    fetchSongLyrics().then(setLyrics).catch(() => {});
  }, []);

  const title = getSetting(settings, 'anthem_title', ANTHEM_FALLBACK.title);
  const subtitle = getSetting(settings, 'anthem_subtitle', ANTHEM_FALLBACK.subtitle);
  const songTitle = getSetting(settings, 'anthem_song_title', ANTHEM_FALLBACK.songTitle);
  const artist = getSetting(settings, 'anthem_artist', ANTHEM_FALLBACK.artist);
  const audioUrl = getSetting(settings, 'anthem_audio_url', ANTHEM_FALLBACK.audioUrl);
  const albumArt = getSetting(settings, 'anthem_album_art', ANTHEM_FALLBACK.albumArt);

  useEffect(() => {
    if (audioUrl) {
      registerAudio(audioUrl);
    }
  }, [audioUrl, registerAudio]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleDownload = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `${songTitle || 'katana-anthem'}.mp3`;
    a.target = '_blank';
    a.click();
  };

  const openLyricsPage = () => {
    window.location.hash = 'lyrics';
  };

  return (
    <section
      id="anthem"
      className="relative py-24 px-4 bg-katana-black overflow-hidden"
    >
      <SmokeLayer />
      <div className="absolute inset-0 bg-grain opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <ScrollReveal>
          <p className="text-center font-cinematic text-katana-gold/60 text-sm tracking-[0.4em] uppercase mb-2">
            The Official Anthem
          </p>
          <h2 className="text-center font-display font-700 text-katana-bone text-3xl sm:text-4xl md:text-6xl tracking-[0.05em] text-glow-crimson">
            {title}
          </h2>
          <p className="text-center mt-3 font-cinematic italic text-katana-crimson text-lg md:text-xl">
            "{subtitle}"
          </p>
        </ScrollReveal>

        <SectionDivider />

        <ScrollReveal delay={0.2}>
          <div className="katana-border rounded-sm p-6 md:p-10 bg-katana-coal/60 backdrop-blur-sm">
            <div className="grid md:grid-cols-[280px_1fr] gap-8 items-center">
              {/* Album art with enhanced playing animation */}
              <div className="relative group mx-auto">
                {/* Pulsing rings when playing */}
                {isPlaying && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-full border border-katana-crimson/20"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full border border-katana-gold/15"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                    />
                  </>
                )}
                <motion.div
                  animate={isPlaying ? { rotate: 360 } : {}}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="relative w-56 h-56 md:w-full md:h-64 rounded-sm overflow-hidden katana-border"
                >
                  {albumArt ? (
                    <img src={albumArt} alt="Album art" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-katana-crimson/30 via-katana-black to-katana-blood/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Music className="w-20 h-20 text-katana-crimson/40" />
                      </div>
                      <div className="absolute inset-0 bg-grain opacity-40" />
                    </>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center bg-katana-black/60">
                    <p className="font-display text-katana-bone/80 text-xs uppercase tracking-[0.2em]">
                      {artist}
                    </p>
                  </div>
                </motion.div>

                {/* Equalizer bars */}
                {isPlaying && (
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1 items-end h-8">
                    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-katana-crimson rounded-sm"
                        animate={{
                          height: [`${8 + i * 2}px`, `${20 + Math.random() * 20}px`, `${10 + i * 2}px`],
                        }}
                        transition={{ duration: 0.4 + i * 0.08, repeat: Infinity, delay: i * 0.06 }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Player controls */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-600 text-katana-bone text-2xl md:text-3xl uppercase tracking-wide">
                    {songTitle}
                  </h3>
                  <p className="font-body text-katana-silver/50 text-sm mt-1">{artist}</p>
                </div>

                <div>
                  <div
                    className={`relative h-1.5 bg-katana-ash rounded-full overflow-hidden ${
                      hasAudio ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                    }`}
                    onClick={(e) => {
                      if (!hasAudio || !duration) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const pct = (e.clientX - rect.left) / rect.width;
                      seek(pct * duration);
                    }}
                  >
                    <div
                      className="h-full bg-gradient-to-r from-katana-blood to-katana-crimson"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 font-body text-xs text-katana-silver/50 tabular-nums">
                    <span>{formatTime(currentTime)}</span>
                    <span>{hasAudio ? formatTime(duration) : '--:--'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <button
                    onClick={togglePlay}
                    disabled={!hasAudio}
                    className="flex items-center justify-center w-14 h-14 rounded-full bg-katana-crimson/20 border-2 border-katana-crimson text-katana-crimson hover:bg-katana-crimson/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                  </button>

                  <div className="flex items-center gap-3 flex-1 min-w-[120px]">
                    <button
                      onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
                      className="text-katana-silver/60 hover:text-katana-crimson transition-colors"
                      aria-label="Mute toggle"
                    >
                      {volume > 0 ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                    </button>
                    <input
                      type="range" min="0" max="1" step="0.05" value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="flex-1 accent-katana-crimson h-1"
                      aria-label="Volume"
                    />
                  </div>

                  {/* Download button */}
                  {hasAudio && audioUrl && (
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-display uppercase tracking-wider text-katana-silver/60 hover:text-katana-gold border border-katana-silver/15 hover:border-katana-gold/40 rounded-sm transition-all"
                      title="Download anthem"
                    >
                      <Download className="w-4 h-4" /> Download
                    </button>
                  )}
                </div>

                {/* Lyrics page link */}
                <button
                  onClick={openLyricsPage}
                  className="flex items-center gap-2 text-sm font-body text-katana-silver/40 hover:text-katana-crimson transition-colors"
                >
                  <FileText className="w-4 h-4" /> View Full Lyrics Page
                </button>

                {audioError && (
                  <div className="text-center py-4 border border-katana-crimson/20 rounded-sm bg-katana-crimson/10 flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4 text-katana-crimson flex-shrink-0" />
                    <p className="font-body text-katana-crimson text-sm">{audioError}</p>
                  </div>
                )}

                {!hasAudio && !audioError && (
                  <div className="text-center py-4 border border-katana-silver/10 rounded-sm bg-katana-ash/30">
                    <p className="font-cinematic italic text-katana-silver/50 text-sm">
                      Anthem loading, miya...
                    </p>
                    <p className="font-body text-katana-silver/30 text-xs mt-1">
                      Upload an audio file from the admin panel to activate the player.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
