import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SectionDivider } from '@/components/SectionDivider';
import { SmokeLayer } from '@/components/SmokeLayer';
import { DynamicIcon } from '@/components/DynamicIcon';
import { LEGEND_FALLBACK, CHARACTER_FALLBACK, type CharacterDetail } from '@/data/content';
import { fetchSiteSettings, getSetting, fetchCharacterDetails } from '@/lib/queries';
import type { SiteSettings } from '@/lib/queries';

export function Legend() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [details, setDetails] = useState<CharacterDetail[]>(CHARACTER_FALLBACK);

  useEffect(() => {
    fetchSiteSettings().then(setSettings).catch(() => {});
    fetchCharacterDetails().then(setDetails).catch(() => {});
  }, []);

  const headingTop = getSetting(settings, 'legend_heading_top', LEGEND_FALLBACK.headingTop);
  const headingMain = getSetting(settings, 'legend_heading_main', LEGEND_FALLBACK.headingMain);
  const quote = getSetting(settings, 'legend_quote', LEGEND_FALLBACK.quote);
  const portrait = getSetting(settings, 'legend_portrait', LEGEND_FALLBACK.portrait);

  return (
    <section
      id="legend"
      className="relative min-h-screen py-24 px-4 bg-katana-black overflow-hidden"
    >
      <SmokeLayer />
      <div className="absolute inset-0 bg-grain opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <ScrollReveal>
          <p className="text-center font-cinematic text-katana-gold/60 text-sm tracking-[0.4em] uppercase mb-2">
            The Legend
          </p>
          <h2 className="text-center font-display font-700 text-katana-bone text-3xl sm:text-4xl md:text-6xl tracking-[0.05em] text-glow-crimson mb-2">
            {headingTop}
          </h2>
          <h3 className="text-center font-display font-700 text-katana-crimson text-2xl sm:text-3xl md:text-5xl tracking-[0.1em] uppercase mb-4">
            {headingMain}
          </h3>
        </ScrollReveal>

        <SectionDivider />

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <ScrollReveal direction="right">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-b from-katana-crimson/30 to-transparent rounded-sm blur-md group-hover:from-katana-crimson/50 transition-all" />
              <div className="relative overflow-hidden rounded-sm katana-border">
                <img
                  src={portrait}
                  alt="KPHB Katana"
                  className="w-full h-auto object-cover grayscale contrast-125 brightness-75"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-katana-black via-transparent to-katana-black/30" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="font-cinematic italic text-katana-silver/80 text-sm md:text-lg">
                    "{quote}"
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div className="space-y-4">
            {details.map((detail, i) => {
              return (
                <ScrollReveal key={detail.label + i} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ x: 8, scale: 1.02 }}
                    className="katana-border katana-border-glow rounded-sm p-5 bg-katana-coal/50 backdrop-blur-sm transition-all relative overflow-hidden"
                  >
                    <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute -inset-x-full -top-1/2 h-full bg-gradient-to-r from-transparent via-katana-gold/5 to-transparent hover:translate-x-full transition-transform duration-1000" />
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-sm bg-katana-crimson/10 border border-katana-crimson/30 flex items-center justify-center">
                        <DynamicIcon name={detail.icon} className="w-5 h-5 text-katana-crimson" />
                      </div>
                      <div>
                        <p className="font-body text-xs uppercase tracking-[0.2em] text-katana-gold/60 mb-1">
                          {detail.label}
                        </p>
                        <p className="font-display text-katana-bone text-base md:text-lg">
                          {detail.value}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
