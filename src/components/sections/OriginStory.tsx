import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SectionDivider } from '@/components/SectionDivider';
import { Particles } from '@/components/Particles';
import { ORIGIN_FALLBACK, ORIGIN_FALLBACK_HEADING, type TimelineChapter } from '@/data/content';
import { fetchSiteSettings, getSetting, fetchOriginStory } from '@/lib/queries';
import type { SiteSettings } from '@/lib/queries';

export function OriginStory() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [chapters, setChapters] = useState<TimelineChapter[]>(ORIGIN_FALLBACK);

  useEffect(() => {
    fetchSiteSettings().then(setSettings).catch(() => {});
    fetchOriginStory().then(setChapters).catch(() => {});
  }, []);

  const heading = getSetting(settings, 'origin_heading', ORIGIN_FALLBACK_HEADING);

  return (
    <section
      id="origin"
      className="relative py-24 px-4 bg-gradient-to-b from-katana-black via-katana-coal to-katana-black overflow-hidden"
    >
      <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none" />
      <Particles count={20} color="rgba(212,175,55,0.3)" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <ScrollReveal>
          <p className="text-center font-cinematic text-katana-gold/60 text-sm tracking-[0.4em] uppercase mb-2">
            The Origin Story
          </p>
          <h2 className="text-center font-display font-700 text-katana-bone text-3xl sm:text-4xl md:text-6xl tracking-[0.05em] text-glow-crimson">
            {heading}
          </h2>
        </ScrollReveal>

        <SectionDivider label="The Saga" />

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-katana-crimson/40 to-transparent" />

          <div className="space-y-16">
            {chapters.map((chapter, i) => {
              const isLeft = i % 2 === 0;
              return (
                <ScrollReveal key={chapter.chapter + i} direction={isLeft ? 'right' : 'left'}>
                  <div className={`relative flex items-center gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                      <div className="w-4 h-4 rounded-full bg-katana-crimson border-2 border-katana-black animate-glow-pulse" />
                    </div>
                    <div className={`ml-12 md:ml-0 md:w-1/2 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'} pr-4`}>
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="katana-border katana-border-glow rounded-sm p-6 bg-katana-coal/60 backdrop-blur-sm"
                      >
                        <p className="font-body text-xs uppercase tracking-[0.3em] text-katana-gold/50 mb-2">
                          {chapter.chapter}
                        </p>
                        <h3 className="font-display font-600 text-katana-crimson text-2xl md:text-3xl uppercase tracking-wide mb-3">
                          {chapter.title}
                        </h3>
                        <p className="font-cinematic italic text-katana-silver/80 text-sm md:text-base leading-relaxed">
                          {chapter.text}
                        </p>
                      </motion.div>
                    </div>
                    <div className="hidden md:block md:w-1/2" />
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
