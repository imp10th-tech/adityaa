import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Music } from 'lucide-react';
import { RAP_FALLBACK } from '@/data/content';
import { fetchSiteSettings, getSetting, fetchSongLyrics } from '@/lib/queries';
import type { SiteSettings } from '@/lib/queries';
import { ANTHEM_FALLBACK } from '@/data/content';

const SECTION_PATTERN = /^\[.+\]$/;

export function LyricsPage() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [lyrics, setLyrics] = useState<string[]>(RAP_FALLBACK);

  useEffect(() => {
    fetchSiteSettings().then(setSettings).catch(() => {});
    fetchSongLyrics().then(setLyrics).catch(() => {});
  }, []);

  const songTitle = getSetting(settings, 'anthem_song_title', ANTHEM_FALLBACK.songTitle);
  const artist = getSetting(settings, 'anthem_artist', ANTHEM_FALLBACK.artist);

  let lyricIndex = 0;

  return (
    <div className="min-h-screen bg-katana-black text-katana-bone relative overflow-hidden">
      <div className="absolute inset-0 bg-grain opacity-30 pointer-events-none" />
      <motion.div
        className="absolute top-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-katana-crimson/5 blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-16">
        <a
          href="#"
          className="inline-flex items-center gap-2 text-katana-silver/50 hover:text-katana-crimson text-sm font-body tracking-wider uppercase transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Site
        </a>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Music className="w-10 h-10 text-katana-crimson/40 mx-auto mb-4" />
          <h1 className="font-display font-700 text-katana-bone text-3xl md:text-5xl tracking-[0.05em] text-glow-crimson">
            {songTitle}
          </h1>
          <p className="font-cinematic text-katana-gold/60 text-sm md:text-base tracking-[0.3em] uppercase mt-2">
            {artist}
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-katana-crimson/40" />
            <div className="w-2 h-2 bg-katana-crimson/40 rotate-45" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-katana-crimson/40" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-1"
        >
          {lyrics.map((line, i) => {
            if (line.trim() === '') {
              return <div key={i} className="h-4" />;
            }

            if (SECTION_PATTERN.test(line.trim())) {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center gap-4 pt-8 pb-2"
                >
                  <div className="h-px w-12 bg-katana-crimson/30" />
                  <span className="font-display text-katana-gold/70 text-sm tracking-[0.3em] uppercase">
                    {line.trim().replace(/^\[|\]$/g, '')}
                  </span>
                  <div className="h-px w-12 bg-katana-crimson/30" />
                </motion.div>
              );
            }

            const idx = lyricIndex++;
            return (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(idx * 0.02, 1) }}
                className={`font-cinematic text-base md:text-lg leading-relaxed text-center ${
                  idx % 2 === 0 ? 'text-katana-bone' : 'text-katana-crimson/80'
                }`}
              >
                {line}
              </motion.p>
            );
          })}
        </motion.div>

        <div className="mt-16 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-20 bg-katana-crimson/20" />
            <div className="w-1.5 h-1.5 bg-katana-crimson/30 rotate-45" />
            <div className="h-px w-20 bg-katana-crimson/20" />
          </div>
          <p className="font-body text-katana-silver/30 text-xs tracking-[0.2em] uppercase">
            KPHB KATANA — The Legend of KPHB
          </p>
        </div>
      </div>
    </div>
  );
}
