import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Skull } from 'lucide-react';
import { Particles } from '@/components/Particles';
import { fetchSiteSettings, getSetting } from '@/lib/queries';
import type { SiteSettings } from '@/lib/queries';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: number): TimeLeft {
  const diff = target - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export function CountdownLaunch({ onLaunch }: { onLaunch: () => void }) {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    fetchSiteSettings().then(setSettings).catch(() => {});
  }, []);

  const launchDateStr = getSetting(settings, 'launch_date', '');
  const launchTitle = getSetting(settings, 'launch_title', 'KPHB KATANA');
  const launchSubtitle = getSetting(settings, 'launch_subtitle', 'The Legend is Coming Soon...');
  const launchMessage = getSetting(settings, 'launch_message', 'Arey miya, Katana aa raha hai. The Nawab of KPHB is preparing his grand entry. Mark your calendars.');
  const launchDate = launchDateStr ? new Date(launchDateStr).getTime() : 0;

  useEffect(() => {
    if (!launchDate) return;
    setTimeLeft(calcTimeLeft(launchDate));
    const interval = setInterval(() => {
      const tl = calcTimeLeft(launchDate);
      setTimeLeft(tl);
      if (launchDate - Date.now() <= 0) {
        clearInterval(interval);
        setLaunched(true);
        setTimeout(() => onLaunch(), 2500);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [launchDate, onLaunch]);

  if (!launchDate) {
    return null;
  }

  const units = [
    { label: 'Days', value: timeLeft?.days ?? 0 },
    { label: 'Hours', value: timeLeft?.hours ?? 0 },
    { label: 'Minutes', value: timeLeft?.minutes ?? 0 },
    { label: 'Seconds', value: timeLeft?.seconds ?? 0 },
  ];

  return (
    <div className="fixed inset-0 z-[9999] bg-katana-black flex items-center justify-center overflow-hidden">
      <Particles count={25} color="rgba(200,16,46,0.4)" />
      <div className="absolute inset-0 bg-grain opacity-30 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 20%, rgba(5,2,4,0.95) 100%)',
      }} />

      {/* Smoke layers */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-katana-crimson/6 blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full bg-katana-gold/4 blur-3xl"
        animate={{ scale: [1.3, 1, 1.3], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <AnimatePresence>
        {launched ? (
          <motion.div
            key="launched"
            initial={{ opacity: 0, scale: 2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0, 0.8, 0.2, 1] }}
            className="relative z-10 text-center px-4"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <div className="relative w-20 h-20 flex items-center justify-center">
                <Swords className="w-16 h-16 text-katana-crimson" />
                <Skull className="w-8 h-8 text-katana-bone/70 absolute" />
              </div>
            </motion.div>
            <motion.h1
              className="font-display font-700 text-katana-bone text-5xl md:text-8xl tracking-[0.1em] text-glow-crimson"
              animate={{
                textShadow: [
                  '0 0 20px rgba(200,16,46,0.8), 0 0 60px rgba(200,16,46,0.5)',
                  '0 0 40px rgba(212,175,55,0.6), 0 0 80px rgba(200,16,46,0.4)',
                  '0 0 20px rgba(200,16,46,0.8), 0 0 60px rgba(200,16,46,0.5)',
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              WE ARE LIVE!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-cinematic italic text-katana-crimson text-xl md:text-3xl mt-4"
            >
              Katana aa gaya, miya!
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center px-4 max-w-4xl"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              className="inline-block mb-6"
            >
              <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                <Swords className="w-12 h-12 md:w-16 md:h-16 text-katana-crimson" />
                <Skull className="w-6 h-6 md:w-8 md:h-8 text-katana-bone/70 absolute" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="font-display font-700 text-katana-bone text-4xl md:text-7xl tracking-[0.1em] text-glow-crimson"
            >
              {launchTitle}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-cinematic italic text-katana-crimson text-lg md:text-2xl mt-3 tracking-wider"
            >
              {launchSubtitle}
            </motion.p>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="flex items-center justify-center gap-4 my-8"
            >
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-katana-crimson/40" />
              <div className="w-2 h-2 bg-katana-crimson/40 rotate-45" />
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-katana-crimson/40" />
            </motion.div>

            {/* Countdown timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="grid grid-cols-4 gap-3 md:gap-6 max-w-2xl mx-auto"
            >
              {units.map((unit, i) => (
                <motion.div
                  key={unit.label}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
                  className="relative"
                >
                  <div className="katana-border rounded-sm p-3 md:p-6 bg-katana-coal/60 backdrop-blur-sm">
                    <motion.div
                      key={unit.value}
                      initial={{ scale: 1.2, opacity: 0.5 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="font-display font-700 text-katana-bone text-3xl md:text-6xl tabular-nums tracking-wider"
                    >
                      {String(unit.value).padStart(2, '0')}
                    </motion.div>
                    <p className="font-body text-katana-silver/40 text-[8px] md:text-xs uppercase tracking-widest mt-1">
                      {unit.label}
                    </p>
                  </div>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 text-katana-crimson/30 font-display text-2xl">
                      :
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Message */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="font-cinematic italic text-katana-silver/60 text-sm md:text-lg mt-8 max-w-xl mx-auto leading-relaxed"
            >
              "{launchMessage}"
            </motion.p>

            {/* Launch date display */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="font-body text-katana-gold/40 text-xs md:text-sm mt-6 tracking-widest uppercase"
            >
              Launch: {new Date(launchDate).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin link */}
      <a
        href="#admin"
        className="absolute bottom-6 right-6 text-katana-silver/20 hover:text-katana-crimson text-xs font-body tracking-widest uppercase transition-colors z-20"
      >
        Admin
      </a>
    </div>
  );
}
