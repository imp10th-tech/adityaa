import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SectionDivider } from '@/components/SectionDivider';
import { SmokeLayer } from '@/components/SmokeLayer';
import { DynamicIcon } from '@/components/DynamicIcon';
import { CHAR_STATS_FALLBACK, STATS_FALLBACK, type CharStat } from '@/data/content';
import { fetchSiteSettings, getSetting, fetchCharStats } from '@/lib/queries';
import type { SiteSettings } from '@/lib/queries';

function StatBar({ stat, index }: { stat: CharStat; index: number }) {
  const pct = (stat.value / stat.max) * 100;
  const isMaxed = stat.value >= stat.max;

  return (
    <ScrollReveal delay={index * 0.08}>
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-sm bg-katana-crimson/10 border border-katana-crimson/30 flex items-center justify-center">
          <DynamicIcon name={stat.icon} className="w-5 h-5 text-katana-crimson" />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-display text-katana-bone text-sm md:text-base uppercase tracking-wide">{stat.name}</span>
            <span className={`font-display text-sm tabular-nums ${isMaxed ? 'text-katana-gold' : 'text-katana-silver/60'}`}>
              {stat.value}/{stat.max}
              {isMaxed && <span className="ml-1 text-katana-gold text-xs">MAX</span>}
            </span>
          </div>
          <div className="relative h-3 bg-katana-ash/60 rounded-sm overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`h-full rounded-sm ${isMaxed ? 'bg-gradient-to-r from-katana-gold to-katana-crimson' : 'bg-gradient-to-r from-katana-blood to-katana-crimson'}`}
            >
              <div className="absolute inset-0 bg-grain opacity-30" />
            </motion.div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

export function CharacterStats() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [stats, setStats] = useState<CharStat[]>(CHAR_STATS_FALLBACK);

  useEffect(() => {
    fetchSiteSettings().then(setSettings).catch(() => {});
    fetchCharStats().then(setStats).catch(() => {});
  }, []);

  const heading = getSetting(settings, 'stats_heading', STATS_FALLBACK.heading);
  const subheading = getSetting(settings, 'stats_subheading', STATS_FALLBACK.subheading);

  const overallLevel = Math.round(stats.reduce((sum, s) => sum + (s.value / s.max) * 100, 0) / stats.length);

  return (
    <section
      id="stats"
      className="relative py-24 px-4 bg-katana-black overflow-hidden"
    >
      <SmokeLayer />
      <div className="absolute inset-0 bg-grain opacity-25 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <ScrollReveal>
          <p className="text-center font-cinematic text-katana-gold/60 text-sm tracking-[0.4em] uppercase mb-2">
            {subheading}
          </p>
          <h2 className="text-center font-display font-700 text-katana-bone text-3xl sm:text-4xl md:text-6xl tracking-[0.05em] text-glow-crimson">
            {heading}
          </h2>
        </ScrollReveal>

        <SectionDivider label="Level Up" />

        {/* Level badge */}
        <ScrollReveal delay={0.1}>
          <div className="flex items-center justify-center mb-10">
            <div className="relative">
              <div className="absolute -inset-2 bg-katana-crimson/20 rounded-full blur-lg" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-katana-crimson/30 to-katana-blood/10 border-2 border-katana-gold/40 flex flex-col items-center justify-center">
                <span className="font-display font-700 text-katana-gold text-3xl">{overallLevel}</span>
                <span className="font-body text-katana-silver/50 text-[10px] uppercase tracking-wider">Overall</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
          {stats.map((stat, i) => (
            <StatBar key={stat.name + i} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
