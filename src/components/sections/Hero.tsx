import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, ChevronDown, Volume2 } from 'lucide-react';
import { SmokeLayer } from '@/components/SmokeLayer';
import { Particles } from '@/components/Particles';
import { HERO_FALLBACK } from '@/data/content';
import { fetchSiteSettings, getSetting } from '@/lib/queries';
import type { SiteSettings } from '@/lib/queries';
import { useMusic } from '@/context/MusicContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function Hero() {
  const { togglePlay, isPlaying, hasAudio } = useMusic();
  const reduced = useReducedMotion();
  const [settings, setSettings] = useState<SiteSettings>({});

  useEffect(() => {
    fetchSiteSettings().then(setSettings).catch(() => {});
  }, []);

  const title = getSetting(settings, 'hero_title', HERO_FALLBACK.title);
  const subtitle = getSetting(settings, 'hero_subtitle', HERO_FALLBACK.subtitle);
  const tagline = getSetting(settings, 'hero_tagline', HERO_FALLBACK.tagline);
  const bgImage = getSetting(settings, 'hero_bg_image', HERO_FALLBACK.bgImage);
  const faviconUrl = getSetting(settings, 'site_favicon', '');

  useEffect(() => {
    if (faviconUrl) {
      const link = document.getElementById('favicon-link') as HTMLLinkElement | null;
      if (link) {
        link.href = faviconUrl;
        link.type = 'image/png';
      }
    }
  }, [faviconUrl]);

  const scrollToLegend = () => {
    document.getElementById('legend')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-katana-black"
    >
      <div className="absolute inset-0">
        <img src={bgImage} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-katana-black/80 via-katana-black/60 to-katana-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-katana-black/70 via-transparent to-katana-black/70" />
      </div>

      <SmokeLayer />
      <Particles count={30} />

      <div className="absolute inset-0 bg-grain opacity-40 pointer-events-none" />
      <div className="absolute inset-0 scratch-overlay opacity-20 pointer-events-none" />

      <div className="relative z-10 text-center px-4 max-w-5xl">
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <p className="font-cinematic text-katana-gold/70 text-sm md:text-base tracking-[0.5em] uppercase mb-4">
            The Legend of
          </p>
        </motion.div>

        <motion.h1
          initial={reduced ? {} : { opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-700 text-katana-bone text-5xl sm:text-7xl md:text-9xl tracking-[0.05em] text-glow-crimson leading-none"
        >
          {title}
        </motion.h1>

        <motion.div
          initial={reduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-6"
        >
          <p className="font-display text-katana-crimson text-xl md:text-3xl tracking-[0.3em] uppercase text-glow-crimson">
            {subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={reduced ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-8"
        >
          <p className="font-cinematic italic text-katana-silver/80 text-base md:text-xl tracking-wide max-w-2xl mx-auto">
            "{tagline}"
          </p>
        </motion.div>

        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <button
            onClick={scrollToLegend}
            className="group relative px-8 py-4 font-display uppercase tracking-[0.2em] text-sm text-katana-bone border-2 border-katana-crimson bg-katana-crimson/10 hover:bg-katana-crimson/30 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Enter the Darbar</span>
            <div className="absolute inset-0 bg-gradient-to-r from-katana-blood to-katana-crimson opacity-0 group-hover:opacity-20 transition-opacity" />
          </button>

          <button
            onClick={togglePlay}
            disabled={!hasAudio}
            className="group flex items-center gap-3 px-8 py-4 font-display uppercase tracking-[0.2em] text-sm text-katana-silver border-2 border-katana-silver/30 hover:border-katana-gold hover:text-katana-gold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPlaying ? (
              <><Volume2 className="w-5 h-5" /> Pause Anthem</>
            ) : (
              <><Play className="w-5 h-5" /> Play the Anthem</>
            )}
          </button>
        </motion.div>

        {!hasAudio && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="mt-4 text-katana-silver/40 text-xs font-body tracking-wider"
          >
            Anthem loading, miya... upload it from the admin panel.
          </motion.p>
        )}
      </div>

      <motion.button
        onClick={scrollToLegend}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-katana-silver/40 hover:text-katana-crimson transition-colors"
        aria-label="Scroll down"
      >
        <motion.div
          animate={reduced ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </motion.button>
    </section>
  );
}
