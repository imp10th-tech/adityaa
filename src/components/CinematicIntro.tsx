import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Skull, Volume2 } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type IntroPhase =
  | 'black'
  | 'flicker'
  | 'crack'
  | 'smoke'
  | 'whisper1'
  | 'whisper2'
  | 'energy'
  | 'slash'
  | 'slam'
  | 'burn'
  | 'glitch'
  | 'done';

export function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<IntroPhase>('black');
  const reduced = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(
      'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='
    );
    audio.volume = 0.001;
    audio.play().catch(() => {});
    audioRef.current = audio;

    if (reduced) {
      onComplete();
      return;
    }

    const timers: number[] = [];
    timers.push(window.setTimeout(() => setPhase('flicker'), 500));
    timers.push(window.setTimeout(() => setPhase('crack'), 1400));
    timers.push(window.setTimeout(() => setPhase('smoke'), 2400));
    timers.push(window.setTimeout(() => setPhase('whisper1'), 3600));
    timers.push(window.setTimeout(() => setPhase('whisper2'), 5600));
    timers.push(window.setTimeout(() => setPhase('energy'), 7400));
    timers.push(window.setTimeout(() => setPhase('slash'), 8800));
    timers.push(window.setTimeout(() => setPhase('slam'), 9600));
    timers.push(window.setTimeout(() => setPhase('burn'), 11200));
    timers.push(window.setTimeout(() => setPhase('glitch'), 12600));
    timers.push(window.setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 13800));

    return () => timers.forEach(clearTimeout);
  }, [onComplete, reduced]);

  if (reduced) return null;

  const showSmoke = phase === 'smoke' || phase === 'whisper1' || phase === 'whisper2' || phase === 'energy' || phase === 'slash' || phase === 'slam' || phase === 'burn' || phase === 'glitch';

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-katana-black flex items-center justify-center overflow-hidden bg-grain"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6 }}
        >
          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(5,2,4,0.9) 100%)',
          }} />

          {/* Smoke layers */}
          {showSmoke && (
            <>
              <motion.div
                className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-katana-crimson/8 blur-3xl"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: [0, 0.7, 0.5], scale: [0.3, 1.8, 1.5] }}
                transition={{ duration: 4 }}
              />
              <motion.div
                className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full bg-katana-blood/8 blur-3xl"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: [0, 0.6, 0.4], scale: [0.3, 1.5, 1.3] }}
                transition={{ duration: 4.5 }}
              />
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-katana-gold/5 blur-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0.2] }}
                transition={{ duration: 3, delay: 1 }}
              />
            </>
          )}

          {/* Phase: Flicker — old TV turning on */}
          {phase === 'flicker' && (
            <motion.div
              className="absolute inset-0 bg-katana-black"
              animate={{
                opacity: [1, 0.3, 1, 0.5, 1, 0.2, 1, 0.6, 1],
              }}
              transition={{ duration: 0.6, times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 1] }}
            />
          )}

          {/* Phase: Crack — screen cracks from center */}
          {phase === 'crack' && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0.5] }}
              transition={{ duration: 0.7 }}
            >
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                <motion.path
                  d="M50 50 L50 20 M50 50 L70 25 M50 50 L30 30 M50 50 L75 55 M50 50 L25 60 M50 50 L60 80 M50 50 L40 85 M50 50 L80 40 M50 50 L20 45"
                  stroke="rgba(200,16,46,0.8)"
                  strokeWidth="0.15"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: [0, 1, 0.7] }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
                <motion.path
                  d="M50 20 L48 10 M70 25 L75 15 M30 30 L25 20 M75 55 L85 52 M25 60 L15 65 M60 80 L65 92 M40 85 L35 95 M80 40 L90 35 M20 45 L10 42"
                  stroke="rgba(200,16,46,0.4)"
                  strokeWidth="0.1"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                />
                <motion.circle
                  cx="50" cy="50" r="0.5"
                  fill="rgba(200,16,46,0.9)"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 8, 0] }}
                  transition={{ duration: 0.6 }}
                />
              </svg>
            </motion.div>
          )}

          {/* Phase: Whisper 1 — first text line, stays visible */}
          {phase === 'whisper1' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: [0, 1, 1], y: [30, 0, 0] }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-center relative z-10 px-4"
            >
              <motion.p
                className="font-cinematic italic text-2xl md:text-4xl text-katana-silver/70 tracking-wider"
              >
                Arey miya, aaj kuch alag hoga...
              </motion.p>
            </motion.div>
          )}

          {/* Phase: Whisper 2 — second line appears below, both stay */}
          {(phase === 'whisper2') && (
            <motion.div
              className="text-center relative z-10 px-4"
            >
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="font-cinematic italic text-2xl md:text-4xl text-katana-silver/70 tracking-wider mb-4"
              >
                Arey miya, aaj kuch alag hoga...
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="font-cinematic italic text-lg md:text-3xl text-katana-crimson/60 tracking-wider"
              >
                Katana aa raha hai...
              </motion.p>
            </motion.div>
          )}

          {/* Phase: Energy — converging lines + particle buildup */}
          {phase === 'energy' && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.1 }}
            >
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180;
                  const x = 50 + Math.cos(rad) * 45;
                  const y = 50 + Math.sin(rad) * 45;
                  return (
                    <motion.line
                      key={angle}
                      x1={x} y1={y} x2="50" y2="50"
                      stroke={i % 2 === 0 ? 'rgba(200,16,46,0.6)' : 'rgba(212,175,55,0.4)'}
                      strokeWidth="0.2"
                      strokeDasharray="2,1"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: [0, 0.8, 0] }}
                      transition={{ duration: 0.8, delay: i * 0.05 }}
                    />
                  );
                })}
                <motion.circle
                  cx="50" cy="50" r="3"
                  fill="none" stroke="rgba(200,16,46,0.6)" strokeWidth="0.2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1, 0.3], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8 }}
                />
              </svg>
              <motion.div
                className="absolute w-16 h-16 rounded-full bg-katana-crimson/20 blur-xl"
                animate={{ scale: [0, 3, 0.5], opacity: [0, 0.6, 0] }}
                transition={{ duration: 1 }}
              />
            </motion.div>
          )}

          {/* Phase: Slash — dual crisscross katana slashes */}
          {phase === 'slash' && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 1, 0] }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                className="absolute w-full h-2 bg-gradient-to-r from-transparent via-katana-crimson to-transparent"
                initial={{ scaleX: 0, opacity: 0, rotate: -5 }}
                animate={{ scaleX: 1, opacity: [0, 1, 0], rotate: -5 }}
                transition={{ duration: 0.35, ease: [0, 0.8, 0.2, 1] }}
                style={{ transformOrigin: 'left' }}
              />
              <motion.div
                className="absolute w-full h-1.5 bg-gradient-to-l from-transparent via-katana-gold to-transparent"
                initial={{ scaleX: 0, opacity: 0, rotate: 5 }}
                animate={{ scaleX: 1, opacity: [0, 0.7, 0], rotate: 5 }}
                transition={{ duration: 0.3, delay: 0.1, ease: [0, 0.8, 0.2, 1] }}
                style={{ transformOrigin: 'right' }}
              />
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-katana-gold rounded-full"
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: (Math.random() - 0.5) * 400,
                    y: (Math.random() - 0.5) * 300,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.02 }}
                />
              ))}
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.3, 0] }}
                transition={{ duration: 0.15, delay: 0.35 }}
              />
            </motion.div>
          )}

          {/* Phase: Slam — KPHB KATANA with screen shake + icons */}
          {phase === 'slam' && (
            <motion.div
              initial={{ scale: 4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0, 0.85, 0.2, 1] }}
              className="text-center relative z-10"
            >
              <motion.div
                animate={{
                  x: [0, -8, 6, -4, 3, 0],
                  y: [0, 4, -3, 2, -1, 0],
                }}
                transition={{ duration: 0.4, repeat: 2 }}
              >
                <motion.div
                  className="absolute -inset-24 bg-katana-crimson/10 blur-3xl rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <motion.div
                  className="absolute -inset-12 bg-katana-gold/5 blur-2xl rounded-full"
                  animate={{ scale: [1.3, 1, 1.3], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />

                {/* Skull + Swords icon with proper stacking */}
                <motion.div
                  initial={{ rotate: -270, opacity: 0, scale: 0 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                  className="inline-block mb-4 relative z-10"
                >
                  <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                        <Swords className="w-16 h-16 md:w-20 md:h-20 text-katana-crimson relative z-10" />
                        <Skull className="w-8 h-8 md:w-10 md:h-10 text-katana-bone/70 absolute z-20" />
                  </div>
                </motion.div>

                <motion.h1
                  className="font-display font-700 text-katana-bone text-5xl md:text-8xl tracking-[0.1em] text-glow-crimson relative z-10"
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(200,16,46,0.8), 0 0 40px rgba(200,16,46,0.5), 0 0 80px rgba(200,16,46,0.2)',
                      '0 0 10px rgba(200,16,46,0.4), 0 0 20px rgba(200,16,46,0.2)',
                      '0 0 30px rgba(200,16,46,1), 0 0 60px rgba(200,16,46,0.6), 0 0 100px rgba(200,16,46,0.3)',
                    ],
                  }}
                  transition={{ duration: 0.4, repeat: 3 }}
                >
                  KPHB KATANA
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, letterSpacing: '0.8em' }}
                  animate={{ opacity: 1, letterSpacing: '0.3em' }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="font-cinematic text-katana-silver/40 text-sm md:text-lg uppercase mt-2 relative z-10"
                >
                  Aditya urf Katana
                </motion.p>
              </motion.div>
            </motion.div>
          )}

          {/* Phase: Burn — hot brand effect with icons still visible */}
          {phase === 'burn' && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 0.9, 1, 0.8, 1] }}
              transition={{ duration: 1 }}
            >
              <div className="text-center relative z-10">
                <motion.div
                  className="absolute -inset-16 bg-gradient-radial from-katana-crimson/20 via-katana-blood/10 to-transparent blur-2xl"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
                {/* Icons remain visible during burn */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="inline-block mb-4 relative z-10"
                >
                  <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                    <Swords className="w-16 h-16 md:w-20 md:h-20 text-katana-crimson relative z-10" />
                    <Skull className="w-8 h-8 md:w-10 md:h-10 text-katana-bone/70 absolute z-20" />
                  </div>
                </motion.div>
                <motion.h1
                  className="font-display font-700 text-katana-bone text-5xl md:text-8xl tracking-[0.1em] relative z-10"
                  animate={{
                    color: ['#e8e2d5', '#ffd700', '#e8e2d5', '#c8102e', '#e8e2d5'],
                    textShadow: [
                      '0 0 20px rgba(200,16,46,0.6), 0 0 40px rgba(200,16,46,0.3)',
                      '0 0 30px rgba(255,215,0,0.8), 0 0 60px rgba(255,215,0,0.4), 0 0 100px rgba(200,16,46,0.3)',
                      '0 0 20px rgba(200,16,46,0.6), 0 0 40px rgba(200,16,46,0.3)',
                      '0 0 40px rgba(200,16,46,1), 0 0 80px rgba(200,16,46,0.6)',
                      '0 0 20px rgba(200,16,46,0.6), 0 0 40px rgba(200,16,46,0.3)',
                    ],
                  }}
                  transition={{ duration: 1, repeat: 1 }}
                >
                  KPHB KATANA
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="font-cinematic text-katana-silver/40 text-sm md:text-lg uppercase mt-2 relative z-10 tracking-[0.3em]"
                >
                  Aditya urf Katana
                </motion.p>
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-0.5 h-0.5 bg-katana-gold/60 rounded-full"
                    initial={{
                      x: (Math.random() - 0.5) * 300,
                      y: 0,
                      opacity: 0,
                    }}
                    animate={{
                      y: -150 - Math.random() * 100,
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                    }}
                    transition={{
                      duration: 1 + Math.random() * 0.5,
                      delay: i * 0.05,
                      repeat: 2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Phase: Glitch — RGB split exit with icons */}
          {phase === 'glitch' && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: [1, 0.7, 1, 0.5, 0.8, 0.3, 0] }}
              transition={{ duration: 1 }}
              className="text-center relative z-10"
            >
              {/* Icons during glitch */}
              <motion.div
                className="inline-block mb-4 relative"
                animate={{ x: [0, -3, 3, 0] }}
                transition={{ duration: 0.1, repeat: 8 }}
              >
                <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                  <Swords className="w-16 h-16 md:w-20 md:h-20 text-katana-crimson/80" />
                  <Skull className="w-8 h-8 md:w-10 md:h-10 text-katana-bone/50 absolute" />
                </div>
              </motion.div>
              <div className="relative">
                <motion.h1
                  className="font-display font-700 text-katana-bone text-5xl md:text-8xl tracking-[0.1em] text-glow-crimson relative"
                  animate={{
                    x: [0, -4, 3, -2, 0],
                    filter: ['blur(0px)', 'blur(1px)', 'blur(0px)'],
                  }}
                  transition={{ duration: 0.12, repeat: 6 }}
                >
                  KPHB KATANA
                </motion.h1>
                <motion.h1
                  className="font-display font-700 text-cyan-400/30 text-5xl md:text-8xl tracking-[0.1em] absolute inset-0"
                  animate={{ x: [0, 4, -3, 2, 0] }}
                  transition={{ duration: 0.12, repeat: 6 }}
                >
                  KPHB KATANA
                </motion.h1>
                <motion.h1
                  className="font-display font-700 text-katana-crimson/40 text-5xl md:text-8xl tracking-[0.1em] absolute inset-0"
                  animate={{ x: [0, -2, 3, -1, 0] }}
                  transition={{ duration: 0.15, repeat: 5 }}
                >
                  KPHB KATANA
                </motion.h1>
              </div>
              <motion.div
                className="absolute -inset-x-20 h-1 bg-katana-crimson/30"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 100, opacity: [0, 0.5, 0] }}
                transition={{ duration: 0.3, repeat: 3 }}
              />
            </motion.div>
          )}

          {/* Scanlines overlay throughout */}
          {(phase === 'slam' || phase === 'burn' || phase === 'glitch') && (
            <div
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(200,16,46,0.1) 2px, rgba(200,16,46,0.1) 3px)',
              }}
            />
          )}

          {/* Skip button */}
          <button
            onClick={() => {
              setPhase('done');
              onComplete();
            }}
            className="absolute bottom-6 right-6 text-katana-silver/30 hover:text-katana-crimson text-xs font-body tracking-widest uppercase transition-colors z-20"
          >
            Skip Intro →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
