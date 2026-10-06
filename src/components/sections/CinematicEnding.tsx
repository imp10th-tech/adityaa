import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Skull, Crown, Zap, Heart, Shield, Music } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { supabase } from '@/lib/supabase';

type EndingPhase = 'fade' | 'spotlight' | 'icons' | 'portrait' | 'whispers' | 'title' | 'done';

export function CinematicEnding({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<EndingPhase>('fade');
  const reduced = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (reduced) {
      onComplete();
      return;
    }

    const timers: number[] = [];
    timers.push(window.setTimeout(() => setPhase('spotlight'), 800));
    timers.push(window.setTimeout(() => setPhase('icons'), 2200));
    timers.push(window.setTimeout(() => setPhase('portrait'), 5200));
    timers.push(window.setTimeout(() => setPhase('whispers'), 6200));
    timers.push(window.setTimeout(() => setPhase('title'), 9200));
    timers.push(window.setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 16000));

    return () => timers.forEach(clearTimeout);
  }, [onComplete, reduced]);

  useEffect(() => {
    if (phase === 'spotlight' && !reduced) {
      // Try to play ambient music from settings
      fetchSiteSettingsForEnding().then((url) => {
        if (url) {
          const audio = new Audio(url);
          audio.volume = 0.3;
          audio.loop = true;
          audio.play().catch(() => {});
          audioRef.current = audio;
        }
      });
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [phase, reduced]);

  if (reduced) return null;

  const iconSet = [
    { Icon: Swords, delay: 0, color: 'text-katana-crimson' },
    { Icon: Skull, delay: 0.1, color: 'text-katana-bone/70' },
    { Icon: Crown, delay: 0.2, color: 'text-katana-gold' },
    { Icon: Zap, delay: 0.3, color: 'text-katana-crimson/80' },
    { Icon: Heart, delay: 0.4, color: 'text-katana-blood/80' },
    { Icon: Shield, delay: 0.5, color: 'text-katana-silver/60' },
  ];

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-katana-black flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Grain overlay */}
          <div className="absolute inset-0 bg-grain opacity-40 pointer-events-none" />

          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(circle at 50% 50%, rgba(200,16,46,0.05) 0%, rgba(5,2,4,1) 60%)',
                'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.05) 0%, rgba(5,2,4,1) 60%)',
                'radial-gradient(circle at 50% 50%, rgba(200,16,46,0.08) 0%, rgba(5,2,4,1) 60%)',
              ],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />

          {/* Spotlight effect */}
          {(phase === 'spotlight' || phase === 'icons' || phase === 'portrait' || phase === 'title') && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.08) 0%, rgba(200,16,46,0.05) 15%, rgba(0,0,0,1) 50%)',
              }}
            >
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(200,16,46,0.08) 30%, transparent 70%)',
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
          )}

          {/* Icon constellation phase */}
          {phase === 'icons' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 flex flex-wrap items-center justify-center gap-6 md:gap-10 max-w-2xl px-4"
            >
              {iconSet.map(({ Icon, delay, color }, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ delay, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                  className="relative"
                >
                  <motion.div
                    animate={{
                      y: [0, -12, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: delay + 0.6 }}
                    className={`relative ${color}`}
                  >
                    <Icon className="w-8 h-8 md:w-12 md:h-12" />
                    <motion.div
                      className={`absolute inset-0 blur-lg ${color} opacity-40`}
                      animate={{ opacity: [0.2, 0.5, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity, delay }}
                    >
                      <Icon className="w-8 h-8 md:w-12 md:h-12" />
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
              {/* Music note at center */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                className="absolute"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Music className="w-6 h-6 md:w-8 md:h-8 text-katana-gold/60" />
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* Portrait reveal with orbiting icons */}
          {phase === 'portrait' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 text-center"
            >
              <div className="relative inline-block">
                <div className="absolute -inset-4 bg-katana-crimson/20 blur-2xl rounded-full" />
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-katana-gold/40 overflow-hidden mx-auto">
                  <div className="w-full h-full bg-gradient-to-b from-katana-crimson/30 to-katana-black flex items-center justify-center">
                    <Swords className="w-16 h-16 md:w-20 md:h-20 text-katana-gold/60" />
                  </div>
                </div>
                {/* Orbiting icons around portrait */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                >
                  {[Swords, Crown, Skull].map((Icon, i) => {
                    const angle = (i * 120) * (Math.PI / 180);
                    const r = 90;
                    const x = Math.cos(angle) * r;
                    const y = Math.sin(angle) * r;
                    return (
                      <div
                        key={i}
                        className="absolute top-1/2 left-1/2"
                        style={{ transform: `translate(${x}px, ${y}px) translate(-50%, -50%)` }}
                      >
                        <motion.div
                          animate={{ rotate: -360 }}
                          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        >
                          <Icon className="w-5 h-5 md:w-7 md:h-7 text-katana-gold/50" />
                        </motion.div>
                      </div>
                    );
                  })}
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Whispers phase — small lines appear first, then vanish */}
          {phase === 'whispers' && (
            <motion.div
              className="relative z-10 text-center px-4"
            >
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="font-cinematic italic text-katana-silver/60 text-lg md:text-2xl mb-4"
              >
                Inka em chustunnav bawa... website motham chusesav.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="font-cinematic italic text-katana-crimson/70 text-lg md:text-2xl"
              >
                Ippudu nuvvu mana gang lo okadive!
              </motion.p>
            </motion.div>
          )}

          {/* Giant title slam with icons */}
          {phase === 'title' && (
            <motion.div
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0, 0.8, 0.2, 1] }}
              className="relative z-10 text-center px-4"
            >
              {/* Icons above title */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex items-center justify-center gap-3 mb-4"
              >
                {iconSet.slice(0, 4).map(({ Icon, color }, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                  >
                    <Icon className={`w-5 h-5 md:w-7 md:h-7 ${color}`} />
                  </motion.div>
                ))}
              </motion.div>

              <motion.h1
                className="font-display font-700 text-katana-bone text-4xl md:text-7xl lg:text-8xl tracking-[0.05em] text-glow-crimson leading-tight"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(200,16,46,0.8), 0 0 60px rgba(200,16,46,0.5)',
                    '0 0 40px rgba(212,175,55,0.6), 0 0 80px rgba(200,16,46,0.4)',
                    '0 0 20px rgba(200,16,46,0.8), 0 0 60px rgba(200,16,46,0.5)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ADITYA
                <br />
                KPHB KATANA
                <br />
                <span className="text-katana-crimson text-3xl md:text-6xl lg:text-7xl">ANTARA BABUUUU!</span>
              </motion.h1>

              {/* Icons below title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex items-center justify-center gap-3 mt-4"
              >
                {iconSet.slice(2).map(({ Icon, color }, i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  >
                    <Icon className={`w-5 h-5 md:w-7 md:h-7 ${color}`} />
                  </motion.div>
                ))}
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                onClick={() => {
                  if (audioRef.current) audioRef.current.pause();
                  setPhase('done');
                  onComplete();
                }}
                className="mt-10 px-8 py-3 font-display uppercase tracking-[0.2em] text-sm text-katana-bone border-2 border-katana-crimson bg-katana-crimson/10 hover:bg-katana-crimson/30 transition-all rounded-sm"
              >
                Replay Ending
              </motion.button>
            </motion.div>
          )}

          {/* Skip button */}
          <button
            onClick={() => {
              if (audioRef.current) audioRef.current.pause();
              setPhase('done');
              onComplete();
            }}
            className="absolute bottom-8 right-8 text-katana-silver/30 hover:text-katana-crimson text-sm font-body tracking-widest uppercase transition-colors z-20"
          >
            Skip →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

async function fetchSiteSettingsForEnding(): Promise<string | null> {
  try {
    const { data } = await supabase.from('site_settings').select('key, value').eq('key', 'anthem_audio_url').single();
    return data?.value || null;
  } catch {
    return null;
  }
}
