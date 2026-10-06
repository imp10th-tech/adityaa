import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SectionDivider } from '@/components/SectionDivider';
import { Particles } from '@/components/Particles';
import { HYDERABAD_FALLBACK } from '@/data/content';
import { fetchSiteSettings, getSetting } from '@/lib/queries';
import type { SiteSettings } from '@/lib/queries';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const LOCATIONS = ['KPHB', 'Charminar', 'Old City', 'Gachibowli', 'Hitech City', 'Banjara Hills'];

export function Hyderabad() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const reduced = useReducedMotion();
  const [settings, setSettings] = useState<SiteSettings>({});

  useEffect(() => {
    fetchSiteSettings().then(setSettings).catch(() => {});
  }, []);

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  const headingTop = getSetting(settings, 'hyderabad_heading_top', HYDERABAD_FALLBACK.headingTop);
  const headingMain = getSetting(settings, 'hyderabad_heading_main', HYDERABAD_FALLBACK.headingMain);
  const tagline = getSetting(settings, 'hyderabad_tagline', HYDERABAD_FALLBACK.tagline);
  const bgImage = getSetting(settings, 'hyderabad_bg_image', HYDERABAD_FALLBACK.bgImage);

  return (
    <section
      id="hyderabad"
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-katana-black"
    >
      <motion.div className="absolute inset-0" style={reduced ? {} : { y, scale }}>
        <img src={bgImage} alt="Hyderabad" className="w-full h-full object-cover opacity-30" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-katana-black/80 via-katana-black/50 to-katana-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-katana-black/60 via-transparent to-katana-black/60" />
      </motion.div>

      <div className="absolute inset-0 bg-grain opacity-30 pointer-events-none" />
      <Particles count={25} color="rgba(212,175,55,0.3)" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        {LOCATIONS.map((loc, i) => (
          <motion.span
            key={loc}
            className="absolute font-display font-700 text-katana-silver/5 text-6xl md:text-9xl tracking-widest whitespace-nowrap"
            style={{ top: `${15 + i * 12}%`, left: `${(i * 17) % 80}%` }}
            animate={reduced ? {} : { opacity: [0.03, 0.08, 0.03] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
          >
            {loc}
          </motion.span>
        ))}
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <ScrollReveal>
          <p className="font-cinematic text-katana-gold/60 text-sm tracking-[0.4em] uppercase mb-2">
            KPHB Territory
          </p>
          <h2 className="font-display font-700 text-katana-bone text-3xl sm:text-4xl md:text-7xl tracking-[0.05em] text-glow-crimson leading-tight">
            {headingTop}
          </h2>
          <h3 className="font-display font-700 text-katana-crimson text-2xl sm:text-3xl md:text-5xl tracking-[0.1em] uppercase mt-2 text-glow-crimson">
            {headingMain}
          </h3>
          <p className="mt-6 font-cinematic italic text-katana-silver/70 text-lg md:text-xl max-w-2xl mx-auto">
            "{tagline}"
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
